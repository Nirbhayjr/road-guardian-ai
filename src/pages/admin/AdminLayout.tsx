import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Map, FileText, BarChart3, LogOut, MapPin } from 'lucide-react';
import { useEffect } from 'react';

const sidebarLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/map', label: 'City Map', icon: Map },
  { to: '/admin/reports', label: 'Reports', icon: FileText },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="dark flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col border-r border-sidebar-border bg-sidebar">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <MapPin className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          <span className="font-display font-bold text-sidebar-foreground">SmartRoad AI</span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {sidebarLinks.map(l => {
            const active = location.pathname === l.to;
            return (
              <Link key={l.to} to={l.to}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-2 ${active ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground/70 hover:text-sidebar-foreground'}`}
                >
                  <l.icon className="h-4 w-4" /> {l.label}
                </Button>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <div className="mb-2 px-3 text-xs text-sidebar-foreground/50">{user.name}</div>
          <Button variant="ghost" className="w-full justify-start gap-2 text-sidebar-foreground/70" onClick={() => { logout(); navigate('/'); }}>
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-60 flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
