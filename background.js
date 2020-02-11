chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  local = 'http://localhost:4567/'
  heroku = 'https://parser3.herokuapp.com'

  url = local

 if (message.purpose && message.purpose === 'check grammar'){
   $.post(url, message.data, function(r){sendResponse(r)})
   return true;
 };

 if(message.purpose && message.purpose === 'ignore') {
   $.post(url + 'ignore', message.data, function(r){sendResponse(r)})
   return true;
 };

 if(message.purpose && message.purpose === 'explain') {
   $.get(url + 'explainer', message.data, function(r){sendResponse(r)})
   return true;
 };
});

chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    console.log(request)
    console.log(sender)
    console.log(sendResponse)
  });
