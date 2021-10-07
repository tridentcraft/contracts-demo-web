import { ethers } from 'ethers';

import { InjectedConnector } from '@web3-react/injected-connector';
import { NetworkConnector } from '@web3-react/network-connector';

export class Web3Utils {
  static injectedConnector = new InjectedConnector({
    supportedChainIds: [31337, 4],
  });

  static networkConnector = new NetworkConnector({
    urls: {
      31337: 'http://localhost:8545',
      4: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    },
    defaultChainId: 31337,
  });

  static setNextBlockTimestamp = async (
    provider: ethers.providers.JsonRpcProvider,
    time: number
  ): Promise<void> => {
    await provider.send('evm_setNextBlockTimestamp', [time]);
  };

  static setTimestamp = async (
    provider: ethers.providers.JsonRpcProvider,
    time: number
  ): Promise<void> => {
    await provider.send('evm_mine', [time]);
  };
}
