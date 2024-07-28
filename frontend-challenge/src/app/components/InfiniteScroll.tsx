import {
  useRef, isValidElement, useEffect, cloneElement, ReactNode,
  ReactElement,
} from 'react';

type InfiniteScrollProps = {
    children: ReactNode;
    onScrollEnd?: () => void;
}

export function InfiniteScroll({ children, onScrollEnd = () => {} }: InfiniteScrollProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (container) {
        const isAtBottom = container.scrollHeight - container.scrollTop === container.clientHeight;
        if (isAtBottom && onScrollEnd) {
          onScrollEnd();
        }
      }
    };
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [onScrollEnd]);

  const childWithRef = isValidElement(children)
    ? cloneElement(children as ReactElement<any>, { ref: scrollContainerRef })
    : children;

  return (
    <div className="w-full">
      {childWithRef}
    </div>
  );
}
