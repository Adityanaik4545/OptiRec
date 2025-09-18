"use client"
import { authClient } from '@/lib/auth-client';
import Image from 'next/image'
import Link from 'next/link'
import { redirect, useRouter } from 'next/navigation';
import React from 'react'

const user = {};

const Navbar = () => {
  const router = useRouter();
  return (
    <header className='navbar' >
        <nav>
          <Link href="/" >
            <Image src="/assets/icons/logo.svg"
             alt='logo'
             width={36}
             height={36} />
             <h1>OptiRec</h1>
          </Link>
          {user && (
            <figure>
              <button onClick={()=>router.push("/profile/1234")} >
              <Image src="/assets/images/dummy.jpg"
               width={36}
               height={36} 
               alt='user' 
               className='rounded-full aspect-square' />
              </button>

              <button
                onClick={async () => {
                return await authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      redirect("/login");
                    },
                  },
                });
              }}
               className='cursor-pointer' >
              <Image src="/assets/icons/logout.svg" 
              width={24} 
              height={24} 
              alt='logout' 
              className='rotate-180' />
              </button>
            </figure>
          ) }
        </nav>
    </header>
  )
}

export default Navbar
