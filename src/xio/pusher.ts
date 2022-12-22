import Pusher from "pusher-js";
import { Dispatch, SetStateAction } from "react";
import { XIOUser } from "./authContext";
import { getPusher, MessageResult } from "./channelDB";
import { ExtendedError } from "./errorContext";

type options = {
    pusher: Pusher | null;
    setPusher: Dispatch<SetStateAction<Pusher | null>>;
    channelId: string;
    setMessages: Dispatch<SetStateAction<MessageResult[] | null>>;
    user: XIOUser | "known" | "unknown";
    setDirection: Dispatch<SetStateAction<"up" | "down">>;
    isLive: boolean;
    setIsConnected: Dispatch<SetStateAction<boolean>>;
    displayError: (err: ExtendedError) => void;
};

export const connectPusher = async (pusherOptions: options) => {
    const {
        pusher,
        setPusher,
        channelId,
        setMessages,
        user,
        setDirection: setScrollDirection,
        isLive,
        setIsConnected,
        displayError,
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
    pusher.connection.bind("connected", () => setIsConnected(true));
    pusher.connection.bind("error", () => {
        displayError({
            name: "Connection Error",
            message:
                "Connection was lost, if connecting takes too long, try refreshing",
            code: "Connection was lost, if connecting takes too long, try refreshing",
        });
        setIsConnected(false);
        connectPusher(pusherOptions);
    });
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
                return messages.slice(messages.length - 70);
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
