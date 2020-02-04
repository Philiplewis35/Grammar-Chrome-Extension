chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  local = 'http://localhost:4567/'
  heroku = 'https://parser3.herokuapp.com'

 if (message.purpose === 'check grammar'){
   $.post(local, message.data, function(r){sendResponse(r)})
   return true;
 };

 if(message.purpose === 'ignore') {
   $.post(local, message.data, function(r){sendResponse(r)})
 }
});
