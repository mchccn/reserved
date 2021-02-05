import passport from "passport";
import { Strategy } from "passport-linkedin-oauth2";
import users from "../database/user";

passport.use(
    new Strategy(
        {
            clientID: process.env.LINKEDIN_ID!,
            clientSecret: process.env.LINKEDIN_SECRET!,
            callbackURL: "http://localhost:3000/auth/linkedin/callback",
            scope: ["r_emailaddress", "r_liteprofile"],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;

                if (!email) throw new Error("No email detected.");

                const user = await users.findOne({
                    email,
                });

                if (!user) {
                    const newUser = await users.create({
                        username: profile.displayName || profile.name.givenName,
                        email,
                        avatar:
                            profile.photos[0].value ||
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
