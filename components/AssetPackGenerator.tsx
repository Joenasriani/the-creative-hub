import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import Spinner from './Spinner';

interface Asset {
    name: string;
    prompt: string;
    imageData: string | null;
    loading: boolean;
}

const AssetPackGenerator: React.FC = () => {
    const [style, setStyle] = useState('');
    const [items, setItems] = useState('');
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generatePrompts = async () => {
        if (!style || !items) {
            setError("Please define a style and list the assets.");
            return;
        }
        setLoading(true);
        setError(null);
        setAssets([]);
        
        try {
            const itemList = items.split(',').map(i => i.trim()).filter(Boolean);
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: `I need to create a pack of assets with a consistent style. The overall style is: "${style}". The assets I need are: ${itemList.join(', ')}. Generate a JSON object where keys are the asset names and values are detailed, unique image prompts for each asset, ensuring they all strictly follow the defined style.`,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: itemList.reduce((acc, item) => ({...acc, [item]: {type: Type.STRING}}), {})
                    },
                },
            });
            
            const promptsObject = JSON.parse(response.text);
            const newAssets: Asset[] = Object.entries(promptsObject).map(([name, prompt]) => ({
                name,
                prompt: prompt as string,
                imageData: null,
                loading: false
            }));
            setAssets(newAssets);

        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
            setError(`Failed to generate prompts. ${errorMessage}`);
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    
    const generateImageForAsset = async (index: number) => {
        setAssets(currentAssets => currentAssets.map((a, i) => i === index ? { ...a, loading: true } : a));
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: assets[index].prompt,
                config: { numberOfImages: 1, outputMimeType: 'image/png', aspectRatio: '1:1' },
            });
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
            setAssets(currentAssets => currentAssets.map((a, i) => i === index ? { ...a, imageData: imageUrl, loading: false } : a));
        } catch (e) {
            console.error(e);
            setAssets(currentAssets => currentAssets.map((a, i) => i === index ? { ...a, loading: false } : a));
        }
    };

    return (
        <div className="flex flex-col space-y-4 pt-4">
            <p className="text-gray-400 -mt-2 mb-2">Define a visual style, list the assets you need (e.g., icons, items), and generate a coherent set of images.</p>
            <textarea
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                placeholder="Style, e.g., 'Cute, minimalist, flat icons with a pastel color palette'"
                className="w-full bg-gray-700/50 border border-gray-600 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                rows={2}
                disabled={loading}
            />
            <textarea
                value={items}
                onChange={(e) => setItems(e.target.value)}
                placeholder="Comma-separated assets, e.g., 'sun, cloud, moon, star'"
                className="w-full bg-gray-700/50 border border-gray-600 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                rows={2}
                disabled={loading}
            />
            <button
                onClick={generatePrompts}
                disabled={loading || !style || !items}
                className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-md hover:bg-teal-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
                {loading ? <><Spinner size="h-5 w-5 -ml-1 mr-3" /> Preparing...</> : 'Generate Asset Pack'}
            </button>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            
            {assets.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {assets.map((asset, index) => (
                        <div key={index} className="space-y-2">
                             <div className="aspect-square bg-gray-900/50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-700">
                                {asset.loading && <Spinner />}
                                {!asset.loading && asset.imageData && <img src={asset.imageData} alt={asset.name} className="rounded-lg object-contain w-full h-full p-2" />}
                                {!asset.loading && !asset.imageData && (
                                    <button onClick={() => generateImageForAsset(index)} className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors" title={`Generate ${asset.name}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                    </button>
                                )}
                            </div>
                            <p className="text-sm text-center text-gray-300 font-medium">{asset.name}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AssetPackGenerator;
