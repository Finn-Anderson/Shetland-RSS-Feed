window.addEventListener("DOMContentLoaded", () => {
	var path = window.location.pathname;
	console.log(path);
	var page = path.split("/").pop();
	console.log( page );
});