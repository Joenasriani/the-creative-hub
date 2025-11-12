import React, { useState } from 'react';
import Section from '../components/Section';
import CollapsibleCard from '../components/CollapsibleCard';
import TextToImageGenerator from '../components/TextToImageGenerator';
import ImageToVideoGenerator from '../components/ImageToVideoGenerator';
import PromptRefiner from '../components/PromptRefiner';
import VideoStyleGenerator from '../components/VideoStyleGenerator';
import StoryboardGenerator from '../components/StoryboardGenerator';
import SoundScapeGenerator from '../components/SoundScapeGenerator';
import ConsistentCharacterGenerator from '../components/ConsistentCharacterGenerator';
import AIImageEditor from '../components/AIImageEditor';
import ImageRestyler from '../components/ImageRestyler';
import MusicToImageGenerator from '../components/MusicToImageGenerator';
import VideoToVideoRestyler from '../components/VideoToVideoRestyler';
import UIComponentGenerator from '../components/UIComponentGenerator';
import SpriteSheetGenerator from '../components/SpriteSheetGenerator';
import SceneInterpolator from '../components/SceneInterpolator';
import TextureGenerator from '../components/TextureGenerator';
import AssetPackGenerator from '../components/AssetPackGenerator';

const ToolsPage: React.FC = () => {
  const [openCardId, setOpenCardId] = useState<string | null>(null);

  const handleToggle = (cardId: string) => {
    setOpenCardId(prevId => (prevId === cardId ? null : cardId));
  };

  const toolSections = {
    "Foundational Tools": [
      {
        id: "Text-to-Image Generation",
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 010-2.828L16 8" /></svg>,
        component: <TextToImageGenerator />
      },
      {
        id: "AI Prompt Refinement",
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
        component: <PromptRefiner />
      },
       {
        id: "AI Image Editor ('Live Prompting')",
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>,
        component: <AIImageEditor />
      },
       {
        id: "Image to Image Restyle",
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18" /></svg>,
        component: <ImageRestyler />
      },
    ],
    "Design & Asset Generation": [
      {
        id: "'Consistent Character' Creation",
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
        component: <ConsistentCharacterGenerator />
      },
      {
        id: "Seamless Texture Generator",
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h4v4H4V4zm0 8h4v4H4v-4zm8-8h4v4h-4V4zm0 8h4v4h-4v-4z" /></svg>,
        component: <TextureGenerator />
      },
      {
        id: "Style-Consistent Asset Pack",
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
        component: <AssetPackGenerator />
      },
      {
        id: "UI Component Generator",
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
        component: <UIComponentGenerator />
      },
    ],
    "Video & Animation Suite": [
       { 
        id: "Image-to-Video Generation", 
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
        component: <ImageToVideoGenerator />
      },
      {
        id: "Video-to-Video Restyle",
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        component: <VideoToVideoRestyler />
      },
       {
        id: "AI Video Style Transfer",
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
        component: <VideoStyleGenerator />
      },
      {
        id: "AI Video Scene Interpolation",
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-lime-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5l7 7-7 7M4 5l7 7-7 7" /></svg>,
        component: <SceneInterpolator />
      },
       {
        id: "Interactive 'Storyboard' Mode",
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>,
        component: <StoryboardGenerator />
      },
       {
        id: "Animated Sprite Sheet Generator",
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-fuchsia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
        component: <SpriteSheetGenerator />
      },
    ],
    "Audio Tools": [
      {
        id: "'SoundScape' AI Audio Generation",
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.858 15.858a5 5 0 010-7.072m2.828 9.9a9 9 0 010-12.728" /></svg>,
        component: <SoundScapeGenerator />
      },
      {
        id: "Music to Image",
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" /></svg>,
        component: <MusicToImageGenerator />
      },
    ]
  };

  return (
    <>
      {Object.entries(toolSections).map(([sectionTitle, tools]) => (
        <Section key={sectionTitle} title={sectionTitle}>
          <div className="grid grid-cols-1 gap-8">
            {tools.map(tool => (
              <CollapsibleCard
                key={tool.id}
                title={tool.id}
                icon={tool.icon}
                isOpen={openCardId === tool.id}
                onToggle={() => handleToggle(tool.id)}
              >
                {tool.component}
              </CollapsibleCard>
            ))}
          </div>
        </Section>
      ))}
    </>
  );
};

export default ToolsPage;
