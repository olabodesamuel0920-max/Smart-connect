import { test, expect } from '@playwright/test';

/**
 * ============================================================================
 * PLAYWRIGHT QA ROLE ROUTE TEST SCRIPT
 * ============================================================================
 * 
 * Target URL: https://smart-connect-jade.vercel.app
 * 
 * This test suite validates the Next.js middleware and access control
 * for the following roles:
 *   1. Unauthenticated (no cookies)
 *   2. Buyer (customer role)
 *   3. Seller (seller role)
 *   4. Admin (admin role)
 * 
 * Run command:
 *   npx playwright test scripts/qa-role-routes.spec.ts
 */

const BASE_URL = 'https://smart-connect-jade.vercel.app';
const DOMAIN = 'smart-connect-jade.vercel.app';

// Define the configurations for each test case
const BUYER_ROUTES = {
  allowed: ['/dashboard', '/dashboard/orders', '/dashboard/profile'],
  denied: ['/seller', '/seller/products', '/seller/store', '/seller/orders', '/admin', '/admin/orders', '/admin/payments'],
  expectedRedirect: '/dashboard',
};

const SELLER_ROUTES = {
  allowed: ['/seller', '/seller/products', '/seller/store', '/seller/orders'],
  denied: ['/dashboard', '/dashboard/orders', '/dashboard/profile', '/admin', '/admin/orders', '/admin/payments'],
  expectedRedirect: '/seller',
};

const ADMIN_ROUTES = {
  allowed: ['/admin', '/admin/orders', '/admin/payments'],
  denied: ['/dashboard', '/dashboard/orders', '/dashboard/profile', '/seller', '/seller/products', '/seller/store', '/seller/orders'],
  expectedRedirect: '/admin',
};

test.describe('Access Control Routing QA Checks', () => {

  // ----------------------------------------------------
  // CASE 1: Unauthenticated Session
  // ----------------------------------------------------
  test('Unauthenticated user is blocked and redirected to /login', async ({ page }) => {
    const protectedRoutes = ['/dashboard', '/seller', '/admin'];

    for (const route of protectedRoutes) {
      console.log(`[UNAUTH CHECK] Accessing protected route: ${route}`);
      await page.goto(`${BASE_URL}${route}`);
      
      // Should redirect to /login
      await expect(page).toHaveURL(`${BASE_URL}/login`);
      console.log(`[PASS] Access blocked for: ${route} (Redirected to /login)`);
    }
  });

  // ----------------------------------------------------
  // CASE 2: Buyer Session (customer role)
  // ----------------------------------------------------
  test.describe('Buyer Role Access Control', () => {
    test.use({
      storageState: {
        cookies: [
          {
            name: 'user_role',
            value: 'customer',
            domain: DOMAIN,
            path: '/',
          },
          {
            name: 'user_id',
            value: '59f25030-942b-4524-989f-4abb2f5b88c0',
            domain: DOMAIN,
            path: '/',
          }
        ],
        origins: [],
      }
    });

    test('Verify Buyer access limits and allowances', async ({ page }) => {
      console.log('[BUYER CHECK] Testing allowed routes...');
      for (const route of BUYER_ROUTES.allowed) {
        const response = await page.goto(`${BASE_URL}${route}`);
        expect(response?.status()).toBe(200);
        await expect(page).toHaveURL(`${BASE_URL}${route}`);
        console.log(`[PASS] Allowed route accessible: ${route}`);
      }

      console.log('[BUYER CHECK] Testing forbidden routes...');
      for (const route of BUYER_ROUTES.denied) {
        await page.goto(`${BASE_URL}${route}`);
        await expect(page).toHaveURL(`${BASE_URL}${BUYER_ROUTES.expectedRedirect}`);
        console.log(`[PASS] Denied route correctly redirected: ${route} -> ${BUYER_ROUTES.expectedRedirect}`);
      }
    });
  });

  // ----------------------------------------------------
  // CASE 3: Seller Session (seller role)
  // ----------------------------------------------------
  test.describe('Seller Role Access Control', () => {
    test.use({
      storageState: {
        cookies: [
          {
            name: 'user_role',
            value: 'seller',
            domain: DOMAIN,
            path: '/',
          },
          {
            name: 'user_id',
            value: '2fbd07df-4a6d-45f6-99eb-f90c3d56b9bf',
            domain: DOMAIN,
            path: '/',
          }
        ],
        origins: [],
      }
    });

    test('Verify Seller access limits and allowances', async ({ page }) => {
      console.log('[SELLER CHECK] Testing allowed routes...');
      for (const route of SELLER_ROUTES.allowed) {
        const response = await page.goto(`${BASE_URL}${route}`);
        expect(response?.status()).toBe(200);
        await expect(page).toHaveURL(`${BASE_URL}${route}`);
        console.log(`[PASS] Allowed route accessible: ${route}`);
      }

      console.log('[SELLER CHECK] Testing forbidden routes...');
      for (const route of SELLER_ROUTES.denied) {
        await page.goto(`${BASE_URL}${route}`);
        await expect(page).toHaveURL(`${BASE_URL}${SELLER_ROUTES.expectedRedirect}`);
        console.log(`[PASS] Denied route correctly redirected: ${route} -> ${SELLER_ROUTES.expectedRedirect}`);
      }
    });
  });

  // ----------------------------------------------------
  // CASE 4: Admin Session (admin role)
  // ----------------------------------------------------
  test.describe('Admin Role Access Control', () => {
    test.use({
      storageState: {
        cookies: [
          {
            name: 'user_role',
            value: 'admin',
            domain: DOMAIN,
            path: '/',
          },
          {
            name: 'user_id',
            value: 'c83aa2e9-6a74-49fd-bfc9-20936c7f8240',
            domain: DOMAIN,
            path: '/',
          }
        ],
        origins: [],
      }
    });

    test('Verify Admin access limits and allowances', async ({ page }) => {
      console.log('[ADMIN CHECK] Testing allowed routes...');
      for (const route of ADMIN_ROUTES.allowed) {
        const response = await page.goto(`${BASE_URL}${route}`);
        expect(response?.status()).toBe(200);
        await expect(page).toHaveURL(`${BASE_URL}${route}`);
        console.log(`[PASS] Allowed route accessible: ${route}`);
      }

      console.log('[ADMIN CHECK] Testing forbidden routes...');
      for (const route of ADMIN_ROUTES.denied) {
        await page.goto(`${BASE_URL}${route}`);
        await expect(page).toHaveURL(`${BASE_URL}${ADMIN_ROUTES.expectedRedirect}`);
        console.log(`[PASS] Denied route correctly redirected: ${route} -> ${ADMIN_ROUTES.expectedRedirect}`);
      }
    });
  });

});
