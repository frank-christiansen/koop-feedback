"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileWarning, MessageCircleWarning } from "lucide-react";
import { toast } from "react-toastify";

interface Feedback {
  Type: string;
  Description: string;
  CreatedAt: string;
  Id: string;
}

export default function SessionPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const req = await fetch("/api/v1/user/feedback", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const userreq = await fetch("/api/v1/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const user = await userreq.json();
      console.log(user);

      setUser(user.user);
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

  async function deleteData() {
    const req = await fetch("/api/v1/session/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (req.status === 200) {
      toast.success("Session data deleted successfully!", {
        type: "info",
        position: "top-right",
      });
    } else {
      toast.error("Failed to delete session data.", {
        type: "error",
        position: "top-right",
      });
    }
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
    <div className="min-h-screen p-6 bg-gradient-to-br text-center from-purple-900 to-indigo-800 text-white">
      <h1 className="text-3xl font-bold mb-6">Feedback Übersicht</h1>

      {feedbacks.length === 0 ? (
        <p className="text-white/60">Noch kein Feedback vorhanden.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedbacks.map((fb) => (
            <Card
              key={fb.Id}
              className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-md"
            >
              <CardHeader>
                <CardTitle className="text-white">{fb.Type}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/80 mb-2">{fb.Description}</p>
                <p className="text-xs text-white/40 mt-1">
                  Created at: {new Date(fb.CreatedAt).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-col sm:flex-row sm:space-x-4 items-center justify-center">
        <Button
          className="mt-6 sm:mt-0 bg-red-800 hover:bg-red-700 text-white w-full sm:w-auto hover:shadow-lg transition duration-300 ease-in-out"
          onClick={() => logout()}
        >
          <MessageCircleWarning></MessageCircleWarning> Logout & Delete Session
        </Button>
        {user.IsHost && (
          <Button
            className="mt-6 sm:mt-0 bg-red-800 hover:bg-red-700 text-white w-full sm:w-auto hover:shadow-lg transition duration-300 ease-in-out"
            onClick={() => deleteData()}
          >
            <MessageCircleWarning></MessageCircleWarning> Delete the Session
            Data
          </Button>
        )}
      </div>
    </div>
  );
}
