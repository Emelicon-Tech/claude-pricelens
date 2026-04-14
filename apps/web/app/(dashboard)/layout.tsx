'use client';

import { useEffect, useState, createContext, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { BarChart3, Home, ShoppingCart, Receipt, User, LogOut, ChevronDown, Bell, Settings, TrendingDown, CreditCard } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  role: string;
  state?: { name: string };
  city?: { name: string };
  subscription?: { plan: string; status: string };
}

const UserContext = createContext<UserData | null>(null);
export const useUser = () => useContext(UserContext);

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: Home },
  { label: 'Price Compare', href: '/dashboard/analytics', icon: TrendingDown },
  { label: 'Shopping Lists', href: '/dashboard/shopping-lists', icon: ShoppingCart },
  { label: 'Expenses', href: '/dashboard/expenses', icon: Receipt },
  { label: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  { label: 'Profile', href: '/dashboard/profile', icon: User },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/auth/me`, { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => {
        if (data.error) throw new Error(data.error);
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        router.push('/login');
      });
  }, [router]);

  const handleLogout = async () => {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    router.push('/login');
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-primary-950)',
        color: '#fff',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <img src="/logo.png" alt="PriceLens Logo" style={{ height: '64px', width: 'auto', objectFit: 'contain', borderRadius: '0.75rem' }} />
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              <span style={{ color: 'var(--color-primary-400)' }}>Price</span>Lens
            </div>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <UserContext.Provider value={user}>
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-primary-950)' }}>
        {/* ── Sidebar ── */}
        <aside style={{
          width: sidebarCollapsed ? '70px' : '260px',
          background: 'rgba(0, 0, 0, 0.3)',
          borderRight: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.5rem 0',
          transition: 'width 0.2s ease',
          overflow: 'hidden',
          flexShrink: 0,
        }}>
          {/* Logo */}
          <div style={{ padding: '0 1.25rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img src="/logo.png" alt="PriceLens Logo" style={{ height: sidebarCollapsed ? '32px' : '36px', width: 'auto', objectFit: 'contain', borderRadius: '0.4rem' }} />
            {!sidebarCollapsed && (
              <span style={{ fontWeight: 800, fontSize: '1.4rem', color: '#fff', whiteSpace: 'nowrap' }}>
                <span style={{ color: 'var(--color-primary-400)' }}>Price</span>Lens
              </span>
            )}
          </div>

          {/* Nav items */}
          <nav style={{ flex: 1 }}>
            {NAV_ITEMS.map(item => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1.25rem',
                  color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.5)',
                  background: isActive ? 'rgba(52, 211, 153, 0.1)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--color-primary-400)' : '3px solid transparent',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 600 : 400,
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}>
                  <Icon size={18} />
                  {!sidebarCollapsed && item.label}
                </Link>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div style={{ padding: '0 1.25rem' }}>
            {!sidebarCollapsed && user?.subscription && (
              <div style={{
                padding: '0.75rem',
                background: 'rgba(52, 211, 153, 0.08)',
                border: '1px solid rgba(52, 211, 153, 0.15)',
                borderRadius: '0.75rem',
                marginBottom: '1rem',
              }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-primary-300)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, marginBottom: '0.25rem' }}>
                  {user.subscription.plan} Plan
                </div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                  {user.subscription.plan === 'FREE' ? 'Upgrade for unlimited access' : 'Active subscription'}
                </div>
              </div>
            )}

            <button onClick={handleLogout} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem',
              width: '100%',
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.5)',
              fontSize: '0.9rem',
              cursor: 'pointer',
              borderRadius: '0.5rem',
              transition: 'color 0.15s ease',
            }}>
              <LogOut size={18} />
              {!sidebarCollapsed && 'Sign Out'}
            </button>
          </div>
        </aside>

        {/* ── Main content ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
          {/* Top bar */}
          <header style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 2rem',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(0,0,0,0.15)',
          }}>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                {NAV_ITEMS.find(i => i.href === pathname)?.label || 'Dashboard'}
              </h1>
              {user?.city && user?.state && (
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', margin: '0.25rem 0 0 0' }}>
                  📍 {user.city.name}, {user.state.name}
                </p>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '36px', height: '36px', background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%',
                color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
              }}>
                <Bell size={16} />
              </button>

              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.4rem 0.75rem', borderRadius: '2rem',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-primary-400), var(--color-primary-600))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '0.75rem', fontWeight: 700,
                }}>
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 500 }}>
                  {user?.firstName}
                </span>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main style={{ flex: 1, padding: '2rem' }}>
            {children}
          </main>
        </div>
      </div>
    </UserContext.Provider>
  );
}
