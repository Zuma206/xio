import styles from "../styles/JoinScreen.module.scss";
import {
  ChannelResult,
  getChannelDetails,
  joinChannel,
  useError,
  useXIOUser,
  XIOUser,
} from "../xio";
import { useNavigate, useParams } from "react-router-dom";
import { PropsWithChildren, useEffect, useState } from "react";
import Spinner from "./Spinner";
import Button from "./Button";

export default () => {
  const [user] = useXIOUser();
  const navigate = useNavigate();
  const { id } = useParams();
  type channelStatus = ChannelResult | "known" | null;
  const [channelData, setChannelData] = useState<channelStatus>(null);
  const [loading, setLoading] = useState(false);
  const [displayError] = useError("Uh oh!");

  async function fetchDetails(user: XIOUser) {
    const authToken = await user.googleUser.getIdToken();
    const channelDetails = await getChannelDetails(id ?? "", authToken);
    setChannelData(channelDetails ?? "known");
  }

  useEffect(() => {
    if (user == "known" || user == "unknown" || channelData) return;
    fetchDetails(user);
  }, [user]);

  const ReturnHome = ({ children }: PropsWithChildren) => {
    return (
      <div>
        <h2>{children}</h2>
        <Button onClick={() => navigate("/")}>Return Home</Button>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {loading || user == "unknown" ? (
        <Spinner />
      ) : user == "known" ? (
        <ReturnHome>Please sign-in to view</ReturnHome>
      ) : !channelData ? (
        <Spinner />
      ) : channelData == "known" ? (
        <ReturnHome>Invalid invite</ReturnHome>
      ) : channelData.members.includes(user.googleUser.uid) ? (
        <ReturnHome>You are already in this channel</ReturnHome>
      ) : (
        <div>
          <h2>You have been invited to</h2>
          <h1>{channelData.name}</h1>
          <h2>Join code: {channelData.key}</h2>
          <Button
            onClick={async () => {
              setLoading(true);
              const authToken = await user.googleUser.getIdToken();
              const success = await joinChannel(channelData.key, authToken);
              if (success) {
                navigate("/");
              } else {
                displayError({
                  name: "Error joining channel",
                  message: "",
                  code: "Couldn't join channel",
                });
              }
            }}
          >
            Accept Invite
          </Button>
          <Button onClick={() => navigate("/")}>Return Home</Button>
        </div>
      )}
    </div>
  );
};
