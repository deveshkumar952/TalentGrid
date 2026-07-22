import NavBarComponent from '@/Components/Navbar/index.jsx'
import React from 'react'

export default function UserLayout({children}) {
  return (
    <div>
        <NavBarComponent />
        {children}
    </div>
  )
}
