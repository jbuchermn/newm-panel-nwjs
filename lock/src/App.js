import "./App.css";

import React, { Component } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";


const client = new W3CWebSocket("ws:127.0.0.1:8641");

const utilizeFocus = () => {
  const ref = React.createRef()
  const setFocus = () => {ref.current &&  ref.current.focus()}

  return {setFocus, ref}
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initial: true,
      checking: false,
      state: "choose_user",
      users: ["jonas", "root"],
      selectedUser: "jonas",
      user: null,
      credMessage: "",
      cred: "",
    };
    this.inputFocus = utilizeFocus();
  }
  componentWillMount() {
    client.onopen = () => {
      console.log("[WS] connected");
      client.send(JSON.stringify({ kind: "register" }));
      client.send(JSON.stringify({ kind: "auth_register" }));
    };

    client.onmessage = (message) => {
      let msg = JSON.parse(message.data);
      if(msg.kind === "auth_request_user"){
        this.setState({
          checking: false,
          state: "choose_user",
          users: msg.users,
          selectedUser: msg.users.length > 0 ? msg.users[0] : null
        })
      }else if (msg.kind === "auth_request_cred") {
        this.setState({
          checking: false,
          state: "enter_cred",
          user: msg.user,
          credMessage: msg.message,
        });

        /* Must be larger than animation duration */
        setTimeout(() => this.inputFocus.setFocus(), 1000);
      }
    };
  }

  componentDidMount(){
    document.addEventListener("keydown", (evt) => this.handleKey(evt), false);
  }
  componentWillUnmount(){
    document.removeEventListener("keydown", (evt) => this.handleKey(evt), false);
  }

  handleEnterCred(){
      client.send(JSON.stringify({
        kind: "auth_enter_cred",
        cred: this.state.cred
      }));
      this.setState({
        initial: false,
        checking: true,
        cred: ""
      });
  }

  handleChooseUser() {
    client.send(JSON.stringify({
      kind: "auth_choose_user",
      user: this.state.selectedUser
    }));
    this.setState({
      initial: false,
    });
  }

  handleKey(event) {
    if(event.code === "Enter"){
      if(this.state.state === "enter_cred"){
        this.handleEnterCred()
      }else if(this.state.state === "choose_user"){
        this.handleChooseUser()
      }

      event.preventDefault()
      event.stopPropagation()
    }else if(event.code === "Tab"){
      if(this.state.state === "choose_user"){
        if(this.state.users.length > 0){
          let idx = this.state.users.indexOf(this.state.selectedUser);
          this.setState({ selectedUser: this.state.users[(idx+1) % this.state.users.length] });
        }
      }

      event.preventDefault()
      event.stopPropagation()
    }
  }


  render() {
    return (
      <div className="App">
        <div className={"Inner "+(this.state.state==="choose_user"?"":"left")+" "+
            (this.state.initial?"initial":"")}>
          <div className="Title">Welcome!</div>
          <div className="Users">
            {this.state.users.map(u => (
              <div className={"User "+(this.state.selectedUser===u?"selected":"")}
                   onMouseEnter={() => this.setState({ selectedUser: u })}
                   onClick={() => this.handleChooseUser()}>
                <div className="Text">{u}</div>
              </div>
            ))}
          </div>

        </div>

        <div className={"Inner "+(this.state.state==="enter_cred"?"":"right")+
                " "+(this.state.initial?"initial":"")}>
          <div className="Title">{this.state.credMessage}</div>
          <input type="password" name="password" ref={this.inputFocus.ref} disabled={this.state.checking} className={"Textfield "+(this.state.checking?"checking":"")}
                 value={this.state.cred}
                 onChange={(evt) => this.setState({ cred: evt.target.value })} />
        </div>
      </div>
    );
  }
}
