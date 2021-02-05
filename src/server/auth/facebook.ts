import passport from "passport";
import { Strategy } from "passport-facebook";
import users from "../database/user";

passport.use(
    new Strategy(
        {
            clientID: process.env.FACEBOOK_ID!,
            clientSecret: process.env.FACEBOOK_SECRET!,
            callbackURL: "http://localhost:3000/auth/facebook/callback",
            profileFields: ["id", "displayName", "photos", "emails"],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0].value;

                if (!email) throw new Error("No email detected.");

                const user = await users.findOne({
                    email,
                });

                if (!user) {
                    const newUser = await users.create({
                        username: profile.displayName,
                        email,
                        avatar:
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
        }
    )
);
