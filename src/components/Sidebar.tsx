import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "../styles/Sidebar.module.scss";
import { getUserChannels, useXIOUser, ChannelResult, XIOUser } from "../xio";
import CreateChannel from "./CreateChannel";
import JoinChannel from "./JoinChannel";
import sortByProperty, { SortDirections } from "property-sort";
import Spinner from "./Spinner";
import Button from "./Button";
import ChannelBadge from "./ChannelBadge";

interface props {
  setSelected: Dispatch<SetStateAction<ChannelResult | null>>;
  selected: ChannelResult | null;
}

export default ({ setSelected, selected }: props) => {
  const [user] = useXIOUser();
  const [channels, setChannels] = useState<ChannelResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const storedShowConfig = JSON.parse(
    localStorage.getItem("showConfig") ?? "true"
  );
  const [showConfig, setShowConfig] = useState<boolean>(storedShowConfig);

  const fetchChannels = async (userData: XIOUser) => {
    const channelsData = await getUserChannels(
      await userData.googleUser.getIdToken()
    );
    setChannels(
      sortByProperty(channelsData, {
        sortKey: ["name"],
        direction: SortDirections.Ascending,
      })
    );
    setLoading(false);
  };

  useEffect(() => {
    if (user == "known" || user == "unknown" || user.activated != "activated")
      return;
    setLoading(true);
    fetchChannels(user);
  }, [user]);

  useEffect(() => {
    localStorage.setItem("showConfig", JSON.stringify(showConfig));
  }, [showConfig]);

  useEffect(() => {
    if (selected) {
      document.title = selected.name;
    } else {
      document.title = "XIO";
    }
  }, [selected]);

  return user == "unknown" ? (
    <Spinner />
  ) : user == "known" ? (
    <div className={styles.padded}>
      Nothing to see here yet, try signing in.
    </div>
  ) : user.activated == "activated" ? (
    <div className={styles.sidebar}>
      <div>
        <Button onClick={() => setShowConfig((s) => !s)}>
          {showConfig ? "▼" : "▶"}
        </Button>
      </div>

      <div className={showConfig ? styles.box : styles.hiddenBox}>
        <JoinChannel
          loading={loading}
          setLoading={setLoading}
          fetchChannels={fetchChannels}
        />
        <CreateChannel
          loading={loading}
          setLoading={setLoading}
          fetchChannels={fetchChannels}
        />
      </div>

      <div className={styles.channels}>
        {channels && !loading ? (
          channels.map((channel, index) => {
            const isSelected = channel.key == selected?.key;
            return (
              <ChannelBadge
                index={index}
                isSelected={isSelected}
                setSelected={setSelected}
                channel={channel}
                key={channel.key}
              />
            );
          })
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  ) : null;
};
