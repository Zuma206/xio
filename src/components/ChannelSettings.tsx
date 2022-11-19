import styles from "../styles/ChannelSettings.module.scss";

export default ({ channelId }: { channelId: string }) => {
    return (
        <div className={styles.padded}>
            <h1>Settings - {channelId}</h1>
        </div>
    );
};
