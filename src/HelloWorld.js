import React from "react";
import { useEffect, useState } from "react";
import {
  helloWorldContract,
  helloWorldContractOne,
  connectWallet,
  updateMessage,
  loadCurrentMessage,
  getCurrentWalletConnected,
} from "./util/interact.js";

// import alchemylogo from "./alchemylogo.svg";

const HelloWorld = () => {
  //state variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("No connection to the network."); //default message
  const [newMessage, setNewMessage] = useState("");

  //called only once  due to empty array param
  useEffect(async () => {
      async function fetchMessage() {
        const message = await loadCurrentMessage();
        setMessage(message);
      }
      fetchMessage();
      addSmartContractListener();

      //on initial render looks for connected wallet, calls the MetaMask function from interact

      async function fetchWallet() {
        const {address, status} = await getCurrentWalletConnected();
        setWallet(address);
        setStatus(status); 
      }
      fetchWallet();
      //active listener for wallet changes. listener is window.ethereum.on("accounts changed")
      addWalletListener(); 
    
  }, []);

  function addSmartContractListener() { //TODO: implement
    // helloWorldContract.events.UpdatedMessages({}, (error, data) => {
    //   if (error) {
    //     setStatus("darn: "+ error.message);
    //   } else {
    //     setMessage(data.returnValues[1]);
    //     setNewMessage("");
    //     setStatus("Message updated! ");
    //   }
    // });

   // lets find an ethers way to do it with helloWorldContractOne.

   helloWorldContractOne.on("UpdatedMessages", (oldStr, newStr, event) => {
    let info = {
      oldStr: oldStr,
      newStr: newStr,
      data: event,
    };
    console.log(JSON.stringify(info, null, 4));
    //need to do error handling here
    setMessage(newStr);
    setNewMessage("");
    setStatus("Message updated! ");

  });
    
  }

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }


  const connectWalletPressed = async () => { //TODO: implement

    const walletResponse = await connectWallet(); // the method in the controller (interact) that looks for MM window.ethereum
    setStatus(walletResponse.status);
    setWallet(walletResponse.address)
    
  };

  const onUpdatePressed = async () => { //TODO: implement
    const { status } = await updateMessage(walletAddress, newMessage);
    setStatus(status);
    
  };

  //the UI of our component
  return (
    <div id="container">
      {/* <img id="logo" src={alchemylogo}></img> */}
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <h2 style={{ paddingTop: "50px" }}>Current Message:</h2>
      <p>{message}</p>

      <h2 style={{ paddingTop: "18px" }}>New Message:</h2>

      <div>
        <input
          type="text"
          placeholder="Update the message in your smart contract."
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
        />
        <p id="status">{status}</p>

        <button id="publish" onClick={onUpdatePressed}>
          Update
        </button>
      </div>
    </div>
  );
};

export default HelloWorld;