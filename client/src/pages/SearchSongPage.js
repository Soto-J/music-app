import React, { useState, useEffect } from "react";
import { SongInfo } from "../components/SongInfo";
import { SearchBar } from "../components/SearchBar";
import axios from "axios";

//this will be the song page that will display information about each song
//https://www.figma.com/file/0BuMDTJLOjiYCjR997Lrif/muschart?node-id=34%3A230
export const SongPage = (props) => {
    const [songInfo, setSongInfo] = useState(null);
    const [artistInfo, setArtistInfo] = useState(null);

    //get artist information by artist id
    useEffect(() => {
        if (songInfo) {
            axios(
                `https://api.spotify.com/v1/artists/${songInfo.artists[0].id}`,
                {
                    headers: {
                        Authorization: "Bearer " + props.token,
                    },
                    method: "GET",
                }
            ).then((response) => {
                setArtistInfo(response.data);
            });
        }
    }, [songInfo]);

    return (
        <div className="text-center mt-12">
            <SearchBar parent={"SearchSongPage"} setSongInfo={setSongInfo} />
            <div className="bg-gray-500 mx-auto my-6 rounded-xl max-w-[95%] w-30">
                <SongInfo
                    songName={songInfo ? songInfo.name : "N/A"}
                    albumName={songInfo ? songInfo.album.name : "N/A"}
                    releaseDate={songInfo ? songInfo.album.release_date : "N/A"}
                    albumCover={
                        songInfo ? `${songInfo.album.images[1].url}` : ""
                    }
                    artistName={
                        songInfo
                            ? songInfo.artists.map((artist) => (
                                  <p>{artist.name}</p>
                              ))
                            : "N/A"
                    }
                    artistImage={artistInfo ? artistInfo.images[2].url : ""}
                    genres={
                        artistInfo
                            ? artistInfo.genres.map((genre) => <p>{genre}</p>)
                            : "N/A"
                    }
                />
            </div>
        </div>
    );
};