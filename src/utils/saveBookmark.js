export default async function saveBookmark(saveData,setIsSaving,setIsSaved){
    await chrome.runtime.sendMessage({ action: 'saveUrl', ...saveData }, (response) => {
        if (response && response.success) {
          setIsSaved(true);
        } else {
          // Handle error case
          console.error('Failed to save URL');
        }
    });
}