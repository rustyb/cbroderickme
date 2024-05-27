---
layout: post
title: "Auto booking my tennis slots with selenium and telegram notifications"
categories: blog
tags: python, selenium, automation, telegram
published: true
---

It's been some time since I wrote some small bot scripts that can automate some boring stuff in my life. Recently i've gotten into playing tennis at the weekends.

Unfortunately though you need to be super organised to book the most ideal slot for me Sundays at 10am.

Slots become available to book 6 days in advance so in the case of our 10am Sunday slot becomes available to book 10am on Mondays.

The website my building uses is a rather JS heavy frontend so it's not so easy to just use a bog standard scraping tool or to mock the calls to the backend APIs. [Selenium web driver](https://www.selenium.dev/) to the rescue!🎉 I haven't used selenium in years, but still going strong.

All that's going on is:

1. Login to the web portal
2. Select the correct amenity in this case Tennis Courts.
3. Accept the terms of service
4. Iterate over all the days and times

- originally the bot would message me all the times available.

5. If Sunday at 10am is available attempt to book that.
6. Potentially there are 2 courts to book so you may need to pick one, my preference is for court 2.
7. Make the booking
8. If a booking was made notify the telegram channel with the booking ✅ 🎉

The booking form

![](/media/tennis-booking-confirm.png)

The notification of the booking ☺️

![](/media/tennis-booking-bot.png)

### deployment

So deployment is not super fun because you've to somehow get chrome installed on a headless server which despite all the years since I last used selenium this process is a still a pain. 

I did this a while ago so I perhaps all of these packages are not necessarily required but on debian bookwork you will need to isntall these additional dependencies for the webdriver to work correctly.

```bash
apt install libnss3 libxcb1  xvfb libxi6 libgconf-2-4 scraper libatk libatk1.0-0 libatk-bridge2.0-0 libcups2 libxkbcommon0 libxcomposite1 libxrandr2 libgbm1 libpangox-1.0-0 libcairo2 libasound2 
```

if you want to run the chrome version that was downloaded by the web driver you can by running this commnand


```bash
.cache/selenium/chrome/linux64/117.0.5938.92/chrome --headless --no-sandbox --disable-dev-shm-usage
```

Your path may vary of course.

I use my local crontab to run the script on Mondays between 09:00 and 11:00 just in case the times appear later.

### Script

Example of the script which would need to be tidied up and made more resilient if you want to use it for your application.

