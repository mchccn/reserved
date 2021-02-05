import { GetServerSideProps } from "next";
import Layout from "../../../../components/Layout";
import groups from "../../../../server/database/groups";
import styles from "../../../../styles/groups.module.css";
import profile from "../../../../styles/profile.module.css";

interface IEventsProps {
    user: string;
    group: string;
}

export default function CreateEvent({
    user: stringifiedUser,
    group: stringifiedGroup,
}: IEventsProps) {
    const [user, group] = [JSON.parse(stringifiedUser), JSON.parse(stringifiedGroup)];

    return (
        <Layout user={stringifiedUser}>
            <div className={styles.container}>
                <form
                    method="POST"
                    action={`/api/events/${group._id}/create`}
                    className={styles.form}
                >
                    <h2>Create a new event</h2>
                    <input type="text" name="name" placeholder="Name of the event" />
                    <textarea
                        name="description"
                        placeholder="Description of the event"
                    ></textarea>
                    <input type="submit" value="Create" className={profile.edit} />
                </form>
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
