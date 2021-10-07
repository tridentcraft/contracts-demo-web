(window as any).global = window;

import { ethers } from 'ethers';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core';

import App from './App';
import theme from './theme';
import { ContractAddressProvider } from './hooks';

const Web3ReactJsonRpcProvider = createWeb3ReactRoot('jsonRpc');

const getWeb3Provider = (provider: any) =>
  new ethers.providers.Web3Provider(provider);

const getJsonRpcProvider = (provider: any, connector: any) =>
  new ethers.providers.JsonRpcProvider(
    'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
  );

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Web3ReactProvider getLibrary={getWeb3Provider}>
        <Web3ReactJsonRpcProvider getLibrary={getJsonRpcProvider}>
          <ContractAddressProvider>
            <Router>
              <App />
            </Router>
          </ContractAddressProvider>
        </Web3ReactJsonRpcProvider>
      </Web3ReactProvider>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
