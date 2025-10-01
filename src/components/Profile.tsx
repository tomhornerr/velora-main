"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Camera, User, Mail, Phone, MapPin, Calendar, Edit3, Save, X, Upload, Star, TrendingUp, TrendingDown, BarChart3, Home, Search, Map, FileText, Bell, Settings } from "lucide-react";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  profileImage: string;
  totalSearches: number;
  propertiesViewed: number;
  mapSearches: number;
  favoriteAreas: string[];
  searchHistory: string[];
  preferences: {
    propertyType: string;
    budgetRange: string;
    bedrooms: number;
    bathrooms: number;
  };
}

interface ProfileProps {
  onNavigate?: (view: string, options?: { showMap?: boolean }) => void;
}

const Profile: React.FC<ProfileProps> = ({ onNavigate }) => {
  // Load profile data from localStorage or use defaults
  const getInitialProfileData = (): ProfileData => {
    const saved = localStorage.getItem('velora-profile-data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error parsing saved profile data:', error);
      }
    }
    return {
      name: "Alex Thompson",
      email: "alex.thompson@email.com",
      phone: "+44 7700 900123",
      location: "Bristol, UK",
      joinDate: "March 2024",
      profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      totalSearches: 47,
      propertiesViewed: 23,
      mapSearches: 15,
      favoriteAreas: ["Clifton", "Redland", "Cotham"],
      searchHistory: ["3 bed houses in Clifton", "2 bed flats near university", "Family homes in Redland"],
      preferences: {
        propertyType: "Semi-Detached",
        budgetRange: "£300k - £500k",
        bedrooms: 3,
        bathrooms: 2
      }
    };
  };

  const [profileData, setProfileData] = React.useState<ProfileData>(getInitialProfileData);

  const [isEditing, setIsEditing] = React.useState(false);
  const [editData, setEditData] = React.useState<Partial<ProfileData>>({});
  const [imageUpload, setImageUpload] = React.useState<File | null>(null);

  // Load profile data from localStorage on component mount
  React.useEffect(() => {
    const saved = localStorage.getItem('velora-profile-data');
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        setProfileData(parsedData);
      } catch (error) {
        console.error('Error loading saved profile data:', error);
      }
    }
  }, []);

  const handleEdit = () => {
    setEditData(profileData);
    setIsEditing(true);
  };

  const handleSave = () => {
    const updatedProfileData = { ...profileData, ...editData };
    setProfileData(updatedProfileData);
    // Save to localStorage
    localStorage.setItem('velora-profile-data', JSON.stringify(updatedProfileData));
    setIsEditing(false);
    setEditData({});
  };

  const handleCancel = () => {
    setEditData({});
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageUpload(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditData({ ...editData, profileImage: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const Card = ({ children, className = "", ...props }: any) => (
    <div
      className={`bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8 ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
      }}
      {...props}
    >
      {children}
    </div>
  );

  const StatCard = ({ title, value, change, trend, icon: Icon, color }: any) => (
    <div className="text-center p-3 bg-white/10 rounded-lg">
      <div className="flex items-center justify-center mb-2">
        <div className={`p-1.5 rounded-full ${color.replace('text-', 'bg-').replace('-400', '-100')} mr-2`}>
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
        <span className="text-xs text-gray-300">{title}</span>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="flex items-center justify-center">
        <span className="text-xs text-green-400">{change}</span>
        <TrendingUp className="w-3 h-3 text-green-400 ml-1" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-800 via-green-900 to-emerald-900 overflow-y-auto">
      <div className="w-full min-h-screen py-12 pl-6 pr-8 ml-14 lg:ml-16 flex items-center justify-center">
        <div className="w-full max-w-5xl">

          {/* Main Profile Card */}
          <Card className="relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Profile Info */}
              <div className="space-y-6">
                {/* Profile Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                  <div className="flex items-center space-x-2">
                    {!isEditing ? (
                      <button
                        onClick={handleEdit}
                        className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 rounded-md px-3 py-1.5 text-white font-medium transition-colors duration-200 hover:from-blue-500/30 hover:to-purple-500/30 hover:border-white/30"
                      >
                        <div className="flex items-center">
                          <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                          <span className="text-xs">Edit</span>
                        </div>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handleSave}
                          className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-white/20 rounded-md px-3 py-1.5 text-white font-medium transition-colors duration-200 hover:from-green-500/30 hover:to-emerald-500/30 hover:border-white/30"
                        >
                          <div className="flex items-center">
                            <Save className="w-3.5 h-3.5 mr-1.5" />
                            <span className="text-xs">Save</span>
                          </div>
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-gradient-to-r from-gray-500/20 to-slate-500/20 backdrop-blur-sm border border-white/20 rounded-md px-3 py-1.5 text-white font-medium transition-colors duration-200 hover:from-gray-500/30 hover:to-slate-500/30 hover:border-white/30"
                        >
                          <div className="flex items-center">
                            <X className="w-3.5 h-3.5 mr-1.5" />
                            <span className="text-xs">Cancel</span>
                          </div>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  {/* Profile Image */}
                  <div className="relative">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 shadow-lg">
                      <img
                        src={isEditing && editData.profileImage ? editData.profileImage : profileData.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {isEditing && (
                      <label className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-full cursor-pointer transition-colors">
                        <Camera className="w-3 h-3" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* Profile Details */}
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                        {isEditing ? (
                          <input
                            key="name-input"
                            type="text"
                            value={editData.name || profileData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            onKeyPress={handleKeyPress}
                            className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                            autoFocus
                          />
                        ) : (
                          <p className="text-white font-semibold">{profileData.name}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        {isEditing ? (
                          <input
                            key="email-input"
                            type="email"
                            value={editData.email || profileData.email}
                            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                            onKeyPress={handleKeyPress}
                            className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                          />
                        ) : (
                          <p className="text-white font-semibold">{profileData.email}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                        {isEditing ? (
                          <input
                            key="phone-input"
                            type="tel"
                            value={editData.phone || profileData.phone}
                            onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                            onKeyPress={handleKeyPress}
                            className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                          />
                        ) : (
                          <p className="text-white font-semibold">{profileData.phone}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                        {isEditing ? (
                          <input
                            key="location-input"
                            type="text"
                            value={editData.location || profileData.location}
                            onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                            onKeyPress={handleKeyPress}
                            className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                          />
                        ) : (
                          <p className="text-white font-semibold">{profileData.location}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">Member since {profileData.joinDate}</span>
                    </div>
                  </div>
                </div>

                {/* Activity Stats */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Activity Overview</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-white/10 rounded-lg">
                      <div className="flex items-center justify-center mb-2">
                        <Search className="w-4 h-4 text-blue-400 mr-2" />
                        <span className="text-xs text-gray-300">Searches</span>
                      </div>
                      <div className="text-xl font-bold text-white">{profileData.totalSearches}</div>
                      <div className="text-xs text-green-400">+12%</div>
                    </div>
                    <div className="text-center p-3 bg-white/10 rounded-lg">
                      <div className="flex items-center justify-center mb-2">
                        <Home className="w-4 h-4 text-green-400 mr-2" />
                        <span className="text-xs text-gray-300">Viewed</span>
                      </div>
                      <div className="text-xl font-bold text-white">{profileData.propertiesViewed}</div>
                      <div className="text-xs text-green-400">+8%</div>
                    </div>
                    <div className="text-center p-3 bg-white/10 rounded-lg">
                      <div className="flex items-center justify-center mb-2">
                        <Map className="w-4 h-4 text-purple-400 mr-2" />
                        <span className="text-xs text-gray-300">Map</span>
                      </div>
                      <div className="text-xl font-bold text-white">{profileData.mapSearches}</div>
                      <div className="text-xs text-green-400">+18%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Preferences & Actions */}
              <div className="space-y-6">
                {/* Property Preferences */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Property Preferences</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                      <span className="text-gray-300">Type</span>
                      <span className="text-white font-medium">{profileData.preferences.propertyType}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                      <span className="text-gray-300">Budget</span>
                      <span className="text-white font-medium">{profileData.preferences.budgetRange}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                      <span className="text-gray-300">Bedrooms</span>
                      <span className="text-white font-medium">{profileData.preferences.bedrooms}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                      <span className="text-gray-300">Bathrooms</span>
                      <span className="text-white font-medium">{profileData.preferences.bathrooms}</span>
                    </div>
                  </div>
                </div>

                {/* Favorite Areas */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Favorite Areas</h3>
                  <div className="space-y-2">
                    {profileData.favoriteAreas.map((area, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-blue-400 mr-2" />
                          <span className="text-white text-sm">{area}</span>
                        </div>
                        <Star className="w-4 h-4 text-yellow-400" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <button 
                      onClick={() => {
                        onNavigate?.('search');
                      }}
                      className="w-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 text-white font-medium transition-colors duration-200 hover:from-blue-500/30 hover:to-cyan-500/30 hover:border-white/30"
                    >
                      <div className="flex items-center">
                        <Search className="w-4 h-4 mr-3" />
                        <span className="text-sm">New Property Search</span>
                      </div>
                    </button>
                    <button 
                      onClick={() => {
                        onNavigate?.('search', { showMap: true });
                      }}
                      className="w-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 text-white font-medium transition-colors duration-200 hover:from-green-500/30 hover:to-emerald-500/30 hover:border-white/30"
                    >
                      <div className="flex items-center">
                        <Map className="w-4 h-4 mr-3" />
                        <span className="text-sm">View Map</span>
                      </div>
                    </button>
                    <button 
                      onClick={() => {
                        onNavigate?.('upload');
                      }}
                      className="w-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 text-white font-medium transition-colors duration-200 hover:from-purple-500/30 hover:to-pink-500/30 hover:border-white/30"
                    >
                      <div className="flex items-center">
                        <Upload className="w-4 h-4 mr-3" />
                        <span className="text-sm">Upload Property</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
