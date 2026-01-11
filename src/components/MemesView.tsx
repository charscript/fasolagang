import React, { useState } from 'react';
import type { Meme } from '../types';
import { Footer } from './Footer';

interface MemesViewProps {
    memes: Meme[];
}

export const MemesView: React.FC<MemesViewProps> = ({ memes }) => {
    const [activeTab, setActiveTab] = useState<'all' | 'image' | 'video'>('all');
    const [selectedAuthor, setSelectedAuthor] = useState<string>('ALL');
    const [selectedMeme, setSelectedMeme] = useState<Meme | null>(null);

    const uniqueAuthors = ['ALL', ...new Set(memes.map(m => m.author))];

    const filteredMemes = memes.filter(meme => {
        const typeMatch = activeTab === 'all' || meme.type === activeTab;
        const authorMatch = selectedAuthor === 'ALL' || meme.author === selectedAuthor;
        return typeMatch && authorMatch;
    });

    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    return (
        <div className="min-h-screen p-2 font-sans text-hacker-gray">
            <div className="scanline"></div>

            <header className="max-w-6xl mx-auto mb-6 bg-black bevel-in p-4 flex justify-between items-center border-b-2 border-green-500">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold text-green-500 tracking-widest">
                        MOMARDOS
                    </h1>
                </div>
                <button
                    onClick={() => window.location.href = '/'}
                    className="btn-retro text-xs"
                >
                    [ 🔙 Volver a inicio ]
                </button>
            </header>

            <div className="max-w-6xl mx-auto">
                {/* CONTROLS */}
                <div className="mb-6 bg-[#222] bevel-out p-2 flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* TABS */}
                    <div className="flex gap-2">
                        {(['all', 'image', 'video'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 text-sm font-bold uppercase tracking-wider border-2 transition-all ${activeTab === tab
                                    ? 'bg-green-700 text-black border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]'
                                    : 'bg-black text-gray-500 border-gray-700 hover:border-green-800 hover:text-green-800'
                                    }`}
                            >
                                {tab === 'all' ? 'TODO' : tab === 'image' ? 'IMÁGENES' : 'VIDEOS'}
                            </button>
                        ))}
                    </div>

                    {/* AUTHOR FILTER */}
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <span className="text-xs font-bold text-green-700">Filtrar por autor:</span>
                        <select
                            value={selectedAuthor}
                            onChange={(e) => setSelectedAuthor(e.target.value)}
                            className="bg-black text-green-500 border border-green-800 p-1 text-xs outline-none focus:border-green-400 w-full md:w-48 font-mono"
                        >
                            {uniqueAuthors.map(author => (
                                <option key={author} value={author}>{author === 'ALL' ? 'TODOS' : author}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                    {filteredMemes.length === 0 ? (
                        <div className="col-span-full text-center py-20 border border-dashed border-gray-800 text-gray-600">
                            <p className="font-mono">NO HAY NADA :C</p>
                            <p className="text-xs">Ajustá los filtros.</p>
                        </div>
                    ) : (
                        filteredMemes.map(meme => (
                            <div
                                key={meme.id}
                                className="group relative bg-black border border-gray-800 hover:border-green-500 transition-colors duration-300 cursor-pointer"
                                onClick={() => setSelectedMeme(meme)}
                            >
                                <div className="aspect-square overflow-hidden bg-[#111] relative">
                                    {meme.type === 'video' ? (
                                        <div className="w-full h-full relative">
                                            <img
                                                src={`https://img.youtube.com/vi/${getYoutubeId(meme.url)}/hqdefault.jpg`}
                                                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <div className="bg-red-600 text-white text-xs px-2 py-1 font-bold">▶ PLAY</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <img
                                            src={meme.url}
                                            alt={meme.title}
                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-105"
                                        />
                                    )}

                                    {/* OVERLAY INFO */}
                                    <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col justify-end p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <h3 className="text-white text-sm font-bold truncate mb-1">{meme.title}</h3>
                                        <div className="flex justify-between items-center text-[10px] text-green-400 font-mono">
                                            <span>Autor: {meme.author}</span>
                                            <span>{meme.date.split(',')[0]}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* MODAL */}
            {selectedMeme && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4" onClick={() => setSelectedMeme(null)}>
                    <div className="bg-[#111] p-2 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col relative bevel-out border border-green-700" onClick={e => e.stopPropagation()}>
                        <button
                            className="absolute top-2 right-2 z-10 bg-red-600 text-white font-bold w-8 h-8 flex items-center justify-center hover:bg-red-700"
                            onClick={() => setSelectedMeme(null)}
                        >
                            X
                        </button>

                        <div className="flex-1 flex items-center justify-center bg-black overflow-hidden relative">
                            {selectedMeme.type === 'video' ? (
                                <iframe
                                    width="100%"
                                    height="500px" // Altura fija o aspect ratio
                                    src={`https://www.youtube.com/embed/${getYoutubeId(selectedMeme.url)}?autoplay=1`}
                                    title={selectedMeme.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full aspect-video"
                                ></iframe>
                            ) : (
                                <img src={selectedMeme.url} alt={selectedMeme.title} className="max-w-full max-h-[70vh] object-contain" />
                            )}
                        </div>

                        <div className="p-4 bg-[#222] border-t border-green-900">
                            <h2 className="text-xl font-bold text-green-500 mb-2">{selectedMeme.title}</h2>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-400 font-mono">
                                <span>Subido por: <span className="text-white">{selectedMeme.author}</span></span>
                                <span>Fecha: <span className="text-white">{selectedMeme.date}</span></span>
                            </div>
                            <div className="mt-2 flex justify-between items-center">
                                <div className="flex gap-2">
                                    {selectedMeme.tags.map(tag => (
                                        <span key={tag} className="text-xs bg-green-900 text-green-100 px-2 py-0.5 rounded-full">#{tag}</span>
                                    ))}
                                </div>
                                {selectedMeme.type !== 'video' && (
                                    <a
                                        href={selectedMeme.url}
                                        download
                                        target="_blank"
                                        className="bg-green-700 text-black px-3 py-1 font-bold text-xs hover:bg-green-500 uppercase flex items-center gap-2"
                                    >
                                        <span>💾</span> GUARDAR
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};
