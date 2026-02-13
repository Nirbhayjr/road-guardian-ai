import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, X, Shield, MapPin, LogOut, User, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const isAdmin = user?.role === 'admin';
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute && isAdmin) return null; // Admin has its own sidebar

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/map', label: 'Map' },
    ...(isAuthenticated
      ? [
          { to: '/report', label: 'Report Pothole' },
          { to: '/my-reports', label: 'My Reports' },
        ]
      : []),
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <MapPin className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold">SmartRoad AI</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to}>
              <Button
                variant={location.pathname === l.to ? 'secondary' : 'ghost'}
                size="sm"
              >
                {l.label}
              </Button>
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="outline" size="sm">
                    <LayoutDashboard className="mr-1 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
              )}
              <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5 text-sm">
                <User className="h-4 w-4" />
                <span>{user?.name}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
              <Link to="/admin/login">
                <Button variant="outline" size="sm">
                  <Shield className="mr-1 h-4 w-4" />
                  Admin
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border/50 bg-card p-4 md:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}>
                <Button variant={location.pathname === l.to ? 'secondary' : 'ghost'} className="w-full justify-start">
                  {l.label}
                </Button>
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full justify-start">
                      <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" className="w-full justify-start" onClick={() => { logout(); setMobileOpen(false); }}>
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">Login</Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full justify-start">Sign Up</Button>
                </Link>
                <Link to="/admin/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="mr-2 h-4 w-4" /> Admin Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
