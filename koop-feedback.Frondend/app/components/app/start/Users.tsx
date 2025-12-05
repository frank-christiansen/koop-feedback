import {Card, CardContent, CardHeader, CardTitle} from "~/components/ui/card";
import {Button} from "~/components/ui/button";
import type {User} from "../../../../types/User";
import {Crown, Trash} from "lucide-react";
import {toast} from "react-toastify";
import type {GETSessionResponseData} from "../../../../types/API";
import {useTranslation} from "~/context/Translation";

export default function Users(
    {
        data,
        authId,
        startSession
    }: {
        data: GETSessionResponseData,
        authId: string,
        startSession: () => void
    }
) {
    const {translations} = useTranslation()

    const handleRemoveUser = async (user: User) => {
        fetch(
            `/api/v2/user/${user.ID}`,
            {
                method: "DELETE",
                headers: {
                    "Authorization": authId as string,
                    "Content-Type": "application/json",
                },
            }
        )
            .then((res) => {
                if (!res.ok) {
                    throw new Error(
                        "Failed to remove user"
                    );
                }
                return res.json();
            })
            .catch((error) => {
                toast(error.message, {
                    type: "error",
                    position: "top-right",
                    autoClose: 5000,
                });
            });
    }

    return (
        <div className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-white">
                            {translations?.sessions.member} ({data.Users.length})
                        </CardTitle>
                        {
                            (!data.Session.IsStarted && data.Self.IsHost) && (
                                <Button
                                    variant="default"
                                    className="bg-blue-500 text-white hover:bg-blue-600"
                                    onClick={startSession}
                                >
                                    {translations?.sessions.startSession.button}
                                </Button>
                            )
                        }
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {data.Users.map((user: User) => (
                            <div
                                key={user.ID}
                                className="flex items-center p-3 bg-white/5 rounded-lg"
                            >
                                <div className="ml-4 flex-1">
                                    <h3 className="text-white font-medium">
                                        {user.Name}
                                    </h3>
                                </div>
                                {user.IsHost ? (
                                    <Crown className="text-yellow-400 h-5 w-5"/>
                                ) : (
                                    data.Self.IsHost && (
                                        <Trash
                                            onClick={() => handleRemoveUser(user)}
                                            className="text-red-400 h-5 w-5 cursor-pointer"
                                        />
                                    )
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}