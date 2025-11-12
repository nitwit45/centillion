import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  LayoutDashboard,
  User,
  FileText,
  ClipboardList,
  LogOut,
  Menu,
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle
} from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      path: '/dashboard/profile',
      label: 'Profile',
      icon: <User className="h-5 w-5" />,
    },
    {
      path: '/dashboard/documents',
      label: 'Documents',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      path: '/dashboard/treatment-form',
      label: 'Treatment Form',
      icon: <ClipboardList className="h-5 w-5" />,
    },
  ];

  const getStatusBadge = () => {
    if (!user) return null;

    const statusConfig = {
      draft: { icon: <Clock className="h-3 w-3" />, label: 'Draft', variant: 'secondary' as const },
      submitted: { icon: <CheckCircle2 className="h-3 w-3" />, label: 'Submitted', variant: 'default' as const },
      under_review: { icon: <AlertCircle className="h-3 w-3" />, label: 'Under Review', variant: 'outline' as const },
      approved: { icon: <CheckCircle2 className="h-3 w-3" />, label: 'Approved', variant: 'default' as const },
      rejected: { icon: <XCircle className="h-3 w-3" />, label: 'Rejected', variant: 'destructive' as const },
    };

    const config = statusConfig[user.beautyFormStatus];
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`${mobile ? 'flex flex-col h-full' : ''} space-y-4`}>
      <div className="px-6 py-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Centillion Gateway
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Beauty Enhancement Portal</p>
      </div>

      {user && (
        <Card className="mx-4 p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-lg">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{user.fullName}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Status:</span>
              {getStatusBadge()}
            </div>
          </div>
        </Card>
      )}

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Button
              key={item.path}
              variant={isActive ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => {
                navigate(item.path);
                if (mobile) setSidebarOpen(false);
              }}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </Button>
          );
        })}
      </nav>

      <div className="px-4 pb-4">
        <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
          <span className="ml-3">Logout</span>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-muted/20">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 bg-background border-r">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="fixed inset-y-0 left-0 w-72 bg-background z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end p-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-background border-b px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="font-bold">Centillion Gateway</h1>
          <div className="w-10" /> {/* Spacer */}
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;

