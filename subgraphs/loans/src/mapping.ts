import { BigDecimal, BigInt, log } from "@graphprotocol/graph-ts";
import {
  TreasuryBorrow,
  Approval,
  ApprovalForAll,
  Borrow,
  ConfigPackage,
  Initialized,
  PayOff,
  ReturnStakingNFT,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  Transfer,
  Withdraw,
} from "../generated/TreasuryBorrow/TreasuryBorrow";
import { Loan, LoanPackage, User } from "../generated/schema";

export function handleApproval(event: Approval): void {}

export function handleApprovalForAll(event: ApprovalForAll): void {}

export function handleBorrow(event: Borrow): void {
  let loan = Loan.load(event.params.tokenId.toString());
  if (loan === null) {
    loan = new Loan(event.params.tokenId.toString());
  }
  loan.borrowAmount = event.params.amount;
  loan.borrowTime = event.block.timestamp.toI32();
  // let contract = TreasuryBorrow.bind(event.address)
  let packageLoan = LoanPackage.load(event.params.packageId.toString());
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

  if (packageLoan != null) {
    loan.repayTime = event.block.timestamp.toI32() + packageLoan.period;
  }
  loan.repayAmount = BigInt.fromI32(0);
  loan.user = event.transaction.from.toHex();
  loan.save();
}

export function handleConfigPackage(event: ConfigPackage): void {
  let packageLoan = LoanPackage.load(event.params.packageId.toString());
  if (packageLoan === null) {
    packageLoan = new LoanPackage(event.params.packageId.toString());
  }
  packageLoan.period = event.params.period.toI32();
  packageLoan.annualRate = convertTokenToDecimal(event.params.annualRate);
  packageLoan.maxBorrowRatio = convertTokenToDecimal(event.params.maxBorrowRatio);
  packageLoan.minBorrow = event.params.minBorrow;
  packageLoan.save();
}

export function handlePayOff(event: PayOff): void {}

export function handleReturnStakingNFT(event: ReturnStakingNFT): void {}

// export function handleRoleAdminChanged(event: RoleAdminChanged): void {}

// export function handleRoleGranted(event: RoleGranted): void {}

// export function handleRoleRevoked(event: RoleRevoked): void {}

export function handleTransfer(event: Transfer): void {
  let loan = Loan.load(event.params.tokenId.toString());
  if (loan != null && loan.user != "0x0000000000000000000000000000000000000000") {
    let user = User.load(event.params.to.toHex());
    if (user === null) {
      user = new User(event.params.to.toHex());
      user.save();
    }
    loan = new Loan(event.params.tokenId.toString());
    loan.user = event.params.to.toHex();
    loan.save();
  }
}

export function handleWithdraw(event: Withdraw): void {
  let loan = Loan.load(event.params.tokenId.toString());
  if (loan === null) {
    loan = new Loan(event.params.tokenId.toString());
  }
  let user0 = User.load("0x0000000000000000000000000000000000000000");
  if (user0 === null) {
    user0 = new User("0x0000000000000000000000000000000000000000");
    user0.save();
  }
  loan.user = "0x0000000000000000000000000000000000000000";
  loan.save();
}

export function convertTokenToDecimal(tokenAmount: BigInt): BigDecimal {
  return tokenAmount.toBigDecimal().div(exponentToBigDecimal(BigInt.fromI32(18)));
}

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
  let bd = BigDecimal.fromString("1");
  for (let i = BigInt.fromI32(0); i.lt(decimals as BigInt); i = i.plus(BigInt.fromI32(1))) {
    bd = bd.times(BigDecimal.fromString("10"));
  }

  return bd;
}
