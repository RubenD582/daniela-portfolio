// src/pages/Designs.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Heart,
  Eye,
  Share2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, runTransaction } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";

// Firebase config
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);
const storage = getStorage(firebaseApp);

// Individual Design Card Component with its own loading state
const DesignCard = ({ 
  design, 
  index, 
  imageURL, 
  favorites, 
  likesMap, 
  handleHeartClick, 
  openLightbox,
  shareDesign 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true); // Stop showing skeleton even on error
  };

  return (
    <div
      className="break-inside-avoid group cursor-pointer transform transition-all duration-500 hover:scale-[1.02]"
      style={{
        animationDelay: `${index * 50}ms`,
        animation: "fadeInUp 0.6s ease-out forwards",
      }}
    >
      <div className="relative bg-white rounded-2xl overflow-hidden transition-all duration-500">
        <div className="relative overflow-hidden">
          {/* Skeleton/Placeholder - shown until image loads */}
          {!imageLoaded && (
            <div className="w-full h-64 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded-t-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 transform -skew-x-12 w-full h-full"></div>
            </div>
          )}
          
          {/* Actual Image */}
          {imageURL && (
            <img
              src={imageURL}
              alt={design.title}
              className={`w-full h-auto object-cover transition-all duration-700 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'
              }`}
              loading="lazy"
              onLoad={handleImageLoad}
              onError={handleImageError}
              onClick={() => openLightbox(design)}
            />
          )}

          {/* Error State */}
          {imageError && (
            <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-t-2xl">
              <div className="text-gray-400 text-center">
                <div className="text-2xl mb-2">🖼️</div>
                <div className="text-sm">Failed to load image</div>
              </div>
            </div>
          )}

          {/* Hover Overlay - only show when image is loaded */}
          {imageLoaded && !imageError && (
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"
              onClick={(e) => openLightbox(design, e)}
            >
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="font-semibold text-lg mb-1">
                  {design.title}
                </h3>
                <p className="text-sm opacity-90 mb-3">
                  {design.description}
                </p>
                <div className="flex items-center justify-between">
                  {/* Heart icon + like count */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => handleHeartClick(design.id, e)}
                      className={`p-2 rounded-full transition-colors duration-300 ${
                        favorites.has(design.id)
                          ? "bg-red-500 text-white"
                          : "bg-white/20 text-white hover:bg-white/30"
                      }`}
                    >
                      <Heart
                        size={16}
                        fill={
                          favorites.has(design.id) ? "currentColor" : "none"
                        }
                      />
                    </button>
                    <span className="text-white font-medium text-xs">
                      {(likesMap[design.id] ?? 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <div
                      onClick={(e) => openLightbox(design, e)}
                      className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-300"
                    >
                      <Eye size={16} />
                    </div>
                    <div
                      onClick={(e) => shareDesign(design, e)}
                      className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-300"
                    >
                      <Share2 size={16} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Designs() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);
  const [visibleCount, setVisibleCount] = useState(12);

  // Local favorites from localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = window.localStorage.getItem("likedDesigns");
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch (e) {
      return new Set();
    }
  });

  // Likes map from Realtime Database
  const [likesMap, setLikesMap] = useState({});
  const [likesLoaded, setLikesLoaded] = useState(false);

  // Hold the fetched URLs for each design
  const [imageURLs, setImageURLs] = useState({});
  const [urlsFetched, setUrlsFetched] = useState(false);

  // Static design metadata
  const designs = [
    { id: 1, title: "", category: "classic", description: "" },
    { id: 2, title: "", category: "classic", description: "" },
    { id: 3, title: "", category: "classic", description: "" },
    { id: 4, title: "", category: "classic", description: "" },
    { id: 5, title: "", category: "classic", description: "" },
    { id: 6, title: "", category: "classic", description: "" },
    { id: 7, title: "", category: "classic", description: "" },
    { id: 8, title: "", category: "classic", description: "" },
    { id: 9, title: "", category: "classic", description: "" },
    { id: 10, title: "", category: "classic", description: "" },
    { id: 11, title: "", category: "classic", description: "" },
    { id: 12, title: "", category: "classic", description: "" },
    { id: 13, title: "", category: "classic", description: "" },
    { id: 14, title: "", category: "classic", description: "" },
  ];

  // Categories
  const categories = [
    { id: "all", name: "All Designs", count: designs.length },
    {
      id: "liked",
      name: "Liked",
      count: Array.from(favorites).filter((id) =>
        designs.some((d) => d.id === id)
      ).length,
    },
    {
      id: "classic",
      name: "Classic",
      count: designs.filter((d) => d.category === "classic").length,
    },
    {
      id: "modern",
      name: "Modern",
      count: designs.filter((d) => d.category === "modern").length,
    },
    {
      id: "artistic",
      name: "Artistic",
      count: designs.filter((d) => d.category === "artistic").length,
    },
    {
      id: "feminine",
      name: "Feminine",
      count: designs.filter((d) => d.category === "feminine").length,
    },
    {
      id: "bold",
      name: "Bold",
      count: designs.filter((d) => d.category === "bold").length,
    },
    {
      id: "luxury",
      name: "Luxury",
      count: designs.filter((d) => d.category === "luxury").length,
    },
  ];

  // Filter based on category or "liked"
  let filteredDesigns = [];
  if (selectedCategory === "all") {
    filteredDesigns = designs;
  } else if (selectedCategory === "liked") {
    filteredDesigns = designs.filter((d) => favorites.has(d.id));
  } else {
    filteredDesigns = designs.filter((d) => d.category === selectedCategory);
  }
  const visibleDesigns = filteredDesigns.slice(0, visibleCount);

  // Initialize data fetching
  useEffect(() => {
    // Subscribe to likes
    const allLikesRef = ref(db, "likes");
    const unsubscribeLikes = onValue(allLikesRef, (snapshot) => {
      const data = snapshot.val() || {};
      setLikesMap(data);
      setLikesLoaded(true);
    });

    // Fetch image URLs (don't wait for all to complete)
    const fetchImageURLs = async () => {
      const urls = {};
      
      // Fetch URLs for currently visible designs first
      const priorityDesigns = visibleDesigns.slice(0, 8);
      
      for (const design of priorityDesigns) {
        const imgRef = storageRef(storage, `Designs/${design.id}.jpg`);
        try {
          const downloadUrl = await getDownloadURL(imgRef);
          urls[design.id] = downloadUrl;
          // Update state immediately as each URL is fetched
          setImageURLs(prev => ({ ...prev, [design.id]: downloadUrl }));
        } catch (err) {
          console.error(`Failed to fetch download URL for design ${design.id}:`, err);
        }
      }
      
      // Then fetch remaining URLs in background
      const remainingDesigns = designs.filter(d => !priorityDesigns.includes(d));
      for (const design of remainingDesigns) {
        const imgRef = storageRef(storage, `Designs/${design.id}.jpg`);
        try {
          const downloadUrl = await getDownloadURL(imgRef);
          setImageURLs(prev => ({ ...prev, [design.id]: downloadUrl }));
        } catch (err) {
          console.error(`Failed to fetch download URL for design ${design.id}:`, err);
        }
      }
      
      setUrlsFetched(true);
    };

    fetchImageURLs();

    return () => {
      unsubscribeLikes();
    };
  }, []);

  // Helper to increase/decrease likes in Firebase
  const changeLikes = (id, delta) => {
    const likesRef = ref(db, `likes/${id}`);
    runTransaction(likesRef, (current) => {
      const currentVal = current || 0;
      const nextVal = currentVal + delta;
      return nextVal < 0 ? 0 : nextVal;
    }).catch((err) => {
      console.error("Failed to change likes:", err);
    });
  };

  // Toggle favorite in localStorage + update Firebase
  const handleHeartClick = (id, e) => {
    e.stopPropagation();
    if (favorites.has(id)) {
      // Unlike
      changeLikes(id, -1);
      setFavorites((prev) => {
        const copy = new Set(prev);
        copy.delete(id);
        window.localStorage.setItem(
          "likedDesigns",
          JSON.stringify(Array.from(copy))
        );
        return copy;
      });
    } else {
      // Like
      changeLikes(id, +1);
      setFavorites((prev) => {
        const copy = new Set(prev);
        copy.add(id);
        window.localStorage.setItem(
          "likedDesigns",
          JSON.stringify(Array.from(copy))
        );
        return copy;
      });
    }
  };

  const openLightbox = (design, e) => {
    if (e) e.stopPropagation();
    setSelectedImage(design);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateLightbox = (direction) => {
    const currentIndex = filteredDesigns.findIndex(
      (d) => d.id === selectedImage.id
    );
    let newIndex;
    if (direction === "next") {
      newIndex = (currentIndex + 1) % filteredDesigns.length;
    } else {
      newIndex =
        currentIndex - 1 < 0 ? filteredDesigns.length - 1 : currentIndex - 1;
    }
    setSelectedImage(filteredDesigns[newIndex]);
  };

  const loadMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  const shareDesign = (design, e) => {
    e.stopPropagation();
    // Implement share functionality
    console.log('Sharing design:', design.id);
  };

  // Show initial loading only if likes haven't loaded yet
  const showInitialLoading = !likesLoaded;

  if (showInitialLoading) {
    return (
      <div className="min-h-screen px-6 py-10">
        <div className="max-w-7xl mx-auto columns-2 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-6">
          {Array.from({ length: 12 }).map((_, idx) => (
            <div
              key={idx}
              className="break-inside-avoid animate-pulse"
              style={{ animationDelay: `${idx * 25}ms` }}
            >
              <div className="w-full h-64 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded-2xl overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent animate-shimmer transform -skew-x-12 w-full h-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-10 mt-6">
        <div className="columns-2 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-6">
          {visibleDesigns.map((design, index) => (
            <DesignCard
              key={design.id}
              design={design}
              index={index}
              imageURL={imageURLs[design.id]}
              favorites={favorites}
              likesMap={likesMap}
              handleHeartClick={handleHeartClick}
              openLightbox={openLightbox}
              shareDesign={shareDesign}
            />
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < filteredDesigns.length && (
          <div className="text-center mt-16 mb-10">
            <button
              onClick={loadMore}
              className="px-5 py-3 text-xs bg-black text-white rounded-full font-medium transform hover:scale-105 transition-all duration-300"
            >
              Load More Designs ({filteredDesigns.length - visibleCount}{" "}
              remaining)
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
          <div
            className="relative w-full max-w-md flex justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-300 z-20"
            >
              <X size={32} />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={() => navigateLightbox("prev")}
              className="absolute left-0 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-300 bg-black/50 rounded-full p-3 hover:bg-black/70 z-20"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => navigateLightbox("next")}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-300 bg-black/50 rounded-full p-3 hover:bg-black/70 z-20"
            >
              <ChevronRight size={24} />
            </button>

            {/* Polaroid Frame */}
            <div className="bg-white border border-gray-200 shadow-lg w-full p-4 pb-12 mx-auto">
              <img
                src={imageURLs[selectedImage.id]}
                alt={selectedImage.title}
                className="block w-full h-auto max-h-[60vh] object-contain"
              />
            </div>
          </div>

          {/* Like Button & Count Below Lightbox */}
          <div className="mt-4 w-full max-w-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => handleHeartClick(selectedImage.id, e)}
                  className={`p-2 rounded-full transition-colors duration-300 ${
                    favorites.has(selectedImage.id)
                      ? "bg-red-500 text-white"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  <Heart
                    size={16}
                    fill={
                      favorites.has(selectedImage.id) ? "currentColor" : "none"
                    }
                  />
                </button>
                <span className="text-white font-medium text-sm">
                  {(likesMap[selectedImage.id] ?? 0).toLocaleString()}{" "}
                  {likesMap[selectedImage.id] === 1 ? "like" : "likes"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}