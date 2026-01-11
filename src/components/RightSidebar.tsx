import React from 'react';
import { useSound } from './SoundContext';
import type { Meme } from '../types';

interface RightSidebarProps {
    latestMemes?: Meme[];
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ latestMemes = [] }) => {
    const { playHover } = useSound();

    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    return (
        <aside className="w-full flex flex-col gap-4">

            {/* LATEST MEMES WIDGET */}
            <div className="bevel-out p-1">
                <div className="winamp-bar mb-1 bg-gradient-to-r from-blue-900 to-black">
                    MOMARDOS_TOP ({latestMemes.length})
                </div>
                <div className="bg-black p-1 space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
                    {latestMemes.length === 0 ? (
                        <div className="text-[10px] text-gray-600 italic text-center p-2">
                            ...buscando memes...
                        </div>
                    ) : (
                        latestMemes.map(meme => (
                            <a
                                key={meme.id}
                                href={meme.url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 hover:bg-[#222] p-1 group transition-colors block"
                                onMouseEnter={playHover}
                            >
                                <div className="w-8 h-8 border border-gray-600 overflow-hidden shrink-0 bg-[#050505] relative">
                                    {meme.type === 'video' ? (
                                        <>
                                            <img
                                                src={`https://img.youtube.com/vi/${getYoutubeId(meme.url)}/default.jpg`}
                                                className="w-full h-full object-cover opacity-80"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-[6px] bg-red-600 text-white px-1">▶</span>
                                            </div>
                                        </>
                                    ) : (
                                        <img src={meme.url} className="w-full h-full object-cover" alt="thumb" />
                                    )}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-[10px] text-gray-300 truncate group-hover:text-white font-bold">{meme.title}</p>
                                    <p className="text-[8px] text-gray-500">{meme.date.split(',')[0]} - {meme.author}</p>
                                </div>
                            </a>
                        ))
                    )}
                </div>
            </div>

            {/* Top Downloads / Warez Widget */}
            <div className="bevel-out p-1">
                <div className="winamp-bar mb-1">
                    TOP_DOWNLOADS
                </div>
                <div className="bg-[#111] border border-gray-600 p-1 space-y-1">
                    <div className="flex items-center gap-1 cursor-pointer hover:bg-gray-800 p-1 group" onMouseEnter={playHover}>
                        <span className="text-red-500 text-[9px]">💾</span>
                        <div className="flex flex-col">
                            <span className="text-[9px] text-gray-300 font-bold group-hover:text-white">doom_crack.exe</span>
                            <span className="text-[8px] text-gray-500">4.2MB - <span className="text-red-500">HOT!</span></span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 cursor-pointer hover:bg-gray-800 p-1 group" onMouseEnter={playHover}>
                        <span className="text-blue-500 text-[9px]">💾</span>
                        <div className="flex flex-col">
                            <span className="text-[9px] text-gray-300 font-bold group-hover:text-white">winamp_skin_pack.zip</span>
                            <span className="text-[8px] text-gray-500">1.8MB</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 cursor-pointer hover:bg-gray-800 p-1 group" onMouseEnter={playHover}>
                        <span className="text-green-500 text-[9px]">💾</span>
                        <div className="flex flex-col">
                            <span className="text-[9px] text-gray-300 font-bold group-hover:text-white">matrix_screensaver.scr</span>
                            <span className="text-[8px] text-gray-500">850KB</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 cursor-pointer hover:bg-gray-800 p-1 group" onMouseEnter={playHover}>
                        <span className="text-yellow-500 text-[9px]">⚠️</span>
                        <div className="flex flex-col">
                            <span className="text-[9px] text-gray-300 font-bold group-hover:text-white">virus_maker_v2.bat</span>
                            <span className="text-[8px] text-red-500 blink">DANGEROUS</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ad Space (88x31 Buttons) */}
            <div className="text-center space-y-2">
                <p className="text-[10px] text-gray-500">/// SPONSORS ///</p>
                <div className="grid grid-cols-2 gap-1 justify-items-center">
                    <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjI1eDRyNHZ5eHRyNHZ5eHRyNHZ5eHQ2eHRyNHZ5eHRyNHZ5eHQ2eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/duzpaTbCUy9Vu/giphy.gif" className="w-[88px] h-[31px] border border-gray-600" title="Get Firefox" />
                </div>
            </div>

            {/* Daily Forecast / Lucky Item */}
            <div className="bevel-out p-1">
                <div className="winamp-bar mb-1">
                    LUCKY_ITEM
                </div>
                <div className="bg-black text-center p-2">
                    <p className="text-red-400 text-xs font-bold mb-1">★ TODAY ★</p>
                    <img src="/weed.gif" className="w-16 mx-auto animate-pulse" alt="Lucky Item" />
                    <p className="text-[9px] text-gray-400 mt-1">Special Herb</p>
                    <p className="text-[9px] text-green-400">Luck: 420%</p>
                </div>
            </div>
        </aside>
    );
};
