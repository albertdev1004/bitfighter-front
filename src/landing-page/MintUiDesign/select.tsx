// // Importing some predefined examples.
// import {
//     mainnet,
//     sepolia,
//     bsc,
//     bscTestnet,
//     linea,
//     lineaSepolia,
//     polygon,
//     polygonAmoy,
//     solana,
//     solanaTestnet,
//     defineChain,
// } from '@particle-network/connectkit/chains';

// // Define Custom Chains
// const merlinTestnet = defineChain({
//     id: 686868,
//     name: 'Merlin Testnet',
//     nativeCurrency: {
//         decimals: 18,
//         name: 'Bitcoin',
//         symbol: 'BTC',
//     },
//     rpcUrls: {
//         default: {
//             http: ['https://testnet-rpc.merlinchain.io'],
//         },
//     },
//     blockExplorers: {
//         default: { name: 'Explorer', url: 'https://testnet-scan.merlinchain.io' },
//     },
//     testnet: true,
// });
