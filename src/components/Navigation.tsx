"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

const navItems = [
  { href: "/", label: "Dashboard", icon: "🏠" },
  { href: "/alefbet", label: "Alefbet", icon: "א" },
  { href: "/woordenschat", label: "Woordenschat", icon: "📚" },
  { href: "/grammatica", label: "Grammatica", icon: "📖" },
  { href: "/bijbel", label: "Bijbeltekst", icon: "📜" },
];

export default function Navigation() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-surface border-b border-green-darkest/50 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="hebrew text-2xl text-green">עב</span>
            <span className="font-bold text-lg text-green-lightest">
              Bijbels Hebreeuws
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "gradient-green text-white shadow-md shadow-green-darkest/50"
                      : "text-green-light/70 hover:bg-surface-light hover:text-green-light"
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-green-light/60 truncate max-w-[180px]">
                  {user.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-green-light/70 hover:text-green-light px-3 py-1.5 rounded-lg hover:bg-surface-light transition-colors"
                >
                  Uitloggen
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-sm text-green-light/70 hover:text-green-light px-3 py-1.5 rounded-lg hover:bg-surface-light transition-colors"
              >
                Inloggen
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            {user ? (
              <button
                onClick={() => signOut()}
                className="text-xs text-green-light/60 hover:text-green-light px-2 py-1 rounded-lg hover:bg-surface-light transition-colors"
              >
                Uitloggen
              </button>
            ) : (
              <Link
                href="/login"
                className="text-xs text-green-light/60 hover:text-green-light px-2 py-1 rounded-lg hover:bg-surface-light transition-colors"
              >
                Inloggen
              </Link>
            )}
            <MobileMenu pathname={pathname} />
          </div>
        </div>
      </div>
    </nav>
  );
}

function MobileMenu({ pathname }: { pathname: string }) {
  return (
    <div className="flex gap-1">
      {navItems.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`p-2 rounded-lg text-lg ${
              isActive
                ? "gradient-green text-white"
                : "text-green-light/50 hover:bg-surface-light"
            }`}
            title={item.label}
          >
            {item.icon}
          </Link>
        );
      })}
    </div>
  );
}
