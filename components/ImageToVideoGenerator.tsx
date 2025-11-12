import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { fileToBase64 } from '../utils/helpers';
import Card from './Card';
import Spinner from './Spinner';
import PlaceholderIcon from './PlaceholderIcon';

const ImageToVideoGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
            setVideoUrl(null);
        }
    };
    
    const handleGenerate = async () => {
        if (!prompt || !imageFile) {
            setError("Please provide a prompt and an image.");
            return;
        }
        setLoading(true);
        setError(null);
        setVideoUrl(null);

        try {
            setLoadingMessage('Converting image...');
            const base64Image = await fileToBase64(imageFile);

            setLoadingMessage('Initializing video generation...');
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            let operation = await ai.models.generateVideos({
                model: 'veo-3.1-fast-generate-preview',
                prompt: prompt,
                image: {
                    imageBytes: base64Image,
                    mimeType: imageFile.type,
                },
                config: {
                    numberOfVideos: 1,
                    resolution: '720p',
                    aspectRatio: '16:9'
                }
            });

            setLoadingMessage('Processing video... This may take a few minutes.');
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
            <div className="pt-4 flex flex-col justify-center items-center text-center">
                <p className="text-gray-400 my-4">This tool uses the Veo model and requires an API key. Please select a key to continue.</p>
                <button
                    onClick={async () => {
                        await window.aistudio.openSelectKey();
                        setApiKeyReady(true);
                    }}
                    className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                >
                    Select API Key
                </button>
                <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 mt-2 hover:underline">Learn about billing</a>
            </div>
        );
    }

    return (
        <div className="flex flex-col space-y-4 pt-4">
            <div className="aspect-video bg-gray-900/50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-700 p-2">
                {loading && <div className="text-center"><Spinner /><p className="text-sm mt-2 text-gray-300">{loadingMessage}</p></div>}
                {!loading && videoUrl && <video src={videoUrl} controls className="rounded-lg object-contain w-full h-full" />}
                {!loading && !videoUrl && <PlaceholderIcon type="video" />}
            </div>
             <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600/20 file:text-purple-300 hover:file:bg-purple-600/40"
                disabled={loading}
            />
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="An astronaut riding a horse on Mars..."
                className="w-full bg-gray-700/50 border border-gray-600 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                rows={2}
                disabled={loading}
            />
            <button
                onClick={handleGenerate}
                disabled={loading || !prompt || !imageFile}
                className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
                {loading ? <><Spinner size="h-5 w-5 -ml-1 mr-3" /> Generating...</> : 'Generate Video'}
            </button>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <div className="mt-4 pt-4 border-t border-gray-700">
                <span className="text-xs uppercase font-semibold text-purple-400">Model Used</span>
                <p className="text-sm text-gray-300 font-medium">Veo 3</p>
            </div>
        </div>
    );
};

export default ImageToVideoGenerator;