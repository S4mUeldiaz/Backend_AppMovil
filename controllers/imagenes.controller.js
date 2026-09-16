const { supabase } = require('../config/supabase');
const { randomUUID } = require('crypto');

const BUCKET = 'productos-imagenes';

const obtenerImagenesPorProducto = async (req, res) => {
  const { id_producto } = req.params;

  const { data, error } = await supabase
    .from('imagenes_producto')
    .select('*')
    .eq('id_producto', id_producto)
    .order('orden', { ascending: true });

  if (error) return res.status(400).json({ error: error.message });

  return res.status(200).json(data);
};

const subirImagen = async (req, res) => {
  try {
    const { id_producto, color = '', orden = 0 } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: 'No se envió ningún archivo' });
    if (!id_producto) return res.status(400).json({ error: 'id_producto es requerido' });

    const ext = file.originalname.split('.').pop();
    const nombreArchivo = `${id_producto}/${color || 'general'}/${randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(nombreArchivo, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (uploadError) return res.status(400).json({ error: uploadError.message });

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(nombreArchivo);

    const { data, error: insertError } = await supabase
      .from('imagenes_producto')
      .insert({
        id_producto,
        color,
        url_imagen: publicUrlData.publicUrl,
        orden
      })
      .select()
      .single();

    if (insertError) return res.status(400).json({ error: insertError.message });

    return res.status(201).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const eliminarImagen = async (req, res) => {
  const { id_imagen } = req.params;

  const { data: imagen, error: findError } = await supabase
    .from('imagenes_producto')
    .select('url_imagen')
    .eq('id_imagen', id_imagen)
    .single();

  if (findError) return res.status(404).json({ error: 'Imagen no encontrada' });

  const path = imagen.url_imagen.split(`${BUCKET}/`)[1];
  await supabase.storage.from(BUCKET).remove([path]);

  const { error: deleteError } = await supabase
    .from('imagenes_producto')
    .delete()
    .eq('id_imagen', id_imagen);

  if (deleteError) return res.status(400).json({ error: deleteError.message });

  return res.status(200).json({ mensaje: 'Imagen eliminada' });
};

module.exports = { obtenerImagenesPorProducto, subirImagen, eliminarImagen };