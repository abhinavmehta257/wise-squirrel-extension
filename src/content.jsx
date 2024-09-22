import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';

document.getElementsByTagName('body')[0].appendChild(document.createElement('div')).classList.add('content-component')
const Content = () => {
  const body = document.getElementsByTagName('body')[0];
  body.style.marginTop= '32px';

  const saveButtonStyle = {
    position: 'fixed',
    top: '0px',
    right: '0px',
    padding: '8px 16px',
    backgroundColor: '#243546', // dark-surface
    color: '#DEE7EA', // light-text
    cursor: 'pointer',
    zIndex: '1000',
    fontSize: '16px',
    width: '100%',
    textAlign: 'center',
    border: 'none',      // Remove any default border
    outline: 'none',     // Remove default focus outline
    boxShadow: 'none',   // Remove default shadow
    appearance: 'none',
    cursor: isSaved ? 'none' : 'pointer' 
  };

  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const getFirstHeadingText = () => {
    for (let i = 1; i <= 6; i++) {
      const heading = document.querySelector(`h${i}`);
      if (heading) {
        return heading.textContent.trim();
      }
    }
    return document.title; // Fallback to document.title if no heading found
  };

  const handleClick = () => {
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

      setIsSaving(true);

      chrome.runtime.sendMessage({ action: 'saveUrl', url: window.location.href, ...saveData }, (response) => {
        if (response && response.success) {
          setIsSaved(true);
        } else {
          // Handle error case
          console.error('Failed to save URL');
        }
        setIsSaving(false);
      });
    }
  };


  useEffect(() => {
    // Function to get the first heading text
    

    // Set up listener for requests from background script
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

  return <>
    <button disabled={isSaved} onClick={handleClick} style={saveButtonStyle}>
        {!isSaved ? (!isSaving ? "Save this url with Wise Squirrel 😁" : "Please waite while we save it for you... 😊") : "Saved successfully (you can find it in your app) 🎉🎉"}
    </button>  
  </>;
};

export default Content;


render(<Content/>,document.getElementsByClassName("content-component")[0]);