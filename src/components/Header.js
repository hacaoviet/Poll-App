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

const Header = ({ account, balance, onRefresh, onLogout, loading }) => {
  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (bal) => {
    if (bal === null || bal === undefined) return 'Loading...';
    const num = parseFloat(bal);
    if (num === 0) return '0 ETH';
    if (num < 0.0001) return '< 0.0001 ETH';
    return `${num.toFixed(4)} ETH`;
  };

  return (
    <HeaderContainer>
      <Title>🗳️ Poll App</Title>
      <AccountInfo>
        {balance !== null && (
          <AccountAddress style={{ marginRight: '10px', backgroundColor: parseFloat(balance) > 0 ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)' }}>
            {formatBalance(balance)}
          </AccountAddress>
        )}
        <AccountAddress>{formatAddress(account)}</AccountAddress>
        <LogoutButton onClick={onLogout}>
          Disconnect
        </LogoutButton>
      </AccountInfo>
    </HeaderContainer>
  );
};

export default Header; 