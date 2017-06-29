const bcrypt = require('bcryptjs');

const db = require('../db/config');

const User = {};

function create (user) {
  const password = bcrypt.hashSync(user.password, 10);
  console.log(user);
  return db.one(`
    INSERT INTO users
    (email, password_digest)
    VALUES
    ($1, $2)
    RETURNING *;`,
    [ user.email, password]
  );
};

function findByEmail (email) {
  return db.oneOrNone(`
    SELECT *
    FROM users
    WHERE email = $1;`,
    [email]
  );
};

module.exports = {create, findByEmail};
