# Interact with TomoChain wallets easily


## Install
```javascript
npm i --save easy-eth-wallets
```
or
```javascript
yarn add easy-eth-wallets
```

## Ledger Wallet
```javascript
import { LedgerWallet } from  'easy-eth-wallets'

const wallet = LedgerWallet.init(hdPath, offset, numberWallets)
```

## Trezor Wallet
```javascript
import { TrezorWallet } from  'easy-eth-wallets'

const wallet = TrezorWallet.init(hdPath, email, appUrl, offset, numberWallets)
```

email and appUrl are required that you as a Trezor Connect integrator. Read more at https://github.com/trezor/connect/blob/develop/docs/index.md

# Functions

```javascript
const signMessageSig = await wallet.signMessage('This is message')

const signTransactionSig = await wallet.signTransaction(txParams, stringified)
```
stringified variable(Boolean) is using for returning result (string(signature) or object tx)

