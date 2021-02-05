import { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import groups from "../server/database/groups";
import profileStyles from "../styles/profile.module.css";
import styles from "../styles/viewbox.module.css";

interface IGroupsProps {
    user: string;
    groups: string;
}

export default function Groups({
    user: stringifiedUser,
    groups: stringifiedGroups,
}: IGroupsProps) {
    const [user, groups] = [JSON.parse(stringifiedUser), JSON.parse(stringifiedGroups)];

    return (
        <Layout user={stringifiedUser} title="Your groups | Reserved✔">
            <div className={profileStyles.profile}>
                <img className={profileStyles.avatar} src={user.avatar} alt="" />
                <p className={profileStyles.username}>{user.username}</p>
                <a href={`mailto:${user.email}`} className={profileStyles.email}>
                    {user.email}
                </a>
                {groups.length ? (
                    <>
                        <h4 className={styles.title}>Your Groups</h4>
                        <div className={styles.viewbox}>
                            {groups.map((g: any) => (
                                <a href={`/groups/${g._id}`} key={Math.random()}>
                                    <div className={styles.item}>
                                        <div>
                                            <img src={g.icon} alt="" className={styles.icon} />
                                            <p>{g.name}</p>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </>
                ) : (
                    <h4 className={styles.title}>You aren't in any groups.</h4>
                )}
                <a href="/groups/create" className={profileStyles.edit}>
                    Create one
                </a>
            </div>
        </Layout>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const theirGroups =
        //@ts-ignore
        (await Promise.all(ctx.req.user.groups.map((g) => groups.findById(g)))).filter(
            ($) => !!$
        );

    return {
        props: {
            //@ts-ignore
            user: JSON.stringify(ctx.req.user),
            groups: JSON.stringify(theirGroups),
        },
    };
};
