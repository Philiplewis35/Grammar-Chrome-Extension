window.instance = new Mark('.kix-paragraphrenderer')

function grammar_hover(grammar) {
  var timeoutId = null

  grammar.addEventListener('mouseover', function() {
    grammar_box = $(this)
    timeoutID = window.setTimeout(function () {
      $.each($('.gc_box'), function(index, suggestion_box) {
        $(this).css('display', 'none')
      })
      grammar_box.find('.gc_box').css('display', 'block')
    }, 1000);
  });

  grammar.addEventListener('mouseout', function() {
    window.clearTimeout(timeoutID)
  })
}


$(document).on('mouseover', '.gc_box', function(event) {event.stopPropagation()})
$(document).on('click', '.close_gc_box', function() {$(this).closest('.gc_box').css('display', 'none')})

$(document).on('mouseover', '.copy_suggestion', function() { $(this).addClass('btn-primary') })
$(document).on('mouseout', '.copy_suggestion', function() { $(this).removeClass('btn-primary') })

$(document).on('click', '.ignore_text', function(e) {
  paragraph = $(this).closest('.kix-paragraphrenderer')
  mark = $(this).closest('mark')[0]
  id = mark.classList[mark.classList.length - 1]
  $('.' + id + ' > .gc_box').remove();
  window.instance.unmark({className: id})
})

$(document).on('click', '.copy_suggestion', function() {
  str = this.innerText
  el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  $(this).closest('.gc_box').css('display', 'none')
  $('body').prepend('<div class = "gc_alert_box">suggestion coppied to clipboard</div>')
  setTimeout(function(){ $('.gc_alert_box').remove() }, 3000);
})


function highlight_text(responses) {
  if(responses.length > 0) {
    $.each(responses, function(services_index, services) {
      $.each(services, function(response_index, response) {

        window.instance.mark(response.phrase, { className: 'grammar', acrossElements: true, ignoreJoiners: true, separateWordSearch: false, exclude: ['mark'], filter: function(text_node, term, all_marks_no, term_marks_no) {
          window.marks_no = term_marks_no
          return true
        }, each: function(node) {

          grammar_class =  'grammar_' + window.response_id + '_' + window.marks_no
          $(node).addClass(grammar_class)


          $(node).append("<div class='gc_box'>" + '<div class="card"><div class="card-header">' + response.explanation + '</div><ul class="list-group list-group-flush"><li class="list-group-item suggestion">' + response.suggestion + '</li><li class="list-group-item"><div class= "ignore_text btn btn-primary btn-sm">Ignore</div><div class="close_gc_box btn btn-danger btn-sm">Close</div></li></ul></div></div>');
          if(response.substituion == true) {
            $(node).find('.suggestion').addClass('copy_suggestion')
          }

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
          grammar_hover(node)
        }})
      })
    })
  }
}
