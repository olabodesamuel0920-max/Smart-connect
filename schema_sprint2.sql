-- SQL Schema Additions for Smart Connect Sprint 2

-- Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_profile_id UUID NOT NULL REFERENCES public.seller_profiles(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    short_description TEXT,
    description TEXT,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    negotiation_allowed BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product Images Table
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security) for Sprint 2
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Products are viewable by everyone if active." ON public.products
    FOR SELECT USING (is_active = true);

CREATE POLICY "Sellers can manage their own products." ON public.products
    FOR ALL USING (auth.uid() = seller_profile_id);

CREATE POLICY "Product images are viewable by everyone." ON public.product_images
    FOR SELECT USING (true);

CREATE POLICY "Sellers can manage their own product images." ON public.product_images
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.products
            WHERE products.id = product_images.product_id
            AND products.seller_profile_id = auth.uid()
        )
    );
