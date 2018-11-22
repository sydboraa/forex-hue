# Philips Hue Color Changer According to Exchange Rate

This project is about changing the color of Philips Hue lights depending on the exchange rate of TRY to USD increase/decrease.
If the latest rate is bigger or equal than the old one, lights color will be green. If not lights color will be red. 

![](https://media.giphy.com/media/30pxHEYWYJHaX7AbP1/giphy.gif)

I used IFTTT to trigger Philips Hue lights with WebHooks. Cron job triggers my webtask every minute. New rate is received via API call and is stored in context storage.
Webtask compares the difference between rates and sends a request to WebHook with color parameter in IFTTT. 
According to the color parameter lights will change their color to red or green.

//video link

# Requirements

If you need to run this webtask, you need to setup your color changer Applets in IFTTT with Philip Hue service. 

# How to run

> wt cron create --schedule "*/1 * * * *" ./index.js


