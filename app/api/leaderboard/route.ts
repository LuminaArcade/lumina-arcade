import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select(`
      id,
      username,
      twitter_handle,
      twitter_avatar,
      total_xp,
      level,
      total_fees_earned,
      characters(
        id, name, image_url, rarity, traits, level
      ),
      pledges(amount_sol),
      pools!pools_creator_id_fkey(
        id, status
      )
    `)
    .order('total_xp', { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const leaderboard = (data ?? []).map((user, idx) => ({
    rank:          idx + 1,
    user: {
      id:                user.id,
      username:          user.username,
      twitter_handle:    user.twitter_handle,
      twitter_avatar:    user.twitter_avatar,
      total_xp:          user.total_xp,
      level:             user.level,
      total_fees_earned: user.total_fees_earned,
    },
    character:      (user.characters as unknown[])?.[0] ?? null,
    total_pledged:  ((user.pledges ?? []) as { amount_sol: number }[])
                      .reduce((s, p) => s + p.amount_sol, 0),
    pools_launched: ((user.pools ?? []) as { status: string }[])
                      .filter(p => p.status === 'launched').length,
  }));

  return NextResponse.json({ data: leaderboard });
}
