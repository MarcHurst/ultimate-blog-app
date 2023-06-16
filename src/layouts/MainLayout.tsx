import React from 'react'
import Header from '../components/Header'

const MainLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className='flex flex-col w-full h-full'>
      <Header />
      {children}
    </div>
  )
}

export default MainLayout

