const language = localStorage.getItem("lang") || "en"
const wiki = new Wikipedia(language);

var AppComponents = {
    SuggessionWrap: $(".index-sug-wrap"),
    SearchBar: $(".search-index-input"),
    RandomOpen: $(".random-open"),
    LangList: $(".lang-list"),
    themeList: $(".theme-list"),
    cssFileInputWrap: $(".custom-css-wrap"),
    cssFileInput: $(".css-file-ext"),
    optionOverlay: $(".options-overlay"),
    optionButton: $(".options-btn"),
    bookMarkList: $(".bookmarks-list"),
    bookMarksOpen: $(".bookmarks-btn"),
    bookmarksOverlay: $(".bookmarks-overlay"),
    githubBBtutton: $(".go-to-bottom-btn")
}
const Search = {

    renderSearchSugs: function (data) {

        var resultDataArr = Object.values(data.data.results);

        const sugs = Object.values(resultDataArr).map((item, index) => `

            <div class="sug-item v-center wikilink" wikititle="${item.title}">
                <div class="sug-item-text">
                    <h1>${item.title}</h1>
                    <p class="two-line">${item.snippet}</p>
                </div>
                <div class="sug-item-img v-center">
                    <img class="image-${safeCss(item.title)}" alt="${item.title}">
                </div>
            </div>

        `)

        $(".index-sug-wrap").show();
        AppComponents.githubBBtutton.hide();
        AppComponents.SuggessionWrap.html(`${sugs.join('')}`);


        $(".wikilink").on("click", function () {
            var x = $(this).attr("wikititle");
            window.location.href = "wiki.html?" + x;
        });

        $(document).on('click', function (e) {
            if ($(e.target).closest(".action-x").length === 0) {
                $(".index-sug-wrap").hide();
            }
        });
    },

    blurSearchBar: function () {
        $(".index-sug-wrap").hide()
        AppComponents.SuggessionWrap.html(``);
        AppComponents.SearchBar.val(``);
        AppComponents.SearchBar.blur(``);
        AppComponents.githubBBtutton.show();
    }
}

const commonFuctions = {
    randomArticleOpen: function () {
        wiki.getRandomArticle().then(data => {
        var title = data.data.title
        window.location.href = "wiki.html?" + title;
        })
    }
}

const Options = {
    loadWikiList: function(){

        var url = "src/assets/resources/wikilist.json"

        fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {

            const list = Object.values(json).map(item => `
                <option value="${item.code}">${item.title} ( ${item.name} )</option>
            `)
            AppComponents.LangList.html(list.join(" "))

            var language = localStorage.getItem("lang");
            
            try {
                document.querySelector(`.lang-list option[value="${language}"]`).selected = true
            } catch (error) {}
        })

        this.setBookmarksList();
    },

    setBookmarksList: function(){

        var x = JSON.parse(localStorage.getItem("bookmarks")) || false

        if(x.length !== 0){
            AppComponents.bookMarkList.html("")
            for (let i = 0; i < x.length; i ++){
                var title = x[i]
                AppComponents.bookMarkList.append(
                    `
                    <a href="wiki.html?a=${title}">
                        <div class="bookmarks-item v-center">
                            <h4>${title}</h4>
                        </div>
                    </a>
                    `
                )
            }
        }
        else{
            AppComponents.bookMarkList.html(`
                <div class="bookmarnk-404">
                    <img src="src/assets/images/not-found.png">
                </div>
            `)
        }
        
    }
}

AppComponents.SearchBar.on("input", function () {

    var x = $(this).val();
    $(".index-search-bar").addClass("index-search-bar-active");


    try {  
        document.title = "Search Results for \"" + x +"\" - Wikifox"
        wiki.searchArticles(x).then((data) => {

            Search.renderSearchSugs(data);
    
            var resultDataArr = Object.values(data.data.results);

            for (let i = 0; i < resultDataArr.length; i++) {
                var title = resultDataArr[i].title,
                    elem = $(`.image-${safeCss(title)}`);
    
                setImage(elem, title)
            }
    
            function setImage(elem, title) {
                wiki.getThumbnail(title, 100).then((idata) => {
    
                    if (idata.data.image !== undefined) {
                        elem.attr("src", idata.data.image);
                        elem.css("display", "block");
                    }
    
                })
    
            }
        })

    } catch (error) {
        Search.blurSearchBar()
    }
});

function safeCss(str) {
    return str.replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '').replace(/ /g, '-');
}

$(document).keydown(function (e) {
    if (e.which === 27) {
        Search.blurSearchBar();
    }
});


AppComponents.RandomOpen.on("click", commonFuctions.randomArticleOpen)

AppComponents.bookMarksOpen.on("click", function(){
    AppComponents.bookmarksOverlay.fadeIn().css("display", "flex")
})

AppComponents.optionButton.on("click", function(){
    AppComponents.optionOverlay.fadeIn().css("display", "flex")
})

AppComponents.themeList.on("change", (t)=> {
    var theme = $(t.target).val();

    if (theme === "dark" || theme === "light" || theme === "auto"){
        localStorage.setItem("cs", theme)
        AppComponents.cssFileInputWrap.hide()
    }
    else{
        AppComponents.cssFileInputWrap.show()
    }

    AppComponents.cssFileInput.on("input", function(t){
        var val = $(t.target).val()
        localStorage.setItem("cs", val)
        Theme.setTheme()
        
    })

    Theme.setTheme()
})

AppComponents.LangList.on("change", (t)=> {
    var lang = $(t.target).val();
    localStorage.setItem("lang", lang)
})

$(window).on("navigate", function (event, data) {
    var direction = data.state.direction;
    if (direction == 'back') {
      Search.blurSearchBar()
    }
});

Options.loadWikiList()

const search = pSearch = window.location.search;
const urlParams = new URLSearchParams(search);
var searchq = urlParams.get('search')

if(searchq){
    AppComponents.SearchBar.val(searchq)
    AppComponents.SearchBar.trigger("input")
}