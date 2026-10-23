-- ==============================================================================
-- DATABASE SCHEMA: Production Application & Persistence Architecture
-- Compatible with Supabase PostgreSQL, CockroachDB, and standard Postgres 15+
-- ==============================================================================

-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. SUBSCRIBERS TABLE (Waitlist & Newsletter)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    source TEXT DEFAULT 'website_waitlist',
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row-Level Security
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow public waitlist registrations"
    ON public.subscribers
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to view subscribers"
    ON public.subscribers
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Seed Records
INSERT INTO public.subscribers (email, name, source, status)
VALUES 
    ('alex.chen@innovate.tech', 'Alex Chen', 'early_access', 'confirmed'),
    ('sarah.miller@enterprise.io', 'Sarah Miller', 'pricing_modal', 'confirmed'),
    ('dev.lead@hyper-scale.dev', 'Dev Lead', 'cli_quickstart', 'pending')
ON CONFLICT (email) DO NOTHING;


-- ------------------------------------------------------------------------------
-- 2. FEEDBACK & CONTACT SUBMISSIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    name TEXT DEFAULT 'Anonymous',
    message TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row-Level Security
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow public feedback submissions"
    ON public.feedback
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow authenticated staff to read feedback"
    ON public.feedback
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Seed Records
INSERT INTO public.feedback (email, name, message, category, rating)
VALUES
    ('cto@acme-corp.com', 'David Miller', 'The edge latency is astonishingly fast under heavy load.', 'performance', 5),
    ('frontend@startup.co', 'Elena Rostova', 'Clean documentation and easy TypeScript SDK integration.', 'developer_experience', 5)
ON CONFLICT DO NOTHING;


-- ------------------------------------------------------------------------------
-- 3. PROMPT TEMPLATES & SYSTEM ASSETS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.prompt_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    system_prompt TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    model_compatibility TEXT DEFAULT 'any',
    tokens_estimate INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT true,
    user_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row-Level Security
ALTER TABLE public.prompt_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow public read access to active prompts"
    ON public.prompt_templates
    FOR SELECT
    USING (is_public = true);

CREATE POLICY "Allow authenticated authors to manage prompts"
    ON public.prompt_templates
    FOR ALL
    USING (auth.role() = 'authenticated');

-- Seed Records
INSERT INTO public.prompt_templates (title, description, system_prompt, category, tokens_estimate)
VALUES
    (
        'Autonomous Systems Architect',
        'Expert agent instruction for deterministic prompt-to-production deployment orchestration.',
        'You are an elite principal systems engineer specializing in edge runtimes, Next.js, and autonomous deployments.',
        'Architecture',
        420
    ),
    (
        'SQL Optimization Copilot',
        'Generates parameterized PostgreSQL and ClickHouse queries with automatic indexing recommendations.',
        'You are a staff database administrator optimizing multi-tenant schemas with RLS security policies.',
        'Database',
        380
    ),
    (
        'TypeScript Interface Synthesizer',
        'Produces strict, zero-any TypeScript type definitions and Zod schemas.',
        'You are a TypeScript compiler specialist writing comprehensive generic types.',
        'Engineering',
        290
    )
ON CONFLICT DO NOTHING;


-- ------------------------------------------------------------------------------
-- 4. CRYPTOGRAPHIC API TOKENS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key_prefix TEXT NOT NULL,
    key_hash TEXT NOT NULL,
    label TEXT NOT NULL,
    permissions TEXT[] DEFAULT ARRAY['read', 'write'],
    is_active BOOLEAN DEFAULT true,
    last_used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    node_id UUID REFERENCES public.validators(id) ON DELETE SET NULL,
    scope TEXT CHECK (scope IN ('read', 'write', 'admin', 'consensus')) DEFAULT 'read',
    expires_at TIMESTAMPTZ
);

-- Enable Row-Level Security
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLY "Allow authenticated users to manage keys"
    ON public.api_keys
    FOR ALL
    USING (auth.role() = 'authenticated');



-- ------------------------------------------------------------------------------
-- 5. CONSENSUS CHECKPOINTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.consensus_checkpoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    round_number INTEGER NOT NULL,
    checkpoint_hash TEXT NOT NULL,
    validator_count INTEGER NOT NULL,
    signed_by UUID REFERENCES public.validators(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    territory TEXT NOT NULL DEFAULT 'global',
    UNIQUE(round_number, territory)
);

-- Enable Row-Level Security
ALTER TABLE public.consensus_checkpoints ENABLE ROW LEVEL SECURITY;

-- Allow public read access to finalized checkpoints
CREATE POLICY "Allow public read access to finalized checkpoints"
    ON public.consensus_checkpoints
    FOR SELECT
    USING (true);

-- Allow authenticated users to insert new checkpoints
CREATE POLICY "Allow authenticated users to insert checkpoints"
    ON public.consensus_checkpoints
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- ------------------------------------------------------------------------------
-- 6. VALIDATOR NODES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.validators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_address TEXT NOT NULL UNIQUE,
    public_key TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'online' CHECK (status IN ('online', 'offline', 'degraded')),
    consensus_round INTEGER DEFAULT 1,
    last_seen_at TIMESTAMPTZ DEFAULT NOW(),
    total_syncs INTEGER DEFAULT 0,
    success_syncs INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row-Level Security
ALTER TABLE public.validators ENABLE ROW LEVEL SECURITY;

-- Allow public read access to validator status
CREATE POLICY "Allow public read access to validator status"
    ON public.validators
    FOR SELECT
    USING (true);

-- Allow authenticated users to update validator status
CREATE POLICY "Allow authenticated users to update validator status"
    ON public.validators
    FOR ALL
    USING (auth.role() = 'authenticated');
