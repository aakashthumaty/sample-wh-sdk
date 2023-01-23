// this is the controller in MVC


//require('dotenv').config();
// const dotenv = require('dotenv');
// dotenv.config();

import React from "react";

import {
  getForeignAssetSolana,
  hexToUint8Array,
  nativeToHexString,
  CHAIN_ID_ETH,
} from "@certusone/wormhole-sdk";

const { ethers } = require("ethers");
//const { REACT_APP_ALCHEMY_KEY, REACT_APP_ALCHEMY_WSS, API_URL, PRIVATE_KEY, API_KEY, CONTRACT_ADDRESS } = process.env;

//export const helloWorldContract;
const alchemyWSSKey = process.env.REACT_APP_ALCHEMY_WSS;
const apiURL = process.env.REACT_APP_API_URL;
const privateKey = process.env.REACT_APP_PRIVATE_KEY;
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;


const contract_address = "0xf11779E7aB6cc4a19BB4d2efFA669a91bffDf89f"



const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const Aweb3 = createAlchemyWeb3(alchemyWSSKey); 

//this contract ABI is created when we do hardhat compile
const contractABI = require("./HelloWorld.json");

// Provider - this is a node provider that gives you read and write access to the blockchain.
// Signer - this represents an Ethereum account that has the ability to sign transactions.
// Contract - this is an Ethers.js object that represents a specific contract deployed on-chain.

// // Provider
const alchemyProvider = new ethers.providers.AlchemyProvider("goerli", alchemyKey);

// // Signer
const signer = new ethers.Wallet(privateKey, alchemyProvider);

// // Contract (dont forget export keyword so you can import/use in frontend)
export const helloWorldContractOne = new ethers.Contract(contractAddress, contractABI.abi, signer);

//other way to instantiate contract
export const helloWorldContract = new Aweb3.eth.Contract(
    contractABI.abi,
    contractAddress
  );

export const loadCurrentMessage = async () => { 
    const message = await helloWorldContractOne.message(); 
    //const message = await helloWorldContract.methods().message().call();
    return message;
  
};

// checks if window.ethereum is in the browser, window.Ethereum is a global API injected by Metamask and other wallet providers that allows websites to request users' Ethereum accounts. If approved, it can read data from the blockchains the user is connected to, and suggest that the user sign messages and transactions 
export const connectWallet = async () => {

  if (window.ethereum){
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: "Update the contract with a message!",
        address: addressArray[0],
      };
      return obj; // the thing that gets returned if all goes well

    } catch (err) {
      return {
        address: "",
        status: "darn " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "👆🏽 Write a message in the text-field above.",
        };
      } else {
        return {
          address: "",
          status: "🦊 Connect to Metamask using the top right button.",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const updateMessage = async (address, message) => {

  //input error handling
  if (!window.ethereum || address === null) {
    return {
      status:
        "💡 Connect your Metamask wallet to update the message on the blockchain.",
    };
  }

  if (message.trim() === "") {
    return {
      status: "❌ Your message cannot be an empty string.",
    };
  }

  //set up transaction parameters
  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: address, // must match user's active address.
    data: helloWorldContract.methods.update(message).encodeABI(),
  };

  //sign the transaction
  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      status: (
        <span>
          ✅{" "}
          <a target="_blank" href={`https://goerli.etherscan.io/tx/${txHash}`}>
            View the status of your transaction on Etherscan!
          </a>
          <br />
          ℹ️ Once the transaction is verified by the network, the message will
          be updated automatically.
        </span>
      ),
    };
  } catch (error) {
    return {
      status: "😥 " + error.message,
    };
  }
};

async function main() {
  // const message = await helloWorldContract.message();
  // console.log("The message is: " + message);

  // const updatedMessage = await helloWorldContract.message() + " the updated part";
  // await helloWorldContract.update(updatedMessage);

  
  console.log("The updated message is: " + await helloWorldContractOne.message());
  console.log(contractAddress);
  console.log(alchemyWSSKey);
  console.log(privateKey);
  console.log(alchemyKey);

}
main();
