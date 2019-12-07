$( document ).ready(function() {
  google_doc_obsever()
});

var pause = false;

function addStyleString(str) {
  var node = document.createElement('style');
  node.innerHTML = str;
  document.body.appendChild(node);
}

function google_doc_obsever() {
  var typingTimer;

  if($('.docs-gm')[0]){
    const env = new Mark($('.kix-paragraphrenderer')[0]);


    const callback = function(events) {
      if(pause == true){ return }
      pause = true
      collectText(env, events[0])
    };

    const observer = new MutationObserver(callback);
    observer.observe($('.kix-paragraphrenderer')[0], { attributes: true, subtree: true }); // TODO: All paragraphs
  }
}

function collectText(env, event) {
  var paragraph = jQuery(event.target).parents('.kix-paragraphrenderer').first()
  var text = ""
  $.each(paragraph.children(), function(index, line) {
    line = jQuery(line).find('.kix-wordhtmlgenerator-word-node')
    text += line.text()
  })
  send_to_api(env, text);
}

function send_to_api(env, text) {
  chrome.runtime.sendMessage({purpose: "check grammar", data: text}, function(response) {
    var sentences =  Object.keys(response)
    highlight_text(env, sentences)
  });
};

function highlight_text(context, sentences) {
  $.each(sentences, function(index, sentence) {
    phrase = sentence.split(' ').join('.*'); // double spaced?
    context.markRegExp(new RegExp(phrase), {"className": 'grammar'})
    pause = false;

    $('.grammar').append("<div class='box' <p>this is hidden</p></div>");
    addStyleString('.box { color: white; background-color: green; width: 100px; height: 100px; z-index: 100;}')
    // $('.grammar').hover(function() {
    //   $('.box').css('display', 'block')
    // }, function() {
    //   $('.box').css('display', 'none')
    // })
  })
}
