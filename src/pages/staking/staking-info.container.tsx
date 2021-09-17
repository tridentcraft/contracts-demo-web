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

type StakingInfoData = {
  amount: BigNumber;
  startDate: BigNumber;
  programId: number;
  isWithdrawn: boolean;
  isExist: true;
};

export type StakingInfoProps = {};

export const StakingInfo = (props: StakingInfoProps): React.ReactElement => {
  const toast = useToast();
  const { handleSubmit, control, register } = useForm();
  const { field: stakingIdField } = useController({
    name: 'stakingId',
    control,
  });

  const { library, active } = useWeb3React();
  const {
    value: { staking: stakingContractAddress },
  } = useContractAddress();
  const stakingContract = useContract({
    active,
    provider: library,
    address: stakingContractAddress || '',
    contractType: 'staking',
  });

  const [stakingInfo, setStakingInfo] = React.useState<StakingInfoData>();

  const onSubmit = async (data: {
    stakerAddress: string;
    stakingId: number;
  }) => {
    console.log('staking info form submit', data);

    if (stakingContract) {
      try {
        const result: any = await stakingContract.stakingInfo(
          data.stakerAddress,
          data.stakingId
        );

        setStakingInfo({ ...result });
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
          Get Staking Information
        </Heading>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box mb="2">
            <FormControl id="stakerAddress">
              <FormLabel htmlFor="stakerAddress">Staker Address</FormLabel>
              <Input {...register('stakerAddress')} />
            </FormControl>

            <FormControl id="stakingId">
              <FormLabel for="stakingId">Staking Id</FormLabel>
              <NumberInput
                name={stakingIdField.name}
                onChange={(_, id) => stakingIdField.onChange(id)}
                onBlur={stakingIdField.onBlur}
              >
                <NumberInputField ref={stakingIdField.ref} />
              </NumberInput>
            </FormControl>
          </Box>

          <Button type="submit">Submit</Button>
        </form>
      </Box>

      <Box flex={1}>
        <Heading size="md">Result</Heading>
        {!!stakingInfo && (
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
        )}
      </Box>
    </Flex>
  );
};
