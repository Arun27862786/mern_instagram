import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

const CreatePost = () => {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  useEffect(() => {
    if (url) {
      fetch("/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          title,
          body,
          pic: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            M.toast({ html: data.error, classes: "#b71c1c red darken-4" });
          } else {
            M.toast({
              html: "Post Successfully Created",
              classes: "#00e676 green accent-3",
            });
            history.push("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [url]);
  const PostDetails = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "instagram-clone");
    data.append("cloud_name", "dgzawwadg");
    fetch("https://api.cloudinary.com/v1_1/dgzawwadg/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div
      className="card input-field"
      style={{
        margin: "10px auto",
        maxWidth: "500px",
        padding: "20px",
        textAlign: "center",
      }}
    >
     

      <div className="input-field col s6">
          <i className="material-icons prefix">input</i>
          <input id="icon_prefix" type="text"  value={title}
          onChange={(e) => setTitle(e.target.value)} class="validate" />
          <label for="icon_prefix">title</label>
      </div>

      <div className="input-field col s6">
          <i className="material-icons prefix">input</i>
          <input id="icon_prefix" type="text"  value={body}
          onChange={(e) => setBody(e.target.value)} class="validate" />
          <label for="icon_prefix">body</label>
      </div>

      <div className="file-field">
        <div className="btn">
          <span>Upload Image</span>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
          <button
            className="btn waves-effect waves-light"
            onClick={() => PostDetails()}
          >
            Submit Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
