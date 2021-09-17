import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
  useLocation,
} from 'react-router-dom';

import { HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Text,
  useDisclosure,
  useClipboard,
  useToast,
} from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';

import {
  Header,
  IRouteItem,
  RoutesDrawer,
  ThemeToggleButton,
} from './components';
import { ConnectWalletButton, ToolboxSideBar } from './containers';
import { StakingPage } from './pages';

const routes: IRouteItem[] = [
  {
    title: 'Staking',
    to: '/staking',
  },
];

const App = (): JSX.Element => {
  const {
    isOpen: isDrawerOpen,
    onClose: onDrawerClose,
    onOpen: onDrawerOpen,
  } = useDisclosure();
  const history = useHistory();
  const location = useLocation();
  const { account } = useWeb3React();
  const { onCopy } = useClipboard(account || '');
  const toast = useToast();

  const selectedRoute = React.useMemo(() => {
    const route = routes.find((r) => r.to === location.pathname);
    return route;
  }, [location.pathname]);

  return (
    <Flex height="100vh" flexDirection="column">
      <Box>
        <Header>
          <IconButton
            aria-label="open-drawer"
            icon={<HamburgerIcon />}
            onClick={onDrawerOpen}
          />
          <Heading>{selectedRoute?.title}</Heading>
          <Flex flex={1} justifyContent="flex-end">
            {account ? (
              <Button
                onClick={() => {
                  onCopy();
                  toast({
                    position: 'bottom-left',
                    title: `Copy ${account}`,
                    status: 'success',
                    isClosable: true,
                  });
                }}
              >
                {account}
              </Button>
            ) : (
              <ConnectWalletButton />
            )}
          </Flex>
        </Header>
        <RoutesDrawer
          routes={routes}
          onRoutePress={(_route) => {
            history.push(_route.to);
          }}
          isOpen={isDrawerOpen}
          onClose={onDrawerClose}
        />
      </Box>

      <Flex flex={1} overflow="auto">
        <Box boxShadow="md" flex={1} height="100%" overflow="auto">
          <ToolboxSideBar />
        </Box>

        <Box flex={3} height="100%" overflow="auto">
          <Router>
            <Switch>
              <Route path="/staking">
                <StakingPage />
              </Route>
            </Switch>
          </Router>
        </Box>
      </Flex>

      <ThemeToggleButton pos="fixed" bottom="2" right="2" />
    </Flex>
  );
};

export default App;
