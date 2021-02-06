import express from "express";
import users from "../database/user";

const profile = express.Router();

profile.use((req, res, next) => {
    if (!req.user) return res.redirect("/");

    return next();
});

profile.post("/email", async (req, res) => {
    const { newEmail } = req.body;

    if (
        await users.findOne({
            email: newEmail,
        })
    )
        return res.redirect("/account?taken=true");

    await users.findOneAndUpdate(
        {
            //@ts-ignore
            email: req.user.email,
        },
        {
            email: newEmail,
        }
    );

    return res.redirect("/account");
});

profile.post("/username", async (req, res) => {
    const { username } = req.body;

    await users.findOneAndUpdate(
        {
            //@ts-ignore
            email: req.user.email,
        },
        {
            username,
        }
    );

    return res.redirect("/account");
});

profile.post("/delete", async (req, res) => {
    await users.findOneAndDelete({
        //@ts-ignore
        email: req.user.email,
    });

    req.logOut();

    return res.redirect(`/`);
});

profile.post("/update", async (req, res) => {
    const {
        email,
        website,
        description,
        snapchat,
        instagram,
        twitter,
        facebook,
        linkedin,
    } = req.body;

    await users.findOneAndUpdate(
        {
            email,
        },
        {
            email,
            website,
            description,
            snapchat,
            instagram,
            twitter,
            facebook,
            linkedin,
        }
    );

    return res.redirect(`/${email}`);
});

profile.get("*", (req, res, next) => next());

export default profile;
