import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { fileToBase64 } from '../utils/helpers';
import Spinner from './Spinner';
import PlaceholderIcon from './PlaceholderIcon';

const SceneInterpolator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [startImageFile, setStartImageFile] = useState<File | null>(null);
    const [endImageFile, setEndImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [apiKeyReady, setApiKeyReady] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');

    useEffect(() => {
        const checkApiKey = async () => {
            if (window.aistudio) {
                const hasKey = await window.aistudio.hasSelectedApiKey();
                setApiKeyReady(hasKey);
            }
        };
        checkApiKey();
    }, []);
    
    const handleGenerate = async () => {
        if (!startImageFile || !endImageFile) {
            setError("Please provide both a start and an end image.");
            return;
        }
        setLoading(true);
        setError(null);
        setVideoUrl(null);

        try {
            setLoadingMessage('Converting images...');
            const base64StartImage = await fileToBase64(startImageFile);
            const base64EndImage = await fileToBase64(endImageFile);

            setLoadingMessage('Initializing video generation...');
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            let operation = await ai.models.generateVideos({
                model: 'veo-3.1-fast-generate-preview',
                prompt: prompt || "Animate a smooth transition between the start and end images.",
                image: { imageBytes: base64StartImage, mimeType: startImageFile.type },
                config: {
                    numberOfVideos: 1,
                    resolution: '720p',
                    aspectRatio: '16:9',
                    lastFrame: { imageBytes: base64EndImage, mimeType: endImageFile.type },
                }
            });

            setLoadingMessage('Interpolating scene... This can take a few minutes.');
            while (!operation.done) {
                await new Promise(resolve => setTimeout(resolve, 10000));
                operation = await ai.operations.getVideosOperation({ operation: operation });
            }

            setLoadingMessage('Fetching generated video...');
            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (downloadLink) {
                const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
                const videoBlob = await response.blob();
                setVideoUrl(URL.createObjectURL(videoBlob));
            } else {
                throw new Error('Video generation did not return a valid link.');
            }
        } catch (e: any) {
             const errorMessage = e.message || "An unknown error occurred.";
            if (errorMessage.includes("Requested entity was not found.")) {
                 setError('API Key error. Please select your key again.');
                 setApiKeyReady(false);
            } else {
                 setError(`Failed to generate video. ${errorMessage}`);
            }
            console.error(e);
        } finally {
            setLoading(false);
            setLoadingMessage('');
        }
    };
    
    if (!apiKeyReady) {
        return (
            <div className="flex flex-col justify-center items-center text-center pt-4">
                <p className="text-gray-400 my-4">This tool uses the Veo model and requires an API key. Please select a key to continue.</p>
                <button
                    onClick={async () => {
                        await window.aistudio.openSelectKey();
                        setApiKeyReady(true);
                    }}
                    className="w-full bg-lime-600 text-white font-bold py-2 px-4 rounded-md hover:bg-lime-700 transition-colors"
                >
                    Select API Key
                </button>
                 <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 mt-2 hover:underline">Learn about billing</a>
            </div>
        );
    }
    
    return (
         <div className="flex flex-col space-y-4 pt-4">
            <p className="text-gray-400 -mt-2 mb-2">Upload a starting image and an ending image to generate a smooth video transition between them.</p>
            <div className="aspect-video bg-gray-900/50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-700 p-2">
                {loading && <div className="text-center"><Spinner /><p className="text-sm mt-2 text-gray-300">{loadingMessage}</p></div>}
                {!loading && videoUrl && <video src={videoUrl} controls className="rounded-lg object-contain w-full h-full" />}
                {!loading && !videoUrl && <PlaceholderIcon type="video" />}
            </div>
             <div className="grid grid-cols-2 gap-4">
                 <div>
                     <label className="text-sm font-medium text-gray-300">Start Image</label>
                     <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files && setStartImageFile(e.target.files[0])}
                        className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-lime-600/20 file:text-lime-300 hover:file:bg-lime-600/40"
                        disabled={loading}
                    />
                 </div>
                 <div>
                    <label className="text-sm font-medium text-gray-300">End Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files && setEndImageFile(e.target.files[0])}
                        className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-lime-600/20 file:text-lime-300 hover:file:bg-lime-600/40"
                        disabled={loading}
                    />
                 </div>
            </div>
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Optional: Describe the transition (e.g., 'The sun sets and the city lights turn on.')"
                className="w-full bg-gray-700/50 border border-gray-600 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors"
                rows={2}
                disabled={loading}
            />
            <button
                onClick={handleGenerate}
                disabled={loading || !startImageFile || !endImageFile}
                className="w-full bg-lime-600 text-white font-bold py-3 px-4 rounded-md hover:bg-lime-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
                {loading ? <><Spinner size="h-5 w-5 -ml-1 mr-3" /> Generating...</> : 'Generate Interpolated Video'}
            </button>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </div>
    );
};

export default SceneInterpolator;
