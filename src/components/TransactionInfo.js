import React, { useEffect, useState } from 'react';
import {
  TransactionContainer,
  SuccessIcon,
  TransactionTitle,
  TransactionHash,
  TransactionData,
  slideIn,
  fadeOut,
  successGlow
} from '../styles/TransactionInfoStyles';

const TransactionInfo = ({ title, hash, data, method }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Auto-hide after 5 seconds
    const timer = setTimeout(() => {
      setVisible(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  if (!hash || !visible) return null;

  return (
    <TransactionContainer>
      <SuccessIcon />
      <TransactionTitle>{title}</TransactionTitle>
    </TransactionContainer>
  );
};

export default TransactionInfo; 