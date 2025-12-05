"use client";

import {Copy,} from "lucide-react";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {useTranslation} from "~/context/Translation";
import {Button} from "~/components/ui/button";
import type {DefaultAPIResponse, GETSessionResponseData} from "../../../../types/API";
import Loading from "~/components/app/default/Loading";
import Session404 from "~/components/app/default/Session404";
import Users from "~/components/app/start/Users";
import QrCode from "~/components/app/start/QrCode";

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
                "Content-Type": "appl{/* Header */}ication/json",
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

            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <QrCode
                        code={data.Session.Code}
                    />
                    <Users
                        startSession={startSession}
                        authId={authId || ""}
                        data={data}
                    ></Users>
                </div>
            </main>
        </div>
    );
}