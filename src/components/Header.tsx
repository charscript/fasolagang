import React from 'react';
import { useSound } from './SoundContext';

interface HeaderProps {
    onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset }) => {
    const { sfxEnabled, toggleSfx, playHover, playClick } = useSound();

    return (
        <div className="max-w-6xl mx-auto mb-4 bevel-out p-1 bg-[#333] relative">
            {/* Decorations: Weed Frames (Outside Header) */}
            <div className="absolute top-12 -left-4 z-20 w-24 pointer-events-none hidden md:block">
                <img src="/weed.gif" alt="frame" className="w-full h-auto" />
            </div>
            <div className="absolute top-12 -right-4 z-20 w-24 pointer-events-none hidden md:block transform scale-x-[-1]">
                <img src="/weed.gif" alt="frame" className="w-full h-auto" />
            </div>

            {/* Marquee de noticias */}
            <div className="marquee-container bevel-in border-none mb-2">
                <span className="marquee-text text-red-500 font-bold">+++ BIENVENIDO A LA ZONA OSCURA +++ NO APAGUES TU ORDENADOR +++ SUBIDAS ANÓNIMAS ACTIVADAS +++ LOS EYES TE VIGILAN +++</span>
            </div>

            <header className="bg-black bevel-in p-2 flex flex-col items-center justify-center text-center relative overflow-hidden mb-4">
                <div className="relative z-0 w-full h-32 md:h-48 overflow-hidden group cursor-pointer" onClick={() => { playClick(); onReset(); }}>
                    <img src="/inicio.gif" alt="Inicio" className="w-full h-full object-cover object-center z-10 opacity-90 hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none opacity-50"></div>
                </div>
            </header>

            {/* Navbar simple */}
            <nav className="mt-1 flex justify-center flex-wrap gap-2 text-sm font-bold bg-[#333] p-1 border-t border-black">
                <button onClick={() => { playClick(); onReset(); }} onMouseEnter={playHover} className="btn-retro">[☠️ Inicio ]</button>
                <button onClick={() => { playClick(); window.location.href = '/memes'; }} onMouseEnter={playHover} className="btn-retro">[👁️ Memes ]</button>
                <button onClick={() => { playClick(); window.location.href = '/about'; }} onMouseEnter={playHover} className="btn-retro">[ℹ️ Acerca De ]</button>
            </nav>

            <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                <div className="text-[8px] text-gray-500">v.6.6.6-beta</div>
                <button
                    onClick={() => { playClick(); toggleSfx(); }}
                    className={`text-[9px] font-mono border px-1 ${sfxEnabled ? 'text-green-500 border-green-900 bg-black' : 'text-gray-600 border-gray-800 bg-[#111]'}`}
                >
                    SFX: {sfxEnabled ? 'ON' : 'OFF'}
                </button>
            </div>
        </div>
    );
};
