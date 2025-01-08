"use client"
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types"
import React, { useState } from "react"
import Modal from "react-responsive-modal"
import { AiFillCheckCircle } from "react-icons/ai"
import { infoToast } from "@/app/components/Toast"
import { FaTimes } from "react-icons/fa"

const WalletModal = ({
  open,
  setOpen,
  wallets,
  handleWalletSelections,
}: {
  open: boolean
  setOpen: (args: boolean) => void
  wallets: InjectedAccountWithMeta[]
  handleWalletSelections: (arg: InjectedAccountWithMeta) => void
}) => {
  const [selectedAccount, setSelectedAccount] =
    useState<InjectedAccountWithMeta>()
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      center
      closeIcon={<FaTimes size={20} />}
      classNames={{
        modal: "border border-white border-opacity-[0.23] rounded-3xl shadow-xl",
        closeButton: "text-white rounded-[50%] p-2",
        // overlay: "h-full w-full backdrop-blur absolute z-50 lg:hidden animate-menu-fade"
        overlay: "backdrop-blur-sm animate-menu-fade"
      }}
      styles={{
        modal: {
          backgroundColor: '#172033',
        },
      }}
    >
      <h6 className="text-lg text-white font-semibold">Select your wallet</h6>
      <hr className="my-3" />
      <div className="mt-5">
        <div className="flex flex-col gap-y-4 h-[300px] overflow-y-scroll no-scrollbar">
          {wallets.map((item) => (
            <button
              key={item.address}
              className="text-md text-white cursor-pointer shadow-white flex items-center gap-x-3 border border-white border-opacity-50 bg-gray-900 rounded-xl p-5"
              // style={{ border: '1px solid w' }}

              onClick={() => setSelectedAccount(item)}
            >
              <AiFillCheckCircle
                size={26}
                className={
                  selectedAccount === item ? "text-green-400" : "text-gray-500"
                }
              />

              {item.address}
            </button>
          ))}
          {!wallets.length && (
            <div className="text-center text-sm text-gray-500 flex flex-col justify-center items-center h-full gap-4">
              <div>No wallet found.</div>
              <div>
                Please install polkadot extension or check permission settings.
              </div>
              <a
                href="https://polkadot.js.org/extension/"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600"
              >
                Install Extension
              </a>
            </div>
          )}
        </div>
      </div>
      <div className="mt-5">
        <button
          className='w-full flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-800 text-white py-2 px-4 shadow-lg hover:from-indigo-600 hover:to-pink-600 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed'
          // className="w-full bg-indigo-800 text-white py-2 px-4 rounded-lg hover:bg-indigo-900"
          onClick={() => {
            if (!selectedAccount) {
              infoToast("Select at least one wallet!")
              return
            }
            handleWalletSelections(selectedAccount as InjectedAccountWithMeta)
          }}
        >
          Connect Now
        </button>
      </div>
    </Modal>
  )x
}

export default WalletModal
