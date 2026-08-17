export const ok = (res, data = {}, status = 200) =>
  res.status(status).json({ success: true, data });

export const fail = (res, message = "Something went wrong", status = 400) =>
  res.status(status).json({ success: false, message });

// Wraps async route handlers so thrown errors reach the error middleware
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
