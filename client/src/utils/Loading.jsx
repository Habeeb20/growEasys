import React from 'react';
import LoadingLogo from '../assets/growEasy3.jpg';

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-80 z-50">
      <div className="flex flex-col items-center space-y-4">
        {/* Rotating Round Logo Loader */}
        <div className="relative w-16 h-16">
          <img
            src={LoadingLogo}
            alt="growEasy Loading"
            className="absolute inset-0 w-full h-full object-cover rounded-full animate-spin-slow"
          />
        </div>
        {/* Animated Text */}
        <div className="flex space-x-1">
          <h1 className="text-2xl font-bold text-light-deep-green tracking-wide">
            {'growEasy'.split('').map((char, index) => (
              <span
                key={index}
                className="inline-block animate-bounce"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {char}
              </span>
            ))}
          </h1>
        </div>
        {/* Tagline */}
        <p className="text-sm text-light-purple animate-pulse">Empowering Professionals Worldwide</p>
      </div>
    </div>
  );
};

export default Loading;