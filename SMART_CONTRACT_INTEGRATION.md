# Smart Contract Integration

## Overview
The check-eligibility page now integrates with the Menaces smart contract deployed on Ethereum Mainnet at:
`0x5394603d355482c126f7cf3603e419b67b31b76e`

## How It Works

### 1. Wallet Connection
- Users click on the eligibility image to connect their Web3 wallet (MetaMask, etc.)
- The app requests account access via `window.ethereum.request`
- Once connected, the wallet address is stored in state

### 2. Smart Contract Call
- After wallet connection, the app automatically checks eligibility
- It calls the `balanceOf` function on the ERC1155 contract
- Parameters: `balanceOf(userAddress, tokenId)` where `tokenId = 0`
- The contract returns the user's balance for that token ID

### 3. Eligibility Determination
- If `balance > 0`: User is **eligible** → Shows ELIGIBILITY_2 image
- If `balance = 0`: User is **not eligible** → Shows ELIGIBILITY_3 image

### 4. Visual Feedback
- **ELIGIBILITY_1**: Initial state (not connected) or checking
- **ELIGIBILITY_2**: Eligible (has tokens)
- **ELIGIBILITY_3**: Not eligible (no tokens)

## Technical Stack
- **viem**: Ethereum library for contract interaction
- **Ethereum Mainnet**: Production blockchain network
- **ERC1155**: NFT standard with multi-token support

## Contract Features
The mainnet contract includes additional functionality:
- `ownerBalance`: Check token balance for a specific owner
- `tokensOfOwner`: Get all token IDs owned by an address
- `mintPasses`: Mint passes to multiple addresses (owner only)
- `burn/burnBatch`: Burn tokens
- `totalSupply`: Get total supply of tokens
- `name/symbol`: Contract metadata

## Files Modified
1. `app/check-eligibility/page.tsx` - Main eligibility page with wallet connection and contract integration
2. `lib/contract.ts` - Contract configuration (mainnet address and complete ABI)
3. `package.json` - Added viem dependency

## Testing
To test the integration:
1. Install MetaMask or another Web3 wallet
2. Connect to **Ethereum Mainnet**
3. Navigate to the check-eligibility page
4. Click the image to connect your wallet
5. The app will check your balance and display the appropriate result

## Token ID Configuration
Currently checking token ID `0`. To check a different token ID, modify line 88 in `app/check-eligibility/page.tsx`:
```typescript
args: [walletAddress, BigInt(0)], // Change 0 to your desired token ID
```

## Error Handling
The implementation includes:
- Wallet connection errors
- Contract call failures
- Missing wallet provider detection
- User-friendly error messages displayed in the UI
