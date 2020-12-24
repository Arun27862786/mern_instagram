import React, { useState,useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import {UserContext} from '../../App';
import M from "materialize-css"; 

export const Login = () => {
  const {state,dispatch} = useContext(UserContext)
  const history = useHistory(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const PostData = () => {
    if (
      !/^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({ html: "Invalid Email", classes: "#b71c1c red darken-4" });
      return;
    }
    fetch("/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#b71c1c red darken-4" });
        } else {
          localStorage.setItem("jwt",data.token)
          localStorage.setItem("user",JSON.stringify(data.user))
          dispatch({type:"USER",payload:data.user})
          M.toast({ html: "User Successfully Signin", classes: "#00e676 green accent-3" });
          history.push("/");
        }
      })
      .catch(err=> {
        console.log(err);
      });
  };
  return (
    <div className="mycard">
      <div className="card auth-card">
        <h2 className="brand-logo">Instagram</h2>
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="btn waves-effect waves-light darken-1"
          onClick={() => PostData()}
        >
          Login
        </button>
        <h5>
          {" "}
          <Link to="/Signup">Don't have a accounts!</Link>
        </h5>
      </div>
    </div>
  );
};

export default Login;
