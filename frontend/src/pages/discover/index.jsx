import { getAllUsers } from '@/config/redux/action/authAction'
import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default function DiscoverPage() {

  const authState = useSelector((state)=>state.auth)

  const dispatch = useDispatch()

  useEffect(()=>{
    if(!authState.all_profile_fetched){
      dispatch(getAllUsers());
    }
  },[dispatch,authState.all_profile_fetched])
  return (
    <UserLayout>
        <DashboardLayout>
            <div>
                <h1>Discover Page</h1>
            </div>
        </DashboardLayout>
    </UserLayout>
  )
}
