// src/pages/Designs.jsx
import React, { useState, useEffect } from 'react';
import {
  X,
  Heart,
  Eye,
  Share2,
  ChevronLeft,
  ChevronRight,
  Share,
} from 'lucide-react';

import { initializeApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  onValue,
  runTransaction,
} from 'firebase/database';

import design1 from '../assets/Designs/1.JPG';
import design2 from '../assets/Designs/2.JPG';
import design3 from '../assets/Designs/3.JPG';
import design4 from '../assets/Designs/4.JPG';
import design5 from '../assets/Designs/5.JPG';
import design6 from '../assets/Designs/6.JPG';
import design7 from '../assets/Designs/7.JPG';
import design8 from '../assets/Designs/8.JPG';
import design9 from '../assets/Designs/9.JPG';
import design10 from '../assets/Designs/10.JPG';
import design11 from '../assets/Designs/11.JPG';
import design12 from '../assets/Designs/12.JPG';
import design13 from '../assets/Designs/13.JPG';
import design14 from '../assets/Designs/14.JPG';

console.log(import.meta.env.VITE_FIREBASE_API_KEY)

// ----------------------------------------------------------------------------
// 1) Initialize Firebase with your Realtime Database URL:
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
// ----------------------------------------------------------------------------

export default function Designs() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);
  const [visibleCount, setVisibleCount] = useState(12);
  const [isLoading, setIsLoading] = useState(true);

  // 2) Use localStorage to seed which design IDs have been "liked" by this browser/user
  //    We store an array of IDs under the key 'likedDesigns' in localStorage.
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = window.localStorage.getItem("likedDesigns");
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch (e) {
      return new Set();
    }
  });

  // Holds the up-to-date "likes" count for every design ID from Firebase
  const [likesMap, setLikesMap] = useState({});

  // 3) Static design metadata (we’ll pull likes from Firebase instead of hard-coding)
  const designs = [
    { id: 1, src: design1, title: "", category: "classic", description: "" },
    { id: 2, src: design2, title: "", category: "classic", description: "" },
    { id: 3, src: design3, title: "", category: "classic", description: "" },
    { id: 4, src: design4, title: "", category: "classic", description: "" },
    { id: 5, src: design5, title: "", category: "classic", description: "" },
    { id: 6, src: design6, title: "", category: "classic", description: "" },
    { id: 7, src: design7, title: "", category: "classic", description: "" },
    { id: 8, src: design8, title: "", category: "classic", description: "" },
    { id: 9, src: design9, title: "", category: "classic", description: "" },
    {
      id: 10,
      src: design10,
      title: "",
      category: "classic",
      description: "",
    },
    {
      id: 11,
      src: design11,
      title: "",
      category: "classic",
      description: "",
    },
    {
      id: 12,
      src: design12,
      title: "",
      category: "classic",
      description: "",
    },
    {
      id: 13,
      src: design13,
      title: "",
      category: "classic",
      description: "",
    },
    {
      id: 14,
      src: design14,
      title: "",
      category: "classic",
      description: "",
    },
  ];

  // 4) Define categories including the new "Liked" option.
  //    We recalc `count` on each render so that "Liked" shows the correct number.
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

  // 5) Compute filteredDesigns based on selectedCategory, including "liked"
  let filteredDesigns = [];
  if (selectedCategory === "all") {
    filteredDesigns = designs;
  } else if (selectedCategory === "liked") {
    filteredDesigns = designs.filter((d) => favorites.has(d.id));
  } else {
    filteredDesigns = designs.filter(
      (d) => d.category === selectedCategory
    );
  }

  const visibleDesigns = filteredDesigns.slice(0, visibleCount);

  // ----------------------------------------------------------------------------
  // 6) On mount: listen to the entire "/likes" node in Realtime Database and populate likesMap
  useEffect(() => {
    const allLikesRef = ref(db, "likes");
    const unsubscribe = onValue(allLikesRef, (snapshot) => {
      const data = snapshot.val() || {};
      // data is an object mapping { "1": 10, "2": 5, ... }
      setLikesMap(data);
    });

    // Stop loading spinner after a short delay
    const timer = setTimeout(() => setIsLoading(false), 800);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);
  // ----------------------------------------------------------------------------

  // 7) Generic function to change likes by +1 or -1 in Firebase
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

  // 8) Toggle favorite in localStorage + update Firebase accordingly
  const handleHeartClick = (id, e) => {
    e.stopPropagation();

    if (favorites.has(id)) {
      // Already liked → unlike
      changeLikes(id, -1);
      setFavorites((prev) => {
        const copy = new Set(prev);
        copy.delete(id);
        // Write updated array to localStorage
        window.localStorage.setItem(
          "likedDesigns",
          JSON.stringify(Array.from(copy))
        );
        return copy;
      });
    } else {
      // Not yet liked → like
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
    e.stopPropagation();
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
        currentIndex - 1 < 0
          ? filteredDesigns.length - 1
          : currentIndex - 1;
    }
    setSelectedImage(filteredDesigns[newIndex]);
  };

  const loadMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-black/5 border-t-black/50 rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      {/* <div className="relative overflow-hidden text-black">
        <div className="absolute inset-0"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-light mb-6 tracking-tight">
            Design Gallery
          </h1>
          <p className="text-lg font-montserrat font-extralight opacity-90">
            Explore my collection of stunning nails
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </div> */}

      {/* Filter Bar */}
			{/* <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md mt-5">
				<div className="max-w-7xl mx-auto px-6 py-4">
					<div className="flex justify-center">
						<div className="inline-flex space-x-2 overflow-x-auto flex-nowrap scrollbar-hide">
							{categories.map((category) => (
								<button
									key={category.id}
									onClick={() => {
										setSelectedCategory(category.id);
										setVisibleCount(12);
									}}
									className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
										selectedCategory === category.id
											? "bg-[#F2A692] text-white scale-101"
											: "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-101"
									}`}
								>
									{category.name}
									<span className="ml-2 text-xs opacity-75">
										({category.count})
									</span>
								</button>
							))}
						</div>
					</div>
				</div>
			</div> */}

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-10 mt-6">
        <div className="columns-2 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-6">
          {visibleDesigns.map((design, index) => (
            <div
              key={design.id}
              className="break-inside-avoid group cursor-pointer transform transition-all duration-500 hover:scale-[1.02]"
              style={{
                animationDelay: `${index * 50}ms`,
                animation: "fadeInUp 0.6s ease-out forwards",
              }}
            >
              <div className="relative bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500">
                <div className="relative overflow-hidden">
                  <img
                    src={design.src}
                    alt={design.title}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    onClick={() => openLightbox(design)}
                  />

                  {/* Hover Overlay */}
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
                        {/* Heart icon: toggle local favorite + update Firebase */}
												<div className="flex items-center space-x-2">
													<button
														onClick={e => handleHeartClick(design.id, e)}
														className={`p-2 rounded-full transition-colors duration-300 ${
															favorites.has(design.id)
																? 'bg-red-500 text-white'
																: 'bg-white/20 text-white hover:bg-white/30'
														}`}
													>
														<Heart
															size={16}
															fill={favorites.has(design.id) ? 'currentColor' : 'none'}
														/>
													</button>
													<span className="text-white font-medium text-xs">
														{(likesMap[design.id] ?? 0).toLocaleString()}
														{/*  {likesMap[design.id] == 1 ? "like" : "likes"} */}
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
                </div>
                {/* Show the current like count below each thumbnail */}
                {/* <div className="px-4 py-3 flex items-center justify-between text-sm text-gray-700">
                  <span>{likesMap[design.id] ?? 0} likes</span>
                  <span className="capitalize bg-gray-100 px-2 py-1 rounded-full text-xs">
                    {design.category}
                  </span>
                </div> */}
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < filteredDesigns.length && (
          <div className="text-center mt-16 mb-10">
            <button
              onClick={loadMore}
              className="px-5 py-3 text-xs font-montserrat bg-black text-white rounded-full font-medium transform hover:scale-105 transition-all duration-300"
            >
              Load More Designs ({filteredDesigns.length - visibleCount} remaining)
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
								src={selectedImage.src}
								alt={selectedImage.title}
								className="block w-full h-auto max-h-[60vh] object-contain"
							/>
							{/* Optional caption area (uncomment if needed) */}
							{/*
							<div className="mt-4 text-center">
								<h2 className="text-sm font-medium text-gray-700">
									{selectedImage.title}
								</h2>
							</div>
							*/}
						</div>
					</div>

					{/* Buttons & Like Count (positioned below the white Polaroid frame) */}
					<div className="mt-4 w-full max-w-md">
						<div className="flex items-center justify-between">
							{/* Heart icon: toggle local favorite + update Firebase */}
							<div className="flex items-center space-x-2">
								<button
									onClick={(e) => handleHeartClick(selectedImage.id, e)}
									className={`p-2 rounded-full transition-colors duration-300 ${
										favorites.has(selectedImage.id)
											? 'bg-red-500 text-white'
											: 'bg-white/20 text-white hover:bg-white/30'
									}`}
								>
									<Heart
										size={16}
										fill={favorites.has(selectedImage.id) ? 'currentColor' : 'none'}
									/>
								</button>
								<span className="text-white font-medium text-sm">
									{(likesMap[selectedImage.id] ?? 0).toLocaleString()} {likesMap[selectedImage.id] == 1 ? "like" : "likes"}
								</span>
							</div>

							{/* <div className="flex gap-2">
								<div
									onClick={(e) => shareDesign(selectedImage, e)}
									className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-300"
								>
									<Share2 size={16} />
								</div>
							</div> */}
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
