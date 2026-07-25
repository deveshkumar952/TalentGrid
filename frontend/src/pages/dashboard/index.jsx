import { getAboutUser, getAllUsers } from "@/config/redux/action/authAction";
import { createPost, getAllPosts } from "@/config/redux/action/postAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.css";
import { BASE_URL } from "@/config";
import { setTokenIsThere } from "@/config/redux/reducer/authReducer/index.js";

export default function Dashboard() {
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);

  const [postContent,setPostContent] = useState("");
  
  const [fileContent, setFileContent] = useState(null);

  const postsState = useSelector((state) => state.post);

  const handleUpload = async() => {
    await dispatch(createPost({ file: fileContent, body: postContent }));
    setPostContent("");
    setFileContent(null);
  }

  // Check token when dashboard loads
  useEffect(() => {
    const token = localStorage.getItem("token");

    console.log("TOKEN:", token);

    if (token) {
      console.log("Dispatching setTokenIsThere");

      dispatch(setTokenIsThere());
    }
  }, [dispatch]);

  // Fetch dashboard data after token is available
  useEffect(() => {
    if (!authState.isTokenThere) return;

    const token = localStorage.getItem("token");

    dispatch(getAllPosts());

    if (!authState.profileFetched) {
      dispatch(getAboutUser({ token }));
    }

    if (!authState.all_profile_fetched) {
      dispatch(getAllUsers());
    }
  }, [
    dispatch,
    authState.isTokenThere,
    authState.profileFetched,
    authState.all_profile_fetched,
  ]);

  return (
    <UserLayout>
      <DashboardLayout>
        <div>
          <div className={styles.scrollComponent}>
            <div className={styles.createPostContainer}>
              {authState.user?.userId?.profilePicture ? (
                <img
                  className={styles.userProfile}
                  style={{ height: "100px" }}
                  src={`${BASE_URL}/uploads/${authState.user.userId.profilePicture}`}
                />
              ) : (
                <p>Loading profile...</p>
              )}
              <textarea onChange={(e)=>setPostContent(e.target.value)}
                name="postContent"
                placeholder="What do you want to talk about?"
                id=""
              ></textarea>
              <label htmlFor="fileUpload">
                <div className={styles.fab}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </div>
              </label>
              <input onChange={(e) => setFileContent(e.target.files[0])} type="file" hidden id="fileUpload" />
              {postContent && (
                <div onClick={handleUpload} className={styles.uploadButton}>Post</div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
