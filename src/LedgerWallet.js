import Transport from '@ledgerhq/hw-transport-u2f'
import Ledger from '@ledgerhq/hw-app-eth'
import Transaction from 'ethereumjs-tx'
import GenericWallet from './GenericWallet'
import { HDWalletCreate } from './utils'


const getLedgerTransport = async () => {
    const transport = await Transport.create()
    return transport
}

const getLedgerAppConfig = async _ledger => {
    const appConfig = await _ledger.getAppConfiguration()
    return appConfig
}



export default class LedgerWallet extends GenericWallet {
    constructor() {
        super()
        return this
    }

    static async init(basePath, offset = 0, numberWallets = 10) {
        const instance = new LedgerWallet()
        instance.hdpath = basePath
        instance.offset = offset
        instance.numberWallets = numberWallets
        instance.transport = await getLedgerTransport()
        instance.ledger = new Ledger(instance.transport)
        instance.appConfig = await getLedgerAppConfig(instance.ledger)
        instance.payload = await instance.getRootPubKey(instance.ledger, instance.hdpath)
        return instance
    }

    async getRootPubKey(_ledger, path) {
        try {
            const result = await _ledger.getAddress(
                path,
                false,
                true
            )
            return result
        } catch (error) {
            console.log('Cannot get root Public Key')
            console.log(error)
        }
    }

    getAddress() {
        let wallets = []
        let convertedAddress
        for (let i = this.offset; i < this.numberWallets; i++) {
            convertedAddress = HDWalletCreate(this.payload, i, 'ledger')
            wallets.push(convertedAddress)
        }
        return wallets
    }

    async setDefaultAddress(index) {
        this.addressPath = this.hdpath + '/' + index
        this.defaultAddress = await this.ledger.getAddress(this.addressPath)
    }

    async signMessage(message) {
        const hexifiedMsg = Buffer.from(message).toString('hex')
        const signature = await this.ledger.signPersonalMessage(this.addressPath, hexifiedMsg)

        let v = signature['v'] - 27
        v = v.toString(16)
        if (v.length < 2) {
            v = '0' + v
        }
        
        const result = '0x' + signature['r'] + signature['s'] + v
        return result
    }

    async signTransaction(txParams, stringified = false) {
        try {
            const rawTx = new Transaction(txParams)
            const chainId = txParams.chainId || 1
            rawTx.v = Buffer.from([chainId])

            const serializedRawTx = rawTx.serialize().toString('hex')
            const signature = await this.ledger.signTransaction(
                this.addressPath,
                serializedRawTx
            )

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