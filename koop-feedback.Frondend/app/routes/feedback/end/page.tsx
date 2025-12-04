"use client";

import {useEffect, useState} from "react";
import {useTranslation} from "~/context/Translation";
import {Card, CardContent} from "~/components/ui/card";
import {Button} from "~/components/ui/button";
import {FeedbackType} from "../../../../types/FeedbackType";
import type {Feedback} from "../../../../types/Feedback";
import Loading from "~/components/app/Loading";
import type {DefaultAPIResponse} from "../../../../types/API";
import {Textarea} from "~/components/ui/textarea";

export default function SessionPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [feedbacks, setFeedbacks] = useState<Feedback[] | null>([]);
    const {translations} = useTranslation()

    useEffect(() => {
        const fetchSession = async () => {

            const authIdCookie = await cookieStore.get("authId")
            if (!authIdCookie) {
                window.location.href = "/";
                return;
            }
            const req = await fetch("/api/v2/user/feedback", {
                method: "GET",
                headers: {
                    "Authorization": authIdCookie.value as string,
                    "Content-Type": "application/json",
                },
            });
            const feedback = await req.json() as DefaultAPIResponse<Feedback[]>

            if (feedback.Message == "NotActive") return window.open("/feedback/run", "_self")

            setFeedbacks(feedback.Data);
            setIsLoading(false);
        };
        fetchSession();
    }, []);

    if (isLoading) return <Loading/>

    const logoutSession = async () => {
        const authIdCookie = await cookieStore.get("authId")
        await fetch("/api/v2/user/logout", {
            method: "DELETE",
            headers: {
                "Authorization": authIdCookie?.value as string,
                "Content-Type": "application/json",
            },
        });
        feedbacks &&

        window.open("/", "_self")
    }

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-purple-900 to-indigo-800 text-white">
            <div className="flex items-center justify-center mb-6">
                <h1 className="text-3xl font-bold text-white">
                    {translations?.endSession.title}
                </h1>
            </div>
            {(feedbacks == null || !feedbacks || feedbacks.length === 0) ? (
                <p className="text-center text-white/60 text-xl">
                    {translations?.endSession.noFeedback}
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {feedbacks
                        .sort((a, b) => (a.Type == FeedbackType.Positive ? -1 : 1))
                        .map((fb) => {
                            const isPositive = fb.Type == FeedbackType.Positive;
                            const cardColor = isPositive ? "bg-green-500" : "bg-yellow-500";
                            return (
                                <Card
                                    key={Math.round(Math.random() * 1000)}
                                    className={`rounded-2xl p-4 shadow-lg border border-white/20 backdrop-blur-md text-white translations-transform transform hover:scale-105 ${cardColor}`}
                                >
                                    <CardContent>
                                        <Textarea
                                            className="text-lg leading-relaxed text-white/95 font-medium text-center cursor-default resize-none outline-0 ring-0 border-0"
                                            disabled={true}
                                            value={
                                                fb.Description
                                            }
                                        ></Textarea>
                                    </CardContent>
                                </Card>
                            );
                        })}
                </div>
            )}
            <div className="mt-6 flex flex-col sm:flex-row sm:space-x-4 items-center justify-center">
                <Button
                    className="mt-6 sm:mt-0 bg-purple-800 hover:bg-purple-700 text-white w-full sm:w-auto hover:shadow-lg translations duration-300 ease-in-out border-1 border-white/20 hover:border-white/30 hover:cursor-pointer"
                    onClick={() => logoutSession()}
                >
                    Logout
                </Button>
            </div>
        </div>
    );
}
