"use client";
import { dbData } from "@/backend/database";
import { CreateSession } from "@/components/app/createSession";
import JoinSession from "@/components/app/joinSession";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, LogIn, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [showCreateSession, setShowCreateSession] = useState(false);

  useEffect(() => {
    async function data() {
      await dbData();
    }
    data();
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800 flex flex-col">
      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6">
          {showCreateSession ? (
            <CreateSession />
          ) : (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-2xl">
                  Welcome to Koop Feedback
                </CardTitle>
                <CardDescription className="text-white/80">
                  Create or join a feedback session.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 cursor-pointer"
                  onClick={() => setShowCreateSession(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Session
                </Button>

                {/* Rest des existierenden Codes für Join Session */}
                <div className="relative">
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-transparent px-2 text-white/60">
                      Or join with code
                    </span>
                  </div>
                </div>

                <JoinSession />
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <footer className="bg-gradient-to-t from-purple-900 to-indigo-800 py-8">
        <div className="container mx-auto px-4">
          <div className="mt-12 pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm">
              © 2025 Jesforge.dev. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                href="https://github.com/frank-christiansen/koop-feedback"
                className="text-white/60 hover:text-white transition-colors"
              >
                <span className="sr-only">GitHub</span>
                <Github></Github>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
