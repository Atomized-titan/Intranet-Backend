// configure passport here
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import passportJWT from "passport-jwt";
import passportLocal from "passport-local";
import { User } from "../entity/User";
import { getUserByEmailSvc, getUserByIdSvc } from "../services/user.service";
import { jwtSecret } from "../config";

const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

// Function to validate the user's password
const isValidPassword = async (user: User, password: string) => {
  return await bcrypt.compare(password, user.password);
};

// Local Strategy for handling email/password authentication
passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const user = await getUserByEmailSvc(email);
        if (!user) {
          return done(null, false, { message: "Incorrect email or password." });
        }

        const isValid = await isValidPassword(user, password);
        if (!isValid) {
          return done(null, false, { message: "Incorrect email or password." });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// JWT Strategy for handling token-based authentication
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret, // Replace with your JWT secret key
    },
    async (payload, done) => {
      try {
        const user = await getUserByIdSvc(payload.sub);
        if (!user) {
          return done(null, false);
        }

        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

// Function to generate a JWT token
export const generateJWTToken = (user: User): string => {
  const payload = { sub: user.id };
  const options = { expiresIn: "1d" }; // Replace with your preferred token expiration time
  return jwt.sign(payload, jwtSecret, options); // Replace with your JWT secret key
};

export default passport;
