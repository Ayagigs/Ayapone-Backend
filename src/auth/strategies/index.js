import { access } from 'fs'
import passport from 'passport'
import { Strategy as GoogleAuthStrategy } from 'passport-google-oauth20'
import { User } from '../../models/User.js'
export class GoogleAuth {
  static instance = null
  constructor() {
    this.init({
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  }
  init({ clientID, clientSecret, callbackURL }) {
    const Strategy = new GoogleAuthStrategy(
      {
        clientID,
        clientSecret,
        callbackURL,
        passReqToCallback: true,
        scope: ['profile', 'email'],
      },
      async (req, _accessToken, _refreshToken, profile, done) => {
        try {
          const type = req.query.state
          console.log(type);
          const exist = await User.findOne({
            email: profile.emails[0],
          })
          if (exist) {
            const user = await exist.update({
                google_connected:true,
                is_email_verified:true,
            })
            
            return done(
              null,
              await User.findOne({
                email: profile.emails[0],
                email: profile.emails[0],
              }),
            )
          }
          const user = await User.create({
            cover_photo: profile.profileUrl,
            email: profile.emails[0],
            google_connected: true,
            username: profile.displayName,
            id_type: 'NONE',
            phone_number: profile,
            is_email_verified: true,
          })
          return done(null, user)
        } catch (error) {
          done(error)
        }
      },
    )
    passport.use('google', Strategy)
  }

  authenticate = (req, res, next) => {
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      session: false,
      state: req.query.user_type,
    })(req, res, next)
  }

  callback = (req, res) => {
    passport.authenticate('google', {
      failureRedirect: `${process.env.FRONTEND_URL}/login`,
      session: false,
    })(req, res, () => {
      if (req.query.state == 'merchant')
      { res.send(req.user)
      }
    })
  }
}
