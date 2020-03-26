async function loadWiki(article = "tree") {
    var storedArticle=localStorage.getItem(article);
    if(storedArticle){
        return storedArticle;
    }
    if (navigator.onLine) {


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
            var text=json.parse.text["*"];
            localStorage.setItem(article,text);
            return text;
        } catch (e) {
            console.error(e);
            return "<h1> Inhalt nicht verfügbar...</h1>";
        }
    }else{
        return "<h1> Inhalt nicht verfügbar...</h1>";
    }
}