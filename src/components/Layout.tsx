import { ReactNode } from "react";
import CustomHead from "./Head";
import Header from "./Header";

interface ILayoutProps {
    children?: ReactNode;
    user: string;
    title?: string;
}

function Layout({ children, user, title }: ILayoutProps) {
    return (
        <div className="app">
            <CustomHead title={title} />
            <Header user={user} />
            <div className="content">{children}</div>
        </div>
    );
}

export default Layout;
