import { useState, useEffect } from "react";
import { star } from "./SVG";

export const ReviewCard = ({ id, userID, songID, currUser, date, review }) => {
  const [username, setUsername] = useState("");
  const [userRating, setUserRating] = useState(0);

  // use red hover border if review is from current user
  const changeToRed = () => {
    if (currUser === userID) {
      return "bg-red-500";
    } else {
      return "bg-green-400";
    }
  };

  // get username from userID
  useEffect(() => {
    async function getUser() {
      try {
        const response = await fetch(`/api/auth/${userID}`, { method: "GET" });
        const data = await response.json();
        setUsername(data.firstName + " " + data.lastName);
      } catch (e) {}
    }

    getUser();
  }, [userID]);

  // find user rating
  useEffect(() => {
    async function getRating() {
      try {
        const response = await fetch(`/api/ratings/song/${songID}/${userID}`, {
          method: "GET",
        });
        const data = await response.json();
        setUserRating(data.rating);
      } catch (e) {}
    }

    getRating();
  }, [songID, userID]);

  return (
    <div className="relative group/card">
      <div className="relative z-10 grid grid-cols-4 p-6 my-8 md:my-16 transition ease-in-out bg-gray-200 border-b-[5px] border-r-[5px] rounded-xl max-h-72 group-hover/card:bg-slate-200 group-hover/card:-translate-y-1.5 group-hover/card:-translate-x-1.5 group-hover/card:max-h-full">
        {/*user info*/}
        <div className="flex flex-col max-h-full pr-6 font-semibold border-2 sm:justify-center border-r-gray-500 sm:text-2xl">
          <div className="flex justify-center">
            <img
              src={`https://picsum.photos/seed/${userID}/200`}
              width="120"
              height="120"
              className="rounded-full"
              alt="User profile picture"
            />
          </div>
          <h1 className="mt-5 overflow-hidden text-sm break-words sm:text-lg">
            {username + "	• " + userRating} {star}
          </h1>
          <h2 className="overflow-hidden text-sm font-medium break-words sm:text-md">
            {date}
          </h2>
          <div className="text-sm font-thin">Review ID: {id}</div>
        </div>

        {/*review content*/}
        <div className="relative col-span-3 group/text">
          {/*fade-out effect for overflowing text*/}
          <div className="absolute bottom-0 w-full h-1/6 bg-gradient-to-t from-gray-200 to-transparent group-hover/text:invisible">
            <br />
          </div>
          <p className="ml-6 overflow-hidden text-sm break-words max-h-60 group-hover/text:max-h-full sm:text-lg">
            {review}
          </p>
        </div>
      </div>
      <div
        className={`absolute bottom-[0.1%] left-[0.01%] w-[99.98%] h-[99.9%] rounded-xl ${changeToRed()}`}
      >
        <br />
      </div>
    </div>
  );
};
