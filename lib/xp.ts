import { supabaseAdmin } from './supabase';

export const XP_REWARDS = {
  pledge:           (solAmount: number) => Math.floor(solAmount * 100),
  launch:           500,
  claim_fees:       250,
  create_pool:      200,
  referral:         150,
  daily_login:       25,
  first_character:  300,
  pool_filled:      100,
} as const;

export function getLevelFromXP(xp: number): number {
  return Math.max(1, Math.floor(Math.sqrt(xp / 50)) + 1);
}

export function getXPForLevel(level: number): number {
  return Math.pow(level - 1, 2) * 50;
}

export function getXPProgress(xp: number): {
  level: number;
  currentXP: number;
  requiredXP: number;
  percent: number;
} {
  const level       = getLevelFromXP(xp);
  const currentBase = getXPForLevel(level);
  const nextBase    = getXPForLevel(level + 1);
  const currentXP   = xp - currentBase;
  const requiredXP  = nextBase - currentBase;
  const percent     = Math.min(100, Math.floor((currentXP / requiredXP) * 100));

  return { level, currentXP, requiredXP, percent };
}

export async function awardXP(
  userId: string,
  eventType: string,
  amount: number,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  await supabaseAdmin.from('xp_events').insert({
    user_id:    userId,
    event_type: eventType,
    xp_amount:  amount,
    metadata,
  });

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('total_xp')
    .eq('id', userId)
    .single();

  if (user) {
    const newXP    = (user.total_xp ?? 0) + amount;
    const newLevel = getLevelFromXP(newXP);
    await supabaseAdmin
      .from('users')
      .update({ total_xp: newXP, level: newLevel })
      .eq('id', userId);
  }
}

export const RARITY_COLORS: Record<string, string> = {
  common:    '#8888AA',
  rare:      '#00AAFF',
  epic:      '#BF00FF',
  legendary: '#FFD700',
};

export const RARITY_GLOW: Record<string, string> = {
  common:    'rgba(136, 136, 170, 0.3)',
  rare:      'rgba(0, 170, 255, 0.4)',
  epic:      'rgba(191, 0, 255, 0.5)',
  legendary: 'rgba(255, 215, 0, 0.6)',
};
