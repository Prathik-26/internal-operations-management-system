"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import type { AuditLog } from "@/types";
import AppShell from "@/components/layout/AppShell";

export default function AuditPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
    if (!isLoading && user && user.role !== "admin") router.push("/dashboard");
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user?.role === "admin") {
      api
        .get<AuditLog[]>("/audit-logs")
        .then(({ data }) => setLogs(data))
        .finally(() => setFetching(false));
    }
  }, [user]);

  const actionColors: Record<string, string> = {
    CREATE: "bg-emerald-50 text-emerald-700 border-emerald-200",
    UPDATE: "bg-sky-50 text-sky-700 border-sky-200",
    DELETE: "bg-red-50 text-red-700 border-red-200",
  };

  const getActionStyle = (action: string) => {
    const key = Object.keys(actionColors).find((k) => action.toUpperCase().includes(k));
    return key ? actionColors[key] : "bg-slate-50 text-slate-600 border-slate-200";
  };

  if (isLoading || !user) return null;

  return (
    <AppShell>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Audit Logs</h1>

      {fetching ? (
        <div className="flex items-center gap-2 text-sm text-slate-400 py-8 justify-center">
          <div className="w-4 h-4 border-2 border-slate-300 border-t-violet-500 rounded-full animate-spin" />
          Loading...
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-sm text-slate-500">No audit logs yet</p>
          <p className="text-xs text-slate-400 mt-1">Activity will appear here as it happens</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Performed By
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Target ID
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-mono font-medium px-2.5 py-1 rounded-md border ${getActionStyle(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 text-xs font-mono">
                    {log.performedBy.slice(0, 8)}...
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 text-xs font-mono">
                    {log.targetId.slice(0, 8)}...
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}
