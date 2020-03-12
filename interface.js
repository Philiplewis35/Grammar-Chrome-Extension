$(document).on('mouseover', '.grammar', function() {$(this).find('.gc_box').css('display', 'block')})
$(document).on('mouseover', '.gc_box', function(event) {event.stopPropagation()})
$(document).on('click', '.close_gc_box', function() {$(this).closest('.gc_box').css('display', 'none')})
$(document).on('mouseover', '.suggestion', function() { $(this).addClass('btn-primary'); })
$(document).on('mouseout', '.suggestion', function() { $(this).removeClass('btn-primary'); })

$(document).on('click', '.ignore_text', function(e) {
  $(this).closest('.grammar').css('border-bottom', 'none')
  gc_box = $(this).closest('.gc_box')
  gc_box.remove()
})

$(document).on('click', '.suggestion', function(e) {
  text = document.createElement('textarea')
  text.value = $(this)[0].textContent
  document.body.appendChild(text)
  text.select();
  document.execCommand('copy')
  document.body.removeChild(text)
  gc_box = $(this).closest('.gc_box')
  gc_box.remove()
})

function highlight_text(context, responses) {
  if(responses.length > 0) {
    $.each(responses, function(services_index, services) {
      $.each(services, function(response_index, response) {
        $.each($(context).find('.kix-wordhtmlgenerator-word-node'), function(index, line) {
          if(line.childNodes[0].nodeValue.replace(/[^\x00-\x7F]/g, "").search(response.phrase) >= 0) {
            $(line).html($(line).html().replace(/[^\x00-\x7F]/g, "").replace(response.phrase, '<span class=grammar>' + response.phrase + '</span'))
            node = $(line).find('.grammar')[0]
            $(node).append("<div class='gc_box'>" + '<div class="card"><div class="card-header">' + response.explanation + '</div><ul class="list-group list-group-flush"><li class="list-group-item suggestion" title="copy suggestion">' + response.suggested_replacement + '<i class="far fa-copy"></i></li><li class="list-group-item"><div class= "ignore_text btn btn-primary btn-sm">Ignore</div><div class="close_gc_box btn btn-danger btn-sm">Close</div></li></ul></div></div>');
            suggestion_gc_box = $(node).find('.gc_box')[0]

            mark_width = node.getBoundingClientRect().width
            mark_center = node.getBoundingClientRect().x + (mark_width / 2)
            mark_right = node.getBoundingClientRect().x + mark_width

            gc_box_left = suggestion_gc_box.getBoundingClientRect().x
            gc_box_width = suggestion_gc_box.getBoundingClientRect().width
            gc_box_center = suggestion_gc_box.getBoundingClientRect().x + (gc_box_width / 2)
            gc_box_right = suggestion_gc_box.getBoundingClientRect().x + gc_box_width

            page = $('.kix-page-column')[0]
            page_right = page.getBoundingClientRect().x + page.getBoundingClientRect().width

            if(mark_right > gc_box_right) {
              // align gc_box center with center of phrase
              gc_box_padding = (mark_center - gc_box_center)
              suggestion_gc_box.style.marginLeft = gc_box_padding + 'px';
              gc_box_right = suggestion_gc_box.getBoundingClientRect().x + gc_box_width
            }

            if(gc_box_right > (page_right - 20)) { // if gc_box has gone off right edge
              gc_box_padding = ((page_right - gc_box_left) - (gc_box_width + 20))
              suggestion_gc_box.style.marginLeft = gc_box_padding + 'px';
            }

            // change from opacity 0 to display none now gc_box has been generated
            $(suggestion_gc_box).css('display', 'none')
            $(suggestion_gc_box).css('opacity', '1')
          }
        });
      })
    })
  }
}
