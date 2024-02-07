import jwt from 'jsonwebtoken'

const SECRET = process.env.SECRET

const decodeUserFromToken = (req, res, next) => {
  console.log(req.headers, '<===== req.headers')
  let authHeader = req.get('Authorization');
  if (!authHeader) return next();

  // ensure the header is a string and starts with 'Bearer '
  if (typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
    console.error('Invalid Authorization header:', authHeader);
    return next(new Error('Invalid Authorization header'));
  }

  // remove 'Bearer ' prefix and extract token
  let token = authHeader.slice(7);

  console.log('Secret Key:', SECRET)
  console.log('token:', token); 

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      console.error('JWT verification error:', err);
      console.error('Error details:', {
        message: err.message,
        name: err.name,
        stack: err.stack
      });
      return next(err); 
    }

    console.log('Decoded payload:', decoded); 
    req.user = decoded.user;
    next();
  });
};

function checkAuth(req, res, next) {
  return req.user ? next() : res.status(401).json({ err: 'Not Authorized' })
}

export { decodeUserFromToken, checkAuth }

