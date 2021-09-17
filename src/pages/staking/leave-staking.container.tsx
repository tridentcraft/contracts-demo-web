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

type LeaveStakingFormData = {
  stakingId: string;
};

export type LeaveStakingProps = {};

export const LeaveStaking = (props: LeaveStakingProps): React.ReactElement => {
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

  const onSubmit = async (data: LeaveStakingFormData) => {
    console.log('leave staking form submit', data);

    if (stakingContract && coinContract && library) {
      const stakingId = Number(data.stakingId);

      try {
        const leaveStakingTx =
          await stakingContract.populateTransaction.leaveStaking(stakingId);
        const signer = library.getSigner();

        const leaveStakingTxParam = {
          from: await signer.getAddress(),
          to: stakingContract.address,
          data: leaveStakingTx.data,
        };
        const leaveStakingResult = await library.provider.request?.({
          method: 'eth_sendTransaction',
          params: [leaveStakingTxParam],
        });

        console.log('Leave Staking Tx Result', leaveStakingResult);

        toast({
          position: 'bottom-left',
          title: 'Leave Staking successfully',
          status: 'success',
          isClosable: true,
        });
      } catch (error) {
        const { message } = error as Error;
        toast({
          position: 'bottom-left',
          title: 'Contract call failed',
          description: message,
          status: 'error',
          isClosable: true,
        });
      }
    } else {
      toast({
        position: 'bottom-left',
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
          Leave Staking
        </Heading>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box mb="2">
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
