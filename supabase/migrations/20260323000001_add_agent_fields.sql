ALTER TABLE agents
  ADD COLUMN IF NOT EXISTS wallet_address TEXT,
  ADD COLUMN IF NOT EXISTS agent_type TEXT CHECK (agent_type IN ('search','image','inference','code')),
  ADD COLUMN IF NOT EXISTS total_requests INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sol_earned NUMERIC(18,9) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
