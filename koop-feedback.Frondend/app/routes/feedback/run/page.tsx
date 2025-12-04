"use client";

import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {useTranslation} from "~/context/Translation";
import {Card, CardContent, CardHeader, CardTitle} from "~/components/ui/card";
import {Button} from "~/components/ui/button";
import {Check, Crown, Meh, Send, Smile, Trash, X} from "lucide-react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "~/components/ui/dialog";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "~/components/ui/select";
import {Textarea} from "~/components/ui/textarea";
import type {DefaultAPIResponse, GETSessionResponseData, POSTSessionFeedbackResponseData} from "../../../../types/API";
import type {User} from "../../../../types/User";
import type {Feedback} from "../../../../types/Feedback";
import {FeedbackType} from "../../../../types/FeedbackType";
import Session404 from "~/components/app/Session404";
import Loading from "~/components/app/Loading";

export default function SessionPage() {
    const [data, setData] = useState<GETSessionResponseData | null>(null);
    const [authId, setAuthId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [feedback, setFeedback] = useState<Feedback[]>([]);
    const [feedbackType, setFeedbackType] = useState<FeedbackType>();
    const [feedbackDescription, setFeedbackDescription] = useState<string>("");
    const {translations} = useTranslation()

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const authIdCookie = await cookieStore.get("authId")
                if (!authIdCookie) {
                    window.location.href = "/";
                    return;
                }
                setAuthId(authIdCookie.value as string)

                const req = await fetch("/api/v2/session", {
                    method: "GET",
                    headers: {
                        "Authorization": authIdCookie.value as string,
                        "Content-Type": "application/json",
                    },
                });
                const apiData = await req.json() as DefaultAPIResponse<GETSessionResponseData>

                if (apiData?.Data.Session.IsFinished) return window.open("/feedback/end", "_self")

                setData(apiData.Data)
            } catch (error) {
                toast.error(translations?.toats.failedToLoadSession);
                window.open("/", "_self")
            } finally {
                setIsLoading(false);
            }
        };

        const interval = setInterval(fetchSession, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleAddFeedback = async () => {
        if (!selectedUser) return;

        if (feedbackDescription.length <= 0) {
            toast.error(translations?.toats.noDescription);
            return;
        }

        const newFeedback = {
            Id: feedback.length + 1,
            Type: feedbackType,
            Description: feedbackDescription,
            UserId: selectedUser.ID
        } as Feedback

        setFeedback((prev) => [...prev, newFeedback]);
        setSelectedUser(null);
        setFeedbackType(0);
        setFeedbackDescription("");
        toast.success(translations?.toats.feedbackAdded);
    };

    const handleRemoveFeedback = (id: number) => {
        setFeedback((prev) => prev.filter((feedback) => feedback.Id !== id));
        toast.info(translations?.toats.feedbackRemoved);
    };

    const handleSubmitAllFeedback = async () => {
        if (feedback.length === 0) {
            toast.warning(translations?.toats.noFeedbackSent);
            return;
        }

        const req = await fetch(`/api/v2/session/feedback`, {
            method: "POST",
            headers: {
                "Authorization": authId as string,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                Feedback: feedback
            }),
        });
        const feedbackRes = await req.json() as DefaultAPIResponse<POSTSessionFeedbackResponseData>
        if (feedbackRes.Success) {
            toast.info(
                `${feedback.length} ${translations?.toats.feedbackSendedItems}!`
            );
            if (feedbackRes.Data.Success > 0) toast.success(
                `${feedbackRes.Data.Success} SUCCESS`
            );
            if (feedbackRes.Data.Failed > 0) toast.error(
                `${feedbackRes.Data.Failed} FAILED`
            );

        } else toast.error(feedbackRes.Message);


        setFeedback([]);
    };

    if (isLoading)
        return <Loading></Loading>


    if (!data)
        return <Session404></Session404>


    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800">
            <header className="py-4 px-6 border-b border-white/20 flex justify-between items-center">
                <div className="flex items-center space-x-2 mt-1">
          <span className="text-white/80 text-sm">
            {translations?.runSession.header.sessionCode}: Started
          </span>
                    <span className="text-white/80 text-sm">-</span>
                    <span className="text-white/80 text-sm">
            {translations?.runSession.header.loggedIn}: {data.Self?.Name}
          </span>
                </div>
            </header>

            {(data?.Self.HasSubmitted && !data.Self.IsHost) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <Card className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl w-[90%] max-w-md">
                        <CardHeader>
                            <CardTitle className="text-white text-center">
                                {translations?.runSession.alreadySubmitted}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-white text-center">
                                {translations?.runSession.alreadySubmittedTooltip}
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
                                        {translations?.runSession.member} ({data.Users.length})
                                    </CardTitle>
                                    {feedback.length > 0 && (
                                        <span className="text-sm text-white/80">
                      {feedback.length} {translations?.runSession.feedbackReady}
                    </span>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {data.Users.sort((a: { Name: string; }, b: { Name: string; }) => {
                                        const nameA = a.Name.toLowerCase();
                                        const nameB = b.Name.toLowerCase();
                                        if (nameA < nameB) return -1;
                                        if (nameA > nameB) return 1;
                                        return 0;
                                    }).map((user) => (
                                        <div
                                            key={user.ID}
                                            className="bg-white/5 rounded-lg overflow-hidden cursor-pointer"
                                        >
                                            <div
                                                className={`p-3 flex items-center justify-between`}
                                                onClick={() => {
                                                    if (data?.Self.ID != user.ID && !data?.Self.HasSubmitted) {
                                                        setSelectedUser(user);
                                                    }
                                                }}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div>
                                                        <h3 className="text-white font-medium flex items-center">
                                                            <span
                                                                className={`${(data?.Self.ID == user.ID || data?.Self.HasSubmitted) && "blur-xs"}`}> {user.Name}</span>
                                                            {user.IsHost && (
                                                                <Crown className="text-yellow-400 h-4 w-4 ml-2"/>
                                                            )}
                                                            {data.Self.IsHost && ((user.HasSubmitted) ? (
                                                                <Check
                                                                    className="text-green-400 h-4 w-4 ml-2"></Check>
                                                            ) : (
                                                                <X className="text-red-400 h-4 w-4 ml-2"/>
                                                            ))
                                                            }
                                                        </h3>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-white font-medium mb-3">
                                        {translations?.runSession.feedback.feedback}
                                    </h3>
                                    {feedback.length === 0 ? (
                                        <p className="text-white/60 text-sm">
                                            {translations?.runSession.feedback.placeholder}
                                        </p>
                                    ) : (
                                        <div className="space-y-2">
                                            {feedback
                                                .sort((a, b) => {
                                                    const nameCompare = data.Users.filter(value => value.ID == a.UserId)[0].Name.localeCompare(
                                                        data.Users.filter(value => value.ID == b.UserId)[0].Name
                                                    );
                                                    if (nameCompare !== 0) return nameCompare;

                                                    return a.Type == FeedbackType.Positive ? -1 : 1;
                                                })
                                                .map((feedback) => (
                                                    <div
                                                        key={feedback.Id}
                                                        className={`p-3 rounded-lg flex justify-between items-center ${
                                                            feedback.Type == FeedbackType.Positive
                                                                ? "bg-green-500 text-black"
                                                                : "bg-yellow-500"
                                                        }`}
                                                    >
                                                        <div>
                                                            <p className="text-xl font-medium text-black flex items-center">
                                                                <Send className="inline h-4 w-4 mr-1 "></Send>{" "}
                                                                {data.Users.filter(value => value.ID == feedback.UserId)[0].Name}
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
                                                            <Trash className="h-4 w-4"/>
                                                        </Button>
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                    <Button
                                        className="w-full mt-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                                        onClick={handleSubmitAllFeedback}
                                        disabled={data.Self.HasSubmitted}
                                    >
                                        {translations?.runSession.button.sendFeedbackBtn} (
                                        {feedback.length})
                                    </Button>
                                    {data.Self.IsHost && (
                                        <Button
                                            className="w-full mt-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                                            onClick={async () => {
                                                const req = await fetch("/api/v2/session/end", {
                                                    method: "POST",
                                                    headers: {
                                                        "Authorization": authId as string,
                                                        "Content-Type": "application/json",
                                                    },
                                                });
                                                if (req.status === 200) {
                                                    toast.success(translations?.toats.sessionEnded);
                                                } else {
                                                    toast.error(translations?.toats.sessionEndedError);
                                                }
                                            }}
                                        >
                                            {translations?.runSession.button.endSessionBtn}
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    {
                        " "
                    }
                </div>
            </main>

            {/* Feedback Modal */
            }
            <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
                <DialogContent
                    className="rounded-2xl shadow-xl border border-white/10 bg-[#1d112d]/80 backdrop-blur-md p-6">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-white">
                            Feedback {selectedUser?.Name}
                            <form action="" method="post"></form>
                            {" "}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                        <Select
                            onValueChange={(value) => setFeedbackType(parseInt(value))}
                            defaultValue={feedbackType as any}
                        >
                            <SelectTrigger
                                className="bg-white/5 border border-white/10 text-white hover:bg-[#aa77ff]/10 translations-all">
                                <SelectValue placeholder="Feedback-Typ"/>
                            </SelectTrigger>
                            <SelectContent
                                className="bg-[#1d112d]/80 backdrop-blur-sm border border-white/20 text-white rounded-xl">
                                <SelectItem
                                    value={String(FeedbackType.Positive)}
                                    className="flex items-center gap-2 px-3 py-2 hover:bg-[#aa77ff]/10 focus:bg-[#aa77ff]/10"
                                >
                                    <Smile className="h-4 w-4 text-green-500"/>
                                    <span className="text-white">Positiv</span>
                                </SelectItem>
                                <SelectItem
                                    value={String(FeedbackType.Normal)}
                                    className="flex items-center gap-2 px-3 py-2 hover:bg-[#aa77ff]/10 focus:bg-[#aa77ff]/10"
                                >
                                    <Meh className="h-4 w-4 text-yellow-500"/>
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
                                className="border border-white/10 text-white hover:bg-white/10 translations-all cursor-pointer"
                                onClick={() => setSelectedUser(null)}
                            >
                                {translations?.runSession.button.cancelBtn}
                            </Button>
                            <Button
                                onClick={handleAddFeedback}
                                disabled={feedbackDescription.length < 10}
                                className="bg-[#aa77ff] hover:bg-[#9d66cc] text-white translations-all cursor-pointer"
                            >
                                {translations?.runSession.button.sendFeedbackBtn}
                            </Button>
                        </div>
                        <span className={"text-white"}>min. {feedbackDescription.length}/10 characters</span>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
        ;
}