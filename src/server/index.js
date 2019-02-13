/* eslint camelcase:0 */
const express = require('express');
const cors = require('cors');
const next = require('next');
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({dev});
const handle = nextApp.getRequestHandler();
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const userInViews = require('../middleware/user-in-views');
const secured = require('../middleware/secured')
const cookieParser = require('cookie-parser')

// config express-session
const sess = {
  secret: 'NUADQRQOYH',
  cookie: {},
  resave: false,
  saveUninitialized: true
};

if (process.env.NODE_ENV === 'production') {
  sess.cookie.secure = true; // serve secure cookies, requires https
}

const strategy = new Auth0Strategy({
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
  },
  (accessToken, refreshToken, extraParams, profile, done) => {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  }
);

const trace = label => value => {
  console.log(`${label}: ${JSON.stringify(value)}`);
  return value;
};
const logError = error => console.error(error);

const prepareNextApp = () => {
  nextApp.prepare()
    .then(() => {
      const server = express();
      server.use(cors());
      server.use(session(sess));
      server.use(cookieParser());


      passport.use(strategy);
      server.use(passport.initialize());
      server.use(passport.session());

      passport.serializeUser(function (user, done) {
        done(null, user);
      });

      passport.deserializeUser(function (user, done) {
        done(null, user);
      });

      server.use(userInViews());

      server.get('/login', passport.authenticate('auth0', {
        scope: 'openid email profile'
      }), (req, res) => {
        res.redirect('/');
      });

      server.get('/callback', (req, res, next) => {
        passport.authenticate('auth0', (err, user, info) => {
          if (err) { return next(err); }
          if (!user) { return res.redirect('/login'); }
          req.logIn(user, (err) => {
            if (err) { return next(err); }
            const returnTo = req.session.returnTo;
            delete req.session.returnTo;
            res.redirect(returnTo || '/user');
          });
        })(req, res, next);
      });

      server.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
      });

      server.get('/user', secured(), (req, res, next) => {
        const {
          _raw,
          _json,
          ...userProfile
        } = req.user;
        req.query.userProfile = JSON.stringify(userProfile, null, 2);
        // Not sure if this is the best way to get the user to the react component.
        req.query.user = res.locals.user;
        nextApp.render(req, res, '/user', req.query);
      });

      server.get('/',(req, res) => {
        // Not sure if this is the best way to get the user to the react component.
        req.query.user = res.locals.user;
        nextApp.render(req, res, '/', req.query);
      });

      server.get('*', (req, res) => {
        req.query.user = res.locals.user;
        return handle(req, res);
      });

      server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
      });
  });
};

Promise.resolve('...')
  .then(trace('Preparing next app'))
  .then(prepareNextApp)
  .catch(logError)
;