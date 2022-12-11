import { Dispatch, SetStateAction } from "react";
import styles from "../styles/Embed.module.scss";

interface props {
    src: string;
    setHasLoaded: Dispatch<SetStateAction<boolean>>;
}

const YoutubePlayer = ({ src, setHasLoaded }: props) => {
    const link = `https://youtube.com/embed/${src.substring(
        src.length - 11,
        src.length
    )}`;

    return (
        <iframe
            className={styles.video}
            src={link}
            title="YouTube video player"
            frameBorder={0}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen={true}
            onLoad={() => setHasLoaded(true)}
        ></iframe>
    );
};

export default YoutubePlayer;
