
async function loadWiki(article = "tree") {
    const url = "https://en.wikipedia.org/w/api.php?" +
        new URLSearchParams({
            origin: "*",
            action: "parse",
            page: article,
            format: "json",
        });

    try {
        const req = await fetch(url);
        const json = await req.json();
        return json.parse.text["*"];
    } catch (e) {
        console.error(e);
    }
}