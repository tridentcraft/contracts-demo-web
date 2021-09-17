import React from 'react';

import { Box, FormControl, FormLabel } from '@chakra-ui/react';

import { StakingInfo } from './staking-info.container';
import { ProgramInfo } from './program-info.container';
import { EnterStaking } from './enter-staking.container';
import { LeaveStaking } from './leave-staking.container';
import { EmergencyWithdraw } from './emergency-withdraw.container';
import { WithdrawRemainder } from './withdraw-remainder.container';

export function StakingPage(): React.ReactElement {
  return (
    <Box flex={1} px="8" py="4">
      <Box mb="4">
        <StakingInfo />
      </Box>

      <Box mb="4">
        <ProgramInfo />
      </Box>

      <Box mb="4">
        <EnterStaking />
      </Box>

      <Box mb="4">
        <LeaveStaking />
      </Box>

      <Box mb="4">
        <EmergencyWithdraw />
      </Box>

      <Box mb="4">
        <WithdrawRemainder />
      </Box>
    </Box>
  );
}
