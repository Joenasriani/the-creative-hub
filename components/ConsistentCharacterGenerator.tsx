import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import Spinner from './Spinner';
import PlaceholderIcon from './PlaceholderIcon';

const ConsistentCharacterGenerator: React.FC = () => {
    const [description, setDescription] = useState('');
    const [detailedDescription, setDetailedDescription] = useState('');
    const [imageData, setImageData] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!description) {
            setError("Please describe your character.");
            return;
        }
        setLoading(true);
        setError(null);
        setDetailedDescription('');
        setImageData(null);

        try {
            // Step 1: Generate a detailed description with Gemini Pro
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const descriptionResponse = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: `Create a highly detailed visual description for a fictional character based on this summary: "${description}". Include specifics about their face, hair, clothing, gear, and overall demeanor. This description will be used in a prompt for an AI image generator.`,
            });
            const newDetailedDescription = descriptionResponse.text.trim();
            setDetailedDescription(newDetailedDescription);

            // Step 2: Generate an image with the new description using Imagen
            const imageResponse = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: `Portrait of a character. ${newDetailedDescription}`,
                config: { numberOfImages: 1, outputMimeType: 'image/jpeg', aspectRatio: '3:4' },
            });
            const base64ImageBytes: string = imageResponse.generatedImages[0].image.imageBytes;
            const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
            setImageData(imageUrl);
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
            setError(`Failed to generate character. ${errorMessage}`);
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="flex flex-col space-y-4 pt-4">
            <p className="text-gray-400 -mt-2 mb-2">Describe a character to generate a detailed visual profile and a sample image. Use the detailed description in other prompts to maintain consistency.</p>
             <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., A young female space explorer with a robot sidekick"
                className="w-full bg-gray-700/50 border border-gray-600 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                rows={2}
                disabled={loading}
            />
            <button
                onClick={handleGenerate}
                disabled={loading || !description}
                className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
                {loading ? <><Spinner size="h-5 w-5 -ml-1 mr-3" /> Generating...</> : 'Generate Character Profile'}
            </button>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="aspect-[3/4] bg-gray-900/50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-700">
                    {loading && <Spinner />}
                    {!loading && imageData && <img src={imageData} alt="Generated character" className="rounded-lg object-cover w-full h-full" />}
                    {!loading && !imageData && <PlaceholderIcon type="image" />}
                </div>
                <textarea
                    value={detailedDescription}
                    readOnly
                    placeholder="Detailed visual description will appear here..."
                    className="w-full h-full min-h-[150px] bg-gray-900/50 border border-gray-700 rounded-md p-2 text-gray-300 text-sm"
                />
            </div>
        </div>
    );
};

export default ConsistentCharacterGenerator;