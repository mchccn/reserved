import { GetServerSideProps } from "next";
import Layout from "../../../components/Layout";
import events from "../../../server/database/events";
import groups from "../../../server/database/groups";
import styles from "../../../styles/groups.module.css";
import profile from "../../../styles/profile.module.css";
import viewbox from "../../../styles/viewbox.module.css";
interface IEventsProps {
    user: string;
    group: string;
    events: string;
    isManager: boolean;
}

export default function Events({
    user: stringifiedUser,
    group: stringifiedGroup,
    events: stringifiedEvents,
    isManager,
}: IEventsProps) {
    const [user, group, events] = [
        JSON.parse(stringifiedUser),
        JSON.parse(stringifiedGroup),
        JSON.parse(stringifiedEvents),
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
                </div>
                {events.length ? (
                    <>
                        <h3>Events</h3>
                        <div className={viewbox.viewbox}>
                            {events.map((e: any) => (
                                <a
                                    href={`/groups/${group._id}/events/${e._id}`}
                                    key={Math.random()}
                                >
                                    <div className={viewbox.item}>
                                        <div>
                                            <p
                                                className={viewbox.smaller}
                                                style={{
                                                    marginLeft: "1rem",
                                                }}
                                            >
                                                {e.name}
                                            </p>
                                        </div>
                                        <p className={viewbox.tip}>
                                            lasts from{" "}
                                            {new Date(e.minDate).toLocaleDateString()} to{" "}
                                            {new Date(e.maxDate).getTime()
                                                ? new Date(e.maxDate).toLocaleDateString()
                                                : " the end of time"}
                                        </p>
                                        <p className={viewbox.notice}>
                                            {e.description.length > 64
                                                ? `${e.description.slice(0, 64 - 3)}...`
                                                : e.description}
                                        </p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </>
                ) : (
                    <h3>There are no events</h3>
                )}
                {!isManager ? (
                    <a
                        href={`/groups/${group._id}/events/create`}
                        className={profile.edit}
                        style={{
                            alignSelf: "flex-start",
                        }}
                    >
                        Create one
                    </a>
                ) : null}
            </div>
        </Layout>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const group = await groups.findById(ctx.query.group);

    if (!group)
        return {
            notFound: true,
        };

    const theirEvents = await events.find({
        group: group._id,
    });

    return {
        props: {
            //@ts-ignore
            user: JSON.stringify(ctx.req.user),
            group: JSON.stringify(group),
            events: JSON.stringify(theirEvents),
            //@ts-ignore
            isManager: group.managers.includes(ctx.req.user.email),
        },
    };
};
