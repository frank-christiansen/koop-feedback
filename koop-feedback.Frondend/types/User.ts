import type {Feedback} from "./Feedback";
import type {Session} from "./Session";

export interface User {
    CreatedAt: Date
    DeletedAt: Date
    Feedback: Feedback[] | null
    HasSubmitted: false
    ID: number
    IsHost: boolean
    Name: string
    SessionID: number
    Session: Session
    UpdatedAt: Date
    APIAuth: null // Only to mark as null not included in API Requests...
}