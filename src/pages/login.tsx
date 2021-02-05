import Image from "next/image";
import CustomHead from "../components/Head";
import styles from "../styles/form.module.css";

export default function Login() {
    return (
        <div className={styles.login}>
            <CustomHead title="Login | Reserved✔" />
            <div className={styles.card}>
                <h3>Take your pick</h3>
                <br />
                <div className={styles.icons}>
                    <a href="/auth/google">
                        <Image
                            src="/images/google.svg"
                            alt=""
                            width="32"
                            height="32"
                            className={styles.img}
                        />
                    </a>
                    <a href="/auth/twitter">
                        <Image
                            src="/images/twitter.svg"
                            alt=""
                            width="32"
                            height="32"
                            className={styles.img}
                        />
                    </a>
                    <a href="/auth/facebook">
                        <Image
                            src="/images/facebook.svg"
                            alt=""
                            width="32"
                            height="32"
                            className={styles.img}
                        />
                    </a>
                    <a href="/auth/linkedin">
                        <Image
                            src="/images/linkedin.svg"
                            alt=""
                            width="32"
                            height="32"
                            className={styles.img}
                        />
                    </a>
                </div>
            </div>
        </div>
    );
}
