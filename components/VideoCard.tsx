import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const VideoCard = ({
    id, 
    title, 
    createdAt, 
    username, 
    userImg, 
    thumbnail, 
    views, 
    visibility, 
    duration
}:VideoCardProps) => {
  return (
    <Link href={`/video/${id}`} className='video-card' >
        <Image src={thumbnail} width={290} height={160} alt='thumbnail' className='thumbnail' />
        <article>
            <div>
                <figure>
                    <Image src={userImg} alt='avatar' width={34} height={34} className='rounded-full aspect-square' />
                    <figcaption>
                        <h3>{username}</h3>
                        <p>{visibility}</p>
                    </figcaption>
                </figure>
                <aside>
                    <Image src="/assets/icons/eye.svg" width={16} height={16} alt='views' />
                    <span>{views}</span>
                </aside>
            </div>
            <h2>{title} - {" "}{createdAt.toLocaleDateString('en-US',{
                year:'numeric',
                month:'short',
                day:'numeric'
            })}</h2>
        </article>
        <button>
            <Image src="/assets/icons/link.svg" width={18} height={18} alt='copy' className='copy-btn' />
        </button>
        {duration && (
            <div className='duration'>
                {Math.ceil(duration/60)}min
            </div>
        )}
    </Link>
  )
}

export default VideoCard
