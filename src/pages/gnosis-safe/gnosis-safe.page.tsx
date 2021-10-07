import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Text,
} from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import React from 'react';
import { ethers, providers } from 'ethers';
import { useContract, useContractAddress } from '../../hooks';
import { useForm } from 'react-hook-form';
import { EthersAdapter } from '@gnosis.pm/safe-core-sdk';
import Safe from '@gnosis.pm/safe-core-sdk';

export const GnosisSafePage = () => {
  const { library, active } = useWeb3React<ethers.providers.Web3Provider>();
  const {
    value: { coin: coinContractAddress, 'gnosis-safe': safeAddress },
  } = useContractAddress();
  const { handleSubmit, register } = useForm();
  const { handleSubmit: handleApproveSubmit, register: approveRegister } =
    useForm();
  const toast = useToast();
  const coinContract = useContract({
    contractType: 'coin',
    active,
    address: coinContractAddress || undefined,
    provider: library,
  });

  const [txHash, setTxHash] = React.useState('');
  const safeTxRef = React.useRef<any>({});

  const onTransferOwnershipSubmit = async (values: any) => {
    const { owner_address } = values;
    if (!safeAddress) {
      toast({
        position: 'bottom-left',
        status: 'error',
        title: 'Gnosis Safe address invalid',
      });
      return;
    }

    if (!coinContract) {
      toast({
        position: 'bottom-left',
        status: 'error',
        title: 'Coin contract invalid',
      });
      return;
    }

    if (library) {
      const ownerAdapter = new EthersAdapter({
        ethers,
        signer: library.getSigner(),
      });
      const safeSdk: Safe = await Safe.create({
        ethAdapter: ownerAdapter,
        safeAddress,
      });
      const tx = await coinContract.populateTransaction.transferOwnership(
        owner_address
      );
      const safeTx = await safeSdk.createTransaction({
        to: coinContractAddress!,
        value: '0',
        data: tx.data!,
      });

      const _txHash = await safeSdk.getTransactionHash(safeTx);
      console.log('txHash', _txHash);
      setTxHash(_txHash);

      safeTxRef.current = safeTx;

      toast({
        position: 'bottom-left',
        status: 'success',
        title: 'Propose transaction successfully',
      });
    }
  };

  const onApproveTxSubmit = async (values: any) => {
    const { tx_hash } = values;

    if (!safeAddress) {
      toast({
        position: 'bottom-left',
        status: 'error',
        title: 'Gnosis Safe address invalid',
      });
      return;
    }

    if (library) {
      const ownerAdapter = new EthersAdapter({
        ethers,
        signer: library.getSigner(),
      });
      const safeSdk: Safe = await Safe.create({
        ethAdapter: ownerAdapter,
        safeAddress,
      });

      const approveTxResponse = await safeSdk.approveTransactionHash(txHash);
      await approveTxResponse.transactionResponse?.wait();

      toast({
        position: 'bottom-left',
        status: 'success',
        title: 'Approve transaction successfully',
      });

      const txResponse = await safeSdk.executeTransaction(safeTxRef.current!);
      await txResponse.transactionResponse?.wait();

      toast({
        position: 'bottom-left',
        status: 'success',
        title: 'Execute transaction successfully',
      });
    }
  };

  return (
    <Box px="8" py="4">
      <Box mb="2">
        <Heading size="md">Transfer coin ownership</Heading>
        <form onSubmit={handleSubmit(onTransferOwnershipSubmit)}>
          <Box mb="2">
            <FormControl id="owner_address">
              <FormLabel htmlFor="owner_address">New owner address</FormLabel>
              <Input {...register('owner_address', { required: 'Required' })} />
            </FormControl>
          </Box>

          <Button type="submit">Submit</Button>
        </form>

        <Text>{`TxHash: ${txHash}`}</Text>
      </Box>

      <Box mb="2">
        <Heading size="md">Approve Transaction</Heading>
        <form onSubmit={handleApproveSubmit(onApproveTxSubmit)}>
          <Box mb="2">
            <FormControl id="tx_hash">
              <FormLabel htmlFor="tx_hash">Transaction hash</FormLabel>
              <Input
                {...approveRegister('tx_hash', { required: 'Required' })}
              />
            </FormControl>
          </Box>

          <Button type="submit">Submit</Button>
        </form>
      </Box>
    </Box>
  );
};
