// src/pages/Admin.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Trash2,
  Eye,
  X,
  Loader,
  Upload,
} from "lucide-react";

import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  inMemoryPersistence,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  getDatabase,
  ref as dbRef,
  onValue,
  remove as dbRemove,
} from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
  deleteObject,
  uploadBytes,
  listAll,
} from "firebase/storage";

// -------------------------------------------------------------------------------------
// 1) Firebase configuration (read your keys from .env or however you’re storing them)
// -------------------------------------------------------------------------------------
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
const auth = getAuth(firebaseApp);
const db = getDatabase(firebaseApp);
const storage = getStorage(firebaseApp);

// -------------------------------------------------------------------------------------
// 2) AdminAuth component: requires signing in on every page load; auto-logout after 5m idle
// -------------------------------------------------------------------------------------
const AdminAuth = ({ children }) => {
  const [email, setEmail] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Ref to hold the inactivity-timeout ID
  const inactivityTimerRef = useRef(null);

  // Listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setCheckingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  // When authenticated, start inactivity timer and attach activity listeners
  useEffect(() => {
    if (!isAuthenticated) {
      clearInactivityTimer();
      removeActivityListeners();
      return;
    }

    resetInactivityTimer();
    attachActivityListeners();

    return () => {
      clearInactivityTimer();
      removeActivityListeners();
    };
  }, [isAuthenticated]);

  // Inactivity-timer logic: 5 minutes = 300_000 ms
  const LOGOUT_AFTER_MS = 5 * 60 * 1000;

  const resetInactivityTimer = () => {
    clearInactivityTimer();
    inactivityTimerRef.current = window.setTimeout(() => {
      signOut(auth).catch((err) => {
        console.error("Auto-logout error:", err);
      });
    }, LOGOUT_AFTER_MS);
  };

  const clearInactivityTimer = () => {
    if (inactivityTimerRef.current !== null) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  };

  const activityEvents = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];

  const attachActivityListeners = () => {
    activityEvents.forEach((evt) => {
      window.addEventListener(evt, resetInactivityTimer);
    });
  };

  const removeActivityListeners = () => {
    activityEvents.forEach((evt) => {
      window.removeEventListener(evt, resetInactivityTimer);
    });
  };

  // Handle login: use in-memory persistence so page reload or tab close requires fresh sign-in
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await setPersistence(auth, inMemoryPersistence);
      await signInWithEmailAndPassword(auth, email, passwordInput);
      // onAuthStateChanged will set isAuthenticated = true
    } catch (err) {
      console.error("Firebase signIn error:", err);
      setError("Invalid email or password");
    }
  };

  // If still checking auth state, show a spinner
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  // If authenticated, render children (i.e., <AdminPanel />) and no “Log Out” button
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Otherwise, show the sign-in form
  return (
    <div className="mt-20 bg-white flex items-center justify-center">
      <div className="border border-gray-300 p-6 w-full max-w-sm">
        <h2 className="text-xl font-medium text-gray-900 mb-4">Admin Sign In</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
              required
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="p-2 bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-2 px-3 hover:bg-gray-800"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

// -------------------------------------------------------------------------------------
// 3) UploadDesign component (unchanged, aside from imports)
// -------------------------------------------------------------------------------------
const UploadDesign = ({ onUploadSuccess, showModal, setShowModal }) => {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [designId, setDesignId] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);

  // Reset form state whenever the modal closes
  useEffect(() => {
    if (!showModal) {
      setSelectedFile(null);
      setDesignId("");
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    }
  }, [showModal, previewUrl]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile || !designId) {
      alert("Please select a file and enter a design ID");
      return;
    }

    setUploading(true);
    try {
      const imgRef = storageRef(storage, `Designs/${designId}.jpg`);
      await uploadBytes(imgRef, selectedFile);

      setSelectedFile(null);
      setDesignId("");
      setPreviewUrl(null);
      setShowModal(false);
      onUploadSuccess(designId);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setDesignId("");
    setPreviewUrl(null);
    setShowModal(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-300 p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Upload New Design</h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Design ID
                </label>
                <input
                  type="number"
                  value={designId}
                  onChange={(e) => setDesignId(e.target.value)}
                  placeholder="Enter design ID (e.g., 15)"
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
                  required
                  disabled={uploading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image File
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleFileSelect}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
                  required
                  disabled={uploading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: JPG, JPEG, PNG
                </p>
              </div>

              {previewUrl && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview
                  </label>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={previewUrl}
                      alt="Upload preview"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 hover:bg-gray-50"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={uploading || !selectedFile || !designId}
                >
                  {uploading ? (
                    <span className="flex items-center justify-center">
                      <Loader size={16} className="animate-spin mr-2" />
                      Uploading...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <Upload size={16} className="mr-2" />
                      Upload
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

// -------------------------------------------------------------------------------------
// 4) DesignItem component (unchanged)
// -------------------------------------------------------------------------------------
const DesignItem = ({ design, imageURL, likesCount, onDelete }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(design.id);
      setShowConfirm(false);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="border border-gray-200 rounded-lg overflow-hidden group transition-all duration-200">
        <div className="aspect-square bg-gray-100 relative">
          {imageURL ? (
            <img
              src={imageURL}
              alt={`Design ${design.id}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image
            </div>
          )}

          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
            <div className="flex space-x-3">
              {imageURL && (
                <button
                  onClick={() => setShowPreview(true)}
                  className="p-3 bg-white text-black hover:bg-gray-100 rounded-full transition-colors duration-150"
                  title="Preview"
                >
                  <Eye size={16} color="black" />
                </button>
              )}
              {imageURL && (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="p-3 bg-red-600 text-white hover:bg-red-700 rounded-full transition-colors duration-150"
                  title="Delete"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-3 bg-white group-hover:bg-gray-50 transition-colors duration-200">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">Design {design.id}</span>
            <span className="text-gray-500">{(likesCount || 0).toLocaleString()} likes</span>
          </div>
        </div>
      </div>

      {showPreview && imageURL && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setShowPreview(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <X size={24} />
            </button>
            <img
              src={imageURL}
              alt={`Design ${design.id}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-300 p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Delete Design {design.id}?
            </h3>

            <p className="text-gray-600 mb-4 text-sm">
              This will permanently delete the image and all likes data.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 hover:bg-gray-50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <span className="flex items-center justify-center">
                    <Loader size={16} className="animate-spin mr-2" />
                    Deleting...
                  </span>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// -------------------------------------------------------------------------------------
// 5) Main AdminPanel: fetches designs, displays grid, handles upload/delete
// -------------------------------------------------------------------------------------
const AdminPanel = () => {
  const [designs, setDesigns] = useState([]);
  const [imageURLs, setImageURLs] = useState({});
  const [likesMap, setLikesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [designsMetadata, setDesignsMetadata] = useState([]);

  // Discover all images in “Designs/” folder
  const discoverDesigns = async () => {
    try {
      const designsRef = storageRef(storage, "Designs/");
      const result = await listAll(designsRef);

      const urls = {};
      const discoveredDesigns = [];

      await Promise.all(
        result.items.map(async (itemRef) => {
          try {
            const filename = itemRef.name;
            const designId = parseInt(filename.split(".")[0]);
            if (!isNaN(designId)) {
              const downloadUrl = await getDownloadURL(itemRef);
              urls[designId] = downloadUrl;
              discoveredDesigns.push({
                id: designId,
                title: "",
                category: "classic",
                description: "",
              });
            }
          } catch (err) {
            console.log(`Error processing file ${itemRef.name}:`, err);
          }
        })
      );

      discoveredDesigns.sort((a, b) => a.id - b.id);
      return { urls, designs: discoveredDesigns };
    } catch (error) {
      console.error("Error discovering designs:", error);
      return { urls: {}, designs: [] };
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Listen for likes data in Realtime Database
        const likesRef = dbRef(db, "likes");
        onValue(likesRef, (snapshot) => {
          const data = snapshot.val() || {};
          setLikesMap(data);
        });

        // Discover images in Storage
        const { urls, designs } = await discoverDesigns();
        setImageURLs(urls);
        setDesigns(designs);
        setDesignsMetadata(designs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUploadSuccess = async (designId) => {
    try {
      const { urls, designs } = await discoverDesigns();
      setImageURLs(urls);
      setDesigns(designs);
      setDesignsMetadata(designs);
      showNotification(`Design ${designId} uploaded successfully`);
    } catch (error) {
      console.error("Error refreshing after upload:", error);
      showNotification(`Upload completed but failed to refresh`, "error");
    }
  };

  const handleDeleteDesign = async (designId) => {
    try {
      const imgRef = storageRef(storage, `Designs/${designId}.jpg`);
      await deleteObject(imgRef);

      const likesRef = dbRef(db, `likes/${designId}`);
      await dbRemove(likesRef);

      setImageURLs((prev) => {
        const updated = { ...prev };
        delete updated[designId];
        return updated;
      });

      setLikesMap((prev) => {
        const updated = { ...prev };
        delete updated[designId];
        return updated;
      });

      showNotification(`Design ${designId} deleted`);
    } catch (error) {
      console.error("Error deleting design:", error);
      showNotification(`Failed to delete design ${designId}`, "error");
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-6 w-6 animate-spin mx-auto mb-2" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-medium text-gray-900">Admin Panel</h1>
            <p className="text-gray-500 text-sm mt-1">
              {Object.keys(imageURLs).length} images,{" "}
              {Object.values(likesMap).reduce((sum, likes) => sum + likes, 0).toLocaleString()}{" "}
              total likes
            </p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors duration-200 flex items-center space-x-2 text-xs"
          >
            <span>Upload Design</span>
          </button>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`p-3 border text-sm ${
              notification.type === "error"
                ? "bg-red-50 border-red-200 text-red-700"
                : "bg-green-50 border-green-200 text-green-700"
            }`}
          >
            {notification.message}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {designs.map((design) => (
            <DesignItem
              key={design.id}
              design={design}
              imageURL={imageURLs[design.id]}
              likesCount={likesMap[design.id]}
              onDelete={handleDeleteDesign}
            />
          ))}
        </div>
      </div>

      {/* Upload Modal */}
      <UploadDesign
        onUploadSuccess={handleUploadSuccess}
        showModal={showUploadModal}
        setShowModal={setShowUploadModal}
      />
    </div>
  );
};

// -------------------------------------------------------------------------------------
// 6) Default export: wrap AdminPanel in AdminAuth
// -------------------------------------------------------------------------------------
export default function Admin() {
  return (
    <AdminAuth>
      <AdminPanel />
    </AdminAuth>
  );
}
