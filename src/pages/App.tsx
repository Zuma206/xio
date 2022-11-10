import { useState } from "react";
import HeaderBar from "../components/HeaderBar";
import Columns from "../components/Columns";
import { AuthContext } from "../api";
import { User } from "firebase/auth";

export default () => {
    const authState = useState<null | User>(null);

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
