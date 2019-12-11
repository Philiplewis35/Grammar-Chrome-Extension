var last_event;
$( document ).ready(function() {
  observe_google_doc();
});


function observe_google_doc() {
  var typingTimer;
  var doneTypingInterval = 3000;
  var input = $('iframe.docs-texteventtarget-iframe')[0];
  input.contentDocument.addEventListener("keydown", clearTimeout(typingTimer), false);
  input.contentDocument.addEventListener("keyup", function() {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
  }, false);

  const set_event = function(events) {
    window.last_event = events[0]
  };
  const observer = new MutationObserver(set_event);
  observer.observe($('.kix-paragraphrenderer')[0], { attributes: true, subtree: true }); // TODO: All paragraphs
};

function doneTyping() {
  collectText(window.last_event)
}

function collectText(typing_event) {
  var paragraph = jQuery(typing_event.target).parents('.kix-paragraphrenderer').first()
  var text = ""

  $.each(paragraph.children(), function(index, line) {
    line = jQuery(line).find('.kix-wordhtmlgenerator-word-node')
    text += line.text()
  })

  chrome.runtime.sendMessage({purpose: "check grammar", data: text}, function(response) {
    var sentences =  Object.keys(response)
    highlight_text(paragraph[0], sentences)
  });
}
