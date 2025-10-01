"use client";
import { daysAgo } from '@/lib/utils';
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import DropdownList from './DropdownList';
import { deleteVideo } from '@/lib/actions/video';
import { authClient } from '@/lib/auth-client';

const VideoDetailHeader = ({title, createdAt, userImg, username, videoId, ownerId, visibility, thumbnailUrl}:VideoDetailHeaderProps) => {
    const router = useRouter();
    const [copied, setCopied] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const {data:session} = authClient.useSession();
    const userId = session?.user.id;
    const isOwner = userId === ownerId;

    const handleCopyLink = () =>{
        navigator.clipboard.writeText(`${window.location.origin}/video/${videoId}`);
        setCopied(true);
    }

    const handleDelete = async() =>{
        try {   
                setIsDeleting(true)
                await deleteVideo(videoId, thumbnailUrl);
                router.push('/')
        } catch (error) {
            console.log("Error deleting video", error);
        } finally {
            setIsDeleting(false);
        }
    }

    useEffect(()=>{
        const changeChecked = setTimeout(() => {
            if(copied) setCopied(false)
        }, 1000);
        
        return ()=> clearTimeout(changeChecked)
    },[copied])
  return (
    <header className='detail-header' >
        <aside className='user-info' >
            <h1>{title}</h1>
            <figure>
                <button onClick={()=>router.push(`/profile/${ownerId}`)} >
                    <Image src={userImg || ''} alt='user' width={24} height={24} className='rounded-full' />
                    <h2>{username ?? 'Guest'}</h2>
                </button>
                <figcaption>
                    <span>•</span>
                    <p>{daysAgo(createdAt)}</p>
                </figcaption>
            </figure>
        </aside>
        <aside className='cta' >
            <button onClick={handleCopyLink} >
                <Image src={ copied ? "/assets/images/checked.png" : "/assets/icons/link.svg"} 
                alt='link' 
                width={24} 
                height={24} 
                />
            </button>
            {isOwner && (
            <div className='user-btn' >
                <button 
                    className='delete-btn'
                    onClick={handleDelete}
                    disabled={isDeleting}
                 >
                    {isDeleting ? "Deleting..." : "Delete video"}
                </button>
                <div className='bar' />
                {isUpdating ? (
                    <div className='update-stats' >
                        <p>Updating</p>
                    </div>
                ):(
                    <DropdownList/>
                )}
            </div>
            )}
        </aside>
    </header>
  )
}

export default VideoDetailHeader
