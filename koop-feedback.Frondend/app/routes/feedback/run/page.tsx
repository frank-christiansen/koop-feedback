"use client";

import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {useTranslation} from "~/context/Translation";
import {Card, CardContent, CardHeader, CardTitle} from "~/components/ui/card";
import {Button} from "~/components/ui/button";
import type {DefaultAPIResponse, GETSessionResponseData, POSTSessionFeedbackResponseData} from "../../../../types/API";
import type {User} from "../../../../types/User";
import type {Feedback} from "../../../../types/Feedback";
import {FeedbackType} from "../../../../types/FeedbackType";
import Session404 from "~/components/app/default/Session404";
import Loading from "~/components/app/default/Loading";
import FeedbackDone from "~/components/app/run/FeedbackDone";
import {FeedbackModal} from "~/components/app/run/FeedbackModal";
import Users from "~/components/app/run/Users";
import FeedbackView from "~/components/app/run/Feedback";

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
            Type: parseInt(String(feedbackType)),
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

    const handleEnd = async () => {
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
    }

    if (isLoading) return <Loading></Loading>
    if (!data) return <Session404></Session404>
    if (data?.Self.HasSubmitted && !data.Self.IsHost) return <FeedbackDone/>

    return (
        <div className={"bg-gradient-to-br from-purple-900 to-indigo-800"}>
            <header
                className="py-4 px-6 border-b border-white/20 flex justify-between items-center">
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
            <div className="min-h-screen flex justify-center items-center">
                <FeedbackModal
                    feedbackType={feedbackType as unknown as string}
                    setFeedbackType={type => setFeedbackType(type as unknown as FeedbackType)}
                    selectedUser={selectedUser}
                    setSelectedUser={user => setSelectedUser(user)}
                    description={feedbackDescription}
                    setDescription={(desc) => setFeedbackDescription(desc)}
                    handleAddFeedback={handleAddFeedback}
                />

                <main className="container">
                    <div className={"min-h-screen flex justify-center items-center"}>
                        <Card
                            className="bg-white/10 backdrop-blur-sm border-white/20 w-xl">
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

                                <Users
                                    setSelectedUser={user => setSelectedUser(user)}
                                    data={data}
                                />

                                <div className="mt-6">
                                    <h3 className="text-white font-medium mb-3">
                                        {translations?.runSession.feedback.feedback}
                                    </h3>
                                    {feedback.length === 0 ? (
                                        <p className="text-white/60 text-sm">
                                            {translations?.runSession.feedback.placeholder}
                                        </p>
                                    ) : (
                                        <FeedbackView
                                            feedback={feedback}
                                            data={data}
                                            handleRemoveFeedback={id => handleRemoveFeedback(id)}
                                        />
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
                                            onClick={handleEnd}
                                        >
                                            {translations?.runSession.button.endSessionBtn}
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    )
}