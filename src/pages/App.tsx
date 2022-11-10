import { useState } from "react";
import HeaderBar from "../components/HeaderBar";
import Columns from "../components/Columns";
import { AuthContext } from "../xio";
import { User } from "firebase/auth";

export default () => {
    // Create user auth state for auth context
    const authState = useState<User | null>(null);

    return (
        <AuthContext.Provider value={authState}>
            <HeaderBar>
                <Columns>
                    <div>Servers</div>
                    <div>Messages</div>
                </Columns>
            </HeaderBar>
        </AuthContext.Provider>
    );
};
