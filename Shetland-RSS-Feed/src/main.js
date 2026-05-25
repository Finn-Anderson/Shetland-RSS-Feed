const fetch = window.__TAURI__.http.fetch;
const opener = window.__TAURI__.opener.openUrl;

let dataContainer;
let refreshBtn;

async function getFeed() {
	refreshBtn.disabled = true;

	const response = await fetch("https://news.google.com/rss/search?q=shetland%20when%3A7d&hl=en-GB&gl=GB&ceid=GB%3Aen", {
		method: "GET",
	})
	.then(response => {
		return response.text();
	})
	.then(html => {
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, "text/html");
		dataContainer.innerHTML = "";

		var items = doc.getElementsByTagName("item");
		var sortedItems = [];
		for (const item of doc.getElementsByTagName("item")) {
			var count = 0;

			for (const sorted of sortedItems) {
				const currentDate = Date.parse(sorted.querySelector("pubdate").innerHTML);
				const newDate = Date.parse(item.querySelector("pubdate").innerHTML);

				if (currentDate < newDate)
					break;

				count++;
			}

			if (count == sortedItems.Length)
				sortedItems.push(item);
			else
				sortedItems.splice(count, 0, item);
		}

		for (const item of sortedItems) {
			var a = document.createElement("a");
			a.href = item.childNodes[2].data;

			var title = document.createElement("h3");
			title.innerHTML = item.querySelector("title").innerHTML.split(" - ")[0];
			a.appendChild(title);

			var div = document.createElement("div");
			a.appendChild(div);

			var date = document.createElement("p");
			date.innerHTML = item.querySelector("pubdate").innerHTML;
			div.appendChild(date);

			var dash = document.createElement("p");
			dash.innerHTML = "-";
			div.appendChild(dash);

			var date = document.createElement("p");
			date.innerHTML = item.childNodes[7].data;
			div.appendChild(date);

			dataContainer.appendChild(a);

			//var img = document.createElement("img");
			//dataContainer.appendChild(img);
			//setImage(img, item.getElementsByTagName("source")[0].getAttribute("url"));
		}

		refreshBtn.disabled = false;
	})
	.catch(error => {
		dataContainer.innerHTML = "Failed to fetch feed";
	})
}

async function setImage(Image, url) {
	const response = await fetch(url, {
		method: "GET",
	})
	.then(response => {
		return response.text();
	})
	.then(html => {
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, "text/html");

		// TODO: GET ARTICLE IMAGE IF AVAILABLE
	})
}

window.addEventListener("DOMContentLoaded", () => {
	dataContainer = document.querySelector("#data");
	refreshBtn = document.querySelector("#refresh-btn");

	refreshBtn.addEventListener("click", (e) => {
		getFeed();
	});

	document.addEventListener("click", e => {
		e.preventDefault();
		var link = e.target.closest("a");
		
		if (link != null)
			opener(link.href);
	});

	getFeed();
});

// npm run tauri dev