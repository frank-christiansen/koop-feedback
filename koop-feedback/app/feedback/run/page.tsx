"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Crown, Trash, ChevronDown, ChevronUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export interface Feedback {
  Title: string;
  Description: string;
  Id: string;
  forUser: {
    Name: string;
    UserId: string;
  };
}

export default function SessionPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [feedbackDescription, setFeedbackDescription] = useState("");
  const [expandedUsers, setExpandedUsers] = useState<Record<string, boolean>>(
    {}
  );
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const req = await fetch("/api/v1/session");
        if (!req.ok) return (window.location.href = "/");
        const data = await req.json();

        const userReq = await fetch("/api/v1/user?user=" + data.session.Host);
        if (!userReq.ok) return (window.location.href = "/");
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

        if (mockSession.IsFinished)
          return (window.location.href = "/feedback/end");

        setUser(data.user);
        setSession(mockSession);
      } catch (err) {
        toast.error("Failed to load session");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
    const interval = setInterval(fetchSession, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAddFeedback = async () => {
    if (!selectedUser || !feedbackTitle.trim()) return;

    const newFeedback = {
      Title: feedbackTitle,
      Description: feedbackDescription,
      Id: Date.now().toString(),
      forUser: {
        Name: selectedUser.Name,
        UserId: selectedUser.UserId,
      },
    };

    setFeedbacks((prev) => [...prev, newFeedback]);
    setSelectedUser(null);
    setFeedbackTitle("");
    setFeedbackDescription("");
    toast.success("Feedback added!");
  };

  const handleRemoveFeedback = (id: string) => {
    setFeedbacks((prev) => prev.filter((feedback) => feedback.Id !== id));
    toast.info("Feedback removed");
  };

  const handleSubmitAllFeedback = async () => {
    if (feedbacks.length === 0) {
      toast.warning("No feedback to submit");
      return;
    }

    let success = 0;

    feedbacks.forEach(async (feedback) => {
      toast.success(`${feedbacks.length} feedback items submitted!`);
      const req = await fetch("/api/v1/user/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tite: feedback.Title,
          description: feedback.Description,
          userSessionId: session?.SessionId,
          feedbackUser: feedback.forUser.UserId,
        }),
      });

      if (req.status === 200) {
        success++;
      }
    });

    if (success === feedbacks.length) {
      toast.success("All feedback submitted successfully!");
    } else {
      toast.error(
        "Some feedback could not be submitted. (Success: " + success + ")"
      );
    }

    setFeedbacks([]);
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
      <header className="py-4 px-6 border-b border-white/20 flex justify-between items-center">
        <div className="flex items-center space-x-2 mt-1">
          <span className="text-white/80 text-sm">
            Session Code: {session.Code}
          </span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">
                    Participants ({session.Users.length})
                  </CardTitle>
                  {feedbacks.length > 0 && (
                    <span className="text-sm text-white/80">
                      {feedbacks.length} feedback items ready
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {session.Users.map((participant) => (
                    <div
                      key={participant.UserId}
                      className="bg-white/5 rounded-lg overflow-hidden"
                    >
                      <div
                        className={`p-3 flex items-center justify-between cursor-pointer ${
                          selectedUser?.UserId === participant.UserId
                            ? "bg-indigo-500/30"
                            : "hover:bg-white/10"
                        }`}
                        onClick={() => setSelectedUser(participant)}
                      >
                        <div className="flex items-center space-x-3">
                          <div>
                            <h3 className="text-white font-medium flex items-center">
                              {participant.Name}
                              {participant.IsHost && (
                                <Crown className="text-yellow-400 h-4 w-4 ml-2" />
                              )}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Eigene Feedback-Liste */}
                <div className="mt-6">
                  <h3 className="text-white font-medium mb-3">
                    Your Feedbacks
                  </h3>
                  {feedbacks.length === 0 ? (
                    <p className="text-white/60 text-sm">
                      No feedback added yet
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {feedbacks.map((feedback) => (
                        <div
                          key={feedback.Id}
                          className="p-3 bg-white/5 rounded-lg flex justify-between items-center"
                        >
                          <div>
                            <h4 className="text-white font-medium">
                              {feedback.Title}
                            </h4>
                            <p className="text-white/70 text-sm">
                              {feedback.Description}
                            </p>
                            <p className="text-xs text-white/50 mt-1">
                              For: {feedback.forUser.Name}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:bg-red-400/10"
                            onClick={() => handleRemoveFeedback(feedback.Id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  <Button
                    className="w-full mt-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={handleSubmitAllFeedback}
                    disabled={feedbacks.length === 0}
                  >
                    Submit all feedback ({feedbacks.length})
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {session.Host && session.Host.UserId == user?.UserId && (
          <Button
            className="w-full mt-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={async () => {
              const req = await fetch("/api/v1/session/end", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  sessionId: session.SessionId,
                }),
              });
              if (req.status === 200) {
                toast.success("Session ended successfully!");
              } else {
                toast.error("Failed to end session");
              }
            }}
          >
            End Session
          </Button>
        )}
      </main>

      {/* Feedback Modal */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add feedback for {selectedUser?.Name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Title"
              value={feedbackTitle}
              onChange={(e) => setFeedbackTitle(e.target.value)}
              className="bg-white/5 border-white/10"
            />
            <Textarea
              placeholder="Description"
              value={feedbackDescription}
              onChange={(e) => setFeedbackDescription(e.target.value)}
              className="bg-white/5 border-white/10 min-h-[100px]"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setSelectedUser(null)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddFeedback}
                disabled={!feedbackTitle.trim()}
              >
                Add Feedback
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
