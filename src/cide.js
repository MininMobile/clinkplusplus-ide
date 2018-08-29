const application = { name: "CIDE" }; // replace with require("./lib/application") soon pls

const components = {
	title: document.getElementById("title")
};

setTitle(`Welcome - ${application.name}`);

function setTitle(title) {
	document.title = title;
	components.title.innerText = title;
}
