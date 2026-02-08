import React from 'react'

const Footer = () => {
  return (
    <footer className='bg-gray-900 fixed bottom-0 flex items-center justify-center  text-white px-5  h-16  w-full'>
      <div className='text-center'>Copyright <span className='text-green-200'>&copy;</span> {new Date().getFullYear()} Get me A Chai - All rights reserved. </div>
    </footer>
  )
}

export default Footer
