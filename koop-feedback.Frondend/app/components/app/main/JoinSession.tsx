"use client";
import {LogIn} from "lucide-react";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {Label} from "~/components/ui/label";
import {Input} from "~/components/ui/input";
import {Button} from "~/components/ui/button";
import {useTranslation} from "~/context/Translation";
import type {DefaultAPIResponse, POSTCreateSessionResponseData} from "../../../../types/API";
import JoinInput from "~/components/app/main/JoinInput";

export default function JoinSession() {
    const [code, setCode] = useState<number>();
    const [showUserNameInput, setShowUserNameInput] = useState(false);
    const [userName, setUserName] = useState<string>("");
    const {translations} = useTranslation()

    useEffect(() => {
        const willJoin = window.location.href.includes("?code=")
        if (!willJoin) return
        const code = window.location.href.split("?code=").pop()
        if (code != null) {
            try {
                const num = parseInt(code)
                setCode(num)
                setShowUserNameInput(true)
            } catch (e) {

            }
        }
    }, []);

    const handleJoin = async () => {

        if (userName.length > 0) {
            try {
                const req = await fetch(`/api/v2/session/join`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        Code: code,
                        Name: userName,
                    }),
                });

                const res = await req.json() as DefaultAPIResponse<POSTCreateSessionResponseData>

                await cookieStore.set({
                    name: "authId",
                    value: res.Data.authId
                })

                if (res.Success || req.ok) {
                    window.location.href = "/feedback/start";
                } else {
                    toast.error(translations?.toats.errorByJoiningSession);
                }
            } catch (e) {
                toast.error(translations?.toats.errorByJoiningSession);
            }
        } else {
            toast.error(translations?.toats.noName);
        }
    }

    return (
        <div className="space-y-2">
            <Label htmlFor="code" className="text-white">
                {translations?.sessions.qrcode.title}
            </Label>
            <div className="flex space-x-2">
                <Input
                    id="code"
                    value={code}
                    onChange={(e) => setCode(parseInt(e.target.value))}
                    placeholder="Enter 6-digit code"
                    className="bg-white/10 border-white/20 text-white placeholder-white/50"
                />
                <Button
                    onClick={() => {
                        setShowUserNameInput(true);
                    }}
                    variant="outline"
                    className="text-white border-white bg-white/10 cursor-pointer"
                >
                    <LogIn className="mr-2 h-4 w-4"/>
                    Join
                </Button>

                {showUserNameInput &&
                    <JoinInput
                        userName={userName}
                        setUserName={name => setUserName(name)}
                        onClose={() => setShowUserNameInput(false)}
                        handleJoin={handleJoin}
                    />
                }
            </div>
        </div>
    );
}