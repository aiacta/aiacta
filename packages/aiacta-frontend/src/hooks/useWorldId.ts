import { matchPath, useLocation } from 'react-router-dom';

export function useWorldId() {
  const { pathname } = useLocation();

  return matchPath('/world/:worldId/*', pathname)?.params.worldId;
}
