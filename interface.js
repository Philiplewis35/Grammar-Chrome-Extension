$( document ).ready(function() {
  if($(".kix-lineview-content")[0]) {
    addStyleString('.kix-lineview-content {position: static !important; }')
    addStyleString('.box { display: none; background-color: white; color: dark-grey; height: 75px; position: absolute; margin-top: 0.75em; padding: 1em 1em 1em 1em; z-index: 20; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);}')
  }
});

function addStyleString(str) {
  var node = document.createElement('style');
  node.innerHTML = str;
  document.body.appendChild(node);
}

function highlight_text(context, sentences) {
  var instance = new Mark(context);
  $.each(sentences, function(sentence, response) {
    suggestion_id = response[0]
    suggestion = response[1]
    console.log(sentence)
    instance.mark(sentence, {className: 'grammar', separateWordSearch: false, ignoreJoiners: true,
    exclude: ['.box'], acrossElements: true, each: function(node) {
      $(node).removeClass('box')
      $(node).append("<div class='box' id=" + suggestion_id + ">" + suggestion + "</div>");
      suggestion_box = $("#" + suggestion_id + ".box")[0]

      mark_right = $(node).position().left + $(node).width()
      box_center = $(suggestion_box).position().left + ($(suggestion_box).width() / 2) + 5 // + width of point / 2
      mark_center = ($(node).position().left + ($(node).width() / 2))
      if(mark_right < box_center) {
        box_width = $(suggestion_box).width()
        arrow_padding = (mark_center / box_width) * 100
        $(suggestion_box).append("<style>.box:after { content: ''; position: absolute; top: 0; left: " + arrow_padding + "%; width: 0; height: 0; border: 0.625em solid transparent; border-bottom-color: white; border-top: 0; margin-left: -0.625em; margin-top: -0.625em;}</style>")
      } else {
        box_padding = (mark_center - box_center)
        suggestion_box.style.marginLeft = box_padding + 'px';
        $(suggestion_box).append("<style>.box:after { content: ''; position: absolute; top: 0; left: 50%; width: 0; height: 0; border: 0.625em solid transparent; border-bottom-color: white; border-top: 0; margin-left: -0.625em; margin-top: -0.625em;}</style>")
      }

      $(node).hover(function() {
        $(this).find('.box').css('display', 'block')
      }, function() {
        $(this).find('.box').css('display', 'none')
      });
    }})
  })
}
