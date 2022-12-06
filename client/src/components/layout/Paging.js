import { useState } from "react";
import { navArrows } from "../UI/SVG";

export const Paging = ({
  objectArray, // Array of objects to paginated
  itemsPerPage, // Number of items to display per page
  className, // String of Tailwindcss styling to apply to the page
  pageNumStyling, // String of Tailwindcss styling to apply to the page numbers
  offsetHandler, // Function to run reaching the end of the objectArray
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Separates the array of items into pages
  const displayItems = () => {
    return objectArray.slice(
      (currentPage - 1) * itemsPerPage,
      (currentPage - 1) * itemsPerPage + itemsPerPage
    );
  };

  const displayWithOffset = () => {
    return objectArray;
  };

  /*
  // Displays and changes the page number
  const displayPageNumbers = () => {
    return objectArray
      .slice(0, Math.ceil(objectArray.length / itemsPerPage))
      .map((item, i) => (
        <button
          onClick={() => {
            setCurrentPage(i + 1);
          }}
        >
          <span
            id={i + 1}
            className={`mx-2 ${i + 1 === currentPage ? "font-bold" : ""}`}
          >
            {i + 1}
          </span>
        </button>
      ));
  };*/

  //Displays 5 nav arrows to change the current page
  const displayNavArrows = () => {
    return (
      <div className="relative flex justify-around w-full">
        <div>
          <button
            onClick={() => {
              if (offsetHandler) offsetHandler(0);
              setCurrentPage(1);
            }}
          >
            <span className="absolute -translate-y-2">hi</span>
            <span className="relative mx-4">{navArrows.right_w_bar}</span>
          </button>
          <button
            onClick={() => {
              if (currentPage - 5 > 1) {
                if (offsetHandler)
                  offsetHandler((currentPage - 6) * itemsPerPage);
                setCurrentPage(currentPage - 5);
              } else {
                if (offsetHandler) offsetHandler(0);
                setCurrentPage(1);
              }
            }}
          >
            <span className="mx-4"> {navArrows.doubleLeft} </span>
          </button>
          <button
            onClick={() => {
              if (currentPage !== 1) {
                if (offsetHandler)
                  offsetHandler((currentPage - 2) * itemsPerPage);
                setCurrentPage(currentPage - 1);
              }
            }}
          >
            <span className="mx-4">{navArrows.left}</span>
          </button>
        </div>
        <span className="inline-flex items-center">{currentPage}</span>
        <div>
          <button
            onClick={() => {
              if (
                currentPage !== Math.ceil(objectArray.length / itemsPerPage) ||
                offsetHandler
              ) {
                if (offsetHandler) offsetHandler(currentPage * itemsPerPage);
                setCurrentPage(currentPage + 1);
              }
            }}
          >
            <span className="mx-4">{navArrows.right}</span>
          </button>
          <button
            onClick={() => {
              if (
                offsetHandler ||
                currentPage + 5 < Math.ceil(objectArray.length / itemsPerPage)
              ) {
                if (offsetHandler)
                  offsetHandler(currentPage + 5 * itemsPerPage);
                setCurrentPage(currentPage + 5);
              }
            }}
          >
            <span className="mx-4">{navArrows.doubleRight}</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className={className}>
        {offsetHandler ? displayWithOffset() : displayItems()}
      </div>
      <div
        className={
          pageNumStyling
            ? pageNumStyling
            : `inline-flex justify-center w-full overflow-scroll my-10`
        }
      >
        {displayNavArrows()}
      </div>
    </div>
  );
};
