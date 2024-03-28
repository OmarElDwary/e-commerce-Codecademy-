const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { pool } = require('./db');

passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      if (user.rows.length === 0) {
        return done(null, false, { message: 'Incorrect username' });
      }
      const isValidPassword = await bcrypt.compare(password, user.rows[0].password);
      if (!isValidPassword) {
        return done(null, false, { message: 'Incorrect password' });
      }
      return done(null, user.rows[0]);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, user.rows[0]);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
