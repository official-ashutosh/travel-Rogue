import useMediaQuery from './useMediaQuery';

// Hook to detect mobile devices
const useMobile = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  return isMobile;
};

// Hook to detect mobile devices (alias for compatibility)
export const useIsMobile = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  return isMobile;
};

export default useMobile;
