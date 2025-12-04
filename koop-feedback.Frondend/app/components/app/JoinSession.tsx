"use client";
import {LogIn, X} from "lucide-react";
import {useState} from "react";
import {toast} from "react-toastify";
import {Label} from "~/components/ui/label";
import {Input} from "~/components/ui/input";
import {Button} from "~/components/ui/button";
import {useTranslation} from "~/context/Translation";

export default function JoinSession() {
    const [code, setCode] = useState<string>("");
    const [showUserNameInput, setShowUserNameInput] = useState(false);
    const [userName, setUserName] = useState<string>("");
    const {translations} = useTranslation()

    return (
        <div className="space-y-2">
            <Label htmlFor="code" className="text-white">
                {translations?.sessions.qrcode.title}
            </Label>
            <div className="flex space-x-2">
                <Input
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
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

                {showUserNameInput && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div
                            className="relative p-6 rounded-2xl shadow-xl max-w-md w-full bg-purple-800 border border-white/20">
                            <h2 className="text-white text-xl font-semibold mb-4">
                                {translations?.sessions.qrcode.title}
                                <X
                                    className="absolute top-4 right-4 h-5 w-5 text-white/70 hover:text-white cursor-pointer"
                                    onClick={() => setShowUserNameInput(false)}
                                />
                            </h2>
                            <div className="flex space-x-2">
                                <Input
                                    id="name"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    placeholder={translations?.toats.noName}
                                    className="bg-white/10 text-white placeholder-white/60 border-white/30 focus:ring-white/40"
                                />
                                <Button
                                    onClick={async () => {
                                        if (userName.length > 0) {
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
                                            const res = await req.json();

                                            await cookieStore.set({
                                                name: "authId",
                                                value: res.Data.authId
                                            })

                                            if (res.Success) {
                                                window.location.href = "/feedback/start";
                                            } else {
                                                toast.error(translations?.toats.errorByJoiningSession);
                                            }
                                        } else {
                                            toast.error(translations?.toats.noName);
                                        }
                                    }}
                                    variant="outline"
                                    className="text-white border-white bg-white/10 hover:bg-white/20 translations"
                                >
                                    <LogIn className="mr-2 h-4 w-4"/>
                                    Join
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}