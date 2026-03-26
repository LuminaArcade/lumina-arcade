import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase';

const CreatePoolSchema = z.object({
  name:            z.string().min(1).max(80),
  description:     z.string().min(1).max(500),
  token_name:      z.string().min(1).max(50),
  token_symbol:    z.string().min(1).max(8),
  pool_type:       z.enum(['solo', 'community']),
  threshold_type:  z.enum(['sol', 'contributors']),
  threshold_value: z.number().positive(),
  creator_wallet:  z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body  = await req.json();
    const input = CreatePoolSchema.parse(body);

    // Encontra ou cria utilizador pelo wallet
    let userId: string;
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('wallet', input.creator_wallet)
      .single();

    if (!existingUser) {
      const { data: newUser, error } = await supabaseAdmin
        .from('users')
        .insert({
          privy_id: `wallet_${input.creator_wallet}`,
          wallet:   input.creator_wallet,
        })
        .select('id')
        .single();

      if (error || !newUser) throw new Error('Falha ao criar utilizador');
      userId = newUser.id;
    } else {
      userId = existingUser.id;
    }

    // Cria a pool
    const { data: pool, error } = await supabaseAdmin
      .from('pools')
      .insert({
        creator_id:      userId,
        name:            input.name,
        description:     input.description,
        token_name:      input.token_name,
        token_symbol:    input.token_symbol,
        pool_type:       input.pool_type,
        threshold_type:  input.threshold_type,
        threshold_value: input.threshold_value,
        status:          'open',
      })
      .select()
      .single();

    if (error) throw error;

    // Dá XP ao criador
    await supabaseAdmin.from('xp_events').insert({
      user_id:    userId,
      event_type: 'create_pool',
      xp_amount:  200,
      metadata:   { pool_id: pool.id },
    });

    await supabaseAdmin
      .from('users')
      .update({ total_xp: (existingUser ? 200 : 200) })
      .eq('id', userId);

    return NextResponse.json({ data: pool }, { status: 201 });
  } catch (err: unknown) {
    console.error('[POST /api/pools]', err);
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 });
    }
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro interno' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') ?? 'open';
  const limit  = parseInt(searchParams.get('limit') ?? '20');
  const offset = parseInt(searchParams.get('offset') ?? '0');

  const { data, error, count } = await supabaseAdmin
    .from('pools')
    .select(`
      *,
      creator:users(id, username, twitter_handle, twitter_avatar, total_xp, level)
    `, { count: 'exact' })
    .eq('status', status)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, count, limit, offset });
}
