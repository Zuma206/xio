import { useXIOUser } from "../xio";
import AccountSetup from "./AccountSetup";

export default () => {
    const [user] = useXIOUser();
    return user == "unknown" ? (
        <div>Loading...</div>
    ) : user == "known" ? (
        <>
            <h1>Welcome to XIO</h1>
            <p>To continue, please sign in</p>
        </>
    ) : user.activated == "activated" ? (
        <h1>Welcome, {user.username}</h1>
    ) : user.activated == "unknown" ? (
        <div>Loading...</div>
    ) : (
        <AccountSetup />
    );
};
