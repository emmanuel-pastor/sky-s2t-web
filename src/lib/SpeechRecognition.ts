import * as speechsdk from "microsoft-cognitiveservices-speech-sdk";

class SpeechRecognition {
  private static instance: SpeechRecognition;
  private readonly speechKey: string;
  private readonly speechRegion: string;
  private onRecognizing: (text: string) => void = () => {};
  private onRecognitionDone: (text: string) => void = () => {};
  private speechRecognizer?: speechsdk.SpeechRecognizer;

  private constructor(speechKey: string, speechRegion: string) {
    this.speechKey = speechKey;
    this.speechRegion = speechRegion;
  }

  public static getInstance(speechKey: string, speechRegion: string): SpeechRecognition {
    if (!SpeechRecognition.instance) {
      SpeechRecognition.instance = new SpeechRecognition(speechKey, speechRegion);
    }
    return SpeechRecognition.instance;
  }

  startRecognition(onRecognizing: (text: string) => void, onRecognitionDone: (text: string) => void) {
    this.onRecognizing = onRecognizing;
    this.onRecognitionDone = onRecognitionDone;
    const speechConfig = speechsdk.SpeechConfig.fromSubscription(this.speechKey, this.speechRegion);
    speechConfig.speechRecognitionLanguage = "fr-FR";
    this.recognizeFromMicrophone(speechConfig);
  }

  stopRecognition() {
    this.speechRecognizer?.stopContinuousRecognitionAsync();
    console.log("Speech recognition stopped.");
  }

  private recognizeFromMicrophone(speechConfig: speechsdk.SpeechConfig) {
    const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
    this.speechRecognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);
    const phraseListGrammar = speechsdk.PhraseListGrammar.fromRecognizer(this.speechRecognizer);
    phraseListGrammar.addPhrase("Skyincap");
    phraseListGrammar.addPhrase("Skyconseil");
    phraseListGrammar.addPhrase("Guidor");
    phraseListGrammar.addPhrase("Vercel");
    phraseListGrammar.addPhrase("Bitbucket");
    phraseListGrammar.addPhrase("Jira");
    phraseListGrammar.addPhrase("Vitest");
    phraseListGrammar.addPhrase("Sharik");
    phraseListGrammar.addPhrase("Playwright");
    phraseListGrammar.addPhrase("la doc");

    this.speechRecognizer.recognizing = (_s, e) => {
      const text = e.result.text;
      console.log(`RECOGNIZING: Text=${text}`);
      this.onRecognizing(text);
    };

    this.speechRecognizer.recognized = (_s, e) => {
      const text = e.result.text;
      console.log(`RECOGNIZED: Text=${text}`);
      this.onRecognitionDone(text);
    };

    this.speechRecognizer.startContinuousRecognitionAsync();
    console.log("Speak into your microphone.");
  }
}

export default SpeechRecognition;
