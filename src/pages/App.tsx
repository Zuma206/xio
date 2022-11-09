import HeaderBar from "../components/HeaderBar";
import Columns from "../components/Columns";

export default () => {
    return (
        <HeaderBar>
            <Columns>
                <div>Servers</div>
                <div>Messages</div>
            </Columns>
        </HeaderBar>
    );
};
