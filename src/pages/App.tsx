import { useState, useEffect } from "react";
import HeaderBar from "../components/HeaderBar";
import Columns from "../components/Columns";
import { AuthContext, ErrorContext, ExtendedError } from "../xio";
import { User } from "firebase/auth";
import { auth } from "../firebase";
import Error from "../components/Error";

export default () => {
    // Create user auth state for auth context
    const authState = useState<User | null>(null);
    const errorState = useState<ExtendedError | null>(null);

    useEffect(() => {
        // Register listener to keep auth state up to date
        auth.onAuthStateChanged(authState[1]);
    }, []);

    return (
        <AuthContext.Provider value={authState}>
            <ErrorContext.Provider value={errorState}>
                <HeaderBar>
                    <Columns>
                        <div>Servers</div>
                        <div>Messages</div>
                    </Columns>
                </HeaderBar>
                <Error />
            </ErrorContext.Provider>
        </AuthContext.Provider>
    );
};
