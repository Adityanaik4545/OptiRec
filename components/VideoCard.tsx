"use client"
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

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
    const [copied, setCopied] = useState(false);

    const handleCopy = (e:React.MouseEvent) =>{
        e.stopPropagation();
        e.preventDefault();
        navigator.clipboard.writeText(`${window.location.origin}/video/${id}`);
        setCopied(true);
        setTimeout(() => {
            setCopied(false)
        }, 1000);
    }
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
        <button onClick={handleCopy} >
             <Image src={ copied ? "/assets/images/checked.png" : "/assets/icons/link.svg"} 
                    alt='link' 
                    width={24} 
                    height={24} 
                    className='copy-btn'
                />
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
