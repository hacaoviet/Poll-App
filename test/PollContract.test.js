const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PollContract", function () {
  let pollContract;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // Get signers (accounts)
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy contract
    const PollContract = await ethers.getContractFactory("PollContract");
    pollContract = await PollContract.deploy();
    await pollContract.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(pollContract.target).to.be.properAddress;
    });

    it("Should have initial poll count of 0", async function () {
      expect(await pollContract.pollCount()).to.equal(0);
    });
  });

  describe("Create Poll", function () {
    it("Should create a poll with valid inputs", async function () {
      const title = "Favorite Color?";
      const options = ["Red", "Blue", "Green"];

      const tx = await pollContract.createPoll(title, options);
      const receipt = await tx.wait();

      // Check poll count increased
      expect(await pollContract.pollCount()).to.equal(1);

      // Check event was emitted
      const event = receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "PollCreated"
      );
      expect(event).to.not.be.undefined;

      // Get poll data
      const poll = await pollContract.getPoll(1);
      expect(poll.title).to.equal(title);
      expect(poll.options).to.deep.equal(options);
      expect(poll.creator).to.equal(owner.address);
      expect(poll.totalVotes).to.equal(0);
    });

    it("Should assign unique sequential poll IDs", async function () {
      await pollContract.createPoll("Poll 1", ["A", "B"]);
      await pollContract.createPoll("Poll 2", ["C", "D"]);

      expect(await pollContract.pollCount()).to.equal(2);

      const poll1 = await pollContract.getPoll(1);
      const poll2 = await pollContract.getPoll(2);

      expect(poll1.id).to.equal(1);
      expect(poll2.id).to.equal(2);
    });

    it("Should record creator address", async function () {
      await pollContract.connect(addr1).createPoll("My Poll", ["Yes", "No"]);

      const poll = await pollContract.getPoll(1);
      expect(poll.creator).to.equal(addr1.address);
    });

    it("Should record creation timestamp", async function () {
      const tx = await pollContract.createPoll("Test", ["A", "B"]);
      const block = await ethers.provider.getBlock(tx.blockNumber);
      
      const poll = await pollContract.getPoll(1);
      expect(poll.createdAt).to.be.closeTo(block.timestamp, 5); // Allow 5 second variance
    });

    it("Should reject empty title", async function () {
      await expect(
        pollContract.createPoll("", ["Option 1", "Option 2"])
      ).to.be.revertedWith("Title cannot be empty");
    });

    it("Should reject less than 2 options", async function () {
      await expect(
        pollContract.createPoll("Test Poll", ["Only One"])
      ).to.be.revertedWith("Must have at least 2 options");
    });

    it("Should reject more than 10 options", async function () {
      const tooManyOptions = Array.from({ length: 11 }, (_, i) => `Option ${i + 1}`);
      
      await expect(
        pollContract.createPoll("Test Poll", tooManyOptions)
      ).to.be.revertedWith("Cannot have more than 10 options");
    });

    it("Should reject empty option strings", async function () {
      await expect(
        pollContract.createPoll("Test Poll", ["Valid", ""])
      ).to.be.revertedWith("Option cannot be empty");
    });

    it("Should accept exactly 2 options", async function () {
      await pollContract.createPoll("Test", ["Yes", "No"]);
      const poll = await pollContract.getPoll(1);
      expect(poll.options.length).to.equal(2);
    });

    it("Should accept exactly 10 options", async function () {
      const options = Array.from({ length: 10 }, (_, i) => `Option ${i + 1}`);
      await pollContract.createPoll("Test", options);
      const poll = await pollContract.getPoll(1);
      expect(poll.options.length).to.equal(10);
    });

    it("Should add poll to user's polls list", async function () {
      await pollContract.connect(addr1).createPoll("My Poll", ["A", "B"]);
      
      const userPolls = await pollContract.getUserPolls(addr1.address);
      expect(userPolls.length).to.equal(1);
      expect(userPolls[0]).to.equal(1);
    });
  });

  describe("Vote", function () {
    let pollId;

    beforeEach(async function () {
      // Create a poll before each vote test
      await pollContract.createPoll("Test Poll", ["Option A", "Option B", "Option C"]);
      pollId = 1;
    });

    it("Should allow user to vote on a poll", async function () {
      await pollContract.connect(addr1).vote(pollId, 0);

      const poll = await pollContract.getPoll(pollId);
      expect(poll.voteCounts[0]).to.equal(1);
      expect(poll.totalVotes).to.equal(1);
    });

    it("Should increment vote count for selected option", async function () {
      await pollContract.connect(addr1).vote(pollId, 1);
      await pollContract.connect(addr2).vote(pollId, 1);

      const poll = await pollContract.getPoll(pollId);
      expect(poll.voteCounts[1]).to.equal(2);
      expect(poll.totalVotes).to.equal(2);
    });

    it("Should increment total votes counter", async function () {
      await pollContract.connect(addr1).vote(pollId, 0);
      await pollContract.connect(addr2).vote(pollId, 1);
      await pollContract.connect(addrs[0]).vote(pollId, 2);

      const poll = await pollContract.getPoll(pollId);
      expect(poll.totalVotes).to.equal(3);
    });

    it("Should mark user as voted", async function () {
      await pollContract.connect(addr1).vote(pollId, 0);
      
      expect(await pollContract.hasVoted(pollId, addr1.address)).to.be.true;
    });

    it("Should emit VoteCast event", async function () {
      const tx = await pollContract.connect(addr1).vote(pollId, 0);
      const receipt = await tx.wait();

      const event = receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "VoteCast"
      );
      expect(event).to.not.be.undefined;
      expect(event.args.pollId).to.equal(pollId);
      expect(event.args.optionIndex).to.equal(0);
      expect(event.args.voter).to.equal(addr1.address);
    });

    it("Should reject vote on non-existent poll", async function () {
      await expect(
        pollContract.connect(addr1).vote(999, 0)
      ).to.be.revertedWith("Poll does not exist");
    });

    it("Should reject duplicate vote from same address", async function () {
      await pollContract.connect(addr1).vote(pollId, 0);

      await expect(
        pollContract.connect(addr1).vote(pollId, 1)
      ).to.be.revertedWith("Already voted on this poll");
    });

    it("Should reject invalid option index (negative)", async function () {
      // Note: Solidity uint256 can't be negative, but testing with max value
      await expect(
        pollContract.connect(addr1).vote(pollId, 999)
      ).to.be.revertedWith("Invalid option index");
    });

    it("Should reject invalid option index (out of bounds)", async function () {
      await expect(
        pollContract.connect(addr1).vote(pollId, 3) // Only 3 options (0, 1, 2)
      ).to.be.revertedWith("Invalid option index");
    });

    it("Should allow multiple users to vote on same poll", async function () {
      await pollContract.connect(addr1).vote(pollId, 0);
      await pollContract.connect(addr2).vote(pollId, 1);
      await pollContract.connect(addrs[0]).vote(pollId, 0);

      const poll = await pollContract.getPoll(pollId);
      expect(poll.voteCounts[0]).to.equal(2);
      expect(poll.voteCounts[1]).to.equal(1);
      expect(poll.totalVotes).to.equal(3);
    });

    it("Should allow voting on different options", async function () {
      await pollContract.connect(addr1).vote(pollId, 0);
      await pollContract.connect(addr2).vote(pollId, 1);
      await pollContract.connect(addrs[0]).vote(pollId, 2);

      const poll = await pollContract.getPoll(pollId);
      expect(poll.voteCounts[0]).to.equal(1);
      expect(poll.voteCounts[1]).to.equal(1);
      expect(poll.voteCounts[2]).to.equal(1);
    });
  });

  describe("Get Poll", function () {
    it("Should return poll data correctly", async function () {
      const title = "Test Poll";
      const options = ["Yes", "No", "Maybe"];
      
      await pollContract.createPoll(title, options);
      
      const poll = await pollContract.getPoll(1);
      
      expect(poll.id).to.equal(1);
      expect(poll.title).to.equal(title);
      expect(poll.options).to.deep.equal(options);
      expect(poll.creator).to.equal(owner.address);
      expect(poll.totalVotes).to.equal(0);
      expect(poll.voteCounts).to.deep.equal([0, 0, 0]);
    });

    it("Should return correct vote counts after voting", async function () {
      await pollContract.createPoll("Test", ["A", "B", "C"]);
      
      await pollContract.connect(addr1).vote(1, 0);
      await pollContract.connect(addr2).vote(1, 0);
      await pollContract.connect(addrs[0]).vote(1, 2);

      const poll = await pollContract.getPoll(1);
      expect(poll.voteCounts).to.deep.equal([2, 0, 1]);
      expect(poll.totalVotes).to.equal(3);
    });

    it("Should reject getting non-existent poll", async function () {
      await expect(
        pollContract.getPoll(999)
      ).to.be.revertedWith("Poll does not exist");
    });
  });

  describe("Has Voted", function () {
    let pollId;

    beforeEach(async function () {
      await pollContract.createPoll("Test Poll", ["A", "B"]);
      pollId = 1;
    });

    it("Should return false for user who hasn't voted", async function () {
      expect(await pollContract.hasVoted(pollId, addr1.address)).to.be.false;
    });

    it("Should return true for user who has voted", async function () {
      await pollContract.connect(addr1).vote(pollId, 0);
      expect(await pollContract.hasVoted(pollId, addr1.address)).to.be.true;
    });

    it("Should return false for different user", async function () {
      await pollContract.connect(addr1).vote(pollId, 0);
      expect(await pollContract.hasVoted(pollId, addr2.address)).to.be.false;
    });

    it("Should work for any address parameter", async function () {
      await pollContract.connect(addr1).vote(pollId, 0);
      
      // Check from different account
      expect(await pollContract.connect(addr2).hasVoted(pollId, addr1.address)).to.be.true;
    });
  });

  describe("Get All Polls", function () {
    it("Should return empty array when no polls exist", async function () {
      const allPolls = await pollContract.getAllPolls();
      expect(allPolls).to.deep.equal([]);
    });

    it("Should return all poll IDs", async function () {
      await pollContract.createPoll("Poll 1", ["A", "B"]);
      await pollContract.createPoll("Poll 2", ["C", "D"]);
      await pollContract.createPoll("Poll 3", ["E", "F"]);

      const allPolls = await pollContract.getAllPolls();
      expect(allPolls).to.deep.equal([1, 2, 3]);
    });

    it("Should return sequential poll IDs", async function () {
      for (let i = 0; i < 5; i++) {
        await pollContract.createPoll(`Poll ${i}`, ["A", "B"]);
      }

      const allPolls = await pollContract.getAllPolls();
      expect(allPolls).to.deep.equal([1, 2, 3, 4, 5]);
    });

    it("Should match poll count", async function () {
      await pollContract.createPoll("Poll 1", ["A", "B"]);
      await pollContract.createPoll("Poll 2", ["C", "D"]);

      const pollCount = await pollContract.pollCount();
      const allPolls = await pollContract.getAllPolls();
      
      expect(allPolls.length).to.equal(Number(pollCount));
    });
  });

  describe("Get User Polls", function () {
    it("Should return empty array for user with no polls", async function () {
      const userPolls = await pollContract.getUserPolls(addr1.address);
      expect(userPolls).to.deep.equal([]);
    });

    it("Should return polls created by user", async function () {
      await pollContract.connect(addr1).createPoll("Poll 1", ["A", "B"]);
      await pollContract.connect(addr1).createPoll("Poll 2", ["C", "D"]);
      await pollContract.connect(addr2).createPoll("Poll 3", ["E", "F"]);

      const userPolls = await pollContract.getUserPolls(addr1.address);
      expect(userPolls).to.deep.equal([1, 2]);
    });

    it("Should return polls in creation order", async function () {
      await pollContract.connect(addr1).createPoll("First", ["A", "B"]);
      await pollContract.connect(addr1).createPoll("Second", ["C", "D"]);
      await pollContract.connect(addr1).createPoll("Third", ["E", "F"]);

      const userPolls = await pollContract.getUserPolls(addr1.address);
      expect(userPolls).to.deep.equal([1, 2, 3]);
    });

    it("Should track polls separately for different users", async function () {
      await pollContract.connect(addr1).createPoll("User1 Poll", ["A", "B"]);
      await pollContract.connect(addr2).createPoll("User2 Poll", ["C", "D"]);

      const user1Polls = await pollContract.getUserPolls(addr1.address);
      const user2Polls = await pollContract.getUserPolls(addr2.address);

      expect(user1Polls).to.deep.equal([1]);
      expect(user2Polls).to.deep.equal([2]);
    });
  });

  describe("Integration Tests", function () {
    it("Should handle complete poll lifecycle", async function () {
      // Create poll
      await pollContract.connect(addr1).createPoll("Lifecycle Test", ["Option 1", "Option 2"]);
      
      // Verify poll exists
      let poll = await pollContract.getPoll(1);
      expect(poll.title).to.equal("Lifecycle Test");
      expect(poll.totalVotes).to.equal(0);

      // Multiple users vote
      await pollContract.connect(addr1).vote(1, 0);
      await pollContract.connect(addr2).vote(1, 1);
      await pollContract.connect(addrs[0]).vote(1, 0);

      // Verify results
      poll = await pollContract.getPoll(1);
      expect(poll.voteCounts[0]).to.equal(2);
      expect(poll.voteCounts[1]).to.equal(1);
      expect(poll.totalVotes).to.equal(3);

      // Verify vote status
      expect(await pollContract.hasVoted(1, addr1.address)).to.be.true;
      expect(await pollContract.hasVoted(1, addr2.address)).to.be.true;
      expect(await pollContract.hasVoted(1, addrs[0].address)).to.be.true;
    });

    it("Should handle multiple polls simultaneously", async function () {
      // Create multiple polls
      await pollContract.createPoll("Poll 1", ["A", "B"]);
      await pollContract.createPoll("Poll 2", ["C", "D"]);
      await pollContract.createPoll("Poll 3", ["E", "F"]);

      // Vote on different polls
      await pollContract.connect(addr1).vote(1, 0);
      await pollContract.connect(addr1).vote(2, 1);
      await pollContract.connect(addr1).vote(3, 0);

      // Verify each poll is independent
      const poll1 = await pollContract.getPoll(1);
      const poll2 = await pollContract.getPoll(2);
      const poll3 = await pollContract.getPoll(3);

      expect(poll1.voteCounts[0]).to.equal(1);
      expect(poll2.voteCounts[1]).to.equal(1);
      expect(poll3.voteCounts[0]).to.equal(1);

      // Verify user can vote on multiple polls
      expect(await pollContract.hasVoted(1, addr1.address)).to.be.true;
      expect(await pollContract.hasVoted(2, addr1.address)).to.be.true;
      expect(await pollContract.hasVoted(3, addr1.address)).to.be.true;
    });
  });
});

