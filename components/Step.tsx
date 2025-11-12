
import React from 'react';

interface StepProps {
    stepNumber: number;
    title: string;
    description: string;
}

const Step: React.FC<StepProps> = ({ stepNumber, title, description }) => {
    return (
        <div className="relative md:pl-24">
            <div className="flex items-center">
                <div className="z-10 bg-purple-600 h-16 w-16 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-purple-500/30">
                    {stepNumber}
                </div>
                <div className="ml-6">
                    <h3 className="text-2xl font-bold text-white">{title}</h3>
                </div>
            </div>
            <div className="mt-4 pl-6 md:pl-22">
                <p className="text-gray-400">{description}</p>
            </div>
        </div>
    );
};

export default Step;
