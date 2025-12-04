import React, {createContext, useContext, useEffect, useState} from "react";
import {getLanguageFile, getLanguageKey} from "~/lib/util/language";
import type {FeedbackTranslations} from "../../types/FeedbackTranslations";

export interface TranslationContextType {
    translations: FeedbackTranslations,
    language: string
}

const TranslationContext = createContext<TranslationContextType>({} as TranslationContextType)

export default function TranslationContextProvider({children}: { children: React.ReactNode }) {
    const [translations, setTranslations] = useState<FeedbackTranslations>();
    const [language, setLanguage] = useState<string>("en");

    useEffect(() => {
        async function data() {
            if (translations) return

            const browserLang = navigator.language.split("-")[0];

            document.cookie = `language=${browserLang}; path=/;`;

            const defaultLang = getLanguageKey();
            const langFile = await getLanguageFile(defaultLang);

            setLanguage(defaultLang)
            setTranslations(langFile);
        }

        data();
    });


    return (
        <TranslationContext.Provider
            value={{
                translations,
                language
            } as TranslationContextType}
        >
            {children}
        </TranslationContext.Provider>
    )

}

export const useTranslation = () => {
    return useContext(TranslationContext);
};