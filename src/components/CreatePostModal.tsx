import React, { useState } from 'react';
import type { Meme } from '../types';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (post: Omit<Meme, 'id' | 'date' | 'comments'>) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [tags, setTags] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            url,
            title,
            author,
            tags: tags.split(',').map(t => t.trim()),
        });
        onClose();
        // Reset form
        setUrl('');
        setTitle('');
        setAuthor('');
        setTags('');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bevel-out p-1 w-full max-w-md bg-[#333]">
                <div className="winamp-bar mb-2 flex justify-between items-center cursor-move">
                    <span>UPLOAD_WIZARD.EXE</span>
                    <button onClick={onClose} className="font-bold px-1 hover:bg-red-700">X</button>
                </div>

                <form onSubmit={handleSubmit} className="bg-black bevel-in p-4 space-y-3 font-mono text-xs">
                    <div>
                        <label className="block text-red-500 mb-1">IMAGEN URL:</label>
                        <input
                            type="text"
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                            className="w-full bg-[#222] border border-gray-600 p-1 text-green-500 focus:outline-none focus:border-red-500"
                            placeholder="http://..."
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-red-500 mb-1">TÍTULO:</label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full bg-[#222] border border-gray-600 p-1 text-green-500 focus:outline-none focus:border-red-500"
                            placeholder="Título del post..."
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-red-500 mb-1">ALIAS (Usuario):</label>
                        <input
                            type="text"
                            value={author}
                            onChange={e => setAuthor(e.target.value)}
                            className="w-full bg-[#222] border border-gray-600 p-1 text-green-500 focus:outline-none focus:border-red-500"
                            placeholder="Tu nombre Hacker..."
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-red-500 mb-1">TAGS (Separados por coma):</label>
                        <input
                            type="text"
                            value={tags}
                            onChange={e => setTags(e.target.value)}
                            className="w-full bg-[#222] border border-gray-600 p-1 text-green-500 focus:outline-none focus:border-red-500"
                            placeholder="meme, cringe, funny"
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={onClose} className="btn-retro">CANCELAR</button>
                        <button type="submit" className="btn-retro text-red-500">UPLOAD</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
