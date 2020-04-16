$( document ).ready(function() {
  if($(".kix-lineview-content")[0]) {
    observe_google_doc();
    check_entire_doc();
    alert_listener();
  }
});

const observer = new MutationObserver(function(events) { window.last_event = events[0] });
$(document).arrive(".kix-paragraphrenderer", {fireOnAttributesModification: true}, function(paragraph) {
    observer.observe(paragraph, { attributes: true, subtree: true });
    window.last_event = {target: $(paragraph).children()[0]}
});

function observe_google_doc() {
  var typingTimer;
  var input = $('iframe.docs-texteventtarget-iframe')[0];
  input.contentDocument.addEventListener("keydown", clearTimeout(typingTimer), false);
  input.contentDocument.addEventListener("keyup", function(e) {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(function doneTyping() { send_text_to_services(window.last_event) }, 3000);
  }, false);
};

function send_text_to_services(typing_event) {
  var paragraph = $(typing_event.target).parents('.kix-paragraphrenderer').first()
  text = collect_text(paragraph)
  chrome.runtime.sendMessage({purpose: "check grammar", data: {text: text}}, function(response) {
    highlight_text(response)
  });
}

function collect_text(paragraph) {
  text = ""
  $.each(paragraph.children(), function(index, line) {
    line = $(line).find('.kix-wordhtmlgenerator-word-node')[0]
    text += line.childNodes[0].nodeValue;
    text += " " // new line char
  })
  text = text.replace(/[\u200B-\u200D\uFEFF]/g, '')
  return text
}

function check_entire_doc() {
  text = ""
  $.each($('.kix-paragraphrenderer'), function(index, paragraph) {
    text += collect_text($(paragraph))
  })
  chrome.runtime.sendMessage({purpose: "check grammar", data: {text: text}}, function(response) {
    highlight_text(response)
  });
}

function show_services_alert() {
  if($('.gc_notice.services').length == 0) {
    $('body').prepend("<div class = 'gc_notice services'>Please add services using the <a href='https://grammar-checker1.herokuapp.com/' target='_blank'>Grammar Services Repository</a>. Please press 'sync services' in the extension popup after you have followed this step.</div>")
  }
}

function show_login_alert() {
  if( $('.gc_notice.signed_out').length == 0) {
    $('body').prepend("<div class = 'gc_notice signed_out'>Please sign in to the GSR from the chrome extension's popup</div>")
  }
}

function alert_listener() {
  chrome.runtime.onMessage.addListener(
   function(request) {
     switch(request.action){
       case 'signed_in':
          $('.gc_notice.signed_out').remove();
          break;
       case 'signed_out':
          show_login_alert();
          break;
       case 'no_services':
          show_services_alert();
          break;
       case 'populated_services':
          $('.gc_notice.services').remove();
          break;
     }
  });
}
