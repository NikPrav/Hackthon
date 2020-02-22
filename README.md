# CabShareBot

A bot in Telegram that can ease the cabsharing process, using google sheets as a database

# Getting Started

## Bot Setup
1. Use Telegram @BotFather to create a bot. Note down the token provided to you by the BotFather. You need it later.
2. Define two commands for your bot: /list, /help.

## Spreadsheet setup
1. Create a new spreadsheet in Google Sheets. Name it taxiList

## Code setup
1. From Tools, click on ScriptEditor, and copy the content of [Code.gs](Code.gs) there. 
2. Set the value of botToken to your Bot token. Like so: `var botToken = "AZuhs.....";`
3. Set the value of the ssId to the SSID of your spreadsheet. If you don't know that, go back to your spreadsheet, and take a look into the address bar of the browser. Everything after `d/` and before the next `/` is the SSID. For example, if this is the address you see in the address bar, `https://docs.google.com/spreadsheets/d/16asdfaskldjasidflaskdjflaksdjf56/edit#gid=0`, set the ssId to "16asdfaskldjasidflaskdjflaksdjf56": `var ssId = "16asdfaskldjasidflaskdjflaksdjf56";'.
4. From the *Publish* menu, click on *Deploy as web app...*, and **make sure you have the `Who has access to the app` set as `Anyone, even anonymous`, and `Project version` to `New`**. Keep other settings as they are. Click on Update.
5. Copy the *Current web app URL* and set the *webAppUrl* to it. For example, `var webAppUrl = "https://script.google.com/macros/s/Absadfasdflillk_wedqwerqwef/exec";`.
6. Perform step 4 one more time. Again, **make sure you have the `Who has access to the app` set as `Anyone, even anonymous`, and `Project version` to `New`**.

## Built With
1.Google's app script. 
2.Google Sheet API
## Authors

* **Akhil George Thomas** - [AkhilGeoThom](https://github.com/akhilgeothom)
* **Nikhil P** - [NikhilPraveen](https://github.com/NikhilPraveen)
* **Mukkavalli Bharat Chandra** 

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Ali Alavi [alialavia](https://github.com/alialavia) , for the basic bot - sheet interaction code
