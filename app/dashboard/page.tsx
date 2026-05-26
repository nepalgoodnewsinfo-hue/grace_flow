"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

interface Visitor {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  visit_date: string;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [filteredVisitors, setFilteredVisitors] = useState<Visitor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    checkAuth();
    fetchVisitors();
  }, []);

  useEffect(() => {
    // Filter visitors based on search query
    const filtered = visitors.filter((visitor) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        visitor.first_name.toLowerCase().includes(searchLower) ||
        visitor.last_name.toLowerCase().includes(searchLower) ||
        visitor.email.toLowerCase().includes(searchLower) ||
        visitor.phone.includes(searchQuery)
      );
    });
    setFilteredVisitors(filtered);
  }, [searchQuery, visitors]);

  async function checkAuth() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      setUser(session.user);
    } catch (err) {
      console.error("Auth check error:", err);
      router.push("/login");
    }
  }

  async function fetchVisitors() {
    try {
      const { data, error: fetchError } = await supabase
        .from("visitors")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      setVisitors(data || []);
      setFilteredVisitors(data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load visitors");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  }

  const getVisitStatus = (visitDate: string) => {
    const visit = new Date(visitDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (visit < today) {
      return { label: "Visited", color: "bg-green-100 text-green-800" };
    } else if (visit.getTime() === today.getTime()) {
      return { label: "Today", color: "bg-blue-100 text-blue-800" };
    } else {
      return { label: "Upcoming", color: "bg-yellow-100 text-yellow-800" };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome, {user?.email}</p>
          </div>
          <Button
            onClick={handleLogout}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-600 text-sm font-semibold mb-2">Total Visitors</div>
            <div className="text-4xl font-bold text-blue-600">{visitors.length}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-600 text-sm font-semibold mb-2">Visited</div>
            <div className="text-4xl font-bold text-green-600">
              {visitors.filter((v) => new Date(v.visit_date) < new Date()).length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-600 text-sm font-semibold mb-2">Today</div>
            <div className="text-4xl font-bold text-blue-600">
              {visitors.filter((v) => {
                const visit = new Date(v.visit_date);
                const today = new Date();
                return visit.toDateString() === today.toDateString();
              }).length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-600 text-sm font-semibold mb-2">Upcoming</div>
            <div className="text-4xl font-bold text-yellow-600">
              {visitors.filter((v) => new Date(v.visit_date) > new Date()).length}
            </div>
          </div>
        </div>

        {/* Visitors Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl font-bold text-gray-900">Visitor Registrations</h2>
              <Input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="sm:max-w-sm"
              />
            </div>
          </div>

          {error && (
            <div className="p-6 bg-red-50 border-t border-red-200">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {filteredVisitors.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Name
                    </th>
                    <th className="hidden md:table-cell px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th className="hidden lg:table-cell px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Visit Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredVisitors.map((visitor) => {
                    const status = getVisitStatus(visitor.visit_date);
                    return (
                      <tr
                        key={visitor.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => router.push(`/dashboard/visitors/${visitor.id}`)}
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                              {visitor.first_name} {visitor.last_name}
                            </p>
                            <p className="text-sm text-gray-600 md:hidden">
                              {visitor.email}
                            </p>
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-6 py-4 text-sm text-gray-600">
                          {visitor.email}
                        </td>
                        <td className="hidden lg:table-cell px-6 py-4 text-sm text-gray-600">
                          {visitor.phone}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(visitor.visit_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              {visitors.length === 0 ? (
                <>
                  <p className="text-gray-600 mb-4">No visitor registrations yet</p>
                  <a
                    href="/"
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Visit the homepage →
                  </a>
                </>
              ) : (
                <p className="text-gray-600">No visitors match your search</p>
              )}
            </div>
          )}
        </div>

        {/* Summary */}
        {visitors.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredVisitors.length} of {visitors.length} visitors
          </div>
        )}
      </main>
    </div>
  );
}
