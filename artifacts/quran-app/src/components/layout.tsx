import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Home, Compass, Target, LineChart, Bookmark } from "lucide-react";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/explore", label: "Explore", icon: Compass },
    { href: "/quiz", label: "Quiz", icon: Target },
    { href: "/progress", label: "Progress", icon: LineChart },
    { href: "/bookmarks", label: "Saved", icon: Bookmark },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground pb-16 md:pb-0 md:flex-row">
      {/* Mobile Top Bar */}
      <header className="md:hidden sticky top-0 z-50 bg-primary text-primary-foreground p-4 shadow-md">
        <h1 className="text-xl font-bold text-center">Quran Quest</h1>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-sidebar border-r border-sidebar-border h-[100dvh] sticky top-0">
        <div className="p-6 bg-primary text-primary-foreground">
          <h1 className="text-2xl font-bold tracking-tight">Quran Quest</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-primary text-primary-foreground shadow-sm' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'}`}>
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-x-hidden">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-card-border pb-safe flex justify-around items-center z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 p-3 flex-1 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
              <Icon size={22} className={isActive ? 'drop-shadow-md' : ''} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
