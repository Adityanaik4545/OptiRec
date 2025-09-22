import Player from '@/components/Player';
import VideoDetailHeader from '@/components/VideoDetailHeader';
import { getVideoById } from '@/lib/actions/video';
import { redirect } from 'next/navigation';
import React from 'react'

const page = async({params}:Params) => {
  const {videoId} = await params;

  const {user, video} = await getVideoById(videoId);

  if(!video) redirect('/404');

  return (
    <main className='wrapper page' >
      <VideoDetailHeader {...video} userImg={user?.image} username={user?.name} ownerId={video.userId} />
      <section className='video-details' >
          <div className='content' >
           <Player videoId={video.videoId} />
          </div>
      </section>
    </main>
  )
}

export default page
