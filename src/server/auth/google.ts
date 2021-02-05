import passport from "passport";
import { Strategy, VerifyFunction } from "passport-google-oauth2";
import users from "../database/user";

passport.use(
    new Strategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: "http://localhost:3000/auth/google/callback",
            scope: ["email", "profile"],
        },
        (async (accessToken, refreshToken, profile, done) => {
            try {
                const email =
                    profile.email || profile.emails?.length
                        ? profile.emails?.[0].value
                        : undefined;

                if (!email) throw new Error("No email detected.");

                const user = await users.findOne({
                    email,
                });

                if (!user) {
                    const newUser = await users.create({
                        username:
                            profile.displayName || profile.given_name || profile.name.givenName,
                        email,
                        avatar:
                            profile.picture ||
                            profile.photos?.[0].value ||
                            "http://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png",
                    });
                    return done(null, newUser);
                }

                return done(null, user);
            } catch (error) {
                console.error(error);
                return done(error, null);
            }
        }) as VerifyFunction
    )
);
