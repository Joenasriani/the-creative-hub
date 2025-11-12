import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import Spinner from './Spinner';
import PlaceholderIcon from './PlaceholderIcon';

const UIComponentGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imageData, setImageData] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt) {
            setError("Please describe the UI component.");
            return;
        }
        setLoading(true);
        setError(null);
        setImageData(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const fullPrompt = `UI component design for a modern application, isolated on a neutral background. The component is: ${prompt}.`;
            
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: fullPrompt,
                config: {
                  numberOfImages: 1,
                  outputMimeType: 'image/jpeg',
                  aspectRatio: '16:9',
                },
            });
    
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
            setImageData(imageUrl);
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
            setError(`Failed to generate component. ${errorMessage}`);
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col space-y-4 pt-4">
            <p className="text-gray-400 -mt-2 mb-2">Describe a user interface element, like a button or a health bar, and the AI will generate a visual concept.</p>
            <div className="aspect-video bg-gray-900/50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-700">
                {loading && <Spinner />}
                {!loading && imageData && <img src={imageData} alt={prompt} className="rounded-lg object-cover w-full h-full" />}
                {!loading && !imageData && <PlaceholderIcon type="image" />}
            </div>
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'A glossy, futuristic health bar for a sci-fi game, glowing green.'"
                className="w-full bg-gray-700/50 border border-gray-600 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-300"
                rows={3}
                disabled={loading}
            />
            <button
                onClick={handleGenerate}
                disabled={loading || !prompt}
                className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-md hover:bg-sky-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
            >
                {loading ? <><Spinner size="h-5 w-5 -ml-1 mr-3" /> Generating...</> : 'Generate UI Component'}
            </button>
            {error && <p className="text-red-400 text-sm text-center" role="alert">{error}</p>}
        </div>
    );
};

export default UIComponentGenerator;
