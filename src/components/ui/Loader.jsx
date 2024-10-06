import React from 'react'

function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-dark-background bg-opacity-50 z-50">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-dark-surface"></div>
    </div>
  )
}

export default Loader