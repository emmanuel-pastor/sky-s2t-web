import './App.css'
import {ThemeProvider} from "@/components/theme-provider.tsx";
import {useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {SpeechIcon, StopCircleIcon} from "lucide-react";
import * as speechsdk from "microsoft-cognitiveservices-speech-sdk";

function App() {
  const [displayText, setDisplayText] = useState('');
  const [isListening, setIsListening] = useState(false);
  let recognizer: speechsdk.SpeechRecognizer | undefined;

  async function sttFromMic() {
    const speechConfig = speechsdk.SpeechConfig.fromSubscription(import.meta.env.VITE_SPEECH_KEY, import.meta.env.VITE_SPEECH_REGION);
    speechConfig.speechRecognitionLanguage = 'fr-FR';

    const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
    recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);

    recognizer.recognizing = (_s, e) => {
      setDisplayText(`RECOGNIZING: Text=${e.result.text}`)
    };

    recognizer.recognized = (_s, e) => {
      if (e.result.reason == speechsdk.ResultReason.RecognizedSpeech) {
        setDisplayText(`RECOGNIZED: Text=${e.result.text}`)
      } else if (e.result.reason == speechsdk.ResultReason.NoMatch) {
        setDisplayText("NOMATCH: Speech could not be recognized.")
      }
    };

    recognizer.canceled = (_s, e) => {
      setDisplayText(`CANCELED: Reason=${e.reason}`)

      if (e.reason == speechsdk.CancellationReason.Error) {
        console.log(`"CANCELED: ErrorCode=${e.errorCode}`);
        console.log(`"CANCELED: ErrorDetails=${e.errorDetails}`);
        console.log("CANCELED: Did you set the speech resource key and region values?");
      }

      recognizer?.stopContinuousRecognitionAsync();
      setIsListening(false);
    };

    recognizer.sessionStopped = () => {
      console.log("\n    Session stopped event.");
      recognizer?.stopContinuousRecognitionAsync();
      setIsListening(false);
    };

    setDisplayText('speak into your microphone...');

    recognizer.startContinuousRecognitionAsync();
    setIsListening(true);
  }

  function onStopClicked() {
    setIsListening(false);
    recognizer?.stopContinuousRecognitionAsync();
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="row main-container">
        {isListening ?
          <Button onClick={onStopClicked}>
            <StopCircleIcon className="mr-2 h-4 w-4"/> Stop listening
          </Button>
          :
          <Button onClick={sttFromMic}>
            <SpeechIcon className="mr-2 h-4 w-4"/> Convert speech to text from your mic
          </Button>
        }
        <div className="mt-8 output-display rounded">
          <code>{displayText}</code>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
