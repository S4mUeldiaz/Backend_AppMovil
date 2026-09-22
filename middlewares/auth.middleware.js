const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const tokenHeader = authHeader && authHeader.split(' ')[1];
  const token = req.cookies?.token || tokenHeader;

  if (!token) return res.status(401).json({ error: 'Token requerido' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

const verificarRol = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({ error: 'No tienes permisos para esta acción' });
    }
    next();
  };
};

const verificarPropioOAdmin = (req, res, next) => {
  const esDueño = String(req.usuario.numero_documento) === req.params.numero_documento;
  if (req.usuario.rol === 'admin' || esDueño) {
    return next();
  }
  return res.status(403).json({ error: 'No tienes permisos para esta acción' });
};

module.exports = { verificarToken, verificarRol, verificarPropioOAdmin };