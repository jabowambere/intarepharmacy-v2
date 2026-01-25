import jwt from 'jsonwebtoken';

const token = jwt.sign(
  { id: "12345", name: "Wesley Sneijder", role: "user" },
  "lamineyamal",  // replace with anything for testing
  { expiresIn: "1h" }
);

console.log(token);
