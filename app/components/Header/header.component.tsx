'use client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import config from '@/app/config.json'
import { Wallet } from '@/app/wallet'
import { CopyButton } from '@/app/components/CopyButton'
import { cryptoWaitReady } from '@polkadot/util-crypto'

const navigation = [
  { name: 'modules', href: config.links.modules },
]

export const Header = () => {
  const currentPath = usePathname()
  const [password, setPassword] = useState('')
  const [walletInfo, setWalletInfo] = useState<{address: string, type: string} | null>(null)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Wait until the WASM is ready
      await cryptoWaitReady();

      // Now that the WASM is ready, we can safely instantiate the wallet
      const wallet = new Wallet(password);
      setWalletInfo({
        address: wallet.getAddress(),
        type: wallet.getType()
      });
    } catch (error) {
      console.error('Failed to create wallet:', error);
    }
  };

  return (
    <header className="z-40 sticky top-0 flex flex-none w-full border-b border-gray-50/[0.06] backdrop-blur">
      <nav className="p-4 px-6 mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <Link href="/">
            <Image 
              src="/comhub.png" 
              width={50} 
              height={50} 
              alt="commune logo" 
              priority 
              className="mr-[3px]" 
            />
          </Link>
        </div>

        <div className="flex items-center gap-x-6">
          {walletInfo ? (
            <div className="flex items-center gap-x-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/50 border border-gray-700">
                <span className="text-sm text-gray-400">
                  {walletInfo.address.slice(0,6)}...{walletInfo.address.slice(-4)}
                </span>
                <CopyButton code={walletInfo.address} />
              </div>
              <button
                onClick={() => setWalletInfo(null)}
                className="px-4 py-2 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <form onSubmit={handleSignIn} className="flex items-center gap-x-2">
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-sm leading-6 text-gray-100 bg-indigo-500 hover:bg-indigo-600 transition-colors"
              >
                Sign In
              </button>
            </form>
          )}
        </div>
      </nav>
    </header>
  )
}
