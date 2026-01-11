import { useState, useEffect } from 'react';
import { MemesView } from './components/MemesView';
import { AboutView } from './components/AboutView';
import { PublicView } from './components/PublicView';
import { AdminPanel } from './components/AdminPanel';
import { MusicPlayer } from './components/MusicPlayer';
import { MusicProvider } from './components/MusicContext';
import { SoundProvider } from './components/SoundContext';
import type { Meme, AboutData } from './types';
import { supabase } from './supabaseClient';

const DEFAULT_ABOUT_DATA: AboutData = {
  introText: ["Cargando información..."],
  projects: [],
  network: []
};

function App() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [aboutData, setAboutData] = useState<AboutData>(DEFAULT_ABOUT_DATA);
  const [isLoading, setIsLoading] = useState(true);

  // FETCH DATA
  useEffect(() => {
    fetchMemes();
    fetchAboutData();
  }, []);

  const fetchMemes = async () => {
    const { data, error } = await supabase
      .from('memes')
      .select('*')
      .order('id', { ascending: false });

    if (error) console.error('Error fetching memes:', error);
    else setMemes((data as any[]) || []);
  };

  const fetchAboutData = async () => {
    const { data, error } = await supabase
      .from('about_info')
      .select('data')
      .eq('id', 1)
      .single();

    if (error) {
      console.error('Error fetching about data:', error);
    } else if (data) {
      setAboutData(data.data as AboutData);
    }
    setIsLoading(false);
  };

  // HANDLERS
  const handleAddPost = async (newPost: Omit<Meme, 'id' | 'date' | 'comments'>) => {
    const dateStr = new Date().toLocaleString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const { error } = await supabase
      .from('memes')
      .insert([{
        ...newPost,
        date: dateStr,
        comments: 0
      }]);

    if (error) alert('Error al subir post: ' + error.message);
    else fetchMemes(); // Refresh list
  };

  const handleDeletePost = async (id: number) => {
    if (confirm('CONFIRM DELETION?')) {
      const { error } = await supabase
        .from('memes')
        .delete()
        .eq('id', id);

      if (error) alert('Error al borrar: ' + error.message);
      else fetchMemes();
    }
  };

  // Handler to update About Data
  const handleUpdateAbout = async (newData: AboutData) => {
    // Optimistic update
    setAboutData(newData);

    const { error } = await supabase
      .from('about_info')
      .upsert({ id: 1, data: newData });

    if (error) {
      alert('Error guardando cambios: ' + error.message);
      fetchAboutData(); // Revert on error
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-black text-green-500 font-mono flex items-center justify-center">:: CONECTANDO AL SERVIDOR... ::</div>;
  }

  // Simple Router Check
  const path = window.location.pathname;

  // Combined Return for Layout persistence (so Music Player doesn't unmount)
  const renderContent = () => {
    if (path === '/admin') {
      return (
        <AdminPanel
          memes={memes}
          onAddPost={handleAddPost}
          onDeletePost={handleDeletePost}
          aboutData={aboutData}
          onUpdateAbout={handleUpdateAbout}
        />
      );
    }

    if (path === '/memes') {
      const onlyMemes = memes.filter(m => m.is_meme !== false); // Default to true if undefined
      return <MemesView memes={onlyMemes} />;
    }

    if (path === '/about') {
      return <AboutView data={aboutData} />;
    }

    // Noticias / Feed (Inicio)
    // Noticias / Feed (Inicio)
    const feedPosts = memes.filter(m => m.is_meme === false || m.show_on_home === true);
    const latestMemes = memes.filter(m => m.is_meme !== false).slice(0, 5); // Top 5 memes

    return (
      <PublicView
        memes={feedPosts}
        members={aboutData.network}
        latestMemes={latestMemes}
      />
    );
  };

  return (
    <SoundProvider>
      <MusicProvider>
        {renderContent()}
        <MusicPlayer />
      </MusicProvider>
    </SoundProvider>
  );
}

export default App;
