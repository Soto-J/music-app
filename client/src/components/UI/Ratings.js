import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useInfoContext } from "../context/InfoContext";
import { star } from "./SVG";

export const Ratings = (props) => {
  const [userRating, setUserRating] = useState("N/A");
  const [averageRating, setAverageRating] = useState("N/A");
  const auth = useAuth();
  const songInfo = useInfoContext().songInfoProvider.songInfo;
  const [isLoggedIn, setisLoggedIn] = useState(auth.isAuthenticated);
  const UserId = auth.user ? auth.user.id : 0;
  const SongId = songInfo ? songInfo.id : 0;

  useEffect(() => {
    setisLoggedIn(auth.isAuthenticated);
  }, [auth.isAuthenticated]);

  useEffect(() => {
    // get user's rating for the song
    async function getRating() {
      const response = await fetch(`/api/ratings/song/${SongId}/${UserId}`);
      if (response.ok) {
        const data = await response.json();
        setUserRating(data.rating);
      }
    }

    // get average rating for the song
    async function getAverageRating() {
      const response = await fetch(`/api/ratings/song/${SongId}`);
      if (response.ok) {
        let sum = 0;
        const data = await response.json();
        for (let i = 0; i < data.length; i++) {
          sum += data[i].rating;
        }
        const average = sum / data.length;
        if (average > 0) {
          setAverageRating(average);
        } else {
          setAverageRating("N/A");
        }
      }
    }

    getRating();
    getAverageRating();
  }, []);

  // update user's rating for the song on increase or decrease
  async function updateRating(rating) {
    try {
      let response = await fetch(`/api/ratings/song/${SongId}/${UserId}`, {
        method: "PUT",
        body: JSON.stringify({ rating }),
        headers: { "Content-Type": "application/json" },
      });

      // if user's rating for the song doesn't exist, create a new rating
      if (response.status === 404) {
        response = await fetch(`/api/ratings`, {
          method: "POST",
          body: JSON.stringify({ rating, UserId, SongId }),
          headers: { "Content-Type": "application/json" },
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  // delete user's rating for the song when rating is set to N/A
  async function deleteRating() {
    try {
      await fetch(`/api/ratings/song/${SongId}/${UserId}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.log(error);
    }
  }

  const handleRatingIncrease = () => {
    if (userRating === "N/A") {
      setUserRating(0);
    } else if (userRating < 10) {
      setUserRating((prevRating) => prevRating + 0.5);
      updateRating(userRating + 0.5);
    }
  };

  const handleRatingDecrease = () => {
    if (userRating === 0) {
      setUserRating("N/A");
      deleteRating();
    } else if (userRating > 0) {
      setUserRating((prevRating) => prevRating - 0.5);
      updateRating(userRating - 0.5);
    }
  };

  return !isLoggedIn ? (
    <p>Login to leave a rating!</p>
  ) : (
    <div className="md:border-2 lg:border-0 xl:border-2 border-x-gray-500">
      <h2 className="font-semibold sm:text-2xl text-l mb-11">Your Score</h2>
      <div className="sm:text-xl text-l">
        <button
          className="sm:scale-100 sm:mx-2 scale-[0.75] mx-[0.2rem] bg-gray-100 hover:bg-gray-300 active:bg-gray-400 active:scale-[0.85] active:text-l outline outline-1 outline-gray-300 px-[0.6rem] rounded-lg"
          onClick={handleRatingDecrease}
        >
          -
        </button>
        {userRating === "N/A" ? userRating : userRating.toFixed(1)}
        <button
          className="sm:scale-100 sm:mx-2 scale-[0.75] mx-[0.2rem] bg-gray-100 hover:bg-gray-300 active:bg-gray-400 active:scale-[0.85] active:text-l outline outline-1 outline-gray-300 px-2 rounded-lg"
          onClick={handleRatingIncrease}
        >
          +
        </button>
        {star}
      </div>
    </div>
  );
};
