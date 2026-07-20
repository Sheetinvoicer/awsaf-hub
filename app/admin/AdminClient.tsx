'use client';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, MapPin, User, FileText, Clock } from 'lucide-react';

// Define the shape of our telemetry data
type ViewData = {
  id: string;
  userId: string | null;
  userEmail: string | null;
  path: string;
  country: string | null;
  city: string | null;
  isLoggedIn: boolean;
  createdAt: string;
};

export default function AdminClient({
  totalViews,
  recentViews,
  popularPages
}: {
  totalViews: number;
  recentViews: ViewData[];
  popularPages: { path: string; _count: { path: number } }[];
}) {
  const [selectedUser, setSelectedUser] = useState<ViewData | null>(null);

  return (
    <>
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="border-slate-200 p-6 shadow-sm">
          <p className="mb-1 text-sm font-medium text-slate-500">Total Page Views</p>
          <p className="text-3xl font-bold text-slate-900">{totalViews}</p>
        </Card>
        <Card className="border-slate-200 p-6 shadow-sm md:col-span-2">
          <p className="mb-3 text-sm font-medium text-slate-500">Most Popular Pages</p>
          <div className="space-y-2">
            {popularPages.map((page) => (
              <div key={page.path} className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">{page.path}</span>
                <span className="rounded bg-slate-100 px-2 py-1 text-sm font-bold text-slate-900">
                  {page._count.path} views
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="border-slate-200 p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-slate-900">Recent Activity</h3>
        <div className="space-y-3">
          {recentViews.map((view) => (
            <div
              key={view.id}
              className="flex items-center justify-between border-b border-slate-100 pb-2"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`rounded px-2 py-1 font-mono text-xs ${view.isLoggedIn ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}
                >
                  {view.isLoggedIn ? 'User' : 'Guest'}
                </span>
                <button
                  onClick={() => setSelectedUser(view)}
                  className="cursor-pointer text-sm font-medium text-slate-900 hover:text-blue-600 hover:underline"
                >
                  {view.path}
                </button>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <MapPin size={12} /> {view.city}, {view.country}
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(view.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* USER INFO POPUP */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedUser(null)}
        >
          <Card className="w-full max-w-sm p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">User Info</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-slate-400 hover:text-slate-900"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-slate-700">
                <User size={14} className="text-slate-400" />
                <span>
                  <strong>Email:</strong> {selectedUser.userEmail || 'Guest'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <MapPin size={14} className="text-slate-400" />
                <span>
                  <strong>Location:</strong> {selectedUser.city}, {selectedUser.country}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <FileText size={14} className="text-slate-400" />
                <span>
                  <strong>Page:</strong> {selectedUser.path}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Clock size={14} className="text-slate-400" />
                <span>
                  <strong>Time:</strong> {new Date(selectedUser.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <span
                  className={`rounded px-2 py-1 text-xs font-bold ${selectedUser.isLoggedIn ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}
                >
                  {selectedUser.isLoggedIn ? 'Logged In' : 'Anonymous Guest'}
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
