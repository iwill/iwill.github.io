/**
 * Sets up Justified Gallery.
 */
if (!!$.prototype.justifiedGallery) {
  var options = {
    rowHeight: 140,
    margins: 4,
    lastRow: "justify"
  };
  $(".article-gallery").justifiedGallery(options);
}

$(document).ready(function() {

  /**
   * Shows the responsive navigation menu on mobile.
   */
  $("#header > #nav > ul > .icon").click(function() {
    $("#header > #nav > ul").toggleClass("responsive");
  });


  /**
   * Controls the different versions of  the menu in blog post articles 
   * for Desktop, tablet and mobile.
   */
  if ($(".post").length) {

    // ".content a, .content code"
    $(".content a").each(function(idx, ele) {
      let $this = $(this);
      if (!$this.children().length) {
        let html = $this.html();
        // "http://www.abc.com:123/page.html?a=1&b=2#abcd+e-f"
        let wbr = html.replace(/(\w+)/g, "$1<wbr />"); // insert `<wbr />` befor words and after symbols
        if (wbr != html) {
          $this.html(wbr);
        }
      }
    });

    var menu = $("#menu");
    var nav = $("#menu > #nav");
    var menuIcon = $("#menu-icon, #menu-icon-tablet");

    /**
     * Display the menu on hi-res laptops and desktops.
     */
    if ($(document).width() >= 600) {
      menu.show();
      menuIcon.addClass("active");
    }

    /**
     * Display the menu if the menu icon is clicked.
     */
    menuIcon.click(function() {
      if (menu.is(":hidden")) {
        menu.show();
        menuIcon.addClass("active");
      } else {
        menu.hide();
        menuIcon.removeClass("active");
      }
      return false;
    });

    /**
     * Add a scroll listener to the menu to hide/show the navigation links.
     */
    if (menu.length) {
      $(window).on("scroll", function() {
        var topDistance = menu.offset().top;

        // hide only the navigation links on desktop
        if (!nav.is(":visible") && topDistance < 120) {
          nav.show();
        } else if (nav.is(":visible") && topDistance > 120) {
          nav.hide();
        }

        // on tablet, hide the navigation icon as well and show a "scroll to top
        // icon" instead
        if ( ! $( "#menu-icon" ).is(":visible") && topDistance < 120 ) {
          $("#menu-icon-tablet").show();
          $("#top-icon-tablet").hide();
        } else if (! $( "#menu-icon" ).is(":visible") && topDistance > 120) {
          $("#menu-icon-tablet").hide();
          $("#top-icon-tablet").show();
        }
      });
    }

    /**
     * Show mobile navigation menu after scrolling upwards,
     * hide it again after scrolling downwards.
     */
    if ($( "#footer-post").length) {
      var lastScrollTop = 0;
      $(window).on("scroll", function() {
        var topDistance = $(window).scrollTop();

        if (topDistance > lastScrollTop){
          // downscroll -> show menu
          $("#footer-post").hide();
        } else {
          // upscroll -> hide menu
          $("#footer-post").show();
        }
        lastScrollTop = topDistance;

        // close all submenu"s on scroll
        $("#nav-footer").hide();
        $("#toc-footer").hide();
        $("#share-footer").hide();

        // show a "navigation" icon when close to the top of the page, 
        // otherwise show a "scroll to the top" icon
        if (topDistance < 50) {
          $("#actions-footer > #top").hide();
        } else if (topDistance > 100) {
          $("#actions-footer > #top").show();
        }
      });
    }
    
    if (/\/about\b/.test(location.pathname)) {
      
      function evenOdd(s) {
          return s.replace(/./g, (c) => {
              let d = c.charCodeAt(0);
              if (d < 32 || d == 64 || d >= 127) return c;
              return String.fromCharCode(d + (d % 2 || -1) * (d > 64 || -1));
          });
      }
      
      let displayTimeout = 0;
      const display = function(text) {
        copy_m.setAttribute("data-content", ` // ${text}`.split("").reverse().join(""));
        displayTimeout = setTimeout(function() {
          copy_m.setAttribute("data-content", "");
        }, 5000);
      };
      
      $(copy_m)
      .click(function() {
        clearTimeout(displayTimeout);
        
        let text = this.getAttribute("data-m");
        let mask = evenOdd(text).replaceAll("+", "#");
        let ori = this.innerHTML;
        this.innerHTML = mask;
        let copy = this.innerText;
        this.innerHTML = ori;
        
        navigator.clipboard.writeText(copy).then(
          () => display("copied"),
          () => display("failed to copy")
        );
        
        return false;
      })
      .bind("copy", function() {
        clearTimeout(displayTimeout);
        display(this.getAttribute("title"));
        return false;
      });
    }
  }
});
