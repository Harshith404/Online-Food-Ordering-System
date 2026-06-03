import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { userService } from '../services/userService';
import { storage } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Loader from '../components/common/Loader';
import { MdPerson, MdPhone, MdLocationOn, MdEmail, MdCameraAlt, MdSave, MdLink, MdCloudUpload } from 'react-icons/md';

const defaultAvatars = [
  { name: 'Chef', url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=60' },
  { name: 'Rider', url: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=150&auto=format&fit=crop&q=60' },
  { name: 'Pizza Lover', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=150&auto=format&fit=crop&q=60' },
  { name: 'Burger Fan', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&auto=format&fit=crop&q=60' },
  { name: 'Coffee Enthusiast', url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=150&auto=format&fit=crop&q=60' },
  { name: 'Dessert King', url: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=150&auto=format&fit=crop&q=60' }
];

const Profile = () => {
  const { currentUser, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    profilePicUrl: currentUser?.profilePicUrl || ''
  });
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [urlUploading, setUrlUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Sync form state if context loads late or user changes (only runs once on mount/user load)
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
        profilePicUrl: currentUser.profilePicUrl || ''
      });
    }
  }, [currentUser?.uid]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarSelect = (url) => {
    setFormData((prev) => ({ ...prev, profilePicUrl: url }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const storageRef = ref(storage, `profile_pics/${currentUser.uid}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setFormData((prev) => ({ ...prev, profilePicUrl: url }));
      alert("Profile picture uploaded successfully!");
    } catch (err) {
      console.error("Storage upload failed, using local preview", err);
      const localUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, profilePicUrl: localUrl }));
      alert("Firebase Storage is not enabled in your console. Using local preview temporarily. You can also select a default avatar below!");
    } finally {
      setUploading(false);
    }
  };

  // Helper to convert Google Drive share links to direct web preview links
  const convertDriveUrl = (url) => {
    if (!url) return '';
    if (url.includes('drive.google.com')) {
      const regExp = /\/file\/d\/([a-zA-Z0-9_-]+)|id=([a-zA-Z0-9_-]+)/;
      const matches = url.match(regExp);
      if (matches) {
        const fileId = matches[1] || matches[2];
        if (fileId) {
          return `https://docs.google.com/uc?export=view&id=${fileId}`;
        }
      }
    }
    return url;
  };

  const handleUrlUpload = async () => {
    const rawUrl = imageUrlInput.trim();
    if (!rawUrl) {
      alert("Please enter a valid image URL first.");
      return;
    }
    
    // Auto-convert Google Drive links if necessary
    const urlToApply = convertDriveUrl(rawUrl);
    setUrlUploading(true);
    
    try {
      // Attempt to fetch the image to upload it to Firebase Storage
      const response = await fetch(urlToApply);
      if (!response.ok) throw new Error("Failed to fetch image from URL");
      
      const blob = await response.blob();
      if (!blob.type.startsWith('image/')) {
        throw new Error("The URL does not point to a valid image.");
      }
      
      const storageRef = ref(storage, `profile_pics/${currentUser.uid}`);
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);
      
      setFormData((prev) => ({ ...prev, profilePicUrl: url }));
      setImageUrlInput('');
      alert("Profile picture fetched and uploaded to storage successfully!");
    } catch (err) {
      console.warn("Failed to fetch image via browser (possibly CORS). Applying directly as image URL instead.", err);
      
      // Fallback: apply the URL directly to the profile picture
      setFormData((prev) => ({ ...prev, profilePicUrl: urlToApply }));
      setImageUrlInput('');
      alert("Image URL applied! (Note: Could not upload to storage due to browser CORS/security policies, but it will be displayed using the external link.)");
    } finally {
      setUrlUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      alert("Name, Phone, and Address are required.");
      return;
    }
    setSaving(true);
    setSuccess(false);
    try {
      await updateProfile(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile details.");
    } finally {
      setSaving(false);
    }
  };

  if (!currentUser) return <Loader fullPage />;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="pb-4 border-b border-slate-100">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          User Panel
        </span>
        <h1 className="font-display text-2xl font-black text-slate-800 mt-1 flex items-center gap-2">
          Personal Account Profile
        </h1>
      </div>

      {success && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-sm font-semibold text-emerald-600">
          ✓ Profile settings saved successfully!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Picture Card */}
        <div className="md:col-span-1 flex flex-col items-center p-6 rounded-3xl border border-slate-100 bg-white shadow-sm space-y-4">
          <h3 className="font-display text-sm font-bold text-slate-700">Profile Picture</h3>
          
          <div className="relative group h-32 w-32 rounded-full overflow-hidden border-4 border-slate-150 bg-slate-50 flex items-center justify-center">
            {formData.profilePicUrl ? (
              <img 
                src={formData.profilePicUrl} 
                alt="Profile Preview" 
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-4xl text-slate-350">👤</span>
            )}
            
            <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-all duration-300">
              <MdCameraAlt size={24} />
              <span className="text-[10px] mt-1 font-bold">Upload File</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload} 
                className="hidden" 
              />
            </label>
          </div>

          {uploading && <span className="text-xs text-primary-500 font-bold animate-pulse">Uploading file...</span>}

          <p className="text-[10px] text-slate-400 text-center leading-relaxed">
            Hover and click the photo to upload a file, select a default avatar below, or paste a direct image URL.
          </p>

          <div className="w-full pt-3 border-t border-slate-100 space-y-2">
            <label className="block text-[11px] font-bold text-slate-500 text-left flex items-center gap-1">
              <MdLink size={14} className="text-slate-400" />
              Upload Image via URL
            </label>
            <input
              type="url"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all bg-white"
            />
            <button
              type="button"
              onClick={handleUrlUpload}
              disabled={urlUploading || !imageUrlInput.trim()}
              className="w-full rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs py-2 shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              title="Fetch image and upload to storage"
            >
              {urlUploading ? (
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <MdCloudUpload size={14} />
              )}
              <span>Upload Image from URL</span>
            </button>
            {formData.profilePicUrl && formData.profilePicUrl.startsWith('http') && !formData.profilePicUrl.includes('firebasestorage') && (
              <p className="text-[9px] text-amber-600 font-medium leading-normal bg-amber-50 rounded-lg p-1.5 border border-amber-100">
                ⚠️ Current picture is hosted externally. Keep it or upload it to save permanently.
              </p>
            )}
          </div>
        </div>

        {/* Form Details Card */}
        <form onSubmit={handleSubmit} className="md:col-span-2 rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          {/* Email (Read Only) */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address (Primary)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <MdEmail size={20} />
              </div>
              <input
                type="email"
                disabled
                value={currentUser.email}
                className="w-full rounded-xl border border-slate-100 bg-slate-50 pl-10 pr-4 py-2.5 text-slate-500 cursor-not-allowed outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <MdPerson size={20} />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. John Doe"
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                  <MdPhone size={20} />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  maxLength="10"
                  placeholder="e.g. 9876543210"
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Delivery Address *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <MdLocationOn size={20} />
              </div>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Door No, Street Name, Area, City"
                className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-slate-800 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Avatar Choices Grid */}
          <div className="border-t border-slate-50 pt-5">
            <h4 className="text-sm font-bold text-slate-700 mb-3">Choose a Default Avatar</h4>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {defaultAvatars.map((avatar) => (
                <button
                  type="button"
                  key={avatar.name}
                  onClick={() => handleAvatarSelect(avatar.url)}
                  className={`relative h-12 w-12 rounded-full overflow-hidden border-2 transition-all hover:scale-105 active:scale-95 ${
                    formData.profilePicUrl === avatar.url 
                      ? 'border-primary-500 shadow-md ring-2 ring-primary-100' 
                      : 'border-slate-100'
                  }`}
                  title={avatar.name}
                >
                  <img 
                    src={avatar.url} 
                    alt={avatar.name} 
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm px-6 py-3 shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <MdSave size={18} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
