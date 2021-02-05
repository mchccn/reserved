import Head from "next/head";

interface ICustomHeadProps {
    title?: string;
}

export default function CustomHead({ title }: ICustomHeadProps) {
    return (
        <Head>
            <meta charSet="utf-8" />
            <meta name="description" content="" />
            <meta name="keywords" content="" />
            <meta name="author" content="" />
            <meta name="copyright" content="" />
            <meta name="robots" content="follow" />
            <meta name="theme-color" content="" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="" />
            <meta property="og:site_name" content="Reserved ✔" />
            <meta property="og:keywords" content="" />
            <meta property="og:locale" content="en-US" />
            <meta property="og:title" content="Reserved ✔" />
            <meta property="og:description" content="" />
            <meta property="og:image" content="" />
            <meta property="twitter:site" content="" />
            <meta property="twitter:site:id" content="" />
            <meta property="twitter:creator" content="" />
            <meta property="twitter:creator:id" content="" />
            <meta property="og:image" content="" />
            <title>{title || "Reserved ✔"}</title>
            <link rel="icon" href="/images/re.png" />
        </Head>
    );
}
