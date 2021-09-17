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

type ProgramInfoData = {
  apy: BigNumber;
  interestDates: BigNumber[];
  isExist: true;
};

export type ProgramInfoProps = {};

export const ProgramInfo = (props: ProgramInfoProps): React.ReactElement => {
  const toast = useToast();
  const { handleSubmit, control } = useForm();
  const { field: programIdField } = useController({
    name: 'programId',
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

  const [programInfo, setProgramInfo] = React.useState<ProgramInfoData>();

  const onSubmit = async (data: { programId: number }) => {
    console.log('program info form submit', data);

    if (stakingContract) {
      try {
        const result: any = await stakingContract.programInfo(data.programId);

        setProgramInfo({ ...result });
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
          Get Program Information
        </Heading>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box mb="2">
            <FormControl id="programId">
              <FormLabel for="programId">Program Id</FormLabel>
              <NumberInput
                name={programIdField.name}
                onChange={(_, id) => programIdField.onChange(id)}
                onBlur={programIdField.onBlur}
              >
                <NumberInputField ref={programIdField.ref} />
              </NumberInput>
            </FormControl>
          </Box>

          <Button type="submit">Submit</Button>
        </form>
      </Box>

      <Box flex={1}>
        <Heading size="md">Result</Heading>
        {!!programInfo && (
          <>
            <Text>{`APY (Annual Percentage Yield): ${
              (programInfo.apy.toNumber() * 100) / 10_000
            }%`}</Text>

            <Text>Interest dates:</Text>
            <Box>
              {programInfo.interestDates.map((interestDate) => (
                <Text key={interestDate.toNumber()}>{`- ${dayjs
                  .unix(interestDate.toNumber())
                  .format('DD/MM/YYYY HH:mm:ss')}`}</Text>
              ))}
            </Box>

            <Text>{`Is exist: ${programInfo.isExist}`}</Text>
          </>
        )}
      </Box>
    </Flex>
  );
};
