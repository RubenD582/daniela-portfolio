import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Firebase config
const firebaseConfig = {
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

const GalleryPreview = ({ isVisible = {} }) => {
  const [imageURLs, setImageURLs] = useState({});
  const [loadedImages, setLoadedImages] = useState(new Set());
  
  const storage = getStorage(firebaseApp);
  const navigate = useNavigate();
  
  // Cache keys for localStorage - only cache URLs now
  const CACHE_KEYS = {
    imageUrls: 'gallery_image_urls',
    timestamp: 'gallery_url_cache_timestamp'
  };
  
  // Cache duration (24 hours in milliseconds)
  const CACHE_DURATION = 24 * 60 * 60 * 1000;
  
  // Function to check if URL cache is valid
  const isUrlCacheValid = () => {
    const timestamp = JSON.parse(localStorage.getItem(CACHE_KEYS.timestamp) || '0');
    return Date.now() - timestamp < CACHE_DURATION;
  };

  const handleGalleryClick = () => {
    navigate('/designs');
  };
  
  // Function to generate random gallery items (always fresh)
  const generateRandomItems = () => {
    const totalDesigns = 14;
    const itemsToShow = 8;
    const allItems = Array.from({ length: totalDesigns }, (_, i) => i + 1);
    
    // Shuffle array and take first 8 items
    for (let i = allItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allItems[i], allItems[j]] = [allItems[j], allItems[i]];
    }
    
    return allItems.slice(0, itemsToShow);
  };
  
  // Always generate fresh random items (no caching)
  const [galleryItems] = useState(() => generateRandomItems());

  useEffect(() => {
    const fetchImageURLs = async () => {
      // Try to get cached URLs first
      let cachedUrls = {};
      try {
        if (isUrlCacheValid()) {
          const cachedUrlsString = localStorage.getItem(CACHE_KEYS.imageUrls);
          if (cachedUrlsString) {
            cachedUrls = JSON.parse(cachedUrlsString);
          }
        }
      } catch (error) {
        console.error('Error reading cached URLs:', error);
      }
      
      // Set any cached URLs we already have
      const urlsToSet = {};
      const itemsToFetch = [];
      
      for (const item of galleryItems) {
        if (cachedUrls[item]) {
          urlsToSet[item] = cachedUrls[item];
        } else {
          itemsToFetch.push(item);
        }
      }
      
      // Set cached URLs immediately
      if (Object.keys(urlsToSet).length > 0) {
        setImageURLs(urlsToSet);
      }
      
      // Fetch missing URLs
      if (itemsToFetch.length > 0) {
        const newUrls = { ...cachedUrls };
        
        for (const item of itemsToFetch) {
          const imgRef = storageRef(storage, `Designs/${item}.jpg`);
          try {
            const downloadUrl = await getDownloadURL(imgRef);
            newUrls[item] = downloadUrl;
            // Update state immediately as each URL is fetched
            setImageURLs(prev => ({ ...prev, [item]: downloadUrl }));
          } catch (err) {
            console.error(`Failed to fetch download URL for design ${item}:`, err);
          }
        }
        
        // Save all URLs to localStorage (both old and new)
        try {
          localStorage.setItem(CACHE_KEYS.imageUrls, JSON.stringify(newUrls));
          localStorage.setItem(CACHE_KEYS.timestamp, JSON.stringify(Date.now()));
        } catch (error) {
          console.error('Error saving URLs to localStorage:', error);
        }
      }
    };

    fetchImageURLs();
  }, [galleryItems]);

  const handleImageLoad = (itemId) => {
    setLoadedImages(prev => new Set([...prev, itemId]));
  };

  const handleImageError = (itemId) => {
    setLoadedImages(prev => new Set([...prev, itemId])); // Stop showing skeleton even on error
  };
  
  const refreshGallery = () => {
    // Just reload the page to get new random items
    // URL cache will persist, but we'll get new random selection
    window.location.reload();
  };

  return (
    <section id="gallery" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible?.gallery ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl md:text-5xl font-extralight text-stone-900 mb-6">
            Portfolio Highlights
          </h2>
          <p className="text-stone-600 font-light max-w-2xl mx-auto text-lg">
            A curated selection of our most celebrated designs, showcasing the versatility and artistry of our craft.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryItems.map((item, idx) => (
            <div
              key={item}
              className={`aspect-square group cursor-pointer overflow-hidden rounded-lg ${isVisible?.gallery ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <div className="relative w-full h-full">
                {/* Skeleton/Placeholder - shown until image loads */}
                {!loadedImages.has(item) && (
                  <div className="absolute inset-0 bg-gradient-to-br from-stone-300 via-stone-200 to-stone-300 animate-pulse">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-stone-300 to-transparent animate-shimmer transform -skew-x-12 w-full h-full"></div>
                  </div>
                )}
                
                {/* Actual Image */}
                {imageURLs[item] && (
                  <img
                    src={imageURLs[item]}
                    alt={`Gallery ${item}`}
                    className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-110 ${
                      loadedImages.has(item) ? 'opacity-100' : 'opacity-0'
                    }`}
                    loading="lazy"
                    onLoad={() => handleImageLoad(item)}
                    onError={() => handleImageError(item)}
                  />
                )}
                
                {/* Error State Fallback */}
                {loadedImages.has(item) && !imageURLs[item] && (
                  <div className="w-full h-full bg-stone-100 flex items-center justify-center">
                    <div className="text-stone-400 text-center">
                      <div className="text-2xl mb-2">🖼️</div>
                      <div className="text-xs">Image unavailable</div>
                    </div>
                  </div>
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-12 space-x-4">
          <button
            className="group bg-stone-900 text-white px-8 py-4 text-sm font-light
                      hover:bg-stone-800 transition-all duration-[400ms]
                      ease-[cubic-bezier(0.25,0.46,0.45,0.94)] flex items-center
                      transform hover:scale-[1.02] hover:-translate-y-0.5"
            onClick={handleGalleryClick}
          >
            View Full Gallery
            <ArrowRight
              className="ml-2 w-4 h-4 transition-transform duration-[400ms]
                        ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:translate-x-1"
            />
          </button>
        </div>
      </div>
      
      <style jsx>{`
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
    </section>
  );
};

export default GalleryPreview;