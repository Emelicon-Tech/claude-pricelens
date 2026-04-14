'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, MapPin, User, Mail, Lock, Phone, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface State {
  id: string;
  name: string;
  code: string;
  region: string;
}

interface City {
  id: string;
  name: string;
  slug: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Location data
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);

  // Form data
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    stateId: '',
    cityId: '',
  });

  // Fetch states on mount
  useEffect(() => {
    fetch(`${API_URL}/locations/states`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setStates(data);
        setLoadingStates(false);
      })
      .catch(() => setLoadingStates(false));
  }, []);

  // Fetch cities when state changes
  useEffect(() => {
    if (!form.stateId) {
      setCities([]);
      return;
    }
    setLoadingCities(true);
    setForm(prev => ({ ...prev, cityId: '' }));
    fetch(`${API_URL}/locations/states/${form.stateId}/cities`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setCities(data);
        setLoadingCities(false);
      })
      .catch(() => setLoadingCities(false));
  }, [form.stateId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Required for httpOnly cookies
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setSuccess(true);
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.85rem 1rem 0.85rem 2.75rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '0.75rem',
    color: '#fff',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    paddingLeft: '2.75rem',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 1rem center',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const iconWrap: React.CSSProperties = {
    position: 'absolute',
    left: '0.85rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'rgba(255, 255, 255, 0.4)',
    pointerEvents: 'none',
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-primary-950)' }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ textAlign: 'center', color: '#fff' }}
        >
          <CheckCircle2 size={64} color="#34d399" style={{ marginBottom: '1.5rem' }} />
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>Welcome to PriceLens!</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>Redirecting to your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--color-primary-950)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        right: '-10%',
        width: '60vw',
        height: '60vw',
        background: 'radial-gradient(circle, rgba(52, 211, 153, 0.08) 0%, transparent 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
      }} />

      {/* Left panel — Branding */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '4rem',
        position: 'relative',
        zIndex: 1,
      }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem', textDecoration: 'none' }}>
          <img src="/logo.png" alt="PriceLens Logo" style={{ height: '64px', width: 'auto', objectFit: 'contain', borderRadius: '0.75rem' }} />
          <span style={{ fontWeight: 800, fontSize: '2.5rem', letterSpacing: '-0.03em', color: '#fff' }}>
            <span style={{ color: 'var(--color-primary-400)' }}>Price</span>Lens
          </span>
        </Link>

        <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.15, color: '#fff', marginBottom: '1.5rem' }}>
          Join Africa's first<br />
          <span className="text-gradient">retail intelligence</span><br />
          platform.
        </h1>

        <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: '480px' }}>
          Compare prices across 117+ supermarkets and open markets in 6 Nigerian states. AI-powered insights help you save up to 30% on monthly groceries.
        </p>

        <div style={{ marginTop: '3rem', display: 'flex', gap: '2rem' }}>
          <div>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>Free</span>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-primary-300)', marginTop: '0.25rem' }}>Forever plan</p>
          </div>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.15)' }} />
          <div>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>30s</span>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-primary-300)', marginTop: '0.25rem' }}>To sign up</p>
          </div>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.15)' }} />
          <div>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>100+</span>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-primary-300)', marginTop: '0.25rem' }}>Products tracked</p>
          </div>
        </div>
      </div>

      {/* Right panel — Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        zIndex: 1,
      }}>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-panel"
          style={{
            width: '100%',
            maxWidth: '480px',
            padding: '2.5rem',
            borderRadius: '1.25rem',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
            Create your account
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--color-primary-400)', fontWeight: 600 }}>Sign in</Link>
          </p>

          {error && (
            <div style={{
              padding: '0.75rem 1rem',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '0.75rem',
              color: '#fca5a5',
              fontSize: '0.9rem',
              marginBottom: '1.5rem',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Name row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={labelStyle}>First Name</label>
                <div style={{ position: 'relative' }}>
                  <span style={iconWrap}><User size={16} /></span>
                  <input name="firstName" value={form.firstName} onChange={handleChange} required
                    placeholder="Adamu" style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Last Name</label>
                <div style={{ position: 'relative' }}>
                  <span style={iconWrap}><User size={16} /></span>
                  <input name="lastName" value={form.lastName} onChange={handleChange} required
                    placeholder="Okafor" style={inputStyle} />
                </div>
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <span style={iconWrap}><Mail size={16} /></span>
                <input name="email" type="email" value={form.email} onChange={handleChange} required
                  placeholder="you@example.com" style={inputStyle} />
              </div>
            </div>

            {/* Phone */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Phone (Optional)</label>
              <div style={{ position: 'relative' }}>
                <span style={iconWrap}><Phone size={16} /></span>
                <input name="phone" value={form.phone} onChange={handleChange}
                  placeholder="+2348012345678" style={inputStyle} />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <span style={iconWrap}><Lock size={16} /></span>
                <input name="password" type={showPassword ? 'text' : 'password'} value={form.password}
                  onChange={handleChange} required minLength={8}
                  placeholder="Min. 8 characters" style={inputStyle} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                  position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer',
                }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* State & City */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={labelStyle}>State</label>
                <div style={{ position: 'relative' }}>
                  <span style={iconWrap}><MapPin size={16} /></span>
                  <select name="stateId" value={form.stateId} onChange={handleChange} required
                    style={selectStyle} disabled={loadingStates}>
                    <option value="">{loadingStates ? 'Loading...' : 'Select state'}</option>
                    {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>City</label>
                <div style={{ position: 'relative' }}>
                  <span style={iconWrap}><MapPin size={16} /></span>
                  <select name="cityId" value={form.cityId} onChange={handleChange} required
                    style={selectStyle} disabled={!form.stateId || loadingCities}>
                    <option value="">{loadingCities ? 'Loading...' : 'Select city'}</option>
                    {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%',
              padding: '1rem',
              background: loading ? 'rgba(52, 211, 153, 0.5)' : 'linear-gradient(135deg, var(--color-primary-400), var(--color-primary-600))',
              border: 'none',
              borderRadius: '0.75rem',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease',
            }}>
              {loading && <Loader2 size={18} className="spin" />}
              {loading ? 'Creating Account...' : 'Create Free Account'}
            </button>
          </form>

          <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', textAlign: 'center', lineHeight: 1.5 }}>
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
