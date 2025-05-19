import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, age, photo } = req.body;
    const { error } = await supabase.from('favorites').insert([{ name, age, photo }]);
    if (error) return res.status(500).json({ error });
    res.status(200).json({ success: true });
  }
}
