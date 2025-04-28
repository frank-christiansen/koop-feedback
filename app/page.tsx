"use client";
import { dbData } from "@/backend/database";
import {
  getLanguageFile,
  getLanguageKey,
  setLanguageKey,
} from "@/backend/lang";
import { CreateSession } from "@/components/app/createSession";
import JoinSession from "@/components/app/joinSession";
import LanguagePopup from "@/components/app/LanguagePopup";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Github, Languages, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [showCreateSession, setShowCreateSession] = useState(false);
  const [language, setLanguage] = useState<string>();
  const [showLanguage, setShowLanguage] = useState(false);
  const [transition, setTransition] = useState<FeedbackTranslations>();

  useEffect(() => {
    async function data() {
      if (language) return;
      setLanguage("en");
      const lang = document.cookie
        .split("; ")
        .find((row) => row.startsWith("lang="));
      if (lang) {
        const langValue = lang.split("=")[1];
        setLanguage(langValue);
      }

      const defaultLang = await getLanguageKey();
      const langFile = await getLanguageFile(defaultLang);
      setTransition(langFile);

      await dbData();
    }
    data();
  });

  const handleLanguageChange = async (value: string) => {
    setLanguage(value);
    document.cookie = `lang=${value}; path=/;`;
    await setLanguageKey(value);
  };

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
                  {transition?.mainpage.title}
                </CardTitle>
                <CardDescription className="text-white/80">
                  {transition?.mainpage.subtitle}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 cursor-pointer"
                  onClick={() => setShowCreateSession(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {transition?.mainpage.button.createSessionBtn}
                </Button>

                {/* Rest des existierenden Codes für Join Session */}
                <div className="relative">
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-transparent px-2 text-white/60">
                      {transition?.mainpage.infomsg}
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
            <div className="flex items-center space-x-4">
              <Link
                href="https://jesforge.dev"
                className="text-white/60 hover:text-white transition-colors"
              >
                {transition?.mainpage.footer.privacy}
              </Link>
              <span className="text-white/60">|</span>
              <Link
                href="https://jesforge.dev/impressum"
                className="text-white/60 hover:text-white transition-colors"
              >
                {transition?.mainpage.footer.imprint}
              </Link>
            </div>
            <div className="space-x-6 mt-4 md:mt-0 inline-flex">
              <Link
                href="https://github.com/frank-christiansen/koop-feedback"
                className="text-white/60 hover:text-white transition-colors"
              >
                <span className="sr-only inline-flex">GitHub</span>
                <Github></Github>
              </Link>
              <Languages
                onClick={() => setShowLanguage(!showLanguage)}
                className="inline-flex text-white/60 hover:text-white cursor-pointer"
              />

              {showLanguage && (
                <LanguagePopup
                  language={language as string}
                  setLanguage={setLanguage}
                  setShowLanguage={setShowLanguage}
                />
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
