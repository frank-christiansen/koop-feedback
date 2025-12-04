import {useState} from "react";
import {Github, Plus} from "lucide-react";
import JoinSession from "~/components/app/JoinSession";
import {CreateSession} from "~/components/app/CreateSession";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "~/components/ui/card";
import {Button} from "~/components/ui/button";
import {useTranslation} from "~/context/Translation";
import type {Route} from "../../.react-router/types/app/routes/+types/page";

export function meta({}: Route.MetaArgs) {
    return [
        {title: "Koop Feedback"},
        {name: "description", content: "Feedback app for Teams",},
    ];
}

export default function Page() {

    const [showCreateSession, setShowCreateSession] = useState(false);
    const {translations} = useTranslation()

    return (<div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800 flex flex-col">
            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center px-4">
                <div className="w-full max-w-md space-y-6">
                    {showCreateSession ? (
                        <CreateSession/>
                    ) : (
                        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                            <CardHeader>
                                <CardTitle className="text-white text-2xl">
                                    {translations?.mainpage.title}
                                </CardTitle>
                                <CardDescription className="text-white/80">
                                    {translations?.mainpage.subtitle}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 cursor-pointer"
                                    onClick={() => setShowCreateSession(true)}
                                >
                                    <Plus className="mr-2 h-4 w-4"/>
                                    {translations?.mainpage.button.createSessionBtn}
                                </Button>

                                {/* Rest des existierenden Codes für Join Session */}
                                <div className="relative">
                                    <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-transparent px-2 text-white/60">
                      {translations?.mainpage.infomsg}
                    </span>
                                    </div>
                                </div>

                                <JoinSession/>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>

            <footer className="bg-gradient-to-t from-purple-900 to-indigo-800 py-8">
                <div className="container mx-auto px-4">
                    <div
                        className="mt-12 pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-white/60 text-sm">
                            © 2025 xyzjesper.dev. All rights reserved.
                        </p>
                        <div className="flex items-center space-x-4">
                            <a
                                href="https://xyzjesper.dev"
                                className="text-white/60 hover:text-white transition-colors"
                            >
                                {translations?.mainpage.footer.privacy}
                            </a>
                            <span className="text-white/60">|</span>
                            <a
                                href="https://xyzjesper.dev/impressum"
                                className="text-white/60 hover:text-white transition-colors"
                            >
                                {translations?.mainpage.footer.imprint}
                            </a>
                        </div>
                        <div className="space-x-6 mt-4 md:mt-0 inline-flex">
                            <a
                                href="https://github.com/frank-christiansen/koop-feedback"
                                className="text-white/60 hover:text-white transition-colors"
                            >
                                <span className="sr-only inline-flex">GitHub</span>
                                <Github></Github>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
