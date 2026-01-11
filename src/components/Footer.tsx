import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="max-w-5xl mx-auto mt-4 text-center text-[10px] text-gray-500 pb-8 font-mono">
            <div className="flex justify-center mb-2">
                <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2Q5ZGU5ZGU5ZGU5ZGU5ZGU5ZGU5ZGU5ZGU5ZGU5ZGU5ZGU5ZGU5ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/LpW8KyCkDhteg/giphy.gif" className="h-4 w-full opacity-50" />
            </div>
            <p className="text-red-800 font-bold">&copy; 1999-2025 EL ARCHIVO.</p>
            <p>Optimizado para resoluciones 800x600 y monitores CRT.</p>
            <p className="mt-2 text-xs">
                <span className="blink">_</span>
            </p>
        </footer>
    );
};
