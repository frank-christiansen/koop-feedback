import {useState} from "react";
import {Plus} from "lucide-react";
import JoinSession from "~/components/app/JoinSession";
import {CreateSession} from "~/components/app/CreateSession";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "~/components/ui/card";
import {Button} from "~/components/ui/button";
import {useTranslation} from "~/context/Translation";
import type {Route} from "../../.react-router/types/app/routes/+types/page";
import Footer from "~/components/app/Footer";

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

            <Footer/>
        </div>
    );
}
