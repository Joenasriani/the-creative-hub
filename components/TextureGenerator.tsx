import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import Spinner from './Spinner';
import PlaceholderIcon from './PlaceholderIcon';

const TextureGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imageData, setImageData] = useState<string | null>(null);
    const [testTiling, setTestTiling] = useState(false);

    const handleGenerate = async () => {
        if (!prompt) {
            setError("Please describe the texture.");
            return;
        }
        setLoading(true);
        setError(null);
        setImageData(null);
        setTestTiling(false);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const fullPrompt = `A seamless, tileable texture of ${prompt}. Photorealistic, high quality.`;
            
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: fullPrompt,
                config: {
                  numberOfImages: 1,
                  outputMimeType: 'image/png',
                  aspectRatio: '1:1',
                },
            });
    
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
            setImageData(imageUrl);
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
            setError(`Failed to generate texture. ${errorMessage}`);
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col space-y-4 pt-4">
            <p className="text-gray-400 -mt-2 mb-2">Describe a material to generate a seamless, tileable texture for 3D models, games, and design.</p>
            <div 
                className="aspect-square bg-gray-900/50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-700 overflow-hidden"
                style={{
                    backgroundImage: testTiling && imageData ? `url(${imageData})` : 'none',
                    backgroundSize: testTiling ? '50% 50%' : 'cover',
                    imageRendering: 'pixelated', // For crisp tiling tests
                }}
            >
                {loading && <Spinner />}
                {!loading && imageData && !testTiling && <img src={imageData} alt={prompt} className="rounded-lg object-cover w-full h-full" />}
                {!loading && !imageData && <PlaceholderIcon type="image" />}
            </div>
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'Rough stone bricks for a castle wall'"
                className="w-full bg-gray-700/50 border border-gray-600 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-300"
                rows={2}
                disabled={loading}
            />
            <div className="flex space-x-4">
                <button
                    onClick={handleGenerate}
                    disabled={loading || !prompt}
                    className="w-full bg-yellow-600 text-white font-bold py-3 px-4 rounded-md hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                >
                    {loading ? <><Spinner size="h-5 w-5 -ml-1 mr-3" /> Generating...</> : 'Generate Texture'}
                </button>
                <button
                    onClick={() => setTestTiling(!testTiling)}
                    disabled={!imageData || loading}
                    className="w-full bg-gray-600 text-white font-bold py-3 px-4 rounded-md hover:bg-gray-700 disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors"
                >
                    {testTiling ? 'Show Single' : 'Test Tiling'}
                </button>
            </div>
            {error && <p className="text-red-400 text-sm text-center" role="alert">{error}</p>}
        </div>
    );
};

export default TextureGenerator;
