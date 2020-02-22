 
// Make sure you update the following three values. Don't change any other part of the code, unless you know what your're doing.
// Refer to https://github.com/alialavia/ZabivakaBot to learn how to use this code.
var botToken = "639684432:AAGFF-ahVnV6eB9vQLQYby_faEQIN77PMZ4"; 
var ssId = "1LNOnQAfCUiCpcOhEAbbGfTxDm0P_6ILxgZdl4hmTf98";
var webAppUrl = "https://script.google.com/a/iith.ac.in/macros/s/AKfycbyOEYZppS66BYAO-mrw5Vz_CdKpJZGKtyeWsZiL1qeHLKS9jHPj/exec";

var telegramUrl = "https://api.telegram.org/bot" + botToken;

/* REST HELPERS */
function getMe() {
  var url = telegramUrl + "/getMe";
  var response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
}

function setWebhook() {
  var url = telegramUrl + "/setWebhook?url=" + webAppUrl;
  var response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
}

function sendText(id,text) {
  var url = telegramUrl + "/sendMessage?chat_id=" + id + "&text=" + encodeURI(text);
  var response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
}

function doGet(e) {
  return HtmlService.createHtmlOutput("Hey there! Send POST request instead!");
}

/* SHEET HELPER */

// Convert entire sheet to an array
function sheetToArray(sheetName)
{
 var sheet = SpreadsheetApp.openById(ssId).getSheetByName(sheetName);
 try {
   return sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getValues();
 }
 catch (e) {  return [[]]; }
}

function listOfTaxisAvailable()
{
 return sheetToArray("taxiList");
}

function showListOfTaxisAvailable()
{
  var games = listOfTaxisAvailable()
  s = ""
  for (var i in listOfTaxisAvailable())
    s += games[i].join(" ") + '\n';
  return s;
}

function findGame(command) {
  var rows = listOfTaxisAvailable();
  for (i in rows)
  {
    var gameData = rows[i];
    if (gameData[0] == command)
      return { command: gameData[0], team1: gameData[1], team2: gameData[2] };
  }
  return null;
}


/* STATE MACHINE HELPER */
var documentProperties = PropertiesService.getDocumentProperties();
function getState(id)
{
  return documentProperties.getProperty(id);
}

function setState(id, newState)
{
  var strVal = newState == null ? "" : newState;
  documentProperties.setProperty(id, strVal);
  stateUpdated(id, newState);
}

/* MAIN */
function showHelp() {
  return "Send /list to see a list of active games.";
}

function FilteredsheetToArray(sheetName,filterfield,filter)
{
 var sheet = SpreadsheetApp.openById(ssId).getSheetByName(sheetName);
 try {
   return sheet.getRange(2, 1, sheet.getLastRow(), 5).getValues();
 }
 catch (e) {  return [[]]; }
}

/*function showListOfTaxisonSameDate()
{
  var taxi = listOfTaxisAvailable()
  s = ""
  for (var i in listOfTaxisAvailable())
    s += games[i].join(" ") + '\n';
  return s;
}*/

function TaxisonSameDate(date){
  var taxi = FilteredsheettoArray("taxiList","date",date)
  s = ""
  for (var i in FilteredsheettoArray("taxiList","none","none")){
    s += taxi[i].join(" ") + '\n';
  }
  return s;

}

function stateUpdated(id, state) {
  switch (state) {
    case null:
      break;
    case "/help":
      sendText(id, showHelp());
      break;
    case "/list":
      sendText(id, "Hello");
      break;
    case "/register":
      sendText(id,"Enter your date of departure:");
//      Logger.log("123");
      break;
    case "/see":
      sendText(id,"Enter your date of departure:");
      break;
    default:
      // Other states are one of these three forms: /IranMorroco, /IranMorroco,1 , /IranMorroco,1,4
      var stateParts = state.split(",");
      var stateId = stateParts.length;
//      var game = findGame(stateParts[0]);
//      if (game == null) // Bad state => Clear the state and return
//        setState(id, null);
//      else
      sendText(id, "DEBUG:" + state);
      sendText(id, "D2:" + stateParts[0]);
      sendText(id, "D3:" + stateId);
      
      if(stateParts[0] == "/register")
      {
        if(stateId ==1){
          sendText(id, "Enter date of departure like if 25/02/2020 => 2502:");
        }
        else if(stateId ==2){
          sendText(id, showListOfTaxisAvailable());
          sendText(id, "Enter the slot no.");
        }
        else if(stateId ==3){
          SpreadsheetApp.openById(ssId).getSheets()[0].appendRow([new Date(),id, documentProperties.getProperty("name_" + id)].concat(stateParts));
          sendText(id, "Your entry has been registered.");
          setState(id, null);
        }

      }
      else if(stateParts[0] == "/see")
      {
        switch (stateId)
        {
          case 1:
            sendText(id, "Enter date of departure like if 25/02/2020 => 2502:");
            break;
          case 2:
            sendText(id, "Here are the list of available taxis:");
            sendText(id, showListOfTaxisAvailable());
            sendText(id, "qwe");
            break;
          
        }
      }
      
  }
}

function doPost(e) {
  // this is where telegram works
  var data = JSON.parse(e.postData.contents);
  var text = data.message.text;
  var id = data.message.chat.id;
  var name = data.message.chat.first_name + " " + data.message.chat.last_name;
  
  documentProperties.setProperty("name_"+id, name);
  // A command received
  // Every command sets the state
  if (/^\//.test(text))
    setState(id, text);
  else
  {
    // If not a command, just concatenate it to the previous state
    // If previous state is null, it's an invalid input 
    
    var state = getState(id);
    // A non command received without a state is invalid. Do nothing.
    if (state != null)
      setState(id, state + "," + text);  
  }

return HtmlService.createHtmlOutput();

}
