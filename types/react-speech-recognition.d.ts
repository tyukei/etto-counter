declare module 'react-speech-recognition' {
    interface SpeechRecognition {
      startListening: (options?: { continuous?: boolean; language?: string }) => void;
      stopListening: () => void;
      abortListening: () => void;
      browserSupportsSpeechRecognition: () => boolean;
      browserSupportsContinuousListening: () => boolean;
    }
  
    const useSpeechRecognition: () => {
      transcript: string;
      interimTranscript: string;
      finalTranscript: string;
      resetTranscript: () => void;
      listening: boolean;
    };
  
    const SpeechRecognition: SpeechRecognition;
    export { useSpeechRecognition };
    export default SpeechRecognition;
  }