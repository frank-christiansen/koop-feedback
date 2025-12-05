import {toast} from "react-toastify";
import {Copy} from "lucide-react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "~/components/ui/card";
import {useTranslation} from "~/context/Translation";

export default function QrCode(
    {
        code
    }:
    {
        code: number
    }
) {

    const {translations} = useTranslation()

    return <div className="lg:col-span-1">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
                <CardTitle className="text-white cursor-pointer">
                    {translations?.sessions.qrcode.title} -{" "}
                    <Copy
                        onClick={async () => {
                            await navigator.clipboard.writeText(
                                `https://${window.location.host}?join=${code}`
                            );
                            toast.info(translations?.toats.copiedSessionCode)
                        }}
                        className="inline-flex"
                        height={15}
                        width={15}
                    ></Copy>
                </CardTitle>
                <CardDescription className="text-white/60">
                    {translations?.sessions.qrcode.subtitle}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center h-48">
                <div className="bg-white/10 p-4 rounded-lg shadow-lg">
                    <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?data=http://${window.location.host}?code=${code}&size=1000x1000`}
                        alt="QR Code"
                        className="w-32 h-32"
                    />
                </div>
            </CardContent>
        </Card>
    </div>
}