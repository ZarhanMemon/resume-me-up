import React from 'react';
import { Link } from 'react-router-dom';
import { Sword, Shield, Crown, Zap, ArrowRight, Star } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sword className="w-8 h-8 text-solo-purple" />
            <span className="text-2xl font-bold text-white">ResumeForge</span>
          </div>
          <div className="space-x-4">
            <Link 
              to="/auth" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link 
              to="/auth" 
              className="bg-solo-purple hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Join Guild
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-6">
            Forge Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-solo-purple to-solo-blue">Legendary</span> Resume
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Level up your career with our anime-inspired resume builder. Create professional resumes with the power of a Shadow Monarch.
          </p>
          <Link 
            to="/auth"
            className="inline-flex items-center bg-gradient-to-r from-solo-purple to-solo-blue hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Start Your Journey
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {[
            {
              icon: Crown,
              title: "Elite Templates",
              description: "Choose from S-Rank templates designed for maximum impact"
            },
            {
              icon: Zap,
              title: "Lightning Fast",
              description: "Create professional resumes in minutes, not hours"
            },
            {
              icon: Shield,
              title: "ATS Optimized",
              description: "Pass through applicant tracking systems like a shadow"
            }
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-solo-gray/30 backdrop-blur-sm border border-solo-purple/30 rounded-xl p-8 text-center hover:border-solo-purple/50 transition-all duration-300">
                <Icon className="w-12 h-12 text-solo-purple mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;