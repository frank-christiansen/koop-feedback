"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, Crown, Meh, Send, Smile, Trash, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getLanguageFile, getLanguageKey } from "@/backend/lang";

export interface Session {
  Users: User[];
  SessionId: string;
  Code: number;
  Host: User;
  CreatedAt: Date;
  IsStarted: boolean;
  IsFinished: boolean;
  DoneUsers: string[];
}

export interface User {
  UserId: string;
  SessionId: string;
  Name: string;
  IsHost: boolean;
  CreatedAt: Date;
  UserVotedForThisUser: string[];
  IsDone: boolean;
  Feedback: {
    Type: string;
    Description: string;
    CreatedAt: Date;
  }[];
}

export interface Feedback {
  Type: string;
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
  const [feedbackType, setFeedbackType] = useState("");
  const [feedbackDescription, setFeedbackDescription] = useState("");
  const [expandedUsers, setExpandedUsers] = useState<Record<string, boolean>>(
    {}
  );
  const [transition, setTransition] = useState<FeedbackTranslations>();
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const defaultLang = await getLanguageKey();
      const langFile = await getLanguageFile(defaultLang);
      setTransition(langFile);

      try {
        const req = await fetch("/api/v1/session");
        const data = await req.json();
        const userReq = await fetch("/api/v1/user?user=" + data.session.Host);
        const userData = await userReq.json();

        const mockSession = {
          Users: data.session.Users,
          SessionId: data.session.SessionId,
          Code: data.session.Code,
          Host: userData.user,
          CreatedAt: data.session.CreatedAt,
          IsStarted: data.session.IsStarted,
          IsFinished: data.session.IsFinished,
          DoneUsers: data.session.DoneUsers,
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
    if (!selectedUser || !feedbackType.trim()) return;

    if (feedbackDescription.length <= 0) {
      toast.error("Please enter a description");
      return;
    }

    const newFeedback = {
      Type: feedbackType,
      Description: feedbackDescription,
      Id: Date.now().toString(),
      forUser: {
        Name: selectedUser.Name,
        UserId: selectedUser.UserId,
      },
    };

    setFeedbacks((prev) => [...prev, newFeedback]);
    setSelectedUser(null);
    setFeedbackType("");
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

    feedbacks.forEach(async (feedback) => {
      const req = await fetch("/api/v1/user/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: feedback.Type,
          description: feedback.Description,
          userSessionId: session?.SessionId,
          feedbackUser: feedback.forUser.UserId,
        }),
      });
      const data = await req.json();
      if (req.status === 200) {
        toast.success(`${feedbacks.length} feedback items submitted!`);
      } else toast.error(data.error);
    });

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
            {transition?.runSession.header.sessionCode}: Started
          </span>
          <span className="text-white/80 text-sm">-</span>
          <span className="text-white/80 text-sm">
            {transition?.runSession.header.loggedIn}: {user?.Name}
          </span>
        </div>
      </header>

      {user?.IsDone && user.UserId != session.Host.UserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl w-[90%] max-w-md">
            <CardHeader>
              <CardTitle className="text-white text-center">
                {transition?.runSession.alreadySubmitted}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white text-center">
                {transition?.runSession.alreadySubmittedTooltip}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">
                    {transition?.runSession.member} ({session.Users.length})
                  </CardTitle>
                  {feedbacks.length > 0 && (
                    <span className="text-sm text-white/80">
                      {feedbacks.length} {transition?.runSession.feedbackReady}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {session.Users.sort((a, b) => {
                    const nameA = a.Name.toLowerCase();
                    const nameB = b.Name.toLowerCase();
                    if (nameA < nameB) return -1;
                    if (nameA > nameB) return 1;
                    return 0;
                  }).map((participant) => (
                    <div
                      key={participant.UserId}
                      className="bg-white/5 rounded-lg overflow-hidden"
                    >
                      <div
                        className={`p-3 flex items-center justify-between ${
                          selectedUser?.UserId === participant.UserId &&
                          !session.DoneUsers.includes(user?.UserId ?? "")
                            ? "bg-indigo-500/30"
                            : "hover:bg-white/10"
                        } ${
                          !session.DoneUsers.includes(user?.UserId ?? "")
                            ? "cursor-pointer"
                            : ""
                        }`}
                        onClick={() => {
                          if (session.DoneUsers.includes(user?.UserId ?? "")) {
                            return;
                          } else {
                            setSelectedUser(participant);
                          }
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <div>
                            <h3 className="text-white font-medium flex items-center">
                              {participant.Name}
                              {participant.IsHost && (
                                <Crown className="text-yellow-400 h-4 w-4 ml-2" />
                              )}
                              {session.Host.UserId == user?.UserId &&
                                (session.DoneUsers.includes(
                                  participant.UserId
                                ) ? (
                                  <Check className="text-green-400 h-4 w-4 ml-2"></Check>
                                ) : (
                                  <X className="text-red-400 h-4 w-4 ml-2" />
                                ))}
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
                    {transition?.runSession.feedback.feedback}
                  </h3>
                  {feedbacks.length === 0 ? (
                    <p className="text-white/60 text-sm">
                      {transition?.runSession.feedback.placeholder}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {feedbacks
                        .sort((a, b) => {
                          const nameCompare = a.forUser.Name.localeCompare(
                            b.forUser.Name
                          );
                          if (nameCompare !== 0) return nameCompare;

                          return a.Type === "positive" ? -1 : 1;
                        })
                        .map((feedback) => (
                          <div
                            key={feedback.Id}
                            className={`p-3 rounded-lg flex justify-between items-center ${
                              feedback.Type == "positive"
                                ? "bg-green-500 text-black"
                                : "bg-yellow-500"
                            }`}
                          >
                            <div>
                              <p className="text-xl font-medium text-black flex items-center">
                                <Send className="inline h-4 w-4 mr-1 "></Send>{" "}
                                {feedback.forUser.Name}
                              </p>
                              <p className="text-sm mt-1 text-gray-700 font-semibold">
                                {feedback.Description}
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
                    disabled={
                      feedbacks.length === 0 ||
                      session.DoneUsers.includes(user?.UserId as string)
                    }
                  >
                    {transition?.runSession.button.sendFeedbackBtn} (
                    {feedbacks.length})
                  </Button>
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
                          toast.success(transition?.toats.sessionEnded);
                        } else {
                          toast.error(transition?.toats.sessionEndedError);
                        }
                      }}
                    >
                      {transition?.runSession.button.endSessionBtn}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>{" "}
        </div>
      </main>

      {/* Feedback Modal */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="rounded-2xl shadow-xl border border-white/10 bg-[#1d112d]/80 backdrop-blur-md p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">
              Feedback {selectedUser?.Name}
              <form action="" method="post"></form>{" "}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Select
              onValueChange={(value) => setFeedbackType(value)}
              defaultValue={feedbackType}
            >
              <SelectTrigger className="bg-white/5 border border-white/10 text-white hover:bg-[#aa77ff]/10 transition-all">
                <SelectValue placeholder="Feedback-Typ" />
              </SelectTrigger>
              <SelectContent className="bg-[#1d112d]/80 backdrop-blur-sm border border-white/20 text-white rounded-xl">
                <SelectItem
                  value="positive"
                  className="flex items-center gap-2 px-3 py-2 hover:bg-[#aa77ff]/10 focus:bg-[#aa77ff]/10"
                >
                  <Smile className="h-4 w-4 text-green-500" />
                  <span className="text-white">Positiv</span>
                </SelectItem>
                <SelectItem
                  value="neutral"
                  className="flex items-center gap-2 px-3 py-2 hover:bg-[#aa77ff]/10 focus:bg-[#aa77ff]/10"
                >
                  <Meh className="h-4 w-4 text-yellow-500" />
                  <span className="text-white">Neutral</span>
                </SelectItem>
              </SelectContent>
            </Select>

            <Textarea
              placeholder=""
              value={feedbackDescription}
              onChange={(e) => setFeedbackDescription(e.target.value)}
              className="bg-white/5 border border-white/10 text-white placeholder-white/40 rounded-md p-3 min-h-[100px]"
            />

            <div className="flex justify-end space-x-2 pt-2">
              <Button
                variant="ghost"
                className="border border-white/10 text-white hover:bg-white/10 transition-all"
                onClick={() => setSelectedUser(null)}
              >
                {transition?.runSession.button.cancelBtn}
              </Button>
              <Button
                onClick={handleAddFeedback}
                disabled={!feedbackType.trim()}
                className="bg-[#aa77ff] hover:bg-[#9d66cc] text-white transition-all"
              >
                {transition?.runSession.button.sendFeedbackBtn}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
