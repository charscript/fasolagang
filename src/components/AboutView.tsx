import React from 'react';
import { Footer } from './Footer';
import type { AboutData } from '../types';

interface AboutViewProps {
    data: AboutData;
}

export const AboutView: React.FC<AboutViewProps> = ({ data }) => {
    return (
        <div className="min-h-screen p-2 font-sans text-hacker-gray">
            <div className="scanline"></div>

            <header className="max-w-6xl mx-auto mb-8 bg-black bevel-in p-4 flex justify-between items-center border-b-2 border-green-500">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold text-green-500 tracking-widest">
                        ACERCA DE
                    </h1>
                </div>
                <button
                    onClick={() => window.location.href = '/'}
                    className="btn-retro text-xs"
                >
                    [ 🔙 Volver a inicio ]
                </button>
            </header>

            <div className="max-w-6xl mx-auto space-y-12">

                {/* 1. INTRO / MANIFIESTO */}
                <section className="bg-black bevel-out p-1">
                    <div className="bg-[#111] p-6 text-center border border-gray-800">
                        <h2 className="text-2xl font-bold text-white mb-4 glitch-text" data-text=":: LA FASOLA ::">:: LA FASOLA ::</h2>
                        <div className="max-w-3xl mx-auto text-gray-300 space-y-4 font-mono">
                            {data.introText.map((text, index) => (
                                <p key={index}>{text}</p>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 2. PROYECTOS */}
                <section>
                    <div className="flex items-end gap-2 mb-4 border-b border-green-800 pb-2">
                        <h2 className="text-xl font-bold text-green-500">:: PROYECTOS ACTIVOS</h2>
                        <span className="text-xs text-gray-500 pb-1">/ COSAS QUE HACEMOS CUANDO NO DORMIMOS</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {data.projects.map(project => (
                            <div key={project.id} className="group bg-black bevel-out p-1 hover:border-green-500 border border-gray-800 transition-all">
                                <div className="bg-[#111] h-full flex flex-col">
                                    <div className="h-32 overflow-hidden relative">
                                        <div className="absolute top-2 right-2 px-2 py-0.5 bg-black bg-opacity-70 text-[10px] uppercase font-bold text-white border border-white">
                                            {project.status.toUpperCase()}
                                        </div>
                                        <img src={project.image} alt={project.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col">
                                        <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                                        <p className="text-xs text-gray-400 font-mono mb-4 flex-1">{project.description}</p>
                                        {project.link && (
                                            <a href={project.link} className="flex items-center gap-1 text-xs text-green-500 hover:text-green-300 font-bold uppercase transition-colors">
                                                <span>Explorar</span>
                                                <span>»</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 3. RED PROFESIONAL */}
                <section className="mb-12">
                    <div className="flex items-end gap-2 mb-4 border-b border-blue-900 pb-2">
                        <h2 className="text-xl font-bold text-blue-400">:: RED CREATIVA</h2>
                        <span className="text-xs text-gray-500 pb-1">/ NUESTRAS EMPRESAS & PERFILES PÚBLICOS</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data.network.map(person => (
                            <div key={person.id} className="bg-black border border-gray-800 p-4 flex gap-4 hover:bg-[#111] transition-colors relative overflow-hidden">
                                <img src={person.image} alt={person.name} className="w-16 h-16 object-cover grayscale rounded-sm" />
                                <div className="flex-1 z-10">
                                    <h3 className="text-white font-bold">{person.name}</h3>
                                    <span className="text-xs text-blue-400 block mb-2">{person.role}</span>
                                    <p className="text-xs text-gray-500 mb-3">{person.description}</p>
                                    <a href={person.link} target="_blank" rel="noreferrer" className="inline-block bg-blue-900 bg-opacity-30 text-blue-200 text-xs px-2 py-1 border border-blue-800 hover:bg-blue-800 transition-colors">
                                        [{person.linkText}]
                                    </a>
                                </div>
                                {/* Tech decoration */}
                                <div className="absolute -bottom-4 -right-4 text-8xl text-blue-900 opacity-10 pointer-events-none">
                                    {person.name[0]}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </div>

            <Footer />
        </div>
    );
};
