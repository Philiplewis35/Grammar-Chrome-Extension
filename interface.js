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
      // suggestion_box = $("#" + suggestion_id + ".box")[0]
      page = $('.kix-page-column')[0]

      // node = $('.grammar')
      // suggestion_box = $('.box')

      mark_left = node.getBoundingClientRect().x
      mark_width = node.getBoundingClientRect().width
      mark_center = node.getBoundingClientRect().x + (mark_width / 2)
      mark_right = node.getBoundingClientRect().x + mark_width


      box_left = suggestion_box.getBoundingClientRect().x
      box_width = suggestion_box.getBoundingClientRect().width
      box_center = suggestion_box.getBoundingClientRect().x + (box_width / 2)
      box_right = suggestion_box.getBoundingClientRect().x + box_width

      page_right = page.getBoundingClientRect().x + page.getBoundingClientRect().width

      if(mark_right < box_right) {
        // shift arrow
        arrow_padding = ((mark_center - box_left) / box_width) * 100
        // $(suggestion_box).append("<style>#box_" + suggestion_id + ".box:after { content: ''; position: absolute; top: 0; left: " + arrow_padding + "%; width: 0; height: 0; border: 0.625em solid transparent; border-bottom-color: white; border-top: 0; margin-left: -0.625em; margin-top: -0.625em;}</style>")
      } else {
        // pad box to align arrow
        box_padding = (mark_center - box_center)
        suggestion_box.style.marginLeft = box_padding + 'px';
        box_right = suggestion_box.getBoundingClientRect().x + box_width
        if(box_right > (page_right - 20)) {
          box_padding = ((page_right - box_left) - (box_width + 20))
          suggestion_box.style.marginLeft = box_padding + 'px';
          // $(suggestion_box).append("<style>#box_" + suggestion_id + ".box:after { content: ''; position: absolute; top: 0; left: 50%; width: 0; height: 0; border: 0.625em solid transparent; border-bottom-color: white; border-top: 0; margin-left: -0.625em; margin-top: -0.625em;}</style>")
      } else {
        // $(suggestion_box).append("<style>#box_" + suggestion_id + ".box:after { content: ''; position: absolute; top: 0; left: 50%; width: 0; height: 0; border: 0.625em solid transparent; border-bottom-color: white; border-top: 0; margin-left: -0.625em; margin-top: -0.625em;}</style>")
      }
    }

      $(node).hover(function() {
        $(this).find('.box').css('visibility', 'visible')
      }, function() {
        $(this).find('.box').css('visibility', 'hidden')
      });
    }})
  })
}
