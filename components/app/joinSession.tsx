"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogIn, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getLanguageFile, getLanguageKey } from "@/backend/lang";

export default function JoinSession() {
  const [code, setCode] = useState<string>("");
  const [showUserNameInput, setShowUserNameInput] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [transition, setTransition] = useState<FeedbackTranslations>();

  useEffect(() => {
    const code = window.location.href.split("?join=")[1];
    setShowUserNameInput(!!code);
    setCode(code);

    async function data() {
      const defaultLang = await getLanguageKey();
      const langFile = await getLanguageFile(defaultLang);
      setTransition(langFile);
    }
    data();
  }, []);

  return (
    <div className="space-y-2">
      <Label htmlFor="code" className="text-white">
        {transition?.sessions.qrcode.title}
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
          <LogIn className="mr-2 h-4 w-4" />
          Join
        </Button>

        {showUserNameInput && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="relative p-6 rounded-2xl shadow-xl max-w-md w-full bg-purple-800 border border-white/20">
              <h2 className="text-white text-xl font-semibold mb-4">
                {transition?.sessions.qrcode.title}
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
                  placeholder={transition?.toats.noName}
                  className="bg-white/10 text-white placeholder-white/60 border-white/30 focus:ring-white/40"
                />
                <Button
                  onClick={async () => {
                    if (userName.length > 0) {
                      const res = await fetch(`/api/v1/session/join`, {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          code: code,
                          name: userName,
                        }),
                      });
                      if (res.status === 200) {
                        window.location.href = "/feedback/start";
                      } else {
                        toast.error(transition?.toats.errorByJoiningSession);
                      }
                    } else {
                      toast.error(transition?.toats.noName);
                    }
                  }}
                  variant="outline"
                  className="text-white border-white bg-white/10 hover:bg-white/20 transition"
                >
                  <LogIn className="mr-2 h-4 w-4" />
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
