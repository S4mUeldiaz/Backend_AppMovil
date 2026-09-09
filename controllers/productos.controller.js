const { supabase } = require('../config/supabase');

const obtenerCategorias = async (req, res) => {
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .eq('estado', 'activo')
    .order('orden');

  if (error) return res.status(400).json({ error: error.message });

  return res.status(200).json(data);
};

const obtenerProductos = async (req, res) => {
  const { categoria, genero } = req.query;

  let query = supabase
    .from('productos')
    .select(`
      id_producto,
      id_categoria,
      referencia,
      nombre,
      descripcion,
      marca,
      precio,
      genero,
      estado,
      total_ventas,
      categorias ( nombre_categoria ),
      imagenes_producto ( url_imagen, orden )
    `)
    .eq('estado', 'activo');

  if (categoria) query = query.eq('id_categoria', categoria);
  if (genero) query = query.eq('genero', genero);

  const { data, error } = await query.order('total_ventas', { ascending: false });

  if (error) return res.status(400).json({ error: error.message });

  return res.status(200).json(data);
};

const obtenerProductoPorId = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('productos')
    .select(`
      id_producto,
      id_categoria,
      referencia,
      nombre,
      descripcion,
      marca,
      precio,
      genero,
      estado,
      categorias ( nombre_categoria ),
      imagenes_producto ( url_imagen, orden ),
      stock ( id_stock, color, stock_actual, estado, tallas ( talla ) )
    `)
    .eq('id_producto', id)
    .single();

  if (error) return res.status(404).json({ error: 'Producto no encontrado' });

  return res.status(200).json(data);
};

module.exports = { obtenerCategorias, obtenerProductos, obtenerProductoPorId };