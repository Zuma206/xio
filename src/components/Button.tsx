import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  PropsWithChildren,
} from "react";
import styles from "../styles/Button.module.scss";

type Props = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> &
  PropsWithChildren & { danger?: boolean };

export default function Button({ danger, children, ...props }: Props) {
  return (
    <button {...props} className={danger ? styles.danger : styles.button}>
      {children}
    </button>
  );
}
