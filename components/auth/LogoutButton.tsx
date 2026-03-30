'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface LogoutButtonProps {
  className?: string;
  variant?: 'sidebar' | 'icon';
}

export function LogoutButton({ className = '', variant = 'sidebar' }: LogoutButtonProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      const tenant = window.location.pathname.split('/')[1] || '';
      router.push(`/${tenant}/login`);
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  if (variant === 'icon') {
    return (
      <button 
        onClick={handleLogout} 
        disabled={isLoggingOut}
        className={`flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors ${className}`}
        title="Sign Out"
      >
        <LogOut className={`w-5 h-5 ${isLoggingOut ? 'opacity-50' : ''}`} strokeWidth={2.5} />
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-all duration-300 group ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" strokeWidth={2.5} />
      {isLoggingOut ? 'Signing out...' : 'Sign Out'}
    </button>
  );
}
