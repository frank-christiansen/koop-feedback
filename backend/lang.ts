"use server";
import { cookies } from "next/headers";

export async function setLanguageKey(
    lang: string,
): Promise<void> {
    const cookie = await cookies();
    cookie.set("lang", lang,)
}

export async function getLanguageKey(): Promise<string> {
    const cookie = await cookies();
    const lang = cookie.get("lang")?.value || "en";
    return lang;
}

export async function getLanguageFile(
    lang: string,
): Promise<FeedbackTranslations> {
    const langFile = require(`../public/lang/${lang}.json`) as FeedbackTranslations;
    return langFile;
}