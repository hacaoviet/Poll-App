// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract PollContract {
    struct Poll {
        uint256 id;
        string title;
        string[] options;
        mapping(uint256 => uint256) votes; // option index => vote count
        mapping(address => bool) hasVoted;
        address creator;
        uint256 totalVotes;
        uint256 createdAt;
        bool exists;
    }

    struct PollView {
        uint256 id;
        string title;
        string[] options;
        uint256[] voteCounts;
        address creator;
        uint256 totalVotes;
        uint256 createdAt;
    }

    mapping(uint256 => Poll) public polls;
    uint256 public pollCount;
    mapping(address => uint256[]) public userPolls;

    event PollCreated(uint256 indexed pollId, string title, address indexed creator);
    event VoteCast(uint256 indexed pollId, uint256 optionIndex, address indexed voter);

    function createPoll(string memory _title, string[] memory _options) public returns (uint256) {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_options.length >= 2, "Must have at least 2 options");
        require(_options.length <= 10, "Cannot have more than 10 options");

        pollCount++;
        uint256 pollId = pollCount;

        Poll storage newPoll = polls[pollId];
        newPoll.id = pollId;
        newPoll.title = _title;
        newPoll.creator = msg.sender;
        newPoll.createdAt = block.timestamp;
        newPoll.exists = true;

        for (uint256 i = 0; i < _options.length; i++) {
            require(bytes(_options[i]).length > 0, "Option cannot be empty");
            newPoll.options.push(_options[i]);
        }

        userPolls[msg.sender].push(pollId);

        emit PollCreated(pollId, _title, msg.sender);
        return pollId;
    }

    function vote(uint256 _pollId, uint256 _optionIndex) public {
        require(polls[_pollId].exists, "Poll does not exist");
        require(!polls[_pollId].hasVoted[msg.sender], "Already voted on this poll");
        require(_optionIndex < polls[_pollId].options.length, "Invalid option index");

        Poll storage poll = polls[_pollId];
        poll.hasVoted[msg.sender] = true;
        poll.votes[_optionIndex]++;
        poll.totalVotes++;

        emit VoteCast(_pollId, _optionIndex, msg.sender);
    }

    function getPoll(uint256 _pollId) public view returns (PollView memory) {
        require(polls[_pollId].exists, "Poll does not exist");
        
        Poll storage poll = polls[_pollId];
        uint256[] memory voteCounts = new uint256[](poll.options.length);
        
        for (uint256 i = 0; i < poll.options.length; i++) {
            voteCounts[i] = poll.votes[i];
        }

        return PollView({
            id: poll.id,
            title: poll.title,
            options: poll.options,
            voteCounts: voteCounts,
            creator: poll.creator,
            totalVotes: poll.totalVotes,
            createdAt: poll.createdAt
        });
    }

    function hasVoted(uint256 _pollId, address _voter) public view returns (bool) {
        return polls[_pollId].hasVoted[_voter];
    }

    function getUserPolls(address _user) public view returns (uint256[] memory) {
        return userPolls[_user];
    }

    function getAllPolls() public view returns (uint256[] memory) {
        uint256[] memory allPolls = new uint256[](pollCount);
        for (uint256 i = 1; i <= pollCount; i++) {
            allPolls[i - 1] = i;
        }
        return allPolls;
    }
} 