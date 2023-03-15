import { access } from 'fs'
import passport from 'passport'
import { Strategy as GoogleAuthStrategy } from 'passport-google-oauth20'
import { EValidIdType } from '../../enums/EValidIdType.js'
import { User } from '../../models/User.js'
import { createToken } from '../../utils/createJwt.js'
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
          const exist = await User.findOne({
            email: profile.emails[0].value,
          })
          if (exist) {
             await exist.update({
              google_connected: true,
              is_email_verified: true,
            })
            
            return done(
              null,
             exist
            )
          }
          const user = await User.create({
            cover_photo: profile.profileUrl,
            email: profile.emails[0].value,
            google_connected: true,
            username: profile.displayName,
            id_type: EValidIdType.NONE,
            first_name:profile.name.givenName,
            last_name:profile.name.familyName,
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
      const user = req.user
      console.log(user);
      const url = new URL(process.env.FRONTEND_URL)
      const searchParams = new URLSearchParams({
        user_id: user._id,
        token: createToken({ id: user._id }),
      })
      url.search = searchParams
      res.redirect(url)
    })
  }
}
