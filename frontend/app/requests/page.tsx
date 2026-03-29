"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import type { RequestItem, PaginatedResult } from "@/types";
import AppShell from "@/components/layout/AppShell";

export default function RequestsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [fetching, setFetching] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isManagerOrAdmin = user?.role === "admin" || user?.role === "manager";

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user) return;
    void fetchRequests();
  }, [user]);

  const fetchRequests = async () => {
    try {
      if (isManagerOrAdmin) {
        const { data } =
          await api.get<PaginatedResult<RequestItem>>("/requests");
        setRequests(data.data);
      } else {
        const { data } = await api.get<RequestItem[]>("/requests/me");
        setRequests(data);
      }
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description) return;
    setSubmitting(true);
    setError("");
    try {
      await api.post("/requests", { title, description });
      setTitle("");
      setDescription("");
      void fetchRequests();
    } catch {
      setError("Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAction = async (id: string, action: "approve" | "reject") => {
    await api.patch(`/requests/${id}/${action}`);
    void fetchRequests();
  };

  const statusColors: Record<string, string> = {
    submitted: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  if (isLoading || !user) return null;

  return (
    <AppShell>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        {isManagerOrAdmin ? "All Requests" : "My Requests"}
      </h1>

      {/* Submit form — visible to all roles */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-sm font-medium text-gray-700 mb-4">
          Submit New Request
        </h2>
        <div className="space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded transition disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </div>

      {/* Requests list */}
      {fetching ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : requests.length === 0 ? (
        <p className="text-sm text-gray-400">No requests yet.</p>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white border border-gray-200 rounded-lg p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {req.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {req.description}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusColors[req.status]}`}
                >
                  {req.status}
                </span>
              </div>

              {isManagerOrAdmin && req.status === "submitted" && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleAction(req.id, "approve")}
                    className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(req.id, "reject")}
                    className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded transition"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
