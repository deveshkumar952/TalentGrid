import DashboardLayout from '@/layout/DashboardLayout'
import React from 'react'
import UserLayout from '@/layout/UserLayout'


export default function MyConnectionPage() {
  return (
    <UserLayout>
            <DashboardLayout>
                <div>
                    <h1>My Connections Page</h1>
                </div>
            </DashboardLayout>
        </UserLayout>
  )
}
