import { useEffect, useRef, useState } from "react";
import { MessageResult } from "./channelDB";

export type ScrollDirection = "up" | "down";

interface Params {
    channelId: string | null;
    settings: boolean;
    messages: MessageResult[] | null;
}

export const useAutoScroll = ({ channelId, settings, messages }: Params) => {
    const [scroll, setScroll] = useState(true);
    const [direction, setDirection] = useState<ScrollDirection>("down");
    const end = useRef<HTMLDivElement>(null);
    const start = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setScroll(true);
    }, [channelId]);

    useEffect(() => {
        if (settings || !end.current) return;
        end.current.scrollIntoView();
    }, [settings]);

    useEffect(() => {
        if (direction == "down" && end.current && scroll) {
            end.current.scrollIntoView();
        } else if (direction == "up" && start.current) {
            start.current.scrollIntoView();
        }
    }, [messages]);

    return { setScroll, setDirection, start, end, scroll, direction };
};
