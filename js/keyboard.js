const keyPairs = {
    keys :{
        "b": {
            selector: '[class="option-icon bookmark-btn"]',
            description: "Bookmark article",
            key: "b"
        },
        "d":{
            selector:  ".download-button",
            description: "Download the article",
            key: "d"
        },
        "e": {
            selector: ".edit-link",
            description: "Edit page on Wikipedia",
            key: "e"
        },
        "h": {
            selector: ".goHomeBtn",
            description: "Open home in new tab",
            key: "h"
        },
        "p": {
            selector: ".download-button",
            description: "Download the article",
            key: "p"
        },
        "s": {
            selector: ".share-go-btn",
            description: "Share articles",
            key: "s"
        },
        "q": {
            selector: ".quick-jump-btn",
            description: "Quick Jump",
            key: "q"
        },
        "w": {
            selector: ".wiki-link",
            description: "Open in Wikipedia",
            key: "w"
        },
        "k": {
            selector: ".keyboard-btn",
            description: "Keyboard Shortcuts",
            key: "k"
        },
        "esc": {
            selector: "",
            description: "Close pop-ups",
            key: "esc"
        },
    },
    links: ["e", "w", "h"]
}


$(document).ready(function() {

    var listenKeys = Object.keys(keyPairs.keys).join(",")
    hotkeys(listenKeys, function (event, handler){

        if(keyPairs.links.includes(handler.key)){
            var inputFocused = $("input[type=text]").is(":focus");

            if(!inputFocused){
                var link = $(keyPairs.keys[handler.key].selector).attr("href")
                if(link){
                    window.open(link)
                }
            }

            return; 
        }

        $(keyPairs.keys[handler.key].selector).trigger("click");
    });

    var shortCutItems = Object.values(keyPairs.keys).map(item => `
        <tr class="keyboard-shortcut-item">
            <td>
                <code class="key-code center">
                    ${item.key}
                </code>
            </td>
            <td>
                <h6 class="key-title">${item.description}</h6>
            </td>
        </tr>
    `)

    $(".short-cuts-table").html(shortCutItems.join(""))
});

$(".keyboard-btn").click(function(){
    $(".keyboard-overlay").fadeIn().css("display","flex");
})
