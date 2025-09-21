import { videos } from '@/drizzle/schema'
import { createIframeLink } from '@/lib/utils'
import React from 'react'

const Player = ({videoId}:VideoPlayerProps) => {
  return (
    <div className='video-player' >
      <iframe
            src={createIframeLink((videoId))}
            loading='lazy'
            title='Video player'
            style={{border:0, zIndex:50}}
            allowFullScreen
            allow='accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture'
      />
    </div>
  )
}

export default Player
