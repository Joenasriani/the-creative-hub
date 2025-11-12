import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import Spinner from './Spinner';

const PromptRefiner: React.FC = () => {
    const [inputPrompt, setInputPrompt] = useState('');
    const [refinedPrompt, setRefinedPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRefine = async () => {
        if (!inputPrompt) {
            setError("Please enter a prompt to refine.");
            return;
        }
        setLoading(true);
        setError(null);
        setRefinedPrompt('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: inputPrompt,
                config: {
                    systemInstruction: `You are an expert prompt engineer for generative AI models. 
                    Rewrite and enhance the user's prompt to be more vivid, descriptive, and detailed. 
                    Focus on visual details, lighting, composition, and artistic style. 
                    Return only the refined prompt, without any conversational text or preamble.`,
                },
            });
            setRefinedPrompt(response.text.trim());
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
            setError(`Failed to refine prompt. ${errorMessage}`);
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    
    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(refinedPrompt);
    };

    return (
         <div className="flex flex-col space-y-4 pt-4">
            <textarea
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Initial idea, e.g., 'a cat in space'"
                className="w-full bg-gray-700/50 border border-gray-600 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                rows={3}
                disabled={loading}
            />
            <button
                onClick={handleRefine}
                disabled={loading || !inputPrompt}
                className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
                {loading ? <><Spinner size="h-5 w-5 -ml-1 mr-3" /> Refining...</> : 'Refine Prompt'}
            </button>
             <div className="relative flex-grow">
                <textarea
                    value={refinedPrompt}
                    readOnly
                    placeholder="Refined prompt will appear here..."
                    className="w-full h-full min-h-[100px] bg-gray-900/50 border border-gray-700 rounded-md p-2 text-gray-300"
                    rows={5}
                />
                {refinedPrompt && !loading && (
                    <button onClick={handleCopyToClipboard} className="absolute top-2 right-2 p-1 bg-gray-700 rounded-md hover:bg-gray-600" title="Copy to clipboard">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    </button>
                )}
             </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <div className="mt-4 pt-4 border-t border-gray-700">
                <span className="text-xs uppercase font-semibold text-green-400">Model Used</span>
                <p className="text-sm text-gray-300 font-medium">Gemini 2.5 Pro</p>
            </div>
        </div>
    );
};

export default PromptRefiner;