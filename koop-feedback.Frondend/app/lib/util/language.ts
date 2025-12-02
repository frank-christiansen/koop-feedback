import type {FeedbackTranslations} from "../../../types/FeedbackTranslations";

export function getLanguageKey(): string {
    const languageKey = document.cookie
        .split("; ")
        .find((row) => row.startsWith("language="))
        ?.split("=")[1]
    return languageKey || "en";
}

export async function getLanguageFile(
    key: string,
): Promise<FeedbackTranslations> {
    const langFile = await fetch(`/language/${key}.json`)
    return await langFile.json() as FeedbackTranslations;
}