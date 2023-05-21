import React, { useEffect } from "react";
import Player from "./Player";
import SongList from "./SongList";
import songs from "../data/songs.json";
import SongDetail from "./SongDetail";
import SongListHeader from "./SongListHeader";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";

const Home = () => {
  const navigate = useNavigate();
  let fromLS = localStorage.getItem("auth");
  const [auth, setAuth] = useAuth();

  useEffect(() => {
    if (!fromLS) {
      navigate("/login");
    }
    else{
      navigate('/')
    }
  }, [fromLS]);

  // for (let index = 0; index < songs.length; index++) {
  //   const song = songs[index];
  //   song.id = index;
  // }
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
