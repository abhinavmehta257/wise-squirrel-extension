// Export the function as a named export
export function addMediumBookmarkIcon() {
  // Function to create and add the bookmark icon
  let current_list_count = 0;

  function createBookmarkIcon(element) {
    const action_div = element.querySelector('.n.o');
    const iconContainer = document.createElement('div');
    iconContainer.className = 'wise-squirrel-bookmark-icon';
    iconContainer.innerHTML = '🔖';
    iconContainer.style.zIndex = '1000';
    iconContainer.style.cursor = 'pointer'; // You can replace this with your preferred icon or SVG
    
    // Add click listener to the icon
    iconContainer.addEventListener('click', function(event) {
      event.preventDefault();
      event.stopPropagation();
      
      // Extract post information
      const postLink = element.getAttribute('data-href');
      const headingElement = element.querySelector('h2');
      const heading = headingElement ? headingElement.textContent : '';
      const descriptionElement = element.querySelector('h3');
      const description = descriptionElement ? descriptionElement.textContent : '';
      const imageElement = element.querySelector('img');
      const imageUrl = imageElement ? imageElement.src : '';

      // Create bookmark object
      const bookmark = {
        url: postLink,
        heading: heading,
        description: description,
        image: imageUrl
      };

      // Save bookmark (you'll need to implement this function)
      saveBookmark(bookmark);

      // Provide visual feedback
      iconContainer.textContent = '✅';
      setTimeout(() => {
        iconContainer.textContent = '🔖';
      }, 2000);
    });

    action_div.appendChild(iconContainer);
  }

  // Function to add icons to all matching elements
  function addIconsToElements() {
    const elements = document.querySelectorAll('div[role="link"]');
    console.log(elements);

    if (current_list_count === elements.length) {
      return;
    }else{
      for(let i = current_list_count; i < elements.length; i++){
        createBookmarkIcon(elements[i]);
      }
    current_list_count = elements.length;
    }
  }

  // Initial addition of icons
  addIconsToElements();

  // Create a MutationObserver to watch for new elements
  const observer = new MutationObserver(addIconsToElements);

  // Start observing the document body for added nodes
  
  observer.observe(document.body, { childList: true, subtree: true });
  
  console.log('Medium bookmark icon added'	);
}

// Implement this function to save the bookmark
function saveBookmark(bookmark) {
  console.log('Saving bookmark:', bookmark);
}

// Export a function that sets up the event listener
export function initMediumBookmarkIcon() {
  window.addEventListener('load', addMediumBookmarkIcon);
}
