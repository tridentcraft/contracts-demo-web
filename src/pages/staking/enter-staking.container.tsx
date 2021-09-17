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

type EnterStakingFormData = {
  amount: string;
  programId: string;
};

export type EnterStakingProps = {};

export const EnterStaking = (props: EnterStakingProps): React.ReactElement => {
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

  const onSubmit = async (data: EnterStakingFormData) => {
    console.log('enter staking form submit', data);

    if (stakingContract && coinContract && library) {
      const amount = ethers.utils.parseUnits(data.amount);
      const programId = Number(data.programId);

      try {
        // const approveTx = await coinContract.populateTransaction.approve(
        //   stakingContract.address,
        //   amount
        // );
        // const signer = library.getSigner();
        // const approveTxParam = {
        //   from: await signer.getAddress(),
        //   to: coinContract.address,
        //   data: approveTx.data,
        // };

        // const approveResult = await library.provider.request?.({
        //   method: 'eth_sendTransaction',
        //   params: [approveTxParam],
        // });

        // console.log('Approve Tx Result', approveResult);

        // const enterStakingTx =
        //   await stakingContract.populateTransaction.enterStaking(
        //     programId,
        //     amount
        //   );
        // const enterStakingTxParam = {
        //   from: await signer.getAddress(),
        //   to: stakingContract.address,
        //   data: enterStakingTx.data,
        // };
        // const enterStakingResult = await library.provider.request?.({
        //   method: 'eth_sendTransaction',
        //   params: [enterStakingTxParam],
        // });

        // console.log('Enter Staking Tx Result', enterStakingResult);

        const approveTx = await coinContract.approve(
          stakingContract.address,
          amount
        );
        console.log('Approve Tx Before wait');

        await approveTx.wait();

        console.log('Approve Tx Result');

        const stakingTx = await stakingContract.enterStaking(programId, amount);

        console.log('Staking Tx Before wait');

        const stakingTxResult = await stakingTx.wait();

        console.log('Staking Tx Result', stakingTxResult);

        toast({
          position: 'bottom-left',
          title: 'Enter staking successfully',
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
          Enter Staking
        </Heading>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box mb="2">
            <FormControl id="programId">
              <FormLabel htmlFor="programId">Program Id</FormLabel>
              <Input {...register('programId')} />
            </FormControl>

            <FormControl id="amount">
              <FormLabel htmlFor="amount">Staking Amount (in BHO)</FormLabel>
              <Input {...register('amount')} />
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
