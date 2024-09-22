chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === 'saveUrl') {
		// Here you would typically implement the logic to save the URL
		// For now, we'll just log it and send a success response
		console.log('URL to save:', request.url);
		
		// Retrieve authToken from chrome.storage.local
		chrome.storage.local.get(['authToken'], function(result) {
			const authToken = result.authToken;
			
			if (authToken) {
				const saveData = {
					post_id: request.post_id,  // Using URL as a unique identifier
					user_id: null,  // This should be set from the server-side
					title: request.title,  // Will be set by content script
					author: request.author || 'Unknown',
					body: request.body || '',
					thumbnail: request.thumbnail || '',  // Will be set by content script
					link: request.url,
					service_id: null,  // This should be set from the server-side
					service_name: request.service_name
				};

				fetch('http://localhost:3000/api/bookmarks/save', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${authToken}`
					},
					body: JSON.stringify(saveData)
				})
				.then(response => response.json())
				.then(data => {
					console.log('URL saved successfully:', data);
					sendResponse({ success: true });
				})
				.catch(error => {
					console.error('Error saving URL:', error);
					sendResponse({ success: false, error: error.message });
				});
			} else {
				console.error('No authToken found');
				sendResponse({ success: false, error: 'No authToken found' });
			}
		});
		
		
		// Return true to indicate that we will send a response asynchronously
		return true;
	}
});
