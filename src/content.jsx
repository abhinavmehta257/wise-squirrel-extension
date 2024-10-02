import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import {saveBookmark, getBookmark} from './utils/bookmark.js';
import SiteSaveIcons from './components/ui/SiteSaveIcons.jsx';

document.getElementsByTagName('body')[0].appendChild(document.createElement('div')).classList.add('content-component')
const Content = () => {
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAlreadySaved, setIsAlreadySaved] = useState(false);
  const saveButtonStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    padding: '12px 20px',
    backgroundColor: '#243546', // dark-surface
    color: '#DEE7EA', // light-text
    cursor: isSaved||isAlreadySaved ? 'not-allowed' : 'pointer',
    zIndex: '1000',
    fontSize: '16px',
    borderRadius: '30px',
    border: 'none',
    outline: 'none',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    zIndex: '1000',

  };

  const getFirstHeadingText = () => {
    for (let i = 1; i <= 6; i++) {
      const heading = document.querySelector(`h${i}`);
      if (heading) {
        return heading.textContent.trim();
      }
    }
    return document.title; // Fallback to document.title if no heading found
  };

  const handleClick = async () => {
    if (!isSaved && !isSaving) {
      // Collect required data from the page
      const pageTitle = getFirstHeadingText();
      const pageAuthor = document.querySelector('meta[name="author"]')?.content || 'Unknown';
      const pageBody = document.querySelector('meta[name="description"]')?.content || '';
      const pageThumbnail = document.querySelector('meta[property="og:image"]')?.content || '';

      const saveData = {
        post_id: "Extension",
        user_id: null,  // This will be set on the server-side
        title: pageTitle,
        author: pageAuthor,
        body: pageBody,
        thumbnail: pageThumbnail,
        link: window.location.href,
        service_id: null,  // This will be set on the server-side
        service_name: new URL(window.location.href).hostname.split('.').slice(-2, -1)[0]
      };
      console.log(saveData);
      await saveBookmark(saveData,setIsSaving,setIsSaved);
    }
  };

  useEffect(() => {

    const messageListener = (request, sender, sendResponse) => {
      if (request.action === "getPageInfo") {
        const pageInfo = {
          title: getFirstHeadingText(),
          thumbnail: document.querySelector('meta[property="og:image"]')?.content || ''
        };
        sendResponse(pageInfo);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    // Clean up listener when component unmounts
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);


  useEffect(() => {
    // Check if the user is logged in
    chrome.storage.local.get(['authToken'], function(result) {
      if (result.authToken) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);

  useEffect(() => {
    getBookmark(setIsAlreadySaved);
  }, []);



  return <>
    {isLoggedIn ? 
      <>
        <button disabled={isSaved || isAlreadySaved} onClick={handleClick} style={saveButtonStyle}>
            {isAlreadySaved ? "Already saved! 🎉" : 
            (isSaved ? "Saved! 🎉" : 
              (isSaving ? "Saving... 😊" : "Save 🐿️"))}
        </button>

        <SiteSaveIcons/> 
      </>
    : null }
    
  </>;
};

export default Content;


render(<Content/>,document.getElementsByClassName("content-component")[0]);