-- SQL Schema Additions for Smart Connect Sprint 3

-- Enums for Order and Payment Statuses
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'processing', 'delivered', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'success', 'failed', 'abandoned');
CREATE TYPE held_fund_status AS ENUM ('held', 'releasable', 'released', 'frozen');

-- Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES public.profiles(id),
    seller_profile_id UUID NOT NULL REFERENCES public.seller_profiles(id),
    store_id UUID NOT NULL REFERENCES public.stores(id),
    total_amount DECIMAL(12, 2) NOT NULL,
    status order_status NOT NULL DEFAULT 'pending',
    delivery_address TEXT NOT NULL,
    delivery_note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(12, 2) NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.profiles(id),
    paystack_reference TEXT UNIQUE,
    amount DECIMAL(12, 2) NOT NULL,
    status payment_status NOT NULL DEFAULT 'pending',
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Held Funds Table
CREATE TABLE IF NOT EXISTS public.held_funds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    seller_profile_id UUID NOT NULL REFERENCES public.seller_profiles(id),
    total_amount DECIMAL(12, 2) NOT NULL,
    commission_amount DECIMAL(12, 2) NOT NULL,
    seller_receivable DECIMAL(12, 2) NOT NULL,
    status held_fund_status NOT NULL DEFAULT 'held',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security) for Sprint 3
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.held_funds ENABLE ROW LEVEL SECURITY;

-- Basic Policies
-- Customers can view their own orders
CREATE POLICY "Customers can view their own orders" ON public.orders
    FOR SELECT USING (auth.uid() = customer_id);

-- Sellers can view orders for their products
CREATE POLICY "Sellers can view their store orders" ON public.orders
    FOR SELECT USING (auth.uid() = seller_profile_id);

-- Admins can view everything
CREATE POLICY "Admins can view all orders" ON public.orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Repeat similar basic policies for other tables as needed for this sprint
CREATE POLICY "Customers can view their own order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id AND orders.customer_id = auth.uid()
        )
    );

CREATE POLICY "Sellers can view their own order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id AND orders.seller_profile_id = auth.uid()
        )
    );

CREATE POLICY "Customers can view their own payments" ON public.payments
    FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Sellers can view payments for their orders" ON public.payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = payments.order_id AND orders.seller_profile_id = auth.uid()
        )
    );

CREATE POLICY "Sellers can view their held funds" ON public.held_funds
    FOR SELECT USING (auth.uid() = seller_profile_id);
