import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import Spinner from './Spinner';

interface Scene {
    prompt: string;
    imageData: string | null;
    loading: boolean;
}

const StoryboardGenerator: React.FC = () => {
    const [story, setStory] = useState('');
    const [scenes, setScenes] = useState<Scene[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateStoryboard = async () => {
        if (!story) {
            setError("Please enter a story.");
            return;
        }
        setLoading(true);
        setError(null);
        setScenes([]);
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: `Based on the following story, generate a JSON array of exactly 4 distinct image prompts for a storyboard. Each prompt should be a detailed, descriptive string ready for an image generation model. Story: "${story}"`,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.STRING,
                            description: 'A detailed image prompt for a storyboard scene.',
                        },
                    },
                },
            });
            
            const promptsArray = JSON.parse(response.text);
            if (Array.isArray(promptsArray)) {
                setScenes(promptsArray.map(prompt => ({ prompt, imageData: null, loading: false })));
            } else {
                throw new Error("AI did not return a valid array of prompts.");
            }
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
            setError(`Failed to generate storyboard. ${errorMessage}`);
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    
    const generateImageForScene = async (index: number) => {
        setScenes(currentScenes => currentScenes.map((s, i) => i === index ? { ...s, loading: true } : s));
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: scenes[index].prompt,
                config: { numberOfImages: 1, outputMimeType: 'image/jpeg', aspectRatio: '16:9' },
            });
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
            setScenes(currentScenes => currentScenes.map((s, i) => i === index ? { ...s, imageData: imageUrl, loading: false } : s));
        } catch (e) {
            console.error(e);
            setScenes(currentScenes => currentScenes.map((s, i) => i === index ? { ...s, loading: false } : s));
        }
    };

    return (
        <div className="flex flex-col space-y-4 pt-4">
            <p className="text-gray-400 -mt-2 mb-2">Describe a story, and the AI will create scene descriptions. Then, generate an image for each scene to build your visual narrative.</p>
            <textarea
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="A knight discovers a hidden, glowing sword in a dark forest..."
                className="w-full bg-gray-700/50 border border-gray-600 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                rows={3}
                disabled={loading}
            />
            <button
                onClick={generateStoryboard}
                disabled={loading || !story}
                className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
                {loading ? <><Spinner size="h-5 w-5 -ml-1 mr-3" /> Creating Scenes...</> : 'Generate Scenes'}
            </button>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            
            {scenes.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                    {scenes.map((scene, index) => (
                        <div key={index} className="space-y-2">
                            <div className="aspect-video bg-gray-900/50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-700">
                                {scene.loading && <Spinner />}
                                {!scene.loading && scene.imageData && <img src={scene.imageData} alt={scene.prompt} className="rounded-lg object-cover w-full h-full" />}
                                {!scene.loading && !scene.imageData && (
                                    <button onClick={() => generateImageForScene(index)} className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors" title="Generate Image">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                    </button>
                                )}
                            </div>
                            <p className="text-xs text-gray-400">{scene.prompt}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StoryboardGenerator;