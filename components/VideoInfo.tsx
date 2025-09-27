"use client"
import { infos } from '@/constants'
import { cn, parseTranscript } from '@/lib/utils'
import React, { useState } from 'react'
import EmptyState from './EmptyState'

const VideoInfo = ({transcript, title, createdAt, description, videoId, videoUrl}:VideoInfoProps) => {

    const [info, setInfo] = useState("transcript");
    const parsedTranscript = parseTranscript(transcript || "");

    const renderTranscript = () =>(
        <ul className='transcript' >
            {parsedTranscript.length > 0 ? (
                parsedTranscript.map((item, index)=>(
                    <li key={index} >
                        <h2>{item.time}</h2>
                        <p>{item.text}</p>
                    </li>
                ))

            ):(
                <EmptyState icon="/assets/icons/copy.svg"
                 title="No transcript available"
                 description="this video does not include any transcribed video"/>
            )}
        </ul>
    )

    const metaDatas = [
        {
            label: "video title",
            value: `${title} - ${new Date(createdAt).toLocaleDateString("en-US",{
                year: "numeric",
                month: "short",
                day: "numeric"
            })}`
        },
        {
            label: "Video description",
            value: description
        },
        {
            label: "Video id",
            value: videoId
        },
        {
            label: "Video url",
            value: videoUrl
        },
    ];

    const renderMetadata = () =>(
        <div className='metadata' >
            {metaDatas.map(({label, value}, index)=>(
                <article key={index} >
                    <h2>{label}</h2>
                    <p className={cn({
                        "text-pink-100 truncate": label === "Video url",
                    })} 
                    >
                        {value}
                    </p>
                </article>
            ))}
        </div>
    );

  return (
    <section className='video-info' >
        <nav>
            {infos.map((item)=>(
                <button
                key={item}
                className={cn({
                    "text-pink-100 border-b-2 border-pink-100": info === item
                })}
                onClick={()=>setInfo(item)}
                >
                    {item}
                </button>
            ))}
        </nav>
        {info === "transcript" ? renderTranscript() : renderMetadata()}
    </section>
  )
}

export default VideoInfo
