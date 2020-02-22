  
// Make sure you update the following three values. Don't change any other part of the code, unless you know what your're doing.
// Refer to https://github.com/alialavia/ZabivakaBot to learn how to use this code.
var botToken = "998867708:AAFCGqc1gaR7291pg0wN_7ybee_tYHpmQ_k"; 
var ssId = "10xWFH6s7cOKTXNz0oPpMeYzYNETA9iQZk5VhnkqGnVU";
var webAppUrl = "https://script.google.com/macros/s/AKfycbwE90FV2FW4bw2TCCKFNApLGN6-itP2ITmbYuuTGJ4SicsyEgo/exec";

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
  //sendText(id,"DEBUG:Reading..");
  var taxi = listOfTaxisAvailable();
//  sendText(id,"DEBUG:Reading....");
  s = ""
  for (var i in listOfTaxisAvailable())
    s += taxi[i].join(" ") + '\n';
  return s;
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
  return "Try /see to see all available taxis v2.";
}

//function FilteredsheetToArray(sheetName,filterfield,filter)
//{
// var sheet = SpreadsheetApp.openById(ssId).getSheetByName(sheetName);
// try {
//   return sheet.getRange(2, 1, sheet.getLastRow(), 5).getValues();
// }
// catch (e) {  return [[]]; }
//}



function showListOfTaxisonSameDate(id,date)
{
//  var taxi = listOfTaxisAvailable()
  s = ""
//  sendText(id,"DEBUG:"+date)
//  sendText(id,"DEBUG:This thing")
  var rows = listOfTaxisAvailable();
  
  for (i in rows)
  {
//    sendText(id,"DEBUG:and this thing")
    var TaxiData = rows[i];
//    sendText(id,"DEBUG:"+TaxiData[0])
    if (TaxiData[0] == date && TaxiData[7] == "nyb" )
    {      
//      sendText(id,"DEBUG:Its True")
    s += TaxiData.join(" ") + '\n';
    }
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
      sendText(id,"Enter date of departure like 25thFeb:");
      break;
    default:
      // Other states are one of these forms: /see, /see,25thFeb , /see,1,4
      var stateParts = state.split(",");
      var stateId = stateParts.length;


//      sendText(id, "DEBUG:" + state);
//      sendText(id, "D2:" + stateParts[0]);
//      sendText(id, "D3:" + stateId);
      
      if(stateParts[0] == "/register")
      {
        if(stateId ==1){
          sendText(id, "Enter date of departure like 25thFeb");
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

          case 2:
            var s= showListOfTaxisonSameDate(id,stateParts[1])
//            sendText(id,"DEBUG:" + s);
            if(s != "")
            {  
              sendText(id, "Here are the list of available taxis on the same day:");
              sendText(id, s);
            }
              else
              sendText(id,"No Taxis are available" );
            //sendText(id, "qwe");
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
