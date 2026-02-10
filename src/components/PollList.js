import React, { useState, useEffect } from 'react';
import {
  Container,
  PollsGrid,
  RefreshButton,
  PollListHeader,
  PollCard,
  PollHeader,
  PollTitle,
  PollMeta,
  CreatorAddress,
  CreatedDate,
  OptionsContainer,
  OptionItem,
  VoteButton,
  OptionText,
  VoteCount,
  ProgressBar,
  ProgressFill,
  TotalVotes,
  LoadingMessage,
  EmptyMessage,
  ErrorMessage
} from '../styles/PollListStyles';

const PollList = ({ polls, onVote, loading, account, contract, onRefresh }) => {
  const [votedPolls, setVotedPolls] = useState({});
  const [error, setError] = useState('');
  const [votingInProgress, setVotingInProgress] = useState({ pollId: null, optionIndex: null });

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  useEffect(() => {
    checkVotedStatus();
  }, [polls, account, contract]);

  useEffect(() => {
    // Force a refresh when component mounts
    onRefresh();
  }, []);

  const checkVotedStatus = async () => {
    if (!contract || !account) return;

    const votedStatus = {};
    for (const poll of polls) {
      try {
        const hasVoted = await contract.hasVoted(poll.id, account);
        // For now, just track if they voted at all
        votedStatus[poll.id] = {
          hasVoted,
          votedOption: hasVoted ? 0 : -1  // We'll update this once we know the correct function to call
        };
      } catch (error) {
        votedStatus[poll.id] = { hasVoted: false, votedOption: -1 };
      }
    }
    setVotedPolls(votedStatus);
  };

  const calculatePercentage = (votes, totalVotes) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  const handleVote = async (pollId, optionIndex) => {
    try {
      // Clear any previous error
      setError('');

      if (votedPolls[pollId]?.hasVoted) {
        setError('You have already voted on this poll!');
        setTimeout(() => setError(''), 5000); // Clear error after 5 seconds
        return;
      }

      // Set loading state for this specific option
      setVotingInProgress({ pollId, optionIndex });

      await onVote(pollId, optionIndex);
      
      // Update local state immediately after successful vote
      setVotedPolls(prev => ({
        ...prev,
        [pollId]: {
          hasVoted: true,
          votedOption: optionIndex
        }
      }));
      
      // Refresh the poll status
      await checkVotedStatus();
    } catch (error) {
      if (error.code === 'ACTION_REJECTED') {
        setError('Vote transaction was cancelled. Please try again if you want to vote.');
      } else {
        setError('Failed to vote: ' + (error.reason || 'Please check your wallet and try again.'));
      }
      // Clear error after 5 seconds
      setTimeout(() => setError(''), 5000);
    } finally {
      // Clear loading state
      setVotingInProgress({ pollId: null, optionIndex: null });
    }
  };

  if (loading) {
    return <LoadingMessage>Loading polls...</LoadingMessage>;
  }

  if (polls.length === 0) {
    return (
      <EmptyMessage>
        <h3>No polls yet!</h3>
        <p>Be the first to create a poll by switching to the "Create Poll" tab.</p>
      </EmptyMessage>
    );
  }

  return (
    <Container>
      <PollListHeader>
        <h2>All Polls ({polls.length})</h2>
      </PollListHeader>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <PollsGrid>
        {polls.map((poll) => {
          const pollVoteInfo = votedPolls[poll.id] || { hasVoted: false, votedOption: -1 };

          return (
            <PollCard key={poll.id}>
              <PollHeader>
                <div>
                  <PollTitle>{poll.title}</PollTitle>
                  <CreatorAddress>Creator: {formatAddress(poll.creator)}</CreatorAddress>
                </div>
                <PollMeta>
                  <CreatedDate>Created: {poll.createdAt}</CreatedDate>
                </PollMeta>
              </PollHeader>

              <OptionsContainer>
                {poll.options.map((option, index) => {
                  const voteCount = parseInt(poll.voteCounts[index]);
                  const percentage = calculatePercentage(voteCount, parseInt(poll.totalVotes));

                  return (
                    <OptionItem key={index}>
                      <VoteButton
                        onClick={() => handleVote(poll.id, index)}
                        disabled={pollVoteInfo.hasVoted || 
                          (votingInProgress.pollId === poll.id && votingInProgress.optionIndex === index)}
                        voted={index === pollVoteInfo.votedOption}
                      >
                        {index === pollVoteInfo.votedOption 
                          ? 'Voted' 
                          : (votingInProgress.pollId === poll.id && votingInProgress.optionIndex === index)
                            ? 'Voting...' 
                            : 'Vote'}
                      </VoteButton>
                      <OptionText>{option}</OptionText>
                      <VoteCount>{voteCount}</VoteCount>
                      <ProgressBar>
                        <ProgressFill percentage={percentage} />
                      </ProgressBar>
                    </OptionItem>
                  );
                })}
              </OptionsContainer>

              <TotalVotes>
                Total Votes: {poll.totalVotes}
              </TotalVotes>
            </PollCard>
          );
        })}
      </PollsGrid>
    </Container>
  );
};

export default PollList; 