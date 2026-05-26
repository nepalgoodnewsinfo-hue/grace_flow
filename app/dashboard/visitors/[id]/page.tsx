"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";

const emailSchema = z.object({
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

type EmailFormValues = z.infer<typeof emailSchema>;

interface Visitor {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  visit_date: string;
  created_at: string;
  status?: string;
}

export default function VisitorDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const visitorId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [status, setStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      subject: "",
      message: "",
    },
  });

  useEffect(() => {
    fetchVisitorDetails();
  }, [visitorId]);

  async function fetchVisitorDetails() {
    try {
      const { data, error: fetchError } = await supabase
        .from("visitors")
        .select("*")
        .eq("id", visitorId)
        .single();

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      setVisitor(data);
      setStatus(data?.status || "pending");
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load visitor details");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStatusUpdate() {
    if (!visitor) return;

    setIsUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      const { error: updateError } = await supabase
        .from("visitors")
        .update({ status })
        .eq("id", visitor.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      setVisitor({ ...visitor, status });
      setSuccess("Status updated successfully");

      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update status";
      console.error("Update error:", err);
      setError(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleSendWelcomeEmail() {
    if (!visitor) return;

    setIsSendingEmail(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: visitor.email,
          name: `${visitor.first_name} ${visitor.last_name}`,
          visitDate: new Date(visitor.visit_date).toLocaleDateString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send email");
      }

      setSuccess("Welcome email sent successfully!");

      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send email";
      console.error("Email error:", err);
      setError(errorMessage);
    } finally {
      setIsSendingEmail(false);
    }
  }

  async function onSubmit(values: EmailFormValues) {
    if (!visitor) return;

    setIsSendingEmail(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/send-custom-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: visitor.email,
          name: `${visitor.first_name} ${visitor.last_name}`,
          subject: values.subject,
          message: values.message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send email");
      }

      setSuccess("Email sent successfully!");
      form.reset();

      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send email";
      console.error("Email error:", err);
      setError(errorMessage);
    } finally {
      setIsSendingEmail(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading visitor details...</p>
        </div>
      </div>
    );
  }

  if (!visitor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Visitor not found</p>
          <Button
            onClick={() => router.push("/dashboard")}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => router.push("/dashboard")}
                className="text-blue-600 hover:text-blue-700 text-sm font-semibold mb-2"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-3xl font-bold text-gray-900">
                {visitor.first_name} {visitor.last_name}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Alert Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-semibold">✕ {error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-semibold">✓ {success}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Visitor Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Full Name
                  </label>
                  <p className="text-lg text-gray-900">
                    {visitor.first_name} {visitor.last_name}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Email
                  </label>
                  <a
                    href={`mailto:${visitor.email}`}
                    className="text-lg text-blue-600 hover:text-blue-700"
                  >
                    {visitor.email}
                  </a>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Phone
                  </label>
                  <a
                    href={`tel:${visitor.phone}`}
                    className="text-lg text-blue-600 hover:text-blue-700"
                  >
                    {visitor.phone}
                  </a>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Visit Date
                  </label>
                  <p className="text-lg text-gray-900">
                    {new Date(visitor.visit_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Registered On
                  </label>
                  <p className="text-lg text-gray-900">
                    {new Date(visitor.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Status</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Visit Status
                  </label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="visited">Visited</SelectItem>
                      <SelectItem value="no-show">No Show</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleStatusUpdate}
                  disabled={isUpdating}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 font-semibold py-2"
                >
                  {isUpdating ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Updating...
                    </span>
                  ) : (
                    "Update Status"
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Email Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Button
                  onClick={handleSendWelcomeEmail}
                  disabled={isSendingEmail}
                  className="w-full bg-green-600 text-white hover:bg-green-700 font-semibold py-2"
                >
                  {isSendingEmail ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Sending...
                    </span>
                  ) : (
                    "📧 Send Welcome Email"
                  )}
                </Button>

                <Button
                  className="w-full bg-gray-600 text-white hover:bg-gray-700 font-semibold py-2"
                >
                  📱 Send SMS
                </Button>

                <Button
                  className="w-full bg-red-600 text-white hover:bg-red-700 font-semibold py-2"
                >
                  🗑️ Delete Visitor
                </Button>
              </div>
            </div>

            {/* Custom Email Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Send Custom Email</h2>
              <p className="text-gray-600 text-sm mb-4">Send a personalized follow-up email</p>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {/* Subject */}
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Subject</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Looking forward to seeing you this Sunday!"
                            {...field}
                            disabled={isSendingEmail}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Message */}
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write your custom message here..."
                            rows={6}
                            {...field}
                            disabled={isSendingEmail}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Send Button */}
                  <Button
                    type="submit"
                    disabled={isSendingEmail}
                    className="w-full bg-blue-600 text-white hover:bg-blue-700 font-semibold py-2"
                  >
                    {isSendingEmail ? (
                      <span className="flex items-center gap-2">
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Sending...
                      </span>
                    ) : (
                      "Send Email"
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
