// Basic imports
import '../assets/main.css';
import React, { Component } from 'react';
import { Input, Row, Card, CardTitle, CardBody, CardFooter, Spinner, Col } from 'reactstrap';
import autoBind from 'react-autobind';
import * as solanaWeb3 from '@solana/web3.js';
import SendIcon from '@mui/icons-material/Send';
import LinkIcon from '@mui/icons-material/Link';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Serum from "../assets/serum.svg"
import { withCookies } from 'react-cookie';

const programId = "DVzMcYDk2Hs2BF5P5iHEDc3ZG7wpLHRG9WaQPCjfayug"; // Use any program Memo

function largeuint8ArrToString(uint8arr, callback) {
  var bb = new Blob([uint8arr]);
  var f = new FileReader();
  f.onload = function (e) {
    callback(e.target.result);
  };
  f.readAsText(bb);
}

function isASCII(str) {
  return /^[\x20-\x7E]*$/.test(str);
}

function sortJSONbyKey(json, key) {
  return json.sort(function (a, b) {
    var x = a[key]; var y = b[key];
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  })
}

class Main extends Component {
  constructor(props) {
    super(props);
    this.provider = null;
    this.state = {
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
    }
    autoBind(this);
    this.connectInterval = null;
    this.updateData = null;
  }

  async reconnect() {
    let result = await new Promise((resolve, reject) => {
      this.connectInterval = setInterval(async () => {
        if ("solana" in window) {
          const provider = window.solana;
          if (provider.isPhantom) {
            await window.solana.connect();
            this.provider = provider;
            this.setState({
              visible: false
            }, () => {
              clearInterval(this.connectInterval)
              resolve("Provider Connected")
            }
            )
          }
        } else {
          window.open("https://www.phantom.app/", "_blank");
        }
      }, 2000);
    })
    console.log(result)
  }

