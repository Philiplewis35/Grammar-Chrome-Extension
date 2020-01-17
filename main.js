$( document ).ready(function() {
  if($(".kix-lineview-content")[0]) {
    observe_google_doc();
  }
});

var last_event;
const set_event = function(events) {
  window.last_event = events[0]
};

const observer = new MutationObserver(set_event);
$(document).arrive(".kix-paragraphrenderer", {fireOnAttributesModification: true}, function(paragraph) {
    observer.observe(paragraph, { attributes: true, subtree: true });
    window.last_event = {target: $(paragraph).children()[0]}
});

function observe_google_doc() {
  var typingTimer;
  var doneTypingInterval = 3000;
  var input = $('iframe.docs-texteventtarget-iframe')[0];
  input.contentDocument.addEventListener("keydown", clearTimeout(typingTimer), false);
  input.contentDocument.addEventListener("keyup", function(e) {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
  }, false);
};

function doneTyping() {
  check_grammar(window.last_event)
}

function check_grammar(typing_event) {
  var paragraph = $(typing_event.target).parents('.kix-paragraphrenderer').first()
  var text = ""

  $.each(paragraph.children(), function(index, line) {
    line = $(line).find('.kix-wordhtmlgenerator-word-node')
    text += line[0].innerText
  })
  console.log('text: ' + text)
  chrome.runtime.sendMessage({purpose: "check grammar", data: text}, function(response) {
    highlight_text(paragraph[0], response)
  });
}
