import { useState } from "react";
import styles from "../styles/Embed.module.scss";
import { useXIOUser } from "../xio";
import { fetchAPI } from "../xio/api";

export default ({ src }: { src: string }) => {
    const [display, setDisplay] = useState("none");
    const [user] = useXIOUser();

    const youtube =
        src.startsWith("https://www.youtube.com/watch?v=") ||
        src.startsWith("http://www.youtube.com/watch?v=") ||
        src.startsWith("https://www.youtu.be/") ||
        src.startsWith("http://www.youtu.be/") ||
        src.startsWith("https://youtube.com/watch?v=") ||
        src.startsWith("http://youtube.com/watch?v=") ||
        src.startsWith("https://youtu.be/") ||
        src.startsWith("http://youtu.be/");

    const safeSrc =
        "https://external-content.duckduckgo.com/iu/?u=" +
        encodeURIComponent(src);
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
                    src={safeSrc}
                    alt=""
                    onLoad={async () => {
                        if (user == "known" || user == "unknown") return;
                        const authToken = await user.googleUser.getIdToken();
                        const { result } = await fetchAPI(
                            "api/image",
                            authToken,
                            { url: safeSrc }
                        );
                        if (result) {
                            setDisplay("block");
                        }
                    }}
                    className={styles.image}
                />
            )}
        </div>
    );
};
