import React, { useEffect, useState } from "react";
import Player from "./Player";
import SongList from "./SongList";
import SongDetail from "./SongDetail";
import SongListHeader from "./SongListHeader";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";

const Home = () => {
  const navigate = useNavigate();
  let fromLS = localStorage.getItem("auth");
  const [auth, setAuth] = useAuth();
  const [songs, setSongs] = useState([])

  useEffect(() => {
    if (!fromLS) {
      navigate("/login");
    }
    else{
      navigate('/')
    }
  }, [fromLS]);

  useEffect(()=> {
const data = fetch('https://ashi-music-songs.s3.amazonaws.com/songs.json')
.then(res => res.json())
.then(data => setSongs(data));
  },[])

  const genre = auth?.user?.genre;
  const mySongs = songs.filter((i) => i.genre === genre);

  return (
    <div className="root">
      <NavBar />
      <SongListHeader />
      <SongDetail />
      <SongList songs={mySongs} />
      <Player />
    </div>
  );
};

export default Home;
