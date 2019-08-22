import TrezorConnect from 'trezor-connect'
import Transaction from 'ethereumjs-tx'
import GenericWallet from './GenericWallet'
import {
    HDWalletCreate
} from './utils'

export default class TrezorWallet extends GenericWallet {
    constructor() {
        super()
        return this
    }
    static async init(
        basePath,
        email,
        appUrl,
        offset = 0,
        numberWallets = 10
    ) {
        const instance = new TrezorWallet()
        if (!email) {
            throw new Error('email not set')
        }
        if (!appUrl) {
            throw new Error('appUrl not set')
        }
        TrezorConnect.manifest({
            email,
            appUrl
        })
        instance.hdpath = basePath
        instance.offset = offset
        instance.numberWallets = numberWallets
        instance.payload = await instance.getRootPubKey(instance.hdpath)
        return instance
    }

    async getRootPubKey(path) {
        try {
            const result = await TrezorConnect.getPublicKey({
                path
            })
            return result.payload
        } catch (error) {
            console.log('Cannot get root Public Key')
            console.log(error)
        }
    }
    getAddresses() {
        let wallets = []
        let convertedAddress
        for (let i = this.offset; i < this.numberWallets; i++) {
            convertedAddress = HDWalletCreate(this.payload, i, 'trezor')
            wallets.push(convertedAddress)
        }
        return wallets
    }
    getAddress() {
        if (!this.defaultAddress) {
            throw new Error('Default not set')
        } else {
            return this.defaultAddress
        }
    }

    async setDefaultAddress(index) {
        this.addressPath = this.hdpath + '/' + index
        this.defaultAddress = HDWalletCreate(this.payload, index, 'trezor')
    }
    async signMessage(message) {
        const result = await TrezorConnect.ethereumSignMessage({
            path: this.addressPath,
            message
        })

        return '0x' + result.payload.signature || ''
    }

    async signTransaction(txParams, stringified = false) {
        try {
            const result = await TrezorConnect.ethereumSignTransaction({
                path: this.addressPath,
                transaction: txParams
            })

            const signature = result.payload

            for (const key in signature) {
                if (!signature[key].startsWith('0x')) {
                    signature[key] = '0x' + signature[key]
                }
            }

            const tx = new Transaction({ ...txParams, ...signature })

            return stringified ? `0x${tx.serialize().toString('hex')}` : tx

        } catch (error) {
            console.log('PQV-Wallets Cannot sign transaction')
            console.log(txParams)
            console.log(error)
        }
    }
}
