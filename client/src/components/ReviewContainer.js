import React, { useState, useEffect } from "react";
import { ReviewCard } from "./UI/ReviewCard";
import { ReviewInputBox } from "./UI/ReviewInputBox";
import { Paging } from "./layout/Paging";
import { useAuth } from "./context/AuthContext";
import { useInfoContext } from "./context/InfoContext";

export const ReviewContainer = (props) => {
  const [reviewsPerPage] = useState(10);
  const [reviewCards, setReviewCards] = useState([]);
  const [reviewListChanged, setReviewListChanged] = useState(false);
  const currUser = useAuth().user.id;
  const currSong = useInfoContext().songInfoProvider.songInfo;

  // displaying reviews
  useEffect(() => {
    const currSongID = currSong ? currSong.id : 0;

    async function getReviews() {
      try {
        const response = await fetch(`/api/reviews/song/${currSongID}`);
        const reviewData = await response.json();
        let tempReviewCards = [];

        //create review cards
        for (let i = 0; i < reviewData.length; i++) {
          tempReviewCards.push(
            <ReviewCard
              key={reviewData[i].id}
              id={reviewData[i].id}
              userID={reviewData[i].UserId}
              songID={reviewData[i].SongId}
              currUser={currUser}
              date={reviewData[i].createdAt.slice(0, 10)}
              review={reviewData[i].content}
            />
          );
        }

        //sort to display current user's reviews first
        tempReviewCards.sort((a, b) => {
          if (a.props.userID === currUser) {
            return -1;
          } else if (b.props.userID === currUser) {
            return 1;
          } else {
            return 0;
          }
        });

        setReviewCards(tempReviewCards);
      } catch (error) {
        console.error(error);
      }
    }

    getReviews();

    return () => {
      // clean up function
    };
  }, [reviewListChanged, currSong, currUser]);

  return (
    <div className="bg-gray-100 mx-auto my-6 rounded-xl max-w-[95%] w-30 p-6 sm:p-16 font-inter">
      <h1 className="w-full mb-16 text-3xl font-semibold text-left sm:text-4xl">
        Reviews
      </h1>
      <ReviewInputBox setReviewListChanged={setReviewListChanged} />
      {reviewCards.length === 0 ? (
        <p className="text-2xl">No reviews yet</p>
      ) : null}
      <Paging objectArray={reviewCards} itemsPerPage={reviewsPerPage} />
    </div>
  );
};
