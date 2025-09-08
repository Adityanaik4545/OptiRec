import Header from '@/components/Header'
import VideoCard from '@/components/VideoCard'
import { dummyCards } from '@/constants'
import React from 'react'

const Page = () => {
  return (
    <main className='page wrapper' >
      <Header title='All Videos' subHeader='Public library' />
    <section className='video-grid' >
          {dummyCards.map((card)=>(
        <VideoCard key={card.id} {...card} />
      ))}
    </section>
    </main>
  )
}

export default Page