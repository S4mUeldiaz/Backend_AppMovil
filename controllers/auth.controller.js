const { supabase, supabaseAuth } = require('../config/supabase');
const jwt = require('jsonwebtoken');

const registro = async (req, res) => {
  const { numero_documento, id_tipo_documento, nombre, apellido, correo, telefono, password, id_rol } = req.body;

  const { data: authData, error: authError } = await supabaseAuth.auth.admin.createUser({
    email: correo,
    password,
    email_confirm: true
  });

  if (authError) return res.status(400).json({ error: authError.message });

  const { error: dbError } = await supabase
    .from('usuarios')
    .insert({
      numero_documento,
      id_tipo_documento,
      nombre,
      apellido,
      correo,
      telefono,
      password_hash: authData.user.id,
      id_rol: id_rol || 2
    });

  if (dbError) return res.status(400).json({ error: dbError.message });

  return res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
};

const login = async (req, res) => {
  const { correo, password } = req.body;

  const { data, error } = await supabaseAuth.auth.signInWithPassword({
    email: correo,
    password
  });

  if (error) return res.status(401).json({ error: 'Credenciales incorrectas' });

  const { data: usuario } = await supabase
    .from('usuarios')
    .select(`
      numero_documento,
      nombre,
      apellido,
      correo,
      telefono,
      estado,
      roles ( nombre_rol )
    `)
    .eq('correo', correo)
    .single();

  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado en la base de datos' });

  if (usuario.estado === 'inactivo') {
    return res.status(403).json({ error: 'Usuario inactivo, contacta al administrador' });
  }

  const token = jwt.sign(
    {
      numero_documento: usuario.numero_documento,
      correo: usuario.correo,
      rol: usuario.roles.nombre_rol
    },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  await supabase
    .from('usuarios')
    .update({ fecha_ultima_actividad: new Date().toISOString() })
    .eq('correo', correo);
  return res.status(200).json({ usuario, token });
};

const logout = async (req, res) => {
  return res.status(200).json({ mensaje: 'Sesión cerrada' });
};

const yo = async (req, res) => {
  const { data: usuario } = await supabase
    .from('usuarios')
    .select(`
      numero_documento,
      nombre,
      apellido,
      correo,
      telefono,
      estado,
      roles ( nombre_rol )
    `)
    .eq('numero_documento', req.usuario.numero_documento)
    .single();

  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

  return res.status(200).json({ usuario });
};

module.exports = { registro, login, logout, yo };