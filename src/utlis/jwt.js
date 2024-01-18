import jwt from "jsonwebtoken";

const SECRET_KEY =  process.env.JWT_SECRET || 'weqweqwe'
const EXPIRE_IN = Math.floor(new Date().getTime() / 1000) + (24*24*60*60)

// Function to Create Token

export function createAccesstoken(user) {
  return jwt.sign({
    id: user.id,
    user_id: user. user_id,
    email_address: user.email_address,
    user_type: user.user_type,
    user_role: user.user_role,
    expiresIn: EXPIRE_IN
  }, SECRET_KEY); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

// Function To create Refresh Token
// export const createRefreshToken = function(user) {
//   const payload = {
//     id: user._id,
//     exp: EXPIRE_IN
//   };
//   return jwt.encode(payload, SECRET_KEY);
// };

// Function To Decode Token
export function decodeToken(token) {
  return jwt.verify(token, SECRET_KEY);
};