import aj from '../config/arcjet.js';
import { ARCJET_KEY } from '../config/env.js';

const arcjetMiddleware = async (req, res, next) => {
  // Skip Arcjet in development if not properly configured
  if (!ARCJET_KEY || ARCJET_KEY.includes('placeholder') || !ARCJET_KEY.startsWith('ajkey_')) {
    return next();
  }

  try {
    const decision = await aj.protect(req, { requested: 1 });

    if(decision.isDenied()) {
      if(decision.reason.isRateLimit()) return res.status(429).json({ error: 'Rate limit exceeded' });
      if(decision.reason.isBot()) return res.status(403).json({ error: 'Bot detected' });

      return res.status(403).json({ error: 'Access denied' });
    }

    next();
  } catch (error) {
    console.log(`Arcjet Middleware Error: ${error}`);
    // In development, continue even if Arcjet fails
    next();
  }
}

export default arcjetMiddleware;