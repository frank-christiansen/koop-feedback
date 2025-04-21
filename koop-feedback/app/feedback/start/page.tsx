"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Crown,
  MessageSquare,
  ThumbsUp,
  Share2,
  Copy,
  MoreVertical,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export interface Session {
  Users: User[];
  SessionId: string;
  Code: number;
  Host: User;
  CreatedAt: Date;
}

export interface User {
  UserId: string;
  SessionId: string;
  Name: string;
  IsHost: boolean;
  CreatedAt: Date;
  UserVotedForThisUser: string[];
  Feedback: {
    Title: string;
    Description: string;
    CreatedAt: Date;
  }[];
}

export default function SessionPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const router = useRouter();

  // Mock data - in einer echten App würdest du dies von der API holen
  useEffect(() => {
    const fetchSession = async () => {
      try {
        // Simuliere API-Aufruf
        const req = await fetch("/api/v1/session", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!req.ok) {
          throw new Error("Failed to fetch session data");
        }
        const data = await req.json();

        const userReq = await fetch("/api/v1/user?user=" + data.session.Host, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!userReq.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await userReq.json();

        const mockSession = {
          Users: data.session.Users,
          SessionId: data.session.SessionId,
          Code: data.session.Code,
          Host: userData,
          CreatedAt: data.session.CreatedAt,
        };

        setSession(mockSession);
      } catch (error) {
        toast.error("Failed to load session");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  });

  const copySessionCode = () => {
    if (!session) return;
    navigator.clipboard.writeText(session.Code.toString());
    toast.success("Session code copied to clipboard");
  };

  const sendFeedback = () => {
    if (!feedback.trim()) return;

    toast.success("Feedback sent to host");
    setFeedback("");
  };

  const startSession = () => {
    toast.success("Session started!");
    //   Start Session Logic Here
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Session not found</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/")}>Go to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800">
      {/* Header */}
      <header className="py-4 px-6 border-b border-white/20 flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-white/80  text-sm">Code: {session.Code}</span>
            <Button
              variant="ghost"
              size="icon"
              className="text-white/60 h-6 w-6"
              onClick={copySessionCode}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Host Section */}
          <div className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Crown className="h-5 w-5 text-yellow-400" />
                  <CardTitle className="text-white">Session Host</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="text-white font-medium">
                      {session.Host.Name}
                    </h3>
                    <p className="text-white/60 text-sm">Host</p>
                  </div>
                </div>
              </CardContent>
            </Card>{" "}
          </div>

          {/* QR Code for code */}
          <div className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Join Session</CardTitle>
                <CardDescription className="text-white/60">
                  Scan the QR code or enter the code to join the session.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center items-center h-48">
                <div className="bg-white/10 p-4 rounded-lg shadow-lg">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?data=${session.Code}&size=200x200`}
                    alt="QR Code"
                    className="w-32 h-32"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Participants Section */}
          <div className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">
                    Participants ({session.Users.length + 1})
                  </CardTitle>
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-700"
                    onClick={startSession}
                  >
                    Start Session
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Host in participants list */}
                  {/* <div className="flex items-center p-3 bg-white/5 rounded-lg">
                    <div className="ml-4 flex-1">
                      <h3 className="text-white font-medium">{session.Host}</h3>
                      <p className="text-white/60 text-sm">Host</p>
                    </div>
                    <Crown className="h-5 w-5 text-yellow-400" />
                  </div> */}

                  {/* Other participants */}
                  {session.Users.map((participant: User) => (
                    <div
                      key={participant.UserId}
                      className="flex items-center p-3 bg-white/5 rounded-lg"
                    >
                      <div className="ml-4 flex-1">
                        <h3 className="text-white font-medium">
                          {participant.Name}
                        </h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white/60 hover:text-white"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
