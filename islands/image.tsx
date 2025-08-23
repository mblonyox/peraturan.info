import clsx from "clsx";
import type { ComponentProps } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

type Props = ComponentProps<"img">;

export default function Image({ ...imageProps }: Props) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (imageRef.current?.complete) setImageLoaded(true);
  }, []);
  return (
    <>
      <img
        {...imageProps}
        ref={imageRef}
        className={clsx("w-full", imageProps.className)}
        onLoad={() => setImageLoaded(true)}
      />
      {!imageLoaded && (
        <div
          className={clsx(
            "w-full aspect-square skeleton",
            imageProps.className,
          )}
        />
      )}
    </>
  );
}
