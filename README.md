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
Sample txParams:
```javascript
{
  from: '0x7314e0f1c0e28474bdb6be3e2c3e0453255188f8'
  to: "0x7314e0f1c0e28474bdb6be3e2c3e0453255188f8",
  value: "0xf4240",
  data: "0x01",
  chainId: 1,
  nonce: "0x0",
  gas: "0x5208",
  gasLimit: "0x5208",
  gasPrice: "0xbebc200"
}
```
