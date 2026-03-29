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
          : "Failed to submit request. Please try again";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const [actionError, setActionError] = useState("");

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setActionError("");
    try {
      await api.patch(`/requests/${id}/${action}`);
      void fetchRequests();
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
          : `Failed to ${action} request. Please try again`;
      setActionError(msg);
    }
  };

  const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
    submitted: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
    approved: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
    rejected: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-400" },
  };

  if (isLoading || !user) return null;

  return (
    <AppShell>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        {isManagerOrAdmin ? "All Requests" : "My Requests"}
      </h1>

      {actionError && (
        <div className="flex items-center gap-2.5 bg-red-50 border border-red-200/80 text-red-600 text-sm px-4 py-3 rounded-xl mb-4 animate-fade-in">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {actionError}
        </div>
      )}

      {/* Submit form */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Submit New Request
        </h2>
        <div className="space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-400 focus:bg-white transition"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows={3}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-400 focus:bg-white transition resize-none"
          />
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all duration-200 shadow-md shadow-violet-500/20 hover:shadow-lg hover:shadow-violet-500/30 disabled:opacity-50 disabled:shadow-none cursor-pointer"
          >
            {submitting ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </div>

      {/* Requests list */}
      {fetching ? (
        <div className="flex items-center gap-2 text-sm text-slate-400 py-8 justify-center">
          <div className="w-4 h-4 border-2 border-slate-300 border-t-violet-500 rounded-full animate-spin" />
          Loading...
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-sm text-slate-500">No requests yet</p>
          <p className="text-xs text-slate-400 mt-1">Submit your first request above</p>
        </div>
      ) : (
        <div className="space-y-3 stagger-children">
          {requests.map((req) => {
            const status = statusConfig[req.status];
            return (
              <div
                key={req.id}
                className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{req.title}</p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{req.description}</p>
                  </div>
                  <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium capitalize ${status.bg} ${status.text} ml-3 shrink-0`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                    {req.status}
                  </span>
                </div>

                {isManagerOrAdmin && req.status === "submitted" && (
                  <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => handleAction(req.id, "approve")}
                      className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors font-medium cursor-pointer"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(req.id, "reject")}
                      className="text-xs bg-white border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors font-medium cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
