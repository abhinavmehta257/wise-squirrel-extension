import React from 'react'
import Logout from './ui/Logout.jsx'
function Dashboard({setToken}) {
  
  return (
    <div className='h-[500px] w-[500px] flex items-center justify-center bg-dark-background'>
        Dashboard
        <Logout setToken={setToken}/>
    </div>
  )
}

export default Dashboard