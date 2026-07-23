import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import styles from "./style.module.css";
import { registerUser , loginUser } from "@/config/redux/action/authAction";
import {emptyMessage} from "@/config/redux/reducer/authReducer/index.js"

export default function LoginComponent() {
  const authState = useSelector((state) => state.auth);

  const router = useRouter();

  const dispatch = useDispatch();

  const [userLoginMethhod, setUserLoginMethod] = useState(false);

  const [email, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn, router]);

  useEffect(()=>{
    dispatch(emptyMessage());
  },[dispatch, userLoginMethhod])

  useEffect(()=>{
    if(localStorage.getItem("token")){
      router.push("/dashboard");
    }
  },[router])

  const handleRegister = () => {
    console.log("registering...");
    dispatch(registerUser({ username, name, email, password }));
  };

  const handleLogin = () => {
    console.log("login...");
    dispatch(loginUser({ email, password }));
  }

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer_left}>
            <p className={styles.cardleft_heading}>
              {userLoginMethhod ? "Sign In" : "Sign Up"}
            </p>
            <p style={{ color: authState.isError ? "red" : "green" }}>
              {authState.message}
            </p>
            <div className={styles.inputContainer}>
              {!userLoginMethhod && (
                <div className={styles.inputRow}>
                  <input
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.inputField}
                    type="text"
                    placeholder="Username"
                  />
                  <input
                    onChange={(e) => setName(e.target.value)}
                    className={styles.inputField}
                    type="text"
                    placeholder="Name"
                  />
                </div>
              )}
              <input
                onChange={(e) => setEmailAddress(e.target.value)}
                className={styles.inputField}
                type="text"
                placeholder="Email"
              />
              <input
                onChange={(e) => setPassword(e.target.value)}
                className={styles.inputField}
                type="text"
                placeholder="Password"
              />

              <div
                onClick={() => {
                  if (userLoginMethhod) {
                    handleLogin();
                  } else {
                    handleRegister();
                  }
                }}
                className={styles.buttonWithOutline}
              >
                <p>{userLoginMethhod ? "Sign In" : "Sign Up"}</p>
              </div>
            </div>
          </div>
          <div className={styles.cardContainer_right}>
            <div>
              {userLoginMethhod ? (
                <p>Don&apos;t Have an Account?</p>
              ) : (
                <p>Already have an Account?</p>
              )}
              <div
                onClick={() => {
                  setUserLoginMethod(!userLoginMethhod);
                }}
                style={{ color: "black", backgroundColor: "white" }}
                className={styles.buttonWithOutline}
              >
                <p style={{ textAlign: "center" }}>
                  {userLoginMethhod ? "Create Account" : "Sign In"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
