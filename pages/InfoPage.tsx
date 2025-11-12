import React from 'react';
import Section from '../components/Section';
import Card from '../components/Card';
import Step from '../components/Step';

const InfoPage: React.FC = () => {

  const monetizationPackages = [
    { name: 'Freemium', price: '0', credits: '50 free credits', description: 'Upon signup, one-time.', popular: false },
    { name: 'Starter', price: '19', credits: '100 credits', description: 'Perfect for trying things out.', popular: false },
    { name: 'Creator', price: '89', credits: '500 credits', description: 'Best value for frequent users.', popular: true },
    { name: 'Pro', price: '169', credits: '1000 credits', description: 'For power users and professionals.', popular: false },
  ];

  return (
    <>
      <Section title="Core Feature Workflow: Text-to-Video">
          <div className="relative">
              <div className="hidden md:block absolute top-0 left-12 w-0.5 h-full bg-gray-700" aria-hidden="true"></div>
              <div className="space-y-12">
                  <Step 
                      stepNumber={1} 
                      title="Input Text Prompt" 
                      description="User enters a descriptive text prompt detailing the desired video scene, characters, actions, and style."
                  />
                  <Step 
                      stepNumber={2} 
                      title="AI Prompt Refinement" 
                      description="Gemini 2.5 Pro analyzes the input, clarifies ambiguities, and enhances the prompt for optimal results from the video model."
                  />
                  <Step 
                      stepNumber={3} 
                      title="Generate Video" 
                      description="The refined prompt is sent to Veo 3, which generates a high-quality, coherent video based on the detailed instructions."
                  />
                  <Step 
                      stepNumber={4} 
                      title="Review, Edit & Download" 
                      description="The user reviews the generated video, makes minor edits if needed using 'Live Prompting', and downloads the final masterpiece."
                  />
              </div>
          </div>
      </Section>

      <Section title="Monetization Structure">
         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {monetizationPackages.map((pkg, index) => (
              <Card key={index} className={`flex flex-col ${pkg.popular ? 'border-2 border-purple-500 transform lg:scale-105 shadow-2xl shadow-purple-500/20' : ''}`}>
                 {pkg.popular && <div className="absolute top-0 right-0 -mt-3 -mr-3 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>}
                <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                <p className="text-gray-400 mb-4">{pkg.description}</p>
                <div className="my-4">
                  <span className="text-5xl font-extrabold text-white">{pkg.price}</span>
                  <span className="text-xl text-gray-400 ml-1">AED</span>
                </div>
                <div className="bg-gray-800 rounded-lg p-3 text-center flex-grow flex items-center justify-center">
                  <span className="font-semibold text-lg text-cyan-400">{pkg.credits}</span>
                </div>
              </Card>
            ))}
          </div>
      </Section>
    </>
  );
};

export default InfoPage;
