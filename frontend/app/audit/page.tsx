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

  if (isLoading || !user) return null;

  return (
    <AppShell>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Audit Logs</h1>

      {fetching ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : logs.length === 0 ? (
        <p className="text-sm text-gray-400">No audit logs yet.</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                  Action
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                  Performed By
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                  Target ID
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs font-mono">
                    {log.performedBy.slice(0, 8)}...
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs font-mono">
                    {log.targetId.slice(0, 8)}...
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
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
