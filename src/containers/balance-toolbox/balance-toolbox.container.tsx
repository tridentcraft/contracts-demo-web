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
import { useContract, useContractAddress } from '../../hooks';

export const BalanceToolbox = (): React.ReactElement => {
  const { library, active } =
    useWeb3React<ethers.providers.JsonRpcProvider>('jsonRpc');
  const toast = useToast();
  const { handleSubmit, register } = useForm();
  const { value: contractAddrs } = useContractAddress();
  const coinContract = useContract({
    contractType: 'coin',
    active,
    provider: library,
    address: contractAddrs.coin || '',
  });
  const [balance, setBalance] = React.useState('');

  const onSubmit = async (data: { address: number }) => {
    if (!coinContract) {
      toast({
        title: 'Coin contract not connected',
        status: 'error',
        isClosable: true,
      });
      return;
    }
    try {
      const bal = await coinContract.balanceOf(data.address);
      setBalance(bal);
    } catch (error) {
      const { message } = error as Error;
      toast({
        title: 'Set timestamp failed',
        description: message,
        status: 'error',
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      {!!balance && (
        <Text>{`Balance: ${ethers.utils.formatEther(balance)} BHO`}</Text>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl id="address">
          <FormLabel>Address</FormLabel>
          <Input {...register('address')} />
        </FormControl>
        <Flex>
          <Button mt="2" alignSelf="flex-end" type="submit">
            Submit
          </Button>
        </Flex>
      </form>
    </Box>
  );
};
