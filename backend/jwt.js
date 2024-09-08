import { expressjwt as jwt } from "express-jwt";

function auth() {
  const secretKey = process.env.secretKey;
  const disableAuth = process.env.DISABLE_AUTH === 'true';

  return jwt({
    secret: secretKey,
    algorithms: ["HS256"],
    getToken: (req) => {
      if (req.cookies.authToken) {
        return req.cookies.authToken;
      }
      return null;
    },
    isRevoked: isRevoked,
  }).unless({

    path: disableAuth ? [

      /\/api\/v1\/categories(.*)/,
      /\/api\/v1\/products(.*)/,
      /\/api\/v1\/sizes(.*)/,
      /\/api\/v1\/orders(.*)/,
      /\/api\/v1\/users(.*)/,
      /\/uploads(.*)/,
      /\/api\/v1\/colors(.*)/,
      /\/api\/v1\/admin(.*)/,
      /\/api\/v1\/messages(.*)/

    ] : [
      "/api/v1/users/login",
      "/api/v1/users/check-email",
      "/api/v1/users/signup",
      /\/api\/v1\/users\/login-activity(.*)/,
      /\/api\/v1\/users\/logout-activity(.*)/,
      { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/categories(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/colors(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/sizes(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/users(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/orders(.*)/, methods: ["GET", "OPTIONS"] },],
  });
}

// admin validation
async function isRevoked(req, payload, done) {
  
  const isProtectedRoute = req.originalUrl.toLowerCase().includes("admin");

  if (isProtectedRoute && !payload.payload.isAdmin) {
    console.log("Access Denied: Not an Admin");
    return true;
  }

  return undefined; 
}

export default auth;
