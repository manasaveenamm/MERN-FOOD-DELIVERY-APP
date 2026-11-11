
import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase environment variables are missing');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    },
    realtime: {
        transport: ws
    }
});

export default supabase;
