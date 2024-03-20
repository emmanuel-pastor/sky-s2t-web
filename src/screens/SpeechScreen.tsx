import {useEffect, useState} from "react";
import SpeechRecognition from "@/lib/SpeechRecognition.ts";
import {Button} from "@/components/ui/button.tsx";
import {SpeechIcon, StopCircleIcon} from "lucide-react";

function SpeechScreen() {
  const [displayText, setDisplayText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognizer: SpeechRecognition = SpeechRecognition.getInstance(import.meta.env.VITE_SPEECH_KEY, import.meta.env.VITE_SPEECH_REGION);

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
    recognizer.stopRecognition();
  }

  return (
    <div className="row  max-w-6xl">
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
  )
}

export default SpeechScreen;