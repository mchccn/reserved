import styles from "../styles/header.module.css";

interface IHeaderProps {
    user: string;
}

export default function Header({ user: stringifiedUser }: IHeaderProps) {
    const user = JSON.parse(stringifiedUser);

    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <div className={styles.logo}>
                    <a href="/">
                        <h2>Reserved✔</h2>
                    </a>
                </div>
            </nav>
            <div className={styles.profile}>
                {user ? (
                    <>
                        <a href="/auth/logout">Log out</a>
                        <a href={`/${user.email}`}>
                            <img src={user.avatar} alt="" />
                        </a>
                    </>
                ) : (
                    <a href="/login">Log in</a>
                )}
            </div>
        </header>
    );
}
