
'use strict';
/**
 * This javascript file will constitute the entry point of your solution.
 *
 * Edit it as you need.  It currently contains things that you might find helpful to get started.
 */

/**This is not really required, but means that changes to index.html will cause a reload.*/
require('./site/index.html');

/**Apply the styles in style.css to the page. */
require('./site/style.css');

/**- load the ES6.js file */
require('./es6/Es6');

/**get price class */
var Price = require('./site/priceclass');

(function () {
	/** try catch method to handle error  */
	try {
		/** constant url to get bid price  */
		const getBidPriceUrl = "/fx/prices";
		/**constant url for Initializing stomp client */
		const url = "ws://localhost:8011/stomp";
		/**Initialized client */
		const client = Stomp.client(url);
		/**graph object to show sparkling graph */
		var graph = {};
		/**Price array object to bind subscribe response and to render table  */
		let priceArr = [];

		client.connect({}, getBidPrice, function (error) {
			alert(error.headers.message)
		});

		/** Call back function when client connect */
		function serviceCall(url, callBackFunction, errorFunction) {
			const subscription = client.subscribe(url, callBackFunction, {});
		};
		/** function to get Best bid price */
		function getBidPrice() {
			serviceCall(getBidPriceUrl, sortPriceTable, thowError);
		};

		/**sort the table based on last changed bid price */
		function sortPriceTable(data) {
			if (data) {
				var priceObj = new Price(data);
				var index = priceArr.findIndex(x => x.name == priceObj.name);

				if (index >= 0) {
					priceArr[index] = priceObj;
					graph[priceObj.name].push(priceObj.midPrice);
				} else {
					priceArr.push(priceObj);
					graph[priceObj.name] = [];
				}
				var newArr = priceArr.sort((a, b) => b.lastChangeBid - a.lastChangeBid);
				renderTableRow(newArr);
			}
		};
		/** render the table based on new sorted array */
		function renderTableRow(newArr) {
			var tableRef = document.getElementById('myTable').getElementsByTagName('tbody')[0];
			tableRef.innerHTML = "";
			for (var x = 0; x < newArr.length; x++) {
				var row = tableRef.insertRow(0);
				var index = 0;
				var length = Object.keys(newArr[x]).length - 1;
				for (var prop in newArr[x]) {
					var cell = row.insertCell(index);
					if (length == index) {
						var sparkline = new Sparkline(cell);
						sparkline.draw(graph[newArr[x]["name"]]);
					} else {
						cell.innerHTML = newArr[x][prop];
					}
					index++;
				}
			}

		};
		/** set 30 sec time to remove old mid price */
		setInterval(function () {
			for (var prop in graph) {
				graph[prop].shift();
			}
		}, 30000);
		/** throw error which is been catched to show alert message */
		function thowError(err) {
			client.unsubscribe();
			throw (err);
		};

	}
	/**catch error and show alert with error message */
	catch (e) {
		alert(e);
	}
}());