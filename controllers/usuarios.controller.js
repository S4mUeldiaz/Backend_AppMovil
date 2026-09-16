const { supabase, supabaseAuth } = require('../config/supabase');

const obtenerUsuarios = async (req, res) => {
  const { data, error } = await supabase
    .from('usuarios')
    .select(`
      numero_documento,
      nombre,
      apellido,
      correo,
      telefono,
      estado,
      fecha_registro,
      fecha_ultima_actividad,
      roles ( nombre_rol )
    `)
    .order('fecha_registro', { ascending: false });

  if (error) return res.status(400).json({ error: error.message });

  return res.status(200).json(data);
};

const cambiarEstadoUsuario = async (req, res) => {
  const { numero_documento } = req.params;
  const { estado } = req.body;

  const estadosValidos = ['activo', 'inactivo'];
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ error: 'Estado inválido. Debe ser: activo o inactivo' });
  }

  const { data, error } = await supabase
    .from('usuarios')
    .update({ estado })
    .eq('numero_documento', numero_documento)
    .select('numero_documento, nombre, apellido, correo, telefono, estado')
    .single();

  if (error) return res.status(400).json({ error: error.message });

  return res.status(200).json(data);
};

const actualizarUsuario = async (req, res) => {
  const { numero_documento } = req.params;
  const { nombre, apellido, telefono } = req.body;

  const { data, error } = await supabase
    .from('usuarios')
    .update({ nombre, apellido, telefono })
    .eq('numero_documento', numero_documento)
    .select('numero_documento, nombre, apellido, correo, telefono, estado')
    .single();

  if (error) return res.status(400).json({ error: error.message });

  return res.status(200).json(data);
};

const cambiarPassword = async (req, res) => {
  const { numero_documento } = req.params;
  const { password_actual, password_nueva } = req.body;

  if (!password_actual || !password_nueva) {
    return res.status(400).json({ error: 'Completa ambos campos de contraseña' });
  }

  const { data: usuario, error: buscarError } = await supabase
    .from('usuarios')
    .select('correo, password_hash')
    .eq('numero_documento', numero_documento)
    .single();

  if (buscarError || !usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

  const { error: authError } = await supabaseAuth.auth.signInWithPassword({
    email: usuario.correo,
    password: password_actual,
  });

  if (authError) return res.status(401).json({ error: 'La contraseña actual no es correcta' });

  const { error: updateError } = await supabaseAuth.auth.admin.updateUser(usuario.password_hash, {
    password: password_nueva,
  });

  if (updateError) return res.status(400).json({ error: updateError.message });

  return res.status(200).json({ mensaje: 'Contraseña actualizada exitosamente' });
};

const eliminarCuenta = async (req, res) => {
  const { numero_documento } = req.params;
  const { password } = req.body;

  if (!password) return res.status(400).json({ error: 'Confirma tu contraseña para continuar' });

  const { data: usuario, error: buscarError } = await supabase
    .from('usuarios')
    .select('correo')
    .eq('numero_documento', numero_documento)
    .single();

  if (buscarError || !usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

  const { error: authError } = await supabaseAuth.auth.signInWithPassword({
    email: usuario.correo,
    password,
  });

  if (authError) return res.status(401).json({ error: 'Contraseña incorrecta' });

  const { error } = await supabase
    .from('usuarios')
    .update({ estado: 'inactivo' })
    .eq('numero_documento', numero_documento);

  if (error) return res.status(400).json({ error: error.message });

  return res.status(200).json({ mensaje: 'Cuenta eliminada' });
};

module.exports = { obtenerUsuarios, cambiarEstadoUsuario, actualizarUsuario, cambiarPassword, eliminarCuenta };
