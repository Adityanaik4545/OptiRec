"use server"

import { headers } from "next/headers";
import { auth } from "../auth";
import { apiFetch, doesTitleMatch, getEnv, getOrderByClause, withErrorHandling } from "../utils"
import { BUNNY } from "@/constants";
import { db } from "@/drizzle/db";
import { user, videos } from "@/drizzle/schema";
import { revalidatePath } from "next/cache";
import aj from "../arcjet";
import { fixedWindow, request } from "@arcjet/next";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { number } from "better-auth";

const VIDEO_STREAM_BASE_URL = BUNNY.STREAM_BASE_URL;
const THUMBNAIL_STORAGE_BASE_URL = BUNNY.STORAGE_BASE_URL;
const THUMBNAIL_CDN_URL = BUNNY.CDN_URL;
const BUNNY_LIBRARY_ID = getEnv("BUNNY_LIBRARY_ID");
const ACCESS_KEYS = {
    streamAcessKey: getEnv("BUNNY_STREAM_ACCESS_KEY"),
    storageAcessKey: getEnv("BUNNY_STORAGE_ACCESS_KEY")
}

// helper function
const getSessionUserId = async ():Promise<string> =>{
    const session = await auth.api.getSession({headers: await headers()});

    if(!session) throw new Error('Unauthenticated');

    return session.user.id;
}

const revalidatePaths = (paths:string[]) =>{
    paths.forEach((path)=> revalidatePath(path))
}

const validateWithArcjet = async(fingerprint:string) =>{
    const rateLimit = aj.withRule(
        fixedWindow({
            mode:'LIVE',
            window:'1m',
            max:2,
            characteristics:['fingerprint']
        })
    )

    const req = await request();

    const decision = await rateLimit.protect(req,{fingerprint});

    if(decision.isDenied()){
        throw new Error('rate limit exceeded')
    }
}

const buildVideoWithUserQuery = () =>{
    return db
        .select({
            video: videos,
            user: {id: user.id, name:user.name, image: user.image}
        })
        .from(videos)
        .leftJoin(user, eq(videos.userId, user.id))
}

// server action
export const getVideoUploadUrl = withErrorHandling(async()=>{
    await getSessionUserId();

   const videoResponse = await apiFetch<BunnyVideoResponse>(
        `${VIDEO_STREAM_BASE_URL}/${BUNNY_LIBRARY_ID}/videos`,
        {
            method:'POST',
            bunnyType:'stream',
            body:{title:'Temporary Title', collectionId:''}
        }
    )

    const uploadUrl = `${VIDEO_STREAM_BASE_URL}/${BUNNY_LIBRARY_ID}/videos/${videoResponse.guid}`;

    return {
        videoId: videoResponse.guid,
        uploadUrl,
        accessKey:ACCESS_KEYS.streamAcessKey
    }
});

export const getThumbnailUploadUrl = withErrorHandling(async(videoId:string)=>{
    const fileName = `${Date.now()}-${videoId}-thumbnail`;
    const uploadUrl = `${THUMBNAIL_STORAGE_BASE_URL}/thumbnails/${fileName}`;
    const cdnUrl = `${THUMBNAIL_CDN_URL}/thumbnails/${fileName}`;

    return {
        uploadUrl,
        cdnUrl,
        accessKey:ACCESS_KEYS.storageAcessKey
    }
})

