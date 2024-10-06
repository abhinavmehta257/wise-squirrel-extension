import React, { useState, useEffect, useRef, useContext } from 'react';
import Loader from './Loader.jsx';
import { BookmarkOutlined, MoreVert } from '@mui/icons-material';
import { bookmarkContext } from '../../context/context.jsx';

function BookmarkCard({bookmark}) {
  const { title, author, body, thumbnail, link } = bookmark;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cardRef = useRef(null); // To track clicks outside the component
  const [loader, setLoader] = useState(false)
  const {handleDeleteBookmark} = useContext(bookmarkContext);
  const clickHandler = () => {
    window.open(link, "_blank");
  };

  const toggleMenu = (e) => {
    e.stopPropagation(); // Prevent card click when menu is toggled
    setIsMenuOpen(!isMenuOpen);
  };

  // Close the menu when clicking outside or on scrolling
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    const handleScroll = () => {
      setIsMenuOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <div
        className="relative flex items-center cursor-pointer gap-4 rounded-xl w-full p-2 bg-white dark:bg-dark-surface transition-all duration-300 ease-in-out"
        onClick={clickHandler}
        ref={cardRef}
      >
        {/* Thumbnail */}
        {thumbnail !== 'nsfw' ? (
          <img className="w-[45px] aspect-square rounded-lg" src={thumbnail} alt="thumbnail" />
        ) : (
          <div className="w-[45px] aspect-square rounded-lg text-light-surface dark:bg-dark-surface p-2 flex justify-center items-center">
            <BookmarkOutlined />
          </div>
        )}

        {/* Bookmark Details */}
        <div className="flex flex-col w-[70%]">
          <h3 className="w-full text-ellipsis overflow-hidden whitespace-nowrap text-light-text font-medium font-['Inter'] text-[16px]">
            {title}
          </h3>
          <p className="text-subtle-text font-normal font-['Inter'] leading-[21px] w-[160px] text-[14px] text-ellipsis overflow-hidden">
            By: {author}
          </p>
          <p className="w-full text-ellipsis overflow-hidden whitespace-nowrap text-subtle-text font-normal font-['Inter'] leading-[21px]">
            {body}
          </p>
        </div>

        {/* 3 Dots (Context Menu Trigger) */}
        <div className="relative flex-shrink-0" onClick={toggleMenu}>
          <MoreVert className="cursor-pointer text-gray-500 hover:text-gray-700" />
          {/* Context Menu */}
          {isMenuOpen && (
            <ul
              className="absolute right-0 top-8 bg-white dark:bg-dark-surface shadow-md rounded-lg w-32 z-10"
              onClick={(e) => e.stopPropagation()} // Prevent card click on menu interaction
            >
              <li
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-red-500 rounded-lg"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click
                  handleDeleteBookmark(bookmark._id);
                  setIsMenuOpen(false); // Close menu after deleting
                }}
              >
                Delete
              </li>
            </ul>
          )}
        </div>
      </div>
      {
          loader ? <Loader/> : null
        }
    </>
  );
}

export default BookmarkCard;
