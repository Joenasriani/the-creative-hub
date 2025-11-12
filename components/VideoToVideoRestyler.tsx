import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import Spinner from './Spinner';
import PlaceholderIcon from './PlaceholderIcon';

const VideoToVideoRestyler: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
    const [apiKeyReady, setApiKeyReady] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);


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
            setVideoFile(e.target.files[0]);
            setGeneratedVideoUrl(null);
        }
    };
    
    const getFirstFrame = (): Promise<string> => {
        return new Promise((resolve, reject) => {
            if (!videoRef.current || !canvasRef.current || !videoFile) {
                return reject("Video or canvas element not ready.");
            }
            const video = videoRef.current;
            const canvas = canvasRef.current;
            video.src = URL.createObjectURL(videoFile);
            video.onloadeddata = () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                    const dataUrl = canvas.toDataURL('image/jpeg');
                    resolve(dataUrl.split(',')[1]); 
                } else {
                    reject("Could not get canvas context.");
                }
            };
            video.onerror = (e) => reject(`Error loading video: ${e}`);
        });
    };
    
    const handleGenerate = async () => {
        if (!prompt || !videoFile) {
            setError("Please provide a video and a style prompt.");
            return;
        }
        setLoading(true);
        setError(null);
        setGeneratedVideoUrl(null);

        try {
            setLoadingMessage('Extracting first frame...');
            const firstFrameBase64 = await getFirstFrame();
            
            setLoadingMessage('Initializing video generation...');
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            let operation = await ai.models.generateVideos({
                model: 'veo-3.1-fast-generate-preview',
                prompt: `Restyle this scene in the following artistic style: ${prompt}`,
                image: {
                    imageBytes: firstFrameBase64,
                    mimeType: 'image/jpeg',
                },
                config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
            });

            setLoadingMessage('Restyling video... This can take a few minutes.');
            while (!operation.done) {
                await new Promise(resolve => setTimeout(resolve, 10000));
                operation = await ai.operations.getVideosOperation({ operation: operation });
            }

            setLoadingMessage('Fetching generated video...');
            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (downloadLink) {
                const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
                const videoBlob = await response.blob();
                setGeneratedVideoUrl(URL.createObjectURL(videoBlob));
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
                    className="w-full bg-rose-600 text-white font-bold py-2 px-4 rounded-md hover:bg-rose-700 transition-colors"
                >
                    Select API Key
                </button>
                <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 mt-2 hover:underline">Learn about billing</a>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col space-y-4 pt-4">
            <video ref={videoRef} className="hidden" />
            <canvas ref={canvasRef} className="hidden" />
            <p className="text-gray-400 -mt-2 mb-2">Upload a video and describe a new style. The AI will use the first frame as a guide to restyle the scene.</p>
            <div className="aspect-video bg-gray-900/50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-700 p-2">
                {loading && <div className="text-center"><Spinner /><p className="text-sm mt-2 text-gray-300">{loadingMessage}</p></div>}
                {!loading && generatedVideoUrl && <video src={generatedVideoUrl} controls className="rounded-lg object-contain w-full h-full" />}
                {!loading && !generatedVideoUrl && <PlaceholderIcon type="video" />}
            </div>
             <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-600/20 file:text-rose-300 hover:file:bg-rose-600/40"
                disabled={loading}
            />
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'A watercolor painting style, with soft edges and vibrant colors.'"
                className="w-full bg-gray-700/50 border border-gray-600 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                rows={2}
                disabled={loading}
            />
            <button
                onClick={handleGenerate}
                disabled={loading || !prompt || !videoFile}
                className="w-full bg-rose-600 text-white font-bold py-3 px-4 rounded-md hover:bg-rose-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
                {loading ? <><Spinner size="h-5 w-5 -ml-1 mr-3" /> Restyling...</> : 'Restyle Video'}
            </button>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </div>
    );
};

export default VideoToVideoRestyler;
