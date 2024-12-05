'use client'
import Image from 'next/image'
import Link from 'next/link'
import config from '@/app/config.json'
import { usePathname } from 'next/navigation'

// polkadot 
import {
  FaWallet
} from "react-icons/fa"
import { FaSackDollar } from "react-icons/fa6";
import { usePolkadot } from "@/app/wallet/context"
import { truncateWalletAddress } from "@/app/wallet/utils"

type THeaderLinkProps = {
  href: string
  target?: string
  icon: string
  alt: string
  className?: string
}

const HeaderLink = ({
  href,
  target = '_blank',
  icon,
  alt,
  className = '',
}: THeaderLinkProps) => (
  <Link href={href} target={target} className={className}>
    <Image src={icon} width={25} height={25} alt={alt} />
  </Link>
)

const navigation = [
  { name: 'modules', href: config.links.modules },
]

export const Header = () => {
  const { isInitialized, handleConnect, selectedAccount, balance } = usePolkadot()
  const currentPath = usePathname();

  return (
    <header className="z-40 sticky top-0 flex flex-none w-full border-b border-gray-50/[0.06] backdrop-blur">
      <nav className="p-4 px-6 mx-auto grid w-full grid-flow-col items-center justify-between">
        <div className="flex items-center">
          <Image src="/comhub.png" width={50} height={50} alt="commune logo" priority className="mr-[3px]" />

        </div>

        <div className="flex justify-center gap-x-6">
          {navigation.map(({ name, href }) => (
            <Link 
              key={name} 
              href={href}
              className={`px-4 py-2 rounded-lg text-sm leading-6 text-gray-100 hover:bg-gray-800 transition-colors ${
                currentPath === href ? "bg-gray-800 font-medium" : ""
              }`}
            >
              {name}
            </Link>
          ))}
        </div>

        <div className="flex items-center">
          {isInitialized && (
            <>
              {selectedAccount ? (
                <button onClick={handleConnect}>
                  <div className="flex items-center">
                    <FaWallet size={24} className="text-white" />
                    <span className="ml-2 font-mono text-white">
                      {truncateWalletAddress(selectedAccount.address)}
                    </span>
                    <div className="h-10 border-l border-gray-300 mx-4"></div>
                    <FaSackDollar size={20} className="text-white" />
                    {balance !== undefined && (
                      <span className="ml-2 font-mono text-white">
                        {balance.toFixed(2)} COMAI
                      </span>
                    )}
                  </div>
                </button>
              ) : (
                <button 
                  onClick={handleConnect} 
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-800 text-white py-2 px-3 text-sm"
                >
                  <Image
                    width={30}
                    height={20}
                    alt="Connect PolkadotJS Wallet"
                    src="/polkadotjs.png"
                  />
                  <span>connect</span>
                </button>
              )}
            </>
          )}
        </div>
      </nav>
    </header>
  )
}