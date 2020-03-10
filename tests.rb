require "selenium-webdriver"
require 'webdrivers'
require 'pry'

options = Selenium::WebDriver::Chrome::Options.new(extensions: ['/Users/Philip/Desktop/extension.crx'])
driver = Selenium::WebDriver.for :chrome, options: options
driver.navigate.to('chrome-extension://dgkcjckpmhgdemglekpnncnflpbnobki/popup.html')
wait = Selenium::WebDriver::Wait.new(:timeout => 5)



def sign_in(driver, wait)
  driver.navigate.to('chrome-extension://dgkcjckpmhgdemglekpnncnflpbnobki/popup.html')
  email = wait.until { driver.find_element(:id, 'user_email') }
  email.send_keys('bob@example.com')
  password = wait.until { driver.find_element(:id, 'user_password') }
  password.send_keys('Password123')
  driver.find_element(:name, "commit").click
  success = wait.until { driver.find_element(:class, 'success') }
  puts 'signed in' if success
end

def open_google_doc(driver, wait)
  driver.navigate.to('https://docs.google.com/')
  email = wait.until { driver.find_element(:id, 'identifierId') }
  email.send_keys('philiplewis35@gmail.com')
  driver.find_element(class: 'RveJvd').click
  binding.pry
end

# sign_in(driver, wait)
open_google_doc(driver, wait)


# go to google docs
# type a passive sentence
# look for box
