import { getAboutUser } from "@/config/redux/action/authAction";
import { getAllPosts } from "@/config/redux/action/postAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";


export default function Dashboard() {
  const router = useRouter();

  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);




  useEffect(()=>{
    if(authState.isTokenThere){
        dispatch(getAllPosts());
        dispatch(getAboutUser({token:localStorage.getItem("token")}));
    }
    if(!authState.all_profile_fetched){
        dispatch(getAllUsers());
    }
  }, [dispatch, authState.isTokenThere, authState.all_profile_fetched]);



  return (
    <UserLayout>
    
    <DashboardLayout>
        <div>
            <h1>Welcome to the Dashboard</h1>
        </div>
    </DashboardLayout>

    </UserLayout>
  );
}
