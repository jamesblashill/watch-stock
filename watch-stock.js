#!/usr/bin/env node
const yahooFinance = require('yahoo-finance');
const notifier = require('node-notifier');

const CHECK_INTERVAL = 60 * 1000;
const symbol = process.argv[2];
const notify_threshold = parseFloat(process.argv[3] || 0.3);

let lastNotifiedPrice = 0;

function checkPrice() {
  yahooFinance.quote({
    symbol: symbol,
    modules: [ 'price' ]
  }, function (err, quotes) {
    if (err) {
      console.error(err);
    } else {
      const message = `${symbol} is at $${quotes.price.regularMarketPrice} ($${quotes.price.regularMarketChange})`;
      console.log(new Date(), message);

      if (Math.abs(lastNotifiedPrice - quotes.price.regularMarketPrice) > notify_threshold) {
        lastNotifiedPrice = quotes.price.regularMarketPrice;
        notifier.notify(message);
      }
    }
    setTimeout(checkPrice, CHECK_INTERVAL);
  });
}

if (symbol) {
  checkPrice();
} else {
  console.error(`
Error: Missing stock symbol
Usage: watch-stock SYMBOL [NOTIFY_THRESHOLD=0.3]
e.g. watch-stock SHOP 0.1
`);
}
