import React from 'react';

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
} from '@chakra-ui/react';

import { TimeTravelToolbox } from '../time-travel-toolbox/time-travel-toolbox.container';
import { BalanceToolbox } from '../balance-toolbox/balance-toolbox.container';
import { ContractAddressToolbox } from '../contract-address-toolbox/contract-address-toolbox.container';

export const ToolboxSideBar = (): React.ReactElement => (
  <Box width="100%">
    <Accordion allowMultiple>
      <AccordionItem>
        <AccordionButton>
          <Box flex="1" textAlign="left">
            <Heading fontSize="xl">Contract Addresses</Heading>
          </Box>
          <AccordionIcon />
        </AccordionButton>

        <AccordionPanel>
          <ContractAddressToolbox />
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <AccordionButton>
          <Box flex="1" textAlign="left">
            <Heading fontSize="xl">Time travel</Heading>
          </Box>
          <AccordionIcon />
        </AccordionButton>

        <AccordionPanel>
          <TimeTravelToolbox />
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <AccordionButton>
          <Box flex="1" textAlign="left">
            <Heading fontSize="xl">Balance</Heading>
          </Box>
          <AccordionIcon />
        </AccordionButton>

        <AccordionPanel>
          <BalanceToolbox />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  </Box>
);
