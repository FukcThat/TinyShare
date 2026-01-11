import { useEffect } from 'react';
import { useGlobal } from '../context/useGlobal';
import { useNavigate } from 'react-router';
import { InvalidCommunityId } from '../lib/InvalidCommunityId';

export default function useCommunityRouteGuard() {
  const { activeCommunity } = useGlobal();
  const nav = useNavigate();

  useEffect(() => {
    if (!activeCommunity) return;
    if (activeCommunity.id === InvalidCommunityId) nav('/');
  }, [activeCommunity, nav]);
}
