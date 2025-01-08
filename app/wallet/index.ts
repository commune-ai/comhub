import { 
    blake2AsHex, 
    sr25519PairFromSeed,
    encodeAddress,
    sr25519Sign,
    sr25519Verify
} from '@polkadot/util-crypto';
import { hexToU8a, u8aToHex } from '@polkadot/util';
import { secp256k1 } from '@noble/curves/secp256k1';

export interface WalletAccount {
    address: string;
    type: 'sr25519' | 'ecdsa';
    publicKey: string;
    privateKey: string;
}

export class Wallet {
    private readonly key: WalletAccount;

    constructor(password: string = "bro") {
        if (!password || typeof password !== 'string') {
            throw new Error('Invalid password provided');
        }
        // Assume cryptoWaitReady() is already called outside before construction
        this.key = this.fromPassword(password);
    }

    private fromPassword(password: string): WalletAccount {
        const seedHex = blake2AsHex(password, 256);
        const seedBytes = hexToU8a(seedHex);
        
        // Create SR25519 key pair
        const keyPair = sr25519PairFromSeed(seedBytes);
        const address = encodeAddress(keyPair.publicKey, 42);

        return {
            address,
            type: 'sr25519',
            publicKey: u8aToHex(keyPair.publicKey),
            privateKey: u8aToHex(keyPair.secretKey)
        };
    }

    public static fromPrivateKey(privateKeyHex: string, type: 'sr25519' | 'ecdsa' = 'ecdsa'): WalletAccount {
        if (!privateKeyHex || typeof privateKeyHex !== 'string') {
            throw new Error('Invalid private key provided');
        }

        const privateKey = hexToU8a(privateKeyHex);
        let publicKey: Uint8Array;
        
        if (type === 'sr25519') {
            const keyPair = sr25519PairFromSeed(privateKey);
            publicKey = keyPair.publicKey;
        } else {
            publicKey = secp256k1.getPublicKey(privateKey, true); // Compressed public key
        }

        const address = encodeAddress(publicKey, 42);
        
        return {
            address,
            type,
            publicKey: u8aToHex(publicKey),
            privateKey: privateKeyHex
        };
    }

    public async sign(message: string): Promise<string> {
        if (!message) {
            throw new Error('Empty message cannot be signed');
        }

        const messageBytes = new TextEncoder().encode(message);
        
        if (this.key.type === 'sr25519') {
            const signature = sr25519Sign(
                hexToU8a(this.key.publicKey),
                hexToU8a(this.key.privateKey),
                messageBytes
            );
            return u8aToHex(signature);
        } else {
            const messageHash = blake2AsHex(message);
            const signature = secp256k1.sign(
                hexToU8a(messageHash),
                hexToU8a(this.key.privateKey)
            );
            return u8aToHex(signature);
        }
    }

    public async verify(
        message: string, 
        signature: string, 
        publicKey: string,
        type?: 'sr25519' | 'ecdsa'
    ): Promise<boolean> {
        if (!message || !signature || !publicKey) {
            throw new Error('Invalid verification parameters');
        }

        const sigType = type || this.key.type;
        const messageBytes = new TextEncoder().encode(message);

        if (sigType === 'sr25519') {
            return sr25519Verify(
                messageBytes,
                hexToU8a(signature),
                hexToU8a(publicKey)
            );
        } else {
            const messageHash = blake2AsHex(message);
            return secp256k1.verify(
                hexToU8a(signature),
                hexToU8a(messageHash),
                hexToU8a(publicKey)
            );
        }
    }

    public async encrypt(message: string, recipientPublicKey: string): Promise<string> {
        if (!message || !recipientPublicKey) {
            throw new Error('Invalid encryption parameters');
        }

        if (this.key.type === 'sr25519') {
            throw new Error('SR25519 encryption not implemented');
        }

        const sharedSecret = secp256k1.getSharedSecret(
            hexToU8a(this.key.privateKey),
            hexToU8a(recipientPublicKey)
        );

        const key = await window.crypto.subtle.importKey(
            'raw',
            sharedSecret,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt']
        );

        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const messageBytes = new TextEncoder().encode(message);
        
        const ciphertext = await window.crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            key,
            messageBytes
        );

        return u8aToHex(new Uint8Array([...iv, ...new Uint8Array(ciphertext)]));
    }

    public async decrypt(encryptedMessage: string, senderPublicKey: string): Promise<string> {
        if (!encryptedMessage || !senderPublicKey) {
            throw new Error('Invalid decryption parameters');
        }

        if (this.key.type === 'sr25519') {
            throw new Error('SR25519 decryption not implemented');
        }

        const sharedSecret = secp256k1.getSharedSecret(
            hexToU8a(this.key.privateKey),
            hexToU8a(senderPublicKey)
        );

        const key = await window.crypto.subtle.importKey(
            'raw',
            sharedSecret,
            { name: 'AES-GCM', length: 256 },
            false,
            ['decrypt']
        );

        const encryptedData = hexToU8a(encryptedMessage);
        const iv = encryptedData.slice(0, 12);
        const ciphertext = encryptedData.slice(12);

        const decrypted = await window.crypto.subtle.decrypt(
            { name: 'AES-GCM', iv },
            key,
            ciphertext
        );

        return new TextDecoder().decode(decrypted);
    }

    public getPublicKey(): string {
        return this.key.publicKey;
    }

    public getAddress(): string {
        return this.key.address;
    }

    public getType(): 'sr25519' | 'ecdsa' {
        return this.key.type;
    }
}
