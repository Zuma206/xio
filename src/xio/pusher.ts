import Pusher from "pusher-js";
import { Dispatch, SetStateAction } from "react";
import { XIOUser } from "./authContext";
import { MessageResult } from "./channelDB";

type options = {
    pusher: Pusher | null;
    setPusher: Dispatch<SetStateAction<Pusher | null>>;
    channelId: string;
    setMessages: Dispatch<SetStateAction<MessageResult[] | null>>;
    user: XIOUser | "known" | "unknown";
    setScrollDirection: Dispatch<SetStateAction<"up" | "down">>;
    isLive: boolean;
};

export const connectPusher = ({
    pusher,
    setPusher,
    channelId,
    setMessages,
    user,
    setScrollDirection,
    isLive,
}: options) => {
    if (!isLive) return;

    if (!pusher) {
        setPusher(
            new Pusher("d2eb302d2ea834126d7a", {
                cluster: "eu",
            })
        );
        return;
    }

    pusher
        .subscribe(channelId)
        .bind("message", (newMessage: MessageResult) => {
            setScrollDirection("down");
            setMessages((messages) => {
                if (!messages) return messages;
                let messageAdded = false;
                messages = messages.map((currentMessage) => {
                    if (newMessage.clientKey === currentMessage.clientKey) {
                        currentMessage.clientSide = false;
                        messageAdded = true;
                    }
                    return currentMessage;
                });
                if (!messageAdded) {
                    messages.push(newMessage);
                }
                return messages;
            });
        })
        .bind("clear", () => {
            setMessages([]);
        })
        .bind("deleted", () => {
            location.reload();
        })
        .bind("kicked", (userId: string) => {
            if (user == "known" || user == "unknown") return;
            if (userId != user.googleUser.uid) return;
            location.reload();
        });

    return () => {
        pusher.unbind_all();
        pusher.unsubscribe(channelId);
    };
};
