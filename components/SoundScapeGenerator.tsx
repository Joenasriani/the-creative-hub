import React, { useState, useRef } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { decode, decodeAudioData } from '../utils/helpers';
import Spinner from './Spinner';

const SoundScapeGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('Say cheerfully: Have a wonderful day!');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const audioContextRef = useRef<AudioContext | null>(null);
    const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

    const handleGenerate = async () => {
        if (!prompt) {
            setError("Please enter text to generate audio.");
            return;
        }
        setLoading(true);
        setError(null);
        setIsPlaying(false);
        
        if (audioSourceRef.current) {
            audioSourceRef.current.stop();
        }

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash-preview-tts",
                contents: [{ parts: [{ text: prompt }] }],
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: { voiceName: 'Kore' },
                        },
                    },
                },
            });

            const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
                if (!audioContextRef.current) {
                   // FIX: Cast window to `any` to support `webkitAudioContext` for older browsers without TypeScript errors.
                   audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                }
                const audioBuffer = await decodeAudioData(
                    decode(base64Audio),
                    audioContextRef.current,
                    24000,
                    1,
                );
                
                const source = audioContextRef.current.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioContextRef.current.destination);
                source.onended = () => setIsPlaying(false);
                
                source.start();
                audioSourceRef.current = source;
                setIsPlaying(true);

            } else {
                throw new Error("No audio data returned from API.");
            }
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
            setError(`Failed to generate audio. ${errorMessage}`);
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="flex flex-col space-y-4 pt-4">
            <p className="text-gray-400 -mt-2 mb-2">Generate realistic speech from text. Type what you want to hear, and the AI will generate the audio.</p>
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter text for the AI to speak..."
                className="w-full bg-gray-700/50 border border-gray-600 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                rows={4}
                disabled={loading}
            />
            <button
                onClick={handleGenerate}
                disabled={loading || !prompt}
                className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
                {loading ? <><Spinner size="h-5 w-5 -ml-1 mr-3" /> Generating...</> 
                : isPlaying ? '🔊 Playing...' : 'Generate & Play Audio' }
            </button>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </div>
    );
};

export default SoundScapeGenerator;