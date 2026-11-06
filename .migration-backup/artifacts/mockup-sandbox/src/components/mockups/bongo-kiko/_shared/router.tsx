import { createContext, useContext, useEffect, useState, type ComponentProps, type ReactNode } from 'react';

type RouterContextValue = {
  location: string;
  setLocation: (path: string) => void;
};

const RouterContext = createContext<RouterContextValue | null>(null);

function readHashPath() {
  return typeof window === 'undefined' ? '/bongo-kiko' : window.location.hash.slice(1) || '/bongo-kiko';
}

export function Router({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState(readHashPath);

  useEffect(() => {
    const syncLocation = () => setLocationState(readHashPath());
    window.addEventListener('hashchange', syncLocation);
    return () => window.removeEventListener('hashchange', syncLocation);
  }, []);

  const setLocation = (path: string) => {
    setLocationState(path);
    if (window.location.hash.slice(1) !== path) window.location.hash = path;
  };

  return <RouterContext.Provider value={{ location, setLocation }}>{children}</RouterContext.Provider>;
}

export function useLocation(): [string, (path: string) => void] {
  const router = useContext(RouterContext);
  if (!router) throw new Error('Bongo & Kiko preview links must be inside Router.');
  return [router.location, router.setLocation];
}

type LinkProps = ComponentProps<'a'> & { href: string };

export function Link({ href, onClick, ...props }: LinkProps) {
  const router = useContext(RouterContext);
  if (!router) throw new Error('Bongo & Kiko preview links must be inside Router.');

  return (
    <a
      {...props}
      href={`#${href}`}
      onClick={event => {
        onClick?.(event);
        if (!event.defaultPrevented) router.setLocation(href);
      }}
    />
  );
}
