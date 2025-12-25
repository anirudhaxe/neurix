/**
 * Custom animations for the landing page
 *
 * This file contains keyframe animations used throughout
 * the landing page components.
 */

export const landingAnimations = `
  @keyframes float {
    0%,
    100% {
      transform: translateY(0px) rotate(0deg);
    }
    50% {
      transform: translateY(-20px) rotate(5deg);
    }
  }

  @keyframes bounce-slow {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes gradient-animate {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .animate-float {
    animation: float 10s ease-in-out infinite;
  }

  .animate-bounce-slow {
    animation: bounce-slow 3s ease-in-out infinite;
  }

  .bg-gradient-animate {
    background-size: 200% 200%;
    animation: gradient-animate 4s ease infinite;
  }

  /* Animation delay utilities */
  .delay-100 {
    animation-delay: 100ms;
  }

  .delay-200 {
    animation-delay: 200ms;
  }

  .delay-700 {
    animation-delay: 700ms;
  }
`;
