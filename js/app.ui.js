const appUI = {

    Elements: {
        searchInput: $('.jump-search-bar-input'),
        QuickSearch: $('.quick-jump-overlay'),
        QuickSearchPreview: $('.search-info-pv'),
        QuickSearchTOC: $('.toc-wrap'),
        QuickJumpBtn: $('.quick-jump-btn'),
        downloadGo: $(".download-go-button"),
        downloadOverlay: $(".download-overlay"),
        downloadButton: $(".download-pop"),
        contentHeader: $(".content-header"),
        searchSugWrap: $(".search-sug-wrap"),
        articelSearchInput: $(".search-input-art"),
        contentWrap: $(".content-wrap"),
        bookMarkBtn: $(".bookmark-btn"),
        shareGoBtn: $(".share-go-btn"),
        shareOverlay: $(".overlay-share"),
        infoboxOpen: $(".infobox-open"),
        infoboxClose: $(".infobox-close"),
        menuOpen: $(".menu-open"),
        menuNavig: $(".header-navig-wrap")
    },

    OverlayHide: function () {
        $('.action-hide').fadeOut();
    },

    hideLoader: function(){
        $(".loading-overlay").fadeOut();
    },

    QuickSearch: function () {
        this.Elements.QuickSearch.fadeIn(200).css('display', 'flex');
        this.Elements.QuickSearchPreview.show();
        this.Elements.QuickSearchTOC.hide();
    },

    DownloadPopup: function () {
        appUI.Elements.downloadOverlay.fadeIn().css('display', 'flex');
    },

    infoboxFix: function () {


        var removeItems = [
            $($(".infobox-image")[1]).parent(),
            //$(".reference").parent().parent(),
            $(".sidebar-title-with-pretitle").parent(),
            $(".sidebar-pretitle").parent(),
            $(".navbar-mini").parent().parent(),
            $(".infobox-subheader").parent(),
        ]

        for (let i = 0; i < removeItems.length; i++) {
            $(removeItems[i]).remove();
        }

        $("tbody * , page-content *").removeAttr("style")

        var barRight = $('.bar-right');

        if (!barRight.html().trim()) {
            barRight.remove();
        }


        $('tbody td').each(function () {
            if ($(this).text().trim() === '')
                $(this).parent().remove();

            $('tbody').each(function () {
                if ($(this).text().trim() === '')
                    $(this).parent().remove();
            })
        });

        $(".info-content tr:empty").remove();

        $("tbody a").click(function () {

            var href = $(this).attr("href");

            if (href.startsWith("/wiki")) {

                var articleTitle = href.split("/");
                $(this).attr("href", "?wiki=" + articleTitle[articleTitle.length - 1]);
            }

        });

        setTimeout(function () {
            links = barRight.find('a');

            links.each(function () {
                var href = $(this).attr("href");

                if (href.startsWith("/wiki") ) {
                    var articleTitle = href.split("/");
                    $(this).attr("href", "?wiki=" + articleTitle[articleTitle.length - 1]);
                }
            })
        }, 1000);

    },

    searchSuggessionRender: function (data) {

        var resultDataArr = Object.values(data.data.results);

        const sugs = Object.values(resultDataArr).map((item, index) => `

            <div class="search-item v-center wikilink" wikititle="${item.title}">
                <div class="search-info">
                    <h1>${item.title}</h1>
                    <h6 class="two-line">${item.snippet}</h6>
                </div>
                <div class="search-image">
                    <img class="image-${safeCss(item.title)}" src="${item.image}" alt="${item.title}">
                </div>
            </div>

        `)

        this.Elements.searchSugWrap.html(`<div class="search-suggessions action-hide">${sugs.join('')}</div>`);


        $(".wikilink").on("click", function () {
            var x = $(this).attr("wikititle");
            window.location.href = "?wiki=" + x;
        });
    },

    bookMarkArticle: function (title) {
        var bookMark = localStorage.getItem("bookmarks") || JSON.stringify([])
        var ParsedbookMark = JSON.parse(bookMark);

        if(ParsedbookMark.includes(title)){
            ParsedbookMark.splice(ParsedbookMark.indexOf(title), 1);
        }
        else{
            ParsedbookMark.push(title);       
        }

        localStorage.setItem("bookmarks", JSON.stringify(ParsedbookMark));
        this.setBookMarkState(title);
    },

    setBookMarkState: function (title) {
        var bookMark = localStorage.getItem("bookmarks") || JSON.stringify([]);
        var ParsedbookMark = JSON.parse(bookMark);


        var bookMarkBtn = this.Elements.bookMarkBtn;

        if(ParsedbookMark.includes(title)){
            
            window.wiki.bookMarkArticle = true;
            bookMarkBtn.find("i").removeClass("bi-heart").addClass("bi-heart-fill");
            bookMarkBtn.attr("title", "Remove from Bookmarks");

        }
        else{
            window.wiki.bookMarkArticle = false;
            bookMarkBtn.find("i").removeClass("bi-heart-fill").addClass("bi-heart");
            bookMarkBtn.attr("title", "Add to Bookmarks");
        }
    },

    menuToggle: function () {

        var menuBtn = appUI.Elements.menuOpen,  menuStatus = menuBtn.attr("open_s"), menuNavig = appUI.Elements.menuNavig, logotext = $(".logo-text");

        if(menuStatus === "true"){

            logotext.fadeIn();
            menuBtn.attr("open_s", "false");
            menuNavig.fadeOut();
            menuBtn.find("i").removeClass("bi-x").addClass("bi-list");            
            
        }
        else{

            logotext.fadeOut()
            menuBtn.attr("open_s", "true");
            menuNavig.fadeIn().css("display", "flex");
            menuBtn.find("i").removeClass("bi-list").addClass("bi-x");
            
        }
    },

}

