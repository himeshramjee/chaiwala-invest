var userProperties = PropertiesService.getUserProperties();

const API_KEY_DEFAULT_HEADER = "x-api-key"; // "x-no-auth"
const API_KEY = "api.key";

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("IAM Menu")
    .addItem("Set API key", "setKey")
    .addItem("View API key", "getKey")
    .addToUi();

  if (!getKey(true)) {
    ui.alert(
      "Warning",
      "API Key missing. Set via IAM Menu - Set API key.",
      ui.ButtonSet.OK
    );
  }
}

function setKey() {
  var ui = SpreadsheetApp.getUi();
  var scriptValue = ui.prompt("Please provide your API key.", ui.ButtonSet.OK);
  userProperties.setProperty(API_KEY, scriptValue.getResponseText());
}

function getKey(silent = false) {
  var userProperties = PropertiesService.getUserProperties();
  var currentKey = userProperties.getProperty(API_KEY);

  if (!silent) {
    var ui = SpreadsheetApp.getUi();
    ui.alert("Info", "API Key set to:\n" + currentKey, ui.ButtonSet.OK);
  }

  return currentKey;
}
