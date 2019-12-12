$( document ).ready(function() {
  addStyleString('.kix-lineview-content {position: static !important; }')
  addStyleString('.box { display: none; background-color: white; color: dark-grey; height: 75px; position: absolute; margin-top: 0.75em; padding: 1em 1em 1em 1em; z-index: 20; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);}')
  addStyleString(".box:after { content: ''; position: absolute; top: 0; left: 50%; width: 0; height: 0; border: 0.625em solid transparent; border-bottom-color: white; border-top: 0; margin-left: -0.625em; margin-top: -0.625em;}")
});

function addStyleString(str) {
  var node = document.createElement('style');
  node.innerHTML = str;
  document.body.appendChild(node);
}

//
function highlight_text(context, sentences) {
  var instance = new Mark(context);
  $.each(sentences, function(sentence, response) {
    suggestion_id = response[0]
    suggestion = response[1]
    phrase = sentence.split(' ').join('.*'); // double spaced?
    instance.markRegExp(new RegExp(phrase), {"className": 'grammar', "each": function(node) {
      $(node).append("<div class='box' id=" + suggestion_id + ">" + suggestion + "</div>");
      suggestion_box = $("#" + suggestion_id + ".box")[0]
      suggestion_box.style.marginLeft = $(node).position().left + 'px';
      $(node).hover(function() {
        $(suggestion_box).css('display', 'block')
      }, function() {
        $(suggestion_box).css('display', 'none')
      });
    }})

    $('.grammar').hover(function() {
      $('.box').css('display', 'block')
    }, function() {
      $('.box').css('display', 'none')
    })
  })
}
