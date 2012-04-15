// The "theme" constructor.
function theme(printName, borderColor, backgroundColor) {
    this.printName = printName;
    this.borderColor = borderColor;
    this.backgroundColor = backgroundColor;
}

// Sets current theme based on keyword. Currently only built-in themes
// are supported.
function getTheme(themeKeyword) {
    //console.log("theming");
    var myTheme = themeKeyword.toLowerCase();
    switch (myTheme) {
    case "green":
        return (new theme("Green Theme", "#489615", "#EEFFEE"));
        break;
    case "blue":
        return (new theme("Blue Theme", "#79A2D8", "#DDEEFF"));
        break;
    case "red":
        return (new theme("Red Theme", "#D65555", "#FFEEEE"));
        break;
    case "gray":
    case "grey":
        return (new theme("Gray Theme", "#777777", "#EEEEEE"));
        break;
    case "orange":
        return (new theme("Orange Theme", "#FF712B", "#FCE7CF"));
        break;

    default:
        alert("Unknown theme " + myTheme + ". Using the Blue Theme instead.");
        return (getTheme("blue"));
    }
}

// Based on code from http://bit.ly/J9NJgy.
function getElementWidth (element) {
    if (typeof element.clip !== "undefined") {
        return element.clip.width;
    } else {
        if (element.style.pixelWidth) {
            return element.style.pixelWidth;
        } else {
            return element.offsetWidth;
        }
    }
}

const extra_space = 50;       // Space to avoid a crowded look or CSS overflow
const width_minimum = 150;    // Minimum width we'll allow

// Duplicate the version info at the top of the page and theme it
// based on the theme Object parameter.
function duplicateVersionInfo (curTheme) {
    console.log("Using " + curTheme.printName + ".");
    // Duplicate version "info" next to "install" button
    var info_all = document.getElementsByClassName("info").item(0).cloneNode();
    var info = info_all.getElementsByTagName("H3")[0];
    var install_shell = document.getElementsByClassName("install-shell")[0];
    var button = install_shell.getElementsByClassName("install")[0];

    // Insert the version info
    install_shell.insertBefore(info, button);

    // Calculate the width for the install info
    var total_width = getElementWidth(install_shell);
    var button_width = getElementWidth(button);

    // We leave extra_space pixels for padding and to prevent things
    // looking crowded and then use all the remaining space with a
    // minimum of width_minimum.
    var our_width = Math.max(total_width - button_width - extra_space, width_minimum);

    // Stylize the version info with a box based on the theme and the
    // appropriate width
    var style = document.createAttribute("style");
    style.nodeValue = "margin-top:3px; float:right; padding:6px;" +
        "width:" + our_width + "px;" +
        "border:3px solid " + curTheme.borderColor + ";" +
        "background-color: " + curTheme.backgroundColor + ";";
    info.attributes.setNamedItem(style);

    // Our duplicated version info is not getting matched by the same
    // CSS rules that the standard version info uses. We are missing a
    // separator (a period in the original version) between the
    // release date and the add-on size and a line break after the
    // newline size. Rather than monkey with the CSS code we just
    // tweak the HTML to produce the right output.

    // Find the nodes to process.
    var filesize = info.getElementsByClassName("filesize").item(0);
    var parent = filesize.parentNode;

    // Insert the separator. A hyphen looks better than a period.
    var separator = document.createTextNode(" - ");
    parent.insertBefore(separator, filesize);

    // Insert the line break.
    var br = document.createElement("BR");
    parent.appendChild(br);
}

// PageMod include regexps are not rich enough to filter only the
// add-on's main page so we do extra filtering here.
//
// PageMod has already checked the protocol and site so we just need
// to worry about the path. Examples of paths we are trying to match
// are:
//    /en-US/firefox/addon/some-addon/
//    /en-US/firefox/addon/some-addon
//    /en-GB/thunderbird/addon/some-tbird-addon/
//    /xx-YY/thunderbird/addon/some-tbird-addon
//
// We use the new RegExp syntax so we don't have to escape all of the
// slashes in the RegExp.
const regexp = new RegExp("^/[^/]+/[^/]+/addon/[^/]+/?$","i");

// Does the current pathname match our regexp?
function filterUrl() {
    //console.log("trying to match");
    var loc = location.pathname;
    var rtn = loc.match(regexp);
    //console.log("match=" + rtn + ".");
    return rtn;
}

console.log("loaded.");

// const myPrefs = require("simple-prefs");
//var themeName = myPrefs.amo.uptopversioninfo.theme;
var themeName = "orange";

var curTheme = getTheme(themeName);

// If we have a matching URL, do the work.
if (filterUrl()) duplicateVersionInfo(curTheme);

//console.log("ran");