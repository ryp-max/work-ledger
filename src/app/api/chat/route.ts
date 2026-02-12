import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const RACHEL_SYSTEM_PROMPT = `You are Rachel, a warm and insightful AI assistant for the Work Ledger—a personal workspace that combines productivity, creativity, and reflection. You help users with their work, weekly logs, goals, ideas, and life updates. You're supportive, thoughtful, and have a gentle sense of humor. You understand the context of building personal systems, documenting creative processes, and finding calm in the details. Keep responses concise but meaningful. Use "I" when speaking as Rachel and address the user directly.`;

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Add OPENAI_API_KEY to your environment.' },
        { status: 503 }
      );
    }

    const { messages } = await request.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'messages array is required' },
        { status: 400 }
      );
    }

    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: RACHEL_SYSTEM_PROMPT },
        ...messages,
      ],
      max_tokens: 1024,
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content ?? '';
    return NextResponse.json({ content });
  } catch (error) {
    console.error('Chat API error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Chat failed: ${message}` },
      { status: 500 }
    );
  }
}
