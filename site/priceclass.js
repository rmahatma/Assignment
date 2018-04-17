class Price {
	constructor(obj) {
		if (obj) {
			var priceObj = JSON.parse(obj.body);
			this.name = priceObj.name || null;
			this.bestBid = priceObj.bestBid || null;
			this.bestAsk = priceObj.bestAsk || null;
			this.openBid = priceObj.openBid || null;
			this.openAsk = priceObj.openAsk || null;
			this.lastChangeAsk = priceObj.lastChangeAsk || null;
			this.lastChangeBid = priceObj.lastChangeBid || null;
			this.midPrice = (priceObj.bestBid + priceObj.bestAsk) / 2;
		}
	}
}
module.exports = Price;
