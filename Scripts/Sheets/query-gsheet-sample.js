const {google} = require("google-auth-library");
const {Sheets} = require("google-sheets");

class CryptoReport {
  constructor() {
    this.auth = null;
    this.reportData = [];
    this.sheetId = "YOUR_GOOGLE_SHEET_ID";
  }

  run() {
    this.auth();
    this.getTokenomics(this.sheetId);
    this.populateReport();
  }

  async auth() {
    this.auth = await google.auth.getClient({
      scopes: ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/spreadsheets.readonly"],
      client_id: "YOUR_CLIENT_ID",
      client_secret: "YOUR_CLIENT_SECRET"
    });
  }

  async getTokenomics(spreadsheetId) {
    const sheets = new Sheets({auth: this.auth});
    return new Promise((resolve, reject) => {
      const results = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "TOKENOMICS_DATA_RANGE_IN_SHEET"
      }).then(data => {
        // Modify and filter data here
        // ...

        return data.values.map(row => {
          return {
            // List of properties you want to include in the report
            token_name,
            total_supply,
            circulating_supply,
            market_cap,
            volume,
            todayHigh,
            todayLow,
            todayChange,
            weekHigh,
            weekValue
          }
        })
      });
    });
  }
}