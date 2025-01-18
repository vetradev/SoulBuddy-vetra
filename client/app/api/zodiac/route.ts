import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const zodiacName = searchParams.get('zodiacName');

  if (!zodiacName) {
    return NextResponse.json({ error: 'Zodiac sign is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('zodiac_signs')
    .select('*')
    .ilike('zodiac_name', `%${zodiacName}%`);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json(
      { message: 'No recommendations found for this zodiac sign' },
      { status: 404 }
    );
  }

  return NextResponse.json(data[0]);
}