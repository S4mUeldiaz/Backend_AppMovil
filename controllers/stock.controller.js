const { supabase } = require('../config/supabase');

const obtenerStock = async (req, res) => {
  const { data, error } = await supabase
    .from('stock')
    .select(`
      id_stock,
      id_producto,
      id_talla,
      color,
      stock_actual,
      stock_minimo,
      stock_maximo,
      estado,
      ubicacion_almacen,
      fecha_actualizacion,
      productos ( nombre, referencia, precio, id_categoria ),
      tallas ( talla )
    `)
    .order('id_stock');

  if (error) return res.status(400).json({ error: error.message });

  return res.status(200).json(data);
};

const obtenerStockPorProducto = async (req, res) => {
  const { id_producto } = req.params;

  const { data, error } = await supabase
    .from('stock')
    .select(`
      id_stock,
      id_talla,
      color,
      stock_actual,
      stock_minimo,
      stock_maximo,
      estado,
      ubicacion_almacen,
      tallas ( talla )
    `)
    .eq('id_producto', id_producto)
    .order('id_stock');

  if (error) return res.status(400).json({ error: error.message });

  return res.status(200).json(data);
};

module.exports = { obtenerStock, obtenerStockPorProducto };