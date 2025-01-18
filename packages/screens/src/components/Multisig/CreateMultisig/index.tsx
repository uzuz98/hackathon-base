'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { Button, Icon, Input } from '@repo/ui'
import SelectChain from './SelectChain'
import FormMultisig from './FormMultisig'
import { useWallet } from '@coin98-com/wallet-adapter-react'
import { factoryContract } from '../../../utils/factory.contract'
import { toast } from 'sonner'

const CreateMultisigScreen = () => {
  const [step, setStep] = useState<number>(0)
  const [nonce, setNonce] = useState('')
  const { address } = useWallet()
  const onInitMultisig = () => {
    setStep(1)
  }
  const handleMultisigCreation = async () => {
    try {
      const multisigPromise = factoryContract.createMultisig(address!)

      toast.promise(multisigPromise, {
        loading: 'Creating multisig...',
        success: () => {
          setStep(2)
          return 'Multisig created successfully!'
        },
        error: 'Multisig creation failed',
      })

      const { nonce } = await multisigPromise
      setNonce(nonce)
    } catch (error) {
      console.error('Error creating multisig:', error)
    }
  }
  if (step === 1) {
    return (
      <div className="mx-auto all-center">
        <Button onClick={handleMultisigCreation}>Create multisig</Button>
      </div>
    )
  }
  if (step === 2) {
    return <FormMultisig nonce={nonce} />
  }
  return (
    <div className="h-screen all-cente w-full">
      <div className="p-8 border all-center flex-col gap-4 rounded-lg">
        <div className="gap-4 mx-auto all-center">
          <Image
            src="https://coin-images.coingecko.com/coins/images/3688/large/hbar.png?1696504364"
            alt="avt_multisig_wallet"
            width={200}
            height={200}
          />
          <Button variant={'outline'} className="">
            <Icon name="app_upload" className="size-5" />
            <p>Upload file</p>
          </Button>
        </div>
        <div className="flex gap-x-2 ">
          <SelectChain />
          <Input placeholder="Type Multisig wallet" className="border border-backgroundInput" />
        </div>
        <Button onClick={onInitMultisig}>Continute</Button>
      </div>
    </div>
  )
}

export default CreateMultisigScreen
