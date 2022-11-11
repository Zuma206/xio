import { useState, useEffect } from "react";
import HeaderBar from "../components/HeaderBar";
import Columns from "../components/Columns";
import {
    AuthContext,
    ErrorContext,
    ExtendedError,
    LoadingContext,
    useXIOUser,
    XIOUser,
    UserStatus,
} from "../xio";
import { auth } from "../firebase";
import Error from "../components/Error";
import Loading from "../components/Loading";
import Content from "../components/Content";

export default () => {
    // Create user auth state for auth context
    const authState = useState<XIOUser | UserStatus>("unknown");
    const errorState = useState<ExtendedError | null>(null);
    const loadingState = useState<number>(0);
    const [user] = useXIOUser();

    useEffect(() => {
        // Register listener to keep auth state up to date
        auth.onAuthStateChanged((googleUser) => {
            if (googleUser) {
                authState[1]({
                    googleUser,
                    username: null,
                    gravatar: null,
                    activated: false,
                    fetched: false,
                });
            } else {
                authState[1]("known");
            }
        });
    }, []);

    return (
        <AuthContext.Provider value={authState}>
            <LoadingContext.Provider value={loadingState}>
                <ErrorContext.Provider value={errorState}>
                    <HeaderBar showProfile={true}>
                        <Columns>
                            <div>Servers</div>
                            <div>
                                <Content />
                            </div>
                        </Columns>
                    </HeaderBar>
                    <Error />
                    <Loading />
                </ErrorContext.Provider>
            </LoadingContext.Provider>
        </AuthContext.Provider>
    );
};
