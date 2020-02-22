$(document).on('mouseover', '.grammar', function() {$(this).find('.box').css('display', 'block')})
$(document).on('mouseover', '.box', function(event) {event.stopPropagation()})
$(document).on('click', '.close_box', function() {$(this).closest('.box').css('display', 'none')})


$(document).on('click', '.ignore_text', function(e) {
  $(this).closest('.grammar').css('border-bottom', 'none')
  box = $(this).closest('.box')
  box.remove()
})


function highlight_text(context, responses) {
  if(responses.length > 0) {
    $.each(responses, function(services_index, services) {
      $.each(services, function(response_index, response) {
        var instance = new Mark(context);

        instance.mark(response.phrase, {className: 'grammar', separateWordSearch: false, ignoreJoiners: true,
        exclude: ['.box'], acrossElements: true, each: function(node) {

          if(node.childNodes[0].nodeValue.replace(/[^\x00-\x7F]/g, "").length > 0) {
            $(node).append("<div class='box'>" + response.explanation + "<div class='options_border'></div><div class= 'ignore_text btn btn-primary btn-sm'>Ignore</div><div class='close_box btn btn-danger btn-sm'>Close</div></div>");
            suggestion_box = $(node).find('.box')[0]

            mark_width = node.getBoundingClientRect().width
            mark_center = node.getBoundingClientRect().x + (mark_width / 2)
            mark_right = node.getBoundingClientRect().x + mark_width

            box_left = suggestion_box.getBoundingClientRect().x
            box_width = suggestion_box.getBoundingClientRect().width
            box_center = suggestion_box.getBoundingClientRect().x + (box_width / 2)
            box_right = suggestion_box.getBoundingClientRect().x + box_width

            page = $('.kix-page-column')[0]
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

            // change from opacity 0 to display none now box has been generated
            $(suggestion_box).css('display', 'none')
            $(suggestion_box).css('opacity', '1')

          }
        }})
      })
    })
  }
}
