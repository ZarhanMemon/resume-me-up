import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useResumeStore } from '../store/resumeStore';
import { 
  Save, Download, Eye, ArrowLeft, Plus, Trash2, 
  User, Mail, Phone, MapPin, Globe, Linkedin, Github,
  Briefcase, GraduationCap, Code, Award, Languages
} from 'lucide-react';
import toast from 'react-hot-toast';

const ResumeBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedTemplate = searchParams.get('template');
  
  const { currentResume, createResume, updateResume, setCurrentResume } = useResumeStore();
  const [formData, setFormData] = useState({
    title: '',
    template: selectedTemplate || 'shadow-hunter',
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      website: '',
      linkedin: '',
      github: '',
      summary: ''
    },
    experience: [],
    education: [],
    projects: [],
    skills: {
      technical: [],
      languages: [],
      frameworks: [],
      tools: [],
      soft: []
    },
    certifications: [],
    achievements: [],
    languages: []
  });

  const [activeSection, setActiveSection] = useState('personal');
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    if (id && currentResume && currentResume._id === id) {
      setFormData(currentResume);
    } else if (!id) {
      // New resume
      setFormData(prev => ({
        ...prev,
        template: selectedTemplate || 'shadow-hunter'
      }));
    }
  }, [id, currentResume, selectedTemplate]);

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (section, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addArrayItem = (section, defaultItem = {}) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], defaultItem]
    }));
  };

  const removeArrayItem = (section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      if (id) {
        await updateResume(id, formData);
        toast.success('Resume updated successfully!');
      } else {
        const newResumeId = await createResume(formData);
        if (newResumeId) {
          navigate(`/builder/${newResumeId}`);
          toast.success('Resume created successfully!');
        }
      }
    } catch (error) {
      toast.error('Failed to save resume');
    }
  };

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'projects', label: 'Projects', icon: Code },
    { id: 'skills', label: 'Skills', icon: Award },
    { id: 'additional', label: 'Additional', icon: Languages }
  ];

  const PersonalInfoSection = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <User className="w-5 h-5 text-solo-purple" />
        Personal Information
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
          <input
            type="text"
            value={formData.personalInfo.fullName}
            onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
            className="w-full bg-solo-dark/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-solo-purple focus:outline-none transition-colors"
            placeholder="Enter your full name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
          <input
            type="email"
            value={formData.personalInfo.email}
            onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
            className="w-full bg-solo-dark/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-solo-purple focus:outline-none transition-colors"
            placeholder="your.email@example.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
          <input
            type="tel"
            value={formData.personalInfo.phone}
            onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
            className="w-full bg-solo-dark/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-solo-purple focus:outline-none transition-colors"
            placeholder="+1 (555) 123-4567"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
          <input
            type="text"
            value={formData.personalInfo.address}
            onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
            className="w-full bg-solo-dark/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-solo-purple focus:outline-none transition-colors"
            placeholder="City, State, Country"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
          <input
            type="url"
            value={formData.personalInfo.website}
            onChange={(e) => handleInputChange('personalInfo', 'website', e.target.value)}
            className="w-full bg-solo-dark/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-solo-purple focus:outline-none transition-colors"
            placeholder="https://yourwebsite.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn</label>
          <input
            type="url"
            value={formData.personalInfo.linkedin}
            onChange={(e) => handleInputChange('personalInfo', 'linkedin', e.target.value)}
            className="w-full bg-solo-dark/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-solo-purple focus:outline-none transition-colors"
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Professional Summary</label>
        <textarea
          value={formData.personalInfo.summary}
          onChange={(e) => handleInputChange('personalInfo', 'summary', e.target.value)}
          rows={4}
          className="w-full bg-solo-dark/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-solo-purple focus:outline-none transition-colors resize-none"
          placeholder="Write a compelling professional summary..."
        />
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'personal':
        return <PersonalInfoSection />;
      case 'experience':
        return <div className="text-white">Experience section coming soon...</div>;
      case 'education':
        return <div className="text-white">Education section coming soon...</div>;
      case 'projects':
        return <div className="text-white">Projects section coming soon...</div>;
      case 'skills':
        return <div className="text-white">Skills section coming soon...</div>;
      case 'additional':
        return <div className="text-white">Additional section coming soon...</div>;
      default:
        return <PersonalInfoSection />;
    }
  };

  if (isPreview) {
    return (
      <div className="min-h-screen bg-gradient-dark">
        {/* Preview Header */}
        <div className="bg-solo-gray/20 backdrop-blur-sm border-b border-solo-purple/30 p-4">
          <div className="container mx-auto flex items-center justify-between">
            <button
              onClick={() => setIsPreview(false)}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Editor
            </button>
            <div className="flex items-center gap-4">
              <button className="bg-solo-purple hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Preview Content */}
        <div className="container mx-auto p-8">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {formData.personalInfo.fullName || 'Your Name'}
              </h1>
              <div className="flex justify-center items-center gap-4 text-gray-600">
                {formData.personalInfo.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {formData.personalInfo.email}
                  </span>
                )}
                {formData.personalInfo.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {formData.personalInfo.phone}
                  </span>
                )}
              </div>
            </div>

            {formData.personalInfo.summary && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-solo-purple pb-2">
                  Professional Summary
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {formData.personalInfo.summary}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark flex">
      {/* Sidebar */}
      <div className="w-80 bg-solo-gray/20 backdrop-blur-sm border-r border-solo-purple/30">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </button>
          </div>

          {/* Resume Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Resume Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full bg-solo-dark/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-solo-purple focus:outline-none transition-colors"
              placeholder="My Awesome Resume"
            />
          </div>

          {/* Section Navigation */}
          <nav className="space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeSection === section.id
                      ? 'bg-solo-purple/20 text-solo-purple border border-solo-purple/30'
                      : 'text-gray-300 hover:text-white hover:bg-solo-gray/30'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{section.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="space-y-3 mt-8">
            <button
              onClick={handleSave}
              className="w-full bg-solo-purple hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Resume
            </button>
            <button
              onClick={() => setIsPreview(true)}
              className="w-full bg-solo-blue hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-solo-gray/30 backdrop-blur-sm border border-solo-purple/30 rounded-xl p-8">
            {renderSectionContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;