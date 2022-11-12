import { useState, useEffect } from "react";
import HeaderBar from "../components/HeaderBar";
import Columns from "../components/Columns";
import {
    AuthContext,
    ErrorContext,
    ExtendedError,
    XIOUser,
    UserStatus,
} from "../xio";
import { auth } from "../firebase";
import Error from "../components/Error";
import Content from "../components/Content";
import Sidebar from "../components/Sidebar";

export default () => {
    // Create user auth state for auth context
    const authState = useState<XIOUser | UserStatus>("unknown");
    const errorState = useState<ExtendedError | null>(null);
    const [selected, setSelected] = useState<null | string>(null);

    useEffect(() => {
        // Register listener to keep auth state up to date
        auth.onAuthStateChanged((googleUser) => {
            if (googleUser) {
                authState[1]({
                    googleUser,
                    username: null,
                    gravatar: null,
                    activated: "unknown",
                });
            } else {
                authState[1]("known");
            }
        });
    }, []);

    return (
        <AuthContext.Provider value={authState}>
            <ErrorContext.Provider value={errorState}>
                <HeaderBar showProfile={true}>
                    <Columns>
                        <Sidebar {...{ setSelected, selected }} />
                        <div>
                            <Content {...{ selected }} />
                        </div>
                    </Columns>
                </HeaderBar>
                <Error />
            </ErrorContext.Provider>
        </AuthContext.Provider>
    );
};
