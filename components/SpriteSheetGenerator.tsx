import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import Spinner from './Spinner';

interface Frame {
    prompt: string;
    imageData: string | null;
    loading: boolean;
}

const SpriteSheetGenerator: React.FC = () => {
    const [description, setDescription] = useState('');
    const [frames, setFrames] = useState<Frame[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateFrames = async () => {
        if (!description) {
            setError("Please describe the character and action.");
            return;
        }
        setLoading(true);
        setError(null);
        setFrames([]);
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: `Generate a JSON array of exactly 6 distinct image prompts for an animation sprite sheet. The prompts should describe sequential frames of the action. Each prompt must be detailed and include the same character description to maintain consistency. Action: "${description}"`,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.STRING,
                            description: 'A detailed image prompt for a single animation frame.',
                        },
                    },
                },
            });
            
            const promptsArray = JSON.parse(response.text);
            if (Array.isArray(promptsArray)) {
                setFrames(promptsArray.map(prompt => ({ prompt, imageData: null, loading: false })));
            } else {
                throw new Error("AI did not return a valid array of prompts.");
            }
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
            setError(`Failed to generate frames. ${errorMessage}`);
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    
    const generateImageForFrame = async (index: number) => {
        setFrames(currentFrames => currentFrames.map((f, i) => i === index ? { ...f, loading: true } : f));
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: frames[index].prompt,
                config: { numberOfImages: 1, outputMimeType: 'image/jpeg', aspectRatio: '1:1' },
            });
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
            setFrames(currentFrames => currentFrames.map((f, i) => i === index ? { ...f, imageData: imageUrl, loading: false } : f));
        } catch (e) {
            console.error(e);
            setFrames(currentFrames => currentFrames.map((f, i) => i === index ? { ...f, loading: false } : f));
        }
    };

    return (
        <div className="flex flex-col space-y-4 pt-4">
            <p className="text-gray-400 -mt-2 mb-2">Describe a character and an action (e.g., running, jumping). The AI will create frame descriptions for an animation sequence.</p>
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A cartoon fox running from left to right"
                className="w-full bg-gray-700/50 border border-gray-600 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-colors"
                rows={2}
                disabled={loading}
            />
            <button
                onClick={generateFrames}
                disabled={loading || !description}
                className="w-full bg-fuchsia-600 text-white font-bold py-3 px-4 rounded-md hover:bg-fuchsia-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
                {loading ? <><Spinner size="h-5 w-5 -ml-1 mr-3" /> Creating Frames...</> : 'Generate Frame Descriptions'}
            </button>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            
            {frames.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                    {frames.map((frame, index) => (
                        <div key={index} className="space-y-2">
                            <div className="aspect-square bg-gray-900/50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-700">
                                {frame.loading && <Spinner />}
                                {!frame.loading && frame.imageData && <img src={frame.imageData} alt={frame.prompt} className="rounded-lg object-cover w-full h-full" />}
                                {!frame.loading && !frame.imageData && (
                                    <button onClick={() => generateImageForFrame(index)} className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors" title="Generate Image">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-fuchsia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                    </button>
                                )}
                            </div>
                            <p className="text-xs text-gray-400">{`Frame ${index + 1}`}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SpriteSheetGenerator;
