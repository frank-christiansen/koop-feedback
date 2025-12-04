"use client";

import {Copy, Crown, Trash,} from "lucide-react";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {useTranslation} from "~/context/Translation";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "~/components/ui/card";
import {Button} from "~/components/ui/button";

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
}

export default function SessionPage() {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const {translations} = useTranslation()

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const authId = await cookieStore.get("authId")
                if (!authId) {
                    window.location.href = "/";
                    return;
                }

                const req = await fetch("/api/v2/session", {
                    method: "GET",
                    headers: {
                        "Authorization": authId.value as string,
                        "Content-Type": "application/json",
                    },
                });
                const data = await req.json();

                console.log(data)

                setSession(data.Data.Session)
            } catch (error) {
                toast.error(translations?.toats.failedToLoadSession);
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
        toast.success(translations?.toats.copiedSessionCode);
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

        toast(translations?.toats.sessionStarted, {
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
                        <Button onClick={() => window.open("/")}>Go to Home</Button>
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
                            <Copy className="h-3 w-3"/>
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
                                    {translations?.sessions.qrcode.title} -{" "}
                                    <Copy
                                        onClick={() => {
                                            navigator.clipboard.writeText(
                                                `http://${window.location.host}?join=${session.Code}`
                                            );
                                            toast.success(translations?.toats.copiedSessionCode);
                                        }}
                                        className="inline-flex"
                                        height={15}
                                        width={15}
                                    ></Copy>
                                </CardTitle>
                                <CardDescription className="text-white/60">
                                    {translations?.sessions.qrcode.subtitle}
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
                                        {translations?.sessions.member} ({session.Users.length})
                                    </CardTitle>
                                    {session.Host.UserId === user?.UserId &&
                                        !session.IsStarted && (
                                            <Button
                                                variant="default"
                                                className="bg-blue-500 text-white hover:bg-blue-600"
                                                onClick={startSession}
                                            >
                                                {translations?.sessions.startSession.button}
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
                                                <Crown className="text-yellow-400 h-5 w-5"/>
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