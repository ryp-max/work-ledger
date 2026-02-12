import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const RACHEL_SYSTEM_PROMPT = `You are Rachel, a warm and insightful AI assistant for the Work Ledger—a personal workspace that combines productivity, creativity, and reflection. You help users with their work, weekly logs, goals, ideas, and life updates. You're supportive, thoughtful, and have a gentle sense of humor. You understand the context of building personal systems, documenting creative processes, and finding calm in the details. Keep responses concise but meaningful. Use "I" when speaking as Rachel and address the user directly.`;

// Demo responses when no API key — Rachel still works!
function getDemoResponse(lastMessage: string): string {
  const lower = lastMessage.toLowerCase();
  if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey')) {
    return "Hi! 🙂 I'm Rachel, your assistant for the Work Ledger. I'm here to help with work, goals, ideas, or just to chat. What's on your mind?";
  }
  if (lower.includes('help') || lower.includes('what can you')) {
    return "I can help you plan your week, brainstorm ideas, reflect on projects, or just listen. Try asking me about your goals, work in progress, or anything you're thinking through. For full AI responses, add your OpenAI API key in Vercel → Project Settings → Environment Variables.";
  }
  if (lower.includes('goal') || lower.includes('plan')) {
    return "Goals are powerful when they're specific and meaningful. What's one thing you'd like to focus on this week? I find that writing it down—even briefly—helps make it real.";
  }
  if (lower.includes('work') || lower.includes('project')) {
    return "Tell me what you're working on! I'd love to help you think it through, break it down, or just be a sounding board.";
  }
  if (lower.includes('how') || lower.includes('why') || lower.includes('what')) {
    return "That's a great question. I'm in demo mode right now—add your OpenAI API key to get full AI responses. Until then, I'm here to encourage you: you've got this! 💪";
  }
  return "Thanks for sharing! I'm Rachel, and I'm here to help. Right now I'm in demo mode. For full AI-powered conversations, add your OpenAI API key in Vercel → Project Settings → Environment Variables. In the meantime, feel free to keep chatting—I'm listening!";
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'messages array is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    // Demo mode: no API key? Rachel still responds with helpful replies
    if (!apiKey) {
      const lastMsg = messages[messages.length - 1];
      const content = typeof lastMsg?.content === 'string' ? lastMsg.content : '';
      const demoContent = getDemoResponse(content);
      return NextResponse.json({ content: demoContent, demo: true });
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
