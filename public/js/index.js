$(document).on("click", ".clearScrape", function () {
    $.get("api/deleteall").then(function () {
        $(".articles").empty();
    })
})

$(document).on("click", ".scrape", function () {
    $.get("api/scrape").then(function () {
        location.reload();
    })
})