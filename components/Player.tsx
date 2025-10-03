"use client"
import { initialVideoState } from '@/constants'
import { videos } from '@/drizzle/schema'
import { getVideoProcessingStatus, increamentVideoViews } from '@/lib/actions/video'
import { cn, createIframeLink } from '@/lib/utils'
import React, { useEffect, useRef, useState } from 'react'

const Player = ({videoId, className}:VideoPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [state, setState] = useState(initialVideoState);

  useEffect(()=>{
    const checkProcessingStatus = async() =>{
    const status = await getVideoProcessingStatus(videoId);
    setState((prev)=>({
      ...prev,
      isProcessing: !status.isProcessed,
    }));

    return status.isProcessed;
    };

    checkProcessingStatus();

    const intervalId = setInterval(async() => {
      const isProcessed = await checkProcessingStatus();
      if (isProcessed) {
        clearInterval(intervalId);
      }
    }, 3000);
    return () => {
      clearInterval(intervalId);
    };
  },[videoId])

  useEffect(()=>{
    if(state.isLoaded && !state.hasIncrementedView && !state.isProcessing){
      const increamentView = async() =>{
        try {
          await increamentVideoViews(videoId);
          setState((pre)=>({...pre, hasIncrementedView:true}));
        } catch (error) {
          console.error("Failed to increament view count:",error);
        }
      };
      increamentView();
    }
  },[videoId, state.hasIncrementedView, state.isLoaded, state.isProcessing]);
  return (
    <div className={cn('video-player', className)} >
      {state.isProcessing ?(
        <div>
          <p>Processing video...</p>
        </div>
      ):(
      <iframe
            src={createIframeLink((videoId))}
            loading='lazy'
            title='Video player'
            style={{border:0, zIndex:50}}
            allowFullScreen
            allow='accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture'
            onLoad={()=>setState((prev)=>({...prev, isLoaded:true}))}
      />
      )}
    </div>
  )
}

export default Player
