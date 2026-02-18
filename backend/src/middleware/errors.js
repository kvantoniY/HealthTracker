export function notFound(req, res) {
  res.status(404).json({ error: { message: 'Not found' } });
}

export function errorHandler(err, req, res, next) {
  console.error('[error]', err);
  res.status(err.status || 500).json({ error: { message: err.message || 'Server error' } });
}
