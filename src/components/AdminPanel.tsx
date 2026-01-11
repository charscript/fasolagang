import React, { useState } from 'react';
import type { Meme, AboutData, Project, MemberLink } from '../types';
import { supabase } from '../supabaseClient';

interface AdminPanelProps {
    memes: Meme[];
    onAddPost: (newPost: Omit<Meme, 'id' | 'date' | 'comments'>) => void;
    onDeletePost: (id: number) => void;
    aboutData: AboutData;
    onUpdateAbout: (newData: AboutData) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ memes, onAddPost, onDeletePost, aboutData, onUpdateAbout }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState<'upload' | 'about'>('upload');

    // Upload State
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('Admin');
    const [tags, setTags] = useState('');
    const [url, setUrl] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [isMeme, setIsMeme] = useState(true);
    const [showOnHome, setShowOnHome] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const envPassword = import.meta.env.VITE_ADMIN_PASSWORD;
        if (password === envPassword) {
            setIsAuthenticated(true);
        } else {
            alert('ACCESO DENEGADO');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);

        try {
            let finalUrl = url;
            let postType: 'image' | 'video' = 'image';

            // 1. Handle File Upload
            if (file) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('meme-images')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('meme-images')
                    .getPublicUrl(filePath);

                finalUrl = publicUrl;
            }

            // 2. Determine Type
            if (finalUrl.includes('youtube.com') || finalUrl.includes('youtu.be')) {
                postType = 'video';
            }

            // 3. Submit
            onAddPost({
                title,
                author, // Default to Admin
                url: finalUrl,
                tags: tags.split(',').map(t => t.trim()),
                type: postType,
                is_meme: isMeme,
                show_on_home: showOnHome
            });

            alert('SUBIDA EXITOSA');
            setTitle('');
            setUrl('');
            setTags('');
            setFile(null);
            setFile(null);
            setIsMeme(true); // Reset to default
            setShowOnHome(false);
            // Reset file input value manually if needed, or rely on key reset
        } catch (error: any) {
            alert('ERROR EN SUBIDA: ' + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    // --- About Editor Handlers ---

    const handleIntroChange = (text: string, index: number) => {
        const newIntro = [...aboutData.introText];
        newIntro[index] = text;
        onUpdateAbout({ ...aboutData, introText: newIntro });
    };

    // Project Handlers
    const handleProjectChange = (id: number, field: keyof Project, value: any) => {
        const newProjects = aboutData.projects.map(p =>
            p.id === id ? { ...p, [field]: value } : p
        );
        onUpdateAbout({ ...aboutData, projects: newProjects });
    };

    const handleAddProject = () => {
        const newProject: Project = {
            id: Date.now(),
            title: "Nuevo Proyecto",
            description: "Descripción del proyecto...",
            image: "https://via.placeholder.com/300x200",
            status: "desarrollo",
            link: "#"
        };
        onUpdateAbout({ ...aboutData, projects: [...aboutData.projects, newProject] });
    };

    const handleDeleteProject = (id: number) => {
        if (confirm('¿Borrar proyecto?')) {
            const newProjects = aboutData.projects.filter(p => p.id !== id);
            onUpdateAbout({ ...aboutData, projects: newProjects });
        }
    };

    // Member Handlers
    const handleMemberChange = (id: number, field: keyof MemberLink, value: any) => {
        const newNetwork = aboutData.network.map(m =>
            m.id === id ? { ...m, [field]: value } : m
        );
        onUpdateAbout({ ...aboutData, network: newNetwork });
    };

    const handleAddMember = () => {
        const newMember: MemberLink = {
            id: Date.now(),
            name: "Nuevo Miembro",
            role: "Rol del Miembro",
            description: "Descripción...",
            image: "https://via.placeholder.com/200x200",
            link: "#",
            linkText: "Link"
        };
        onUpdateAbout({ ...aboutData, network: [...aboutData.network, newMember] });
    };

    const handleDeleteMember = (id: number) => {
        if (confirm('¿Borrar miembro?')) {
            const newNetwork = aboutData.network.filter(m => m.id !== id);
            onUpdateAbout({ ...aboutData, network: newNetwork });
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black text-green-500 font-mono flex flex-col items-center justify-center p-4">
                <div className="border border-green-500 p-8 w-full max-w-md text-center">
                    <h1 className="text-2xl mb-4 blink">:: ÁREA RESTRINGIDA ::</h1>
                    <p className="mb-4 text-xs">EL ACCESO NO AUTORIZADO ES UN DELITO.</p>
                    <form onSubmit={handleLogin} className="flex flex-col gap-2">
                        <input
                            type="password"
                            className="bg-black border border-green-700 p-2 text-center text-white outline-none focus:border-green-400"
                            placeholder="CONTRASEÑA"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoFocus
                        />
                        <button className="bg-green-900 text-black font-bold p-2 hover:bg-green-500 uppercase">AUTENTICAR</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-green-500 font-mono text-sm p-4">
            <header className="border-b border-green-800 pb-4 mb-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">CONSOLA_ADMIN v1.0</h1>
                <div className="flex gap-4">
                    <button onClick={() => setActiveTab('upload')} className={`px-2 ${activeTab === 'upload' ? 'bg-green-900 text-black' : 'text-green-500 hover:text-white'}`}>[ 🔥 SUBIR ]</button>
                    <button onClick={() => setActiveTab('about')} className={`px-2 ${activeTab === 'about' ? 'bg-green-900 text-black' : 'text-green-500 hover:text-white'}`}>[ ℹ️ ACERCA DE ]</button>
                    <button onClick={() => window.location.href = '/'} className="text-red-500 ml-4">[ SALIR ]</button>
                </div>
            </header>

            {activeTab === 'upload' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* UPLOAD TOOL */}
                    <div className="border border-green-800 p-4">
                        <h2 className="text-lg font-bold mb-4 bg-green-900 text-black px-1">:: SUBIDA RÁPIDA ::</h2>
                        <form onSubmit={handleSubmit} className="space-y-2">
                            <div>
                                <label>Título:</label>
                                <input className="w-full bg-[#111] border border-green-700 p-1 text-white" value={title} onChange={e => setTitle(e.target.value)} required />
                            </div>
                            <div>
                                <label>Autor:</label>
                                <input className="w-full bg-[#111] border border-green-700 p-1 text-white" value={author} onChange={e => setAuthor(e.target.value)} required />
                            </div>
                            <div>
                                <label>Tags (separados por coma):</label>
                                <input className="w-full bg-[#111] border border-green-700 p-1 text-white" value={tags} onChange={e => setTags(e.target.value)} placeholder="tech, hacking, lol" required />
                            </div>

                            <div className="flex items-center gap-2 border border-green-900 p-2 bg-[#050505] my-2">
                                <input
                                    type="checkbox"
                                    id="isMeme"
                                    checked={isMeme}
                                    onChange={e => setIsMeme(e.target.checked)}
                                    className="w-4 h-4 cursor-pointer accent-green-500"
                                />
                                <label htmlFor="isMeme" className="text-green-400 font-bold cursor-pointer select-none">
                                    [ ¿ES UN MEME? ]
                                </label>
                                <span className="text-gray-500 text-xs ml-2">(Si no, sale en Noticias)</span>
                            </div>

                            {/* Show on Home Checkbox (Only if it's a meme) */}
                            {isMeme && (
                                <div className="flex items-center gap-2 border border-green-900 p-2 bg-[#0a0a0a] my-2 ml-4">
                                    <input
                                        type="checkbox"
                                        id="showOnHome"
                                        checked={showOnHome}
                                        onChange={e => setShowOnHome(e.target.checked)}
                                        className="w-4 h-4 cursor-pointer accent-blue-500"
                                    />
                                    <label htmlFor="showOnHome" className="text-blue-400 font-bold cursor-pointer select-none text-xs">
                                        [ ¿MOSTRAR EN INICIO TAMBIÉN? ]
                                    </label>
                                </div>
                            )}

                            <div className="border border-green-900 p-2 bg-[#0a0a0a]">
                                <label className="block mb-1 text-green-300 text-xs">Opción A: Subir Archivo</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => setFile(e.target.files?.[0] || null)}
                                    className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-semibold file:bg-green-900 file:text-white hover:file:bg-green-700 cursor-pointer"
                                />
                            </div>

                            <div className="text-center text-xs text-gray-500 py-1">- O -</div>

                            <div>
                                <label>Opción B: URL de Imagen o Video (YouTube):</label>
                                <textarea
                                    className="w-full h-16 bg-[#111] border border-green-700 p-1 text-white text-xs disabled:opacity-50"
                                    value={url}
                                    onChange={e => setUrl(e.target.value)}
                                    placeholder="https://... (Deja vacío si subiste archivo)"
                                    disabled={!!file}
                                />
                            </div>
                            <button disabled={isUploading} className="w-full bg-green-700 text-black font-bold p-2 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed">
                                {isUploading ? 'SUBIENDO...' : 'INICIAR SUBIDA'}
                            </button>
                        </form>
                    </div>

                    {/* MANAGE TOOL */}
                    <div className="border border-green-800 p-4">
                        <h2 className="text-lg font-bold mb-4 bg-red-900 text-black px-1">:: GESTIÓN DE BASE DE DATOS ::</h2>
                        <div className="h-[500px] overflow-y-auto space-y-2 pr-2">
                            {memes.map(m => (
                                <div key={m.id} className="border border-gray-700 p-2 flex justify-between items-center text-xs hover:bg-[#111]">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <span className="text-gray-500 w-8">#{m.id}</span>
                                        {m.type === 'video' ? (
                                            <span className="text-xs text-blue-400 font-bold">[VIDEO]</span>
                                        ) : (
                                            <img src={m.url} className="w-8 h-8 object-cover" />
                                        )}
                                        <span className="truncate w-32">{m.title}</span>
                                    </div>
                                    <button onClick={() => onDeletePost(m.id)} className="text-red-500 hover:text-red-300 font-bold border border-red-900 px-2 py-1">[ELIMINAR]</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-8 pb-10">
                    {/* INTRO EDITOR */}
                    <section className="border border-green-800 p-4">
                        <h2 className="text-lg font-bold mb-4 bg-blue-900 text-black px-1">:: EDITAR MANIFIESTO ::</h2>
                        <div className="space-y-4">
                            {aboutData.introText.map((text, i) => (
                                <textarea
                                    key={i}
                                    className="w-full h-24 bg-[#111] border border-green-700 p-2 text-white text-xs font-mono"
                                    value={text}
                                    onChange={(e) => handleIntroChange(e.target.value, i)}
                                />
                            ))}
                        </div>
                    </section>

                    {/* PROJECTS EDITOR */}
                    <section className="border border-green-800 p-4">
                        <div className="flex justify-between items-center mb-4 bg-blue-900 text-black px-1">
                            <h2 className="text-lg font-bold">:: EDITAR PROYECTOS ::</h2>
                            <button onClick={handleAddProject} className="bg-green-500 text-black px-2 font-bold text-xs hover:bg-white">[ + AGREGAR ]</button>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {aboutData.projects.map(project => (
                                <div key={project.id} className="border border-gray-700 p-4 bg-[#050505] relative group">
                                    <button onClick={() => handleDeleteProject(project.id)} className="absolute top-2 right-2 text-red-500 border border-red-900 px-2 text-xs hover:bg-red-900 hover:text-white z-10">
                                        [ ELIMINAR ]
                                    </button>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-gray-500">Título</label>
                                            <input className="w-full bg-[#111] border border-gray-700 p-1 text-white" value={project.title} onChange={e => handleProjectChange(project.id, 'title', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">Status (activo/desarrollo/legado/banda)</label>
                                            <select className="w-full bg-[#111] border border-gray-700 p-1 text-white" value={project.status} onChange={e => handleProjectChange(project.id, 'status', e.target.value)}>
                                                <option value="activo">Activo</option>
                                                <option value="desarrollo">Desarrollo</option>
                                                <option value="legado">Legado</option>
                                                <option value="banda">Banda</option>
                                            </select>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-xs text-gray-500">Descripción</label>
                                            <textarea className="w-full bg-[#111] border border-gray-700 p-1 text-white h-16" value={project.description} onChange={e => handleProjectChange(project.id, 'description', e.target.value)} />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-xs text-gray-500">Imagen URL</label>
                                            <input className="w-full bg-[#111] border border-gray-700 p-1 text-white" value={project.image} onChange={e => handleProjectChange(project.id, 'image', e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* NETWORK EDITOR */}
                    <section className="border border-green-800 p-4">
                        <div className="flex justify-between items-center mb-4 bg-blue-900 text-black px-1">
                            <h2 className="text-lg font-bold">:: EDITAR RED CREATIVA ::</h2>
                            <button onClick={handleAddMember} className="bg-green-500 text-black px-2 font-bold text-xs hover:bg-white">[ + AGREGAR ]</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {aboutData.network.map(person => (
                                <div key={person.id} className="border border-gray-700 p-4 bg-[#050505] relative group">
                                    <button onClick={() => handleDeleteMember(person.id)} className="absolute top-2 right-2 text-red-500 border border-red-900 px-2 text-xs hover:bg-red-900 hover:text-white z-10">
                                        [ X ]
                                    </button>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <label className="text-xs text-gray-500">Nombre</label>
                                            <input className="bg-[#111] border border-gray-700 p-1 text-white w-1/2" value={person.name} onChange={e => handleMemberChange(person.id, 'name', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">Rol</label>
                                            <input className="w-full bg-[#111] border border-gray-700 p-1 text-white" value={person.role} onChange={e => handleMemberChange(person.id, 'role', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">Imagen URL</label>
                                            <input className="w-full bg-[#111] border border-gray-700 p-1 text-white" value={person.image} onChange={e => handleMemberChange(person.id, 'image', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">Descripción</label>
                                            <textarea className="w-full bg-[#111] border border-gray-700 p-1 text-white h-12" value={person.description} onChange={e => handleMemberChange(person.id, 'description', e.target.value)} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-xs text-gray-500">Link URL</label>
                                                <input className="w-full bg-[#111] border border-gray-700 p-1 text-white" value={person.link} onChange={e => handleMemberChange(person.id, 'link', e.target.value)} />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500">Texto Botón</label>
                                                <input className="w-full bg-[#111] border border-gray-700 p-1 text-white" value={person.linkText} onChange={e => handleMemberChange(person.id, 'linkText', e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
};
