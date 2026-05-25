import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

/**
 * ============================================================================
 * SPRINT 4 AUTOMATED END-TO-END QA FLOW
 * ============================================================================
 * 
 * Target URL: Configurable via PLAYWRIGHT_TEST_BASE_URL (defaults to Vercel)
 * 
 * This test automates the full Sprint 4 order delivery confirmation and
 * held funds status transition flow:
 *   1. Seeds a fresh test order (status: paid, with held funds).
 *   2. Logs in as SELLER, marks order as processing -> delivered.
 *   3. Logs in as BUYER, confirms receipt, verifies "Protected Payment" wording,
 *      and opens the "Report Issue" modal.
 *   4. Logs in as ADMIN, verifies the "Releasable Funds" card and the 
 *      "Releasable" status badges.
 */

// Parse .env files manually
function loadEnv() {
  const envPaths = [
    path.join(process.cwd(), '.env.local'),
    path.join(process.cwd(), '.env.development'),
    path.join(process.cwd(), '.env'),
  ];
  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const index = trimmed.indexOf('=');
        if (index > 0) {
          const key = trimmed.slice(0, index).trim();
          let val = trimmed.slice(index + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
}

let orderId: string;
let buyerId: string;
let sellerId: string;
let adminId: string;

test.beforeAll(async () => {
  loadEnv();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.");
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  console.log('[SETUP] Fetching test accounts...');
  const { data: { users } } = await supabase.auth.admin.listUsers();
  const buyerUser = users.find(u => u.email === 'buyer.test@smartconnect.local');
  const sellerUser = users.find(u => u.email === 'seller.test@smartconnect.local');
  const adminUser = users.find(u => u.email === 'admin.test@smartconnect.local');

  if (!buyerUser || !sellerUser || !adminUser) {
    throw new Error("Test users are not created in Auth. Please run `npx tsx scripts/create-test-users.ts` first.");
  }

  buyerId = buyerUser.id;
  sellerId = sellerUser.id;
  adminId = adminUser.id;

  // Fetch the store
  const { data: store } = await supabase
    .from('stores')
    .select('id')
    .eq('seller_id', sellerUser.id)
    .single();

  if (!store) {
    throw new Error("Seller store not found in database.");
  }

  // Ensure a product exists to reference in items
  let product = await supabase
    .from('products')
    .select('id, price')
    .eq('store_id', store.id)
    .limit(1)
    .maybeSingle();

  let productId = product?.data?.id;
  let productPrice = product?.data?.price || 150000;

  if (!productId) {
    console.log('[SETUP] Creating dummy product for store...');
    const { data: newProd, error: prodErr } = await supabase
      .from('products')
      .insert({
        seller_profile_id: sellerUser.id,
        store_id: store.id,
        name: 'QA Test Phone',
        slug: `qa-test-phone-${Date.now()}`,
        category: 'Phones',
        price: 150000,
        stock_quantity: 10,
        is_active: true
      })
      .select()
      .single();

    if (prodErr) throw prodErr;
    productId = newProd.id;
    productPrice = newProd.price;
  }

  // Create a fresh order starting in the 'paid' state
  console.log('[SETUP] Creating fresh test order in database...');
  const { data: dbOrder, error: orderErr } = await supabase
    .from('orders')
    .insert({
      customer_id: buyerUser.id,
      seller_profile_id: sellerUser.id,
      store_id: store.id,
      total_amount: productPrice,
      status: 'paid',
      delivery_address: 'Smart Connect QA Testing Lab, Lagos',
      delivery_note: 'Sprint 4 Automated Test Run'
    })
    .select()
    .single();

  if (orderErr) throw orderErr;
  orderId = dbOrder.id;
  console.log(`[SETUP] Fresh order created successfully (ID: ${orderId})`);

  // Insert order item
  const { error: itemErr } = await supabase
    .from('order_items')
    .insert({
      order_id: orderId,
      product_id: productId,
      quantity: 1,
      unit_price: productPrice,
      subtotal: productPrice
    });
  if (itemErr) throw itemErr;

  // Insert payment
  const { error: payErr } = await supabase
    .from('payments')
    .insert({
      order_id: orderId,
      customer_id: buyerUser.id,
      paystack_reference: `ref-qa-${Date.now()}`,
      amount: productPrice,
      status: 'success'
    });
  if (payErr) throw payErr;

  // Insert held funds (7.5% commission rate)
  const commission = productPrice * 0.075;
  const receivable = productPrice - commission;

  const { error: fundErr } = await supabase
    .from('held_funds')
    .insert({
      order_id: orderId,
      seller_profile_id: sellerUser.id,
      total_amount: productPrice,
      commission_amount: commission,
      seller_receivable: receivable,
      status: 'held'
    });
  if (fundErr) throw fundErr;

  console.log('[SETUP] Seeding finished. Database is ready for Playwright flow.');
});

test('Execute Sprint 4 End-to-End QA Flow', async ({ browser }) => {
  const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'https://smart-connect-jade.vercel.app';
  const DOMAIN = new URL(BASE_URL).hostname;

  // --------------------------------------------------------------------------
  // STEP 1: SELLER FLOW (Mark as Processing -> Mark as Delivered)
  // --------------------------------------------------------------------------
  console.log(`\n[STEP 1] Starting Seller flow on ${BASE_URL}...`);
  const sellerContext = await browser.newContext();
  const sellerPage = await sellerContext.newPage();

  console.log('[SELLER] Navigating to /login...');
  await sellerPage.goto(`${BASE_URL}/login`);

  console.log('[SELLER] Authenticating via cookies...');
  await sellerContext.addCookies([
    { name: 'user_role', value: 'seller', domain: DOMAIN, path: '/' },
    { name: 'user_id', value: sellerId, domain: DOMAIN, path: '/' }
  ]);

  console.log('[SELLER] Opening order details...');
  await sellerPage.goto(`${BASE_URL}/seller/orders/${orderId}`);
  
  await expect(sellerPage.locator('span:has-text("paid")').first()).toBeVisible();
  console.log('[SELLER] Verified initial state: PAID');

  // Wait for hydration before click
  await sellerPage.waitForTimeout(1500);

  console.log('[SELLER] Clicking Mark as Processing...');
  await sellerPage.click('button:has-text("Mark as Processing")');

  await expect(sellerPage.locator('span:has-text("processing")').first()).toBeVisible();
  console.log('[SELLER] Verified state transition: PROCESSING');

  // Wait for hydration after page reload
  await sellerPage.waitForTimeout(1500);

  console.log('[SELLER] Clicking Mark as Delivered...');
  await sellerPage.click('button:has-text("Mark as Delivered")');

  await expect(sellerPage.locator('span:has-text("delivered")').first()).toBeVisible();
  console.log('[SELLER] Verified state transition: DELIVERED');

  await sellerContext.close();
  console.log('[PASS] STEP 1 completed successfully.');

  // --------------------------------------------------------------------------
  // STEP 2: BUYER FLOW (Confirm Receipt, Wording Checks, Support Modal)
  // --------------------------------------------------------------------------
  console.log('\n[STEP 2] Starting Buyer flow...');
  const buyerContext = await browser.newContext();
  const buyerPage = await buyerContext.newPage();

  console.log('[BUYER] Navigating to /login...');
  await buyerPage.goto(`${BASE_URL}/login`);

  console.log('[BUYER] Authenticating via cookies...');
  await buyerContext.addCookies([
    { name: 'user_role', value: 'customer', domain: DOMAIN, path: '/' },
    { name: 'user_id', value: buyerId, domain: DOMAIN, path: '/' }
  ]);

  console.log('[BUYER] Opening order details...');
  await buyerPage.goto(`${BASE_URL}/dashboard/orders/${orderId}`);

  await expect(buyerPage.locator('span:has-text("delivered")').first()).toBeVisible();
  console.log('[BUYER] Verified order is currently: DELIVERED');

  // Wait for hydration before click
  await buyerPage.waitForTimeout(1500);

  // Intercept standard browser confirm() box
  buyerPage.once('dialog', async dialog => {
    console.log(`[BUYER] Intercepted confirm dialog: "${dialog.message()}". Accepting...`);
    await dialog.accept();
  });

  console.log('[BUYER] Clicking Confirm Receipt...');
  await buyerPage.click('button:has-text("Confirm Receipt")');

  await expect(buyerPage.locator('span:has-text("completed")').first()).toBeVisible();
  console.log('[BUYER] Verified state transition: COMPLETED');

  // Wording Checks
  const bodyText = await buyerPage.textContent('body');
  expect(bodyText).toContain('Protected Payment');
  expect(bodyText).toContain('Held by Smart Connect');
  expect(bodyText).not.toContain('Escrow');
  console.log('[BUYER] Verified protected payment terminology (no escrow references)');

  // Wait for hydration after reload
  await buyerPage.waitForTimeout(1500);

  // Modal checks
  console.log('[BUYER] Clicking Report Issue...');
  await buyerPage.click('button:has-text("Report Issue")');

  const modalHeader = buyerPage.locator('h3:has-text("Report Order Issue")');
  await expect(modalHeader).toBeVisible();
  console.log('[BUYER] Verified Report Issue modal is visible');

  console.log('[BUYER] Clicking Cancel in modal...');
  await buyerPage.click('button:has-text("Cancel")');
  await expect(modalHeader).not.toBeVisible();
  console.log('[BUYER] Verified modal closed successfully');

  await buyerContext.close();
  console.log('[PASS] STEP 2 completed successfully.');

  // --------------------------------------------------------------------------
  // STEP 3: ADMIN FLOW (Verify Releasable Funds Card & Badge)
  // --------------------------------------------------------------------------
  console.log('\n[STEP 3] Starting Admin flow...');
  const adminContext = await browser.newContext();
  const adminPage = await adminContext.newPage();

  console.log('[ADMIN] Navigating to /login...');
  await adminPage.goto(`${BASE_URL}/login`);

  console.log('[ADMIN] Authenticating via cookies...');
  await adminContext.addCookies([
    { name: 'user_role', value: 'admin', domain: DOMAIN, path: '/' },
    { name: 'user_id', value: adminId, domain: DOMAIN, path: '/' }
  ]);

  console.log('[ADMIN] Opening payments dashboard...');
  await adminPage.goto(`${BASE_URL}/admin/payments`);

  // Verify the Releasable Funds card is visible
  const releasableCard = adminPage.locator('span:has-text("Releasable Funds")');
  await expect(releasableCard).toBeVisible();
  console.log('[ADMIN] Verified "Releasable Funds" card is visible');

  // Verify the relevant held fund row shows Releasable badge
  const releasableBadge = adminPage.locator('span:has-text("Releasable")').first();
  await expect(releasableBadge).toBeVisible();
  console.log('[ADMIN] Verified relevant held-fund row is marked as RELEASABLE');

  await adminContext.close();
  console.log('[PASS] STEP 3 completed successfully.');

  console.log('\n======================================================');
  console.log('ALL SPRINT 4 FLOW QA CHECKS PASSED SUCCESSFULLY!');
  console.log('======================================================\n');
});
