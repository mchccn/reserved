import { GetServerSideProps } from "next";
import { useRef, useState } from "react";
import Layout from "../../../components/Layout";
import groups from "../../../server/database/groups";
import styles from "../../../styles/groups.module.css";
import profile from "../../../styles/profile.module.css";

interface IInviteProps {
    user: string;
    group: string;
}

export default function Invite({
    user: stringifiedUser,
    group: stringifiedGroup,
}: IInviteProps) {
    const [user, group] = [JSON.parse(stringifiedUser), JSON.parse(stringifiedGroup)];
    const [tags, setTags] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    function removeTag(i: number) {
        const newTags = [...tags];
        newTags.splice(i, 1);
        setTags(newTags);
    }

    function inputKeyDown(e: any) {
        const val = e.target.value;
        if (e.key === "Enter" && val) {
            if (tags.find((tag) => tag.toLowerCase() === val.toLowerCase())) return;
            setTags([...tags, val]);
            inputRef.current!.value = "";
        } else if (e.key === "Backspace" && !val) {
            removeTag(tags.length - 1);
        }
    }

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
                    {group.website ? <a href={group.website}>{group.website}</a> : null}
                </div>
                <h3>Invite users by email</h3>
                <p>Invites expire in one day and can only be used once.</p>
                <form
                    method="POST"
                    action={`/api/invite/${group._id}`}
                    className={styles.invite}
                    onKeyDown={(e) => (e.key === "Enter" ? e.preventDefault() : null)}
                >
                    <div className="input-tag" onClick={(e) => inputRef.current?.focus()}>
                        <ul className="input-tag__tags">
                            {tags.map((tag, i) => (
                                <li key={Math.random()}>
                                    {tag}
                                    <button type="button" onClick={() => removeTag(i)}>
                                        <span>✕</span>
                                    </button>
                                </li>
                            ))}
                            <li className="input-tag__tags__input">
                                <input
                                    type="text"
                                    onKeyDown={inputKeyDown}
                                    ref={inputRef}
                                    maxLength={320}
                                />
                                <input
                                    type="text"
                                    name="email"
                                    value={tags.join(" ")}
                                    hidden
                                    readOnly
                                />
                            </li>
                        </ul>
                    </div>
                    {tags.length ? (
                        <input type="submit" value="Invite" className={profile.edit} />
                    ) : null}
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
