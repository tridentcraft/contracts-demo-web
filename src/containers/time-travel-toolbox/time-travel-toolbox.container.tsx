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
} from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';

import { Web3Utils } from '../../utils/web3';

export const TimeTravelToolbox = (): React.ReactElement => {
  const { library, active } =
    useWeb3React<ethers.providers.JsonRpcProvider>('jsonRpc');
  const [timestamp, setTimestamp] = React.useState<number>();
  const toast = useToast();
  const { handleSubmit, control } = useForm();
  const { field: timestampField } = useController({
    name: 'timestamp',
    control,
  });

  React.useEffect(() => {
    const timerId = setInterval(async () => {
      if (library) {
        const block = await library?.getBlock('latest');
        setTimestamp(block?.timestamp);
      }
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [active, library]);

  const onSubmit = async (data: { timestamp: number }) => {
    if (!active || !library) {
      toast({
        title: 'Web3 Provider not connected',
        status: 'error',
        isClosable: true,
      });
      return;
    }
    try {
      await Web3Utils.setTimestamp(library, data.timestamp);
      toast({
        title: 'Set timestamp successfully',
        status: 'success',
        isClosable: true,
      });
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
      <Box mb="2">
        <Text>Latest block timestamp</Text>
        <Text>
          {`${dayjs
            .unix(timestamp || 0)
            .format('DD/MM/YYYY HH:mm:ss')} (${timestamp})`}
        </Text>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl id="timestamp">
          <FormLabel>Timestamp (seconds)</FormLabel>
          <NumberInput
            name={timestampField.name}
            onBlur={timestampField.onBlur}
            onChange={(_, value) => {
              timestampField.onChange(value);
            }}
          >
            <NumberInputField ref={timestampField.ref} />
          </NumberInput>
        </FormControl>
        <Flex>
          <Button mt="2" alignSelf="flex-end" type="submit">
            Travel
          </Button>
        </Flex>
      </form>
    </Box>
  );
};
