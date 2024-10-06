import React, { useContext, useEffect, useState } from 'react'
import Logout from './ui/Logout.jsx'
import BookmarkCollapsible from './bookmarkCollapsible.jsx'
import BookmarkCard from './ui/BookmarkCard.jsx';
import UserHeaderMenu from './ui/UserHeaderMenu.jsx';
import { bookmarkContext,loaderContext, urlContext } from '../context/context.jsx';

function Dashboard() {
  const [bookmarks, setBookmarks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchesBookmarks, setSearchesBookmarks] = useState([]);
  const {setIsLoader} = useContext(loaderContext);
  const {url} = useContext(urlContext);
  
  useEffect(() => {
    console.log("fetching")
    setIsLoader(true);
    chrome.runtime.sendMessage({ action: 'fetchServices' }, (response) => {
      console.log("fetched")
      if (response.success) {
        setBookmarks(response.data);
        setIsLoader(false);
        console.log(response.data)
      } else {
        console.error('Failed to fetch services:', response.error);
      }
    });

  }, []);
  
  const handleDeleteBookmark = async (deletedBookmarkId) => {
    try {
      setIsLoader(true);
      const response = await fetch(`${url}/api/bookmarks/delete?bookmark_id=${deletedBookmarkId}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error(`Failed to delete bookmark: ${response.statusText}`);
      }
  
      const data = await response.json();
      const updatedBookmarks = bookmarks
        .map(service => {
          const filteredBookmarks = service.bookmarks.filter(bookmark => bookmark._id !== deletedBookmarkId);
          if (filteredBookmarks.length === 0) return null; // Return null for services with no bookmarks
          return {
            ...service,
            bookmarks: filteredBookmarks,
            count: filteredBookmarks.length,  // Update the count after deletion
          };
        })
        .filter(service => service !== null); // Filter out the null values
      
      setBookmarks(updatedBookmarks);
      setIsLoader(false);
      console.log('Bookmark deleted successfully:', data);
    } catch (error) {
      console.error('Error deleting bookmark:', error);
    }
    
  };

  // Debounce function to limit the frequency of invoking the filter function
  function debounce(func, delay) {
    let timeout;
    return function (...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    };
  }

  // Modified filter function with debounce
  const filter = debounce((e) => {
    const typedSearchTerm = e.target.value.trim();
    setSearchTerm(typedSearchTerm);
    console.log("test search");
    let bookmarksFound = [];
    bookmarks.forEach(services => {
      services.bookmarks.forEach(bookmark => {
        const {author, title, body, service_name} = bookmark;
        if (author.toLowerCase().includes(typedSearchTerm) || 
            title.toLowerCase().includes(typedSearchTerm) || 
            body.toLowerCase().includes(typedSearchTerm) || 
            service_name.toLowerCase().includes(typedSearchTerm)) {
          bookmarksFound.push(bookmark);
        }
      });
    });
    
    setSearchesBookmarks(bookmarksFound);
  }, 500);

  return (
    <div className='h-full w-full flex flex-col items-center bg-dark-background'>
      <div className='flex flex-row justify-between items-center w-full'>
        <h1 className="text-light-text text-[28px] font-bold font-['Inter'] leading-[35px]">Bookmarks</h1>
        <UserHeaderMenu />
      </div>
      <bookmarkContext.Provider value={{handleDeleteBookmark}}>
        <div className='flex flex-col gap-[16px] w-full  overflow-y-auto no-scrollbar h-[85vh]'>
        {
          bookmarks && searchTerm.trim() === '' ? (
            bookmarks.map((bookmark, index) => (
              <BookmarkCollapsible key={index} bookmarkService={bookmark} />
            ))
          ) : searchTerm.trim() !== '' ? (
            searchesBookmarks.map((bookmark, index) => (
              <div className='mt-4' key={index}><BookmarkCard bookmark={bookmark} /></div>
            ))
          ) : (
            <Card />
          )
        }
        </div>
      </bookmarkContext.Provider>
        <div className='mt-[auto] flex justify-center items-end w-full '>
          <input
          type="text"
          placeholder="Search bookmarks..."
          defaultValue={searchTerm}
          onChange={filter}
          className="p-[8px] focus:border-none border-dark-background rounded-[8px] w-full bg-dark-surface text-light-text text-[16px]"
        />
        </div>
    </div>
  )
}

export default Dashboard