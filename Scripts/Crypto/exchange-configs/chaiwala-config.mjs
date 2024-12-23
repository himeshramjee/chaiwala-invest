const chaiwalaProviderAPIConfig = {
  providerShortCode: "CHAI",
  docs: "(no docs available)",
  url: "https://api.himesh.ramjee.co.za/",
  pathCoinBalance: "{provider}/balance",
  apiAuthHeaderName: "x-api-key",
  apiKey: "Mz7J7zfH7N4SeEjYS63NN9cGmjm9FXHl3JdHBgKA",
};

function getAPIEndpointForCoinsBalance(providerShortCode) {
  const providerData = dataProviders.find((p) => {
    if (p.shortCode === providerShortCode) {
      return p;
    }
  });

  if (!providerData) {
    throw new Error("Failed to locate provider data.");
  }

  return (
    chaiwalaProviderAPIConfig.url +
    chaiwalaProviderAPIConfig.pathCoinBalance.replace(
      "{provider}",
      providerData.apiRootPath
    )
  );
}

function getAPIEndpointForCoinsBalanceTest() {
  Logger.log(getAPIEndpointForCoinsBalance("BYB"));
}

function extractAllCoinsBalanceResult(response) {
  const payload = JSON.parse(response.getContentText());
  console.log(payload?.result);
  return payload?.result?.balance;
}

// export default chaiwalaProviderAPIConfig;