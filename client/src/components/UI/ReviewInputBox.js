import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useInfoContext } from "../context/InfoContext";

export const ReviewInputBox = ({ setReviewListChanged }) => {
  const [reviewContent, setReviewContent] = useState("");
  const [isError, setIsError] = useState(false);
  const { songInfo } = useInfoContext().songInfoProvider;
  const charLimit = 1000;
  const auth = useAuth();
  const [isLoggedIn, setisLoggedIn] = useState(auth.isAuthenticated);

  // change character count to red if character limit is passed or less than 3
  const changeToRed = () => {
    if (reviewContent.length > charLimit || reviewContent.length < 3) {
      return "text-red-500";
    }
  };

  useEffect(() => {
    setisLoggedIn(auth.isAuthenticated);
  }, [auth.isAuthenticated]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    let content = reviewContent;
    let UserId = auth.user ? auth.user.id : 0;
    let SongId = songInfo ? songInfo.id : 0;

    try {
      let response = await fetch("/api/reviews", {
        method: "POST",
        body: JSON.stringify({ content, UserId, SongId }),
        headers: { "Content-Type": "application/json" },
      });
      setIsError(!response.ok);
      setReviewListChanged((prev) => !prev);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    console.log(reviewContent);
  };

  return !isLoggedIn ? (
    <p>Login to leave a review!</p>
  ) : (
    <div>
      <form onSubmit={handleSubmit}>
        {" "}
        <label
          for="message"
          className="flex mb-2 ml-1 text-lg font-semibold text-gray-900 justify-left dark:text-white"
        >
          Leave a review
        </label>
        <textarea
          id="message"
          maxLength={charLimit}
          className="block h-64 resize-none p-2.5 w-full text-md text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition ease-in-out"
          placeholder="Your thoughts"
          onChange={(event) => setReviewContent(event.target.value)}
        ></textarea>
        <div className="inline-flex items-center justify-end w-full">
          <p
            className={`pt-2 mr-5 text-red-500 ${isError ? "block" : "hidden"}`}
          >
            {" "}
            There was an problem posting your review.
          </p>
          <p className={`pt-2 mr-5 ${changeToRed()}`}>
            {reviewContent.length} / {charLimit}
          </p>
          <button
            type="submit"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-2 transition ease-in-out"
          >
            Post Review
          </button>
        </div>
      </form>
    </div>
  );
};
