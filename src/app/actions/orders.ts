"use server";

import { supabase, getSupabaseAdmin } from "@/lib/supabase";
import { OrderStatus, PaymentStatus, HeldFundStatus } from "@/types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";


const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const COMMISSION_RATE = 0.075; // 7.5% commission rate (Sprint 4)

export async function createPendingOrder(data: {
  customer_id: string;
  seller_profile_id: string;
  store_id: string;
  total_amount: number;
  delivery_address: string;
  delivery_note?: string;
  items: {
    product_id: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
  }[];
}) {
  try {
    // 1. Create the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_id: data.customer_id,
        seller_profile_id: data.seller_profile_id,
        store_id: data.store_id,
        total_amount: data.total_amount,
        status: "pending",
        delivery_address: data.delivery_address,
        delivery_note: data.delivery_note,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Create order items
    const orderItems = data.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      subtotal: item.subtotal,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return { success: true, orderId: order.id };
  } catch (error: any) {
    console.error("Order Creation Error:", error);
    return { success: false, error: error.message };
  }
}

export async function verifyPayment(reference: string, orderId: string) {
  try {
    if (!PAYSTACK_SECRET_KEY) throw new Error("Paystack Secret Key not configured");

    // 1. Verify with Paystack
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    const result = await response.json();

    if (!result.status || result.data.status !== "success") {
      // Record failed payment
      const admin = getSupabaseAdmin();
      await admin.from("payments").insert({
        order_id: orderId,
        paystack_reference: reference,
        amount: result.data?.amount / 100 || 0,
        status: result.data?.status === "abandoned" ? "abandoned" : "failed",
      });
      
      return { success: false, status: result.data?.status || "failed" };
    }

    const amountPaid = result.data.amount / 100; // Paystack is in kobo
    const admin = getSupabaseAdmin();

    // 2. Start Transaction (Simulated via separate calls for this sprint)
    
    // a. Update Order Status
    const { error: orderUpdateError } = await admin
      .from("orders")
      .update({ status: "paid" })
      .eq("id", orderId);
    if (orderUpdateError) throw orderUpdateError;

    // b. Create Payment Record
    const { data: payment, error: paymentError } = await admin
      .from("payments")
      .insert({
        order_id: orderId,
        customer_id: result.data.metadata?.customer_id || (await admin.from('orders').select('customer_id').eq('id', orderId).single()).data?.customer_id,
        paystack_reference: reference,
        amount: amountPaid,
        status: "success",
        paid_at: result.data.paid_at,
      })
      .select()
      .single();
    if (paymentError) throw paymentError;

    // c. Create Held Funds Record
    const commission = amountPaid * COMMISSION_RATE;
    const receivable = amountPaid - commission;

    const { data: orderData } = await admin
      .from("orders")
      .select("seller_profile_id")
      .eq("id", orderId)
      .single();

    const { error: fundError } = await admin
      .from("held_funds")
      .insert({
        order_id: orderId,
        seller_profile_id: orderData?.seller_profile_id,
        total_amount: amountPaid,
        commission_amount: commission,
        seller_receivable: receivable,
        status: "held",
      });
    if (fundError) throw fundError;

    revalidatePath("/dashboard/orders");
    revalidatePath("/seller/orders");

    return { success: true };
  } catch (error: any) {
    console.error("Payment Verification Error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    // 1. Get current user session from cookies
    const cookieStore = cookies();
    const userRole = cookieStore.get("user_role")?.value;
    const userId = cookieStore.get("user_id")?.value;

    if (!userRole || !userId) {
      return { success: false, error: "Unauthorized: No active session." };
    }

    // 2. Fetch the order details to perform security/ownership checks
    const admin = getSupabaseAdmin();
    const { data: order, error: orderErr } = await admin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .maybeSingle();

    if (orderErr || !order) {
      return { success: false, error: "Order not found." };
    }

    // 3. Ownership and status transitions checks
    if (status === "processing" || status === "delivered") {
      if (userRole !== "seller" || order.seller_profile_id !== userId) {
        return { success: false, error: "Unauthorized: Only the seller can update order status." };
      }
      if (status === "processing" && order.status !== "paid") {
        return { success: false, error: `Invalid status transition from '${order.status}' to 'processing'.` };
      }
      if (status === "delivered" && order.status !== "processing") {
        return { success: false, error: `Invalid status transition from '${order.status}' to 'delivered'.` };
      }
    } else if (status === "completed") {
      if (userRole !== "customer" || order.customer_id !== userId) {
        return { success: false, error: "Unauthorized: Only the customer can confirm delivery." };
      }
      if (order.status !== "delivered") {
        return { success: false, error: "Order must be marked as delivered before confirming receipt." };
      }
    } else {
      return { success: false, error: "Invalid status requested." };
    }

    // 4. Perform update using admin client
    const updateData: any = { status, updated_at: new Date().toISOString() };
    if (status === "delivered") {
      updateData.delivered_at = new Date().toISOString();
    } else if (status === "completed") {
      updateData.confirmed_at = new Date().toISOString();
    }

    const { error } = await admin
      .from("orders")
      .update(updateData)
      .eq("id", orderId);

    if (error) throw error;

    revalidatePath(`/dashboard/orders/${orderId}`);
    revalidatePath(`/seller/orders/${orderId}`);
    revalidatePath("/seller/orders");
    revalidatePath("/admin/payments");

    return { success: true };
  } catch (error: any) {
    console.error("Order Status Update Error:", error);
    return { success: false, error: error.message };
  }
}

export async function confirmOrderDelivery(orderId: string) {
  return await updateOrderStatus(orderId, "completed");
}
