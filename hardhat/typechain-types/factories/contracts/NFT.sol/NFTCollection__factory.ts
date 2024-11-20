/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type {
  NFTCollection,
  NFTCollectionInterface,
} from "../../../contracts/NFT.sol/NFTCollection";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_fromTokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_toTokenId",
        type: "uint256",
      },
    ],
    name: "BatchMetadataUpdate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "MetadataUpdate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "string",
        name: "uri",
        type: "string",
      },
    ],
    name: "safeMint",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b506040518060400160405280600d81526020017f4e4654436f6c6c656374696f6e000000000000000000000000000000000000008152506040518060400160405280600481526020017f4e46544300000000000000000000000000000000000000000000000000000000815250816000908051906020019062000096929190620000b8565b508060019080519060200190620000af929190620000b8565b505050620001cd565b828054620000c69062000168565b90600052602060002090601f016020900481019282620000ea576000855562000136565b82601f106200010557805160ff191683800117855562000136565b8280016001018555821562000136579182015b828111156200013557825182559160200191906001019062000118565b5b50905062000145919062000149565b5090565b5b80821115620001645760008160009055506001016200014a565b5090565b600060028204905060018216806200018157607f821691505b602082108114156200019857620001976200019e565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b612a8280620001dd6000396000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c806370a082311161008c578063b88d4fde11610066578063b88d4fde1461025b578063c87b56dd14610277578063d204c45e146102a7578063e985e9c5146102d7576100ea565b806370a08231146101f157806395d89b4114610221578063a22cb4651461023f576100ea565b8063095ea7b3116100c8578063095ea7b31461016d57806323b872dd1461018957806342842e0e146101a55780636352211e146101c1576100ea565b806301ffc9a7146100ef57806306fdde031461011f578063081812fc1461013d575b600080fd5b61010960048036038101906101049190611f30565b610307565b60405161011691906122aa565b60405180910390f35b610127610368565b60405161013491906122c5565b60405180910390f35b61015760048036038101906101529190611f82565b6103fa565b6040516101649190612243565b60405180910390f35b61018760048036038101906101829190611ef4565b610440565b005b6101a3600480360381019061019e9190611d9a565b610558565b005b6101bf60048036038101906101ba9190611d9a565b6105b8565b005b6101db60048036038101906101d69190611f82565b6105d8565b6040516101e89190612243565b60405180910390f35b61020b60048036038101906102069190611d35565b61065f565b6040516102189190612467565b60405180910390f35b610229610717565b60405161023691906122c5565b60405180910390f35b61025960048036038101906102549190611e64565b6107a9565b005b61027560048036038101906102709190611de9565b6107bf565b005b610291600480360381019061028c9190611f82565b610821565b60405161029e91906122c5565b60405180910390f35b6102c160048036038101906102bc9190611ea0565b610934565b6040516102ce9190612467565b60405180910390f35b6102f160048036038101906102ec9190611d5e565b61096b565b6040516102fe91906122aa565b60405180910390f35b6000634906490660e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614806103615750610360826109ff565b5b9050919050565b60606000805461037790612602565b80601f01602080910402602001604051908101604052809291908181526020018280546103a390612602565b80156103f05780601f106103c5576101008083540402835291602001916103f0565b820191906000526020600020905b8154815290600101906020018083116103d357829003601f168201915b5050505050905090565b600061040582610ae1565b6004600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b600061044b826105d8565b90508073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614156104bc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104b390612427565b60405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff166104db610b2c565b73ffffffffffffffffffffffffffffffffffffffff16148061050a575061050981610504610b2c565b61096b565b5b610549576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161054090612447565b60405180910390fd5b6105538383610b34565b505050565b610569610563610b2c565b82610bed565b6105a8576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161059f906122e7565b60405180910390fd5b6105b3838383610c82565b505050565b6105d3838383604051806020016040528060008152506107bf565b505050565b6000806105e483610f7c565b9050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610656576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161064d90612407565b60405180910390fd5b80915050919050565b60008073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614156106d0576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106c7906123a7565b60405180910390fd5b600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b60606001805461072690612602565b80601f016020809104026020016040519081016040528092919081815260200182805461075290612602565b801561079f5780601f106107745761010080835404028352916020019161079f565b820191906000526020600020905b81548152906001019060200180831161078257829003601f168201915b5050505050905090565b6107bb6107b4610b2c565b8383610fb9565b5050565b6107d06107ca610b2c565b83610bed565b61080f576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610806906122e7565b60405180910390fd5b61081b84848484611126565b50505050565b606061082c82610ae1565b600060066000848152602001908152602001600020805461084c90612602565b80601f016020809104026020016040519081016040528092919081815260200182805461087890612602565b80156108c55780601f1061089a576101008083540402835291602001916108c5565b820191906000526020600020905b8154815290600101906020018083116108a857829003601f168201915b5050505050905060006108d6611182565b90506000815114156108ec57819250505061092f565b60008251111561092157808260405160200161090992919061221f565b6040516020818303038152906040529250505061092f565b61092a846111bf565b925050505b919050565b6000806109416007611227565b905061094d6007611235565b610957848261124b565b6109618184611269565b8091505092915050565b6000600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b60007f80ac58cd000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161480610aca57507f5b5e139f000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b80610ada5750610ad982611314565b5b9050919050565b610aea8161137e565b610b29576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b2090612407565b60405180910390fd5b50565b600033905090565b816004600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff16610ba7836105d8565b73ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b600080610bf9836105d8565b90508073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161480610c3b5750610c3a818561096b565b5b80610c7957508373ffffffffffffffffffffffffffffffffffffffff16610c61846103fa565b73ffffffffffffffffffffffffffffffffffffffff16145b91505092915050565b8273ffffffffffffffffffffffffffffffffffffffff16610ca2826105d8565b73ffffffffffffffffffffffffffffffffffffffff1614610cf8576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610cef90612327565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610d68576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d5f90612367565b60405180910390fd5b610d7583838360016113bf565b8273ffffffffffffffffffffffffffffffffffffffff16610d95826105d8565b73ffffffffffffffffffffffffffffffffffffffff1614610deb576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610de290612327565b60405180910390fd5b6004600082815260200190815260200160002060006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556001600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055506001600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550816002600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4610f7783838360016113c5565b505050565b60006002600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415611028576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161101f90612387565b60405180910390fd5b80600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c318360405161111991906122aa565b60405180910390a3505050565b611131848484610c82565b61113d848484846113cb565b61117c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161117390612307565b60405180910390fd5b50505050565b60606040518060400160405280601581526020017f68747470733a2f2f697066732e696f2f697066732f0000000000000000000000815250905090565b60606111ca82610ae1565b60006111d4611182565b905060008151116111f4576040518060200160405280600081525061121f565b806111fe84611562565b60405160200161120f92919061221f565b6040516020818303038152906040525b915050919050565b600081600001549050919050565b6001816000016000828254019250508190555050565b611265828260405180602001604052806000815250611686565b5050565b6112728261137e565b6112b1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016112a8906123c7565b60405180910390fd5b806006600084815260200190815260200160002090805190602001906112d8929190611b59565b507ff8e1a15aba9398e019f0b49df1a4fde98ee17ae345cb5f6b5e2c27f5033e8ce7826040516113089190612467565b60405180910390a15050565b60007f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b60008073ffffffffffffffffffffffffffffffffffffffff166113a083610f7c565b73ffffffffffffffffffffffffffffffffffffffff1614159050919050565b50505050565b50505050565b60006113ec8473ffffffffffffffffffffffffffffffffffffffff166116e1565b15611555578373ffffffffffffffffffffffffffffffffffffffff1663150b7a02611415610b2c565b8786866040518563ffffffff1660e01b8152600401611437949392919061225e565b602060405180830381600087803b15801561145157600080fd5b505af192505050801561148257506040513d601f19601f8201168201806040525081019061147f9190611f59565b60015b611505573d80600081146114b2576040519150601f19603f3d011682016040523d82523d6000602084013e6114b7565b606091505b506000815114156114fd576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016114f490612307565b60405180910390fd5b805181602001fd5b63150b7a0260e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161491505061155a565b600190505b949350505050565b60606000600161157184611704565b01905060008167ffffffffffffffff8111156115b6577f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6040519080825280601f01601f1916602001820160405280156115e85781602001600182028036833780820191505090505b509050600082602001820190505b60011561167b578080600190039150507f3031323334353637383961626364656600000000000000000000000000000000600a86061a8153600a8581611665577f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b04945060008514156116765761167b565b6115f6565b819350505050919050565b611690838361193b565b61169d60008484846113cb565b6116dc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016116d390612307565b60405180910390fd5b505050565b6000808273ffffffffffffffffffffffffffffffffffffffff163b119050919050565b600080600090507a184f03e93ff9f4daa797ed6e38ed64bf6a1f0100000000000000008310611788577a184f03e93ff9f4daa797ed6e38ed64bf6a1f010000000000000000838161177e577f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b0492506040810190505b6d04ee2d6d415b85acef810000000083106117eb576d04ee2d6d415b85acef810000000083816117e1577f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b0492506020810190505b662386f26fc10000831061184057662386f26fc100008381611836577f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b0492506010810190505b6305f5e100831061188f576305f5e1008381611885577f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b0492506008810190505b61271083106118da5761271083816118d0577f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b0492506004810190505b606483106119235760648381611919577f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b0492506002810190505b600a8310611932576001810190505b80915050919050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614156119ab576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016119a2906123e7565b60405180910390fd5b6119b48161137e565b156119f4576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016119eb90612347565b60405180910390fd5b611a026000838360016113bf565b611a0b8161137e565b15611a4b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611a4290612347565b60405180910390fd5b6001600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550816002600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4611b556000838360016113c5565b5050565b828054611b6590612602565b90600052602060002090601f016020900481019282611b875760008555611bce565b82601f10611ba057805160ff1916838001178555611bce565b82800160010185558215611bce579182015b82811115611bcd578251825591602001919060010190611bb2565b5b509050611bdb9190611bdf565b5090565b5b80821115611bf8576000816000905550600101611be0565b5090565b6000611c0f611c0a846124a7565b612482565b905082815260208101848484011115611c2757600080fd5b611c328482856125c0565b509392505050565b6000611c4d611c48846124d8565b612482565b905082815260208101848484011115611c6557600080fd5b611c708482856125c0565b509392505050565b600081359050611c87816129f0565b92915050565b600081359050611c9c81612a07565b92915050565b600081359050611cb181612a1e565b92915050565b600081519050611cc681612a1e565b92915050565b600082601f830112611cdd57600080fd5b8135611ced848260208601611bfc565b91505092915050565b600082601f830112611d0757600080fd5b8135611d17848260208601611c3a565b91505092915050565b600081359050611d2f81612a35565b92915050565b600060208284031215611d4757600080fd5b6000611d5584828501611c78565b91505092915050565b60008060408385031215611d7157600080fd5b6000611d7f85828601611c78565b9250506020611d9085828601611c78565b9150509250929050565b600080600060608486031215611daf57600080fd5b6000611dbd86828701611c78565b9350506020611dce86828701611c78565b9250506040611ddf86828701611d20565b9150509250925092565b60008060008060808587031215611dff57600080fd5b6000611e0d87828801611c78565b9450506020611e1e87828801611c78565b9350506040611e2f87828801611d20565b925050606085013567ffffffffffffffff811115611e4c57600080fd5b611e5887828801611ccc565b91505092959194509250565b60008060408385031215611e7757600080fd5b6000611e8585828601611c78565b9250506020611e9685828601611c8d565b9150509250929050565b60008060408385031215611eb357600080fd5b6000611ec185828601611c78565b925050602083013567ffffffffffffffff811115611ede57600080fd5b611eea85828601611cf6565b9150509250929050565b60008060408385031215611f0757600080fd5b6000611f1585828601611c78565b9250506020611f2685828601611d20565b9150509250929050565b600060208284031215611f4257600080fd5b6000611f5084828501611ca2565b91505092915050565b600060208284031215611f6b57600080fd5b6000611f7984828501611cb7565b91505092915050565b600060208284031215611f9457600080fd5b6000611fa284828501611d20565b91505092915050565b611fb48161254c565b82525050565b611fc38161255e565b82525050565b6000611fd482612509565b611fde818561251f565b9350611fee8185602086016125cf565b611ff7816126c3565b840191505092915050565b600061200d82612514565b6120178185612530565b93506120278185602086016125cf565b612030816126c3565b840191505092915050565b600061204682612514565b6120508185612541565b93506120608185602086016125cf565b80840191505092915050565b6000612079602d83612530565b9150612084826126d4565b604082019050919050565b600061209c603283612530565b91506120a782612723565b604082019050919050565b60006120bf602583612530565b91506120ca82612772565b604082019050919050565b60006120e2601c83612530565b91506120ed826127c1565b602082019050919050565b6000612105602483612530565b9150612110826127ea565b604082019050919050565b6000612128601983612530565b915061213382612839565b602082019050919050565b600061214b602983612530565b915061215682612862565b604082019050919050565b600061216e602e83612530565b9150612179826128b1565b604082019050919050565b6000612191602083612530565b915061219c82612900565b602082019050919050565b60006121b4601883612530565b91506121bf82612929565b602082019050919050565b60006121d7602183612530565b91506121e282612952565b604082019050919050565b60006121fa603d83612530565b9150612205826129a1565b604082019050919050565b612219816125b6565b82525050565b600061222b828561203b565b9150612237828461203b565b91508190509392505050565b60006020820190506122586000830184611fab565b92915050565b60006080820190506122736000830187611fab565b6122806020830186611fab565b61228d6040830185612210565b818103606083015261229f8184611fc9565b905095945050505050565b60006020820190506122bf6000830184611fba565b92915050565b600060208201905081810360008301526122df8184612002565b905092915050565b600060208201905081810360008301526123008161206c565b9050919050565b600060208201905081810360008301526123208161208f565b9050919050565b60006020820190508181036000830152612340816120b2565b9050919050565b60006020820190508181036000830152612360816120d5565b9050919050565b60006020820190508181036000830152612380816120f8565b9050919050565b600060208201905081810360008301526123a08161211b565b9050919050565b600060208201905081810360008301526123c08161213e565b9050919050565b600060208201905081810360008301526123e081612161565b9050919050565b6000602082019050818103600083015261240081612184565b9050919050565b60006020820190508181036000830152612420816121a7565b9050919050565b60006020820190508181036000830152612440816121ca565b9050919050565b60006020820190508181036000830152612460816121ed565b9050919050565b600060208201905061247c6000830184612210565b92915050565b600061248c61249d565b90506124988282612634565b919050565b6000604051905090565b600067ffffffffffffffff8211156124c2576124c1612694565b5b6124cb826126c3565b9050602081019050919050565b600067ffffffffffffffff8211156124f3576124f2612694565b5b6124fc826126c3565b9050602081019050919050565b600081519050919050565b600081519050919050565b600082825260208201905092915050565b600082825260208201905092915050565b600081905092915050565b600061255782612596565b9050919050565b60008115159050919050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b82818337600083830152505050565b60005b838110156125ed5780820151818401526020810190506125d2565b838111156125fc576000848401525b50505050565b6000600282049050600182168061261a57607f821691505b6020821081141561262e5761262d612665565b5b50919050565b61263d826126c3565b810181811067ffffffffffffffff8211171561265c5761265b612694565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b7f4552433732313a2063616c6c6572206973206e6f7420746f6b656e206f776e6560008201527f72206f7220617070726f76656400000000000000000000000000000000000000602082015250565b7f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560008201527f63656976657220696d706c656d656e7465720000000000000000000000000000602082015250565b7f4552433732313a207472616e736665722066726f6d20696e636f72726563742060008201527f6f776e6572000000000000000000000000000000000000000000000000000000602082015250565b7f4552433732313a20746f6b656e20616c7265616479206d696e74656400000000600082015250565b7f4552433732313a207472616e7366657220746f20746865207a65726f2061646460008201527f7265737300000000000000000000000000000000000000000000000000000000602082015250565b7f4552433732313a20617070726f766520746f2063616c6c657200000000000000600082015250565b7f4552433732313a2061646472657373207a65726f206973206e6f74206120766160008201527f6c6964206f776e65720000000000000000000000000000000000000000000000602082015250565b7f45524337323155524953746f726167653a2055524920736574206f66206e6f6e60008201527f6578697374656e7420746f6b656e000000000000000000000000000000000000602082015250565b7f4552433732313a206d696e7420746f20746865207a65726f2061646472657373600082015250565b7f4552433732313a20696e76616c696420746f6b656e2049440000000000000000600082015250565b7f4552433732313a20617070726f76616c20746f2063757272656e74206f776e6560008201527f7200000000000000000000000000000000000000000000000000000000000000602082015250565b7f4552433732313a20617070726f76652063616c6c6572206973206e6f7420746f60008201527f6b656e206f776e6572206f7220617070726f76656420666f7220616c6c000000602082015250565b6129f98161254c565b8114612a0457600080fd5b50565b612a108161255e565b8114612a1b57600080fd5b50565b612a278161256a565b8114612a3257600080fd5b50565b612a3e816125b6565b8114612a4957600080fd5b5056fea2646970667358221220ce4899d19fd6b7c99b4594034f0c4b1a2bc548ab4cc60461ad310372207b011664736f6c63430008040033";

type NFTCollectionConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: NFTCollectionConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class NFTCollection__factory extends ContractFactory {
  constructor(...args: NFTCollectionConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      NFTCollection & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): NFTCollection__factory {
    return super.connect(runner) as NFTCollection__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): NFTCollectionInterface {
    return new Interface(_abi) as NFTCollectionInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): NFTCollection {
    return new Contract(address, _abi, runner) as unknown as NFTCollection;
  }
}
