'use client';

export function ChatGPTPage() {
  return (
    <div className="w-full h-full">
      <iframe
        src="https://chat.openai.com"
        className="w-full h-full border-0"
        title="ChatGPT"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
      />
    </div>
  );
}
