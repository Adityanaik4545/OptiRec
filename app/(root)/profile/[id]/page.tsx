import Header from '@/components/Header';
import React from 'react'

const page = async({params}:ParamsWithSearch) => {
    const {id} = await params;
  return (
    <div className='wrapper page' >
    <Header subHeader='naikaditya215@gmail.com' title='Aditya naik' userImg="/assets/images/dummy.jpg" />
    <h1 className='font-karla text-2xl'  >User id is {id}</h1>
    </div>
  )
}

export default page
