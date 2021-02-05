import { GetServerSideProps } from "next";
import { useState } from "react";
import Layout from "../../components/Layout";
import styles from "../../styles/groups.module.css";
import profileStyles from "../../styles/profile.module.css";

interface ICreateGroupProps {
    user: string;
}

export default function CreateGroup({ user: stringifiedUser }: ICreateGroupProps) {
    const user = JSON.parse(stringifiedUser);

    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [site, setSite] = useState("");
    const [icon, setIcon] = useState("");

    return (
        <Layout user={stringifiedUser}>
            <div className={styles.container}>
                <form method="POST" action="/api/create" className={styles.form}>
                    <h2>Create a new group</h2>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        maxLength={128}
                        name="name"
                        required
                        placeholder="Your group's name"
                    />
                    <textarea
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        name="description"
                        placeholder="A short description about your group"
                        maxLength={512}
                    ></textarea>
                    <input
                        value={site}
                        onChange={(e) => setSite(e.target.value)}
                        type="text"
                        maxLength={128}
                        name="website"
                        placeholder="A URL to your group's webpage"
                    />
                    <input
                        value={icon}
                        onChange={(e) => setIcon(e.target.value)}
                        type="text"
                        maxLength={256}
                        name="icon"
                        placeholder="A URL to your group's icon"
                    />
                    <input type="submit" value="Create" className={profileStyles.edit} />
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
