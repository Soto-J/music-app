import React from "react";
import { useNavigate } from "react-router-dom";
import { star } from "./SVG";

export const SongCard = ({
  albumCover,
  albumName,
  songName,
  songObject,
  artistName,
  setSongInfo,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    setSongInfo(songObject);
    console.log(songObject);
    navigate(`/song-details/${songObject.id}`);
  };

  return (
    <div className="relative cursor-pointer" onClick={handleClick}>
      <div className="relative z-10 w-full h-full overflow-hidden transition ease-in-out rounded-xl bg-slate-100 hover:bg-slate-200 hover:-translate-y-2 hover:-translate-x-2">
        <img src={albumCover} alt={`Album cover of ${albumName}`} />
        <div className="mx-3 my-2">
          <h2 className="text-lg font-bold">
            {songName} • <span className="font-medium">9.99</span>
            {star}
          </h2>
          <p>by {artistName}</p>
          <p className="text-sm">{albumName}</p>
        </div>
      </div>
      <div className="absolute bottom-[0.2%] left-[0.01%] w-[99.98%] h-[99.9%] bg-green-400 rounded-xl">
        <br />
      </div>
    </div>
  );
};
