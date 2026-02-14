import React, { useEffect, useRef } from 'react';
import Reveal from 'reveal.js';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/black.css';
import { useAppStore } from '../store/useAppStore';
import md from '../services/markdownService';
import { X } from 'lucide-react';

export const Presentation: React.FC = () => {
  const { markdownContent, togglePresentationMode } = useAppStore();
  const deckRef = useRef<HTMLDivElement>(null);
  const revealInstance = useRef<Reveal.Api | null>(null);

  useEffect(() => {
    if (deckRef.current && !revealInstance.current) {
      revealInstance.current = new Reveal(deckRef.current, {
        embedded: true,
        keyboard: true,
        history: false,
        overview: true,
        controls: true,
        progress: true,
        center: true,
        hash: false,
      });
      revealInstance.current.initialize();
    }

    return () => {
      if (revealInstance.current) {
        try {
          revealInstance.current.destroy();
          revealInstance.current = null;
        } catch (e) {
          console.warn("Reveal destroy failed", e);
        }
      }
    };
  }, []);

  const slides = markdownContent.split(/\n---\n/g).map(slide => md.render(slide));

  return (
    <div className="fixed inset-0 z-[100] bg-black h-screen w-screen overflow-hidden">
      <button onClick={togglePresentationMode} className="absolute top-4 right-4 z-[101] p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 opacity-50 hover:opacity-100 transition-opacity">
        <X size={24} />
      </button>
      <div className="reveal h-full w-full" ref={deckRef}>
        <div className="slides">
          {slides.map((html, index) => <section key={index} dangerouslySetInnerHTML={{ __html: html }} />)}
        </div>
      </div>
    </div>
  );
};