var AppComponents = {
    root: $("#app"),
    contentWrap: $(".content-wrap"),
    introWrap: $(".intro-block"),
    imageBlock: $(".image-block"),
    pageBlock: $(".page-block"),
    sideBar: $(".side-bar"),
    infobox: $(".info-content"),
    editLink: $(".edit-link"),
    wikiLink: $(".wiki-link")
}

const language = localStorage.getItem("lang") || "en"
const wiki = new Wikipedia(language);

var wikiPage = {
    
    getData: function (xtitle) {

        var title;

        window["wiki"] = {
            title: title
        }


        wiki.getSummary(xtitle).then((data) => {

            
            console.log(data);
            var data = data.data;

            AppComponents.introWrap.html(`
                <h1 class="article-title">${data.title}</h1>
                <h6 class="article-abstract two-line">${data.content}</h6>
                <a class="summary-read-more" href="#" readmore="true">Read More <i class="bi bi-chevron-down"></i></a>
            `)

            var readmoreButton = $(".summary-read-more");
            readmoreButton.on("click", function () {

                var status = $(this).attr("readmore"),
                    abstract = $(".article-abstract");

                if (status === "true") {
                    abstract.removeClass("two-line")
                    $(this).attr("readmore", "false").html("Read Less <i class='bi bi-chevron-up'></i>")
                }
                else {
                    abstract.addClass("two-line")
                    $(this).attr("readmore", "true").html("Read More <i class='bi bi-chevron-down'></i>")
                }
            })

            window.wiki = {
                title: data.title,
                abstract: data.abstract
            }

            this.fetchContent(data.title);

            document.title = data.title + " - " + data.abstract + " - Wikifox";

            AppComponents.editLink.attr("href", `https://en.wikipedia.org/w/index.php?title=${data.title}&action=edit`);
            AppComponents.wikiLink.attr("href", `https://en.wikipedia.org/wiki/${data.title}`);
            appUI.setBookMarkState(data.title);
        })

    },

    fetchContent: function (title) {

        wiki.getThumbnail(title).then((data) => {

            if(data.status !== "failed"){
                AppComponents.imageBlock.html(`
                <div class="image-show center">
                    <img class="image-show-img" src="${data.data.image}">
                </div>`)
    
                window.wiki.image = data.data.image;
            }
            
        })

        wiki.getFullContent(title).then((data) => {

            AppComponents.pageBlock.html(`
            <div class="page-content"  data-spy="scroll" data-target=".toc-wrap" >
                ${data.data.content}
            </div>`
            )

            $('#See_also').parent().nextAll('*').remove();
            $('#See_also').remove()

            $('#References').parent().remove()
            $('#External_links').parent().remove()

            this.generateTOC()
        })

        wiki.getInfoBox(title).then((data) => {

            if(data.status !== "failed"){
                
                AppComponents.infobox.append(data.content)  

                if(data.content === undefined){
                    AppComponents.infobox.remove()
                    appUI.Elements.infoboxOpen.remove()
                }

                appUI.infoboxFix() 
            }
            else{
                AppComponents.infobox.remove()
            }

        })

        appUI.hideLoader();
    },

    generateTOC: function () {
        var pageContent = $(".page-content");
        var headings = pageContent.find("h2, h3");

        var html = "";

        $('span').each(function () { // For each element
            if ($(this).text().trim() === '')
                $(this).remove(); // if it is empty, it removes it
        });

        for (let i = 0; i < headings.length; i++) {

            var text = $(headings[i]).find("span"),
                title = text.html(),
                href = text.attr("id"),
                level = text.parent().prop("tagName");

            if (title !== undefined && title !== "") {
                html += `
                <${level} class="toc-item toc-item-level-${parseInt(level.substr(1)) - 1} one-line">
                    <a class="toc-a one-line" href="#${href}">
                     ${title}
                    </a>                        
                </${level}>
                    
                `
            }
        }

        $(".toc-wrap").append(`
            ${html}
        `)
        groupList();


        function groupList() {
            var levelOne = $(".toc-item-level-1");

            for (let i = 0; i < levelOne.length; i++) {
                var item = $(levelOne[i]),
                    itemText = safeCss(item.find("a").text().trim())

                item.nextUntil("h2").wrapAll(`<div class="toc-sub-item-wrap item-box-${itemText}"><div class="sub-toc-wrap"></div></div>`)
                item.prependTo(`.item-box-${itemText}`).addClass("toc-top")
            }

        }
        $(".toc-wrap a").click(function () {
            appUI.OverlayHide();
        })

    },
    getPDFfile(){
        window.open("https://en.wikipedia.org/api/rest_v1/page/pdf/" + window.wiki.title)
        appUI.OverlayHide();
    }
}

function safeCss(str) {
    return str.replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '').replace(/ /g, '-');
}

ShareThis({
    sharers: [ ShareThisViaTwitter, ShareThisViaReddit, ShareThisViaSpeakers, ShareThisViaFacebook, ShareThisViaEmail],
    selector: ".content-wrap",
    popoverClass: "action-hide share-this-popover"
}).init();

const search = pSearch = window.location.search;
const urlParams = new URLSearchParams(search);
const sQ = {
    article : urlParams.get('article'),
    a : urlParams.get('a'),
    w : urlParams.get('w'),
    wiki : urlParams.get('wiki'),
    cs: urlParams.get('cs'),
}

var title = sQ.article || sQ.a || sQ.w || sQ.wiki || search.substr(1) || "wikipedia"
wikiPage.getData(title)


if(sQ.cs === "dark"){
    $("#themefile").attr("href", "css/themes/dark.css")
}