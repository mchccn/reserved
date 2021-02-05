import { GetServerSideProps } from "next";
import Image from "next/image";
import Layout from "../components/Layout";
import users from "../server/database/user";
import styles from "../styles/profile.module.css";

interface IProfileProps {
    them: string;
    user: string;
    isTheirs: boolean;
}

export default function Profile({
    user: stringifiedUser,
    them: stringifiedThem,
    isTheirs,
}: IProfileProps) {
    const user = JSON.parse(stringifiedUser);

    return (
        <Layout user={stringifiedThem}>
            <div className={styles.profile}>
                <img className={styles.avatar} src={user.avatar} alt="" />
                <p className={styles.username}>{user.username}</p>
                <a href={`mailto:${user.email}`} className={styles.email}>
                    {user.email}
                </a>
                {user.description ||
                user.website ||
                user.snapchat ||
                user.instagram ||
                user.twitter ||
                user.facebook ||
                user.linkedin ? (
                    <hr />
                ) : null}
                {user.description ? <p>{user.description}</p> : null}
                {user.website ? (
                    <a href={user.website} className={styles.website}>
                        {user.website}
                    </a>
                ) : null}
                <div className={styles.links}>
                    {user.snapchat ? (
                        <a href={user.snapchat}>
                            <Image src="/images/snapchat.svg" alt="" width="48" height="48" />
                        </a>
                    ) : null}
                    {user.instagram ? (
                        <a href={user.instagram}>
                            <Image src="/images/instagram.svg" alt="" width="48" height="48" />
                        </a>
                    ) : null}
                    {user.twitter ? (
                        <a href={user.twitter}>
                            <Image src="/images/twitter.svg" alt="" width="48" height="48" />
                        </a>
                    ) : null}
                    {user.facebook ? (
                        <a href={user.facebook}>
                            <Image src="/images/facebook.svg" alt="" width="48" height="48" />
                        </a>
                    ) : null}
                    {user.linkedin ? (
                        <a href={user.linkedin}>
                            <Image src="/images/linkedin.svg" alt="" width="48" height="48" />
                        </a>
                    ) : null}
                </div>
                {isTheirs ? (
                    <div className={styles.buttons}>
                        <a href="/profile" className={styles.edit}>
                            Edit Profile
                        </a>
                        <a href="/groups" className={styles.edit}>
                            My Groups
                        </a>
                        <a href="/invites" className={styles.edit}>
                            My Invites
                        </a>
                        <a href="/account" className={styles.edit}>
                            My Account
                        </a>
                    </div>
                ) : null}
            </div>
        </Layout>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const user = await users.findOne({
        email: ctx.query.profile,
    });

    if (!user)
        return {
            notFound: true,
        };

    return {
        props: {
            //@ts-ignore
            isTheirs: ctx.req.user ? user.email === ctx.req.user.email : false,
            user: JSON.stringify(user),
            //@ts-ignore
            them: ctx.req.user ? JSON.stringify(ctx.req.user) : null,
        },
    };
};
