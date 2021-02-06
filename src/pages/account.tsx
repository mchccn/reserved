import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import styles from "../styles/profile.module.css";

interface IAccountProps {
    user: string;
}

export default function Account({ user: stringifiedUser }: IAccountProps) {
    const user = JSON.parse(stringifiedUser);

    const [name, setName] = useState(user.username);
    const [email, setEmail] = useState(user.email);

    useEffect(() => {
        const url = new URL(window.location.href);
        if (url.search.includes("taken")) {
            alert("That email was already registered.");
            window.location.href = window.location.href.slice(
                0,
                window.location.href.length - url.search.length
            );
        }
    }, []);

    return (
        <Layout user={stringifiedUser} title="Your account | Reserved✔">
            <div className={styles.profile}>
                <img className={styles.avatar} src={user.avatar} alt="" />
                <p>Account details</p>
                <form
                    method="POST"
                    action="/profile/username"
                    className={styles["update-username"]}
                >
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        name="username"
                        maxLength={32}
                        minLength={2}
                    />
                    {name !== user.username && name.length > 1 ? (
                        <input type="submit" value="Update" className={styles.update} />
                    ) : null}
                    <input type="text" value={user.email} name="email" hidden readOnly />
                </form>
                <form method="POST" action="/profile/email" className={styles["update-email"]}>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        name="newEmail"
                        maxLength={320}
                        minLength={3}
                    />
                    {email !== user.email &&
                    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
                        email
                    ) ? (
                        <input type="submit" value="Update" className={styles.update} />
                    ) : null}
                    <input type="text" value={user.email} name="email" hidden readOnly />
                </form>
                <form
                    method="POST"
                    action="/profile/delete"
                    onSubmit={(e) => {
                        if (!confirm("Are you sure you want to delete your account?"))
                            e.preventDefault();
                    }}
                >
                    <input type="submit" value="Delete account" className={styles.delete} />
                    <input type="text" value={user.email} name="email" hidden readOnly />
                </form>
            </div>
        </Layout>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    return {
        props: {
            //@ts-ignore
            user: JSON.stringify(ctx.req.user),
        },
    };
};
