import {useContext, useEffect, useRef, useState} from "react";
import SpeechRecognition from "@/lib/SpeechRecognition.ts";
import {Button} from "@/components/ui/button.tsx";
import {SpeechIcon, StopCircleIcon} from "lucide-react";
import Token from "@/models/Token.ts";
import {AppContext} from "@/context/AppContext.ts";
import {AppScreenEnum} from "@/models/AppScreen.enum.ts";
import {useTranslation} from "react-i18next";

function SpeechScreen() {
  const {navigateTo} = useContext(AppContext);
  const {t} = useTranslation();
  const [displayText, setDisplayText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognizer, setRecognizer] = useState<SpeechRecognition | null>(null);
  const displayTextRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const accessToken = Token.fromCookie('accessToken')?.toString();
    if (accessToken) {
      setRecognizer(SpeechRecognition.getInstance(accessToken, import.meta.env.VITE_SPEECH_REGION));
    } else {
      navigateTo(AppScreenEnum.Home);
    }
  }, [navigateTo]);

  // Stops the recognition when the tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        onStopClicked();
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  });

  // Scrolls to the bottom of the screen when the displayText changes
  useEffect(() => {
    if (displayTextRef.current) {
      displayTextRef.current.scrollTop = displayTextRef.current.scrollHeight;
    }
  }, [displayText]);

  let sentenceCount = 0;
  let rollingStartIndex = 0;
  const sentences: string[] = ["", "", ""];

  function onStartClicked() {
    setIsListening(true);
    setDisplayText(t("listening"));
    recognizer?.startRecognition(
      onRecognizing,
      onRecognitionDone
    );
  }

  function onRecognizing(text: string) {
    if (text.length > 0) {
      sentences[sentenceCount % 3] = text;
      setDisplayText(sentences[rollingStartIndex % 3] + '\n' + sentences[(rollingStartIndex + 1) % 3] + '\n' + sentences[(rollingStartIndex + 2) % 3]);
    }
  }

  function onRecognitionDone(text: string) {
    if (text.length > 0) {
      sentences[sentenceCount % 3] = text;
      setDisplayText(sentences[rollingStartIndex % 3] + '\n' + sentences[(rollingStartIndex + 1) % 3] + '\n' + sentences[(rollingStartIndex + 2) % 3]);
      sentenceCount++;
      if (sentenceCount > 2) {
        rollingStartIndex++;
      }
    }
  }

  function onStopClicked() {
    setIsListening(false);
    recognizer?.stopRecognition();
  }

  return (
    <>
      <div className="fixed bottom-0 inset-x-0 flex flex-col h-full w-full">
        <div
          ref={displayTextRef}
          className="flex-grow m-auto w-full p-2 text-3xl text-left leading-snug max-w-6xl overflow-auto">
          {displayText}
        </div>
        <div className="flex items-center justify-center py-4 border-t-2 border-gray-500">
          {isListening ?
            <Button onClick={onStopClicked}>
              <StopCircleIcon className="mr-2 h-4 w-4"/> {t('stop')}
            </Button>
            :
            <Button onClick={onStartClicked}>
              <SpeechIcon className="mr-2 h-4 w-4"/> {t('start')}
            </Button>
          }
        </div>
      </div>
    </>
  )
}

export default SpeechScreen;