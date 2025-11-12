import React, { useState } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { fileToBase64 } from '../utils/helpers';
import Spinner from './Spinner';
import PlaceholderIcon from './PlaceholderIcon';

const ImageRestyler: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [editedImage, setEditedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setOriginalImage(reader.result as string);
                setEditedImage(null);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleEdit = async () => {
        if (!prompt || !imageFile) {
            setError("Please provide an image and a style prompt.");
            return;
        }
        setLoading(true);
        setError(null);
        setEditedImage(null);

        try {
            const base64Image = await fileToBase64(imageFile);
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            const imagePart = { inlineData: { data: base64Image, mimeType: imageFile.type } };
            const textPart = { text: `Restyle this image in the following mood and artistic style: ${prompt}` };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [imagePart, textPart] },
                config: { responseModalities: [Modality.IMAGE] },
            });
            
            let foundImage = false;
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const base64Bytes = part.inlineData.data;
                    const imageUrl = `data:${part.inlineData.mimeType};base64,${base64Bytes}`;
                    setEditedImage(imageUrl);
                    foundImage = true;
                    break;
                }
            }
            if (!foundImage) {
                throw new Error("The model did not return a restyled image.");
            }

        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
            setError(`Failed to restyle image. ${errorMessage}`);
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col space-y-4 pt-4">
            <p className="text-gray-400 -mt-2 mb-2">Upload an image and describe a new artistic style or mood. The AI will reimagine your image completely.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="aspect-square bg-gray-900/50 rounded-lg flex flex-col p-2 items-center justify-center border-2 border-dashed border-gray-700">
                    <span className="text-sm font-semibold text-gray-400 mb-2">Original</span>
                    {originalImage ? <img src={originalImage} className="rounded-lg object-contain max-h-full" /> : <PlaceholderIcon type="image" />}
                </div>
                <div className="aspect-square bg-gray-900/50 rounded-lg flex flex-col p-2 items-center justify-center border-2 border-dashed border-gray-700">
                     <span className="text-sm font-semibold text-gray-400 mb-2">Restyled</span>
                    {loading && <Spinner />}
                    {!loading && editedImage && <img src={editedImage} className="rounded-lg object-contain max-h-full" />}
                    {!loading && !editedImage && <PlaceholderIcon type="image" />}
                </div>
            </div>
             <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-600/20 file:text-orange-300 hover:file:bg-orange-600/40"
                disabled={loading}
            />
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'Vintage comic book art, dramatic shadows'"
                className="w-full bg-gray-700/50 border border-gray-600 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                rows={2}
                disabled={loading}
            />
            <button
                onClick={handleEdit}
                disabled={loading || !prompt || !imageFile}
                className="w-full bg-orange-600 text-white font-bold py-3 px-4 rounded-md hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
                {loading ? <><Spinner size="h-5 w-5 -ml-1 mr-3" /> Restyling...</> : 'Apply Style'}
            </button>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </div>
    );
};

export default ImageRestyler;
