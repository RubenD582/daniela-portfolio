// src/pages/Admin.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Trash2,
  X,
  Loader,
  Upload,
  ArrowLeft,
  Plus,
  Heart,
  Image as ImageIcon,
  Archive,
  ArchiveRestore,
} from "lucide-react";

import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  inMemoryPersistence,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  getDatabase,
  ref as dbRef,
  onValue,
  remove as dbRemove,
  set,
  update,
} from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
  deleteObject,
  uploadBytes,
} from "firebase/storage";

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

const ForgotPassword = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox and spam folder.");
    } catch (err) {
      console.error("Password reset error:", err);
      
      switch (err.code) {
        case "auth/user-not-found":
          setError("No account found with this email address.");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        case "auth/too-many-requests":
          setError("Too many reset requests. Please try again later.");
          break;
        default:
          setError("Failed to send reset email. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-100 p-8 shadow-sm">
          <button
            onClick={onBack}
            className="flex items-center text-gray-400 hover:text-gray-600 transition-colors mb-8"
          >
            <ArrowLeft size={16} className="mr-2" />
            <span className="text-sm">Back</span>
          </button>

          <div className="mb-8">
            <h1 className="text-2xl font-light text-gray-900 mb-2">Reset Password</h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-gray-900 transition-colors text-sm"
                required
                disabled={isLoading}
                autoComplete="username"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm">
                {error}
              </div>
            )}

            {message && (
              <div className="p-4 bg-green-50 border border-green-100 text-green-600 text-sm">
                {message}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-3 px-4 hover:bg-black transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader size={16} className="animate-spin mr-2" />
                  Sending...
                </span>
              ) : (
                "Send Reset Email"
              )}
            </button>
          </form>

          {message && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <button
                onClick={onBack}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Return to sign in
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AdminAuth = ({ children }) => {
  const [email, setEmail] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  useEffect(() => {
    signOut(auth).catch((err) => {
      console.error("Error signing out on mount:", err);
    });
  }, []);

  const inactivityTimerRef = useRef(null);

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await setPersistence(auth, inMemoryPersistence);
      await signInWithEmailAndPassword(auth, email, passwordInput);
    } catch (err) {
      console.error("Firebase signIn error:", err);
      setError("Invalid email or password");
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-6 w-6 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  if (showForgotPassword) {
    return (
      <ForgotPassword onBack={() => setShowForgotPassword(false)} />
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-100 p-8 shadow-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-light text-gray-900 mb-2">Admin Access</h1>
            <p className="text-gray-500 text-sm">Sign in to manage your designs</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-gray-900 transition-colors text-sm"
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-gray-900 transition-colors text-sm"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-3 px-4 hover:bg-black transition-colors duration-200 text-sm font-medium"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <button
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Forgot your password?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const UploadDesign = ({ onUploadSuccess, showModal, setShowModal }) => {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [designName, setDesignName] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!showModal) {
      setSelectedFile(null);
      setDesignName("");
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
      
      if (!designName) {
        const fileName = file.name.split('.')[0];
        setDesignName(fileName);
      }
    }
  };

  const generateUniqueId = () => {
    return Date.now().toString();
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    setUploading(true);
    try {
      const uniqueId = generateUniqueId();
      const fileName = `${uniqueId}.jpg`;
      
      const imgRef = storageRef(storage, `Designs/${fileName}`);
      await uploadBytes(imgRef, selectedFile);
      
      const designData = {
        id: uniqueId,
        name: designName.trim() || selectedFile.name.split('.')[0],
        fileName: fileName,
        createdAt: Date.now(),
        archived: false
      };
      
      const designRef = dbRef(db, `designs/${uniqueId}`);
      await set(designRef, designData);

      setSelectedFile(null);
      setDesignName("");
      setPreviewUrl(null);
      setShowModal(false);
      onUploadSuccess(uniqueId);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setDesignName("");
    setPreviewUrl(null);
    setShowModal(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-medium text-gray-900">Upload New Design</h2>
          <button
            onClick={resetForm}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleUpload} className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Design Name (Optional)
              </label>
              <input
                type="text"
                value={designName}
                onChange={(e) => setDesignName(e.target.value)}
                placeholder="Enter design name"
                className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-gray-900 transition-colors text-sm"
                disabled={uploading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty to use filename
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Image File
              </label>
              <div className="border-2 border-dashed border-gray-200 p-6 text-center hover:border-gray-300 transition-colors">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                  required
                  disabled={uploading}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    {selectedFile ? selectedFile.name : "Choose file or drag here"}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    JPG, JPEG, PNG up to 10MB
                  </span>
                </label>
              </div>
            </div>

            {previewUrl && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Preview
                </label>
                <div className="border border-gray-200 overflow-hidden">
                  <img
                    src={previewUrl}
                    alt="Upload preview"
                    className="w-full h-48 object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-3 mt-8 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 px-4 py-3 text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gray-900 text-white hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              disabled={uploading || !selectedFile}
            >
              {uploading ? (
                <span className="flex items-center justify-center">
                  <Loader size={16} className="animate-spin mr-2" />
                  Uploading...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Upload size={16} className="mr-2" />
                  Upload Design
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DesignItem = ({ design, imageURL, likesCount, onDelete, onArchive }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(design.id);
      setShowDetails(false);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleArchive = async () => {
    setIsArchiving(true);
    try {
      await onArchive(design.id, !design.archived);
      setShowDetails(false);
    } catch (error) {
      console.error("Archive failed:", error);
    } finally {
      setIsArchiving(false);
    }
  };

  return (
    <>
      <div 
        className={`group cursor-pointer transition-all duration-200 hover:scale-105 ${
          design.archived ? 'opacity-60' : ''
        }`}
        onClick={() => setShowDetails(true)}
      >
        <div className="w-full pb-[100%] bg-gray-100 relative overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
          {imageURL ? (
            <img
              src={imageURL}
              alt={design.name || `Design ${design.id}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-gray-300" />
            </div>
          )}
          
          {!imageLoaded && imageURL && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          )}
          
          {design.archived && (
            <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs font-medium">
              <Archive size={12} className="inline mr-1" />
              Archived
            </div>
          )}
          
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-xl"></div>
        </div>
      </div>

      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 md:p-6">
          <div className="bg-white w-full max-w-4xl max-h-[95vh] md:max-h-[90vh] overflow-hidden rounded-lg shadow-2xl flex flex-col md:flex-row">
            <div className="flex-1 bg-white relative min-h-[40vh] md:min-h-0">
              <button
                onClick={() => setShowDetails(false)}
                className="absolute top-4 right-4 z-10 p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full transition-all duration-150 shadow-sm"
              >
                <X size={16} className="text-gray-600" />
              </button>
              
              {imageURL ? (
                <img
                  src={imageURL}
                  alt={design.name || `Design ${design.id}`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="h-16 w-16 text-gray-300" />
                </div>
              )}
            </div>

            <div className="w-full md:w-80 bg-white flex flex-col max-h-[55vh] md:max-h-full">
              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="mb-6 md:mb-8">
                  <h2 className="text-xl md:text-2xl font-light text-gray-900 mb-2">
                    {design.name || `Design ${design.id}`}
                  </h2>
                  <div className="flex items-center text-gray-500">
                    <Heart className="h-4 w-4 mr-2" />
                    <span className="text-base md:text-lg font-light">
                      {(likesCount || 0).toLocaleString()} likes
                    </span>
                  </div>
                </div>

                <div className="space-y-4 md:space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Design Name</h3>
                    <p className="text-gray-600">{design.name || 'Untitled'}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Design ID</h3>
                    <p className="text-gray-600 font-mono text-sm">{design.id}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Created</h3>
                    <p className="text-gray-600">
                      {design.createdAt ? new Date(design.createdAt).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Engagement</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Likes</span>
                        <span className="font-medium text-gray-900">
                          {(likesCount || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Status</h3>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        design.archived ? 'bg-gray-400' : 'bg-green-400'
                      }`}></div>
                      <span className="text-sm text-gray-600">
                        {design.archived ? 'Archived' : 'Published'}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 p-6 md:p-8 bg-white space-y-3">
                    <button
                      onClick={handleArchive}
                      disabled={isArchiving}
                      className={`w-full py-3 px-4 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium rounded-lg ${
                        design.archived 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {isArchiving ? (
                        <span className="flex items-center justify-center">
                          <Loader size={16} className="animate-spin mr-2" />
                          {design.archived ? 'Unarchiving...' : 'Archiving...'}
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          {design.archived ? (
                            <>
                              <ArchiveRestore size={16} className="mr-2" />
                              Unarchive
                            </>
                          ) : (
                            <>
                              <Archive size={16} className="mr-2" />
                              Archive
                            </>
                          )}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="w-full bg-gray-900 text-white py-3 px-4 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium rounded-lg"
                    >
                      {isDeleting ? (
                        <span className="flex items-center justify-center">
                          <Loader size={16} className="animate-spin mr-2" />
                          Deleting...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <Trash2 size={16} className="mr-2" />
                          Delete
                        </span>
                      )}
                    </button>
                    
                    {/* <button
                      onClick={() => setShowDetails(false)}
                      className="w-full mt-3 text-gray-600 hover:text-gray-900 transition-colors text-sm"
                    >
                      Close
                    </button> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const AdminPanel = () => {
  const [designs, setDesigns] = useState([]);
  const [imageURLs, setImageURLs] = useState({});
  const [likesMap, setLikesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  const fetchDesigns = async () => {
    try {
      const designsRef = dbRef(db, "designs");
      onValue(designsRef, async (snapshot) => {
        const designsData = snapshot.val() || {};
        const designsList = Object.values(designsData);
        
        const urls = {};
        await Promise.all(
          designsList.map(async (design) => {
            if (design.fileName) {
              try {
                const imgRef = storageRef(storage, `Designs/${design.fileName}`);
                const downloadUrl = await getDownloadURL(imgRef);
                urls[design.id] = downloadUrl;
              } catch (err) {
                console.log(`Error getting URL for ${design.fileName}:`, err);
              }
            }
          })
        );
        
        setDesigns(designsList);
        setImageURLs(urls);
        setLoading(false);
      });

      const likesRef = dbRef(db, "likes");
      onValue(likesRef, (snapshot) => {
        const data = snapshot.val() || {};
        setLikesMap(data);
      });
    } catch (error) {
      console.error("Error fetching designs:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesigns();
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleUploadSuccess = () => {
    showNotification("Design uploaded successfully");
  };

  const handleArchiveDesign = async (designId, archived) => {
    try {
      const designRef = dbRef(db, `designs/${designId}`);
      await update(designRef, { archived });
      
      showNotification(`Design ${archived ? 'archived' : 'unarchived'} successfully`);
    } catch (error) {
      console.error("Error archiving design:", error);
      showNotification(`Failed to ${archived ? 'archive' : 'unarchive'} design`, "error");
      throw error;
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

      showNotification(`Design ${designId} deleted successfully`);
    } catch (error) {
      console.error("Error deleting design:", error);
      showNotification(`Failed to delete design ${designId}`, "error");
      throw error;
    }
  };

  const totalLikes = Object.values(likesMap).reduce((sum, likes) => sum + likes, 0);
  const totalDesigns = Object.keys(imageURLs).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-6 w-6 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 text-sm">Loading designs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-[73px]">
      <div className="border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            {/* <div>
              <h1 className="text-2xl font-light text-gray-900 mb-2">Design Management</h1>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <span className="flex items-center">
                  <ImageIcon className="h-4 w-4 mr-1" />
                  {totalDesigns} designs
                </span>
                <span className="flex items-center">
                  <Heart className="h-4 w-4 mr-1" />
                  {totalLikes.toLocaleString()} total likes
                </span>
              </div>
            </div> */}
            <div></div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-gray-900 text-white px-6 py-3 hover:bg-black transition-colors duration-200 flex items-center space-x-2 text-sm font-medium"
            >
              <Plus size={16} />
              <span>Upload Design</span>
            </button>
          </div>
        </div>
      </div>

      {notification && (
        <div className="fixed top-6 right-6 z-50">
          <div
            className={`p-4 border shadow-lg text-sm font-medium ${
              notification.type === "error"
                ? "bg-red-50 border-red-100 text-red-700"
                : "bg-green-50 border-green-100 text-green-700"
            }`}
          >
            {notification.message}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {totalDesigns === 0 ? (
          <div className="text-center py-16">
            <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-900 mb-2">NO DESIGNS YET</h2>
            <p className="text-gray-500 text-sm mb-6">Get started by uploading your first design</p>
            {/* <button
              onClick={() => setShowUploadModal(true)}
              className="bg-gray-900 text-white px-6 py-3 hover:bg-black transition-colors duration-200 text-sm font-medium"
            >
              UPLOAD
            </button> */}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
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
        )}
      </div>

      <UploadDesign
        onUploadSuccess={handleUploadSuccess}
        showModal={showUploadModal}
        setShowModal={setShowUploadModal}
      />
    </div>
  );
};

export default function Admin() {
  return (
    <AdminAuth>
      <AdminPanel />
    </AdminAuth>
  );
}