function addStyleString(str) {
  var node = document.createElement('style');
  node.innerHTML = str;
  document.body.appendChild(node);
}

function highlight_text(context, sentences) {
  var instance = new Mark(context);
  $.each(sentences, function(index, sentence) {
    phrase = sentence.split(' ').join('.*'); // double spaced?
    instance.markRegExp(new RegExp(phrase), {"className": 'grammar'})
    // $('.grammar').append("<div class='box'</div>");
    // addStyleString('.box { background-color: green; width: 50px; height: 50px; position: absolute; }')
    // console.log('box')
    // $('.grammar').hover(function() {
    //   $('.box').css('display', 'block')
    // }, function() {
    //   $('.box').css('display', 'none')
    // })
  })
}
