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

  // eslint-disable-next-line no-underscore-dangle
  const _setAddress = React.useCallback(
    (addr: string) => {
      setAddress(addr);
      localStorage.setItem(`contract-address-${key}`, addr);
      setValue(key, addr);
    },
    [key, setValue]
  );

  React.useEffect(() => {
    const addr = localStorage.getItem(`contract-address-${key}`) || '';
    _setAddress(addr);
    addressInputRef.current!.value = addr;
  }, []);

  const inputUI = (
    <Box>
      <Text mb="2">{title}</Text>

      <Flex>
        <Input flex={1} ref={addressInputRef} name="contractAddress" mr="2" />
        <Button
          onClick={() => {
            const addr = addressInputRef.current?.value || '';
            _setAddress(addr);
            toast({
              position: 'bottom-left',
              title: `Set ${title}`,
              status: 'success',
              isClosable: true,
            });
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
