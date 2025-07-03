import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getStorage, ref as storageRef, getDownloadURL, listAll } from 'firebase/storage';
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
  const [availableImages, setAvailableImages] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [isLoadingImageList, setIsLoadingImageList] = useState(true);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const storage = getStorage(firebaseApp);
  const navigate = useNavigate();
  
  // Cache keys for localStorage
  const CACHE_KEYS = {
    imageUrls: 'gallery_image_urls',
    imageList: 'gallery_image_list',
    timestamp: 'gallery_cache_timestamp'
  };
  
  // Cache duration (24 hours in milliseconds)
  const CACHE_DURATION = 24 * 60 * 60 * 1000;
  
  // Function to check if cache is valid
  const isCacheValid = () => {
    const timestamp = JSON.parse(localStorage.getItem(CACHE_KEYS.timestamp) || '0');
    return Date.now() - timestamp < CACHE_DURATION;
  };

  const handleGalleryClick = () => {
    console.log("test");
    navigate('/designs');
  };
  
  // Handle image click to open preview
  const handleImageClick = (item) => {
    if (imageURLs[item]) {
      setPreviewImage({
        url: imageURLs[item],
        id: item
      });
      setIsPreviewOpen(true);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
  };
  
  // Close preview modal
  const closePreview = () => {
    setIsPreviewOpen(false);
    setPreviewImage(null);
    // Restore body scroll
    document.body.style.overflow = 'unset';
  };
  
  // Handle mouse move for custom cursor
  const handleMouseMove = (e) => {
    if (!isDesktop) return;
    setCursorPosition({ x: e.clientX, y: e.clientY });
  };
  
  // Handle mouse enter on gallery items
  const handleMouseEnter = () => {
    if (!isDesktop) return;
    setIsHovering(true);
  };
  
  // Handle mouse leave on gallery items
  const handleMouseLeave = () => {
    if (!isDesktop) return;
    setIsHovering(false);
  };
  
  // Function to extract image number from filename (e.g., "1.jpg" -> 1)
  const extractImageNumber = (filename) => {
    const match = filename.match(/^(\d+)\./);
    return match ? parseInt(match[1], 10) : null;
  };
  
  // Function to generate random gallery items from available images
  const generateRandomItems = (ids, itemsToShow = 8) => {
    const shuffled = [...ids];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, itemsToShow);
  };

  const handleImageLoad = (itemId) => {
    setLoadedImages(prev => new Set([...prev, itemId]));
  };

  const handleImageError = (itemId) => {
    setLoadedImages(prev => new Set([...prev, itemId])); // Stop showing skeleton even on error
  };
  
  const refreshGallery = () => {
    if (availableImages.length > 0) {
      setGalleryItems(generateRandomItems(availableImages));
      setLoadedImages(new Set()); // Reset loaded images
    }
  };

  // Check if device is desktop
  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024); // lg breakpoint
    };
    
    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);
  
  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isPreviewOpen) {
        closePreview();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isPreviewOpen]);

  // Fetch available images from Firebase Storage
  useEffect(() => {
    const fetchAvailableDesigns = async () => {
      setIsLoadingImageList(true);
  
      try {
        const db = getDatabase(firebaseApp);
        const snapshot = await get(child(ref(db), 'designs'));
  
        if (snapshot.exists()) {
          const data = snapshot.val();
  
          // Convert to array and filter out archived
          const designs = Object.values(data)
            .filter(d => d && d.archived === false)
            .map(d => ({
              id: d.id,
              fileName: d.fileName,
              name: d.name,
            }));
  
          setAvailableImages(designs);
          const randomItems = generateRandomItems(designs.map(d => d.id));
          setGalleryItems(randomItems);
  
          // Cache
          localStorage.setItem(CACHE_KEYS.imageList, JSON.stringify(designs));
          localStorage.setItem(CACHE_KEYS.timestamp, JSON.stringify(Date.now()));
        } else {
          console.log("No designs found in DB.");
          setAvailableImages([]);
          setGalleryItems([]);
        }
      } catch (err) {
        console.error("Error fetching designs from Realtime Database:", err);
        setAvailableImages([]);
        setGalleryItems([]);
      } finally {
        setIsLoadingImageList(false);
      }
    };
  
    fetchAvailableDesigns();
  }, []);  

  // Fetch image URLs for selected gallery items
  useEffect(() => {
    if (galleryItems.length === 0 || availableImages.length === 0) return;
  
    const fetchImageURLs = async () => {
      const cachedUrls = isCacheValid()
        ? JSON.parse(localStorage.getItem(CACHE_KEYS.imageUrls) || '{}')
        : {};
  
      const urlsToSet = {};
      const itemsToFetch = [];
  
      for (const id of galleryItems) {
        const design = availableImages.find(d => d.id === id);
        if (!design) continue;
  
        if (cachedUrls[id]) {
          urlsToSet[id] = cachedUrls[id];
        } else {
          itemsToFetch.push(design);
        }
      }
  
      if (Object.keys(urlsToSet).length > 0) {
        setImageURLs(prev => ({ ...prev, ...urlsToSet }));
      }
  
      for (const design of itemsToFetch) {
        try {
          const imgRef = storageRef(storage, `Designs/${design.fileName}`);
          const downloadUrl = await getDownloadURL(imgRef);
          setImageURLs(prev => ({ ...prev, [design.id]: downloadUrl }));
          cachedUrls[design.id] = downloadUrl;
        } catch (err) {
          console.error(`Failed to fetch URL for ${design.fileName}`, err);
        }
      }
  
      // Update cache
      localStorage.setItem(CACHE_KEYS.imageUrls, JSON.stringify(cachedUrls));
      localStorage.setItem(CACHE_KEYS.timestamp, JSON.stringify(Date.now()));
    };
  
    fetchImageURLs();
  }, [galleryItems, availableImages]);  

  // Show loading state while fetching image list
  if (isLoadingImageList) {
    return (
      <section id="gallery" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className={`text-center mb-20 transition-all duration-1000 ${isVisible?.gallery ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-4xl md:text-5xl font-extralight text-stone-900 mb-6">
              Portfolio Highlights
            </h2>
            <p className="text-stone-600 font-light max-w-2xl mx-auto text-lg">
              Loading our gallery...
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="aspect-square rounded-lg bg-gradient-to-br from-stone-300 via-stone-200 to-stone-300 animate-pulse"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-stone-300 to-transparent animate-shimmer transform -skew-x-12 w-full h-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Show message if no images found
  if (availableImages.length === 0) {
    return (
      <section id="gallery" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className={`text-center mb-20 transition-all duration-1000 ${isVisible?.gallery ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-4xl md:text-5xl font-extralight text-stone-900 mb-6">
              Portfolio Highlights
            </h2>
            <p className="text-stone-600 font-light max-w-2xl mx-auto text-lg">
              No images found in the gallery.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible?.gallery ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl md:text-5xl font-extralight text-stone-900 mb-6">
            Portfolio Highlights
          </h2>
          <p className="text-stone-600 font-light max-w-2xl mx-auto text-lg font-sans">
            A curated selection of our most celebrated designs, showcasing the versatility and artistry of our craft.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryItems.map((item, idx) => (
            <div
              key={item}
              className={`aspect-square group cursor-pointer overflow-hidden rounded-lg ${isDesktop ? 'cursor-none' : ''} ${isVisible?.gallery ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${idx * 100}ms` }}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleImageClick(item)}
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
        
        {/* Image Preview Modal */}
        {isPreviewOpen && previewImage && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-modal-fade-in"
            onClick={closePreview}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black bg-opacity-90 animate-backdrop-fade-in"></div>
            
            {/* Modal Content */}
            <div 
              className="relative animate-modal-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closePreview}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* Polaroid Frame */}
              <div className="bg-white p-4 pb-16 shadow-xl transform rotate-1">
                {/* Image */}
                <div className="w-80 h-80 overflow-hidden flex items-center justify-center">
                  <img
                    src={previewImage.url}
                    alt={`Gallery ${previewImage.id}`}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Custom Cursor */}
        {isDesktop && isHovering && (
          <div
            className="fixed pointer-events-none z-50"
            style={{
              left: cursorPosition.x,
              top: cursorPosition.y,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="bg-black bg-opacity-60 text-white w-16 h-16 rounded-full text-sm uppercase tracking-wider flex items-center justify-center animate-cursor-grow font-sans font-medium">
              View
            </div>
          </div>
        )}
        
        <div className="flex justify-center mt-12 space-x-4">
          <button 
            onClick={handleGalleryClick} 
            className="group relative text-black border border-black px-16 py-4 font-light text-sm uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300"
          >
            <span className="relative z-10">View Gallery</span>
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
        
        @keyframes cursor-grow {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes modal-fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        
        @keyframes backdrop-fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        
        @keyframes modal-scale-in {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-cursor-grow {
          animation: cursor-grow 0.3s ease-out forwards;
        }
        
        .animate-modal-fade-in {
          animation: modal-fade-in 0.3s ease-out forwards;
        }
        
        .animate-backdrop-fade-in {
          animation: backdrop-fade-in 0.3s ease-out forwards;
        }
        
        .animate-modal-scale-in {
          animation: modal-scale-in 0.4s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default GalleryPreview;