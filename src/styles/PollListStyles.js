import styled from 'styled-components';

export const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

export const PollListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const RefreshButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 20px;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: #218838;
  }
`;

export const PollCard = styled.div`
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
`;

export const PollHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

export const PollTitle = styled.h3`
  margin: 0;
  color: #333;
  font-size: 20px;
  font-weight: 600;
`;

export const PollMeta = styled.div`
  text-align: right;
  font-size: 12px;
  color: #6c757d;
`;

export const CreatorAddress = styled.div`
  font-family: 'Courier New', monospace;
  margin-bottom: 4px;
`;

export const CreatedDate = styled.div``;

export const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
`;

export const OptionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    border-color: #667eea;
    background: #f8f9ff;
  }
  
  ${props => props.voted && `
    border-color: #28a745;
    background: #f8fff9;
  `}
`;

export const VoteButton = styled.button`
  background: ${props => props.voted ? '#28a745' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 80px;
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const OptionText = styled.div`
  flex: 1;
  font-weight: 500;
`;

export const VoteCount = styled.div`
  background: #f8f9fa;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  color: #495057;
  min-width: 40px;
  text-align: center;
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 8px;
`;

export const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  width: ${props => props.percentage}%;
  transition: width 0.3s ease;
`;

export const TotalVotes = styled.div`
  text-align: center;
  font-size: 14px;
  color: #6c757d;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e9ecef;
`;

export const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #6c757d;
  font-size: 18px;
`;

export const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #6c757d;
  font-size: 18px;
`;

export const ErrorMessage = styled.div`
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
  padding: 12px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateY(-10px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  &::before {
    content: '⚠️';
    font-size: 20px;
  }
`;
