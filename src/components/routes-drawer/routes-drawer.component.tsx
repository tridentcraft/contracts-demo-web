import React from 'react';

import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerProps,
} from '@chakra-ui/react';

export type IRouteItem = {
  title: string;
  to: string;
};

export type RoutesDrawerProps = Omit<DrawerProps, 'children'> & {
  routes: IRouteItem[];
  onRoutePress: (route: IRouteItem) => void;
};

export function RoutesDrawer(props: RoutesDrawerProps): React.ReactElement {
  const { routes, onRoutePress, ...restProps } = props;
  return (
    <Drawer {...restProps}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Contracts</DrawerHeader>

        <DrawerBody>
          {routes.map((route) => (
            <Button
              key={route.title}
              isFullWidth
              onClick={() => onRoutePress(route)}
              variant="ghost"
            >
              {route.title}
            </Button>
          ))}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
