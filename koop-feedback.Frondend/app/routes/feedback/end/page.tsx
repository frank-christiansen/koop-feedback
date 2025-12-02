"use client";

import {useEffect, useState} from "react";
import {useTranslation} from "~/context/Translation";
import {Card, CardContent} from "~/components/ui/card";
import {Button} from "~/components/ui/button";

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
    const {translations} = useTranslation()

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

    const logoutSession = async () => {
        const req = await fetch("/api/v1/user/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        window.location.href = req.url;
    };

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-purple-900 to-indigo-800 text-white">
            <div className="flex items-center justify-center mb-6">
                <h1 className="text-3xl font-bold text-white">
                    {translations?.endSession.title}
                </h1>
            </div>
            {feedbacks.length === 0 ? (
                <p className="text-center text-white/60 text-xl">
                    {translations?.endSession.noFeedback}
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {feedbacks
                        .sort((a, b) => (a.Type === "positive" ? -1 : 1))
                        .map((fb) => {
                            const isPositive = fb.Type === "positive";
                            const cardColor = isPositive ? "bg-green-500" : "bg-yellow-500";
                            return (
                                <Card
                                    key={fb.Id}
                                    className={`rounded-2xl p-4 shadow-lg border border-white/20 backdrop-blur-md text-white translations-transform transform hover:scale-105 ${cardColor}`}
                                >
                                    <CardContent>
                                        <p className="text-lg leading-relaxed text-white/95 font-medium text-center">
                                            {fb.Description}
                                        </p>
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