import ms from "ms";
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
    isManager: boolean;
}

export default function Event({
    user: stringifiedUser,
    group: stringifiedGroup,
    event: stringifiedEvent,
    isManager,
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
                </div>
                <h3>{event.name}</h3>
                <p>{event.description}</p>
                <p>
                    {event.minDuration
                        ? `Minimum duration is 
                        ${ms(event.minDuration * 60000, {
                            long: true,
                        })}`
                        : `No minimum duration`}
                </p>
                <p>
                    {event.maxDuration
                        ? `Maximum duration is 
                        ${ms(event.maxDuration * 60000, {
                            long: true,
                        })}`
                        : `No maximum duration`}
                </p>
                <p>
                    Lasts from {new Date(event.minDate).toLocaleDateString()} to{" "}
                    {new Date(event.maxDate).getTime()
                        ? new Date(event.maxDate).toLocaleDateString()
                        : " the end of time"}
                </p>
                <div className={styles.buttons}>
                    {!isManager ? (
                        <a
                            href={`/groups/${group._id}/events/${event._id}/edit`}
                            className={profile.edit}
                        >
                            Edit
                        </a>
                    ) : null}
                    <a
                        href={`/groups/${group._id}/events/${event._id}/scheduled`}
                        className={profile.edit}
                    >
                        Scheduled
                    </a>
                    {!isManager ? (
                        <a
                            onClick={async (e) => {
                                e.preventDefault();
                                if (!confirm("Are you sure you want to delete this event?"))
                                    return;
                                await fetch(`/api/events/delete/${event._id}`);
                                window.location.reload();
                            }}
                            className={profile.delete}
                        >
                            Delete
                        </a>
                    ) : null}
                </div>
            </div>
        </Layout>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const group = await groups.findById(ctx.query.group);

    if (!group.events.includes(ctx.query.event))
        return {
            notFound: true,
        };

    const event = await events.findById(ctx.query.event);

    return {
        props: {
            //@ts-ignore
            user: JSON.stringify(ctx.req.user),
            group: JSON.stringify(group),
            event: JSON.stringify(event),
            //@ts-ignore
            isManager: group.managers.includes(ctx.req.user.email),
        },
    };
};
