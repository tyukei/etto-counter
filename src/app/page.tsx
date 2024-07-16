"use client";
import '../../polyfills';
import { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Home = () => {
  const [isClient, setIsClient] = useState(false); // クライアントサイドのチェック用
  const [targetWords, setTargetWords] = useState<string[]>([]); // カウントしたい単語のリスト
  const [inputWord, setInputWord] = useState(''); // ユーザーが入力する単語
  const [counts, setCounts] = useState<{ [key: string]: number }>({});
  const [listening, setListening] = useState(false);
  const { transcript, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    setIsClient(true); // クライアントサイドでのみtrueに設定
  }, []);

  useEffect(() => {
    if (transcript) {
      const words = transcript.split(' ');
      const newCounts = targetWords.reduce((acc, word) => {
        acc[word] = words.filter(w => w === word).length;
        return acc;
      }, {} as { [key: string]: number });

      setCounts(newCounts);
    }
  }, [transcript, targetWords]);

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true });
    setListening(true);
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setListening(false);
    resetTranscript();
  };

  const handleWordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputWord(e.target.value);
  };

  const addTargetWord = () => {
    if (inputWord && !targetWords.includes(inputWord)) {
      setTargetWords([...targetWords, inputWord]);
      setInputWord('');
    }
  };

  if (!isClient) {
    return null; // サーバーサイドレンダリング時は何も表示しない
  }

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <div>このブラウザはSpeech Recognitionをサポートしていません。</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Speech Recognition Word Counter</h1>
      <div className="mb-4">
        <input
          type="text"
          value={inputWord}
          onChange={handleWordChange}
          className="px-2 py-1 border border-gray-300 rounded"
          placeholder="ターゲットワードを追加"
        />
        <button
          onClick={addTargetWord}
          className="px-4 py-2 bg-green-500 text-white rounded ml-2"
        >
          追加
        </button>
      </div>
      <div className="mb-4">
        {targetWords.length > 0 && (
          <ul>
            {targetWords.map(word => (
              <li key={word} className="mb-2">
                {word}: <strong>{counts[word]}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>
      {!listening ? (
        <button
          onClick={startListening}
          className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
        >
          スタート
        </button>
      ) : (
        <button
          onClick={stopListening}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          ストップ
        </button>
      )}
      <p className="mt-4">{transcript}</p>
    </div>
  );
};

export default Home;