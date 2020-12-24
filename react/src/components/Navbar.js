import React, { useContext, useRef, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import M from "materialize-css";

const Navbar = () => {
  const searchModel = useRef(null);
  const elems = useRef(null);
  const history = useHistory();
  const [search, setSearch] = useState("");
  const [userDetails, setUserDetails] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    M.Modal.init(searchModel.current);
    M.Sidenav.init(elems.current);
  }, []);
  const renderList = () => {
    if (state) {
      return [
        <li key="1">
          <i
            data-target="modal1"
            className="material-icons modal-trigger"
            style={{ margin: "2px 30px 0px 35px" }}
          >
            search
          </i>
        </li>,
        <li key="2">
          <Link to="/Profile">Profile</Link>
        </li>,
        <li key="3">
          <Link to="/Create">Create Post</Link>
        </li>,
        <li key="4">
          <Link to="/myfollowingpost">My following Post</Link>
        </li>,
        <li key="5">
          <button
            className="btn #e65100 orange darken-4"
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              history.push("Login");
            }}
            style={{ marginLeft: "30px", marginRight: "20px" }}
          >
            Logout <i className="material-icons right" style={{marginTop:"-13px"}}>forward</i>
          </button>
        </li>,
      ];
    } else {
      return [
        <li key="6">
          <Link to="/Login">Signin</Link>
        </li>,
        <li key="7">
          <Link to="/Signup">Signup</Link>
        </li>,
      ];
    }
  };

  const fetchUsers = (query) => {
    setSearch(query);
    fetch("/search-users", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => res.json())
      .then((results) => {
        setUserDetails(results.user);
      });
  };

  return (
    <>
      <div className="navbar-fixed">
        <nav>
          <div className="nav-wrapper">
            <Link to={state ? "/" : "/Login"} className="brand-logo">
              Instagram
            </Link>
            <Link to="#" data-target="mobile-demo" className="sidenav-trigger">
              <i className="material-icons">menu</i>
            </Link>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              {renderList()}
            </ul>
          </div>
        </nav>
      </div>
      <ul className="sidenav" id="mobile-demo" ref={elems}>
        {renderList()}
      </ul>

      <div id="modal1" className="modal" ref={searchModel}>
        <div className="modal-content">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => fetchUsers(e.target.value)}
          />
          <ul className="collection">
            {userDetails.map((item) => {
              return (
                <Link
                  to={
                    item._id !== state._id ? "/profile/" + item._id : "/profile"
                  }
                  onClick={() => {
                    M.Modal.getInstance(searchModel.current).close();
                    setSearch("");
                  }}
                >
                  <li className="collection-item" key={item._id}>
                    {item.email}
                  </li>
                </Link>
              );
            })}
          </ul>
        </div>
        <div className="modal-footer">
          <button className="modal-close waves-effect waves-green btn-flat">
            Agree
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
