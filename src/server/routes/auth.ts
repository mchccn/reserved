import express from "express";
import passport from "passport";
import users from "../database/user";

passport.serializeUser(async (user, done) => {
    //@ts-ignore
    return done(null, user.email);
});

passport.deserializeUser(async (id, done) => {
    const user = await users.findOne({
        email: id,
    });

    if (user) done(null, user);
});

const auth = express.Router();

auth.get("/logout", (req, res) => {
    if (req.user) req.logOut();

    res.redirect("/");
});

auth.get("/google", passport.authenticate("google"));

auth.get(
    "/google/callback",
    passport.authenticate("google", {
        successRedirect: "/",
        failureRedirect: "/forbidden",
    })
);

auth.get("/twitter", passport.authenticate("twitter"));

auth.get(
    "/twitter/callback",
    passport.authenticate("twitter", {
        successRedirect: "/",
        failureRedirect: "/forbidden",
    })
);

auth.get("/facebook", passport.authenticate("facebook"));

auth.get(
    "/facebook/callback",
    passport.authenticate("facebook", {
        successRedirect: "/",
        failureRedirect: "/forbidden",
    })
);

auth.get("/linkedin", passport.authenticate("linkedin"));

auth.get(
    "/linkedin/callback",
    passport.authenticate("linkedin", {
        successRedirect: "/",
        failureRedirect: "/forbidden",
    })
);

auth.get("*", (req, res) => res.redirect("/login"));

export default auth;
