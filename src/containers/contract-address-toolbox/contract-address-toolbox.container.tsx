import dayjs from 'dayjs';
import { ethers } from 'ethers';
import React from 'react';
import { useController, useForm } from 'react-hook-form';

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  Text,
  useToast,
  Input,
} from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';

import { Web3Utils } from '../../utils/web3';
import {
  useContract,
  useContractAddress,
  useContractAddressInput,
} from '../../hooks';

export const ContractAddressToolbox = (): React.ReactElement => {
  const { library, active } =
    useWeb3React<ethers.providers.JsonRpcProvider>('jsonRpc');
  const toast = useToast();
  const { handleSubmit, register } = useForm();
  const { address: stakingContractAddr, inputUI: stakingAddrInputUI } =
    useContractAddressInput({
      title: 'Staking Contract Address',
      key: 'staking',
    });
  const { address: coinContractAddr, inputUI: coinAddrInputUI } =
    useContractAddressInput({
      title: 'BHO Contract Address',
      key: 'coin',
    });

  const { address: safeContractAddr, inputUI: safeAddrInputUI } =
    useContractAddressInput({
      title: 'Safe Contract Address',
      key: 'gnosis-safe',
    });

  return (
    <Box>
      <Box mb="4" boxShadow="md" px="2" py="2">
        {stakingAddrInputUI}
      </Box>

      <Box mb="4" boxShadow="md" px="2" py="2">
        {coinAddrInputUI}
      </Box>

      <Box mb="4" boxShadow="md" px="2" py="2">
        {safeAddrInputUI}
      </Box>
    </Box>
  );
};
