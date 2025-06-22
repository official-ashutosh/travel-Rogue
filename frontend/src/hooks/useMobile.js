import useMediaQuery from './useMediaQuery';

// Hook to detect mobile devices
const useMobile = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  return isMobile;
};

export default useMobile;
