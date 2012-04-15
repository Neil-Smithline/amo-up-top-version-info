const pageMod = require("page-mod");
const data = require("self").data;

pageMod.PageMod({
    include: "https://addons.mozilla.org/*",
    contentScriptWhen: 'end',
    contentScriptFile: data.url("duplicate-version-info.js")
});

