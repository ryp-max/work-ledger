import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { GuestbookInputSchema, type GuestbookEntry } from '@/lib/schemas';

const DATA_FILE = path.join(process.cwd(), 'data', 'guestbook.json');

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // requests
const RATE_WINDOW = 60 * 1000; // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return false;
  }
  
  if (record.count >= RATE_LIMIT) {
    return true;
  }
  
  record.count++;
  return false;
}

function ensureDataFile(): GuestbookEntry[] {
  const dataDir = path.dirname(DATA_FILE);
  
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ entries: [] }));
    return [];
  }
  
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    return data.entries || [];
  } catch {
    return [];
  }
}

function saveEntries(entries: GuestbookEntry[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ entries }, null, 2));
}

export async function GET() {
  const entries = ensureDataFile();
  
  // Return newest first
  const sorted = [...entries].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  return NextResponse.json({ entries: sorted });
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown';
  
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }
  
  try {
    const body = await request.json();
    
    // Validate input
    const result = GuestbookInputSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }
    
    // Check honeypot
    if (result.data.honeypot) {
      // Silently reject spam
      return NextResponse.json({ entry: null });
    }
    
    const entries = ensureDataFile();
    
    const newEntry: GuestbookEntry = {
      id: `entry-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      name: result.data.name.trim(),
      message: result.data.message.trim(),
      url: result.data.url?.trim() || '',
      timestamp: new Date().toISOString(),
    };
    
    entries.push(newEntry);
    saveEntries(entries);
    
    return NextResponse.json({ entry: newEntry });
  } catch {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
