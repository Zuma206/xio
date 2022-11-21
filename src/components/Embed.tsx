import { useState } from "react";
import styles from "../styles/Embed.module.scss";

export default ({ src }: { src: string }) => {
    const [display, setDisplay] = useState("none");
    const youtube =
        src.startsWith("https://www.youtube.com/watch?v=") ||
        src.startsWith("http://www.youtube.com/watch?v=") ||
        src.startsWith("https://www.youtu.be/") ||
        src.startsWith("http://www.youtu.be/") ||
        src.startsWith("https://youtube.com/watch?v=") ||
        src.startsWith("http://youtube.com/watch?v=") ||
        src.startsWith("https://youtu.be/") ||
        src.startsWith("http://youtu.be/");
    return (
        <div style={{ display }} className={styles.message}>
            {youtube ? (
                <iframe
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${src.substring(
                        src.length - 11
                    )}`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen={true}
                    onLoad={() => setDisplay("block")}
                    className={styles.video}
                ></iframe>
            ) : (
                <img
                    src={
                        "https://external-content.duckduckgo.com/iu/?u=" +
                        encodeURIComponent(src)
                    }
                    alt=""
                    onLoad={() => setDisplay("block")}
                    className={styles.image}
                />
            )}
        </div>
    );
};
