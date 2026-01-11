import React from 'react';

export const StickyNote: React.FC = () => {
    return (
        <div className="bg-yellow-200 text-black p-3 font-mono text-[10px] shadow-lg transform rotate-2 hover:rotate-0 transition-transform duration-300 border border-yellow-400 relative" style={{ boxShadow: '4px 4px 6px rgba(0,0,0,0.5)' }}>
            {/* Pin/Tape Effect */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-red-500 opacity-80 rotate-[-2deg]" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.3)' }}></div>

            <h3 className="font-bold underline mb-1 text-center">TODO_LIST.txt</h3>
            <ul className="list-disc list-inside space-y-1">
                <li className="line-through decoration-red-600">Pegarle de cheto</li>
                <li>Soltar un disco</li>
                <li>pagar el server de MC</li>
                <li><span className="bg-black text-white px-1">Boladao 24/7</span></li>
            </ul>
            <div className="mt-2 text-right text-[8px] opacity-60 font-handwriting">
                - admin
            </div>
        </div>
    );
};
