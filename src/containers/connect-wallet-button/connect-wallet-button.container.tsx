import React from 'react';

import { Button, useClipboard } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';

import { Web3Utils } from '../../utils/web3';

export const ConnectWalletButton = (): React.ReactElement | null => {
  const { activate, active } = useWeb3React();
  const {
    activate: jsonRpcActivate,
    active: jsonRpcActive,
    account,
  } = useWeb3React('jsonRpc');
  const [loading, setLoading] = React.useState(false);

  return !active || !jsonRpcActive ? (
    <Button
      isLoading={loading}
      onClick={async () => {
        setLoading(true);
        await activate(Web3Utils.injectedConnector, (error) => {
          console.log('injected connector activate error', error);
        });
        await jsonRpcActivate(Web3Utils.networkConnector, (error) => {
          console.log('network connector activate error', error);
        });
      }}
    >
      Connect wallet
    </Button>
  ) : null;
};
