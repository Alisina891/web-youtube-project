"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const API_KEY = "AIzaSyCC5V7uIYXRkcl36YzQOpPWydclmfbMHIU";

interface Video {
  id: { videoId: string } | string;
  snippet: {
    title: string;
    thumbnails: { medium: { url: string } };
  };
}

export default function HomePage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setIsloading] = useState(false);

  // تابع بارگذاری ویدیوهای ترند
  async function fetchTrendingVideos() {
    setIsloading(true);
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=US&maxResults=10&key=${API_KEY}`
    );
    if (!res.ok) {
      console.error("Failed to fetch YouTube videos");
      setIsloading(false);
      return;
    }
    const data = await res.json();
    setIsloading(false);
    setVideos(data.items);
    setSelectedVideoId(data.items[0]?.id);
  }

  // تابع جستجو در ویدیوها
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
    setQuery("");
  }

  useEffect(() => {
    fetchTrendingVideos();
  }, []);

  return (
    // پس‌زمینه گرادیان زیبا به همراه فضای خالی (padding) مناسب
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-4">
      {/* نوار جستجو با سایه و انیمیشن های لطیف */}
      <div className="relative w-full max-w-3xl mx-auto mb-8">
        <input
          type="text"
          placeholder=""
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchVideos()}
          className="peer w-full py-4 pr-36 pl-4 border border-gray-300 rounded-full shadow-md focus:outline-none focus:border-blue-500 transition duration-300"
        />
        <label
          htmlFor="input"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-500"
        >
          Search...
        </label>
        <button
          onClick={searchVideos}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full transition duration-300"
        >
          Go
        </button>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <div className="flex justify-center">
          {selectedVideoId && !loading ? (
            <iframe
              className="w-full max-w-[600px] aspect-video rounded-lg shadow-2xl"
              src={`https://www.youtube.com/embed/${selectedVideoId}`}
              allowFullScreen
            ></iframe>
          ) : (
            <p className="text-gray-700 text-xl mt-10 font-bold h-96 flex items-center justify-center">
              Loading...
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {videos.slice(0, 4).map((video) => (
            <div
              key={
                (video.id as { videoId?: string }).videoId ||
                (video.id as string)
              }
              className="p-4 border rounded-lg shadow-md cursor-pointer hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col items-center bg-white"
              onClick={() =>
                setSelectedVideoId(
                  (video.id as { videoId?: string }).videoId ||
                    (video.id as string)
                )
              }
            >
              <Image
                width={300}
                height={300}
                src={video.snippet.thumbnails.medium.url}
                alt={video.snippet.title}
                className="rounded mb-2"
              />
              <h2 className="text-blue-500 font-semibold text-center text-sm px-2">
                {video.snippet.title}
              </h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
