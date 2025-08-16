import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useResumeStore } from '../store/resumeStore';
import { 
  User, FileText, Plus, Search, Filter, Download, Edit3, 
  Trash2, Copy, BarChart3, Settings, LogOut, Crown,
  Sword, Shield, Target, Trophy, Zap, Eye
} from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const { user, logout } = useAuthStore();
  const { resumes, fetchResumes, deleteResume, duplicateResume, isLoading } = useResumeStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const filteredResumes = resumes.filter(resume =>
    resume.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { 
      label: 'Total Resumes', 
      value: resumes.length, 
      icon: FileText, 
      change: '+2 this month',
      color: 'from-blue-500 to-purple-600'
    },
    { 
      label: 'Total Views', 
      value: resumes.reduce((acc, resume) => acc + (resume.views || 0), 0), 
      icon: Eye, 
      change: '+12% this week',
      color: 'from-green-500 to-blue-500'
    },
    { 
      label: 'Downloads', 
      value: resumes.reduce((acc, resume) => acc + (resume.downloads || 0), 0), 
      icon: Download, 
      change: '+8% this week',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      label: 'Hunter Level', 
      value: user?.level || 1, 
      icon: Crown, 
      change: `${user?.hunterRank || 'E-Rank'}`,
      color: 'from-yellow-500 to-red-500'
    }
  ];

  const sidebarItems = [
    { id: 'overview', label: 'Command Center', icon: BarChart3 },
    { id: 'resumes', label: 'Resume Arsenal', icon: FileText },
    { id: 'templates', label: 'Template Library', icon: Sword },
    { id: 'settings', label: 'Hunter Settings', icon: Settings }
  ];

  const handleCreateResume = () => {
    navigate('/builder');
  };

  const handleEditResume = (resumeId) => {
    navigate(`/builder/${resumeId}`);
  };

  const handleDeleteResume = async (resumeId) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      await deleteResume(resumeId);
    }
  };

  const handleDuplicateResume = async (resumeId) => {
    await duplicateResume(resumeId);
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-solo-purple to-solo-blue rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name}! 
        </h1>
        <p className="text-purple-100">
          You're currently at Level {user?.level} • {user?.hunterRank}
        </p>
        <div className="mt-4 bg-white/20 rounded-full h-2">
          <div 
            className="bg-white rounded-full h-2 transition-all duration-500"
            style={{ width: `${((user?.experience || 0) / ((user?.level || 1) * 100)) * 100}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-solo-gray/30 backdrop-blur-sm border border-solo-purple/30 rounded-xl p-6 hover:border-solo-purple/50 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  <p className="text-solo-purple text-sm mt-1">{stat.change}</p>
                </div>
                <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Resumes */}
      <div className="bg-solo-gray/30 backdrop-blur-sm border border-solo-purple/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-solo-purple" />
            Recent Arsenal
          </h3>
          <Link 
            to="/builder"
            className="text-solo-purple hover:text-purple-400 text-sm font-medium"
          >
            View All
          </Link>
        </div>
        
        {resumes.slice(0, 3).map((resume) => (
          <div key={resume._id} className="flex items-center justify-between p-3 bg-solo-dark/50 rounded-lg mb-3 last:mb-0">
            <div>
              <h4 className="text-white font-medium">{resume.title}</h4>
              <p className="text-gray-400 text-sm">
                Modified: {new Date(resume.lastModified).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">{resume.views || 0} views</span>
              <button
                onClick={() => handleEditResume(resume._id)}
                className="text-solo-purple hover:text-purple-400 p-1"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        
        {resumes.length === 0 && (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No resumes in your arsenal yet</p>
            <button
              onClick={handleCreateResume}
              className="bg-solo-purple hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
            >
              Forge Your First Resume
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const ResumesTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Shield className="w-6 h-6 text-solo-purple" />
          Resume Arsenal
        </h2>
        <button 
          onClick={handleCreateResume}
          className="bg-gradient-to-r from-solo-purple to-solo-blue hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Forge New Resume
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search your arsenal..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-solo-dark/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-solo-purple focus:outline-none transition-colors"
        />
      </div>

      {/* Resume Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-solo-gray/30 rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-gray-700 rounded mb-4"></div>
              <div className="h-3 bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-700 rounded mb-4"></div>
              <div className="flex gap-2">
                <div className="h-8 bg-gray-700 rounded flex-1"></div>
                <div className="h-8 w-8 bg-gray-700 rounded"></div>
                <div className="h-8 w-8 bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResumes.map((resume) => (
            <div key={resume._id} className="bg-solo-gray/30 backdrop-blur-sm border border-solo-purple/30 rounded-xl p-6 hover:border-solo-purple/50 transition-all duration-300 group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white group-hover:text-solo-purple transition-colors line-clamp-2">
                    {resume.title}
                  </h3>
                  <p className="text-gray-400 text-sm capitalize">Template: {resume.template}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    Modified: {new Date(resume.lastModified).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  resume.status === 'active' ? 'bg-green-500/20 text-green-400' : 
                  resume.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {resume.status}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {resume.views || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  {resume.downloads || 0}
                </span>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handleEditResume(resume._id)}
                  className="flex-1 bg-solo-purple/20 hover:bg-solo-purple/30 text-solo-purple py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  Edit
                </button>
                <button 
                  onClick={() => handleDuplicateResume(resume._id)}
                  className="bg-gray-700/50 hover:bg-gray-700 text-gray-400 hover:text-white p-2 rounded-lg transition-all duration-300"
                  title="Duplicate"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteResume(resume._id)}
                  className="bg-red-600/20 hover:bg-red-600/30 text-red-400 p-2 rounded-lg transition-all duration-300"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredResumes.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No resumes found</h3>
          <p className="text-gray-400 mb-6">
            {searchTerm ? 'Try adjusting your search terms' : 'Start building your professional arsenal'}
          </p>
          <button
            onClick={handleCreateResume}
            className="bg-gradient-to-r from-solo-purple to-solo-blue hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
          >
            Create Your First Resume
          </button>
        </div>
      )}
    </div>
  );

  const TemplatesTab = () => {
    const templates = [
      {
        id: 'shadow-hunter',
        name: 'Shadow Hunter',
        description: 'Elite template for senior professionals',
        rank: 'S-Rank',
        features: ['ATS Optimized', 'Modern Design', 'Dark Theme'],
        preview: 'https://via.placeholder.com/300x400/1f2937/8b5cf6?text=Shadow+Hunter'
      },
      {
        id: 'iron-warrior',
        name: 'Iron Warrior',
        description: 'Bold template for leadership roles',
        rank: 'A-Rank',
        features: ['Professional', 'Bold Headers', 'Clean Layout'],
        preview: 'https://via.placeholder.com/300x400/374151/3b82f6?text=Iron+Warrior'
      },
      {
        id: 'assassin-blade',
        name: 'Assassin Blade',
        description: 'Sleek template for tech professionals',
        rank: 'B-Rank',
        features: ['Tech-Focused', 'Minimalist', 'Skills Highlight'],
        preview: 'https://via.placeholder.com/300x400/111827/6366f1?text=Assassin+Blade'
      }
    ];

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Sword className="w-6 h-6 text-solo-purple" />
          Template Library
        </h2>
        <p className="text-gray-400">Choose your weapon and forge the perfect resume</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="group cursor-pointer">
              <div className="bg-solo-gray/30 backdrop-blur-sm border border-solo-purple/30 rounded-xl overflow-hidden hover:border-solo-purple/50 transition-all duration-300 hover:scale-105">
                <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
                  <img 
                    src={template.preview} 
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-solo-purple/90 text-white px-2 py-1 rounded-full text-xs font-bold">
                      {template.rank}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2">{template.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{template.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.features.map((feature, index) => (
                      <span key={index} className="bg-solo-purple/20 text-solo-purple px-2 py-1 rounded text-xs">
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => {
                      // Navigate to builder with selected template
                      navigate(`/builder?template=${template.id}`);
                    }}
                    className="w-full bg-gradient-to-r from-solo-purple to-solo-blue hover:from-purple-700 hover:to-blue-700 text-white py-2 rounded-lg font-medium transition-all duration-300"
                  >
                    Select Template
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const SettingsTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <Settings className="w-6 h-6 text-solo-purple" />
        Hunter Settings
      </h2>
      
      <div className="bg-solo-gray/30 backdrop-blur-sm border border-solo-purple/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Profile Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Hunter Name</label>
            <input
              type="text"
              defaultValue={user?.name}
              className="w-full bg-solo-dark/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-solo-purple focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              defaultValue={user?.email}
              className="w-full bg-solo-dark/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-solo-purple focus:outline-none transition-colors"
            />
          </div>
          <button className="bg-solo-purple hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors">
            Update Profile
          </button>
        </div>
      </div>

      <div className="bg-solo-gray/30 backdrop-blur-sm border border-red-500/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Danger Zone</h3>
        <p className="text-gray-400 mb-4">Once you delete your account, there is no going back.</p>
        <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'resumes':
        return <ResumesTab />;
      case 'templates':
        return <TemplatesTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex">
      {/* Sidebar */}
      <div className="w-64 bg-solo-gray/20 backdrop-blur-sm border-r border-solo-purple/30">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <Sword className="w-8 h-8 text-solo-purple" />
            <span className="text-xl font-bold text-white">ResumeForge</span>
          </div>
          
          {/* User Info */}
          <div className="bg-solo-purple/20 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-solo-purple to-solo-blue rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">{user?.name}</p>
                <p className="text-solo-purple text-sm">{user?.hunterRank}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-solo-purple/20 text-solo-purple border border-solo-purple/30'
                      : 'text-gray-300 hover:text-white hover:bg-solo-gray/30'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="absolute bottom-6 left-6 right-6">
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Dashboard;