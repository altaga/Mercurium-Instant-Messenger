// Basic imports
import '../assets/main.css';
import React, { Component } from 'react';
// Style and Html
import { Input, Row, Card, CardTitle, CardBody, CardFooter, Spinner, Col } from 'reactstrap';
// Utils
import autoBind from 'react-autobind';
import { withCookies } from 'react-cookie';
import { routerParams } from "../utils/params";
// Assets
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CachedIcon from '@mui/icons-material/Cached';
import LinkIcon from '@mui/icons-material/Link';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Logo from "../assets/cuadrado.png";
import githubLogo from '../assets/githubLogo.png';
import gitopiaLogo from '../assets/gitopia.png';
import MaticLogo from '../assets/matic-token.png';
// Crypto
import { WebBundlr } from "@bundlr-network/client";
import { abi } from '../contract/chatContract.js';
import Modals from '../components/modal';
// Video Import
import { Player, BigPlayButton } from 'video-react';
import 'video-react/dist/video-react.css'; // import css
// Audio Import
import ReactAudioPlayer from 'react-audio-player';

const ethers = require('moralis').web3Library
const providers = ethers.providers;

// Constants
const serverUrl = "https://turhlzycsgbd.usemoralis.com:2053/server";
const appId = "Tvc8JNiV0p4vVcIAdIL0bHmkhsVubFnQmY3b3mRJ";
const optionsNetwork = {
  chain: "polygon"
}
const contractAddress = "0xF4aBfb397D67BabcaF7C3cC2edCf0d041bE32c38";
const bundlrNode = "https://node1.bundlr.network";

const etherTable = {
  "wei": "1",
  "kwei": "1000",
  "mwei": "1000000",
  "gwei": "1000000000",
  "szabo": "1000000000000",
  "finney": "1000000000000000",
  "ether": "1000000000000000000",
  "kether": "1000000000000000000000",
  "grand": "1000000000000000000000",
  "mether": "1000000000000000000000000",
  "gether": "1000000000000000000000000000",
  "tether": "1000000000000000000000000000000"
}

// General functions

function readFile(e) {
  const file = e.target.files[0];
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      resolve(event.target.result);
    };

    reader.onerror = (err) => {
      reject(err);
    };

    reader.readAsArrayBuffer(file);
  });
}

async function connectWeb3(connector) {
  const p = new providers.Web3Provider(connector);
  await p._ready();
  return p
}

function getNamefromURL(url) {
  let file = url.split("/")
  file = file[file.length - 1].split(".")
  if (file[0].length > 10) {
    return file[0].substring(0, 10) + "..." + file[1];
  } else {
    return file[0] + "." + file[1];
  }
}

function detectFileType(url) {
  let file = url.split("/")
  file = file[file.length - 1]
  let fileType = file.split(".")[1]
  if (fileType === "pdf") {
    return "pdf"
  } else if (fileType === "txt") {
    return "txt"
  } else if (fileType === "mp4" || fileType === "avi" || fileType === "mov" || fileType === "mkv" || fileType === "wmv" || fileType === "mpg" || fileType === "mpeg" || fileType === "3gp" || fileType === "m4v" || fileType === "flv" || fileType === "f4v" || fileType === "m4p" || fileType === "m4v" || fileType === "m4a" || fileType === "m4b" || fileType === "m4r" || fileType === "m4s") {
    return "video"
  } else if (fileType === "mp3" || fileType === "wav" || fileType === "ogg" || fileType === "aac" || fileType === "wma" || fileType === "m4a" || fileType === "m4b" || fileType === "m4r" || fileType === "m4s") {
    return "audio"
  } else if (fileType === "png" || fileType === "jpg" || fileType === "jpeg" || fileType === "gif" || fileType === "bmp") {
    return "image"
  }
  else {
    return "other"
  }
}


function transform(value, unit) {
  if (value === undefined || value === null) {
    return "";
  }
  let result = value.toString();
  result = result / etherTable[unit];
  return result;
}

