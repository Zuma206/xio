import Pusher from "pusher-js";
import { Dispatch, SetStateAction } from "react";
import { XIOUser } from "./authContext";
import { getPusher, MessageResult } from "./channelDB";

type options = {
    pusher: Pusher | null;
    setPusher: Dispatch<SetStateAction<Pusher | null>>;
    channelId: string;
    setMessages: Dispatch<SetStateAction<MessageResult[] | null>>;
    user: XIOUser | "known" | "unknown";
    setScrollDirection: Dispatch<SetStateAction<"up" | "down">>;
    isLive: boolean;
};

export const connectPusher = async (pusherOptions: options) => {
    const {
        pusher,
        setPusher,
        channelId,
        setMessages,
        user,
        setScrollDirection,
        isLive,
    } = pusherOptions;
    if (!isLive || user == "known" || user == "unknown") return;
    const authToken = await user.googleUser.getIdToken();
    if (!pusher) {
        setPusher(
            new Pusher("d2eb302d2ea834126d7a", {
                cluster: "eu",
                authEndpoint: location.origin + "/api/auth",
                auth: {
                    headers: {
                        authorization: authToken,
                    },
                },
            })
        );
        return;
    }
    const pusherId = await getPusher(channelId, authToken);
    pusher
        .subscribe(`private-${channelId}-${pusherId}`)
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
                return messages.splice(0, 70);
            });
        })
        .bind("clear", () => {
            setMessages([]);
        })
        .bind("deleted", () => {
            location.reload();
        })
        .bind("kicked", (userId: string) => {
            if (userId != user.googleUser.uid) {
                connectPusher(pusherOptions);
            } else {
                location.reload();
            }
        });
};
