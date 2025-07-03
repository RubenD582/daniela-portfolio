// src/pages/Designs.jsx
import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { initializeApp } from "firebase/app";
import { getStorage, ref as storageRef, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as dbRef, get } from "firebase/database";

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

// Initialize Firebase
let firebaseApp;
let storage;
let database;

try {
  firebaseApp = initializeApp(firebaseConfig);
  storage = getStorage(firebaseApp);
  database = getDatabase(firebaseApp);
} catch (error) {
  console.error("Firebase initialization error:", error);
}

// Design Card Component
const DesignCard = ({ design, index, imageURL, openLightbox, inView }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <div
      className="group cursor-pointer relative overflow-hidden bg-white border border-gray-100 transition-all duration-300 break-inside-avoid mb-6"
      data-index={index}
      style={{
        animationName: inView ? "slideInUp" : "none",
        animationDuration: "0.8s",
        animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        animationFillMode: "forwards",
        animationDelay: `${index * 50}ms`,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(30px)",
      }}
    >
      <div className="relative overflow-hidden h-full">
        {!imageLoaded && (
          <div className="w-full h-72 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
          </div>
        )}

        {imageURL ? (
          <img
            src={imageURL}
            alt={design.title}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
              imageLoaded ? "opacity-100" : "opacity-0 absolute inset-0"
            }`}
            loading="lazy"
            onLoad={handleImageLoad}
            onError={handleImageError}
            onClick={() => openLightbox(design)}
          />
        ) : (
          <div className="w-full h-72 bg-gray-50 flex items-center justify-center">
            <span className="text-gray-400 text-sm">Loading...</span>
          </div>
        )}

        {imageError && (
          <div className="w-full h-72 bg-gray-50 flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <div className="text-lg mb-1">—</div>
              <div className="text-xs">Design #{design.id}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function Designs() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [visibleCount, setVisibleCount] = useState(20);
  const [imageURLs, setImageURLs] = useState({});
  const [loading, setLoading] = useState(true);
  const [designs, setDesigns] = useState([]);
  const [inViewItems, setInViewItems] = useState(new Set());

  const visibleDesigns = designs.slice(0, visibleCount);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setInViewItems((prev) => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    const elements = document.querySelectorAll("[data-index]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [visibleDesigns]);

  useEffect(() => {
    const fetchDesignsFromDatabase = async () => {
      if (!database || !storage) {
        setLoading(false);
        return;
      }
  
      try {
        const designsSnapshot = await get(dbRef(database, "designs"));
        const designsData = designsSnapshot.val();
  
        if (!designsData) {
          console.warn("No designs found in database.");
          setLoading(false);
          return;
        }
  
        const entries = Object.entries(designsData);
        const formattedDesigns = entries.map(([key, value]) => ({
          id: value.id || key,
          title: value.title || `Design ${key}`,
          fileName: value.fileName, // <- important
          archived: value.archived || false,
        })).filter(d => d.fileName); // <- skip if fileName is missing
  
        formattedDesigns.sort((a, b) => a.id - b.id);
        setDesigns(formattedDesigns);
  
        const urlPromises = formattedDesigns.map(async (design) => {
          try {
            const imageRef = storageRef(storage, `Designs/${design.fileName}`);
            const downloadUrl = await getDownloadURL(imageRef);
            setImageURLs((prev) => ({ ...prev, [design.id]: downloadUrl }));
          } catch (err) {
            console.warn(`Failed to get image for design ${design.id}:`, err);
          }
        });
  
        await Promise.all(urlPromises);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching designs from Realtime Database:", error);
        setLoading(false);
      }
    };
  
    fetchDesignsFromDatabase();
  }, []);  

  const openLightbox = (design, e) => {
    if (e) e.stopPropagation();
    setSelectedImage(design);
  };

  const closeLightbox = () => setSelectedImage(null);

  const navigateLightbox = (direction) => {
    const currentIndex = designs.findIndex((d) => d.id === selectedImage.id);
    let newIndex;
    if (direction === "next") {
      newIndex = (currentIndex + 1) % designs.length;
    } else {
      newIndex = currentIndex - 1 < 0 ? designs.length - 1 : currentIndex - 1;
    }
    setSelectedImage(designs[newIndex]);
  };

  const loadMore = () => setVisibleCount((prev) => prev + 20);

  return (
    <div className="min-h-screen bg-white pt-[60px]">
      <div className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-100 via-white to-white"></div>
        <div className="relative text-center mt-20">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-extralight text-stone-900 mb-3">
              Portfolio Designs
            </h2>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {loading ? (
          <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-6">
            {Array.from({ length: 20 }).map((_, idx) => (
              <div key={idx} className="break-inside-avoid mb-6">
                <div className="bg-white border border-gray-100 overflow-hidden">
                  <div className="w-full h-72 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-6">
            {visibleDesigns.map((design, index) => (
              <DesignCard
                key={design.id}
                design={design}
                index={index}
                imageURL={imageURLs[design.id]}
                openLightbox={openLightbox}
                inView={inViewItems.has(index)}
              />
            ))}
          </div>
        )}

        {!loading && visibleCount < designs.length && (
          <div className="text-center mt-16">
            <button
              onClick={loadMore}
              className="group relative px-12 py-4 border-2 border-black text-black hover:text-white transition-all duration-500 text-sm uppercase tracking-widest font-medium overflow-hidden"
            >
              <span className="absolute inset-0 bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
              <span className="relative z-10">
                Load More ({designs.length - visibleCount} remaining)
              </span>
            </button>
          </div>
        )}
      </div>

      {selectedImage && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <button
            onClick={closeLightbox}
            className="absolute top-8 right-8 w-12 h-12 rounded-full bg-gray-100 hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center z-20"
          >
            <X size={20} />
          </button>

          <button
            onClick={() => navigateLightbox("prev")}
            className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gray-100/25 hover:bg-black/25 hover:text-white transition-all duration-300 flex items-center justify-center z-20"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => navigateLightbox("next")}
            className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gray-100/25 hover:bg-black/25 hover:text-white transition-all duration-300 flex items-center justify-center z-20"
          >
            <ChevronRight size={20} />
          </button>

          <div className="mx-auto px-20 text-center">
            <img
              src={imageURLs[selectedImage.id]}
              alt={selectedImage.title}
              className="w-full h-auto max-h-[50vh] object-contain mb-8 shadow-2xl"
            />
            <div className="space-y-4">
              <div className="text-xs uppercase tracking-widest text-black">
                Design Collection • {new Date().getFullYear()}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
