import React, { createContext, useContext, useState, type ReactNode, useRef } from 'react';

// Using base64 or online URLs for small SFX to avoid large file dependencies for now
// These are placeholders. ideally use local assets.
const HOVER_SOUND = "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.m4a"; // Short blip
const CLICK_SOUND = "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.m4a"; // Mechanical click

interface SoundContextType {
    sfxEnabled: boolean;
    toggleSfx: () => void;
    playHover: () => void;
    playClick: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [sfxEnabled, setSfxEnabled] = useState(false);

    // Refs for audio to avoid re-creating objects
    const hoverAudio = useRef(new Audio(HOVER_SOUND));
    const clickAudio = useRef(new Audio(CLICK_SOUND));

    // Preload
    hoverAudio.current.volume = 0.2;
    clickAudio.current.volume = 0.3;

    const toggleSfx = () => setSfxEnabled(!sfxEnabled);

    const playHover = () => {
        if (!sfxEnabled) return;
        if (hoverAudio.current.paused) {
            hoverAudio.current.play().catch(() => { });
        } else {
            hoverAudio.current.currentTime = 0;
        }
    };

    const playClick = () => {
        if (!sfxEnabled) return;
        if (clickAudio.current.paused) {
            clickAudio.current.play().catch(() => { });
        } else {
            clickAudio.current.currentTime = 0;
        }
    };

    return (
        <SoundContext.Provider value={{ sfxEnabled, toggleSfx, playHover, playClick }}>
            {children}
        </SoundContext.Provider>
    );
};

export const useSound = () => {
    const context = useContext(SoundContext);
    if (context === undefined) {
        throw new Error('useSound must be used within a SoundProvider');
    }
    return context;
};
