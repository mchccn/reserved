import { GetServerSideProps } from "next";
import Layout from "../../../components/Layout";
import groups from "../../../server/database/groups";
import styles from "../../../styles/groups.module.css";
import viewbox from "../../../styles/viewbox.module.css";

interface IEventsProps {
    user: string;
    group: string;
    events: string;
}
export default function Events({
    user: stringifiedUser,
    group: stringifiedGroup,
    events: stringifiedEvents,
}: IEventsProps) {
    const [user, group] = [JSON.parse(stringifiedUser), JSON.parse(stringifiedGroup)];

    const { events } = group;

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
                <h3>Events</h3>
                <div className={viewbox.viewbox}>
                    {events.map((e: any) => (
                        <div className={viewbox.item}></div>
                    ))}
                </div>
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

    return {
        props: {
            //@ts-ignore
            user: JSON.stringify(ctx.req.user),
            group: JSON.stringify(group),
        },
    };
};
