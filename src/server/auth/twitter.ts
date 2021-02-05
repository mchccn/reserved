import passport from "passport";
import { Strategy } from "passport-twitter";
import users from "../database/user";

passport.use(
    new Strategy(
        {
            consumerKey: process.env.TWITTER_ID!,
            consumerSecret: process.env.TWITTER_SECRET!,
            callbackURL: "http://localhost:3000/auth/twitter/callback",
            includeEmail: true,
        },
        async (token, tokenSecret, profile, done) => {
            try {
                const email =
                    profile._json.email || profile.emails?.length
                        ? profile.emails?.[0].value
                        : undefined;

                if (!email) throw new Error("No email detected.");

                const user = await users.findOne({
                    email,
                });

                if (!user) {
                    const newUser = await users.create({
                        username: profile.username || profile.displayName,
                        email,
                        avatar:
                            profile._json.profile_image_url_https ||
                            profile._json.profile_image_url ||
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
