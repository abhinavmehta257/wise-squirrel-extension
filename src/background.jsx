chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	const URL = 'https://fantastic-train-r6qjxrpp5rwf5r4v-3000.app.github.dev/api'

	switch (request.action) {
		case 'saveUrl':
			// Here you would typically implement the logic to save the URL
			// For now, we'll just log it and send a success response
			console.log('URL to save:', request.url);
			
			// Retrieve authToken from chrome.storage.local
			chrome.storage.local.get(['authToken'], function(result) {
				const authToken = result.authToken;
				console.log('Auth token:', authToken);
				if (authToken) {
					const saveData = {
						post_id: request.post_id,  // Using URL as a unique identifier
						user_id: null,  // This should be set from the server-side
						title: request.title,  // Will be set by content script
						author: request.author || 'Unknown',
						body: request.body || '',
						thumbnail: request.thumbnail || '',  // Will be set by content script
						link: request.link,
						service_id: null,  // This should be set from the server-side
						service_name: request.service_name
					};

					fetch(`${URL}/bookmarks/save`, {
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
			break;
		case 'fetchUrl':
			console.log('Fetching URL:', request.url);
			chrome.storage.local.get(['authToken'], function(result) {
				const authToken = result.authToken;
				console.log('Auth token:', authToken);
				fetch(`${URL}/bookmarks/fetch?url=${request.url}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${authToken}`
				},
			})
			.then(response => response.json())
			.then(data => {
				console.log('background URL fetched successfully:', data);
				if(data.status == false){
					sendResponse({ success: false, error: data.error });

				}else{
					sendResponse({ success: true, data: data });

				}
			})
			.catch(error => {
				console.error('Error fetching URL:', error);
				sendResponse({ success: false, error: error.message });
				});
			});

			return true;
			break;
		case 'openSidePanel':
			chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
				if (tabs[0]) {
					const currentTabId = tabs[0].id;
					chrome.sidePanel.open({ tabId: currentTabId });
				} else {
					console.error('No active tab found');
				}
			});
			break;
		
		case 'fetchServices':
			chrome.storage.local.get(['authToken'], function(result) {
				const authToken = result.authToken;
				console.log('Auth token:', authToken);
				const response =fetch(`${URL}/bookmarks`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${authToken}`
				},
			})
			.then(response => response.json())
			.then(data => {
				console.log('background URL fetched successfully:', data);
				if(data.status == false){
					sendResponse({ success: false, error: data.error });

				}else{
					sendResponse({ success: true, data: data });

				}
			})
			.catch(error => {
				console.error('Error fetching URL:', error);
				sendResponse({ success: false, error: error.message });
				});
			});

			return true;
			break;
	}
});

chrome.sidePanel
          .setPanelBehavior({ openPanelOnActionClick: true })
          .catch((error) => console.error(error));