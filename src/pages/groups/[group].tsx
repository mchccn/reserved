import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import groups from "../../server/database/groups";
import users from "../../server/database/user";
import styles from "../../styles/groups.module.css";
import profile from "../../styles/profile.module.css";
import viewbox from "../../styles/viewbox.module.css";

interface IGroupProps {
    user: string;
    group: string;
    members: string;
    isManager: boolean;
    isOwner: boolean;
}

export default function Group({
    user: stringifiedUser,
    group: stringifiedGroup,
    members: stringifiedMembers,
    isManager,
    isOwner,
}: IGroupProps) {
    const [user, group, members] = [
        JSON.parse(stringifiedUser),
        JSON.parse(stringifiedGroup),
        JSON.parse(stringifiedMembers),
    ];

    const [shiftOrCtrl, setShiftOrCtrl] = useState(false);

    useEffect(() => {
        window.addEventListener("keydown", (e) => {
            if (["Shift", "Meta"].includes(e.key)) setShiftOrCtrl(true);
        });

        window.addEventListener("keyup", (e) => {
            if (["Shift", "Meta"].includes(e.key)) setShiftOrCtrl(false);
        });
    }, []);

    return (
        <Layout user={stringifiedUser}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <a href={`/groups/${group._id}`}>
                        <div className={styles.info}>
                            <img src={group.icon} alt="" />
                            <hr />
                            <div className={group.description ? styles.justify : ""}>
                                <h4>{group.name}</h4>
                                {group.description ? (
                                    <>
                                        <hr />
                                        <p>{group.description}</p>
                                    </>
                                ) : null}
                            </div>
                        </div>
                    </a>
                    {group.website ? (
                        <a href={group.website} className={styles.site}>
                            {group.website}
                        </a>
                    ) : null}
                </div>
                <div className={styles.links}>
                    <a href={`/groups/${group._id}/calendar`} className={profile.edit}>
                        Calendar
                    </a>
                    {isManager || isOwner ? (
                        <a href={`/groups/${group._id}/invite`} className={profile.edit}>
                            Invite
                        </a>
                    ) : null}
                    {isOwner ? (
                        <a href={`/groups/${group._id}/events`} className={profile.edit}>
                            Events
                        </a>
                    ) : null}
                    {isOwner ? (
                        <a
                            href={`/api/delete/${group._id}`}
                            className={profile.delete}
                            onClick={(e) => {
                                if (!confirm(`Are you sure you want to delete ${group.name}?`))
                                    e.preventDefault();
                            }}
                        >
                            Delete
                        </a>
                    ) : (
                        <a
                            href={`/api/leave/${group._id}`}
                            className={profile.delete}
                            onClick={(e) => {
                                if (!confirm(`Are you sure you want to leave ${group.name}?`))
                                    e.preventDefault();
                            }}
                        >
                            Leave
                        </a>
                    )}
                </div>
                <h3>Members</h3>
                <div className={viewbox.viewbox}>
                    {members.map((m: any, i: number) => (
                        <a href={`/${m.email}`} key={Math.random()}>
                            <div className={viewbox.item}>
                                <div>
                                    <img src={m.avatar} alt="" />
                                    <p className={viewbox.smaller}>{m.email}</p>
                                </div>
                                {shiftOrCtrl ? (
                                    <p className={viewbox.notice}>
                                        {isOwner &&
                                        group.managers.includes(m.email) &&
                                        user.email !== m.email ? (
                                            <a
                                                style={{ color: "var(--clr-red)" }}
                                                onClick={async (e) => {
                                                    e.preventDefault();
                                                    await fetch(
                                                        `/api/demote/${group._id}/${m.email}`
                                                    );
                                                    window.location.reload();
                                                }}
                                                className={viewbox.margin}
                                            >
                                                demote
                                            </a>
                                        ) : null}
                                        {isOwner &&
                                        !group.managers.includes(m.email) &&
                                        user.email !== m.email ? (
                                            <a
                                                style={{ color: "var(--clr-green)" }}
                                                onClick={async (e) => {
                                                    e.preventDefault();
                                                    await fetch(
                                                        `/api/promote/${group._id}/${m.email}`
                                                    );
                                                    window.location.reload();
                                                }}
                                                className={viewbox.margin}
                                            >
                                                promote
                                            </a>
                                        ) : null}
                                        {(isOwner && m.email !== group.owner) ||
                                        (isManager &&
                                            m.email !== group.owner &&
                                            !group.managers.includes(m.email)) ? (
                                            <a
                                                style={{ color: "var(--clr-red)" }}
                                                onClick={async (e) => {
                                                    e.preventDefault();
                                                    await fetch(
                                                        `/api/remove/${group._id}/${m.email}`
                                                    );
                                                    window.location.reload();
                                                }}
                                                className={viewbox.margin}
                                            >
                                                remove
                                            </a>
                                        ) : null}
                                    </p>
                                ) : null}
                                <p className={viewbox.tip}>{m.role}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </Layout>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const group = await groups.findById(ctx.query.group);
    const members = JSON.parse(
        JSON.stringify(
            (await users.find()).filter((user: any) => user.groups.includes(group._id))
        )
    ).map((m: any) => ({
        ...m,
        role:
            group.owner === m.email
                ? "owner"
                : group.managers.includes(m.email)
                ? "manager"
                : "member",
    }));

    if (!group)
        return {
            notFound: true,
        };

    return {
        props: {
            //@ts-ignore
            user: JSON.stringify(ctx.req.user),
            group: JSON.stringify(group),
            members: JSON.stringify(members),
            //@ts-ignore
            isManager: group.managers.includes(ctx.req.user.email),
            // @ts-ignore
            isOwner: group.owner === ctx.req.user.email,
        },
    };
};
