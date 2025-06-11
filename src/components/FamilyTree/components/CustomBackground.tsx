import React from 'react';

interface CustomBackgroundProps {
  gridType: 'dots' | 'lines' | 'cross' | 'subtle';
  gap: number;
  color?: string;
  backgroundColor?: string;
  opacity?: number;
  showMajorGrid?: boolean;
  majorGridGap?: number;
  majorGridColor?: string;
  majorGridOpacity?: number;
}

export const CustomBackground: React.FC<CustomBackgroundProps> = ({
  gridType,
  gap,
  color = '#e5e7eb',
  backgroundColor = '#fafafa',
  opacity = 0.3,
  showMajorGrid = false,
  majorGridGap = 100,
  majorGridColor = '#d1d5db',
  majorGridOpacity = 0.1,
}) => {
  const patternId = `custom-pattern-${gridType}`;
  const majorPatternId = `major-pattern-${gridType}`;

  const renderPattern = () => {
    switch (gridType) {
      case 'dots':
        return (
          <pattern
            id={patternId}
            x="0"
            y="0"
            width={gap}
            height={gap}
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx={gap / 2}
              cy={gap / 2}
              r="0.8"
              fill={color}
              opacity={opacity}
            />
          </pattern>
        );

      case 'lines':
        return (
          <pattern
            id={patternId}
            x="0"
            y="0"
            width={gap}
            height={gap}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${gap} 0 L 0 0 0 ${gap}`}
              fill="none"
              stroke={color}
              strokeWidth="0.3"
              opacity={opacity}
            />
          </pattern>
        );

      case 'cross':
        return (
          <pattern
            id={patternId}
            x="0"
            y="0"
            width={gap}
            height={gap}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${gap/2} 0 L ${gap/2} ${gap} M 0 ${gap/2} L ${gap} ${gap/2}`}
              fill="none"
              stroke={color}
              strokeWidth="0.2"
              opacity={opacity * 0.7}
            />
          </pattern>
        );

      case 'subtle':
        return (
          <pattern
            id={patternId}
            x="0"
            y="0"
            width={gap}
            height={gap}
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx={gap / 2}
              cy={gap / 2}
              r="0.5"
              fill={color}
              opacity={opacity * 0.5}
            />
            <path
              d={`M ${gap} 0 L 0 0 0 ${gap}`}
              fill="none"
              stroke={color}
              strokeWidth="0.2"
              opacity={opacity * 0.3}
            />
          </pattern>
        );

      default:
        return null;
    }
  };

  const renderMajorGrid = () => {
    if (!showMajorGrid) return null;

    return (
      <pattern
        id={majorPatternId}
        x="0"
        y="0"
        width={majorGridGap}
        height={majorGridGap}
        patternUnits="userSpaceOnUse"
      >
        <path
          d={`M ${majorGridGap} 0 L 0 0 0 ${majorGridGap}`}
          fill="none"
          stroke={majorGridColor}
          strokeWidth="0.5"
          opacity={majorGridOpacity}
        />
      </pattern>
    );
  };

  return (
    <svg
      className="react-flow__background"
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        zIndex: -1,
      }}
    >
      <defs>
        {renderPattern()}
        {renderMajorGrid()}
      </defs>
      
      {/* Background color */}
      <rect
        width="100%"
        height="100%"
        fill={backgroundColor}
      />
      
      {/* Main grid pattern */}
      <rect
        width="100%"
        height="100%"
        fill={`url(#${patternId})`}
      />
      
      {/* Major grid pattern */}
      {showMajorGrid && (
        <rect
          width="100%"
          height="100%"
          fill={`url(#${majorPatternId})`}
        />
      )}
    </svg>
  );
};
