$(document).ready(function() {
  initialise_popup()
})

// window.root_url = 'http://localhost:3000/'
window.root_url = 'https://grammar-checker1.herokuapp.com/'

function initialise_popup() {
  $('body').html('<div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>')
  chrome.storage.local.get(['gc_email', 'gc_auth'], function(headers) {
    $.ajax({
      url: window.root_url + 'api/v1/session_status/',
      method: 'GET',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('X-User-Email', headers['gc_email']);
        xhr.setRequestHeader('X-User-Token', headers['gc_auth']);
      },
      success: function(data, textStatus, xhr) { // signed in
        render_signed_in_page()
      },
      error: function() {
        render_log_in_page()
      }
     })
  })
}

function render_log_in_page() {
  $('body').html('<p><a href="https://grammar-checker1.herokuapp.com/" target="_blank">Grammar Services Repository</a><p class="bold">Sign in</p></p><div class="form"><div class="field email"><label for="user_email">Email</label><br><input autofocus="autofocus" autocomplete="email" type="email" value="" name="user[email]" id="user_email"></div><div class="field password"><label for="user_password">Password</label><br>    <input autocomplete="current-password" type="password" name="user[password]" id="user_password">  </div>  <div class="field">    <input name="user[remember_me]" type="hidden" value="0"></div><div class="actions"><input type="submit" name="commit" value="Log in" data-disable-with="Log in" class="gc_submit_log_in btn btn-primary">  </div></div>')
}

function render_signed_in_page() {
  chrome.storage.local.get('gc_email', function(response) {
    $('body').html('<a href="https://grammar-checker1.herokuapp.com/" target="_blank">Grammar Services Repository</a><p>Hi ' + response["gc_email"] + '</p><input type="submit" name="commit" value="Sync Services" class="gc_sync"></br><input type="submit" name="commit" value="Log out" class="gc_log_out">')
  });
}

function get_services() {
  chrome.storage.local.get(['gc_email', 'gc_auth'], function(headers) {
    $.ajax({
      url: window.root_url + "api/v1/services/",
      method: "GET",
      beforeSend: function(xhr) {
        xhr.setRequestHeader('X-User-Email', headers['gc_email']);
        xhr.setRequestHeader('X-User-Token', headers['gc_auth']);
      },
      success: function(response) {
        if(response.length == 0) { update_alert('no_services') } else { update_alert('populated_services') }
        $('body').prepend('<p class="gc_success_tet">Services Updated</p>')
        chrome.storage.local.set({gc_services: response}, function(){
          true
        });
      }
    })
  })
}

function update_alert(action) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: action}, function(response) {
      true
    });
  });
}

//listeners

// log in
$(document).on('click', '.gc_submit_log_in', function(){
  email = $('#user_email').val()
  password = $('#user_password').val()

  $.ajax({
    url: window.root_url + 'api/v1/sign_in',
    method: "POST",
    data: {email: email, password: password},
    success: function(response) { // sign in
      $('body').prepend('<p class="gc_success_tet">Signed In</p>')
      chrome.storage.local.set({gc_email: response['email']}, function(){});
      chrome.storage.local.set({gc_auth: response['authentication_token']}, function(){});
      render_signed_in_page()
      update_alert('signed_in')
      get_services() // syncs services to chrome storage
    },
    error: function() { // show error message on log in page
      if($('.gc_error_text')[0]) {
        $('.gc_error_text').html('Invalid username or password')
      } else {
        $('body').prepend('<p class="gc_error_text">Invalid username or password</p>')
      }
    }
  });
})

// log out
$(document).on('click', '.gc_log_out', function(){
  chrome.storage.local.get(['gc_email', 'gc_auth'], function(headers) {
    $.ajax({
      url: window.root_url + "api/v1/sign_out",
      method: "DELETE",
      beforeSend: function(xhr) {
        xhr.setRequestHeader('X-User-Email', headers['gc_email']);
        xhr.setRequestHeader('X-User-Token', headers['gc_auth']);
      },
      success: function() {
        chrome.storage.local.clear()
        render_log_in_page()
      },
      error: function() {
        if($('.gc_error_text')[0]) {
          $('.gc_error_text').html('Could not log out')
        } else {
          $('body').prepend('<p class="gc_error_text">Could not log out</p>')
        }
      }
    })
  })
})

// sync services
$(document).on('click', '.gc_sync', function() {
  get_services()
})
