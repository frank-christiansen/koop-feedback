import {Check, Crown, X} from "lucide-react";
import type {GETSessionResponseData} from "../../../../types/API";
import type {User} from "../../../../types/User";

export default function Users(
    {
        setSelectedUser,
        data
    }: {
        data: GETSessionResponseData
        setSelectedUser: (user: User) => void
    }
) {

    return <div className="space-y-3">
        {data.Users.sort((a: { Name: string; }, b: { Name: string; }) => {
            const nameA = a.Name.toLowerCase();
            const nameB = b.Name.toLowerCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        }).map((user) => (
            <div
                key={user.ID}
                className="bg-white/5 rounded-lg overflow-hidden cursor-pointer"
            >
                <div
                    className={`p-3 flex items-center justify-between`}
                    onClick={() => {
                        if (data?.Self.ID != user.ID && !data?.Self.HasSubmitted) {
                            setSelectedUser(user);
                        }
                    }}
                >
                    <div className="flex items-center space-x-3">
                        <div>
                            <h3 className="text-white font-medium flex items-center">
                                                            <span
                                                                className={`${(data?.Self.ID == user.ID || data?.Self.HasSubmitted) && "blur-xs"}`}> {user.Name}</span>
                                {user.IsHost && (
                                    <Crown className="text-yellow-400 h-4 w-4 ml-2"/>
                                )}
                                {data.Self.IsHost && ((user.HasSubmitted) ? (
                                    <Check
                                        className="text-green-400 h-4 w-4 ml-2"></Check>
                                ) : (
                                    <X className="text-red-400 h-4 w-4 ml-2"/>
                                ))
                                }
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </div>

}