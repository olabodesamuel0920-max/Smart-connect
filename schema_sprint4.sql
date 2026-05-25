-- SQL Schema Additions for Smart Connect Sprint 4
-- Build delivery confirmation and release-eligibility foundation

-- 1. Add delivery and confirmation timestamps to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMPTZ;

-- 2. Create or replace trigger function to transition held_funds status
-- and automatically record the confirmation timestamp.
CREATE OR REPLACE FUNCTION public.handle_order_completion()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the order status transitioned to completed
    IF NEW.status = 'completed' AND OLD.status <> 'completed' THEN
        -- Set confirmed_at timestamp to now if not already set
        IF NEW.confirmed_at IS NULL THEN
            NEW.confirmed_at := NOW();
        END IF;

        -- Update the matching held_funds row to make it releasable
        UPDATE public.held_funds
        SET status = 'releasable',
            updated_at = NOW()
        WHERE order_id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Bind the trigger to the orders table
DROP TRIGGER IF EXISTS on_order_completed ON public.orders;
CREATE TRIGGER on_order_completed
    BEFORE UPDATE OF status ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_order_completion();
