import React from 'react'
import Logout from './ui/Logout.jsx'
function Dashboard({setToken}) {
  
  return (
    
    <div className='h-[500px] w-[500px] flex flex-col items-center justify-center bg-dark-background'>
      <h1 className="text-4xl font-bold text-white mb-4">Dashboard</h1>
      <h2 className="text-2xl font-semibold text-white mb-6">You can see your bookmarks here</h2>
      <a 
        href='https://mycache.netlify.app/' 
        target='_blank' 
        rel='noopener noreferrer'
        className='mb-4 text-blue-500 hover:text-blue-600 underline'
      >
        Go to MyCache
      </a>
      <Logout setToken={setToken}/>
    </div>
  )
}

export default Dashboard