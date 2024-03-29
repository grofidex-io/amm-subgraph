import { BigInt, log } from "@graphprotocol/graph-ts";
import { BurnNFT, ClaimReward, Stake, Transfer, UnStake, Withdraw } from "../generated/Staking/Staking";
import { Staked, Token, UnStaked, User } from "../generated/schema";

export function handleBurnNFT(event: BurnNFT): void {
  let token = Token.load(event.params.tokenId.toString());
  if (token === null) {
    token = new Token(event.params.tokenId.toString());
  }
  token.owner = "0x0000000000000000000000000000000000000000";
  token.save();
}

export function handleClaimReward(event: ClaimReward): void {
  // let unstake = UnStaked.load(event.params.tokenId.toString())
  // if (unstake === null) {
  //   unstake = new UnStaked(event.params.tokenId.toString())
  // }
  // unstake.unStakeAmount = BigInt.fromI32(0)
  // unstake.user = '0x0000000000000000000000000000000000000000'
  // unstake.save()
}

export function handleStake(event: Stake): void {
  let token = Token.load(event.params.tokenId.toString());
  if (token === null) {
    token = new Token(event.params.tokenId.toString());
  }
  token.owner = event.transaction.from.toHex();
  token.save();
  let user0 = User.load("0x0000000000000000000000000000000000000000");
  if (user0 === null) {
    user0 = new User("0x0000000000000000000000000000000000000000");
    user0.save();
  }
  let user = User.load(event.transaction.from.toHex());
  if (user === null) {
    user = new User(event.transaction.from.toHex());
    user.save();
  }
  let stake = Staked.load(event.params.tokenId.toString());
  if (stake === null) {
    stake = new Staked(event.params.tokenId.toString());
  }
  stake.stakedAmount = event.params.amount;
  stake.timestamp = event.block.timestamp.toI32();
  stake.user = event.transaction.from.toHex();
  stake.save();
}

export function handleTransfer(event: Transfer): void {
  let stake = Staked.load(event.params.tokenId.toString());
  if (stake != null && stake.user != "0x0000000000000000000000000000000000000000") {
    let user = User.load(event.params.to.toHex());
    if (user === null) {
      user = new User(event.params.to.toHex());
      user.save();
    }
    stake = new Staked(event.params.tokenId.toString());
    stake.user = event.params.to.toHex();
    stake.save();
  }
  let unstake = UnStaked.load(event.params.tokenId.toString());
  if (unstake != null && unstake.user != "0x0000000000000000000000000000000000000000") {
    let user = User.load(event.params.to.toHex());
    if (user === null) {
      user = new User(event.params.to.toHex());
      user.save();
    }
    unstake = new UnStaked(event.params.tokenId.toString());
    unstake.user = event.transaction.from.toHex();
    unstake.save();
  }

  let token = Token.load(event.params.tokenId.toString());
  if (token === null) {
    token = new Token(event.params.tokenId.toString());
  }
  token.owner = event.params.to.toHex();
  token.save();
}

export function handleUnStake(event: UnStake): void {
  let stake = Staked.load(event.params.tokenId.toString());
  if (stake === null) {
    stake = new Staked(event.params.tokenId.toString());
  }
  stake.stakedAmount = BigInt.fromI32(0);
  stake.user = "0x0000000000000000000000000000000000000000";
  stake.save();
  let unstake = UnStaked.load(event.params.tokenId.toString());
  if (unstake === null) {
    unstake = new UnStaked(event.params.tokenId.toString());
  }
  unstake.unStakeAmount = event.params.amount;
  unstake.timestamp = event.block.timestamp.toI32();
  unstake.user = event.transaction.from.toHex();
  unstake.save();
}

export function handleWithdraw(event: Withdraw): void {
  let unstake = UnStaked.load(event.params.tokenId.toString());
  if (unstake === null) {
    unstake = new UnStaked(event.params.tokenId.toString());
  }
  unstake.unStakeAmount = BigInt.fromI32(0);
  unstake.user = "0x0000000000000000000000000000000000000000";
  unstake.save();
}
