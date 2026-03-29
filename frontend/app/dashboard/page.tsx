"use client";

import AppShell from "@/components/layout/AppShell";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const cards = [
  {
    label: "My Requests",
    href: "/requests",
    desc: "Submit and track your requests",
    gradient: "from-violet-500 to-indigo-600",
    shadow: "shadow-violet-500/20",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    label: "Users",
    href: "/users",
    desc: "Manage system users",
    adminOnly: true,
    gradient: "from-amber-500 to-orange-600",
    shadow: "shadow-amber-500/20",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    label: "Audit Logs",
    href: "/audit",
    desc: "View system activity",
    adminOnly: true,
    gradient: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/20",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
];

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          {greeting()}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Logged in as{" "}
          <span className="font-medium text-slate-700 capitalize">{user.role}</span>
          {" "}&middot; Here&apos;s your overview
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
        {cards
          .filter((item) => !item.adminOnly || user.role === "admin")
          .map((item) => (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`group relative bg-white rounded-xl border border-slate-200/80 p-6 text-left hover:shadow-lg hover:${item.shadow} hover:-translate-y-0.5 transition-all duration-300 cursor-pointer`}
            >
              <div className={`w-11 h-11 rounded-xl bg-linear-to-br ${item.gradient} flex items-center justify-center text-white mb-4 shadow-lg ${item.shadow} group-hover:scale-105 transition-transform duration-300`}>
                {item.icon}
              </div>
              <p className="text-sm font-semibold text-slate-800 group-hover:text-slate-900">
                {item.label}
              </p>
              <p className="text-xs text-slate-400 mt-1">{item.desc}</p>

              {/* Arrow indicator */}
              <div className="absolute top-6 right-5 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all duration-300">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
      </div>
    </AppShell>
  );
}
