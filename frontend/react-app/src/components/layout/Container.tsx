import React, { ReactNode } from "react";
import styles from "./Container.module.css";

interface ContainerProps {
  children: ReactNode;
}

function Container({ children }: ContainerProps) {
  return <main className={styles.container}>{children}</main>;
}

export default Container;