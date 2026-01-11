import React from 'react';
import type { MemberLink } from '../types';
import { CyberPet } from './CyberPet';
import { useMusic } from './MusicContext';

interface SidebarProps {
    members: MemberLink[];
    onFilter: (author: string) => void;
    onReset: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ members, onFilter, onReset }) => {
    const { isPlaying, togglePlay, nextTrack, prevTrack, currentTrack } = useMusic();

    return (
        <aside className="space-y-4">
            <CyberPet />

            {/* Widget: Friends List */}
            <div className="bevel-out p-1">
                <div className="winamp-bar mb-1">FRIENDS_LIST.TXT</div>
                <ul className="bg-black bevel-in p-2 min-h-[100px] list-disc list-inside text-xs font-mono">
                    <li className="cursor-pointer hover:text-white hover:bg-red-900 transition-colors" key="all" onClick={onReset}>
                        <span className="text-red-500 font-bold">[ MOSTRAR_TODO ]</span>
                    </li>
                    {members.length > 0 ? members.map(member => (
                        <li key={member.id} className="cursor-pointer hover:text-white hover:bg-red-900 transition-colors pl-1" onClick={() => onFilter(member.name)}>
                            {member.name}
                        </li>
                    )) : (
                        <li className="text-gray-600 italic pl-1">...cargando...</li>
                    )}
                </ul>
            </div>

            {/* Widget: Decoración GIF */}
            <div className="text-center">
                <img src="/wweed.gif" className="mx-auto border border-gray-700 w-full" alt="Weed Decoration" />
            </div>

            {/* Widget: Reproductor de Música Global */}
            <div className="bevel-out p-1">
                <div className="winamp-bar mb-1">DARKAMP v1.0</div>
                <div className="bg-black p-1 mb-1 border border-gray-600">
                    <div className="text-green-500 font-mono text-[9px] marquee-container border-none bg-transparent p-0">
                        <span className="marquee-text" style={{ animationDuration: '4s' }}>
                            {currentTrack.title} *** {currentTrack.duration} ***
                        </span>
                    </div>
                    <div className="text-green-500 font-mono text-[9px] text-right mt-1">
                        {isPlaying ? 'PLAYING' : 'PAUSED'}
                    </div>

                    {/* Visualizador falso */}
                    <div className="flex items-end gap-[1px] h-3 mt-1 opacity-90">
                        {Array.from({ length: 15 }).map((_, i) => (
                            <div key={i} className={`w-1 ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-green-900'}`} style={{ height: isPlaying ? `${Math.random() * 100}%` : '20%' }}></div>
                        ))}
                    </div>
                </div>
                <div className="flex gap-1 justify-center">
                    <button onClick={prevTrack} className="btn-retro text-[9px]">|&lt;</button>
                    <button onClick={togglePlay} className="btn-retro text-[9px]">{isPlaying ? '||' : '>'}</button>
                    <button onClick={togglePlay} className="btn-retro text-[9px]">||</button>
                    <button onClick={nextTrack} className="btn-retro text-[9px]">&gt;|</button>
                    <button className="btn-retro text-[9px] text-red-900">⏏</button>
                </div>
            </div>

            {/* Widget: Pixel Counter */}
            <div className="bevel-out p-1 text-center">
                <div className="text-[9px] text-gray-400 mb-1">ALMAS RECOLECTADAS:</div>
                <div className="pixel-counter">
                    666,420
                </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-1 justify-center">
                <img src="/emoji.gif" alt="Emoji" className="h-8" />
                <img src="/uy.gif" alt="Uruguay" className="h-8 border border-gray-600" />
            </div>
        </aside>
    );
};
