'use client';

import { useState, useEffect } from 'react';
import { LedgerPage } from '@/components/LedgerPage';
import type { GuestbookEntry } from '@/lib/schemas';

export default function GuestbookPage() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [url, setUrl] = useState('');
  const [honeypot, setHoneypot] = useState('');
  
  // Fetch entries
  useEffect(() => {
    fetch('/api/guestbook')
      .then(res => res.json())
      .then(data => {
        setEntries(data.entries || []);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message, url, honeypot }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to sign guestbook');
      }
      
      setEntries(prev => [data.entry, ...prev]);
      setName('');
      setMessage('');
      setUrl('');
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  return (
    <LedgerPage>
      <header className="mb-8 pb-6 border-b border-[var(--tape-border)]">
        <h1 className="font-serif text-4xl font-semibold text-[var(--ink)] mb-2">
          Sign the Ledger
        </h1>
        <p className="text-[var(--ink-light)]">
          Leave your mark in this guestbook
        </p>
      </header>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-10 p-6 bg-[var(--tape)] rounded-lg">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[var(--ink)] mb-1">
              Name *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={100}
              className="w-full px-3 py-2 bg-[var(--paper)] border border-[var(--tape-border)] rounded 
                         focus:outline-none focus:border-[var(--stamp)] transition-colors"
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-[var(--ink)] mb-1">
              Message *
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              maxLength={500}
              rows={3}
              className="w-full px-3 py-2 bg-[var(--paper)] border border-[var(--tape-border)] rounded 
                         focus:outline-none focus:border-[var(--stamp)] transition-colors resize-none"
            />
          </div>
          
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-[var(--ink)] mb-1">
              Website (optional)
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://"
              className="w-full px-3 py-2 bg-[var(--paper)] border border-[var(--tape-border)] rounded 
                         focus:outline-none focus:border-[var(--stamp)] transition-colors"
            />
          </div>
          
          {/* Honeypot field - hidden from users */}
          <input
            type="text"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />
          
          {error && (
            <p className="text-[var(--stamp)] text-sm">{error}</p>
          )}
          
          {success && (
            <p className="text-green-600 text-sm">Thank you for signing the ledger!</p>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-[var(--ink)] text-[var(--paper)] rounded 
                       hover:bg-[var(--ink-light)] transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Signing...' : 'Sign the Ledger'}
          </button>
        </div>
      </form>
      
      {/* Entries */}
      <div className="space-y-6">
        <h2 className="font-serif text-xl font-semibold text-[var(--ink)] pb-2 border-b border-[var(--tape-border)]">
          Previous Entries
        </h2>
        
        {isLoading ? (
          <p className="text-[var(--ink-muted)]">Loading entries...</p>
        ) : entries.length === 0 ? (
          <p className="text-[var(--ink-muted)]">No entries yet. Be the first to sign!</p>
        ) : (
          <ul className="space-y-4">
            {entries.map(entry => (
              <li 
                key={entry.id} 
                className="pb-4 border-b border-[var(--tape-border)] last:border-0"
              >
                <div className="flex items-baseline justify-between mb-1">
                  <span className="font-medium text-[var(--ink)]">
                    {entry.url ? (
                      <a 
                        href={entry.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[var(--stamp)] hover:text-[var(--stamp-light)] underline underline-offset-2"
                      >
                        {entry.name}
                      </a>
                    ) : (
                      entry.name
                    )}
                  </span>
                  <span className="text-xs text-[var(--ink-muted)]">
                    {formatDate(entry.timestamp)}
                  </span>
                </div>
                <p className="text-[var(--ink-light)] whitespace-pre-wrap">
                  {entry.message}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </LedgerPage>
  );
}
