import express from "express";
import { ObjectId } from "mongodb";
import events from "../database/events";
import groups from "../database/groups";
import invites from "../database/invites";
import users from "../database/user";

const group = express.Router();

group.use((req, res, next) => {
    if (!req.user) return res.redirect("/");

    return next();
});

group.get("/:id", async (req, res, next) => {
    const { id } = req.params;

    //@ts-ignore
    if (!req.user.groups.includes(id) || !ObjectId.isValid(id)) return res.redirect("/groups");

    return next();
});

group.get("/:id/invite", async (req, res, next) => {
    const { id } = req.params;

    const group = await groups.findById(id);

    if (!group) return res.redirect("/groups");

    //@ts-ignore
    if (group.owner !== req.user.email && !group.managers.includes(req.user.email))
        return res.redirect(`/groups/${id}`);

    return next();
});

group.get("/:id/invite/:invite", async (req, res, next) => {
    const { id, invite } = req.params;

    const group = await groups.findById(id);

    if (!group) return res.redirect("/groups");

    const user = await users.findOne({
        //@ts-ignore
        email: req.user.email,
    });

    const inv = await invites.findOne({
        _id: invite,
        group: group._id,
        //@ts-ignore
        email: req.user.email,
    });

    //@ts-ignore
    if (!inv) return res.redirect("/groups");

    if (!user.groups.includes(group._id)) user.groups.push(group._id);

    await user.save();
    await inv.delete();

    return res.redirect(`/groups/${group._id}`);
});

group.get("/:id/events", async (req, res, next) => {
    const { id } = req.params;

    const group = await groups.findById(id);

    if (!group) return res.redirect("/groups");

    //@ts-ignore
    if (group.owner !== req.user.email) return res.redirect(`/groups/${id}`);

    return next();
});

group.get("/:id/events/create", async (req, res, next) => {
    const { id } = req.params;

    const group = await groups.findById(id);

    if (!group) return res.redirect("/groups");

    //@ts-ignore
    if (group.owner !== req.user.email) return res.redirect(`/groups/${id}`);

    return next();
});

group.get("/:id/events/:event", async (req, res, next) => {
    const { id, event } = req.params;

    const group = await groups.findById(id);

    if (!group) return res.redirect("/groups");

    //@ts-ignore
    if (group.owner !== req.user.email) return res.redirect(`/groups/${id}`);

    const eventDoc = await events.findById(event);

    if (!eventDoc) return res.redirect(`/groups/${id}/events`);

    return next();
});

export default group;
