chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
 if (message.purpose === 'check grammar'){
   $.post('http://www.philip35.com', message.data, function(r){sendResponse(r)})
   return true;
 };
});
