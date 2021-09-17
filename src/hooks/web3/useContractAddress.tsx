import React from 'react';

type ContextData = {
  value: { [key: string]: string | null | undefined };
  setValue: (key: string, address: string) => void;
};

const ContractAddressContext = React.createContext<ContextData | undefined>(
  undefined
);

export const useContractAddress = () => {
  const context = React.useContext(ContractAddressContext);

  if (!context) {
    throw new Error('Must use inside ContractAddressProvider');
  }

  return context;
};

export type ContractAddressProviderProps = React.PropsWithChildren<{}>;

export const ContractAddressProvider = ({
  children,
}: ContractAddressProviderProps) => {
  const [value, setValue] = React.useState({});

  const setContract = React.useCallback(
    (key: string, address: string) => {
      setValue({ ...value, [key]: address });
    },
    [value]
  );

  return (
    <ContractAddressContext.Provider value={{ value, setValue: setContract }}>
      {children}
    </ContractAddressContext.Provider>
  );
};
