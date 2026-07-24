import React from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

export default function NavBarComponent() {
  const router = useRouter();

  const authState = useSelector((state) => state.auth);

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <h1 onClick={() => router.push("/")} style={{ cursor: "pointer" }}>
          TalentGrid
        </h1>
        <div className={styles.navBarOptionContainer}>
          {authState.profileFetched && (
            <div style={{ display: "flex", gap:"1.2rem" }}>
              <p>Hey, {authState.user.userId.name}!</p>
              <p style={{fontWeight:"bold",cursor:"pointer"}}>Profile</p>
            </div>
          )}
          {!authState.profileFetched  &&
            <div
              onClick={() => {
                router.push("/login");
              }}
              className={styles.buttonJoin}
            >
              <p>Be a Part</p>
            </div>
          }
        </div>
      </nav>
    </div>
  );
}
