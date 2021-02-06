import { GetServerSideProps } from "next";
import Layout from "../../../../../components/Layout";
import events from "../../../../../server/database/events";
import groups from "../../../../../server/database/groups";
import scheduled from "../../../../../server/database/scheduled";
import viewbox from "../../../../../styles/viewbox.module.css";
import styles from "../../../../styles/groups.module.css";

interface IEventProps {
    user: string;
    group: string;
    event: string;
    scheduled: string;
    isManager: boolean;
}

export default function Scheduled({
    user: stringifiedUser,
    group: stringifiedGroup,
    event: stringifiedEvent,
    scheduled: stringifiedScheduled,
    isManager,
}: IEventProps) {
    const [user, group, event, scheduled] = [
        JSON.parse(stringifiedUser),
        JSON.parse(stringifiedGroup),
        JSON.parse(stringifiedEvent),
        JSON.parse(stringifiedScheduled),
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
            </div>
            {scheduled.length ? (
                <>
                    <h3>Scheduled Events</h3>
                    <div className={viewbox.viewbox}>
                        {scheduled.map((s: any) => (
                            <div className={viewbox.item}>
                                <div>
                                    
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <h3>No scheduled events</h3>
            )}
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

    const scheduledEvents = await scheduled.find({
        event: event._id,
    });

    return {
        props: {
            //@ts-ignore
            user: JSON.stringify(ctx.req.user),
            group: JSON.stringify(group),
            event: JSON.stringify(event),
            scheduled: JSON.stringify(scheduledEvents),
            //@ts-ignore
            isManager: group.managers.includes(ctx.req.user.email),
        },
    };
};
