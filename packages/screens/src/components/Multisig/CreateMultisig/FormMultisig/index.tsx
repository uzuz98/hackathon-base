'use client'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormField, Form, FormItem, FormControl, Input, FormMessage, Button, Separator } from '@repo/ui'
import { createPowersSchema, CreatePowersSchemaType } from './schema'
import { toast } from 'sonner'
import { factoryContract } from '../../../../utils/factory.contract'
import { useWallet } from '@coin98-com/wallet-adapter-react'
import { multisigContract } from '../../../../utils/multisig.contract'
interface IFormMultisigProps {
  nonce: string
}
interface PowerInputInfo {
  owner: string
  votePower: string
  isRequired: boolean
}
const FormMultisig: React.FC<IFormMultisigProps> = ({ nonce }) => {
  const { address } = useWallet()

  const form = useForm<CreatePowersSchemaType>({
    resolver: zodResolver(createPowersSchema()),
    defaultValues: {
      powers: [{ owner: address!, votePower: '2' }],
    },
  })
  const { fields, append } = useFieldArray({
    control: form.control,
    name: 'powers',
  })
  const handleSetupMultisig = async (powerInputInfors: PowerInputInfo[]) => {
    if (!address) {
      return
    }
    const multisigAddress = await factoryContract.getMultisigAddress(nonce, address)
    const transaction = await multisigContract.setupMultisig({
      ownerInfoInputs: powerInputInfors,
      multisigAddress: multisigAddress,
      userAddress: address,
    })
    return transaction
  }
  async function onSubmit(formValues: CreatePowersSchemaType) {
    const ownerInputs: PowerInputInfo[] = formValues.powers.map((owner) => ({
      ...owner,
      isRequired: true,
    }))

    const setupMultisigPromise = handleSetupMultisig(ownerInputs)

    toast.promise(setupMultisigPromise, {
      loading: 'Setting up the Multisig contract...',
      success: (result) => {
        const txLink = `https://www.vicscan.xyz/tx/${result}`

        return (
          <span>
            Multisig setup completed!{' '}
            <a
              href={txLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'blue', textDecoration: 'underline' }}
            >
              View Transaction
            </a>
          </span>
        )
      },
      error: 'Failed to set up Multisig contract!',
    })

    try {
      const setupResult = await setupMultisigPromise
      console.log('Multisig Setup Result:', setupResult)
    } catch (error) {
      console.error('Error during Multisig setup:', error)
    }
  }
  const addPower = () => {
    const currentValues = form.getValues('powers')

    // Check if all current fields are valid
    const isValid = currentValues.every((item) => item.owner.trim() !== '' && item.votePower.trim() !== '')

    if (isValid) {
      append({ owner: '', votePower: '' })
    } else {
      form.trigger() // Trigger validation to highlight errors
    }
  }

  return (
    <div className="w-full">
      <h2 className="text-textTitle text-2xl">Owners and Vote Power</h2>
      <div className="flex justify-between text-sm">
        <p>Wallet Address or OneID(ERC20)</p>
        <p>Vote Power</p>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4">
          {fields.map((field, index) => (
            <div className="flex gap-x-2" key={field.id}>
              {/* Address Owner Field */}
              <FormField
                control={form.control}
                name={`powers.${index}.owner`}
                render={({ field }) => (
                  <FormItem className="flex-1 bg-backgroundInput py-2 rounded-lg">
                    <FormControl>
                      <Input placeholder="Enter your wallet address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Vote Field */}
              <FormField
                control={form.control}
                name={`powers.${index}.votePower`}
                render={({ field }) => (
                  <FormItem className="w-20 bg-backgroundInput rounded-lg">
                    <FormControl>
                      <Input placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
          <div className="flex justify-between">
            <Button type="button" onClick={addPower}>
              Add
            </Button>
            <Button type="submit" disabled={!address}>
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default FormMultisig
