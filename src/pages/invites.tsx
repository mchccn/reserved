import ms from "ms";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import groups from "../server/database/groups";
import invites from "../server/database/invites";
import styles from "../styles/profile.module.css";
import viewbox from "../styles/viewbox.module.css";

interface IInviteProps {
    user: string;
    invites: string;
}

export default function Invites({
    user: stringifiedUser,
    invites: stringifiedInvites,
}: IInviteProps) {
    const user = JSON.parse(stringifiedUser);
    const invites = JSON.parse(stringifiedInvites);

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
        <Layout user={stringifiedUser} title="Your invites | Reserved✔">
            <div
                className={styles.profile}
                style={{
                    maxWidth: 600,
                }}
            >
                <img className={styles.avatar} src={user.avatar} alt="" />
                <p className={styles.username}>{user.username}</p>
                <a href={`mailto:${user.email}`} className={styles.email}>
                    {user.email}
                </a>
                <hr />
                {invites.length ? (
                    <>
                        <h4 className={viewbox.title}>Your Invites</h4>
                        <div className={viewbox.viewbox}>
                            {invites.map((invite: any) => (
                                <a
                                    href={`/groups/${invite.group._id}/invite/${invite._id}`}
                                    key={Math.random()}
                                >
                                    <div className={viewbox.item}>
                                        <div>
                                            <img
                                                src={invite.group.icon}
                                                alt=""
                                                className={styles.icon}
                                            />
                                            <p>{invite.group.name}</p>
                                        </div>
                                        <p className={viewbox.notice}>
                                            {shiftOrCtrl ? (
                                                <a
                                                    style={{
                                                        color: "var(--clr-red)",
                                                    }}
                                                    onClick={async (e) => {
                                                        e.preventDefault();
                                                        await fetch(
                                                            `/api/decline/${invite._id}`
                                                        );
                                                        window.location.reload();
                                                    }}
                                                >
                                                    decline
                                                </a>
                                            ) : (
                                                <>
                                                    Invitation from{" "}
                                                    <a
                                                        href={`/${invite.inviter}`}
                                                        style={{
                                                            color: "var(--clr-blue)",
                                                        }}
                                                    >
                                                        {invite.inviter}
                                                    </a>
                                                </>
                                            )}
                                        </p>
                                        <p className={viewbox.tip}>
                                            expires in{" "}
                                            {ms(
                                                new Date(
                                                    86400000 -
                                                        (Date.now() -
                                                            new Date(
                                                                invite.createdAt
                                                            ).getTime())
                                                ).getTime(),
                                                {
                                                    long: true,
                                                }
                                            )}
                                        </p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </>
                ) : (
                    <h4 className={viewbox.title}>You don't have any invites</h4>
                )}
            </div>
        </Layout>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const theirInvites = JSON.parse(
        JSON.stringify(
            await invites.find({
                //@ts-ignore
                email: ctx.req.user.email,
            })
        )
    );

    (await Promise.all(theirInvites.map((invite: any) => groups.findById(invite.group)))).map(
        (group, i) => (theirInvites[i].group = group)
    );

    return {
        props: {
            //@ts-ignore
            user: JSON.stringify(ctx.req.user),
            invites: JSON.stringify(theirInvites),
        },
    };
};
