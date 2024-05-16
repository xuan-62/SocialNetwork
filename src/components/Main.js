import React, { Component } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import { Register } from "./Register";

class Main extends Component {
  getLogin = () => {
    return this.props.isLoggedIn ? (
      <Navigate to="/home" />
    ) : (
      <Login handleLoginSucceed={this.props.handleLoginSucceed} />
    );
  };

  getHome = () => {
    return this.props.isLoggedIn ? <Home /> : <Navigate to="/login" />;
  };

  render() {
    return (
      <div className="main">
        <Routes>
          <Route path="/" element={this.getHome()} />
          <Route path="/login" element={this.getLogin()} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={this.getHome()} />

          <Route element={this.getLogin} />
        </Routes>
      </div>
    );
  }
}

export default Main;
