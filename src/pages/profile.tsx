import { GetServerSideProps } from "next";
import Image from "next/image";
import { useState } from "react";
import Layout from "../components/Layout";
import styles from "../styles/profile.module.css";

interface IEditProfileProps {
    user: string;
}

export default function EditProfile({ user: stringifiedUser }: IEditProfileProps) {
    const user = JSON.parse(stringifiedUser);

    const [desc, setDesc] = useState(user.description);
    const [site, setSite] = useState(user.website);
    const [snap, setSnap] = useState(user.snapchat);
    const [insta, setInsta] = useState(user.instagram);
    const [twitter, setTwitter] = useState(user.twitter);
    const [fb, setFb] = useState(user.facebook);
    const [li, setLi] = useState(user.linkedin);

    return (
        <Layout user={stringifiedUser} title="Profile | Reserved✔">
            <form
                className={styles.form + " " + styles.profile}
                method="POST"
                action="/profile/update"
            >
                <img className={styles.avatar} src={user.avatar} alt="" />
                <p className={styles.username}>{user.username}</p>
                <a href={`mailto:${user.email}`} className={styles.email}>
                    {user.email}
                </a>
                <hr />
                <textarea
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    name="description"
                    placeholder="A short description about you"
                    maxLength={1024}
                ></textarea>
                <input
                    type="text"
                    name="website"
                    value={site}
                    onChange={(e) => setSite(e.target.value)}
                    placeholder="A URL to your personal website"
                    maxLength={128}
                />
                <div className={styles["form-links"]}>
                    <div>
                        <Image src="/images/snapchat.svg" alt="" width="36" height="36" />
                        <input
                            type="text"
                            value={snap}
                            onChange={(e) => setSnap(e.target.value)}
                            name="snapchat"
                            placeholder="Your Snapchat profile URL"
                            maxLength={128}
                        />
                    </div>
                    <div>
                        <Image src="/images/instagram.svg" alt="" width="36" height="36" />
                        <input
                            type="text"
                            value={insta}
                            onChange={(e) => setInsta(e.target.value)}
                            name="instagram"
                            placeholder="Your Instagram profile URL"
                            maxLength={128}
                        />
                    </div>
                    <div>
                        <Image src="/images/twitter.svg" alt="" width="36" height="36" />
                        <input
                            type="text"
                            value={twitter}
                            onChange={(e) => setTwitter(e.target.value)}
                            name="twitter"
                            placeholder="Your Twitter profile URL"
                            maxLength={128}
                        />
                    </div>
                    <div>
                        <Image src="/images/facebook.svg" alt="" width="36" height="36" />
                        <input
                            type="text"
                            value={fb}
                            onChange={(e) => setFb(e.target.value)}
                            name="facebook"
                            placeholder="Your Facebook profile URL"
                            maxLength={128}
                        />
                    </div>
                    <div>
                        <Image src="/images/linkedin.svg" alt="" width="36" height="36" />
                        <input
                            type="text"
                            value={li}
                            onChange={(e) => setLi(e.target.value)}
                            name="linkedin"
                            placeholder="Your LinkedIn profile URL"
                            maxLength={128}
                        />
                    </div>
                    <input type="text" value={user.email} name="email" hidden readOnly />
                </div>
                {desc !== user.description ||
                site !== user.website ||
                snap !== user.snapchat ||
                insta !== user.instagram ||
                twitter !== user.twitter ||
                fb !== user.facebook ||
                li !== user.linkedin ? (
                    <input type="submit" value="Save" className={styles.edit} />
                ) : null}
            </form>
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
