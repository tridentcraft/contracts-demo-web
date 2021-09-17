import React from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Flex,
  Button,
  useToast,
  Text,
} from '@chakra-ui/react';
import { useContractAddress } from '.';

export const useContractAddressInput = (options: {
  title: string;
  key: string;
}) => {
  const { title, key } = options;
  const [address, setAddress] = React.useState(
    localStorage.getItem(`contract-address-${key}`) || ''
  );
  const addressInputRef = React.useRef<HTMLInputElement>(null);
  const toast = useToast();
  const { setValue } = useContractAddress();

  const inputUI = (
    <Box>
      <Text mb="2">{title}</Text>

      <Flex>
        <Input flex={1} ref={addressInputRef} name="contractAddress" mr="2" />
        <Button
          onClick={() => {
            const addr = addressInputRef.current?.value || '';
            setAddress(addr);
            localStorage.setItem(`contract-address-${key}`, addr);
            toast({
              position: 'bottom-left',
              title: `Set ${title}`,
              status: 'success',
              isClosable: true,
            });
            setValue(key, addr);
          }}
        >
          Submit
        </Button>
      </Flex>
    </Box>
  );

  return {
    inputUI,
    address,
  };
};
