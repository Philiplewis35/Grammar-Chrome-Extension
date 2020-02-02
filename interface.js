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
      $(node).append("<div class='box' id=box_" + suggestion_id + ">" + suggestion + "</div>");
      suggestion_box = $(node).find('.box')[0]
      page = $('.kix-page-column')[0]


      mark_width = node.getBoundingClientRect().width
      mark_center = node.getBoundingClientRect().x + (mark_width / 2)
      mark_right = node.getBoundingClientRect().x + mark_width


      box_width = suggestion_box.getBoundingClientRect().width
      box_center = suggestion_box.getBoundingClientRect().x + (box_width / 2)
      box_right = suggestion_box.getBoundingClientRect().x + box_width

      page_right = page.getBoundingClientRect().x + page.getBoundingClientRect().width

      if(mark_right > box_right) {
        // align box center with center of phrase
        box_padding = (mark_center - box_center)
        suggestion_box.style.marginLeft = box_padding + 'px';
        box_right = suggestion_box.getBoundingClientRect().x + box_width
      }

      if(box_right > (page_right - 20)) { // if box has gone off right edge
        box_padding = ((page_right - box_left) - (box_width + 20))
        suggestion_box.style.marginLeft = box_padding + 'px';
      }

      $(node).hover(function() {
        $(this).find('.box').css('visibility', 'visible')
      }, function() {
        $(this).find('.box').css('visibility', 'hidden')
      });

    }})
  })
}
