import mongo from "connect-mongo";
import express from "express";
import session from "express-session";
import next from "next";
import passport from "passport";
import connect from "./server/database/connect";
import invites from "./server/database/invites";
import users from "./server/database/user";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

export { dev, port, app, handle };

(async () => {
    try {
        const connection = await connect();
        const MongoStore = mongo(session);

        await import("./server/auth/google");
        await import("./server/auth/twitter");
        await import("./server/auth/facebook");
        await import("./server/auth/linkedin");

        const api = (await import("./server/routes/api")).default;
        const auth = (await import("./server/routes/auth")).default;
        const groups = (await import("./server/routes/group")).default;
        const profile = (await import("./server/routes/profile")).default;

        await app.prepare();

        const server = express();

        server.use(
            session({
                name: "reserved",
                secret: "some random secret",
                cookie: {
                    maxAge: 1000 * 60 * 60 * 24,
                    httpOnly: true,
                    sameSite: "lax",
                    secure: !dev,
                },
                store: new MongoStore({
                    mongooseConnection: connection,
                }),
                saveUninitialized: false,
                resave: false,
            })
        );

        server.use(passport.initialize());
        server.use(passport.session());

        server.use(express.json());
        server.use(
            express.urlencoded({
                extended: true,
            })
        );

        server.use("/api", api);
        server.use("/auth", auth);
        server.use("/groups", groups);
        server.use("/profile", profile);

        server.get("/:email", async (req, res, next) => {
            if (
                !/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
                    req.params.email
                )
            )
                return next();

            const user = await users.findOne({
                email: req.params.email,
            });

            if (!user) return next();

            return handle(req, res);
        });

        server.get("/invites", async (req, res, next) =>
            req.user ? next() : res.redirect("/")
        );

        server.get("/account", async (req, res, next) =>
            req.user ? next() : res.redirect("/")
        );

        server.get("*", (req, res) => handle(req, res));

        server.listen(port, () => console.log("Server listening on port 3000!"));

        setInterval(async () => {
            const allInvites = await invites.find();

            allInvites.forEach(async (invite: any) => {
                if (Date.now() - invite.createdAt.getTime() > 86400000) await invite.delete();
            });
        }, 3600000);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();