function mergeAndSort(a, b) {
  let result = [];
  let tempA = [];
  let tempB = [];
  a.forEach(function (item) {
    let req = 0
    let file = ""
    let delString1 = "";
    let delString2 = "";
    if (item.mess.indexOf(":req:") > -1) {
      delString1 = item.mess.substring(item.mess.indexOf(":req:"), item.mess.indexOf(":reqf:") + 6)
      req = parseFloat(delString1.replace(":req:", "").replace(":reqf:", ""))
    }
    if (item.mess.indexOf(":file:") > -1) {
      delString2 = item.mess.substring(item.mess.indexOf(":file:"), item.mess.indexOf(":filef:") + 7)
      file = delString2.replace(":file:", "").replace(":filef:", "")
    }
    let json = {
      blocktime: item.blocktime,
      money: transform(item.value, "ether"),
      type: "from",
      to: item.to,
      message: item.mess.replace(delString1, "").replace(delString2, ""),
      req: req,
      file: file
    };
    tempA.push(json);
  });
  b.forEach(function (item) {
    let req = 0
    let file = ""
    let delString1 = "";
    let delString2 = "";
    if (item.mess.indexOf(":req:") > -1) {
      delString1 = item.mess.substring(item.mess.indexOf(":req:"), item.mess.indexOf(":reqf:") + 6)
      req = parseFloat(delString1.replace(":req:", "").replace(":reqf:", ""))
    }
    if (item.mess.indexOf(":file:") > -1) {
      delString2 = item.mess.substring(item.mess.indexOf(":file:"), item.mess.indexOf(":filef:") + 7)
      file = delString2.replace(":file:", "").replace(":filef:", "")
    }
    let json = {
      blocktime: item.blocktime,
      money: transform(item.value, "ether"),
      type: "to",
      to: item.to,
      message: item.mess.replace(delString1, "").replace(delString2, ""),
      req: req,
      file: file
    };
    tempB.push(json);
  });
  result = result.concat(tempA);
  result = result.concat(tempB);
  result.sort((a, b) => {
    return a.blocktime - b.blocktime;
  });
  return result;
}

const currencyMap = {
  "matic": {
    providers: ["MetaMask"],
  },
}

