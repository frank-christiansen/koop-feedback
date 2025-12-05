import {Card, CardContent, CardHeader, CardTitle} from "~/components/ui/card";
import {Button} from "~/components/ui/button";

export default function Session404() {
    return <div className="flex items-center justify-center min-h-screen">
        <Card className="bg-stone-900 backdrop-blur-sm border-white/20">
            <CardHeader>
                <CardTitle className="text-white">Session not found</CardTitle>
            </CardHeader>
            <CardContent>
                <Button onClick={() => window.open("/")}>Go Back</Button>
            </CardContent>
        </Card>
    </div>
}