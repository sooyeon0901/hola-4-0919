import React, { FC, ReactNode, useState } from 'react';
import { Marketplace } from './types';
import { MarketplaceContext } from './context';

export const MarketplaceProvider: FC<{ children: ReactNode }> = (props) => {
  const [searching, setSearching] = useState(false);
  const [marketplace, setMarketplace] = useState<Marketplace>();

  return (
    <MarketplaceContext.Provider value={{ searching, marketplace }}>
      {props.children}
    </MarketplaceContext.Provider>
  );
};
