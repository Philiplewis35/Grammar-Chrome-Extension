chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
 if (message.purpose === 'check grammar'){
   $.post('http://localhost:4567/', message.data, function(r){sendResponse(r)})
   return true;
 };
});
