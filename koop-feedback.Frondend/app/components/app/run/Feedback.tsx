import {FeedbackType} from "../../../../types/FeedbackType";
import {Send, Trash} from "lucide-react";
import {Button} from "~/components/ui/button";
import type {GETSessionResponseData} from "../../../../types/API";
import type {Feedback} from "../../../../types/Feedback";

export default function FeedbackView(
    {
        data,
        feedback,
        handleRemoveFeedback
    }:
    {
        data: GETSessionResponseData,
        feedback: Feedback[],
        handleRemoveFeedback: (id: number) => void
    }
) {


    return <div className="space-y-2">
        {feedback
            .sort((a, b) => {
                const nameCompare = data.Users.filter(value => value.ID == a.UserId)[0].Name.localeCompare(
                    data.Users.filter(value => value.ID == b.UserId)[0].Name
                );
                if (nameCompare !== 0) return nameCompare;

                return a.Type == FeedbackType.Positive ? -1 : 1;
            })
            .map((feedback) => (
                <div
                    key={feedback.Id}
                    className={`p-3 rounded-lg flex justify-between items-center ${
                        feedback.Type == FeedbackType.Positive
                            ? "bg-green-500 text-black"
                            : "bg-yellow-500"
                    }`}
                >
                    <div>
                        <p className="text-xl font-medium text-black flex items-center">
                            <Send className="inline h-4 w-4 mr-1 "></Send>{" "}
                            {data.Users.filter(value => value.ID == feedback.UserId)[0].Name}
                        </p>
                        <p className="text-sm mt-1 text-gray-700 font-semibold">
                            {feedback.Description}
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:bg-red-400/10"
                        onClick={() => handleRemoveFeedback(feedback.Id)}
                    >
                        <Trash className="h-4 w-4"/>
                    </Button>
                </div>
            ))}
    </div>
}