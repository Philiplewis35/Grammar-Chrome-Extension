$( document ).ready(function() {
  addStyleString('.kix-lineview-content {position: static !important; }')
  addStyleString('.box { background-color: white; color: dark-grey; height: 75px; position: absolute; margin-top: 0.75em; padding: 1em 1em 1em 1em; z-index: 20; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);}')
  addStyleString(".box:after { content: ''; position: absolute; top: 0; left: 50%; width: 0; height: 0; border: 0.625em solid transparent; border-bottom-color: white; border-top: 0; margin-left: -0.625em; margin-top: -0.625em;}")
});

function addStyleString(str) {
  var node = document.createElement('style');
  node.innerHTML = str;
  document.body.appendChild(node);
}

function highlight_text(context, sentences) {
  var instance = new Mark(context);
  $.each(sentences, function(sentence, suggestion) {
    phrase = sentence.split(' ').join('.*'); // double spaced?
    instance.markRegExp(new RegExp(phrase), {"className": 'grammar'})
    $('.grammar').append("<div class='box'>" + suggestion + "</div>");


    // $('.grammar').hover(function() {
    //   $('.box').css('display', 'block')
    // }, function() {
    //   $('.box').css('display', 'none')
    // })
  })
}
