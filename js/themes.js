const Theme = {
    setTheme: function(){
        var theme = localStorage.getItem("cs") ?? "auto"
        

        if(theme === "auto"){
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                theme= "dark"
            }
            else{
                theme = "light"
            }
        }
        
        if(theme === "light" || theme === "dark" || theme === "auto"){
            selectOption(theme)
            theme = `css/themes/${theme}.css`;
        }
        else{
            selectOption("css")
        }
        
        this.importCss(theme)

        function selectOption(value){
            try {
                document.querySelector(`.theme-list option[value="${value}"]`).selected = true
            } catch {}
        }

    },
    importCss: function(fileurl){
        $("head").append(`<link rel="stylesheet" href="${fileurl}" type="text/css">`)
    }
}