  async componentDidMount() {
    if (this.props.match.params.address === "" || this.props.match.params.address.length !== 44) {
      alert("No address found. Please enter a valid address.")
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
      await this.reconnect()
      this.connectInterval = setInterval(() => {
        if (!this.state.fetchFlag) {
          this.setState({
            fetchFlag: true
          }, () => {
            this.getMessagesFromAccount(this.provider.publicKey.toString(), this.state.activeAddress)
          })
        }
      }, 1000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.connectInterval);
    clearInterval(this.updateData);
  }

  async getMessagesFromAccount(from, to) {
    console.log("Fetching messages from account")
    const tempChangeFlag = this.state.changeFlag
    const connection = new solanaWeb3.Connection(
      solanaWeb3.clusterApiUrl('devnet'),
    );
    const saccount = new solanaWeb3.PublicKey(from)
    const result = await connection.getConfirmedSignaturesForAddress2(saccount)
    if (result.length > 0) {
      let temp = [];
      if (this.state.myData.length < result.length || this.state.changeFlag) {
        console.log("Get New Messages")
        await Promise.all(
          result.map(async (item) => {
            const message = await connection.getConfirmedTransaction(item.signature)
            const inSignature = item.signature
            let type = "to"
            if (message.transaction.feePayer.toString() === from) {
              type = "from"
              let check = false;
              try {
                check = message.transaction.instructions[1].keys[1].pubkey.toString() === to
              }
              catch {
                // nothing
              }
              if (check) {
                message.transaction.instructions.map(async (item) => {
                  largeuint8ArrToString(item.data, function (text) {
                    if (isASCII(text)) {
                      let money = 0;
                      let req = 0
                      let delString = "";
                      if (message.meta.preBalances[0] - message.meta.postBalances[0] > message.meta.fee) {
                        money = message.meta.preBalances[0] - message.meta.postBalances[0] - message.meta.fee
                      }
                      if (text.indexOf(":req:") > -1) {
                        delString = text.substring(text.indexOf(":req:"), text.length)
                        req = parseFloat(delString.replace(":req:", ""))
                      }
                      const messageJSON = {
                        type: type,
                        message: text.replace(delString, ""),
                        blocktime: parseInt(message.blockTime),
                        money: money / solanaWeb3.LAMPORTS_PER_SOL,
                        req: req,
                        signature: inSignature
                      }
                      temp.push(messageJSON)
                    }
                  })
                })
              }
            }
            else if (message.transaction.feePayer.toString() === to) {
              let check = false;
              try {
                check = message.transaction.instructions[1].keys[1].pubkey.toString() === from
              }
              catch {
                // nothing
              }
              if (check) {
                message.transaction.instructions.map(async (item) => {
                  largeuint8ArrToString(item.data, function (text) {
                    if (isASCII(text)) {
                      let money = 0;
                      let req = 0
                      let delString = "";
                      if (message.meta.postBalances[1] - message.meta.preBalances[1] > 0) {
                        money = message.meta.postBalances[1] - message.meta.preBalances[1]
                      }
                      if (text.indexOf(":req:") > -1) {
                        delString = text.substring(text.indexOf(":req:"), text.length)
                        req = parseFloat(delString.replace(":req:", ""))
                      }
                      const messageJSON = {
                        type: type,
                        message: text.replace(delString, ""),
                        blocktime: parseInt(message.blockTime),
                        money: money / solanaWeb3.LAMPORTS_PER_SOL,
                        req: req,
                        signature: inSignature
                      }
                      temp.push(messageJSON)
                    }
                  })
                })
              }
            }
          })
        )
        if(tempChangeFlag !== this.state.changeFlag){
          this.setState({
            messageHistory: [],
            noMessage: false,
            myData: [],
            fetchFlag: false
          })
        }
        else if (temp.length > 0) {
          this.setState({
            messageHistory: sortJSONbyKey(temp, "blocktime"),
            changeFlag: false
          }, () => {
            var elmnt = document.getElementById("ChatWindow");
            elmnt.scrollTop = elmnt.scrollHeight;
            console.log(sortJSONbyKey(temp, "blocktime"))
            this.setState({
              sending: false,
              number: 0,
              req: false,
              message: "",
              noMessage: false,
              myData: result,
              fetchFlag: false
            })
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
      else{
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

  async sendMessage() {
    this.setState({
      sending: true
    })
    if (this.provider.isConnected) {
      this.program(this.state.message, this.state.activeAddress, this.state.number)
    }
    else {
      await this.reconnect
      this.program(this.state.message, this.state.activeAddress, this.state.number)
    }
  }

  async program(message, to, num) {
    var connection = new solanaWeb3.Connection(
      solanaWeb3.clusterApiUrl('devnet'),
    );
    let tempMessage = message;
    if (this.state.req) {
      tempMessage += ":req:" + num.toString()
    }
    let memoPublicKey = new solanaWeb3.PublicKey(programId)
    const instruction = new solanaWeb3.TransactionInstruction({
      keys: [],
      programId: memoPublicKey,
      data: Buffer.from(tempMessage),
    });

    var transaction = new solanaWeb3.Transaction().add(
      instruction,
      solanaWeb3.SystemProgram.transfer({
        fromPubkey: this.provider.publicKey,
        toPubkey: new solanaWeb3.PublicKey(to),
        lamports: this.state.req ? 0 : Math.round(solanaWeb3.LAMPORTS_PER_SOL * num) //Investing 1 SOL. Remember 1 Lamport = 10^-9 SOL.
      })
    );

    // Setting the variables for the transaction
    transaction.feePayer = await this.provider.publicKey;
    let blockhashObj = await connection.getRecentBlockhash();
    transaction.recentBlockhash = await blockhashObj.blockhash;
    this.provider.signAndSendTransaction(transaction)
      .then(async (result) => {
        let { signature } = result
        await connection.confirmTransaction(signature);
        this.getMessagesFromAccount(this.provider.publicKey.toString(), this.state.activeAddress)
      })
      .catch(error => {
        console.log(error)
        this.setState({
          sending: false,
          req: false,
        })
      })
  }

  render() {
    return (
      <>
        {
          this.state.visible ?
            <>
              <div className='parent'>
                <div className='child'>
                  <Spinner>
                    Loading...
                  </Spinner>
                </div>
              </div>
            </>
            :
            <>
              <div className='parent'>
                <div className='child'>
                  <Card style={{ height: "94vh", width: "70vw", background: "#222435" }}>
                    <Row>
                      <Col style={{ width: "30%", height: "100%", color: "white" }}>
                        <CardBody>
                          <Row style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                            <div style={{ width: "16%" }}>
                              <a href="https://main.d3lic6l5z1fp8z.amplifyapp.com/" target="_blank" rel="noopener noreferrer">
                                <img src={Serum} alt="Serum" style={{ height: "100%", width: "100%", objectFit: "contain" }} />
                              </a>
                            </div>
                            <div style={{ width: "10%" }}>
                              <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                                |
                              </div>
                            </div>
                            <div style={{ width: "74%", paddingTop: "7px" }}>
                              Wallet: {this.provider.publicKey.toString().substring(0, 6)}...{this.provider.publicKey.toString().substring(this.provider.publicKey.toString().length - 6, this.provider.publicKey.toString().length)}
                            </div>
                          </Row>
                        </CardBody>
                        <div style={{
                          height: "1px",
                          width: "21.5vw",
                          background: "#2abdd2",
                          marginTop: "2px",
                          marginBottom: "2px"
                        }}></div>{
                          /*
                          <CardBody>
                          Search Bar
                        </CardBody>
                        <div style={{
                          height: "1px",
                          width: "21.5vw",
                          background: "#2abdd2",
                          marginTop: "8px"
                        }}></div>
                          */
                        }
                        {
                          this.state.addresses.map((address, index) => {
                            return (
                              <>
                                <CardBody style={{ background: this.state.activeIndex !== index ? "" : "#3f4363", width: "21.5vw" }} onClick={() => {
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
                                  {
                                    address.substring(0, 10) + "..." + address.substring(address.length - 10, address.length)
                                  }
                                </CardBody>
                                <div style={{
                                  height: "1px",
                                  width: "21.5vw",
                                  background: "#2abdd2",
                                }}></div>
                              </>
                            )
                          })
                        }
                      </Col>
                      <Col xs="8" style={{
                        borderColor: "#1a1e29",
                        width: "70%",
                        height: "94vh",
                      }}>
                        <CardTitle style={{ background: "#1a1e29", height: "7%", padding: "10px" }}>
                          <div style={{ fontSize: "16px", color: "white" }}>
                            Chat with {this.state.activeAddress}
                            <button
                              style={{ float: "right" }}
                              className="myButton"
                              id="airdropButton"
                              onClick={async () => {
                                window.document.getElementById("airdropButton").disabled = true;
                                var connection = new solanaWeb3.Connection(
                                  solanaWeb3.clusterApiUrl('devnet'),
                                );

                                const airdropSignature = await connection.requestAirdrop(this.provider.publicKey, solanaWeb3.LAMPORTS_PER_SOL);
                                await connection.confirmTransaction(airdropSignature);
                                window.document.getElementById("airdropButton").disabled = false;
                              }}
                            >
                              {
                                "Airdrop 1 SOL (Devnet)"
                              }
                            </button>
                          </div>
                        </CardTitle>
                        <CardBody style={{ background: "#222435" }}>
                          {
                            (this.state.messageHistory.length > 0 && !this.state.changeFlag) ?
                              <div id="ChatWindow" style={{ overflowY: "auto", maxHeight: this.state.checked ? "68vh" : "74vh" }}>
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
                                      <>
                                        {
                                          message.type === "to" ?
                                            <div key={"elementd" + index}>
                                              <Card style={{
                                                width: "70%",
                                                float: "left",
                                                marginTop: margin,
                                                background: "#1a1e29",
                                                color: "#2abdd2",
                                                borderColor: "white"
                                              }}>
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
                                                      color: message.money >= 0 ? "green" : "red",
                                                      position: "absolute",
                                                      bottom: "5px",
                                                      left: "10px",
                                                    }}>
                                                      {message.money} SOL {message.money >= 0 ? "Recieved" : "Sent"}
                                                    </div>
                                                  }
                                                  {
                                                    message.req > 0 &&
                                                    <div style={{
                                                      fontSize: "16px",
                                                      color: "white",
                                                      position: "absolute",
                                                      bottom: "5px",
                                                      left: "10px",
                                                      width: "100%"
                                                    }}>
                                                      {message.req} SOL {"Requested"} &nbsp;&nbsp;&nbsp;
                                                      <button
                                                        className="myButton"
                                                        onClick={() => {
                                                          this.setState({
                                                            number: message.req
                                                          }, this.sendMessage)
                                                        }}
                                                        disabled={ this.state.sending}
                                                      >
                                                        {
                                                          <SendIcon />
                                                        }
                                                      </button>
                                                    </div>
                                                  }
                                                  <div style={{
                                                    fontSize: "12px",
                                                    color: "white",
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
                                                    <a href={`https://explorer.solana.com/tx/${message.signature}?cluster=devnet`} target="_blank" rel="noopener noreferrer">
                                                      <LinkIcon />
                                                    </a>
                                                  </div>
                                                </CardFooter>
                                              </Card>
                                            </div>
                                            :
                                            <div key={"elementd" + index}>
                                              <Card style={{
                                                width: "70%",
                                                float: "right",
                                                marginTop: margin,
                                                marginRight: "24px",
                                                background: "#2abdd2",
                                                color: "#2abdd2",
                                              }}>
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
                                                      {message.money} SOL {message.money >= 0 ? "Sent" : "Received"}
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
                                                      {message.req} SOL {"Requested"}
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
                                                    <a href={`https://explorer.solana.com/tx/${message.signature}?cluster=devnet`} target="_blank" rel="noopener noreferrer">
                                                      <LinkIcon />
                                                    </a>
                                                  </div>
                                                </CardFooter>
                                              </Card>
                                            </div>
                                        }
                                      </>
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
                                          color: "white",
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
                                        }} color="info">
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
                        <CardFooter style={{ background: "#222435", position: "absolute", bottom: "0px", width: "69%" }}>
                          <Row>
                            <Input
                              placeholder="Message"
                              style={{
                                width: '70%',
                                background: "#1a1e29",
                                color: "white",
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
                              onClick={this.sendMessage}
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
                                    background: "#1a1e29",
                                    color: "white",
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
                                    },
                                      this.sendMessage)
                                  }}
                                  disabled={!(this.state.number > 0) || this.state.sending}
                                >
                                  Request SOL
                                </button>
                                <button
                                  style={{
                                    width: "20%"
                                  }}
                                  className="myButton"
                                  onClick={() => {
                                    this.setState({
                                      req: false
                                    },
                                      this.sendMessage)
                                  }}
                                  disabled={!(this.state.number > 0) || this.state.sending}
                                >
                                  Send SOL
                                </button>
                              </Row>
                            </>
                          }
                        </CardFooter>
                      </Col>
                    </Row>
                  </Card>
                </div>
              </div>
            </>
        }
      </>
    );
  };
}

export default withCookies(Main);