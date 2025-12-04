"use client";

import {Copy, Crown, Trash,} from "lucide-react";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {useTranslation} from "~/context/Translation";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "~/components/ui/card";
import {Button} from "~/components/ui/button";
import type {DefaultAPIResponse, GETSessionResponseData} from "../../../../types/API";
import type {User} from "../../../../types/User";
import Loading from "~/components/app/Loading";
import Session404 from "~/components/app/Session404";

export default function SessionPage() {
    const [data, setData] = useState<GETSessionResponseData | null>(null);
    const [authId, setAuthId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
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

                if (apiData.Data.Session.IsStarted) {
                    window.open("/feedback/run", "_self")
                }

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

    const copySessionCode = async () => {
        if (!data) return;
        await navigator.clipboard.writeText(data.Session.Code.toString());
        toast.success(translations?.toats.copiedSessionCode);
    };

    const startSession = async () => {
        const req = await fetch("/api/v2/session/start", {
            method: "POST",
            headers: {
                "Authorization": authId as string,
                "Content-Type": "application/json",
            },
        });

        const data = await req.json();
        if (req.status !== 200) {
            toast(data.Message, {
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

    if (isLoading) return <Loading/>
    if (!data) return <Session404/>

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800">
            {/* Header */}
            <header className="py-4 px-6 border-b border-white/20 flex justify-between items-center">
                <div onClick={copySessionCode} className={"cursor-pointer"}>
                    <div className="flex items-center space-x-2 mt-1">
                        <span className="text-white/80  text-sm">Code: {data.Session.Code}</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white/60 h-6 w-6"

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
                                <CardTitle className="text-white cursor-pointer">
                                    {translations?.sessions.qrcode.title} -{" "}
                                    <Copy
                                        onClick={async () => {
                                            await navigator.clipboard.writeText(
                                                `http://${window.location.host}?join=${data?.Session.Code}`
                                            );
                                            toast.info(translations?.toats.copiedSessionCode)
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
                                        src={`https://api.qrserver.com/v1/create-qr-code/?data=http://${window.location.host}?code=${data.Session.Code}&size=1000x1000`}
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
                                        {translations?.sessions.member} ({data.Users.length})
                                    </CardTitle>
                                    {
                                        (!data.Session.IsStarted && data.Self.IsHost) && (
                                            <Button
                                                variant="default"
                                                className="bg-blue-500 text-white hover:bg-blue-600"
                                                onClick={startSession}
                                            >
                                                {translations?.sessions.startSession.button}
                                            </Button>
                                        )
                                    }
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Other participants */}
                                    {data.Users.map((user: User) => (
                                        <div
                                            key={user.ID}
                                            className="flex items-center p-3 bg-white/5 rounded-lg"
                                        >
                                            <div className="ml-4 flex-1">
                                                <h3 className="text-white font-medium">
                                                    {user.Name}
                                                </h3>
                                            </div>
                                            {user.IsHost ? (
                                                <Crown className="text-yellow-400 h-5 w-5"/>
                                            ) : (
                                                data.Self.IsHost && (
                                                    <Trash
                                                        onClick={() => {
                                                            fetch(
                                                                `/api/v2/user/${user.ID}`,
                                                                {
                                                                    method: "DELETE",
                                                                    headers: {
                                                                        "Authorization": authId as string,
                                                                        "Content-Type": "application/json",
                                                                    },
                                                                }
                                                            )
                                                                .then((res) => {
                                                                    if (!res.ok) {
                                                                        throw new Error(
                                                                            "Failed to remove user"
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
                                                        className="text-red-400 h-5 w-5 cursor-pointer"
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