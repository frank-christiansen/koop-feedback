import type {Session} from "./Session";
import type {User} from "./User";

export interface DefaultAPIResponse<T> {
    Success: boolean
    Message: string
    Data: T
}

export interface POSTCreateSessionResponseData {
    authId: string
}

export interface POSTSessionFeedbackResponseData {
    Success: number
    Failed: number
}

export interface GETSessionResponseData {
    Self: User
    Session: Session
    Users: User[]
}