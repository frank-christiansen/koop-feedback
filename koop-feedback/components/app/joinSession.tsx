"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useEffect, useState } from "react";

export default function JoinSession() {
  const [code, setCode] = useState<string>("");

  useEffect(() => {
    const code = window.location.href.split("?join=")[1];
    setCode(code);
  }, []);

  return (
    <div className="space-y-2">
      <Label htmlFor="code" className="text-white">
        Session Code
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
          onClick={async () => {
            const res = await fetch("/api/v1/session/join", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ code }),
            });
            const data = await res.json();
            if (data.error) {
              alert("Invalid code or session not found.");
            } else {
              window.location.href = `/feedback/start`;
            }
          }}
          variant="outline"
          className="text-white border-white bg-white/10 cursor-pointer"
        >
          <LogIn className="mr-2 h-4 w-4" />
          Join
        </Button>
      </div>
    </div>
  );
}
