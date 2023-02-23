import styles from "../styles/HeaderBar.module.scss";
import logo from "../assets/new.svg";
import UserProfile from "./UserProfile";

interface props extends React.PropsWithChildren {
  showProfile?: boolean;
}

export default ({ children, showProfile }: props) => {
  const renderProfile = showProfile ?? false;

  return (
    <div className={styles.container}>
      <div className={styles.headerBar}>
        <div>
          <img src={logo} alt="XIO" className={styles.logo} />
        </div>
        <div></div>
        <div>{renderProfile ? <UserProfile /> : null}</div>
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};
