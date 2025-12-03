"use client";

import {Plus} from "lucide-react";
import {useState} from "react";
import {toast} from "react-toastify";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "~/components/ui/card";
import {Label} from "~/components/ui/label";
import {Input} from "~/components/ui/input";
import {Button} from "~/components/ui/button";
import {useTranslation} from "~/context/Translation";

export function CreateSession() {
    const [name, setName] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const {translations} = useTranslation()

    const handleCreateSession = async () => {
        if (!name.trim()) return;
        setIsCreating(true);

        const req = await fetch("/api/v1/session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name.trim(),
            }),
        });

        const res = await req.json();
        if (res.success) {
            toast(translations?.toats.sessionCreated, {
                type: "success",
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            setTimeout(() => {
                window.open("/feedback/start", "_self");
            }, 1000);
        } else {
            toast(translations?.toats.sessionErrorCreating, {
                type: "error",
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    return (
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-white text-2xl">
                    {translations?.createSession.title}
                </CardTitle>
                <CardDescription className="text-white/80">
                    {translations?.createSession.subtitle}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">
                        {translations?.createSession.name.label}
                    </Label>
                    <Input
                        id="name"
                        placeholder={translations?.createSession.name.placeholder}
                        className="bg-white/10 border-white/20 text-white placeholder-white/50"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleCreateSession()}
                    />
                </div>

                <Button
                    className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 cursor-pointer"
                    onClick={handleCreateSession}
                    disabled={!name.trim() || isCreating}
                >
                    {isCreating ? (
                        <div className="flex items-center">
                            <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            {translations?.createSession.button.creating}
                        </div>
                    ) : (
                        <>
                            <Plus className="mr-2 h-4 w-4"/>
                            {translations?.createSession.button.createSessionBtn}
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}