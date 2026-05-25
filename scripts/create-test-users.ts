import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

/**
 * ============================================================================
 * TEMPORARY QA-ONLY TEST ACCOUNT GENERATOR
 * ============================================================================
 * 
 * This script is for local/dev-only QA testing. It generates/resets temporary 
 * accounts for buyer, seller, and admin roles.
 * 
 * DO NOT deploy this to production or commit any real secrets.
 */

// Load environment variables from .env files
function loadEnv() {
  const envPaths = [
    path.join(process.cwd(), '.env.local'),
    path.join(process.cwd(), '.env.development'),
    path.join(process.cwd(), '.env'),
  ];

  let loaded = false;
  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      console.log(`[QA Setup] Loading env vars from ${path.basename(envPath)}`);
      const content = fs.readFileSync(envPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const index = trimmed.indexOf('=');
        if (index > 0) {
          const key = trimmed.slice(0, index).trim();
          let val = trimmed.slice(index + 1).trim();
          // Strip wrapping quotes
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
      loaded = true;
    }
  }
  if (!loaded) {
    console.warn('[QA Setup] Warning: No .env, .env.local, or .env.development file found in the working directory.');
  }
}

// Initialize environment variables
loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('\n[QA Setup] ERROR: Missing required configuration variables.');
  console.error('Make sure the following environment variables are set:');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL)');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nPlease check your .env or .env.local file.\n');
  process.exit(1);
}

// Create the Supabase client using the service role (admin) key
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const TEST_USERS = [
  {
    email: 'buyer.test@smartconnect.local',
    password: 'TestBuyer123!',
    role: 'customer',
    fullName: 'Test Buyer',
    type: 'buyer',
  },
  {
    email: 'seller.test@smartconnect.local',
    password: 'TestSeller123!',
    role: 'seller',
    fullName: 'Test Seller',
    businessName: 'Test Seller Business',
    type: 'seller',
  },
  {
    email: 'admin.test@smartconnect.local',
    password: 'TestAdmin123!',
    role: 'admin',
    fullName: 'Test Admin',
    type: 'admin',
  },
] as const;

