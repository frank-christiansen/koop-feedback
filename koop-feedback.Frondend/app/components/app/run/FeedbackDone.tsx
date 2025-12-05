import {Card, CardContent, CardHeader, CardTitle} from "~/components/ui/card";
import {useTranslation} from "~/context/Translation";

export default function FeedbackDone() {
    const {translations} = useTranslation()

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl w-[90%] max-w-md">
                <CardHeader>
                    <CardTitle className="text-white text-center">
                        {translations?.runSession.alreadySubmitted}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-white text-center">
                        {translations?.runSession.alreadySubmittedTooltip}
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}