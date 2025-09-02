
import React from 'react';
import { Box } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-30px) rotate(120deg); }
  66% { transform: translateY(30px) rotate(240deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.1); }
`;

const BackgroundContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  zIndex: -1,
  background: `
    radial-gradient(circle at 20% 20%, rgba(108, 92, 231, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(253, 121, 168, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 60%, rgba(0, 212, 170, 0.05) 0%, transparent 50%),
    linear-gradient(135deg, #0d1117 0%, #161b22 100%)
  `,
}));

const FloatingShape = styled(Box)(({ theme, delay = 0, size = 60, duration = 20 }) => ({
  position: 'absolute',
  width: `${size}px`,
  height: `${size}px`,
  borderRadius: '50%',
  background: `linear-gradient(135deg, 
    rgba(108, 92, 231, 0.1) 0%, 
    rgba(253, 121, 168, 0.1) 100%
  )`,
  animation: `${float} ${duration}s ease-in-out infinite ${delay}s, 
             ${pulse} ${duration * 0.8}s ease-in-out infinite ${delay}s`,
  backdropFilter: 'blur(2px)',
}));

const AnimatedBackground = () => {
  const shapes = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    size: Math.random() * 100 + 40,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 20,
    duration: Math.random() * 15 + 15,
  }));

  return (
    <BackgroundContainer>
      {shapes.map((shape) => (
        <FloatingShape
          key={shape.id}
          size={shape.size}
          delay={shape.delay}
          duration={shape.duration}
          sx={{
            left: `${shape.left}%`,
            top: `${shape.top}%`,
          }}
        />
      ))}
    </BackgroundContainer>
  );
};

export default AnimatedBackground;
