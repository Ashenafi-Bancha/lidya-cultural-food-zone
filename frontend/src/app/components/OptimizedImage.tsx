import React, { useState, useEffect } from "react";

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export function OptimizedImage({ fallbackSrc, onError, ...props }: OptimizedImageProps) {
  const [src, setSrc] = useState(props.src);
  const [triedFallback, setTriedFallback] = useState(false);
  const [didError, setDidError] = useState(false);

  useEffect(() => {
    setSrc(props.src);
    setTriedFallback(false);
    setDidError(false);
  }, [props.src]);

  const handleError: React.ReactEventHandler<HTMLImageElement> = (e) => {
    if (fallbackSrc && !triedFallback) {
      setTriedFallback(true);
      setSrc(fallbackSrc);
      return;
    }
    setDidError(true);
    onError?.(e);
  };

  if (didError) {
    return (
      <div
        className={`inline-block bg-[#2e1a0c]/20 text-center align-middle ${props.className ?? ''}`}
        style={props.style}
      >
        <div className="flex items-center justify-center w-full h-full">
          <img src={ERROR_IMG_SRC} alt="Error loading image" />
        </div>
      </div>
    );
  }

  return (
    <img
      {...props}
      src={src}
      loading={props.loading ?? "lazy"}
      decoding={props.decoding ?? "async"}
      onError={handleError}
    />
  );
}
