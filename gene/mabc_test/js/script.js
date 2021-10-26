


   


// 구역 세팅
var lineArr = [100, 50, 62, 42, 30, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87, 87];
var dotEls = document.querySelectorAll(".dot_line");

var lineHeight = 0;
for(var i = 0 ; i < lineArr.length; i++){
    lineHeight += lineArr[i];
}

let linePlus = 0;
for(var i = 0 ; i < lineArr.length; i++){
    dotEls[i].style.height = lineArr[i] * (100 / lineHeight) + "%";
    dotEls[i].style.top = linePlus + "%";
    linePlus +=lineArr[i] * (100 / lineHeight);
}


// 클릭 이벤트
var stick_el = document.querySelectorAll(".stick_el");
for(var i = 0 ; i < stick_el.length; i++){
    stick_el[i].addEventListener("click", function(e){
        console.log(e.path[2].dataset.index)
        console.log(e.target)
    });
}

var stickData = [
    {

    }
]

    
let maxNum = 434332;
let minNum = 0;

for(var i =0;i<lineArr.length;i++){
    console.log(lineArr[i] - (lineArr[i - 1] ? lineArr[i - 1] : minNum));
}
