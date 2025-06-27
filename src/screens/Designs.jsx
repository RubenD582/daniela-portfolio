// src/pages/Designs.jsx
import React, { useState, useEffect } from "react";
import {
  X,
  Heart,
  Eye,
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

// Individual Design Card Component
const DesignCard = ({ 
  design, 
  index, 
  imageURL, 
  favorites, 
  likesMap, 
  handleHeartClick, 
  openLightbox
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [naturalDimensions, setNaturalDimensions] = useState({ width: 0, height: 0 });

  const handleImageLoad = (e) => {
    setImageLoaded(true);
    setNaturalDimensions({
      width: e.target.naturalWidth,
      height: e.target.naturalHeight
    });
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  // Calculate dynamic height for masonry effect
  const getDynamicHeight = () => {
    if (!imageLoaded || imageError || !naturalDimensions.width || !naturalDimensions.height) {
      return 300; // Default height
    }
    
    // Base width for calculation (assuming 300px column width)
    const baseWidth = 300;
    const aspectRatio = naturalDimensions.height / naturalDimensions.width;
    
    // Calculate height maintaining aspect ratio, with some constraints
    let height = baseWidth * aspectRatio;
    
    // Add some randomness for more variety (optional)
    const variance = Math.random() * 40 - 20; // -20 to +20px
    height += variance;
    
    // Constrain height between reasonable bounds
    return Math.max(200, Math.min(500, height));
  };

  const dynamicHeight = getDynamicHeight();

  return (
    <div
      className="group cursor-pointer break-inside-avoid mb-3 lg:mb-6"
      style={{
        animationDelay: `${index * 50}ms`,
        animation: "fadeInUp 0.6s ease-out forwards",
      }}
    >
      <div className="relative bg-white hover:border-black transition-all duration-300 overflow-hidden">
        <div 
          className="relative overflow-hidden"
          style={{ height: imageLoaded ? 'auto' : `${dynamicHeight}px` }}
        >
          {/* Skeleton/Placeholder */}
          {!imageLoaded && (
            <div 
              className="w-full bg-gradient-to-br from-stone-300 via-stone-200 to-stone-300 animate-pulse" 
              style={{ height: `${dynamicHeight}px` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-stone-300 to-transparent animate-shimmer transform -skew-x-12 w-full h-full"></div>
            </div>
          )}
          
          {/* Actual Image */}
          {imageURL && (
            <img
              src={imageURL}
              alt={design.title}
              className={`w-full h-auto object-cover transition-all duration-500 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'
              }`}
              loading="lazy"
              onLoad={handleImageLoad}
              onError={handleImageError}
              onClick={() => openLightbox(design)}
              style={imageLoaded ? {} : { height: `${dynamicHeight}px` }}
            />
          )}

          {/* Error State */}
          {imageError && (
            <div 
              className="w-full bg-stone-100 flex items-center justify-center"
              style={{ height: `${dynamicHeight}px` }}
            >
              <div className="text-stone-400 text-center">
                <div className="text-2xl mb-2">✨</div>
                <div className="text-xs">Design #{design.id}</div>
              </div>
            </div>
          )}

          {/* Hover Overlay */}
          {imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
              <div className="flex space-x-3">
                <button
                  onClick={(e) => handleHeartClick(design.id, e)}
                  className={`p-3 rounded-full transition-all duration-200 ${
                    favorites.has(design.id)
                      ? "bg-white text-black"
                      : "bg-white/20 text-white hover:bg-white hover:text-black"
                  }`}
                >
                  <Heart
                    size={18}
                    fill={favorites.has(design.id) ? "currentColor" : "none"}
                  />
                </button>
                <button
                  onClick={(e) => openLightbox(design, e)}
                  className="p-3 rounded-full bg-white/20 text-white hover:bg-white hover:text-black transition-all duration-200"
                >
                  <Eye size={18} />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="pt-3"></div>
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

  // Static design metadata
  const designs = [
    { id: 1, title: "Classic French", category: "classic", description: "Timeless elegance with clean lines" },
    { id: 2, title: "Nude Sophistication", category: "classic", description: "Minimalist beauty in natural tones" },
    { id: 3, title: "Black & White", category: "classic", description: "Monochrome perfection" },
    { id: 4, title: "Geometric Lines", category: "modern", description: "Contemporary angular design" },
    { id: 5, title: "Abstract Art", category: "artistic", description: "Creative expression on nails" },
    { id: 6, title: "Floral Elegance", category: "feminine", description: "Delicate botanical designs" },
    { id: 7, title: "Bold Statement", category: "bold", description: "Eye-catching dramatic style" },
    { id: 8, title: "Luxury Gold", category: "luxury", description: "Premium metallic accents" },
    { id: 9, title: "Modern Minimal", category: "modern", description: "Clean contemporary aesthetic" },
    { id: 10, title: "Artistic Expression", category: "artistic", description: "Unique creative design" },
    { id: 11, title: "Feminine Touch", category: "feminine", description: "Soft and romantic style" },
    { id: 12, title: "Bold Contrast", category: "bold", description: "High-impact visual design" },
    { id: 13, title: "Luxury Pearl", category: "luxury", description: "Elegant premium finish" },
    { id: 14, title: "Classic Elegance", category: "classic", description: "Traditional refined beauty" },
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

    // Fetch image URLs
    const fetchImageURLs = async () => {
      // Fetch URLs for currently visible designs first
      const priorityDesigns = visibleDesigns.slice(0, 8);
      
      for (const design of priorityDesigns) {
        const imgRef = storageRef(storage, `Designs/${design.id}.jpg`);
        try {
          const downloadUrl = await getDownloadURL(imgRef);
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

  // Show initial loading
  const showInitialLoading = !likesLoaded;

  if (showInitialLoading) {
    return (
      <div className="min-h-screen bg-white pt-[70px]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="columns-2 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
            {Array.from({ length: 12 }).map((_, idx) => (
              <div key={idx} className="group cursor-pointer break-inside-avoid mb-3 lg:mb-6">
                <div className="relative bg-white overflow-hidden">
                  <div 
                    className="relative overflow-hidden bg-gradient-to-br from-stone-300 via-stone-200 to-stone-300 animate-pulse" 
                    style={{ height: `${200 + Math.random() * 200}px` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer transform -skew-x-12 w-full h-full"></div>
                  </div>
                  <div className="pt-3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-[70px]">
      {/* Gallery */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="columns-2 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
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
            />
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < filteredDesigns.length && (
          <div className="text-center mt-12">
            <button
              onClick={loadMore}
              className="px-8 py-3 border border-black text-black hover:bg-black hover:text-white transition-all duration-300 font-medium"
            >
              Load More ({filteredDesigns.length - visibleCount} remaining)
            </button>
          </div>
        )}

        {filteredDesigns.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Heart size={48} className="mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No designs found</h3>
              <p className="text-sm">Try selecting a different category or add some designs to your favorites.</p>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-0 right-0 text-white hover:text-gray-300 transition-colors duration-200 z-20"
            >
              <X size={24} />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={() => navigateLightbox("prev")}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-200 bg-black/50 rounded-full p-3 hover:bg-black/70 z-20"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => navigateLightbox("next")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-200 bg-black/50 rounded-full p-3 hover:bg-black/70 z-20"
            >
              <ChevronRight size={20} />
            </button>

            {/* Image Container */}
            <div className="bg-white p-8 mx-auto max-w-2xl">
              <img
                src={imageURLs[selectedImage.id]}
                alt={selectedImage.title}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>

            {/* Image Info */}
            <div className="mt-6 text-center">
              <h2 className="text-white text-xl font-medium mb-2">
                {selectedImage.title || `Design #${selectedImage.id}`}
              </h2>
              <p className="text-gray-300 text-sm mb-4">
                {selectedImage.description}
              </p>
              <div className="flex items-center justify-center">
                <button
                  onClick={(e) => handleHeartClick(selectedImage.id, e)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded transition-colors duration-200 ${
                    favorites.has(selectedImage.id)
                      ? "bg-white text-black"
                      : "bg-white/20 text-white hover:bg-white hover:text-black"
                  }`}
                >
                  <Heart
                    size={16}
                    fill={favorites.has(selectedImage.id) ? "currentColor" : "none"}
                  />
                  <span className="text-sm font-medium">
                    {(likesMap[selectedImage.id] ?? 0)}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
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
      `}</style>
    </div>
  );
}