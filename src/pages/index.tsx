import React, { useState, useContext } from 'react'
import MainLayout from '../layouts/MainLayout'
import SideSection from '../components/SideSection'
import MainSection from '../components/MainSection'
import WriteFormModal from '../components/WriteFormModal'

const HomePage = () => {

  return <>
    <MainLayout>
      <section className='grid grid-cols-12 place-items-center w-full h-full'>
        <MainSection />
        <SideSection />
      </section>
      <WriteFormModal />
    </MainLayout>
  </>
}

export default HomePage

