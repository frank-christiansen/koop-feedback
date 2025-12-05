export interface FeedbackTranslations {
    mainpage: {
        title: string;
        subtitle: string;
        button: {
            createSessionBtn: string;
        };
        infomsg: string;
        code: {
            label: string;
            placeholder: string;
            button: string;
        };
        footer: {
            imprint: string;
            imprintUrl: string
            privacy: string;
            privacyUrl: string
        };
    };
    createSession: {
        title: string;
        subtitle: string;
        name: {
            label: string;
            placeholder: string;
        };
        button: {
            createSessionBtn: string;
            creating: string;
        };
    };
    sessions: {
        qrcode: {
            title: string;
            subtitle: string;
        };
        member: string;
        startSession: {
            button: string;
        };
    };
    runSession: {
        header: {
            sessionCode: string;
            loggedIn: string;
        };
        member: string;
        alreadySubmitted: string;
        feedbackReady: string;
        alreadySubmittedTooltip: string;
        feedback: {
            feedback: string;
            placeholder: string;
        };
        button: {
            sendFeedbackBtn: string;
            endSessionBtn: string;
            cancelBtn: string;
        };
    };
    endSession: {
        title: string;
        noFeedback: string;
        button: {
            logoutBtn: string;
        };
    };
    toats: {
        sessionCreated: string;
        sessionJoined: string;
        sessionStarted: string;
        feedbackSent: string;
        sessionEnded: string;
        sessionNotFound: string;
        sessionErrorCreating: string;
        noFeedbackSent: string;
        feedbackSendedItems: string;
        sessionCodeInvalid: string;
        feedbackNotFound: string;
        feedbackSentError: string;
        sessionEndedError: string;
        feedbackAdded: string;
        feedbackRemoved: string;
        failedToLoadSession: string;
        failedToLoadFeedback: string;
        errorByJoiningSession: string;
        noName: string;
        noDescription: string;
        copiedSessionCode: string;
    };
}