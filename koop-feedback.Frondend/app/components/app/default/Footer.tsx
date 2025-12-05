import {Github} from "lucide-react";
import {useTranslation} from "~/context/Translation";

export default function Footer() {
    const {translations} = useTranslation()

    return <footer className="bg-gradient-to-t from-purple-900 to-indigo-800 py-8">
        <div className="container mx-auto px-4">
            <div
                className="mt-12 pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center">
                <p className="text-white/60 text-sm">
                    © 2025 <a
                    href="https://xyzjesper.dev"
                    className="text-white/60 hover:text-white transition-colors"
                >
                    xyzjesper.dev
                </a>. All rights reserved.
                </p>
                <div className="flex items-center space-x-4">
                    <a
                        href={translations.mainpage.footer.privacyUrl}
                        className="text-white/60 hover:text-white transition-colors"
                    >
                        {translations?.mainpage.footer.privacy}
                    </a>
                    <span className="text-white/60">|</span>
                    <a
                        href="https://xyzhub.link/pages/imprint-notice"
                        className="text-white/60 hover:text-white transition-colors"
                    >
                        {translations?.mainpage.footer.imprint}
                    </a>
                </div>
                <div className="space-x-6 mt-4 md:mt-0 inline-flex">
                    <a
                        href={translations.mainpage.footer.imprintUrl}
                        className="text-white/60 hover:text-white transition-colors"
                    >
                        <span className="sr-only inline-flex">GitHub</span>
                        <Github></Github>
                    </a>
                </div>
            </div>
        </div>
    </footer>
}