import React from 'react';

import { HStack } from '@chakra-ui/react';

export type HeaderProps = React.PropsWithChildren<{}>;

export function Header(props: HeaderProps): React.ReactElement {
  const { children } = props;
  return (
    <HStack px={[3]} py={[2]} spacing={3} boxShadow="md">
      {children}
    </HStack>
  );
}
