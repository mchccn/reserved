import { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import styles from "../styles/index.module.css";

interface IIndexProps {
    user: string;
}

export default function Index({ user }: IIndexProps) {
    return (
        <Layout user={user}>
            <div className={styles.container}>
                <main className={styles.main}></main>
            </div>
        </Layout>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    return {
        props: {
            //@ts-ignore
            user: ctx.req.user ? JSON.stringify(ctx.req.user) : null,
        },
    };
};
