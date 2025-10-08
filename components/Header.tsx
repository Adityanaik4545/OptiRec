"use client"
import { filterOptions, ICONS } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import DropdownList from './DropdownList'
import RecordScreen from './RecordScreen'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { updateURLParams } from '@/lib/utils'
import ImageWithFallback from './ImageWithFallback'

const Header = ({subHeader, title, userImg}:SharedHeaderProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParmas = useSearchParams();

  const [searchQuery, setSearchQuery] =useState(
    searchParmas.get("query") || ""
  );
  const [selectedFilter, setSelectedFilter] =useState(
    searchParmas.get("filter") || "Most Recent"
  );

  useEffect(()=>{
    setSearchQuery(searchParmas.get("query") || "");
    setSelectedFilter(searchParmas.get("filter") || "Most Recent");
  },[searchParmas]);

  useEffect(()=>{
    const debounceTimer = setTimeout(() => {
      if (searchQuery !== searchParmas.get("query")) {
        const url = updateURLParams(
          searchParmas,
          {query: searchQuery || null},
          pathname
        )
        router.push(url);
      }
      
    }, 1000);
    return () => clearTimeout(debounceTimer)
  },[searchQuery,searchParmas,pathname,router])

  const handlleFilterChange = (filter: string) =>{
    setSelectedFilter(filter)
    const url = updateURLParams(
      searchParmas,
      {filter: filter || null},
      pathname
    );
    router.push(url);
  };

  const renderFilterTrigger = () =>(

    <div  className='filter-trigger'>
      <figure>
        <Image src="/assets/icons/hamburger.svg" 
        alt='hamburger' 
        width={14} 
        height={14} 
        />
        <span>{selectedFilter}</span>
      </figure>
      <Image src="/assets/icons/arrow-down.svg" 
      alt='arrow-down' 
      width={20} 
      height={20} 
      />
    </div>
  )

  return (
    <header className='header' >
      <section className='header-container' >
        <div className='details' >
            {userImg && (
                <ImageWithFallback
                src={userImg}
                width={66}
                height={66} 
                alt='user' 
                className='rounded-full' 
               />
            )}

            <article>
                <p>{subHeader}</p>
                <h1>{title}</h1>
            </article>
        </div>
        <aside>
            <Link href="/upload" >
            <Image src="/assets/icons/upload.svg" alt='upload' width={16} height={16} />
            <span>Upload a video</span>
            </Link>
            <RecordScreen/>
        </aside>
      </section>

      <section className='search-filter' >
            <div className='search' >
                <input 
                type="text" 
                placeholder='Search for videos, tags, folders'
                value={searchQuery}
                onChange={(e)=>setSearchQuery(e.target.value)}
                />
                <Image src="/assets/icons/search.svg" 
                width={16} 
                height={16} 
                alt='search'
                />
            </div>
            <DropdownList
            options={filterOptions}
            selectedOption={selectedFilter}
            onOptionSelect={handlleFilterChange}
            triggerElement={renderFilterTrigger()}
            />
      </section>
    </header>
  )
}

export default Header
