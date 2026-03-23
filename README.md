# DOC Vesting Contract

A time-locked vesting vault for DOC tokens built on Rootstock (RSK) blockchain.

## What It Does

A smart contract where an admin deposits DOC tokens for a single beneficiary. 
The tokens unlock linearly over a set time period. The beneficiary can withdraw 
anytime, but pulling out before fully vested costs a 20% penalty on the unvested 
portion — which stays in the contract.

## Contract Address (RSK Testnet)
```
0x4F2114dd5f80E54571C75F4eaB3E2fF913755DCa
```

Verified on: https://explorer.testnet.rootstock.io/address/0x4F2114dd5f80E54571C75F4eaB3E2fF913755DCa

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
## Roadmap

- [x] Smart contract written and tested
- [x] Security audit tests written
- [x] Deployed to RSK Testnet
- [x] Contract verified on explorer
- [ ] UI — in progress (Replit, HTML/CSS/JS + Ethers.js)

## Author

Michael Mushunje
