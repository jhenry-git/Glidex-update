import { ReactNode } from 'react';
import { Lock } from 'lucide-react';

interface PageShellProps {
  children: ReactNode;
}

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-[#F4F6F8]">
      {/* Minimal header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#111111] flex items-center justify-center">
              <span className="text-white text-xs font-bold">GX</span>
            </div>
            <span className="text-sm font-semibold text-gray-900 tracking-tight">
              GlideX
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Lock className="w-3 h-3" />
            <span className="font-mono">Secure Signing</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6">{children}</main>
    </div>
  );
}