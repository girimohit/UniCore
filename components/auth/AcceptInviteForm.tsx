'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Hash,
  Loader2
} from 'lucide-react';

interface AcceptInviteFormProps {
  token: string;
  tenantSlug: string;
  institutionName: string;
  role: string;
  email: string;
}

export default function AcceptInviteForm({ 
  token, 
  tenantSlug, 
  institutionName, 
  role,
  email 
}: AcceptInviteFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    identifier: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [identifier, setIdentifier] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/accept-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          identifier: formData.identifier
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setIdentifier(data.identifier);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center space-y-8">
        <div className="relative mx-auto w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
          <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping opacity-20"></div>
          <CheckCircle2 className="w-12 h-12 text-emerald-500" strokeWidth={2.5} />
        </div>
        
        <div className="space-y-3">
          <h2 className="text-3xl font-black tracking-tight text-foreground">Account Activated!</h2>
          <p className="text-muted-foreground font-medium px-4">
            Welcome to <span className="text-primary font-bold">{institutionName}</span>. 
            Your account is now ready to use.
          </p>
        </div>

        <div className="glass rounded-3xl p-6 border border-emerald-500/20 bg-emerald-500/5 text-left space-y-4">
          <div>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Your Login ID</p>
            <p className="text-3xl font-mono font-black text-emerald-700 tracking-tighter">{identifier}</p>
          </div>
          <p className="text-sm text-emerald-600/80 font-medium">
            Please use this ID along with your password to log in.
          </p>
        </div>

        <button
          onClick={() => router.push(`/${tenantSlug}/login`)}
          className="btn-primary w-full py-4 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 flex items-center justify-center gap-2 group transition-all"
        >
          Go to Login <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Complete Registration
        </div>
        <h1 className="text-4xl font-black tracking-tighter text-foreground sm:text-5xl leading-tight">
          Join <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{institutionName}</span>
        </h1>
        <p className="text-lg text-muted-foreground font-medium">
          Set up your profile and password to activate your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground ml-1">First Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                required
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                className="w-full bg-background/50 border border-border/60 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all shadow-inner"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground ml-1">Last Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                required
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                className="w-full bg-background/50 border border-border/60 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all shadow-inner"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-muted-foreground ml-1">
            {role === 'STUDENT' ? 'Roll Number' : 'Employee ID'}
          </label>
          <div className="relative group">
            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              required
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              placeholder={role === 'STUDENT' ? 'e.g. STU123' : 'e.g. FAC456'}
              className="w-full bg-background/50 border border-border/60 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all shadow-inner"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-muted-foreground ml-1">Password</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              required
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              minLength={8}
              className="w-full bg-background/50 border border-border/60 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all shadow-inner"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-muted-foreground ml-1">Confirm Password</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              required
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              minLength={8}
              className="w-full bg-background/50 border border-border/60 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all shadow-inner"
            />
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-start gap-3 animate-in fade-in zoom-in duration-300">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm font-bold text-destructive leading-tight">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-4 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Activating...
            </>
          ) : (
            <>
              Activate Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
