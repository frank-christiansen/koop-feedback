"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Feedback {
  Title: string;
  Description: string;
  CreatedAt: string;
  Id: string;
}

export default function SessionPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    const fetchSession = async () => {
      const req = await fetch("/api/v1/user/feedback", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const res = await req.json();
      setFeedbacks(res.feedback);
      setIsLoading(false);
    };
    fetchSession();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const logout = async () => {
    const req = await fetch("/api/v1/user/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    window.location.href = req.url;
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <h1 className="text-3xl font-bold mb-6">Feedback Übersicht</h1>

      {feedbacks.length === 0 ? (
        <p className="text-gray-400">Noch kein Feedback vorhanden.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedbacks.map((fb) => (
            <Card
              key={fb.Id}
              className="bg-white/10 border-white/20 backdrop-blur-sm"
            >
              <CardHeader>
                <CardTitle className="text-white">{fb.Title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300 mb-2">{fb.Description}</p>
                <p className="text-xs text-gray-500">
                  Erstellt am: {new Date(fb.CreatedAt).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Button
        className="mt-6 bg-indigo-600 hover:bg-indigo-700"
        onClick={() => logout()}
      >
        Logout
      </Button>
    </div>
  );
}
