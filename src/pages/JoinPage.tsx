import { useEffect, useState } from "react";
import HeaderBar from "../components/HeaderBar";
import JoinScreen from "../components/JoinScreen";
import { auth } from "../firebase";
import { AuthContext, UserStatus, XIOUser } from "../xio";

export default () => {
    const authState = useState<XIOUser | UserStatus>("unknown");

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
            <HeaderBar showProfile={true}>
                <JoinScreen />
            </HeaderBar>
        </AuthContext.Provider>
    );
};
