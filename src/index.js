import express from "express";
const app = express();

import { join } from "path";
const src = new URL("./", import.meta.url).pathname;

app.use(express.static(join(src, "pages"), {
	index: ["index.html"]
}));

app.get("/favicon.ico", (req, res) => {
	res.set("Content-Type", "image/x-icon");
	res.end();
});

app.get("*", (req, res) => {
	res.sendFile(join(src, "pages", "index.html"));
});

app.listen(5050, () => {
	console.log(`Listening on port 5050`);
});