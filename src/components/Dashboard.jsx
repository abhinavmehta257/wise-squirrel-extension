import React, { useContext, useEffect, useState } from 'react'
import Logout from './ui/Logout.jsx'
import BookmarkCollapsible from './bookmarkCollapsible.jsx'
import BookmarkCard from './ui/BookmarkCard.jsx';
import UserHeaderMenu from './ui/UserHeaderMenu.jsx';
import { bookmarkContext,loaderContext, urlContext } from '../context/context.jsx';
import Loader from './ui/Loader.jsx';

function Dashboard() {
  const [bookmarks, setBookmarks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchesBookmarks, setSearchesBookmarks] = useState([]);
  const [isLoader,setIsLoader] = useState(false);
  // const {url} = useContext(urlContext);
  
  async function fetchBookmarks(){
    console.log("isLoader",isLoader);
    setIsLoader(true);
    await chrome.runtime.sendMessage({ action: 'fetchServices' }, (response) => {
      console.log("fetched")
      if (response.success) {
        setBookmarks(response.data);
        setIsLoader(false);
        console.log(response.data)
      } else {
        console.error('Failed to fetch services:', response.error);
        setIsLoader(false);
      }
    });
  }

  useEffect(() => {
    fetchBookmarks();
  }, []);
  
  const handleDeleteBookmark = async (deletedBookmarkId) => {
    try {
      setIsLoader(true);
      chrome.runtime.sendMessage({ action: 'deleteBookmark',deletedBookmarkId }, (response) => {
        console.log("fetched")
        if (response.success) {
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
        } else {
          console.error('Failed to fetch services:', response.error);
          throw new Error(`Failed to delete bookmark: ${response.statusText}`);
        }
      });

      
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
  const filter = debounce(async(e) => {
    const typedSearchTerm = e.target.value.trim();
    setSearchTerm(typedSearchTerm);
    if(typedSearchTerm !== ''){ 
      setIsLoader(true);
      setSearchTerm(typedSearchTerm);
      console.log("query db")
      await chrome.runtime.sendMessage({ action: 'queryServices',query: typedSearchTerm }, (response) => {
        console.log("fetched")
        if (response.success) {
          setSearchesBookmarks(response.data);
          setIsLoader(false);
          console.log(response.data)
        } else {
          console.error('Failed to fetch services:', response.error);
          setIsLoader(false);
        }
      });
    }
  }, 1000);

  return (
    <div className='h-full w-full flex flex-col items-center bg-dark-background'>
      <bookmarkContext.Provider value={{handleDeleteBookmark, fetchBookmarks}}>
      <div className='flex flex-row justify-between items-center w-full'>
        <h1 className="text-light-text text-[28px] font-bold font-['Inter'] leading-[35px]">Bookmarks</h1>
        <UserHeaderMenu />
      </div>
        <div className='flex flex-col gap-[16px] w-full  overflow-y-auto no-scrollbar h-[85vh]'>
        {
          isLoader ? (
            <div className='w-full h-full flex justify-center items-center'>
              <Loader width={"50px"} />
            </div>
          ) : (bookmarks && searchTerm.trim() === '' ? (
            bookmarks.map((bookmark, index) => (
              <BookmarkCollapsible key={index} bookmarkService={bookmark} />
            ))
          ) : (searchTerm.trim() !== '' ? (
            searchesBookmarks.map((bookmark, index) => (
              <div className='mt-4' key={index}>
                <BookmarkCard bookmark={bookmark} />
              </div>
            ))
          ) : null)) // Return null if no conditions match
        }

        
        </div>
      </bookmarkContext.Provider>
        <div className='mt-[auto] pt-[16px] flex justify-center items-end w-full '>
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