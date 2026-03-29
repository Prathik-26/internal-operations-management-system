"use client";

import AppShell from "@/components/layout/AppShell";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;

  return (
    <AppShell>
      <h1 className="text-2xl font-semibold text-gray-800 mb-1">Dashboard</h1>
      <p className="text-sm text-gray-500 mb-8">
        Welcome back — logged in as{" "}
        <span className="font-medium capitalize">{user.role}</span>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "My Requests",
            href: "/requests",
            desc: "Submit and track your requests",
          },
          {
            label: "Users",
            href: "/users",
            desc: "Manage system users",
            adminOnly: true,
          },
          {
            label: "Audit Logs",
            href: "/audit",
            desc: "View system activity",
            adminOnly: true,
          },
        ]
          .filter((item) => !item.adminOnly || user.role === "admin")
          .map((item) => (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-left hover:shadow-md transition"
            >
              <p className="text-sm font-medium text-gray-800">{item.label}</p>
              <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
            </button>
          ))}
      </div>
    </AppShell>
  );
}
