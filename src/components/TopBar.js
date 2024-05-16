import React, { Component } from "react";
import { LogoutOutlined } from "@ant-design/icons";
import logo from "../assets/images/logo.svg";

class TopBar extends Component {
  render() {
    return (
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <span className="App-title">Around</span>
        {this.props.isLoggedIn ? (
          <a className="logout" onClick={this.props.handleLogout}>
            <LogoutOutlined /> Logout
          </a>
        ) : null}
      </header>
    );
  }
}

export default TopBar;
