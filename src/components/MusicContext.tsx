import React, { createContext, useContext, useState, useRef, useEffect, type ReactNode } from 'react';

// Songs Data
export const SONGS = [
    { id: 1, title: "Papelina - Demo #1 (Garage)", duration: "3:10", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { id: 2, title: "Código Espagueti - Jam Session", duration: "4:20", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { id: 3, title: "404 Not Found (Ballad)", duration: "2:50", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
];

interface MusicContextType {
    isPlaying: boolean;
    currentTrackIndex: number;
    currentTrack: typeof SONGS[0];
    volume: number;
    togglePlay: () => void;
    nextTrack: () => void;
    prevTrack: () => void;
    setVolume: (vol: number) => void;
    setCurrentTrackIndex: (index: number) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [volume, setVolume] = useState(0.5);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const currentTrack = SONGS[currentTrackIndex];

    // Initialize Audio Object once
    useEffect(() => {
        audioRef.current = new Audio(currentTrack.url);
        audioRef.current.volume = volume;

        const handleEnded = () => nextTrack();
        audioRef.current.addEventListener('ended', handleEnded);

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.removeEventListener('ended', handleEnded);
                audioRef.current = null;
            }
        };
    }, []); // Run once on mount

    // Handle Track Change
    useEffect(() => {
        if (audioRef.current) {
            // Only update src if it changed
            if (audioRef.current.src !== currentTrack.url) {
                const wasPlaying = isPlaying;
                audioRef.current.src = currentTrack.url;
                if (wasPlaying) audioRef.current.play().catch(console.error);
            }
        }
    }, [currentTrack.url]);

    // Handle Play/Pause
    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(e => {
                    console.error("Play error:", e);
                    setIsPlaying(false);
                });
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    // Handle Volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const togglePlay = () => setIsPlaying(!isPlaying);

    const nextTrack = () => {
        setCurrentTrackIndex((prev) => (prev + 1) % SONGS.length);
        // If we change track, we generally want to keep playing or start playing
        // but let's keep previous state or force play? Usually force play.
        if (!isPlaying) setIsPlaying(true);
    };

    const prevTrack = () => {
        setCurrentTrackIndex((prev) => (prev - 1 + SONGS.length) % SONGS.length);
        if (!isPlaying) setIsPlaying(true);
    };

    return (
        <MusicContext.Provider value={{
            isPlaying,
            currentTrackIndex,
            currentTrack,
            volume,
            togglePlay,
            nextTrack,
            prevTrack,
            setVolume,
            setCurrentTrackIndex
        }}>
            {children}
        </MusicContext.Provider>
    );
};

export const useMusic = () => {
    const context = useContext(MusicContext);
    if (context === undefined) {
        throw new Error('useMusic must be used within a MusicProvider');
    }
    return context;
};