async function setupQAUsers() {
  console.log('\n======================================================');
  console.log('STARTING TEMPORARY QA TEST USER SETUP...');
  console.log('======================================================\n');

  // 1. Retrieve existing users from auth to avoid duplicate signup attempts
  console.log('Fetching existing users from Supabase Auth...');
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error('Failed to list auth users. Make sure your SUPABASE_SERVICE_ROLE_KEY is correct.');
    throw listError;
  }

  for (const userSpec of TEST_USERS) {
    console.log(`\n------------------------------------------------------`);
    console.log(`Processing role: ${userSpec.type.toUpperCase()} (${userSpec.email})`);
    console.log(`------------------------------------------------------`);

    const existingUser = users.find((u) => u.email === userSpec.email);
    let userId: string;

    if (existingUser) {
      userId = existingUser.id;
      console.log(`User already exists (Auth ID: ${userId}).`);
      console.log(`Resetting password to: ${userSpec.password}`);
      
      const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
        password: userSpec.password,
        email_confirm: true,
      });

      if (updateError) {
        console.error(`Failed to update auth details for ${userSpec.email}:`, updateError.message);
        continue;
      }
    } else {
      console.log(`User does not exist. Creating new Auth user...`);
      const { data: createData, error: createError } = await supabase.auth.admin.createUser({
        email: userSpec.email,
        password: userSpec.password,
        email_confirm: true,
      });

      if (createError) {
        console.error(`Failed to create auth user for ${userSpec.email}:`, createError.message);
        continue;
      }
      if (!createData.user) {
        console.error(`Empty user object returned for ${userSpec.email}`);
        continue;
      }

      userId = createData.user.id;
      console.log(`Auth user created successfully (Auth ID: ${userId}).`);
    }

    // 2. Set up database profiles
    console.log(`Upserting profile row with role: ${userSpec.role}...`);
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(
        {
          id: userId,
          email: userSpec.email,
          role: userSpec.role,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

    if (profileError) {
      console.error(`Failed to upsert profile for ${userSpec.email}:`, profileError.message);
      continue;
    }

    // Clean up or create matching role-specific tables
    if (userSpec.role === 'customer') {
      console.log(`Upserting customer_profiles row...`);
      const { error: custError } = await supabase
        .from('customer_profiles')
        .upsert(
          {
            id: userId,
            full_name: userSpec.fullName,
            phone: '+1234567890',
            address: '123 Buyer St, Test City',
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        );

      if (custError) {
        console.error(`Failed to upsert customer profile:`, custError.message);
      }
    } else if (userSpec.role === 'seller') {
      console.log(`Upserting seller_profiles row (status: approved)...`);
      const { error: sellerError } = await supabase
        .from('seller_profiles')
        .upsert(
          {
            id: userId,
            business_name: userSpec.businessName,
            bio: 'Temporary seller QA account',
            verification_status: 'approved',
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        );

      if (sellerError) {
        console.error(`Failed to upsert seller profile:`, sellerError.message);
        continue;
      }

      // Check if store already exists for this seller
      console.log(`Checking stores for seller ID: ${userId}...`);
      const { data: existingStore, error: storeQueryError } = await supabase
        .from('stores')
        .select('id')
        .eq('seller_id', userId)
        .maybeSingle();

      if (storeQueryError) {
        console.error(`Failed to query stores:`, storeQueryError.message);
        continue;
      }

      const storeSlug = 'test-store';

      // Resolve slug conflict if another seller owns this slug
      const { data: slugStore } = await supabase
        .from('stores')
        .select('id, seller_id')
        .eq('slug', storeSlug)
        .maybeSingle();

      if (slugStore && slugStore.seller_id !== userId) {
        console.log(`Store with slug '${storeSlug}' belongs to another user (ID: ${slugStore.seller_id}). Deleting conflicting store...`);
        const { error: deleteError } = await supabase.from('stores').delete().eq('id', slugStore.id);
        if (deleteError) {
          console.error(`Failed to delete conflicting store:`, deleteError.message);
        }
      }

      if (!existingStore) {
        console.log(`Creating store for seller...`);
        const { error: storeInsertError } = await supabase
          .from('stores')
          .insert({
            seller_id: userId,
            name: 'Test Store',
            slug: storeSlug,
            description: 'Temporary store for QA testing.',
            is_active: true,
          });

        if (storeInsertError) {
          console.error(`Failed to insert store:`, storeInsertError.message);
        } else {
          console.log(`Successfully created store 'test-store'`);
        }
      } else {
        console.log(`Store already exists (ID: ${existingStore.id}). Ensuring it is active...`);
        const { error: storeUpdateError } = await supabase
          .from('stores')
          .update({
            name: 'Test Store',
            slug: storeSlug,
            is_active: true,
          })
          .eq('seller_id', userId);

        if (storeUpdateError) {
          console.error(`Failed to update store:`, storeUpdateError.message);
        }
      }

      // Clean up customer_profiles for this user if it was created by database triggers
      await supabase.from('customer_profiles').delete().eq('id', userId);
    } else if (userSpec.role === 'admin') {
      // Clean up customer_profiles for this user if it was created by database triggers
      await supabase.from('customer_profiles').delete().eq('id', userId);
    }

    console.log(`Finished processing for ${userSpec.email}`);
  }

  console.log('\n======================================================');
  console.log('SUMMARY OF GENERATED CREDENTIALS FOR QA:');
  console.log('======================================================');
  for (const user of TEST_USERS) {
    console.log(`Role: ${user.type.toUpperCase()}`);
    console.log(`  Email:    ${user.email}`);
    console.log(`  Password: ${user.password}`);
    console.log(`------------------------------------------------------`);
  }
  console.log('QA setup script finished successfully.');
  console.log('======================================================\n');
}

setupQAUsers().catch((err) => {
  console.error('\nFatal error running setup script:', err);
  process.exit(1);
});
