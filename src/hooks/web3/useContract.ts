import { ethers } from 'ethers';
import React from 'react';

import stakingAbi from '../../resources/contracts-abi/StakingBHOPool.json';
import coinAbi from '../../resources/contracts-abi/CoinBHO.json';

type Options = {
  active?: boolean;
  provider?: ethers.providers.JsonRpcProvider;
  address?: string;
  contractType: 'staking' | 'coin';
};

export const useContract = (options: Options): ethers.Contract | null => {
  const { active, provider, address, contractType } = options;
  const contract = React.useMemo(() => {
    if (active && provider && address) {
      if (contractType === 'staking') {
        return new ethers.Contract(address, stakingAbi, provider.getSigner());
      }
      if (contractType === 'coin') {
        return new ethers.Contract(address, coinAbi, provider.getSigner());
      }
    }
    return null;
  }, [active, provider, address, contractType]);

  return contract;
};
