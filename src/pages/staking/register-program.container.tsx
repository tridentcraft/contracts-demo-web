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

type RegisterProgramFormData = {
  apy: string;
  interestDates: string[];
};

export type RegisterProgramProps = {};

export const RegisterProgram = (
  props: RegisterProgramProps
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

  const [datesLength, setDatesLength] = React.useState(0);

  const onSubmit = async (data: RegisterProgramFormData) => {
    console.log('Register Program form submit', data);

    if (stakingContract && library) {
      const apy = BigNumber.from(data.apy);
      const { interestDates } = data;

      try {
        const registerProgramTx = await stakingContract.registerProgram(
          apy,
          interestDates.map((date) => BigNumber.from(date))
        );

        await registerProgramTx.wait();

        console.log('Register Program Tx Result');

        toast({
          position: 'bottom-left',
          title: 'Register program successfully',
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
          Register program
        </Heading>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box mb="2">
            <FormControl id="apy">
              <FormLabel htmlFor="apy">APY</FormLabel>
              <Input {...register('apy')} />
            </FormControl>

            <Box>
              {new Array(datesLength).fill(0).map((_, idx) => {
                const key = `interestDates.${idx}`;
                return (
                  <FormControl key={key} id={key}>
                    <FormLabel
                      htmlFor={key}
                    >{`Interest date ${idx}`}</FormLabel>
                    <Input {...register(key)} mb="2" />
                  </FormControl>
                );
              })}
            </Box>
            <Button
              onClick={() => {
                setDatesLength((_length) => _length + 1);
              }}
            >
              Add new date
            </Button>
          </Box>

          <Button type="submit">Submit</Button>
        </form>
      </Box>

      <Box flex={1}>
        <Heading size="md">Result</Heading>
      </Box>
    </Flex>
  );
};
