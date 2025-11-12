
import React from 'react';
import Section from './components/Section';
import Card from './components/Card';
import Step from './components/Step';

const App: React.FC = () => {

  const architectureItems = [
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 010-2.828L16 8" /></svg>,
      title: 'Text-to-Image Generation',
      content: 'High-fidelity image creation powered by Imagen for photorealism or Nano Banana for speed and efficiency.',
      model: 'Imagen / Nano Banana'
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
      title: 'Image-to-Video & Refinement',
      content: 'Cinematic video generation and enhancement using the state-of-the-art Veo 3 model or a fine-tuned Gemini for specialized tasks.',
      model: 'Veo 3 / Fine-tuned Gemini'
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
      title: 'AI Text-Editing & Prompt Refinement',
      content: 'Leverages Gemini 2.5 Pro for advanced understanding of user instructions, prompt optimization, and complex logic.',
      model: 'Gemini 2.5 Pro'
    }
  ];

  const monetizationPackages = [
    { name: 'Freemium', price: '0', credits: '50 free credits', description: 'Upon signup, one-time.', popular: false },
    { name: 'Starter', price: '19', credits: '100 credits', description: 'Perfect for trying things out.', popular: false },
    { name: 'Creator', price: '89', credits: '500 credits', description: 'Best value for frequent users.', popular: true },
    { name: 'Pro', price: '169', credits: '1000 credits', description: 'For power users and professionals.', popular: false },
  ];

  const nextGenTools = [
    { title: "AI Video-to-Video Style Transfer", description: "Apply the artistic style from any source video to your own footage, creating unique visual transformations." },
    { title: "Interactive 'Storyboard' Mode", description: "Generate keyframes from a script. Edit, rearrange, or regenerate individual frames before committing to full video generation." },
    { title: "'SoundScape' AI Audio Generation", description: "Automatically create context-aware background music, ambient sounds, and sound effects that match your video's content and mood." },
    { title: "'Consistent Character' Creation", description: "Define a character and maintain its appearance, clothing, and features across multiple generated scenes and videos." },
    { title: "'Live Prompting' Video Editing", description: "Edit generated videos in real-time. Type commands like 'make the sky purple' or 'add fireworks' and see the changes instantly." },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <header className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            The Creative Hub
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            A comprehensive technical and feature specification for a next-generation AI video and image generator.
          </p>
        </header>

        <Section title="App Architecture and Model Mapping">
          <div className="grid md:grid-cols-3 gap-8">
            {architectureItems.map((item, index) => (
              <Card key={index} className="flex flex-col">
                <div className="flex items-center mb-4">
                  {item.icon}
                  <h3 className="ml-4 text-xl font-bold text-white">{item.title}</h3>
                </div>
                <p className="text-gray-400 flex-grow">{item.content}</p>
                 <div className="mt-4 pt-4 border-t border-gray-700">
                    <span className="text-xs uppercase font-semibold text-cyan-400">Model Used</span>
                    <p className="text-sm text-gray-300 font-medium">{item.model}</p>
                </div>
              </Card>
            ))}
          </div>
        </Section>
        
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
                <Card key={index} className={`flex flex-col ${pkg.popular ? 'border-2 border-purple-500 transform scale-105 shadow-2xl shadow-purple-500/20' : ''}`}>
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

        <Section title="Next-Gen AI Tools">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {nextGenTools.map((tool, index) => (
               <Card key={index}>
                  <h3 className="text-xl font-bold text-white mb-3">{tool.title}</h3>
                  <p className="text-gray-400">{tool.description}</p>
              </Card>
            ))}
             <Card className="bg-gradient-to-br from-purple-600/20 to-cyan-600/20 md:col-span-2 lg:col-span-1">
                  <h3 className="text-xl font-bold text-white mb-3">And many more...</h3>
                  <p className="text-gray-400">Our roadmap is packed with innovative features designed to push the boundaries of creative AI.</p>
              </Card>
          </div>
        </Section>
      </main>
    </div>
  );
};

export default App;
