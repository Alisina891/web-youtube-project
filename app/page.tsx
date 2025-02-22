"use client";
import { useState, useEffect } from "react";
import Image from "next/image";


const API_KEY = "AIzaSyCC5V7uIYXRkcl36YzQOpPWydclmfbMHIU";

interface Video {
  id: {videoId: string} | string;
  snippet: {
    title: string;
    thumbnails: {medium: {url: string} };
  }
}

export default function HomePage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  async function fetchTrendingVideos() {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=US&maxResults=10&key=${API_KEY}`
    );
    if (!res.ok) {
      console.error("Failed to fetch YouTube videos");
      return;
    }
    const data = await res.json();
    setVideos(data.items);
    setSelectedVideoId(data.items[0]?.id); 
  }

  async function searchVideos() {
    if (!query) return fetchTrendingVideos(); 

    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=6&key=${API_KEY}`
    );
    if (!res.ok) {
      console.error("Failed to fetch search results");
      return;
    }
    const data = await res.json();
    setVideos(data.items);
    setSelectedVideoId(data.items[0]?.id);
    setQuery("")
  }

  useEffect(() => {
    fetchTrendingVideos();
  }, []);

  return (
    <div className="py-2 bg-white flex flex-col px-3 ">
      <div className=" relative w-full px-5  py-3 shadow-lg shadow-gray-400">

      <input
      type="text"
      placeholder=""
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && searchVideos()}
      className=" peer py-4 w-full 
      pr-36 border border-gray-700 px-4 rounded  focus:border-blue-500 text-black focus:outline-none focus:border-2"/>
      <label
      htmlFor="input"
      className="  bg-white absolute left-9 mt-5  text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-900 peer-focus:-mt-2 peer-focus:text-sm peer-focus:text-blue-500 ">
        Search...
      </label>
      </div>

      <div className=" flex  flex-col justify-center items-center md:grid md:grid-cols-2">
        <div className=" flex w-full justify-center ]">{selectedVideoId && (
            <iframe
            className=" w-full max-w-[600px]  aspect-video rounded  shadow-lg max-sm:mt-10  "
            src={`https://www.youtube.com/embed/${selectedVideoId}`}
            allowFullScreen ></iframe>
            
          
        )}
        
        </div>
        <div className="grid grid-cols-2 max-sm:gap-4 gap-2 items-center justify-center text-center ">
        {videos.slice(0 , 4).map((video) => (
          <div
            key={(video.id as {videoId?: string}).videoId || (video.id as string)}
            className="p-4  border rounded shadow cursor-pointer hover:bg-gray-100 transition flex flex-col justify-center items-center "
            onClick={() => setSelectedVideoId((video.id as {videoId?: string}).videoId || (video.id as string))} // انتخاب ویدیو
          >
            
            <Image
            width={300}
            height={300}
              src={video.snippet.thumbnails.medium.url}
              alt={video.snippet.title}
              className="rounded mt-2"
            />
            <h2 className="text-blue-500 font-semibold max-w-[300px]">{video.snippet.title}</h2>
          </div>
        ))}
        </div>
      </div>
      
    </div>
  );
};

