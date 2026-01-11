import React, { useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';
import { RightSidebar } from './RightSidebar';

import { StickyNote } from './StickyNote';
import type { Meme, MemberLink } from '../types';

interface PublicViewProps {
    memes: Meme[];
    members: MemberLink[];
    latestMemes: Meme[];
}

export const PublicView: React.FC<PublicViewProps> = ({ memes, members, latestMemes }) => {
    const [filterAuthor, setFilterAuthor] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;


    const filteredMemes = filterAuthor
        ? memes.filter(m => m.author === filterAuthor)
        : memes;

    const totalPages = Math.ceil(filteredMemes.length / ITEMS_PER_PAGE);
    const currentMemes = filteredMemes.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const uniqueAuthors = [...new Set(memes.map(m => m.author))];

    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    return (
        <div className="min-h-screen p-1 md:p-2 font-sans text-hacker-gray overflow-hidden">
            <div className="scanline"></div>
            <Header onReset={() => setFilterAuthor(null)} />

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-2 relative">
                <div className="md:col-span-3 flex flex-col gap-4">
                    <Sidebar
                        members={members}
                        onFilter={setFilterAuthor}
                        onReset={() => setFilterAuthor(null)}
                    />
                </div>

                <main className="md:col-span-7">
                    <div className="bevel-out p-1 min-h-[500px] bg-[#222]">
                        <div className="bg-gradient-to-r from-black to-[#500000] text-red-500 px-2 py-1 font-bold flex justify-between items-center mb-2 border-b border-red-900 border-dashed">
                            <span className="text-[10px] rainbow-text tracking-tighter">FEED :: {filterAuthor ? `FILTER: ${filterAuthor.toUpperCase()}` : "GLOBAL STREAM"}</span>
                            <div className="flex gap-1">
                                <div className="text-[8px] text-green-500 blink-fast">REC ●</div>
                            </div>
                        </div>

                        <div className="space-y-6 p-2">
                            {currentMemes.length === 0 ? (
                                <div className="text-center p-8 bg-black bevel-in border border-red-500">
                                    <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3Q1cTNwM3Q1cTNwM3Q1cTNwM3Q1cTNwM3Q1cTNwM3Q1cTNwZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/LpW8KyCkDhteg/giphy.gif" className="mx-auto w-12 h-12 mb-4" />
                                    <p className="font-bold text-red-600 blink">ERROR FATAL: DATOS NO ENCONTRADOS.</p>
                                    <p className="text-gray-500">El usuario ha sido eliminado de la matrix.</p>
                                    <button className="btn-retro mt-4" onClick={() => setFilterAuthor(null)}>REINICIAR SISTEMA</button>
                                </div>
                            ) : (
                                currentMemes.map(meme => (
                                    <div key={meme.id} className="bg-[#333] bevel-out p-1 mb-6 relative group">
                                        <div className="bg-gradient-to-r from-black to-[#300000] text-gray-300 px-2 py-1 text-xs font-bold flex justify-between items-center mb-2 border border-black">
                                            <span className="text-red-400 group-hover:text-white transition-colors">:: {meme.title}</span>
                                        </div>

                                        <div className="bg-black bevel-in p-4 text-center border-t border-l border-black border-r border-b border-[#444]">
                                            {meme.type === 'video' ? (
                                                <div className="aspect-video w-full border-2 border-[#333] p-1">
                                                    <iframe
                                                        width="100%"
                                                        height="100%"
                                                        src={`https://www.youtube.com/embed/${getYoutubeId(meme.url)}`}
                                                        title={meme.title}
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen>
                                                    </iframe>
                                                </div>
                                            ) : (
                                                <img src={meme.url} alt={meme.title} className="max-w-full h-auto mx-auto border-2 border-[#333] p-1 hover:border-red-800 transition-colors cursor-crosshair" style={{ maxHeight: '400px' }} />
                                            )}

                                            <div className="mt-3 text-left border-t border-dashed border-gray-800 pt-2 text-xs">
                                                <p className="mb-1 font-mono text-gray-500">
                                                    <span className="font-bold text-red-700">TAGS &gt;&gt;</span>
                                                    {meme.tags.map(tag => (
                                                        <a href="#" key={tag} className="ml-1">[{tag}]</a>
                                                    ))}
                                                </p>
                                                <p className="text-gray-600 italic text-[9px]">
                                                    Uploaded: {meme.date}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-2 flex items-center justify-between px-2 pb-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-gray-400">USR:</span>
                                                <span className="text-xs font-bold text-red-500 cursor-pointer hover:bg-red-900 hover:text-white px-1 transition-colors" onClick={() => setFilterAuthor(meme.author)}>
                                                    {meme.author}
                                                </span>
                                            </div>

                                            {/* Download Button */}
                                            {meme.type !== 'video' && (
                                                <a
                                                    href={meme.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    download={`fasola_${meme.id}`}
                                                    className="flex items-center gap-1 text-[10px] text-green-500 border border-green-900 px-2 py-0.5 hover:bg-green-900 hover:text-white transition-colors cursor-pointer"
                                                >
                                                    <span>⬇ SAVE_IMG</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Real Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-8 mb-4 flex-wrap">
                                <span className="font-bold text-xs pt-1 text-gray-400 mr-2">Páginas:</span>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-2 font-bold text-xs bg-black text-red-500 border border-red-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-red-900 hover:text-white"
                                >
                                    [&lt;&lt; ANT]
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-2 font-bold text-xs border ${currentPage === page
                                            ? 'bg-red-900 text-white border-red-500'
                                            : 'bg-black text-red-500 border-red-900 hover:bg-red-900 hover:text-white'
                                            }`}
                                    >
                                        [{page}]
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-2 font-bold text-xs bg-black text-red-500 border border-red-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-red-900 hover:text-white"
                                >
                                    [SIG &gt;&gt;]
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="construction-bar"></div>
                </main >

                <div className="md:col-span-2 hidden md:block">
                    <RightSidebar latestMemes={latestMemes} />
                </div>

                {/* Sticky Note Relativo al Contenedor (Scrolls with page) */}
                <div className="absolute top-10 -right-64 z-10 hidden 2xl:block transform rotate-3 hover:scale-110 transition-transform duration-300 origin-top-left">
                    <div className="scale-150">
                        <StickyNote />
                    </div>
                </div>

                {/* RE4 Leon Gif (Background Layer) */}
                <div className="absolute top-[28rem] -right-[22rem] z-0 hidden 2xl:block pointer-events-none transform -rotate-6 opacity-80 mix-blend-hard-light">
                    <img src="/re4.gif" alt="Resident Evil 4" className="w-64" />
                </div>

                {/* Sol GIF (No fijo, scrollea) */}
                <div className="absolute -top-12 -left-32 z-0 hidden xl:block pointer-events-none mix-blend-screen opacity-60">
                    <img src="/sol.gif" alt="Sol" className="w-48 h-48 opacity-80" />
                </div>

                {/* Legiao GIF (Fondo, Grande, Debajo de Columna 1) */}
                <div className="absolute top-[1000px] -left-[350px] z-0 hidden 2xl:block pointer-events-none opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    <img src="/legiao.gif" alt="Legiao" className="w-[600px] transform -rotate-12 mix-blend-multiply" />
                </div>
                {/* Humor GIF (No fijo, scrollea) */}
                <div className="absolute top-[600px] -right-48 z-20 hidden xl:block pointer-events-none transform rotate-12 opacity-80 mix-blend-hard-light">
                    <img src="/humor.gif" alt="Humor" className="w-32" />
                </div>
            </div >



            {/* Flea Circus Stamp (Exótico) */}
            <div className="fixed bottom-4 left-4 z-50 pointer-events-none mix-blend-screen opacity-80 animate-pulse">
                <img
                    src="/flea_circus.png"
                    alt="Flea Circus"
                    className="w-24 md:w-32 transform -rotate-12 hover:rotate-12 transition-transform duration-700 ease-in-out pointer-events-auto cursor-help"
                    title="Welcome to the Circus"
                />
            </div>

            {/* RHCP Spin (Exótico 2) */}
            <div className="fixed bottom-4 right-4 z-50 pointer-events-none mix-blend-plus-lighter opacity-80">
                <img src="/rhcp_spin.gif" alt="RHCP" className="w-16 md:w-24 hover:animate-spin transition-transform duration-300 pointer-events-auto" />
            </div>

            <Footer />
        </div >
    );
};
