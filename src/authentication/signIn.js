import React, { Component } from 'react';
import '../style/signIn.css';
import Faspinner from 'react-icons/lib/fa/spinner';
import lib from '../util/lib'

export default class signIn extends Component{
	constructor(props){
		super(props);
		this.getUser=this.getUser.bind(this);
	}

	getUser(){
  	var email=document.getElementById("SignInemail").value,password=document.getElementById("SignInPassword").value;
	  lib.signin(email,password)
	}

	render(){
		return(
			<div className="signInPopup">
				<div className="popupHolder">
					<div id="topPart">
						<p>Login</p>
						<a onClick={lib.toggleSignin}>X</a>
					</div>
					<div className="formField">
						<input placeholder="Email" id="SignInemail"/>
						<input placeholder="Password" type="password" id="SignInPassword"/>
						<a>Forgot Password?</a>
						{(!this.props.user.fetching)?<button className="btn-red" onClick={this.getUser}>Sign In</button>:null}
						{(this.props.user.fetching)?<button className="btn-red load" onClick={this.getUser}>Signing in<span className="loader"><Faspinner/></span></button>:null}
						{(this.props.user.fetching_lastCardDigits)?<button className="btn-red load" onClick={this.getUser}>Updating Your Info..<span className="loader"><Faspinner/></span></button>:null}
						<p>New User<a id="sign-btn" onClick={lib.toggleSignUp}>Sign Up</a></p>
					</div>
				</div>
			</div>
			)
	}
}