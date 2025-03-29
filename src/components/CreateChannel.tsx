import { Dispatch, SetStateAction, useState } from "react";
import { createChannel, useError, useXIOUser, XIOUser } from "../lib";
import styles from "../styles/JoinChannel.module.scss";
import Button from "./Button";
import TextBox from "./TextBox";

type props = {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  fetchChannels: (user: XIOUser) => void;
};

export default function CreateChannel() {
  return (
    <div>
      <form>
        <div className={styles.container}>
          <TextBox type="text" placeholder="Channel Name" maxLength={16} />
          <Button>Create</Button>
        </div>
      </form>
    </div>
  );
}
