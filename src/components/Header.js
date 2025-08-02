import React from 'react';
import {
  HeaderContainer,
  Title,
  AccountInfo,
  LogoutButton,
  AccountAddress,
  WalletIcon,
  RefreshButton
} from '../styles/HeaderStyles';

const Header = ({ account, onRefresh, onLogout, loading }) => {
  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <HeaderContainer>
      <Title>🗳️ Poll App</Title>
      <AccountInfo>
        <AccountAddress>{formatAddress(account)}</AccountAddress>
        <LogoutButton onClick={onLogout}>
          Disconnect
        </LogoutButton>
      </AccountInfo>
    </HeaderContainer>
  );
};

export default Header; 