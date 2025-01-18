import Web3 from 'web3'

// import pancakeSwapAbi from '../abi/pancakeSwapABI'

// Initialize Web3
const web3 = new Web3()

// PancakeSwap Router contract address
// const routerAddress = '0x10ED43C718714eb63d5aA57B78B54704E256024E'; // PancakeSwap V2 Router

// Function to validate a signature
export const validateSignature = (hubName: string, signature: string, expectedAddress: string): boolean => {
  // Create the message to sign
  const message = `Sign this message for add hubs ${hubName}`
  // Hash the message to match the format of the signature
  const messageHash = web3.utils.sha3(message) // You could also use web3.utils.soliditySha3 for more advanced hashing

  // Recover the address from the signature
  if (!messageHash) {
    throw new Error('Failed to hash the message')
  }

  const recoveredAddress = web3.eth.accounts.recover(messageHash, signature)

  // Compare the recovered address with the expected address
  return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase()
}
