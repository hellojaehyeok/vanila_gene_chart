


var heatmapBoxEls = document.querySelectorAll(".heatmapBox");

for(var i = 0 ; i < heatmapBoxEls.length ; i++){
    heatmapBoxEls[i].style.backgroundColor = "hsl("+ (250-(Number(heatmapBoxEls[i].innerHTML.replace("%", "")) * 2.5)) +", 100%, 57%)";
}
   
