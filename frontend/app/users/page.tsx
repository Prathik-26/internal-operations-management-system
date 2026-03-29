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
    } catch {
      setError("Failed to create user. Email may already exist.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || !user) return null;

  return (
    <AppShell>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Users</h1>

      {/* Create user form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-sm font-medium text-gray-700 mb-4">Create User</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="border border-gray-300 rounded px-3 py-2 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="border border-gray-300 rounded px-3 py-2 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={role}
            onChange={(e) =>
              setRole(e.target.value as "admin" | "manager" | "staff")
            }
            className="border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="mt-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded transition disabled:opacity-50"
        >
          {submitting ? "Creating..." : "Create User"}
        </button>
      </div>

      {/* Users list */}
      {fetching ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                  Email
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                  Role
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3 text-gray-700">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`capitalize text-xs px-2 py-1 rounded-full font-medium ${
                      u.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : u.role === "manager"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {new Date(u.createdAt).toLocaleDateString()}
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
