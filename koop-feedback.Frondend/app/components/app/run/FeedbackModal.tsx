import {Dialog, DialogContent, DialogHeader, DialogTitle} from "~/components/ui/dialog";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "~/components/ui/select";
import {FeedbackType} from "../../../../types/FeedbackType";
import {Meh, Smile} from "lucide-react";
import {Textarea} from "~/components/ui/textarea";
import {Button} from "~/components/ui/button";
import type {User} from "../../../../types/User";
import {useTranslation} from "~/context/Translation";

export function FeedbackModal(
    {
        selectedUser,
        setSelectedUser,
        setFeedbackType,
        feedbackType,
        description,
        setDescription,
        handleAddFeedback
    }:
    {
        selectedUser: User | null,
        setSelectedUser: (user: User | null) => void,
        setFeedbackType: (type: string) => void,
        handleAddFeedback: () => void,
        feedbackType: string,
        setDescription: (description: string) => void,
        description: string
    }
) {
    const {translations} = useTranslation()

    return <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent
            className="rounded-2xl shadow-xl border border-white/10 bg-[#1d112d]/80 backdrop-blur-md p-6">
            <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-white">
                    Feedback {selectedUser?.Name}
                    <form action="" method="post"></form>
                    {" "}
                </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
                <Select
                    onValueChange={(value) => setFeedbackType(value)}
                    defaultValue={feedbackType as any}
                >
                    <SelectTrigger
                        className="bg-white/5 border border-white/10 text-white hover:bg-[#aa77ff]/10 translations-all">
                        <SelectValue placeholder="Feedback-Typ"/>
                    </SelectTrigger>
                    <SelectContent
                        className="bg-[#1d112d]/80 backdrop-blur-sm border border-white/20 text-white rounded-xl">
                        <SelectItem
                            value={String(FeedbackType.Positive)}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-[#aa77ff]/10 focus:bg-[#aa77ff]/10"
                        >
                            <Smile className="h-4 w-4 text-green-500"/>
                            <span className="text-white">Positiv</span>
                        </SelectItem>
                        <SelectItem
                            value={String(FeedbackType.Normal)}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-[#aa77ff]/10 focus:bg-[#aa77ff]/10"
                        >
                            <Meh className="h-4 w-4 text-yellow-500"/>
                            <span className="text-white">Neutral</span>
                        </SelectItem>
                    </SelectContent>
                </Select>

                <Textarea
                    placeholder=""
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-white/5 border border-white/10 text-white placeholder-white/40 rounded-md p-3 min-h-[100px]"
                />

                <div className="flex justify-end space-x-2 pt-2">
                    <Button
                        variant="ghost"
                        className="border border-white/10 text-white hover:bg-white/10 translations-all cursor-pointer"
                        onClick={() => setSelectedUser(null)}
                    >
                        {translations?.runSession.button.cancelBtn}
                    </Button>
                    <Button
                        onClick={handleAddFeedback}
                        disabled={description.length < 10}
                        className="bg-[#aa77ff] hover:bg-[#9d66cc] text-white translations-all cursor-pointer"
                    >
                        {translations?.runSession.button.sendFeedbackBtn}
                    </Button>
                </div>
                <span className={"text-white"}>min. {description.length}/10 characters</span>
            </div>
        </DialogContent>
    </Dialog>

}