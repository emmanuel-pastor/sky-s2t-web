import './App.css'
import {ThemeProvider} from "@/components/theme-provider.tsx";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {SpeechIcon, StopCircleIcon} from "lucide-react";
import SpeechRecognition from "@/lib/SpeechRecognition.ts";

function App() {
  const [displayText, setDisplayText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognizer: SpeechRecognition = SpeechRecognition.getInstance(import.meta.env.VITE_SPEECH_KEY, import.meta.env.VITE_SPEECH_REGION);

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
  }, []);

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [displayText]);

  let sentenceCount = 0;
  let rollingStartIndex = 0;
  const sentences: string[] = ["", "", ""];

  function onStartClicked() {
    setIsListening(true);
    setDisplayText('Listening...');
    recognizer.startRecognition(
      onRecognizing,
      onRecognitionDone
    );
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

  function onRecognizing(text: string) {
    if (text.length > 0) {
      sentences[sentenceCount % 3] = text;
      setDisplayText(sentences[rollingStartIndex % 3] + '\n' + sentences[(rollingStartIndex + 1) % 3] + '\n' + sentences[(rollingStartIndex + 2) % 3]);
    }
  }

  function onStopClicked() {
    setIsListening(false);
    recognizer.stopRecognition();
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="row max-w-6xl">
        {isListening ?
          <Button onClick={onStopClicked}>
            <StopCircleIcon className="mr-2 h-4 w-4"/> Stop
          </Button>
          :
          <Button onClick={onStartClicked}>
            <SpeechIcon className="mr-2 h-4 w-4"/> Start
          </Button>
        }
        <div className="mt-8 text-3xl text-left leading-snug">
          {displayText}
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
