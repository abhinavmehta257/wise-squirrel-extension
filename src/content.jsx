import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import {saveBookmark, getBookmark} from './utils/bookmark.js';
import SiteSaveIcons from './components/ui/SiteSaveIcons.jsx';
import {getFirstHeadingText} from './utils/getBookmarkData.js';
import { ViewSidebar } from '@mui/icons-material';

function openSidepanel(){
  chrome.runtime.sendMessage({action:"openSidePanel"})
}

document.getElementsByTagName('body')[0].appendChild(document.createElement('div')).classList.add('content-component')
const Content = () => {
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAlreadySaved, setIsAlreadySaved] = useState(false);

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
        <div className='fixed top-1/2 right-4 bg-dark-surface hover:bg-dark-surface twhite font-bold rounded-[20px] shadow-lg transition-all duration-300 ease-in-out focus:outline px-2 py-4 text-white flex flex-col gap-2'>
          <button 
            disabled={isSaved || isAlreadySaved} 
            onClick={handleClick} 
          >
              {isAlreadySaved ? "🎉" : 
              (isSaved ? "🎉" : 
                (isSaving ? "" : "🐿️"))}
          </button>
          <button onClick={openSidepanel}>
            <ViewSidebar className='text-light-surface'/>
          </button>
        </div >
        <SiteSaveIcons/> 
      </>
    : null }
    
  </>;
};

export default Content;


render(<Content/>,document.getElementsByClassName("content-component")[0]);