import React, { useEffect, useState } from "react";
import Player from "./Player";
import SongList from "./SongList";
import SongDetail from "./SongDetail";
import SongListHeader from "./SongListHeader";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import { s3 } from "../../Aws"

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

  useEffect(() => {
    const fetchJsonFile = async () => {
      try {
        const params = {
          Bucket: "ashimusic",
          Key: "songs.json",
        };

        const response = await s3.getObject(params).promise();
        const fileContent = response.Body.toString();
        const jsonContent = JSON.parse(fileContent);

        setSongs(jsonContent);
      } catch (error) {
        console.error("Error fetching JSON file:", error);
      }
    };

    fetchJsonFile();
  }, []);

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
