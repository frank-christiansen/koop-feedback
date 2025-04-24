import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react"; // Besser als "LogIn" für einen Close-Button

interface LanguagePopupProps {
  language: string;
  setLanguage: (value: string) => void;
  setShowLanguage: (value: boolean) => void;
}

const LanguagePopup: React.FC<LanguagePopupProps> = ({
  language,
  setLanguage,
  setShowLanguage,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="relative bg-gradient-to-br from-purple-900 to-indigo-800 rounded-lg shadow-xl p-4 w-full max-w-xs border border-indigo-600/50">
        {/* Close Button */}
        <button
          onClick={() => setShowLanguage(false)}
          className="absolute top-3 right-3 text-white/60 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="text-white font-medium mb-4 text-center">
          Select Language
        </h3>

        <form>
          <div className="flex flex-col gap-4">
            <Select
              value={language}
              onValueChange={(value) => {
                setLanguage(value);
                document.cookie = `lang=${value}; path=/;`;
              }}
            >
              <SelectTrigger className="w-full text-white border-indigo-500/50 bg-indigo-900/50 hover:bg-indigo-900/70 focus:ring-1 focus:ring-indigo-400">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent className="bg-indigo-900 border-indigo-500/50 text-white">
                <SelectItem
                  value="en"
                  className="hover:bg-indigo-800 focus:bg-indigo-800"
                >
                  English
                </SelectItem>
                <SelectItem
                  value="de"
                  className="hover:bg-indigo-800 focus:bg-indigo-800"
                >
                  Deutsch
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              type="button"
              onClick={() => setShowLanguage(false)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white mt-2"
            >
              Confirm
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LanguagePopup;
