import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SongInfo } from "../components/SongInfo";
import { useInfoContext } from "../components/context/InfoContext";
import { ReviewContainer } from "../components/ReviewContainer";
import axios from "axios";

//this will be the song page that will display information about each song
//users will be sent to this page whenever they click on a song on the home page or the search results page
//https://www.figma.com/file/0BuMDTJLOjiYCjR997Lrif/muschart?node-id=34%3A230
export const SongPage = (props) => {
  const { id } = useParams();
  const [artistInfo, setArtistInfo] = useState(null);
  const infoContext = useInfoContext();
  const token = infoContext.token;
  const { songInfo, setSongInfo } = infoContext.songInfoProvider;

  // fetches song and artist info from spotify API
  useEffect(() => {
    const fetchSongInfo = () => {
      axios(`https://api.spotify.com/v1/tracks/${id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
        method: "GET",
      })
        .then((songRes) => {
          setSongInfo(songRes.data);
          // fetch artist info
          axios(
            `https://api.spotify.com/v1/artists/${songRes.data.artists[0].id}`,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
              method: "GET",
            }
          ).then((artistRes) => {
            setArtistInfo(artistRes.data);
          });
        })
        .catch((error) => {
          console.log(error.message);
        });
    };

    fetchSongInfo();
  }, [id, setSongInfo, token]);

  return (
    <div className="mt-12 text-center">
      <div>
        <SongInfo
          songName={songInfo ? songInfo.name : "N/A"}
          albumName={songInfo ? songInfo.album.name : "N/A"}
          releaseDate={songInfo ? songInfo.album.release_date : "N/A"}
          relevance={songInfo ? songInfo.popularity / 10 : "N/A"}
          albumCover={
            songInfo
              ? `${songInfo.album.images[1].url}`
              : "https://via.placeholder.com/150?text=No+Image"
          }
          artistName={
            songInfo
              ? songInfo.artists.map((artist) => <p>{artist.name}</p>)
              : ["N/A"]
          }
          artistImage={
            artistInfo
              ? artistInfo.images[2].url
              : "https://via.placeholder.com/150?text=No+Image"
          }
          genres={
            artistInfo && artistInfo.genres.length > 0
              ? artistInfo.genres.map(
                  (genre, i) =>
                    genre.charAt(0).toUpperCase() +
                    genre.slice(1) +
                    (i + 1 === artistInfo.genres.length ? "" : ", ")
                )
              : "N/A"
          }
          id={
            songInfo
              ? "https://open.spotify.com/embed/track/" + songInfo.id
              : ""
          }
        />
      </div>

      <ReviewContainer />
    </div>
  );
};
