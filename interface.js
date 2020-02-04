$(document).ready(function() {
  box_hover()
  mark_hover()
  ignore()
})

function ignore() {
  $(document).on('click', '.ignore_text', function(e) {
    paragraph = $(this).closest('.kix-paragraphrenderer')
    text = collect_text(paragraph)
    chrome.runtime.sendMessage({purpose: "check grammar", data: text}, function(response) {
      console.log('ignore')
      // de highlight
      // hide box
    });

  })
}

function box_hover() { // include border
  $(document).on('mouseover', '.box', function(e) {
    var box = $(this).closest('.box')[0]
    if(e.target == box) { // if hovering over marked text
      $(box).addClass('hover')
    }
  })

  $(document).on('mouseout', '.box', function(e) {
    var e = event.toElement || event.relatedTarget;
    if (e.parentNode == this || e == this) {
       return;
    }
    $(this).removeClass('hover')
    $(this).css('opacity', 0)
  })
}

function mark_hover() { // opacity 0 = hidden
  $(document).on('mouseover', '.grammar', function(e) {
    var mark = $(this)[0]
    if(e.target == mark) { // if hovering over marked text
      $(mark).find('.box').css('opacity', 1)
    }
  })

  $(document).on('mouseout', '.grammar', function(e) {
    var mark = $(this)[0]
    if(e.target == mark) { // if hovering over marked text
      setTimeout(function() { // Hide box after one second
        var box = $(mark).find('.box')[0]
        if (!($(box).hasClass('hover'))) {
          $(box).css('opacity', 0)
        }
      }, 1000)
    }
  })
}

function highlight_text(context, sentences) {
  var instance = new Mark(context);
  $.each(sentences, function(sentence, response) {
    suggestion_id = response[0]
    suggestion = response[1]
    console.log(sentence)
    instance.mark(sentence, {className: 'grammar', separateWordSearch: false, ignoreJoiners: true,
    exclude: ['.box'], acrossElements: true, each: function(node) {

      if(node.childNodes[0].nodeValue.replace(/[^\x00-\x7F]/g, "").length > 0) {
        $(node).append("<div class='box' id=box_" + suggestion_id + ">" + suggestion + "<div class='options_border'></div><button type='button' class='btn btn-primary btn-sm ignore_text'>Ignore</button></div>");
        suggestion_box = $(node).find('.box')[0]
        page = $('.kix-page-column')[0]

        mark_width = node.getBoundingClientRect().width
        mark_center = node.getBoundingClientRect().x + (mark_width / 2)
        mark_right = node.getBoundingClientRect().x + mark_width

        box_left = suggestion_box.getBoundingClientRect().x
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
      }
    }})
  })
}
