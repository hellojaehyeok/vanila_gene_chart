
// ------------------------------------------------------
//                         그래프
// ------------------------------------------------------
var xlsxData = {};
var makerData = {};

var graphLength = {};
var bigGraphLength = 0;

// # . 1 엑셀 data 가져오기
function readExcel() {
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function () {
        var data = reader.result;
        var workBook = XLSX.read(data, { type: 'binary' });
        workBook.SheetNames.forEach(function (sheetName) {
            var rows = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);
            xlsxData = JSON.parse(JSON.stringify(rows));
            parsingData();
        })
    };
    reader.readAsBinaryString(input.files[0]);
}

function parsingData (){
    
    // 데이터 chromos 별로 나누기
    var newMakerData = {}
    for(var i = 0 ; i < xlsxData.length ; i++){
        newMakerData[xlsxData[i]["Chromos"]] = newMakerData[xlsxData[i]["Chromos"]]?newMakerData[xlsxData[i]["Chromos"]]:[]
        newMakerData[xlsxData[i]["Chromos"]].push(xlsxData[i]);
    }
    makerData = newMakerData;

    // 최대 데이터값 구하기
    for(var key in newMakerData){
        var currentPos = newMakerData[key][newMakerData[key].length-1][" POS(bp) "];
        graphLength[key] = currentPos;
        if(bigGraphLength < currentPos){
            bigGraphLength = currentPos
        }
    }
    drawGraph();
}



function drawGraph(){

    console.log(makerData);
    var graphWrap = document.querySelector(".graphWrap");
    var percent = 100 / bigGraphLength;

    for(var key in makerData){
        var divNameEl = document.createElement("div");
        var divEl = document.createElement("div");
        var divName = document.createElement("div");
        

        divName.innerText = key;
        divName.classList.add("graphName");

        divEl.setAttribute("data-column", key);
        divEl.style.height = (graphLength[key] * percent) + "%"
        divEl.classList.add("graphEl");

        for(var i = 0 ; i < makerData[key].length ; i++){
            var setStack = document.createElement("div");
            setStack.classList.add("graphStack");
            setStack.style.top = (makerData[key][i][" POS(bp) "] * percent) + "%"; 
            divEl.appendChild(setStack);
        }




        divNameEl.appendChild(divName);
        divNameEl.appendChild(divEl);
        graphWrap.appendChild(divNameEl);
    }
}
