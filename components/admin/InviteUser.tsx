'use client';

import { useState } from 'react';
import { Mail, UserPlus, Link, AlertCircle, Copy, CheckCircle2 } from 'lucide-react';

export default function InviteUser({ tenantId }: { tenantId: string }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ url?: string; error?: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setCopied(false);

    try {
      const res = await fetch('/api/auth/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role, subdomain: tenantId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate invite');
      }

      setResult({ url: data.debug_link });
      setEmail('');
    } catch (err: any) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result?.url) {
      navigator.clipboard.writeText(result.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="glass rounded-3xl p-8 border border-border/50 flex flex-col relative overflow-hidden group w-full h-full shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-tl from-primary/5 to-transparent pointer-events-none"></div>
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
          <UserPlus className="w-5 h-5" strokeWidth={2.5} />
        </div>
        <h3 className="text-xl font-bold text-foreground">Invite Users</h3>
      </div>

      <form onSubmit={handleInvite} className="space-y-4 relative z-10 flex-1 flex flex-col">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-muted-foreground ml-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full bg-background/50 border border-border/60 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all placeholder:text-muted-foreground/60 shadow-inner"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-muted-foreground ml-1">Assign Role</label>
          <select 
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-background/50 border border-border/60 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all shadow-inner appearance-none cursor-pointer"
          >
            <option value="STUDENT">Student</option>
            <option value="FACULTY">Faculty</option>
            <option value="INSTITUTION_ADMIN">Sub-Admin</option>
          </select>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full mt-4 bg-primary text-primary-foreground font-bold text-sm py-2.5 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none flex auto justify-center items-center"
        >
          {loading ? 'Generating...' : 'Generate Invite Link'}
        </button>

        {result?.error && (
          <div className="mt-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-2 text-destructive">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p className="text-sm font-medium">{result.error}</p>
          </div>
        )}

        {result?.url && (
          <div className="mt-4 p-3 pb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col gap-2">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Invite generated
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 overflow-hidden bg-background/60 p-2 rounded-lg border border-border/50 text-xs text-muted-foreground font-mono truncate select-all">
                {result.url}
              </div>
              <button 
                type="button" 
                onClick={handleCopy}
                className="p-2 rounded-lg bg-emerald-500 text-white shadow-sm hover:bg-emerald-600 transition-colors"
                title="Copy Link"
              >
                {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
