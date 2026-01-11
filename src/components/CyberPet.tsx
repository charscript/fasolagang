import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Import Supabase

export const CyberPet: React.FC = () => {
    const [mood, setMood] = useState<'happy' | 'hungry' | 'sleeping'>('happy');
    const [statusText, setStatusText] = useState('CONNECTING...');
    const [stats, setStats] = useState({ feed: 0, poke: 0, sleep: 0 });

    useEffect(() => {
        fetchStats();
        // Optional: Realtime subscription could be added here
        const channel = supabase
            .channel('public:cyber_stats')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'cyber_stats' }, (payload) => {
                setStats({
                    feed: payload.new.feed_count,
                    poke: payload.new.poke_count,
                    sleep: payload.new.sleep_count
                });
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    const fetchStats = async () => {
        const { data, error } = await supabase
            .from('cyber_stats')
            .select('*')
            .eq('id', 1)
            .single();

        if (data) {
            setStats({
                feed: data.feed_count,
                poke: data.poke_count,
                sleep: data.sleep_count
            });
            setStatusText('ONLINE');
        } else if (error) {
            console.error('Error fetching pet stats:', error);
            setStatusText('OFFLINE_MODE');
        }
    };

    const updateStat = async (field: 'feed_count' | 'poke_count' | 'sleep_count') => {
        // Optimistic UI update
        const mapping = {
            'feed_count': 'feed',
            'poke_count': 'poke',
            'sleep_count': 'sleep'
        } as const;

        const key = mapping[field];
        setStats(prev => ({ ...prev, [key]: prev[key] + 1 }));

        // DB Update (Simple increment, could be improved with RPC for concurrency)
        const { error } = await supabase.rpc('increment_pet_stat', { row_id: 1, stat_name: field });

        // Fallback if RPC doesn't exist (User might not have run the complex SQL)
        if (error) {
            // Fallback to simple update (reading first to be safeish)
            const { data: current } = await supabase.from('cyber_stats').select(field).eq('id', 1).single();
            if (current) {
                const currentVal = (current as any)[field];
                await supabase.from('cyber_stats').update({ [field]: currentVal + 1 }).eq('id', 1);
            }
        }
    };

    // Actions
    const feed = () => {
        setMood('happy');
        setStatusText('YUMMY!');
        updateStat('feed_count');
        setTimeout(() => setStatusText('ONLINE'), 2000);
    };

    const poke = () => {
        setMood('hungry');
        setStatusText('HEY!');
        updateStat('poke_count');
        setTimeout(() => setStatusText('ONLINE'), 2000);
    };

    const sleep = () => {
        setMood('sleeping');
        setStatusText('ZZZ...');
        updateStat('sleep_count');
        setTimeout(() => setMood('happy'), 5000);
        setTimeout(() => setStatusText('ONLINE'), 5000);
    };

    // Render based on mood
    const getFace = () => {
        switch (mood) {
            case 'happy': return '( ^_^)';
            case 'hungry': return '( >_<)';
            case 'sleeping': return '( u_u)';
            default: return '( ?_?)';
        }
    };

    return (
        <div className="bevel-out p-1">
            <div className="bg-gradient-to-r from-purple-900 to-black text-white text-xs font-bold px-2 py-1 mb-2 border border-purple-500 flex justify-between">
                <span>:: CYBER_PET ::</span>
                <span className={`blink-fast ${mood === 'happy' ? 'text-green-500' : 'text-red-500'}`}>♥</span>
            </div>

            <div className="bg-black p-2 flex flex-col items-center">
                <div className="border-2 border-dashed border-purple-500 bg-[#111] w-full h-16 flex items-center justify-center mb-2 relative overflow-hidden">
                    {/* Retro background pattern */}
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #aa00aa 1px, transparent 1px)', backgroundSize: '8px 8px' }}></div>

                    <span className="text-xl font-mono text-purple-400 font-bold z-10 animate-bounce">
                        {getFace()}
                    </span>
                </div>

                <div className="w-full text-center mb-2">
                    <p className="text-[9px] text-gray-400">STATUS: <span className="text-purple-400 font-bold blink">{statusText}</span></p>
                </div>

                <div className="grid grid-cols-3 gap-1 w-full mb-2">
                    <button onClick={feed} className="btn-retro text-[9px] hover:text-purple-600 flex flex-col items-center gap-0">
                        <span>FEED</span>
                    </button>
                    <button onClick={poke} className="btn-retro text-[9px] hover:text-red-600 flex flex-col items-center gap-0">
                        <span>POKE</span>
                    </button>
                    <button onClick={sleep} className="btn-retro text-[9px] hover:text-blue-600 flex flex-col items-center gap-0">
                        <span>SLEEP</span>
                    </button>
                </div>

                {/* Stats Display */}
                <div className="grid grid-cols-3 gap-1 w-full text-[8px] text-gray-500 font-mono text-center">
                    <div>{stats.feed} 🍖</div>
                    <div>{stats.poke} 👆</div>
                    <div>{stats.sleep} 💤</div>
                </div>
            </div>
        </div>
    );
};
