# DOC Vesting Contract

A time-locked vesting vault for DOC tokens built on Rootstock (RSK) blockchain.

## What It Does

A smart contract where an admin deposits DOC tokens for a single beneficiary. 
The tokens unlock linearly over a set time period. The beneficiary can withdraw 
anytime, but pulling out before fully vested costs a 20% penalty on the unvested 
portion — which stays in the contract.

## Contract Address (RSK Testnet)
```
0x319d7bd91bBf72E8F4cBc140C4DBf67e4Fc7Ce4b
```
Verified on Rootstock Testnet Explorer:
https://explorer.testnet.rootstock.io/address/0x319d7bd91bBf72E8F4cBc140C4DBf67e4Fc7Ce4b

> Note: Copy and paste the link above directly into your browser — direct clicks from GitHub may return a 403 .

## State Machine
```
NOT_CONFIGURED → LOCKED → VESTING → COMPLETE
```

| State | Description |
|-------|-------------|
| NOT_CONFIGURED | Contract deployed, no beneficiary set yet |
| LOCKED | Before cliff ends, no withdrawals allowed |
| VESTING | Cliff passed, tokens unlocking linearly |
| COMPLETE | Vesting period over, all tokens available penalty-free |

## Key Features

- Linear vesting over a configurable time period
- Optional cliff period before any withdrawal is allowed
- 20% penalty on unvested excess withdrawals
- Penalty stays in the contract
- Pull pattern — beneficiary withdraws when ready
- Admin and beneficiary are always separate wallets

## How It Works

1. Admin deploys the contract with the DOC token address
2. Admin funds the contract with DOC tokens
3. Admin sets up the beneficiary with an allocation and vesting schedule
4. Beneficiary withdraws vested tokens over time

## Scenarios Covered

| # | Scenario | Description |
|---|----------|-------------|
| 1 | Deploy | Contract starts in NOT_CONFIGURED state |
| 2 | Fund | Admin deposits DOC before setting up beneficiary |
| 3 | Setup | Admin assigns beneficiary, allocation, vesting period and cliff |
| 4 | Locked | Withdrawal reverts during cliff period |
| 5 | Normal withdrawal | Beneficiary pulls within vested amount, no penalty |
| 6 | Early exit | Beneficiary pulls beyond vested amount, 20% penalty applied |
| 7 | Complete | Vesting period over, full amount available penalty-free |

## Test Suite

80 tests across two files covering full functional and security coverage.
```bash
npx hardhat test
```

| File | Tests | Coverage |
|------|-------|----------|
| DOCVesting.test.js | 34 | 7 functional scenarios |
| DOCVesting.security.test.js | 46 | 9 security audit categories |

### Security Audit Categories

1. Reentrancy protection
2. Access control
3. Integer accounting
4. Penalty calculation edge cases
5. Configuration lock
6. Vesting math integrity
7. ERC-20 safety
8. Event emission
9. Boundary timing edge cases

## Tech Stack

- Solidity `^0.8.20`
- Hardhat `v2.22`
- OpenZeppelin Contracts `v5.6.1`
- Rootstock (RSK) Testnet
- DOC Token (Dollar on Chain)

## Setup
```bash
npm install
npx hardhat compile
npx hardhat test
```

## Deploy
```bash
npx hardhat run scripts/deploy.js --network rootstockTestnet
```
## Rules Enforced by the Contract

| Rule | How It Is Enforced |
|------|--------------------|
| Admin cannot be beneficiary | `setup()` reverts if `_beneficiary == admin` |
| Contract must be funded before setup | `setup()` checks `contractBalance >= _allocation` |
| Setup can only happen once | `isConfigured` flag blocks second call |
| No withdrawal before cliff | `withdraw()` reverts if `block.timestamp < startTime + cliffPeriod` |
| 20% penalty on unvested excess | Penalty calculated on `amount - withdrawableNow` only |
| Penalty stays in contract | Deducted from transfer, added to `penaltyPool` |
| Cannot withdraw more than allocated | `require(amount <= remaining)` |
| Zero address rejected | Checked in `setup()` and `constructor()` |
| Reentrancy blocked | `nonReentrant` modifier + checks-effects-interactions pattern |

## Design Choices and Reasoning

**Pull pattern over push**
Beneficiary initiates withdrawals rather than the contract pushing funds automatically. This eliminates reentrancy risk and removes the gas cost of looping over recipients on every payment received.

**Fund first then setup**
Admin must deposit DOC before adding a beneficiary. This ensures every allocation is backed by real tokens from the moment the promise is made — the contract cannot make promises it cannot keep.

**Cliff does not pause vesting**
The vesting clock runs from `startTime` regardless of the cliff. The cliff only blocks the `withdraw()` call. This means when the cliff ends the beneficiary can immediately claim everything vested since day one — consistent with standard vesting contract behaviour.

**Penalty on unvested excess only**
The 20% penalty applies only to the portion being withdrawn beyond what has vested — not the full withdrawal amount. This is fairer and incentivises waiting rather than punishing partial early withdrawals too harshly.

**Withdrawn tracks full requested amount**
`withdrawn` records the full amount requested including the penalised portion, not just what was received. This prevents a beneficiary from re-claiming tokens already consumed as a penalty in a previous withdrawal.

**Admin and beneficiary are always separate**
Enforced in code — `setup()` reverts if the beneficiary address matches the admin. This removes the conflict of interest where an admin could grant themselves vesting allocations.

**Single beneficiary design**
Deliberately simplified to one beneficiary per contract. This eliminates share rebalancing complexity, makes the accounting trivially auditable, and keeps gas costs predictable. Multiple beneficiaries would require a separate contract deployment — a clean separation of concerns.

## Roadmap

- [x] Smart contract written and tested
- [x] Security audit tests written
- [x] Deployed to RSK Testnet
- [x] Contract verified on explorer
- [ ] UI — in progress (Replit, HTML/CSS/JS + Ethers.js)

## Author

Michael Mushunje
