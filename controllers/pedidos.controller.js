const { supabase } = require('../config/supabase');

function generarReferencia() {
  return `MOV-${Date.now()}`;
}

function calcularEstadoStock(stock_actual, stock_minimo) {
  if (stock_actual <= 0) return 'agotado';
  if (stock_actual <= stock_minimo) return 'bajo';
  return 'disponible';
}

const crearPedido = async (req, res) => {
  const { numero_documento, metodo_pago, costo_envio, direccion, ciudad, departamento, codigo_postal, items } = req.body;

  if (!numero_documento || !metodo_pago || !direccion || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Faltan datos requeridos para crear el pedido' });
  }

  const { data: direccionCreada, error: errorDireccion } = await supabase
    .from('direcciones')
    .insert({
      numero_documento,
      direccion,
      ciudad: ciudad || 'Bogotá',
      departamento: departamento || 'Cundinamarca',
      codigo_postal: codigo_postal || '',
    })
    .select()
    .single();

  if (errorDireccion) return res.status(400).json({ error: errorDireccion.message });

  const envio = Number(costo_envio) || 0;
  const subtotalPedido = items.reduce((acc, i) => acc + Number(i.precio_unitario) * Number(i.cantidad), 0);

  const { data: pedidoCreado, error: errorPedido } = await supabase
    .from('pedidos')
    .insert({
      numero_documento,
      id_direccion: direccionCreada.id_direccion,
      referencia: generarReferencia(),
      costo_envio: envio,
      precio_total: envio + subtotalPedido,
      metodo_pago,
      estado_pago: 'pendiente',
      estado_pedido: 'pendiente',
    })
    .select()
    .single();

  if (errorPedido) return res.status(400).json({ error: errorPedido.message });

  for (const item of items) {
    const { id_stock, cantidad, precio_unitario } = item;

    const { data: stockActual, error: errorStock } = await supabase
      .from('stock')
      .select('stock_actual, stock_minimo')
      .eq('id_stock', id_stock)
      .single();

    if (errorStock) return res.status(400).json({ error: errorStock.message });

    const { error: errorFactura } = await supabase.from('factura').insert({
      id_pedido: pedidoCreado.id_pedido,
      id_stock,
      cantidad,
      precio_unitario,
      subtotal: Number(precio_unitario) * Number(cantidad),
    });

    if (errorFactura) return res.status(400).json({ error: errorFactura.message });

    const nuevoStock = Math.max(0, stockActual.stock_actual - Number(cantidad));
    const nuevoEstado = calcularEstadoStock(nuevoStock, stockActual.stock_minimo);

    await supabase
      .from('stock')
      .update({ stock_actual: nuevoStock, estado: nuevoEstado, fecha_actualizacion: new Date().toISOString() })
      .eq('id_stock', id_stock);

    await supabase.from('movimientos_inventario').insert({
      id_stock,
      tipo_movimiento: 'salida',
      cantidad,
      stock_anterior: stockActual.stock_actual,
      stock_nuevo: nuevoStock,
      motivo: `Venta - pedido ${pedidoCreado.referencia}`,
      id_pedido: pedidoCreado.id_pedido,
      numero_documento,
    });
  }

  return res.status(201).json({ mensaje: 'Pedido creado', data: pedidoCreado });
};

const actualizarEstadoPedido = async (req, res) => {
  const { id } = req.params;
  const { estado_pago, estado_pedido } = req.body;

  const cambios = { fecha_actualizacion: new Date().toISOString() };
  if (estado_pago) cambios.estado_pago = estado_pago;
  if (estado_pedido) {
    cambios.estado_pedido = estado_pedido;
    if (estado_pedido === 'entregado') cambios.fecha_entregado = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('pedidos')
    .update(cambios)
    .eq('id_pedido', id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  return res.status(200).json(data);
};

const obtenerPedidos = async (req, res) => {
  const { data, error } = await supabase
    .from('pedidos')
    .select(`
      id_pedido,
      referencia,
      fecha_pedido,
      costo_envio,
      precio_total,
      metodo_pago,
      estado_pago,
      estado_pedido,
      usuarios ( numero_documento, nombre, apellido, correo ),
      factura (
        id_detalle,
        cantidad,
        precio_unitario,
        subtotal,
        stock (
          id_stock,
          color,
          tallas ( talla ),
          productos ( nombre, imagenes_producto ( url_imagen, orden ) )
        )
      )
    `)
    .order('fecha_pedido', { ascending: false });

  if (error) return res.status(400).json({ error: error.message });

  return res.status(200).json(data);
};

const obtenerPedidosPorUsuario = async (req, res) => {
  const { numero_documento } = req.params;

  const { data, error } = await supabase
    .from('pedidos')
    .select(`
      id_pedido,
      referencia,
      fecha_pedido,
      costo_envio,
      precio_total,
      metodo_pago,
      estado_pago,
      estado_pedido,
      factura (
        id_detalle,
        cantidad,
        precio_unitario,
        subtotal,
        stock (
          id_stock,
          color,
          tallas ( talla ),
          productos ( nombre, imagenes_producto ( url_imagen, orden ) )
        )
      )
    `)
    .eq('numero_documento', numero_documento)
    .order('fecha_pedido', { ascending: false });

  if (error) return res.status(400).json({ error: error.message });

  return res.status(200).json(data);
};

module.exports = { crearPedido, actualizarEstadoPedido, obtenerPedidos, obtenerPedidosPorUsuario };
