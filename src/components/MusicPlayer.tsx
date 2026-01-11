import React, { useState } from 'react';
import { useMusic, SONGS } from './MusicContext';

export const MusicPlayer: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const {
        isPlaying,
        currentTrack,
        currentTrackIndex,
        togglePlay,
        nextTrack,
        prevTrack,
        volume,
        setVolume,
        setCurrentTrackIndex
    } = useMusic();

    return (
        <div className={`fixed bottom-0 right-0 z-50 transition-all duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-[calc(100%-40px)]'}`}>
            {/* Toggle Tab */}
            <div
                className="bg-black border-t-2 border-l-2 border-green-500 w-48 ml-auto p-2 cursor-pointer flex justify-between items-center hover:bg-green-900 hover:text-black hover:font-bold transition-colors text-xs font-mono text-green-500"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>[ 🎧 PLAYER v1.0 ]</span>
                <span>{isOpen ? '▼' : '▲'}</span>
            </div>

            {/* Player Body */}
            <div className="bg-black border-l-2 border-green-500 p-4 w-80 shadow-[0_0_20px_rgba(0,255,0,0.2)] font-mono">
                {/* Available text decoration */}
                <div className="text-[10px] text-gray-500 mb-2 text-right">:: PAPELINA_AUDIO_SYSTEM ::</div>

                {/* Screen */}
                <div className="bg-[#111] border border-gray-700 p-2 mb-4 h-16 flex flex-col justify-center items-center text-center overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-green-900 opacity-50 animate-scan"></div>
                    <span className="text-green-500 text-xs font-bold animate-pulse">{currentTrack.title}</span>
                    <span className="text-[10px] text-gray-500 mt-1">{isPlaying ? '▶ REPRODUCIENDO...' : '❚❚ PAUSADO'}</span>
                </div>

                {/* Controls */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                    <button onClick={prevTrack} className="bg-[#222] text-green-500 border border-green-900 hover:bg-green-900 hover:text-black p-1 text-xs">|◀</button>
                    <button onClick={togglePlay} className="bg-[#222] text-green-500 border border-green-900 hover:bg-green-900 hover:text-black p-1 text-xs">{isPlaying ? '❚❚' : '▶'}</button>
                    <button onClick={nextTrack} className="bg-[#222] text-green-500 border border-green-900 hover:bg-green-900 hover:text-black p-1 text-xs">▶|</button>
                </div>

                {/* Volume & Playlist */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-500">VOL</span>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="w-full h-1 bg-gray-800 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-green-500"
                        />
                    </div>

                    <div className="border-t border-gray-800 pt-2 mt-2">
                        <div className="h-20 overflow-y-auto text-[10px] space-y-1 pr-1 custom-scrollbar">
                            {SONGS.map((song, i) => (
                                <div
                                    key={song.id}
                                    className={`cursor-pointer hover:text-green-300 truncate ${i === currentTrackIndex ? 'text-green-500 font-bold' : 'text-gray-600'}`}
                                    onClick={() => { setCurrentTrackIndex(i); if (!isPlaying) togglePlay(); }}
                                >
                                    {i + 1}. {song.title}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
