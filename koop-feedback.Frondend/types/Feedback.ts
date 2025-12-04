import {FeedbackType} from "./FeedbackType";

export interface Feedback {
    Id: number
    UserId: number
    Type: FeedbackType
    Description: string
}