appUI.Elements.searchInput.on("input", (thisx) => {

    appUI.Elements.QuickSearchPreview.hide();
    appUI.Elements.QuickSearchTOC.show();

    var val = $(thisx.target).val();
    $(".toc-wrap h3, .toc-wrap h2").each(function () {
        $(this).toggle($(this).text().toLowerCase().includes(val));
    });
});

$(document).keydown(function (e) {
    if (e.which === 81 && e.ctrlKey) {
        appUI.QuickSearch()
    }
    else if (e.which === 27) {
        appUI.OverlayHide();
    }
});

appUI.Elements.downloadGo.on("click", function () {
    wikiPage.getPDFfile()
})

appUI.Elements.downloadButton.on("click",appUI.DownloadPopup )

appUI.Elements.contentWrap.scroll(function () {

    var x = $(".info-content")
    appUI.OverlayHide();
    var width = document.body.clientWidth;

    if (width > 940) {
        if ($(this).scrollTop() > 30) {
            appUI.Elements.contentHeader.fadeIn().css('display', 'flex');
            x.addClass("pa-t-70")
        } else {
            appUI.Elements.contentHeader.fadeOut();
            x.removeClass("pa-t-70")
        }
    }

    var winScroll = $(this).scrollTop()
    var height = $(this).prop('scrollHeight') - $(this).prop('clientHeight')
    var scrolled = (winScroll / height) * 100;

    $(".scroll-thumb").css("min-width", scrolled + "%");

});

appUI.Elements.articelSearchInput.on("input", function () {
    var x = $(this).val();
    wiki.searchArticles(x).then((data) => {

        appUI.searchSuggessionRender(data);

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
                    elem.parent().css("display", "block");
                }

            })

        }
    })
});

appUI.Elements.QuickJumpBtn.on("click", function () {
    appUI.QuickSearch()
})

$(document).on('click', function (e) {
    if ($(e.target).closest(".action-x").length === 0) {
        $(".action-hide").hide();
    }
});

appUI.Elements.bookMarkBtn.on("click", function () {
    appUI.bookMarkArticle(window.wiki.title);
})

appUI.Elements.shareGoBtn.on("click", function () {
    appUI.Elements.shareOverlay.fadeIn().css("display", "flex");
})

appUI.Elements.infoboxOpen.on("click", function () {
    AppComponents.infobox.fadeIn();
})

appUI.Elements.infoboxClose.on("click", function () {
    AppComponents.infobox.fadeOut();
})

appUI.Elements.menuOpen.on("click", appUI.menuToggle)

Theme.setTheme()