```python
from time import sleep
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from datetime import datetime, timezone
import telegram
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service as ChromeService
from zoneinfo import ZoneInfo

CHANNEL_ID = '-YOUR-TELEGRAM-CHANNEL'
# from joblib import Parallel, delayed

options = Options()
# comment out this line to see the process in chrome
options.add_argument("--no-sandbox")
options.add_argument('--headless')
options.add_argument("--disable-dev-shm-usage")
options.add_argument("--remote-debugging-port=9222")
print("OPTIONS", options)

driver = webdriver.Chrome(service=ChromeService(), options=options)

class By:
    """Set of supported locator strategies."""

    ID = "id"
    XPATH = "xpath"
    LINK_TEXT = "link text"
    PARTIAL_LINK_TEXT = "partial link text"
    NAME = "name"
    TAG_NAME = "tag name"
    CLASS_NAME = "class name"
    CSS_SELECTOR = "css selector"

async def fetch_bookings():
    '''
    Try to login and get the amenities list
    '''
    try:
      driver.get("https://your-booking-system")
      driver.implicitly_wait(1)
      # //*[@id="username"]
      username_input = driver.find_element(by=By.XPATH, value='//*[@id="username"]') #driver.find_element_by_xpath('//*[@id="username"]')
      username_input.send_keys("LOGIN")

      password_input = driver.find_element(by=By.XPATH, value='//*[@id="password"]')
      password_input.send_keys("PASSWORD")

      driver.implicitly_wait(0.5)

      login_submit = driver.find_element(by=By.XPATH, value='//*[@id="kc-login"]')
      login_submit.click()

      driver.implicitly_wait(1)

      tennis_button = driver.find_element(by=By.XPATH, value='//*[@id="ResourceTypeId20"]')

      print("tennis_button", tennis_button)
      tennis_button.click()

      print("user_input", username_input)
      # find the accept button
      accept_tos = driver.find_element(by=By.XPATH, value='//*[@id="app"]/div/main/div/form/div[2]/div[2]/div/button')
      telegram_message = telegram.helpers.escape_markdown(text=f'current check {datetime.now(tz=ZoneInfo("America/New_York"))}:',version=2)

      made_booking = False
      DAY_TO_MATCH = "Sunday"
      SLOT_TIME_TO_MATCH = "10:00am"

      if accept_tos:
          accept_tos.click()
          sleep(4)
          driver.save_screenshot('./booking-list.png')

          field_set_bookings_list = driver.find_elements(by=By.XPATH, value='//*[@id="app"]/div/main/div/form/div[3]/div/fieldset')

          sunday_day_element = None
          sunday_7am_slot_time = None

          for f in field_set_bookings_list:
              print("Fieldset => ", f)
              day = f.find_element(by=By.CSS_SELECTOR, value='legend')
              time_options_list = f.find_elements(by=By.CLASS_NAME, value="radio-tiles-option-input-and-label")
              print("Fieldset Day => ", day)
              print("Fieldset Day => ", day.text)
              telegram_message += f"\n*{day.text}*:\n"

              for t in time_options_list:
                  slot_time = t.find_element(by=By.CSS_SELECTOR, value='label')
                  print("Fieldset time => ", slot_time.text)
                  telegram_message += telegram.helpers.escape_markdown(f"- {slot_time.text}\n", 2)
                  if DAY_TO_MATCH in day.text and SLOT_TIME_TO_MATCH in slot_time.text:
                    print("Found Sunday 10am", slot_time)
                    sunday_day_element = day
                    sunday_7am_slot_time = slot_time

          if sunday_day_element and sunday_7am_slot_time:
            sunday_element_text = sunday_day_element.text
            sunday_7am_slot_time_text = sunday_7am_slot_time.text

            sunday_7am_slot_time.click()
            sleep(2)

            # check for the court selector
            try:
              court_one_radio = driver.find_element(by=By.XPATH, value='//*[@for="ResourceId00"]')
            except:
              court_one_radio = None

            try:
              court_two_radio = driver.find_element(by=By.XPATH, value='//*[@for="ResourceId10"]')
            except:
              court_two_radio = None


            # Form section
            sms_reminder_no_radio = driver.find_element(by=By.XPATH, value='//*[@for="IsTextReminder10"]')
            # //label[@for='input_id']
            num_people_two_radio = driver.find_element(by=By.XPATH, value='//*[@for="NumPeople10"]')

            sms_reminder_no_radio.click()
            num_people_two_radio.click()

            if court_two_radio is not None:
                print('Multiple courts found to book...selecting court 2')
                court_two_radio.click()

            submit_button = driver.find_element(by=By.XPATH, value="//button[contains(text(), 'Submit reservation')]")

            driver.save_screenshot('./sunday-8am.png')
            print('Found submit button', submit_button.text)
            print('Making reservation')
            submit_button.click()
            sleep(2)
            driver.save_screenshot('./sunday-8am-after-registration.png')
            made_booking = True

            telegram_message = telegram.helpers.escape_markdown(text=f'current check {datetime.now(tz=ZoneInfo("America/New_York"))}:',version=2)
            telegram_message += f"\n✅🎉🎉Booked **{sunday_element_text}** at {sunday_7am_slot_time_text}"





      print("Would send this telegram message:")
      print(telegram_message)
      return telegram_message, made_booking

    except Exception as e:
        print(e)
        driver.save_screenshot('./error_exit.png')
        return False, False
    finally:
        driver.quit()



def format_markdown_message(text: str) -> str:
    return text.replace("/\-/g", '\\-')

async def try_booking():
    BOT = telegram.Bot(token='YOUR-BOT-TOKEN')
    telegram_message, made_booking = await fetch_bookings()
    formatted_message = telegram_message
    extra_text=telegram.helpers.escape_markdown("*bold* _italic_ `fixed width font` [link](http://google.com)\.")
    print("FORMATTED MESSAGE", formatted_message)
    print("extra_text", extra_text)
    if made_booking == True:
      print('Made booking so will send telegram')
      await BOT.send_message(chat_id=CHANNEL_ID, text=formatted_message, parse_mode=telegram.constants.ParseMode.MARKDOWN_V2)

if __name__ == "__main__":
    import asyncio
    eloop = asyncio.get_event_loop()
    eloop.run_until_complete(try_booking())
```


### References

- [Telegram web bot tutorial](https://core.telegram.org/bots/tutorial)
- [Selenium](https://www.selenium.dev/)
