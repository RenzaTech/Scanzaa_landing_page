import React, { forwardRef } from 'react';

const ScanzaLogo = forwardRef(({
  className = '',
  iconOnly = false,
  size = 'default',
  layout = 'horizontal', // 'horizontal' or 'vertical'
  useImageAsset = false,
  iconRef = null,
  wordmarkRef = null,
  taglineRef = null,
  taglineText = 'SCAN DISCOVER DINE',
  showTagline = false,
  plusColor = '#00D2C4'
}, ref) => {
  const iconSizes = {
    small: 'w-6 h-6',
    navbar: 'w-8 h-8',
    default: 'w-10 h-10',
    large: 'w-16 h-16',
    splash: 'w-24 h-24 sm:w-36 sm:h-36'
  };

  const textSizes = {
    small: 'text-base',
    navbar: 'text-xl',
    default: 'text-2xl',
    large: 'text-4xl',
    splash: 'text-4xl sm:text-6xl'
  };

  const taglineSizes = {
    small: 'text-[8px]',
    navbar: 'text-[9px]',
    default: 'text-[10px]',
    large: 'text-xs',
    splash: 'text-xs sm:text-sm font-semibold tracking-[0.3em]'
  };

  const isHorizontal = layout === 'horizontal';

  // Direct exact image asset mode
  if (useImageAsset) {
    const imageSrc = isHorizontal 
      ? '/images/scanza-logo-horizontal.jpg' 
      : '/images/scanza-logo-vertical.png';

    const imageWidths = {
      small: 'max-w-[120px]',
      navbar: 'max-w-[140px]',
      default: 'max-w-[180px]',
      splash: 'max-w-[280px] sm:max-w-[360px]'
    };

    return (
      <div ref={ref} className={`select-none flex items-center justify-center ${className}`}>
        <img
          src={imageSrc}
          alt="SCANZAA Logo"
          className={`w-full ${imageWidths[size] || imageWidths.default} object-contain mix-blend-screen bg-transparent filter drop-shadow-[0_0_15px_rgba(0,210,196,0.25)]`}
        />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`select-none flex ${
        isHorizontal ? 'flex-row items-center gap-3' : 'flex-col items-center justify-center'
      } ${className}`}
    >
      {/* Official SCANZAA 'S' Icon — transparent PNG melts seamlessly into background */}
      <div
        ref={iconRef}
        className={`relative ${iconSizes[size] || iconSizes.default} flex items-center justify-center shrink-0`}
      >
        <img
          src="/images/scanza-s-icon.png"
          alt="SCANZAA S Icon"
          className="w-full h-full object-contain select-none pointer-events-none"
          draggable="false"
        />
      </div>

      {/* Brand Wordmark & Tagline */}
      {!iconOnly && (
        <div className={`flex flex-col ${isHorizontal ? 'items-start' : 'items-center mt-3 text-center'}`}>
          {/* SCANZA Wordmark */}
          <div 
            ref={wordmarkRef}
            className={`font-extrabold tracking-tight leading-none ${textSizes[size] || textSizes.default}`}
          >
            <span className="text-white">SCAN</span>
            <span className="text-[#00D2C4]">ZAA</span>
          </div>

          {/* Subtitle Tagline */}
          {showTagline && (
            <div 
              ref={taglineRef}
              className={`font-medium tracking-[0.3em] text-[#8B9696] uppercase mt-2.5 ${taglineSizes[size] || taglineSizes.default}`}
            >
              {taglineText}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

ScanzaLogo.displayName = 'ScanzaLogo';

export default ScanzaLogo;
