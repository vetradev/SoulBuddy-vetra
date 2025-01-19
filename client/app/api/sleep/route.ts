import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { age, sleepQuality, stressLevel } = body;

    if (!age || !sleepQuality || !stressLevel) {
      return NextResponse.json(
        { error: 'Age, Sleep Quality, and Stress Level are required' },
        { status: 400 }
      );
    }

    const normalizedAge = parseInt(age);
    const normalizedQuality = sleepQuality.toLowerCase();
    const normalizedStress = stressLevel.toLowerCase();

    if (isNaN(normalizedAge) || normalizedAge < 0 || normalizedAge > 120) {
      return NextResponse.json({ error: 'Invalid age' }, { status: 400 });
    }

    if (!['good', 'fair', 'poor'].includes(normalizedQuality)) {
      return NextResponse.json({ error: 'Invalid sleep quality' }, { status: 400 });
    }

    if (!['high', 'medium', 'low'].includes(normalizedStress)) {
      return NextResponse.json({ error: 'Invalid stress level' }, { status: 400 });
    }

    let recommendedSleepHours = '';
    let sleepTips = '';

    if (normalizedAge <= 20) {
      if (normalizedQuality === 'good' && normalizedStress === 'low') {
        recommendedSleepHours = '7-8 hours';
        sleepTips = 'Maintain your current sleep routine. Consider going to bed and waking up at the same time each day.';
      } else if (normalizedStress === 'high') {
        recommendedSleepHours = '8-9 hours';
        sleepTips = 'Due to high stress, prioritize relaxation before bedtime. Consider meditation or gentle stretching.';
      } else {
        recommendedSleepHours = '8 hours';
        sleepTips = 'Focus on sleep quality by creating a calm sleep environment and avoiding screens before bed.';
      }
    } else if (normalizedAge <= 40) {
      if (normalizedStress === 'high') {
        recommendedSleepHours = '8 hours';
        sleepTips = 'Practice stress-reduction techniques and maintain a consistent sleep schedule.';
      } else {
        recommendedSleepHours = '7-8 hours';
        sleepTips = 'Maintain a balanced sleep schedule and create a relaxing bedtime routine.';
      }
    } else {
      recommendedSleepHours = '7-8 hours';
      sleepTips = 'Focus on sleep quality and maintain a regular sleep schedule for healthy aging.';
    }

    const { error: supabaseError } = await supabase
      .from('sleep_analysis')
      .insert([
        {
          age: normalizedAge,
          sleep_quality: normalizedQuality,
          stress_level: normalizedStress,
          recommended_sleep_hours: recommendedSleepHours,
          sleep_tips: sleepTips
        }
      ]);

    if (supabaseError) {
      console.error('Supabase error:', supabaseError);
      // Continue even if storage fails
    }

    return NextResponse.json({
      age: normalizedAge,
      sleepQuality: normalizedQuality,
      stressLevel: normalizedStress,
      recommended_sleep_hours: recommendedSleepHours,
      sleep_tips: sleepTips
    });

  } catch (error) {
    console.error('Sleep analysis error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
