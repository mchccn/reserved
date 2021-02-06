import { GetServerSideProps } from "next";
import Layout from "../../../../components/Layout";
import events from "../../../../server/database/events";
import groups from "../../../../server/database/groups";
import styles from "../../../../styles/groups.module.css";
import profile from "../../../../styles/profile.module.css";

interface IEventProps {
    user: string;
    group: string;
    event: string;
}

export default function Event({
    user: stringifiedUser,
    group: stringifiedGroup,
    event: stringifiedEvent,
}: IEventProps) {
    const [user, group, event] = [
        JSON.parse(stringifiedUser),
        JSON.parse(stringifiedGroup),
        JSON.parse(stringifiedEvent),
    ];

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
                    <h3>{event.name}</h3>
                    <p>{event.description}</p>
                    <a
                        onClick={async (e) => {
                            e.preventDefault();
                            await fetch(`/api/events/delete/${event._id}`);
                            window.location.reload();
                        }}
                        className={profile.delete}
                    >
                        Delete
                    </a>
                </div>
            </div>
        </Layout>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const group = await groups.findById(ctx.query.group);
    const event = await events.findById(ctx.query.event);

    return {
        props: {
            //@ts-ignore
            user: JSON.stringify(ctx.req.user),
            group: JSON.stringify(group),
            event: JSON.stringify(event),
        },
    };
};
