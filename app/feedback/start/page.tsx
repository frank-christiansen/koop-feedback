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
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getLanguageFile, getLanguageKey } from "@/backend/lang";

export interface Session {
  Users: User[];
  SessionId: string;
  Code: number;
  Host: User;
  CreatedAt: Date;
  IsStarted: boolean;
  IsFinished: boolean;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [transition, setTransition] = useState<FeedbackTranslations>();
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const defaultLang = await getLanguageKey();
      const langFile = await getLanguageFile(defaultLang);
      setTransition(langFile);

      try {
        const req = await fetch("/api/v1/session", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!req.ok) {
          window.location.href = "/";
          return;
        }
        const data = await req.json();

        const userReq = await fetch("/api/v1/user?user=" + data.session.Host, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!userReq.ok) {
          window.location.href = "/";
          return;
        }
        const userData = await userReq.json();

        const mockSession = {
          Users: data.session.Users,
          SessionId: data.session.SessionId,
          Code: data.session.Code,
          Host: userData.user,
          CreatedAt: data.session.CreatedAt,
          IsStarted: data.session.IsStarted,
          IsFinished: data.session.IsFinished,
        };

        if (mockSession.IsStarted) {
          window.location.href = "/feedback/run";
          return;
        }

        setUser(data.user);
        setSession(mockSession);
      } catch (error) {
        toast.error(transition?.toats.failedToLoadSession);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    // Direkt einmal ausführen
    fetchSession();

    // Intervall alle 10 Sekunden
    const interval = setInterval(fetchSession, 1000);

    // Cleanup bei Unmount
    return () => clearInterval(interval);
  }, []);

  const copySessionCode = () => {
    if (!session) return;
    navigator.clipboard.writeText(session.Code.toString());
    toast.success(transition?.toats.copiedSessionCode);
  };

  const startSession = async () => {
    const req = await fetch("/api/v1/session/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await req.json();
    if (req.status !== 200) {
      toast(data.error, {
        type: "error",
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    toast(transition?.toats.sessionStarted, {
      type: "info",
      position: "top-right",
      autoClose: 5000,
    });
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
          {/* QR Code for code */}
          <div className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">
                  {transition?.sessions.qrcode.title} -{" "}
                  <Copy
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `http://${window.location.host}?join=${session.Code}`
                      );
                      toast.success(transition?.toats.copiedSessionCode);
                    }}
                    className="inline-flex"
                    height={15}
                    width={15}
                  ></Copy>
                </CardTitle>
                <CardDescription className="text-white/60">
                  {transition?.sessions.qrcode.subtitle}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center items-center h-48">
                <div className="bg-white/10 p-4 rounded-lg shadow-lg">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?data=http://${window.location.host}?join=${session.Code}&size=1000x1000`}
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
                    {transition?.sessions.member} ({session.Users.length})
                  </CardTitle>
                  {session.Host.UserId === user?.UserId &&
                    !session.IsStarted && (
                      <Button
                        variant="default"
                        className="bg-blue-500 text-white hover:bg-blue-600"
                        onClick={startSession}
                      >
                        {transition?.sessions.startSession.button}
                      </Button>
                    )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
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
                      {participant.IsHost ? (
                        <Crown className="text-yellow-400 h-5 w-5" />
                      ) : (
                        session.Host.UserId === user?.UserId && (
                          <Trash
                            onClick={() => {
                              fetch(
                                "/api/v1/user/remove?user=" +
                                  participant.UserId,
                                {
                                  method: "DELETE",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                }
                              )
                                .then((res) => {
                                  if (!res.ok) {
                                    throw new Error(
                                      "Failed to remove participant"
                                    );
                                  }
                                  return res.json();
                                })
                                .catch((error) => {
                                  toast(error.message, {
                                    type: "error",
                                    position: "top-right",
                                    autoClose: 5000,
                                  });
                                });
                            }}
                            className="text-red-400 h-5 w-5"
                          />
                        )
                      )}
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
