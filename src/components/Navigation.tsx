"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, SVGProps } from "react";
import { useAuth } from "@/components/AuthProvider";
import { HomeIcon, LayersIcon, BookIcon, ScrollIcon } from "@/components/icons";

// The aleph is the subject of the app, so it stays as a typographic glyph
// rather than an icon.
function AlephGlyph({ className }: { className?: string }) {
  return <span className={`hebrew leading-none ${className ?? ""}`}>א</span>;
}

type NavIcon = ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;

const navItems: { href: string; label: string; icon: NavIcon }[] = [
  { href: "/", label: "Dashboard", icon: HomeIcon },
  { href: "/alefbet", label: "Alefbet", icon: AlephGlyph as NavIcon },
  { href: "/woordenschat", label: "Woordenschat", icon: LayersIcon },
  { href: "/grammatica", label: "Grammatica", icon: BookIcon },
  { href: "/bijbel", label: "Bijbeltekst", icon: ScrollIcon },
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
              const ItemIcon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "gradient-green text-white shadow-md shadow-primary/30"
                      : "text-green-light/70 hover:bg-surface-light hover:text-green-light"
                  }`}
                >
                  <ItemIcon className="w-4 h-4" />
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
        const ItemIcon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
            className={`p-2.5 rounded-lg ${
              isActive
                ? "gradient-green text-white"
                : "text-green-light/60 hover:bg-surface-light"
            }`}
          >
            <ItemIcon className="w-5 h-5" />
          </Link>
        );
      })}
    </div>
  );
}
