import { Dispatch, RefObject, SetStateAction } from "react";
import styles from "../styles/Embed.module.scss";

interface props {
    src: string;
    setHasLoaded: Dispatch<SetStateAction<boolean>>;
    scroll: boolean;
    scrollDirection: "up" | "down";
    end: RefObject<HTMLDivElement>;
}

const YoutubePlayer = ({
    src,
    setHasLoaded,
    scroll,
    scrollDirection,
    end,
}: props) => {
    const link = `https://youtube.com/embed/${src.substring(
        src.length - 11,
        src.length
    )}`;

    return (
        <iframe
            className={styles.video}
            src={link}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen={true}
            onLoad={() => {
                setHasLoaded(true);
                if (!scroll || scrollDirection != "down" || !end.current)
                    return;
                const endDiv = end.current;
                setTimeout(() => endDiv.scrollIntoView(), 0);
            }}
        ></iframe>
    );
};

export default YoutubePlayer;
