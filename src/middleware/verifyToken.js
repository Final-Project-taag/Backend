
import jwt from 'jsonwebtoken';

// Middleware zum Verifizieren von Token
function verifyToken(req, res, next) {
    if (!req.headers.authorization)
      return res.status(401).send({ success: false, message: "Token missing" });
  
    let token = req.headers.authorization.split(" ")[1];
  
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err)
        return res.status(401).send({ success: false, message: "Invalid token" });
  
      req.tokenPayload = payload;
      next();
    });
  }
  export default verifyToken