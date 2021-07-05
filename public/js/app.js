const item = document.getElementById("scroolmenu");
const rightscrool = document.getElementById("rightscrool");
const leftscrool = document.getElementById("leftscrool");

item.addEventListener("wheel", function (e) {
    e.preventDefault();
    if (e.deltaY > 0) {
        
        item.scrollLeft += 210;
    }
    else { item.scrollLeft -= 210; }
});
leftscrool.addEventListener("click", function (e) {
    item.scrollLeft -= 210;
});
rightscrool.addEventListener("click", function (e) {
    item.scrollLeft += 210;
});