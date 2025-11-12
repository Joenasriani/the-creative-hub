import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import Spinner from './Spinner';
import PlaceholderIcon from './PlaceholderIcon';

const TextToImageGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imageData, setImageData] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt) {
            setError("Please enter a prompt.");
            return;
        }
        setLoading(true);
        setError(null);
        setImageData(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: prompt,
                config: {
                  numberOfImages: 1,
                  outputMimeType: 'image/jpeg',
                  aspectRatio: '1:1',
                },
            });
    
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
            setImageData(imageUrl);
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
            setError(`Failed to generate image. ${errorMessage}`);
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col space-y-4 pt-4">
            <div className="aspect-square bg-gray-900/50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-700">
                {loading && <Spinner />}
                {!loading && imageData && <img src={imageData} alt={prompt} className="rounded-lg object-cover w-full h-full" />}
                {!loading && !imageData && <PlaceholderIcon type="image" />}
            </div>
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A majestic lion wearing a crown..."
                className="w-full bg-gray-700/50 border border-gray-600 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-300"
                rows={3}
                disabled={loading}
            />
            <button
                onClick={handleGenerate}
                disabled={loading || !prompt}
                className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
                aria-label="Generate Image"
            >
                {loading ? (
                    <>
                        <Spinner size="h-5 w-5 -ml-1 mr-3" />
                        Generating...
                    </>
                ) : 'Generate Image'}
            </button>
            {error && <p className="text-red-400 text-sm text-center" role="alert">{error}</p>}
            <div className="mt-4 pt-4 border-t border-gray-700">
                <span className="text-xs uppercase font-semibold text-cyan-400">Model Used</span>
                <p className="text-sm text-gray-300 font-medium">Imagen 4</p>
            </div>
        </div>
    );
};

export default TextToImageGenerator;