export const saveVideoDetails = withErrorHandling(async(videoDetails:VideoDetails)=>{
    const userId = await getSessionUserId();
    await validateWithArcjet(userId)

    await apiFetch(
        `${VIDEO_STREAM_BASE_URL}/${BUNNY_LIBRARY_ID}/videos/${videoDetails.videoId}`,
        {
            method: 'POST',
            bunnyType: 'stream',
            body: {
                title: videoDetails.title,
                description: videoDetails.description
            }
        }
    )

    await db.insert(videos).values({
        ...videoDetails,
        videoUrl:`${BUNNY.EMBED_URL}/${BUNNY_LIBRARY_ID}/${videoDetails.videoId}`,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    revalidatePaths(['/']);

    return {videoId:videoDetails.videoId};
});

export const getAllVideos = withErrorHandling(async(
    searchQuery:string='',
    sortFilter?:string,
    pageNumber: number = 1,
    pageSize: number = 8,
)=>{
    const session = await auth.api.getSession({ headers: await headers() })
    const currentUserId = session?.user.id;

// either video should be public or it should be published by the current user
    const canSeeTheVideos = or(
        eq(videos.visibility, 'public'),
        eq(videos.userId, currentUserId!)
    );
// while searching: only return videos that are public or owned by the current user AND match the video title
    const whereCondition = searchQuery.trim()
    ? and(
        canSeeTheVideos,
        doesTitleMatch(videos, searchQuery),
    )
    : canSeeTheVideos

// Counts total videos that are either public or uploaded by the current user,
// and (if search is used) match the video title
    const [{totalCount}] = await db
    .select({totalCount:sql<number>`count(*)`})
    .from(videos)
    .where(whereCondition)

const totalVideos = Number(totalCount || 0);
const totalPages = Math.ceil(totalVideos/pageSize);

const videoRecords = await buildVideoWithUserQuery()
    .where(whereCondition)
    .orderBy(
        sortFilter
            ? getOrderByClause(sortFilter)
            : sql`${videos.createdAt} DESC`
    ).limit(pageSize)
    .offset((pageNumber - 1) * pageSize)

    return {
        videos:videoRecords,
        pagination: {
            currentPage: pageNumber,
            totalPages,
            totalVideos,
            pageSize
        }
    }
})

export const getVideoById = withErrorHandling(async(videoId:string)=>{
    const [videoRecord] = await buildVideoWithUserQuery()
    .where(eq(videos.videoId, videoId))

    return videoRecord;
})

export const getAllVideosByUser = withErrorHandling(
  async (
    userIdParameter: string,
    searchQuery: string = "",
    sortFilter?: string
  ) => {
    const currentUserId = (
      await auth.api.getSession({ headers: await headers() })
    )?.user.id;
    const isOwner = userIdParameter === currentUserId;

    const [userInfo] = await db
      .select({
        id: user.id,
        name: user.name,
        image: user.image,
        email: user.email,
      })
      .from(user)
      .where(eq(user.id, userIdParameter));
    if (!userInfo) throw new Error("User not found");

    const conditions = [
      eq(videos.userId, userIdParameter),
      !isOwner && eq(videos.visibility, "public"),
      searchQuery.trim() && ilike(videos.title, `%${searchQuery}%`),
    ].filter(Boolean) as any[];

    const userVideos = await buildVideoWithUserQuery()
      .where(and(...conditions))
      .orderBy(
        sortFilter ? getOrderByClause(sortFilter) : desc(videos.createdAt)
      );

    return { user: userInfo, videos: userVideos, count: userVideos.length };
  }
);

export const getTranscript = withErrorHandling(async(videoId:string) =>{
   const response = await fetch(
    `${BUNNY.TRANSCRIPT_URL}/${videoId}/captions/en-auto.vtt`
);
      const transcript = await response.text();
   
   return transcript;
});

export const deleteVideo = withErrorHandling(
    async(videoId:string, thumbnailUrl:string) =>{
        await apiFetch(
            `${VIDEO_STREAM_BASE_URL}/${BUNNY_LIBRARY_ID}/videos/${videoId}`,
            {method:"DELETE", bunnyType:"stream"}
        )
        const thumbnailPath = thumbnailUrl.split("thumbnails/")[1];
        await apiFetch(
            `${THUMBNAIL_STORAGE_BASE_URL}/thumbnails/${thumbnailPath}`,
            {method:"DELETE", bunnyType:"storage", expectJson: false}
        )

        await db.delete(videos).where(eq(videos.videoId, videoId));
        revalidatePaths(["/" , `/video/${videoId}`]);
        return {};
    }
)