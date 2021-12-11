$(".share-btn").click(function(){
  var via = $(this).attr("via");
  var body = window.wiki.title + ", " +window.wiki.abstract + " on Wikifox!";
  Share(via, body);
})

function Share(via, body, url = location.href) {
    if(via === "twitter"){
      window.open('http://twitter.com/share?url='+encodeURIComponent(url)+'&text='+encodeURIComponent(body), '', 'left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0');
    }
    else if(via === "facebook"){
      window.open('https://www.facebook.com/sharer/sharer.php?u= '+encodeURIComponent(url) + "&quote=" + body, '', 'left=0,top=0,width=600,height=400,personalbar=0,toolbar=0,scrollbars=0,resizable=0');
    }
    else if(via === "reddit"){
      window.open('http://www.reddit.com/submit?url='+encodeURIComponent(url)+'&title='+encodeURIComponent(body), '', 'left=0,top=0,width=600,height=400,personalbar=0,toolbar=0,scrollbars=0,resizable=0');
    }
    else if(via === "copy"){
      var dummy = document.createElement("input");
      document.body.appendChild(dummy);
      dummy.setAttribute('value', url);
      dummy.select();
      document.execCommand("copy");
      document.body.removeChild(dummy);
    }
    else if(via === "email"){
      window.open('mailto:?subject='+encodeURIComponent(body)+'&body='+encodeURIComponent(url), '', 'left=0,top=0,width=600,height=400,personalbar=0,toolbar=0,scrollbars=0,resizable=0');
    }
    appUI.OverlayHide();
}