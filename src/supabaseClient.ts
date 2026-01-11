import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gbrkujqmqadvdcpswglu.supabase.co';
const supabaseKey = 'sb_publishable_c1RgUkILObgyCd_th8Kl7g_tagHR3-G';

export const supabase = createClient(supabaseUrl, supabaseKey);
