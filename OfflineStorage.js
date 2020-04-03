/**
 * @callback articleStore
 * @param {string} articleName - name of article to store
 * @param {string} language - language namespace to use
 * @returns {boolean} if operation was successful
 */


/**
 * @callback articleLoad
* @param {string} articleName - name of article to load
* @param {string} language - language namespace to load
* @returns {string} article
 */

/**@type {articleStore} */
var setWiki = null;
/**@type {articleLoad} */
var articleLoad = null


/**@type {articleStore} */
function storeArticleInFiles(articleName, language) {

}
/**@class OfflineStorage
 */
class OfflineStorage {
    constructor() { }
    /**
     * stores an article offline
     * @param {string} name 
     * @param {string} language 
     * @returns {Promise<void>} if storage was successful
     */
    storeArticle(name, language, content) { return null; }
    /**
     * loads an offline article
     * @param {string} name 
     * @param {string} language 
     * @param {string} content -content to write
     * @returns {Promise<string>} Promise to article or null if unsucessful
     */
    loadArticle(name, language) { return null; }
    isReady() {
        return false;
    }
    /**
     * @returns {Promise<void>}
     */
    getReadyPromise() {
        return null
    }
}
class FileSystemOfflineStorage extends OfflineStorage {
    constructor() {
        super();
        this.filesystem = null;
        // Handle vendor prefixes.
        window.requestFileSystem = window.requestFileSystem ||
            window.webkitRequestFileSystem;

        // Check for support.
        if (window.requestFileSystem) {
            // FileSystem Supported
        } else {
            // FileSystem Not Supported
        }
        navigator.webkitPersistentStorage.requestQuota(
            1024 * 1024 * 10,
            function (grantedSize) {

                // Request a file system with the new size.
                window.requestFileSystem(window.PERSISTENT, grantedSize, function (filesystem) {

                    // Do something with your new (larger) filesystem
                    this.filesystem = filesystem;
                }.bind(this));

            }.bind(this));
    }
}
class IndexedDbOfflineStorage extends OfflineStorage {
    constructor() {
        super();
        /**@type {IDBDatabase} */
        this.db = null;
        /**@type {IDBObjectStore} */
        this.store = null;
        var request = window.indexedDB.open("wiki", 2);
        this.readyPromise = new Promise(function (resolve, reject) {
            request.onerror = e => {
                console.log(e);
                reject();
            }
            request.onsuccess = function (event) {
                this.db = event.target.result;
                resolve();
            }.bind(this);
        }.bind(this)
        )
        request.onupgradeneeded = function (event) {
            /**@type {IDBDatabase} */
            var db = event.target.result;
            if(!db.objectStoreNames.contains("articles"));
            var objectStore = db.createObjectStore("articles", { keyPath: "title" })
            this.store = objectStore;
            objectStore.createIndex("by_content", "content", { unique: true });
            objectStore.put({ title: "example", content: "hi" })
        }
    }
    storeArticle(name, language, content) {
        var tx = this.db.transaction("articles", "readwrite");
        var store = tx.objectStore("articles");
        var transac = store.put({ title: language + name, content: content });
        return new Promise((res, rej) => {
            transac.onsuccess = ev =>
                res()
            transac.onerror = ev => rej()
        }
        )
    }
    loadArticle(name, language) {
        var tx = this.db.transaction("articles", "readwrite");
        var store = tx.objectStore("articles");
        var transac = store.get(language + name)
        return new Promise((res, rej) => {
            transac.onsuccess = ev => {
                if (transac.result) {
                    res(transac.result.content)
                } else {
                    res(null);
                }
            }
            transac.onerror = ev =>
                rej()
        }
        )
    }
    isReady() {
        return this.db != null;
    }
    getReadyPromise() {
        return this.readyPromise;
    }
}

class LocalOfflineStorage extends OfflineStorage{
    constructor(){
        super();
    }
    isReady(){return true;}
    getReadyPromise(){
        return new Promise((res,rej)=>res());
    }
    storeArticle(name, language, content) {
        return new Promise((res,rej)=>{
            localStorage.setItem(language+name,content);
            res();
        })
    }
    loadArticle(name, language) {
        return new Promise((res,rej)=>{
            res(localStorage.getItem(language+name));
        })
    }
}
/**@type {OfflineStorage} */
var offlineStorage;
function setupOfflineStorage() {
    //var fs = new FileSystemOfflineStorage();
    if (window.indexedDB) {
        offlineStorage = new IndexedDbOfflineStorage();
    }else if(window.localStorage){
        offlineStorage=new LocalOfflineStorage();
    }
}