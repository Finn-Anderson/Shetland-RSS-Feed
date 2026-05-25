console.log(window.__TAURI__);
const fetch = window.__TAURI__.http.fetch;
const { invoke } = window.__TAURI__.core;

let greetInputEl;
let greetMsgEl;

async function greet() {
	greetMsgEl.textContent = await invoke("greet", { name: greetInputEl.value });

	const response = await fetch("https://news.google.com/rss/search?q=shetland&hl=en-GB&gl=GB&ceid=GB:en", {
		method: "GET",
	})
	.then(response => {
		return response.text()
	})
	.then(html => {
		const parser = new DOMParser()
		const doc = parser.parseFromString(html, "text/html")

		console.log(doc)
	})
	.catch(error => {
		console.error('Failed to fetch page: ', error)
	})
}

window.addEventListener("DOMContentLoaded", () => {
	greetInputEl = document.querySelector("#greet-input");
	greetMsgEl = document.querySelector("#greet-msg");
	document.querySelector("#greet-form").addEventListener("submit", (e) => {
		e.preventDefault();
		greet();
	});
});