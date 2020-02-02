chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
 if (message.purpose === 'check grammar'){
   console.log(message.data)
   $.post('http://localhost:4567/', message.data, function(r){sendResponse(r)})
   return true;
 };
});

// $.post('https://parser3.herokuapp.com', message.data, function(r){sendResponse(r)})