const providerMap = {
  "MetaMask": async () => {
    if (!window?.ethereum?.isMetaMask) return;
    return await connectWeb3(window.ethereum);
  }
}

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: null,
      to: "",
      visible: true,
      fetchFlag: false,
      checked: false,
      startVisibility: false,
      message: "",
      number: 0,
      messageHistory: [],
      sending: false,
      noMessage: false,
      myData: [],
      updateFlag: true,
      activeAddress: this.props.match.params.address,
      changeFlag: false,
      addresses: [
        this.props.match.params.address
      ],
      activeIndex: 0,
      flagNoAddress: false,
      tokenList: [],
      tokenSelect: "",
      file: null,
      imageModal: true,
      price: 0,
      amount: 0,
      fileBuffer: null,
      bundlerBalance: 0,
      addFunds: 0,
    }
    autoBind(this);
    this.Moralis = require('moralis');
    this.provider = null;
    this.chatContract = null;
    this.connectInterval = null;
    this.fetchInterval = null;
    this.updateData = null;
    this.bundlr = null;
    this.updateBundlrBalance = null;
    this.RPCReload = null;
  }

  async setupBundlr() {
    let providerName = "MetaMask";
    let currencyName = "matic"
    const providerFunc = providerMap[providerName] // get provider entry
    const currency = currencyMap[currencyName] // get currency entry
    const provider = await providerFunc(currency); // 
    const bundlr = new WebBundlr(bundlrNode, "matic", provider);
    await bundlr.ready();
    return bundlr; // done!
  }

  async componentDidMount() {
    let startFlag = this.props.match.params.address ? true : false;
    if (startFlag) {
      if (this.props.match.params.address === "" || this.props.match.params.address.length !== 42) {
        startFlag = false;
      }
    }
    if (!startFlag) {
      this.setState({
        flagNoAddress: true
      })
      console.log("No address found. Please enter a valid address.")
    }
    else {
      const { cookies } = this.props;
      let temp = cookies.get('address') || this.state.addresses;
      let flag = false
      for (let i = 0; i < temp.length; i++) {
        if (temp[i] === this.props.match.params.address) {
          flag = true;
          break;
        }
      }
      if (flag) {
        cookies.set('address', temp, { path: '/' });
        this.setState({
          addresses: temp,
          activeAddress: this.props.match.params.address,
          activeIndex: temp.indexOf(this.props.match.params.address)
        })
      }
      else {
        temp.push(this.props.match.params.address)
        cookies.set('address', temp, { path: '/' });
        this.setState({
          addresses: temp,
          activeAddress: this.props.match.params.address,
          activeIndex: temp.indexOf(this.props.match.params.address)
        })
      }
      await this.Moralis.start({ serverUrl, appId });
      let user = this.Moralis.User.current();
      if (user ? false : true) {
        try {
          user = await this.Moralis.authenticate({ signingMessage: "Log in using Moralis" })
          console.log("Ok authentication");
        }
        catch (e) {
          console.log("Cancel authentication");
          window.open(`/`, "_self");
        }
      }
      if (user ? false : true) {
        console.log("User Rejected");
      }
      else {
        this.provider = await this.Moralis.enableWeb3();
        this.chatContract = new ethers.Contract(contractAddress, abi(), this.provider.getSigner());
        const value = await this.Moralis.Web3API.account.getNativeBalance(optionsNetwork)
        this.setState({
          account: {
            ethAddress: user.get("ethAddress"),
            balance: transform(value.balance, "ether"),
            tokens: await this.Moralis.Web3API.account.getTokenBalances(optionsNetwork),
          }, visible: false
        });
        let tempTokenList = ["Matic"];
        try {
          this.state.account.tokens.forEach(item => tempTokenList.push(item.name));
        }
        catch (e) {
          // No Tokens
        }
        this.setState({
          tokenList: tempTokenList
        })
        console.clear()
        this.fetchInterval = setInterval(() => {
          if (!this.state.fetchFlag && window.ethereum.isConnected()) {
            this.setState({
              fetchFlag: true,
            }, () => {
              console.log("Fetching messages from account")
              this.getMessagesFromAccount(this.state.account.ethAddress, this.state.activeAddress)
            })
          }
        }, 5000);
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.connectInterval);
    clearInterval(this.fetchInterval);
    clearInterval(this.updateData);
    clearInterval(this.updateBundlrBalance);
  }

  async getMessagesFromAccount(from, to) {
    const tempChangeFlag = this.state.changeFlag
    const result = await this.getAndProcessMessages(from, to);
    if (result.length > 0) {
      if (this.state.myData.length < result.length || this.state.changeFlag) {
        console.log("Get New Messages")
        if (tempChangeFlag !== this.state.changeFlag) {
          this.setState({
            messageHistory: [],
            noMessage: false,
            myData: [],
            fetchFlag: false
          })
        }
        else if (result.length > 0) {
          this.setState({
            messageHistory: result,
            changeFlag: false
          }, () => {
            var elmnt = document.getElementById("ChatWindow");
            elmnt.scrollTop = elmnt.scrollHeight;
            this.setState({
              sending: false,
              number: 0,
              req: false,
              message: "",
              noMessage: false,
              myData: result,
              fetchFlag: false
            }, console.log("OK"))
          })
        }
        else {
          this.setState({
            noMessage: true,
            myData: [],
            changeFlag: false,
            fetchFlag: false
          })
        }
      }
      else {
        this.setState({
          fetchFlag: false
        })
      }
    }
    else {
      this.setState({
        noMessage: true,
        myData: [],
        changeFlag: false,
        fetchFlag: false
      })
    }
  }

  // General Prupose send message

  async sendMessage(to, message, num) {
    let tempMessage = message;
    if (this.state.req) {
      tempMessage += ":req:" + num.toString() + ":reqf:"
    }
    if (this.state.file !== null) {
      let response = await this.bundlr.uploader.upload(this.state.fileBuffer, this.state.file)
      tempMessage += `:file:https://arweave.net/${response.data.id}/${this.state.file.name}:filef:`
    }
    this.setState({
      sending: true
    }, async () => {
      const options = { value: this.state.req ? "0" : ethers.utils.parseEther(num.toString()) }
      const transaction = await this.chatContract.addMessage(to, tempMessage, options)
      const result = await transaction.wait();
      console.log(result)
      this.setState({
        sending: false,
        req: false,
        message: "",
        file: null,
        fileBuffer: null,
        price: 0,
        amount: 0,
      })
    })
  }

  // General Prupose Get Messages

  async checkMessages(account, to) {
    let messages = [];
    try {
      const messagesCounter = await this.chatContract.chatCounter(account); // Check 
      for (let i = 0; i < messagesCounter; i++) {
        let result = await this.chatContract.chatHistory(account, i)
        if (result.to.toLowerCase() === to.toLowerCase()) {
          messages.push(result);
        }
      }
    }
    catch (e) {
      console.clear();
      console.log("RPC Catch Error")
      return "error"
    }
    return messages;
  }

  // Get All Messages from and to accounts

  async getAndProcessMessages(from, to) {
    let from_messages = await this.checkMessages(from, to);
    let to_messages = await this.checkMessages(to, from);
    if (from_messages === "error" || to_messages === "error") {
      return this.state.myData
    }
    let messages = mergeAndSort(from_messages, to_messages);
    return messages;
  }

  async updateBundlr() {
    const balance = await this.bundlr.getLoadedBalance()
    const converted = this.bundlr.utils.unitConverter(balance)
    console.log(parseFloat(converted))
    this.setState({
      bundlerBalance: parseFloat(converted),
    })
    this.updateBundlrBalance = setInterval(async () => {
      const balances = await this.bundlr.getLoadedBalance()
      const converteds = this.bundlr.utils.unitConverter(balances)
      this.setState({
        bundlerBalance: parseFloat(converteds),
      })
    }, 5000)
  }

  render() {
    return (
      <>
        {
          this.state.visible ?
            <>
              <div className='parent'>
                <div className='child'>
                  {
                    this.state.flagNoAddress ?
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}>
                        <div style={{ fontSize: "3rem", textAlign: "center", color: "black", width: "80vw" }}>
                          Type the Polygon Mainnet <br /> address to start chatting.
                        </div>
                        <p />
                        <Input
                          id="addressValueInit0128"
                          placeholder="Address"
                          style={{
                            width: '70%',
                            border: "solid 1px #8247e5",
                            background: "white",
                            color: "black",
                            fontSize: "1.5rem",
                            textAlign: "center",
                          }}
                        />
                        <p />
                        <button
                          style={{
                            fontSize: "2vw",
                            width: "70%",
                          }}
                          className='myButton' onClick={() => {
                            if (document.getElementById("addressValueInit0128").value.length === 42) {
                              window.open(`/${document.getElementById("addressValueInit0128").value}`, "_self")
                            }
                            else {
                              alert("Invalid Address")
                              document.getElementById("addressValueInit0128").value = ""
                            }
                          }} >
                          Start Chat
                        </button>
                        <p />
                        <p />
                        <Row>
                          <Col>
                            <Row style={{ textAlign: "center" }}>
                              <a href='https://github.com/EddOliver/Triton-Instant-Messenger-ETH' target='_blank' rel="noopener noreferrer">
                                <img src={githubLogo} alt="github" style={{ width: "100px", height: "100px" }} />
                              </a>
                              <div>
                                Github Repo
                              </div>
                            </Row>
                          </Col>
                          <Col>

                            <Row style={{ textAlign: "center" }}>
                              <a href='https://testnet.gitopia.com/gitopia1h5r4fg3jgy8hu3tn7hk5dyhes305u9874pfv66/MIM' target='_blank' rel="noopener noreferrer">
                                <img src={gitopiaLogo} alt="twitter" style={{ width: "100px", height: "100px" }} />
                              </a>
                              <p />
                              <div>
                                Gitopia Repo
                              </div>
                            </Row>
                          </Col>
                        </Row>
                      </div>
                      :
                      <Spinner style={{
                        width: "100px",
                        height: "100px",
                        color: "#8247e5",
                      }}>
                        Loading...
                      </Spinner>
                  }
                </div>
              </div>
            </>
            :
            <>
              <div className='parent'>
                <div className='child'>
                  <Card style={{ height: "94vh", width: "70vw", background: "white" }}>
                    <Row>
                      <Col style={{ width: "30%", height: "100%", color: "black" }}>
                        <CardBody>
                          <Row style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                            <div style={{ width: "16%" }}>
                              <a href="https://main.d3lic6l5z1fp8z.amplifyapp.com/" target="_blank" rel="noopener noreferrer">
                                <img src={Logo} alt="Logo" style={{ height: "100%", width: "100%", objectFit: "contain" }} />
                              </a>
                            </div>
                            <div style={{ width: "10%" }}>
                              <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                                |
                              </div>
                            </div>
                            <div style={{ width: "74%", paddingTop: "7px" }}>
                              Wallet: {this.state.account.ethAddress.substring(0, 6)}...{this.state.account.ethAddress.substring(this.state.account.ethAddress.length - 6, this.state.account.ethAddress.length)}
                            </div>
                          </Row>
                        </CardBody>
                        <div style={{
                          height: "1px",
                          width: "21.5vw",
                          background: "#8247e5",
                          marginTop: "2px",
                          marginBottom: "2px"
                        }} />
                        {
                          this.state.addresses.map((address, index) => {
                            return (
                              <div key={index + "okok"}>
                                <CardBody style={{ background: this.state.activeIndex !== index ? "" : "#ac91db", width: "21.5vw" }} onClick={() => {
                                  if (!this.state.changeFlag && this.state.activeIndex !== index) {
                                    this.setState({
                                      activeAddress: address,
                                      changeFlag: true,
                                      activeIndex: index,
                                      messageHistory: [],
                                      noMessage: false,
                                      myData: []
                                    })
                                  }
                                }}
                                >
                                  <Row>
                                    <Col>
                                      {
                                        address.substring(0, 10) + "..." + address.substring(address.length - 10, address.length)
                                      }
                                    </Col>
                                  </Row>
                                </CardBody>
                                <div style={{
                                  height: "1px",
                                  width: "21.5vw",
                                  background: "white",
                                }} />
                              </div>
                            )
                          })
                        }
                      </Col>
                      <Col xs="8" style={{
                        borderColor: "#7837e6",
                        width: "70%",
                        height: "94vh",
                      }}>
                        <CardTitle style={{ background: "#8247e5", height: "12%", padding: "10px" }}>
                          <Row>
                            <Col xs="12">
                              <div style={{ fontSize: "16px", color: "white", fontWeight: "bold" }}>
                                Chat with {this.state.activeAddress}
                                {
                                  /*
                                  <>
                                    {"  |  "}
                                    <button
                                      className="myButton2"
                                      onClick={
                                        async () => {
                                          clearInterval(this.fetchInterval);
                                          console.log("Fetching messages from account")
                                          await this.getMessagesFromAccount(this.state.account.ethAddress, this.state.activeAddress)
                                          this.fetchInterval = setInterval(() => {
                                            if (!this.state.fetchFlag && window.ethereum.isConnected()) {
                                              this.setState({
                                                fetchFlag: true,
                                              }, () => {
                                                console.log("Fetching messages from account")
                                                this.getMessagesFromAccount(this.state.account.ethAddress, this.state.activeAddress)
                                              })
                                            }
                                          }, 5000);
                                        }
                                      }>
                                      <CachedIcon />
                                    </button>
                                  </>
                                  */
                                }
                              </div>
                            </Col>
                            <div style={{
                              height: "1px",
                              marginTop: "5px",
                              marginBottom: "5px",
                              width: "100%",
                              background: "white"
                            }} />
                            <Col xs="12">
                              <div style={{ fontSize: "16px", color: "white", fontWeight: "bold" }}>
                                {
                                  "File Price: " + this.state.amount.toString() + " MATIC  | "
                                }
                                <button
                                  disabled={this.state.file === null ? true : false}
                                  className="myButton2"
                                  onClick={
                                    async () => {
                                      if (this.bundlr !== null) {
                                        let result = await this.bundlr.fund(parseInt(this.state.price * 1.1))
                                        console.log(result)
                                      }
                                    }
                                  }>
                                  Add these Funds
                                </button>
                              </div>
                            </Col>
                          </Row>
                        </CardTitle>
                        <CardBody style={{ background: "white" }}>
                          {
                            (this.state.messageHistory.length > 0 && !this.state.changeFlag) ?
                              <div id="ChatWindow" style={{ overflowY: "auto", maxHeight: this.state.checked ? "64vh" : "69vh" }}>
                                {
                                  this.state.messageHistory.map((message, index) => {
                                    let margin;
                                    try {
                                      margin = this.state.messageHistory[index - 1].type !== this.state.messageHistory[index].type ? "10px" : "0px"
                                    }
                                    catch {
                                      margin = "0px"
                                    }
                                    return (
                                      <div key={"elementd" + index}>
                                        {
                                          message.type === "to" ?
                                            <div>
                                              <Card style={{
                                                width: "70%",
                                                float: "left",
                                                marginTop: margin,
                                                background: "#ac91db",
                                                color: "black",
                                                borderColor: "white"
                                              }}>
                                                {
                                                  message.file.length > 0 ?
                                                    <CardBody>
                                                      <div style={{
                                                        fontSize: "16px",
                                                        color: "white"
                                                      }}>
                                                        {
                                                          detectFileType(message.file) === "image" &&
                                                          <>
                                                            <Modals
                                                              type="image"
                                                              message={message}
                                                              index={index}
                                                            />
                                                          </>
                                                        }
                                                        {
                                                          detectFileType(message.file) === "video" &&
                                                          <>
                                                            <Player src={message.file} >
                                                              <BigPlayButton position="center" />
                                                            </Player>
                                                          </>
                                                        }
                                                        {
                                                          detectFileType(message.file) === "audio" &&
                                                          <>
                                                            <ReactAudioPlayer
                                                              src={message.file}
                                                              controls
                                                              style={{
                                                                width: "100%"
                                                              }}
                                                            />
                                                          </>
                                                        }
                                                        {
                                                          detectFileType(message.file) === "pdf" &&
                                                          <>
                                                            <button
                                                              style={{ fontSize: "1.3rem", width: "40%" }}
                                                              className="myButton2"
                                                              onClick={() => {
                                                                window.open(message.file, "_blank")
                                                              }}>   Open PDF </button>
                                                            {" " + getNamefromURL(message.file).substring(0, 30)}
                                                          </>
                                                        }
                                                        {
                                                          detectFileType(message.file) === "txt" &&
                                                          <>
                                                            <button
                                                              style={{ fontSize: "1.3rem", width: "40%" }}
                                                              className="myButton2"
                                                              onClick={() => {
                                                                window.open(message.file, "_blank")
                                                              }}>   Open TXT </button>
                                                            {" " + getNamefromURL(message.file).substring(0, 30)}
                                                          </>
                                                        }
                                                        {
                                                          detectFileType(message.file) === "other" &&
                                                          <>
                                                            <button
                                                              style={{ fontSize: "1.3rem", width: "40%" }}
                                                              className="myButton2"
                                                              onClick={() => {
                                                                window.open(message.file, "_blank")
                                                              }}>   Open File </button>
                                                            {" " + getNamefromURL(message.file).substring(0, 30)}
                                                          </>
                                                        }
                                                      </div>
                                                    </CardBody>
                                                    : <div />
                                                }
                                                {
                                                  message.message.length > 0 ?
                                                    <CardBody>
                                                      <div style={{
                                                        fontSize: "16px",
                                                        color: "black"
                                                      }}>
                                                        {message.message}
                                                      </div>
                                                    </CardBody>
                                                    : <div />
                                                }
                                                <CardFooter
                                                  style={{
                                                    paddingTop: "34px"
                                                  }}
                                                >
                                                  {
                                                    message.money !== 0 &&
                                                    <div style={{
                                                      fontSize: "16px",
                                                      color: message.money >= 0 ? "green" : "red",
                                                      position: "absolute",
                                                      bottom: "5px",
                                                      left: "10px",
                                                    }}>
                                                      {message.money} MATIC {message.money >= 0 ? "Recieved" : "Sent"}
                                                    </div>
                                                  }
                                                  {
                                                    message.req > 0 &&
                                                    <div style={{
                                                      fontSize: "16px",
                                                      position: "absolute",
                                                      bottom: "5px",
                                                      left: "10px",
                                                      width: "100%",
                                                      color: "black"
                                                    }}>
                                                      {message.req} MATIC {"Requested"} &nbsp;&nbsp;&nbsp;
                                                      <button
                                                        className="myButton"
                                                        onClick={() => {
                                                          this.setState({
                                                            number: message.req
                                                          }, () => {
                                                            this.sendMessage(this.state.activeAddress, this.state.message, this.state.number)
                                                          })
                                                        }}
                                                        disabled={this.state.sending}
                                                      >
                                                        {
                                                          <SendIcon />
                                                        }
                                                      </button>
                                                    </div>
                                                  }
                                                  <div style={{
                                                    fontSize: "12px",
                                                    color: "black",
                                                    position: "absolute",
                                                    bottom: "5px",
                                                    right: "6px"
                                                  }}>
                                                    {
                                                      new Date(message.blocktime * 1000).toLocaleTimeString()
                                                    }
                                                    {
                                                      " "
                                                    }
                                                    <a href={`https://mumbai.polygonscan.com/address/${this.state.activeAddress}`} target="_blank" rel="noopener noreferrer">
                                                      <LinkIcon />
                                                    </a>
                                                  </div>
                                                </CardFooter>
                                              </Card>
                                            </div>
                                            :
                                            <div key={"elementdf" + index}>
                                              <Card style={{
                                                width: "70%",
                                                float: "right",
                                                marginTop: margin,
                                                marginRight: "24px",
                                                background: "#8247e5",
                                                color: "#8247e5",
                                              }}>
                                                {
                                                  message.file.length > 0 ?
                                                    <CardBody>
                                                      <div style={{
                                                        fontSize: "16px",
                                                        color: "white"
                                                      }}>
                                                        {
                                                          detectFileType(message.file) === "image" &&
                                                          <>
                                                            <Modals
                                                              type="image"
                                                              message={message}
                                                              index={index}
                                                            />
                                                          </>
                                                        }
                                                        {
                                                          detectFileType(message.file) === "video" &&
                                                          <>
                                                            <Player src={message.file} >
                                                              <BigPlayButton position="center" />
                                                            </Player>
                                                          </>
                                                        }
                                                        {
                                                          detectFileType(message.file) === "audio" &&
                                                          <>
                                                            <ReactAudioPlayer
                                                              src={message.file}
                                                              controls
                                                              style={{
                                                                width: "100%"
                                                              }}
                                                            />
                                                          </>
                                                        }
                                                        {
                                                          detectFileType(message.file) === "pdf" &&
                                                          <>
                                                            <button
                                                              style={{ fontSize: "1.3rem", width: "40%" }}
                                                              className="myButton2"
                                                              onClick={() => {
                                                                window.open(message.file, "_blank")
                                                              }}>   Open PDF </button>
                                                            {" " + getNamefromURL(message.file).substring(0, 30)}
                                                          </>
                                                        }
                                                        {
                                                          detectFileType(message.file) === "txt" &&
                                                          <>
                                                            <button
                                                              style={{ fontSize: "1.3rem", width: "40%" }}
                                                              className="myButton2"
                                                              onClick={() => {
                                                                window.open(message.file, "_blank")
                                                              }}>   Open TXT </button>
                                                            {" " + getNamefromURL(message.file).substring(0, 30)}
                                                          </>
                                                        }
                                                        {
                                                          detectFileType(message.file) === "other" &&
                                                          <>
                                                            <button
                                                              style={{ fontSize: "1.3rem", width: "40%" }}
                                                              className="myButton2"
                                                              onClick={() => {
                                                                window.open(message.file, "_blank")
                                                              }}>   Open File </button>
                                                            {" " + getNamefromURL(message.file).substring(0, 30)}
                                                          </>
                                                        }
                                                      </div>
                                                    </CardBody>
                                                    : <div />
                                                }
                                                {
                                                  message.message.length > 0 ?
                                                    <CardBody>
                                                      <div style={{
                                                        fontSize: "16px",
                                                        color: "white"
                                                      }}>
                                                        {message.message}
                                                      </div>
                                                    </CardBody>
                                                    : <div />
                                                }
                                                <CardFooter
                                                  style={{
                                                    paddingTop: "34px"
                                                  }}
                                                >
                                                  {
                                                    message.money !== 0 &&
                                                    <div style={{
                                                      fontSize: "16px",
                                                      color: message.money >= 0 ? "red" : "green",
                                                      position: "absolute",
                                                      bottom: "4px",
                                                      left: "10px",
                                                    }}>
                                                      {message.money} MATIC {message.money >= 0 ? "Sent" : "Received"}
                                                    </div>
                                                  }
                                                  {
                                                    message.req > 0 &&
                                                    <div style={{
                                                      fontSize: "16px",
                                                      color: "white",
                                                      position: "absolute",
                                                      bottom: "4px",
                                                      left: "10px",
                                                    }}>
                                                      {message.req} MATIC {"Requested"}
                                                    </div>
                                                  }
                                                  <div style={{
                                                    fontSize: "12px",
                                                    color: "white",
                                                    position: "absolute",
                                                    bottom: "4px",
                                                    right: "10px"
                                                  }}>
                                                    {
                                                      new Date(message.blocktime * 1000).toLocaleTimeString()
                                                    }
                                                    {
                                                      " "
                                                    }
                                                    <a href={`https://mumbai.polygonscan.com/address/${this.state.account.ethAddress}`} target="_blank" rel="noopener noreferrer">
                                                      <LinkIcon />
                                                    </a>
                                                  </div>
                                                </CardFooter>
                                              </Card>
                                            </div>
                                        }
                                      </div>
                                    )
                                  })
                                }
                              </div>
                              :
                              <>
                                <div className='parent'>
                                  <div className='child2'>
                                    {
                                      this.state.noMessage ?
                                        <div style={{
                                          width: "50vw",
                                          fontSize: "24px",
                                          color: "black",
                                          position: "absolute",
                                          top: "50%",
                                          left: "18vw",
                                          transform: "translate(-50%, -50%)"
                                        }}>
                                          No Messages yet...
                                        </div>
                                        :
                                        <Spinner style={{
                                          width: "100px",
                                          height: "100px",
                                          color: "#8247e5",
                                        }}>
                                          Loading...
                                        </Spinner>
                                    }
                                  </div>
                                </div>
                                <p></p>
                              </>
                          }
                          <p></p>
                        </CardBody>
                        <CardFooter style={{ background: "white", position: "absolute", bottom: "0px", width: "69%" }}>
                          <Row>
                            <div style={{
                              width: '8%'
                            }}>
                              <input
                                type="file"
                                id="upload"
                                hidden
                                onChange={async (e) => {
                                  if (this.bundlr === null) {
                                    this.bundlr = await this.setupBundlr();
                                  }
                                  const price = await this.bundlr.getPrice(e.target.files[0].size);
                                  const amount = this.bundlr.utils.unitConverter(price)
                                  let fileBuffer = await readFile(e)
                                  const file = {
                                    name: e.target.files[0].name,
                                    size: e.target.files[0].size,
                                    type: e.target.files[0].type,
                                  }
                                  console.log(e.target.files[0])
                                  this.setState({
                                    file: file,
                                    fileBuffer: fileBuffer,
                                    price: price,
                                    amount: parseFloat(amount),
                                  })
                                }}
                                disabled={this.state.sending}
                              />
                              <label htmlFor="upload">
                                {
                                  this.state.sending ? <Spinner /> :
                                    <>
                                      {
                                        this.state.file !== null ?
                                          <div
                                            style={{
                                              color: "green",
                                            }}>
                                            <AttachFileIcon />
                                          </div>
                                          :
                                          <>
                                            <AttachFileIcon />
                                          </>
                                      }
                                    </>
                                }
                              </label>
                            </div>
                            <Input
                              placeholder="Message"
                              style={{
                                width: '62%',
                                border: "solid 1px #8247e5",
                                background: "white",
                                color: "black",
                              }}
                              value={this.state.message}
                              onChange={(e) => {
                                this.setState({
                                  message: e.target.value
                                })
                              }}
                            />
                            <button
                              style={{
                                width: "15%"
                              }}
                              className="myButton"
                              onClick={() => this.sendMessage(this.state.activeAddress, this.state.message, 0)}
                              disabled={(!(this.state.message.length > 0) || this.state.sending)}
                            >
                              {
                                this.state.sending ? <Spinner /> : <SendIcon />
                              }
                            </button>
                            <button
                              id="moneyButton"
                              style={{
                                width: "15%"
                              }}
                              className="myButton"
                              onClick={() => {
                                this.setState({
                                  checked: !this.state.checked
                                }, () => {
                                  if (this.state.messageHistory > 0) {
                                    var elmnt = document.getElementById("ChatWindow");
                                    elmnt.scrollTop = elmnt.scrollHeight;
                                  }
                                })
                              }}
                            >
                              {
                                this.state.checked ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />
                              }
                            </button>
                          </Row>
                          {
                            this.state.checked &&
                            <>
                              <p></p>
                              <Row key="rows">
                                <Input
                                  type="number"
                                  placeholder="number"
                                  value={this.state.number}
                                  style={{
                                    width: '60%',
                                    background: "white",
                                    color: "black",
                                    border: "solid 1px #8247e5",
                                  }}
                                  onChange={(e) => {
                                    this.setState({
                                      number: e.target.value
                                    })
                                  }}
                                />
                                <button
                                  style={{
                                    width: "20%"
                                  }}
                                  className="myButton"
                                  onClick={() => {
                                    this.setState({
                                      req: true
                                    }, () => {
                                      this.sendMessage(this.state.activeAddress, this.state.message, this.state.number)
                                    })
                                  }
                                  }
                                  disabled={!(this.state.number > 0) || this.state.sending}
                                >
                                  Request MATIC
                                </button>
                                <button
                                  style={{
                                    width: "20%"
                                  }}
                                  className="myButton"
                                  onClick={() => {
                                    this.setState({
                                      req: false
                                    }, () => {
                                      this.sendMessage(this.state.activeAddress, this.state.message, this.state.number)
                                    })
                                  }}
                                  disabled={!(this.state.number > 0) || this.state.sending}
                                >
                                  Send MATIC
                                </button>
                              </Row>
                            </>
                          }
                        </CardFooter>
                      </Col>
                    </Row>
                  </Card>
                </div>
                <Card style={{ position: "absolute", right: "0px", top: "2.9vh", height: "94vh", width: "15vw" }}>
                  {
                    this.bundlr === null ?
                      <>
                        <CardTitle style={{
                          textAlign: "center",
                        }}>
                          <div style={{
                            paddingTop: "10px",
                            paddingBottom: "10px",
                          }}>
                            <button
                              style={{
                                fontSize: "1.5vw",
                                width: "70%",
                              }}
                              className='myButton'
                              onClick={async () => {
                                if (this.bundlr === null) {
                                  this.bundlr = await this.setupBundlr();
                                  this.updateBundlr();
                                }
                              }}
                            >
                              Connect Bundler
                            </button>
                          </div>
                          <div style={{
                            height: "1px",
                            marginTop: "5px",
                            marginBottom: "5px",
                            width: "100%",
                            background: "#8247e5",
                          }} />
                        </CardTitle>
                      </>
                      :
                      <>
                        <CardBody style={{
                          color: "black",
                          textAlign: "center",
                        }}>
                          {
                            this.state.bundlerBalance >= 0 &&
                            <>
                              <p>
                                <b>Bundler Balance:</b>
                              </p>
                              <p>
                                <b>
                                  <img src={MaticLogo} alt="Matic Logo" style={{
                                    width: "5vw",
                                    height: "5vw",
                                  }} />
                                </b>
                              </p>
                              <p style={{
                                fontSize: "2rem",
                              }}>
                                {this.state.bundlerBalance.toFixed(8)}
                              </p>
                            </>
                          }
                          <div style={{
                            height: "1px",
                            marginTop: "5px",
                            marginBottom: "5px",
                            width: "100%",
                            background: "#8247e5",
                          }} />
                          <Input
                            type="number"
                            onChange={(e) => {
                              this.setState({
                                addFunds: e.target.value
                              })
                            }}
                          >
                          </Input>
                          <button
                            style={{
                              fontSize: "1.5vw",
                              width: "70%",
                            }}
                            className='myButton'
                            disabled={this.state.addFunds > 0 && this.state.sending}
                            onClick={
                              async () => {
                                const result = await this.bundlr.fund(parseInt(this.state.addFunds * 1e18))
                                console.log(result)
                              }
                            }
                          >
                            Add Funds
                          </button>
                          <div style={{
                            height: "1px",
                            marginTop: "5px",
                            marginBottom: "5px",
                            width: "100%",
                            background: "#8247e5",
                          }} />
                          <div>
                            Transactions (files):
                            {
                              (this.state.messageHistory.length > 0 && !this.state.changeFlag) &&
                              this.state.messageHistory.map((message, index) => {
                                if (message.file !== undefined && message.file !== null && message.file !== "") {
                                  return (
                                    <div key={"Trans" + index}>
                                      <a href={message.file} target='_blank' rel="noopener noreferrer">
                                        {
                                          getNamefromURL(message.file)
                                        }
                                      </a>
                                    </div>
                                  )
                                }
                                else {
                                  return null
                                }
                              })
                            }
                          </div>
                        </CardBody>
                      </>
                  }
                </Card>
              </div>
            </>
        }
      </>
    );
  };
}

export default routerParams(withCookies(Main));