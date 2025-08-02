import styled, { keyframes } from 'styled-components';

export const slideIn = keyframes`
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

export const successGlow = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(40, 167, 69, 0.2);
  }
  50% {
    box-shadow: 0 0 20px rgba(40, 167, 69, 0.4);
  }
  100% {
    box-shadow: 0 0 5px rgba(40, 167, 69, 0.2);
  }
`;

export const TransactionContainer = styled.div`
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  border: 2px solid #28a745;
  border-radius: 16px;
  padding: 20px;
  margin: 20px 0;
  animation: ${slideIn} 0.5s ease-out,
             ${successGlow} 2s ease-in-out infinite;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #28a745, #98FB98, #28a745);
    background-size: 200% 100%;
    animation: shimmer 2s infinite linear;
  }

  @keyframes shimmer {
    0% { background-position: 100% 0; }
    100% { background-position: -100% 0; }
  }
`;

export const SuccessIcon = styled.div`
  width: 40px;
  height: 40px;
  background: #28a745;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  position: relative;
  
  &::before {
    content: '';
    width: 16px;
    height: 8px;
    border: 3px solid white;
    border-top: 0;
    border-right: 0;
    transform: rotate(-45deg);
    position: absolute;
    top: 13px;
  }
`;

export const TransactionTitle = styled.div`
  font-weight: 600;
  color: #28a745;
  margin-bottom: 15px;
  text-align: center;
  font-size: 18px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const TransactionHash = styled.div`
  color: #2E7D32;
  word-break: break-all;
  margin-bottom: 10px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
`;

export const TransactionData = styled.div`
  color: #1B5E20;
  word-break: break-all;
  font-size: 12px;
  font-family: 'Courier New', monospace;
  background: rgba(255, 255, 255, 0.3);
  padding: 10px;
  border-radius: 8px;
  margin-top: 10px;
`;
