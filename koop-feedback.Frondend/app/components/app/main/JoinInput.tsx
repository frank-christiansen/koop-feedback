import {LogIn, X} from "lucide-react";
import {Input} from "~/components/ui/input";
import {Button} from "~/components/ui/button";
import {useTranslation} from "~/context/Translation";

export default function JoinInput(
    {
        userName,
        setUserName,
        onClose,
        handleJoin
    }:
    {
        userName: string
        setUserName: (name: string) => void,
        onClose: () => void
        handleJoin: () => void
    }
) {
    const {translations} = useTranslation()

    return <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
            className="relative p-6 rounded-2xl shadow-xl max-w-md w-full bg-purple-800 border border-white/20">
            <h2 className="text-white text-xl font-semibold mb-4">
                {translations?.sessions.qrcode.title}
                <X
                    className="absolute top-4 right-4 h-5 w-5 text-white/70 hover:text-white cursor-pointer"
                    onClick={() => onClose()}
                />
            </h2>
            <div className="flex space-x-2">
                <Input
                    id="name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder={translations?.toats.noName}
                    className="bg-white/10 text-white placeholder-white/60 border-white/30 focus:ring-white/40"
                />
                <Button
                    onClick={handleJoin}
                    variant="outline"
                    className="text-white border-white bg-white/10 hover:bg-white/20 translations"
                >
                    <LogIn className="mr-2 h-4 w-4"/>
                    Join
                </Button>
            </div>
        </div>
    </div>
}