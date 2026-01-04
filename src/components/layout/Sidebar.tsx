import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Link2, Key, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo.png';

const navigation = [
  { name: 'Panel de Control', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Conexiones', href: '/connections', icon: Link2 },
  { name: 'Claves API', href: '/api-keys', icon: Key },
  { name: 'Facturación', href: '/billing', icon: CreditCard },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <aside
      className={cn(
        'flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar',
        className
      )}
    >
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <img src={logo} alt="FinSnap" className="h-8 w-auto" />
        <span className="text-lg font-semibold text-sidebar-foreground">
          Connect
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-primary'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-sidebar-border px-3 py-4">
        <p className="px-3 text-xs text-muted-foreground">
          FinSnap Connect v1.0
        </p>
      </div>
    </aside>
  );
}
