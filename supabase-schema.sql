-- Lumina Arcade — Supabase Database Schema
-- Run this in your Supabase SQL Editor to set up the tables

-- Profiles (user data)
CREATE TABLE IF NOT EXISTS profiles (
  wallet TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  xp INTEGER NOT NULL DEFAULT 0,
  pools_created TEXT[] NOT NULL DEFAULT '{}',
  pools_pledged TEXT[] NOT NULL DEFAULT '{}',
  creatures_unlocked TEXT[] NOT NULL DEFAULT '{blobby}',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Pools
CREATE TABLE IF NOT EXISTS pools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  ticker TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  creator_wallet TEXT NOT NULL REFERENCES profiles(wallet),
  creator_name TEXT NOT NULL,
  target_sol NUMERIC NOT NULL,
  raised_sol NUMERIC NOT NULL DEFAULT 0,
  participants TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'launched', 'expired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  launched_at TIMESTAMPTZ
);

-- Pledges
CREATE TABLE IF NOT EXISTS pledges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pool_id UUID NOT NULL REFERENCES pools(id) ON DELETE CASCADE,
  wallet TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- AI Generated Characters
CREATE TABLE IF NOT EXISTS ai_characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT NOT NULL REFERENCES profiles(wallet),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  backstory TEXT NOT NULL DEFAULT '',
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  traits JSONB NOT NULL DEFAULT '{}',
  image_prompt TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_pools_status ON pools(status);
CREATE INDEX IF NOT EXISTS idx_pools_creator ON pools(creator_wallet);
CREATE INDEX IF NOT EXISTS idx_pledges_pool ON pledges(pool_id);
CREATE INDEX IF NOT EXISTS idx_pledges_wallet ON pledges(wallet);
CREATE INDEX IF NOT EXISTS idx_ai_characters_wallet ON ai_characters(wallet);
CREATE INDEX IF NOT EXISTS idx_profiles_xp ON profiles(xp DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE pledges ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_characters ENABLE ROW LEVEL SECURITY;

-- Policies: allow public read and write
CREATE POLICY "Public read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public insert profiles" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update profiles" ON profiles FOR UPDATE USING (true);

CREATE POLICY "Public read pools" ON pools FOR SELECT USING (true);
CREATE POLICY "Public insert pools" ON pools FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update pools" ON pools FOR UPDATE USING (true);

CREATE POLICY "Public read pledges" ON pledges FOR SELECT USING (true);
CREATE POLICY "Public insert pledges" ON pledges FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read ai_characters" ON ai_characters FOR SELECT USING (true);
CREATE POLICY "Public insert ai_characters" ON ai_characters FOR INSERT WITH CHECK (true);
