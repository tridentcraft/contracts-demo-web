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
  Heading,
  Input,
  NumberInput,
  NumberInputField,
  Text,
  useToast,
} from '@chakra-ui/react';
// eslint-disable-next-line
import { BigNumber } from '@ethersproject/bignumber';
import { useWeb3React } from '@web3-react/core';

import { useContract, useContractAddress } from '../../hooks';

type EmergencyWithdrawFormData = {
  staker: string;
  stakingId: string;
};

export type EmergencyWithdrawProps = {};

export const EmergencyWithdraw = (
  props: EmergencyWithdrawProps
): React.ReactElement => {
  const toast = useToast();
  const { handleSubmit, register } = useForm();

  const { library, active } = useWeb3React<ethers.providers.Web3Provider>();
  const {
    value: { staking: stakingContractAddress, coin: coinContractAddress },
  } = useContractAddress();
  const stakingContract = useContract({
    active,
    provider: library,
    address: stakingContractAddress || '',
    contractType: 'staking',
  });
  const coinContract = useContract({
    active,
    provider: library,
    address: coinContractAddress || '',
    contractType: 'coin',
  });

  const onSubmit = async (data: EmergencyWithdrawFormData) => {
    console.log('emergency withdraw form submit', data);

    if (stakingContract && coinContract && library) {
      const stakingId = Number(data.stakingId);
      const { staker } = data;

      try {
        const emergencyWithdrawTx =
          await stakingContract.populateTransaction.emergencyWithdraw(
            staker,
            stakingId
          );
        const signer = library.getSigner();
        const emergencyWithdrawTxParam = {
          from: await signer.getAddress(),
          to: stakingContract.address,
          data: emergencyWithdrawTx.data,
        };
        const emergencyWithdrawResult = await library.provider.request?.({
          method: 'eth_sendTransaction',
          params: [emergencyWithdrawTxParam],
        });

        console.log('Emergency Withdraw Tx Result', emergencyWithdrawResult);

        toast({
          position: 'bottom-left',
          title: 'Emergency Withdraw successfully',
          status: 'success',
          isClosable: true,
        });
      } catch (error) {
        const { message } = error as Error;
        toast({
          title: 'Contract call failed',
          description: message,
          status: 'error',
          isClosable: true,
        });
      }
    } else {
      toast({
        title: 'Contract not connected',
        status: 'error',
        isClosable: true,
      });
    }
  };

  return (
    <Flex boxShadow="md" px="2" py="2">
      <Box flex={2} mr="2">
        <Heading size="md" mb="2">
          Emergency Withdraw
        </Heading>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box mb="2">
            <FormControl id="staker">
              <FormLabel htmlFor="staker">Staker Address</FormLabel>
              <Input {...register('staker')} />
            </FormControl>

            <FormControl id="stakingId">
              <FormLabel htmlFor="stakingId">Staking Id</FormLabel>
              <Input {...register('stakingId')} />
            </FormControl>
          </Box>

          <Button type="submit">Submit</Button>
        </form>
      </Box>

      <Box flex={1}>
        <Heading size="md">Result</Heading>
        {/* {!!stakingInfo && (
          <>
            <Text>{`Staking Amount: ${ethers.utils.formatEther(
              stakingInfo.amount
            )} BHO`}</Text>

            <Text>{`Start date: ${dayjs
              .unix(stakingInfo.startDate.toNumber())
              .format('DD/MM/YYYY HH:mm:ss')}`}</Text>

            <Text>{`Program Id: ${stakingInfo.programId}`}</Text>

            <Text>{`Is withdrawn: ${stakingInfo.isWithdrawn}`}</Text>

            <Text>{`Is exist: ${stakingInfo.isExist}`}</Text>
          </>
        )} */}
      </Box>
    </Flex>
  );
};
