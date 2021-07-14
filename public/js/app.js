const item = document.getElementById("scrollmenu");
const rightscroll = document.getElementById("rightscroll");
const leftscroll = document.getElementById("leftscroll");

if(item && rightscroll && leftscroll){
    item.addEventListener("wheel", function (e) {
        e.preventDefault();
        if (e.deltaY > 0) {
            
            item.scrollLeft += 210;
        }
        else { item.scrollLeft -= 210; }
    });
    leftscroll.addEventListener("click", function (e) {
        item.scrollLeft -= 210;
    });
    rightscroll.addEventListener("click", function (e) {
        item.scrollLeft += 210;
    });
}