import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Listar todos
    const { data, error } = await supabase
      .from("trabalhos.publicacoes")
      .select("*")
      .order("criado_em", { ascending: false });

    if (error) return res.status(500).json({ error });
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    // Criar uma publicação
    const { titulo, descricao, imagem_url, link_externo } = req.body;

    const { data, error } = await supabase
      .from("trabalhos.publicacoes")
      .insert([{ titulo, descricao, imagem_url, link_externo }])
      .select("*")
      .single();

    if (error) return res.status(500).json({ error });
    return res.status(201).json(data);
  }

  if (req.method === "PUT") {
    const { id } = req.query;
    const { titulo, descricao, imagem_url, link_externo } = req.body;

    const { data, error } = await supabase
      .from("trabalhos.publicacoes")
      .update({ titulo, descricao, imagem_url, link_externo })
      .eq("id", id)
      .select("*")
      .single();

    if (error) return res.status(500).json({ error });
    return res.status(200).json(data);
  }

  if (req.method === "DELETE") {
    const { id } = req.query;

    const { error } = await supabase
      .from("trabalhos.publicacoes")
      .delete()
      .eq("id", id);

    if (error) return res.status(500).json({ error });
    return res.status(204).end();
  }

  return res.status(405).json({ error: "Método não permitido" });
}
