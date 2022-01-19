class ZondaApi {
	authorize(apiKey, apiSecret) {
		this.apiKey = apiKey;
		this.apiSecret = apiSecret;
	}

	/**
	 * @link https://docs.zonda.exchange/v1.0.3-en/reference/transactions-history
	 */
	getTransactionsHistory(params = {}) {
		if('markets' in params && params.markets === "string")
			params.markets = [params.markets];

		return this._call("trading/history/transactions", params);
	}

	getExchangeRate(currencyA, currencyB) {
		var responseJson = this._call("trading/ticker/"+currencyA+"-"+currencyB)

		const rate = responseJson.ticker.rate;

		return rate;
	}

	/**
	 * @link https://docs.zonda.exchange/v1.0.3-en/reference/list-of-wallets
	 */
	getBalancesList() {
		return this._call("balances/BITBAY/balance");
	}

	/**
	 * @link https://docs.zonda.exchange/v1.0.3-en/reference/candles-chart
	 */
	getCandlesHistory(currencyA, currencyB, resolution, from, to) {
		return this._call(`trading/candle/history/${currencyA}-${currencyB}/${resolution}?from=${from}&to=${to}`);
	}


	getMarketStats(currencyA, currencyB) {
		return this._call("trading/stats/"+currencyA+"-"+currencyB);
	}

	_call(url, data = {}, method = 'get') {
		const headers = this._getRequestHeaders();
		const hasData = Object.keys(data).length;
		let payload = '';

		if(method === "get" && hasData)
			url += '?query='+encodeURIComponent(JSON.stringify(data));
		else if(hasData)
			payload = JSON.stringify(data);

		return JSON.parse(
			UrlFetchApp.fetch("https://api.zonda.exchange/rest/"+url, {
				method,
				headers,
				payload,
			}).getContentText()
		);
	}

	_getRequestHeaders(body = '') {
		let timestamp = Math.floor(Date.now() / 1000).toString();

		if(this.apiKey && this.apiSecret)
			return {
					'API-Key': this.apiKey,
					'API-Hash': this._getHash(this.apiKey, timestamp, this.apiSecret, body),
					'operation-id': Utilities.getUuid(),
					'Request-Timestamp': timestamp,
					'Content-Type': 'application/json'
			};
		else
			return {
					'Request-Timestamp': timestamp,
					'Content-Type': 'application/json'
			};
	}

	_getHash(apiKey, timestamp, apiSecret, body) {
			return JsSha512.sha512.hmac(apiSecret, apiKey + timestamp + (body ? JSON.stringify(body) : ''));
	}
}

const bitbayInstance = create();

function get() {
	return bitbayInstance;
}

function create() {
	return new ZondaApi();
}