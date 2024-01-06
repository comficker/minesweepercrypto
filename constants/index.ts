import type {Room} from "~/interface/gms";

export const appName = 'Minesweeper Battle'
export const appDescription = 'Join minesweeper battle on minesweeperbattle.com'

export const ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "when",
        "type": "uint256"
      }
    ],
    "name": "TotalBridiged",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "lockAtZkSync",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "sendToZk",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
export const CONTRACT_ADDRESS = "0x23f6bA2b5cc0adA9C1e6e227452940Dc0A37FF48"


export const SAMPLE_ROOM: Room = {
  id: 0,
  width: 0,
  height: 0,
  is_multiplayer: false,
  ticket: 0,
  num_bomb: 0,
  prize: 0,
  status: "waiting",
  start_at: 0,
  end_at: 0,
  turns: [],
  gms_members: [],
  maps: {},
  results: {}
}
