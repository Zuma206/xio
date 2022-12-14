import styles from "../styles/404.module.scss";

export default () => {
    return (
        <div className={styles.padded}>
            <h3>Made by:</h3>
            <ul>
                <li>Developer: Zuma</li>
                <li>Designers: Monkey, Zuma</li>
                <li>Quality Assurance: Neon, Fly, Monkey</li>
            </ul>
            <h3>Made with:</h3>
            <ul>
                <li>Typescript 💖</li>
                <li>Frontend: React, Vite, Netlify</li>
                <li>Backend: Express, Deta</li>
                <li>Database: Deta Base</li>
                <li>Firebase</li>
                <li>Gravatar</li>
            </ul>
        </div>
    );
};
