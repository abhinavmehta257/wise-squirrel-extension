export async function saveBookmark(saveData,setIsSaving,setIsSaved){
  setIsSaving(true);
    await chrome.runtime.sendMessage({ action: 'saveUrl', ...saveData }, (response) => {
        if (response && response.success) {
          setIsSaved(true);
        } else {
          // Handle error case
          console.error('Failed to save URL');
        }
    });
    setIsSaving(false);
}

export async function getBookmark(setIsAlreadySaved){
  chrome.runtime.sendMessage({action: "fetchUrl", url: window.location.href}, async (response) => {
    console.log("Response:", response);
    if (chrome.runtime.lastError) {
      console.error("Error sending message:", chrome.runtime.lastError);
      setIsAlreadySaved(false);
    } else if (response && response.success) {
      console.log("URL fetched successfully:", response);
      setIsAlreadySaved(true);
    } else {
      console.log("Error fetching URL or invalid response:", response);
      setIsAlreadySaved(false);
    }
  });
}
