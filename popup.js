$(document).ready(function() {
  initialise_popup()
})

function initialise_popup() {
  chrome.storage.local.get(['gc_email', 'gc_auth'], function(headers) {
    $.ajax({
      url: 'https://grammar-checker1.herokuapp.com/api/v1/session_status',
      method: 'GET',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('X-User-Email', headers['gc_email']);
        xhr.setRequestHeader('X-User-Token', headers['gc_auth']);
      },
      success: function() { // signed in
        render_signed_in_page()
      },
      error: function() { // not signed in
        render_log_in_page()
      }
    })
  })
}

function render_log_in_page() {
  $('body').html('<h3>Log in to Grammar checker</h3><div class="form"><div class="field email"><label for="user_email">Email</label><br><input autofocus="autofocus" autocomplete="email" type="email" value="" name="user[email]" id="user_email">  </div>  <div class="field password">    <label for="user_password">Password</label><br>    <input autocomplete="current-password" type="password" name="user[password]" id="user_password">  </div>  <div class="field">    <input name="user[remember_me]" type="hidden" value="0"><input type="checkbox" value="1" name="user[remember_me]" id="user_remember_me">    <label for="user_remember_me">Remember me</label>  </div>  <div class="actions">    <input type="submit" name="commit" value="Log in" data-disable-with="Log in" class="gc_submit_log_in">  </div></div>')
}

function render_signed_in_page() {
  $('body').html('<a href="https://grammar-checker1.herokuapp.com/" target="_blank">Go to grammar checker</a></br><input type="submit" name="commit" value="Log out" class="gc_log_out">')
}

function get_services() {
  chrome.storage.local.get(['gc_email', 'gc_auth'], function(headers) {
    $.ajax({
      url: "https://grammar-checker1.herokuapp.com/api/v1/services/",
      method: "GET",
      beforeSend: function(xhr) {
        xhr.setRequestHeader('X-User-Email', headers['gc_email']);
        xhr.setRequestHeader('X-User-Token', headers['gc_auth']);
      },
      success: function(response) {
        chrome.storage.sync.set({gc_services: response}, function(){
          true
        });
      }
    })
  })
}

//listeners

// log in
$(document).on('click', '.gc_submit_log_in', function(){
  email = $('#user_email').val()
  password = $('#user_password').val()

  $.ajax({
    url: 'https://grammar-checker1.herokuapp.com//api/v1/sign_in',
    method: "POST",
    data: {email: email, password: password},
    success: function(response) { // sign in
      render_signed_in_page()
      $('body').prepend('<p class="gc_success_tet">Signed In</p>')
      chrome.storage.local.set({gc_email: response['email']}, function(){});
      chrome.storage.local.set({gc_auth: response['authentication_token']}, function(){});
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
      url: "https://grammar-checker1.herokuapp.com/api/v1/sign_out",
      method: "DELETE",
      beforeSend: function(xhr) {
        xhr.setRequestHeader('X-User-Email', headers['gc_email']);
        xhr.setRequestHeader('X-User-Token', headers['gc_auth']);
      },
      success: function() {
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
