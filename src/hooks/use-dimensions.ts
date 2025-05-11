import { RefObject, useEffect, useState } from "react";

const useDimensions = (containerRef: RefObject<HTMLElement | null>) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const currentElement = containerRef.current;

    const getDimensions = () => ({
      width: currentElement?.offsetWidth || 0,
      height: currentElement?.offsetHeight || 0,
    });

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];

      if (entry) {
        setDimensions(getDimensions());
      }
    });

    if (currentElement) {
      resizeObserver.observe(currentElement);
      setDimensions(getDimensions());
    }

    return () => {
      if (currentElement) {
        resizeObserver.unobserve(currentElement);
      }
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  return dimensions;
};

export default useDimensions;
