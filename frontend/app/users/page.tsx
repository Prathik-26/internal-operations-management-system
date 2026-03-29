"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import type { User } from "@/types";
import AppShell from "@/components/layout/AppShell";

export default function UsersPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [fetching, setFetching] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "manager" | "staff">("staff");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
    if (!isLoading && user && user.role !== "admin") router.push("/dashboard");
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user?.role === "admin") void fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get<User[]>("/users");
      setUsers(data);
    } finally {
      setFetching(false);
    }
  };

  const handleCreate = async () => {
    if (!email || !password) return;
    setSubmitting(true);
    setError("");
    try {
      await api.post("/users", { email, password, role });
      setEmail("");
      setPassword("");
      setRole("staff");
      void fetchUsers();
    } catch (err: unknown) {
      const msg =
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "message" in err.response.data
          ? String(err.response.data.message)
          : "Failed to create user. Please try again";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const roleConfig: Record<string, { bg: string; text: string; dot: string }> = {
    admin: { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-400" },
    manager: { bg: "bg-sky-50", text: "text-sky-700", dot: "bg-sky-400" },
    staff: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
  };

  if (isLoading || !user) return null;

  return (
    <AppShell>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Users</h1>

      {/* Create user form */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Create User
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-400 focus:bg-white transition"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-400 focus:bg-white transition"
          />
          <select
            value={role}
            onChange={(e) =>
              setRole(e.target.value as "admin" | "manager" | "staff")
            }
            className="bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-400 focus:bg-white transition"
          >
            <option value="staff">Staff</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        <button
          onClick={handleCreate}
          disabled={submitting}
          className="mt-4 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all duration-200 shadow-md shadow-violet-500/20 hover:shadow-lg hover:shadow-violet-500/30 disabled:opacity-50 disabled:shadow-none cursor-pointer"
        >
          {submitting ? "Creating..." : "Create User"}
        </button>
      </div>

      {/* Users list */}
      {fetching ? (
        <div className="flex items-center gap-2 text-sm text-slate-400 py-8 justify-center">
          <div className="w-4 h-4 border-2 border-slate-300 border-t-violet-500 rounded-full animate-spin" />
          Loading...
        </div>
      ) : (
        <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((u) => {
                const rc = roleConfig[u.role];
                return (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 text-slate-700 font-medium">{u.email}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 capitalize text-xs px-2.5 py-1 rounded-full font-medium ${rc.bg} ${rc.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${rc.dot}`} />
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 text-xs">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}
