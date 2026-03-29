"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { ReactNode } from "react";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    roles: ["admin", "manager", "staff"],
  },
  {
    label: "My Requests",
    href: "/requests",
    roles: ["admin", "manager", "staff"],
  },
  { label: "Users", href: "/users", roles: ["admin"] },
  { label: "Audit Logs", href: "/audit", roles: ["admin"] },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const visibleItems = navItems.filter(
    (item) => user && item.roles.includes(user.role),
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-6 py-5 border-b border-gray-200">
          <span className="text-sm font-semibold text-gray-800">OMS</span>
          <p className="text-xs text-gray-400 mt-0.5 capitalize">
            {user?.role}
          </p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {visibleItems.map((item) => (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                pathname === item.href
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded text-sm text-gray-500 hover:bg-gray-100 transition"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
