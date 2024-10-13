import { ViewSidebar } from '@mui/icons-material';
import React, { useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';
import Loader from './components/ui/Loader.jsx';
import { getBookmark, saveBookmark } from './utils/bookmark.js';
import { getFirstHeadingText } from './utils/getBookmarkData.js';

function openSidepanel(){
  chrome.runtime.sendMessage({action:"openSidePanel"})
}

const buttonStyles = {
  backgroundColor: 'transparent', // No background
  width: '24px', // Fixed width (adjust as needed)
  height: '24px', // Fixed height (adjust as needed)
  fontFamily: 'Arial, sans-serif', // Fixed font (you can specify your desired font)
  fontSize: '16px', // Fixed font size (adjust as needed)
  fontWeight: 'bold', // Adjust the font weight if needed
  color: '#fff', // Text color (you can change it to your desired color)
  border: 'none', // No border
  borderRadius: '5px', // Optional: Add some rounding if needed
  cursor: 'pointer', // Change the cursor on hover
  transition: 'all 0.3s ease-in-out', // Smooth transition for hover effects
  padding:0,
  margin:0
};

function saveUpdatedConfig(data){
  chrome.storage.local.set({ extConfig: JSON.stringify(data) }, function() {
    console.log('extention config saved');
  });
}


document.getElementsByTagName('body')[0].appendChild(document.createElement('div')).classList.add('content-component')
const Content = () => {
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAlreadySaved, setIsAlreadySaved] = useState(false);
  const [buttonPosition, setFloatingButtonPosition] = useState({ top: '50%' });
  const divRef = useRef(null);
  const dragStart = useRef(null);

  const style = {
    position: 'fixed',
    top: buttonPosition.top, // or '50vh' if you want it to be vertically centered in viewport
    right: '1rem', // Assuming the default spacing unit (4) is 0.25rem
    backgroundColor: '#243546', // Use CSS variable if defined
    color: 'white', // Use '#fff' or 'rgba(255, 255, 255, 1)' if you want
    fontWeight: 'bold',
    borderRadius: '20px', // Tailwind uses rem or pixels for rounding
    boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)', // Shadow from Tailwind's shadow-lg
    transition: 'all 300ms ease-in-out',
    padding: '1rem 0.5rem', // px-2: 0.5rem; py-4: 1rem
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem', // Tailwind gap-2: 0.5rem
    outline: 'none', // Default for focus state
    zIndex:10000000
  };

  const handleMouseDown = (e) => {
    dragStart.current = {
      y: e.clientY,
      top: divRef.current.offsetTop
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    document.getElementsByTagName("body")[0].style.userSelect = 'none';
  };

  const handleMouseMove = (e) => {
    const deltaY = e.clientY - dragStart.current.y;
    const newTop = dragStart.current.top + deltaY;

    setFloatingButtonPosition({ top: newTop + 'px' });
    console.log({ top: newTop + 'px' });
  };

  const handleMouseUp = (e) => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
    document.getElementsByTagName("body")[0].style.userSelect = 'auto';
    console.log('button pos',e.clientY);
    const position = {top:e.clientY+'px'}
    saveUpdatedConfig({floatingButtonPosition:position});
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
      if (request.action === "urlChanged") {
        getBookmark(setIsAlreadySaved);
        // alert('The URL has changed to: ' + request.message.url);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

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

  useEffect(()=>{
    chrome.storage.local.get(['extConfig'], function(result) {
      const {floatingButtonPosition} = JSON.parse(result.extConfig);
      console.log('saved pos',floatingButtonPosition);
      
      if (floatingButtonPosition) {
        setFloatingButtonPosition(floatingButtonPosition);
        console.log("current pos",floatingButtonPosition );
      }
    });
  },[])

  useEffect(() => {
    getBookmark(setIsAlreadySaved);
  }, []);

  return <>
    {isLoggedIn ? 
      <>
        <div
          ref={divRef}
          style={style}
          onMouseDown={handleMouseDown}
        >
          <button 
            disabled={isSaved || isAlreadySaved} 
            onClick={handleClick} 
            style={buttonStyles}
          >
              {isAlreadySaved ? "🎉" : 
              (isSaved ? "🎉" : 
                (isSaving ? <div><Loader width={"8px"}/></div>  : "🐿️"))}
                
          </button>
          <button onClick={openSidepanel} style={buttonStyles}>
            <ViewSidebar className='text-light-surface'/>
          </button>
        </div >
      </>
    : null }
    
  </>;
};

export default Content;


render(<Content/>,document.getElementsByClassName("content-component")[0]);