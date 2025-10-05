import { useState } from 'react';
import { userData } from '../data/userData';
import { GlobalContext } from './GlobalContext';
import { communityData } from '../data/communityData';

export function GlobalProvider({ children }) {
  const [user, setUser] = useState(userData[1]);
  const [activeCommunity, setActiveCommunity] = useState(communityData[0]);

  return (
    <GlobalContext.Provider
      value={{ user, setUser, activeCommunity, setActiveCommunity }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
