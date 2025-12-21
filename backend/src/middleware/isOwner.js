export default function isOwner(req, res, next) {
  try {
    // TEMP / BASIC CHECK
    // If you later store role info in session or JWT,
    // you can validate it here.

    // Example (future use):
    // if (req.session?.user?.role !== 'owner') {
    //   return res.status(403).json({ message: 'Access denied' });
    // }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Authorization error' });
  }
}