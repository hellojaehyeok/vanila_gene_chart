
// ------------------------------------------------------
//                         그래프
// ------------------------------------------------------
var xlsxData = {};
var graphWrap = document.querySelector(".graphWrap");
var chartDataArr = {};
var chrTotalData = {};
var chrTotalIndex = 0; 
var chrPercent = {};
var clickX = 0;
var clickY = 0;
var isFirst = true;

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
            parsingData(xlsxData);
        })
    };
    reader.readAsBinaryString(input.files[0]);
}

// # . 2 data 원하는 형태로 변환
function parsingData(xlsxData){
    for(var i = 0 ; i <  xlsxData.length ; i++){

        for(var key in xlsxData[i]){
            if(typeof(xlsxData[i].pos)!=="number"){
                continue;
            }

            if(key == "f" || key == "m" || key == "__EMPTY" || key == "pos" || key == "chr"){continue;}
            chartDataArr[key] = chartDataArr[key] ? chartDataArr[key] : [];
            chrPercent[key] = {};
            chartDataArr[key].push({ type : xlsxData[i][key], pos : xlsxData[i]["pos"], chr : xlsxData[i]["chr"], name: xlsxData[i]["__EMPTY"]});
        }

        if(typeof(xlsxData[i].pos)=="number"){
            chrTotalData[xlsxData[i]["chr"]] = xlsxData[i]["pos"];
        }

    }
    var chrSelectBox = document.querySelector(".chrSelectBox");
    for(var key in chrTotalData){
        if(typeof(chrTotalData[key]) !== "number"){continue;}
        chrTotalIndex += chrTotalData[key];

        var chrSelectOption = document.createElement("option");
        chrSelectOption.innerText = key;
        chrSelectOption.classList.add("chrOption");
        chrSelectBox.appendChild(chrSelectOption);
    }

    buildGraph();
} 

// # . 3 그래프 생성
function buildGraph(){
    // 초기화
    var visualWrap = document.querySelector(".visualWrap");
    var visualWrapPosition = document.querySelector(".visualWrapPosition");
    visualWrap.remove();
    visualWrapPosition.innerHTML = "<div class='visualWrap'><div class='tableWrap' ><div class='tableContent'><table id='table' class='table'></table></div></div><div class='graphContainer'><div class='dotline'></div><div class='graphWrap'></div></div></div>"

    graphWrap = document.querySelector(".graphWrap");
    for(var key in chrPercent){
        chrPercent[key] = {}
    }

    // 부모 생성
    function makeParent(className){
        var graphElName = document.createElement('div');
        graphElName.classList.add("graphElName");
        var divEl = document.createElement('div');
        divEl.classList.add(className);
        
        var graphName = document.createElement('div');
        graphName.innerText = className;
        graphName.classList.add("graphName");

        graphElName.appendChild( graphName ); 
        graphElName.appendChild( divEl ); 
        graphWrap.appendChild( graphElName ); 
    }


    var count = 0;

    // 클 틀 생성
    for(var key in chartDataArr){
        // 좌측 컬럼 이름, 엄마 아빠 
        if(count == 0){
            var chrNameBar = document.createElement('div');
            var chrNameDefault = document.createElement('div');
            chrNameDefault.classList.add("graphName");
            chrNameBar.appendChild( chrNameDefault ); 
            
            for(var keyChr in chrTotalData){
                if(typeof(chrTotalData[keyChr])=="number"){
                    chrNameBar.classList.add("graphChrEl");
                    var chrName = document.createElement('div');
                    chrName.innerText = keyChr;
                    chrName.classList.add("chrStackName");
                    chrName.style.height = (100/chrTotalIndex) * chrTotalData[keyChr] + "%";
                    chrNameBar.appendChild( chrName ); 
                }
            }
            
            graphWrap.appendChild( chrNameBar ); 
            makeParent("mother");
            makeParent("father");
            count++;
        }

        var graphElName = document.createElement('div');
        graphElName.classList.add("graphElName");

        var divEl = document.createElement('div');
        divEl.setAttribute("data-column", key);
        divEl.classList.add("graphEl");

        var graphName = document.createElement('div');
        graphName.innerText = key;
        graphName.classList.add("graphName");

        graphElName.appendChild( graphName ); 
        graphElName.appendChild( divEl ); 
        graphWrap.appendChild( graphElName ); 
        

        // 작은 틀 생성
        for(var keySmall in chrTotalData){
            // if(typeof(chrTotalData[keySmall])!=="number"){continue;}
            var divElSmall = document.createElement('div');
            divElSmall.setAttribute("data-column", keySmall);
            divElSmall.classList.add("chrStack");
            divElSmall.style.height = (100/chrTotalIndex) * chrTotalData[keySmall] + "%";
            divEl.appendChild( divElSmall );
        }
        
        // 작은거 안에 작은거 생성 
        for(var i = 0 ; i < chartDataArr[key].length ; i++){
            var divElSmallStack = document.createElement('div');
            divElSmallStack.setAttribute("data-pos", chartDataArr[key][i]["pos"]);
            divElSmallStack.setAttribute("data-chr", chartDataArr[key][i]["chr"]);
            divElSmallStack.setAttribute("data-type", chartDataArr[key][i]["type"]);
            divElSmallStack.classList.add("chrStackSmall");


            // 높이값
            var gap = 0;
            if(i==0){
                gap = chartDataArr[key][i]["pos"];
            }else{
                if(chartDataArr[key][i]["chr"] == chartDataArr[key][i-1]["chr"]){
                    gap = chartDataArr[key][i]["pos"] - chartDataArr[key][i-1]["pos"];
                }else{
                    gap = chartDataArr[key][i]["pos"];
                }
            }

            var currentChr = chartDataArr[key][i]["chr"];
            var divElSmall = divEl.querySelector("[data-column=" +currentChr+ "]");
            
            chrPercent[key][currentChr] = chrPercent[key][currentChr] ? chrPercent[key][currentChr] : 0;

            divElSmallStack.style.height = (  100/chrTotalData[currentChr]  ) * gap + "%";


            // 배경색
            if(chartDataArr[key][i]["type"] == "A"){
                chrPercent[key][currentChr] += (100/chrTotalData[chartDataArr[key][i]["chr"]]) * gap;
                divElSmallStack.style.backgroundColor= "#FF9BBD"
            }else if(chartDataArr[key][i]["type"] == "B"){
                divElSmallStack.style.backgroundColor= "#95CAFF"
            }else{
                divElSmallStack.style.backgroundColor= "#FFE395"
            }
            divElSmall.appendChild( divElSmallStack );
        }
    }    
    
    // 점선 추가
    var graphContainer = document.querySelector(".graphContainer");
    for(var key in chrTotalData){
        if(typeof(chrTotalData[key])=="number"){
            var dotEl = document.createElement('div');
            var currentChr = document.querySelector("[data-column="+key+"]");
            var chtHeight = currentChr.getBoundingClientRect().bottom;

            dotEl.classList.add("dotline");
            dotEl.style.top = (chtHeight - graphContainer.getBoundingClientRect().top) + "px";
            dotEl.style.height = currentChr.offsetHeight + "px";
            dotEl.style.transform = "translateY(-"+ currentChr.offsetHeight +"px)";
            graphContainer.appendChild( dotEl );
        }
    }

    var newChrPercent = chrPercent; 
    for(var key in chrPercent){
        var totalA = 0;
        for(var keySmall in chrPercent[key]){
            totalA += (chrPercent[key][keySmall] * chrTotalData[keySmall])/100;
        }
        newChrPercent[key]["total"] = totalA / chrTotalIndex * 100
    }

    chrPercent = newChrPercent;

    addGraphEvent();
    buildTable();
}

// 드래그&드롭, 더블클릭 이벤트 추가
function addGraphEvent(){
    // 드래그&드롭 인터랙션
    var isMouseMove = false;
    var clickColumn = "";
    graphWrap.addEventListener("mousedown", function(e){
        if(e.path[0].classList.contains("chrStackSmall")){
            isMouseMove = true;
            clickColumn = e.path[2].dataset.column;

            var clickEl = document.querySelector("[data-column=" +clickColumn+ "]");
            clickY = e.clientY - clickEl.offsetTop;
            clickX = e.clientX - clickEl.offsetLeft;
        }
    });

    graphWrap.addEventListener("mousemove", function(e){
        if(!isMouseMove){return};
        var clickEl = document.querySelector("[data-column=" +clickColumn+ "]").parentNode;
        clickEl.style.position = "absolute";
        clickEl.style.top = `${e.clientY - clickY}px`;
        clickEl.style.left = `${e.clientX - clickX}px`;
        clickEl.style.pointerEvents = "none";


        // 그림자
        if(!e.path[2].dataset.column){return;}
        var currentEl = document.querySelector("[data-column=" +e.path[2].dataset.column+ "]").parentNode;
        var currentShadow = document.querySelector(".graphShadow");
        if(currentShadow){
            currentShadow.remove();
        }

        var shadowGraph = document.createElement('div');
        shadowGraph.classList.add("graphShadow");

        clickEl.parentNode.insertBefore(shadowGraph, currentEl)

    });

    graphWrap.addEventListener("mouseup", function(e){
        isMouseMove = false;
        if(!clickColumn){return;}
        var clickEl = document.querySelector("[data-column=" +clickColumn+ "]").parentNode;
        var currentShadow = document.querySelector(".graphShadow");
        if(!currentShadow){return}

        clickEl.style.position = "unset";
        clickEl.style.top = 0;
        clickEl.style.left = 0;
        clickEl.style.pointerEvents = "all";

        clickEl.parentNode.replaceChild(clickEl, currentShadow);
        sortGraphData();
    });

    graphWrap.addEventListener("dblclick", function(e){
        if(e.path[0].classList.contains("chrStackSmall")){
            var modalSelectOption = document.querySelectorAll(".modalSelectOption");
            if(modalSelectOption){
                for(var i = 0 ; i < modalSelectOption.length ; i++){
                    modalSelectOption[i].remove();
                }
            }

            var modal = document.querySelector(".modal");
            modal.style.display = "unset";
            drawModalGraph(e.path[2].dataset.column);
        }
    });

}

// 그래프 정렬
function sortGraphData(){
    var newChrArr = [];
    var graphEls = document.querySelectorAll(".graphEl");

    for(var i = 0 ; i < graphEls.length ; i++){
        newChrArr.push(graphEls[i].dataset.column)
    }
    var newChrObj = {};

    for(var i = 0 ; i < newChrArr.length ; i++){
        newChrObj[newChrArr[i]] = chartDataArr[newChrArr[i]];
    }
    chartDataArr = newChrObj;
    buildTable();
}




// ------------------------------------------------------
//                         테이블
// ------------------------------------------------------
var isTable = false;
function buildTable(){
    var table = document.querySelector('.table');
    isTable = true;
    // 초기화
    var tableContent = document.querySelector('.tableContent');
    table.remove();

    var newTable = document.createElement('table');
    newTable.classList.add("table");
    

    // 머리
    var thead = document.createElement('thead');
    var theadTr = document.createElement('tr');
    var theadTh = document.createElement('th');
    theadTr.appendChild(theadTh);
    for(var key in chrTotalData){
        var theadTh = document.createElement('th');
        theadTh.innerText = key;
        theadTr.appendChild(theadTh);
    }
    var theadThTotla = document.createElement('th');
    theadThTotla.innerText = "Total";
    theadTr.appendChild(theadThTotla);

    thead.appendChild(theadTr);

    // 몸통
    var tbody = document.createElement('tbody');
    for(var key in chartDataArr){
        var tbodyTr = document.createElement('tr');
        var tbodyTdName = document.createElement('td');
        tbodyTdName.innerText = key;
        tbodyTr.setAttribute("data-column", key + "_table");
        tbodyTr.appendChild(tbodyTdName);
        tbody.appendChild(tbodyTr);

        for(var keySmall in chrPercent[key]){
            var tbodyTd = document.createElement('td');
            tbodyTd.innerText = chrPercent[key][keySmall].toFixed(2) + "%";
            tbodyTd.style.backgroundColor = "hsl("+ (250-(chrPercent[key][keySmall].toFixed(2) * 2.5)) +", 100%, 57%)";
            tbodyTr.appendChild(tbodyTd);
        }
    }

    
    newTable.appendChild(thead);
    newTable.appendChild(tbody);


    tableContent.appendChild(newTable);
    addTableEvent();
}
var tableWrap = document.querySelector('.tableWrap');
var clickTableColumn = "";
var hoverTableColumn = "";

// 테이블 정렬
function sortTableData(){
    var newChrArr = [];
    var tbodyChildren = document.querySelector("tbody").children;
    
    for(var i = 0 ; i < tbodyChildren.length ; i++){
        newChrArr.push(tbodyChildren[i].dataset.column.replace("_table", ""));
    }
    var newChrObj = {};
    for(var i = 0 ; i < newChrArr.length ; i++){
        newChrObj[newChrArr[i]] = chartDataArr[newChrArr[i]];
    }
    chartDataArr = newChrObj;
    buildGraph();
}

// 드래그&드롭 이벤트 추가
function addTableEvent(){
    var isMouseMove = false;
    var tableWrap = document.querySelector('.tableWrap');
    tableWrap.addEventListener("mousedown", function(e){
        if(!e.path[1].dataset.column){return};
        isMouseMove = true;
        clickTableColumn = e.path[1].dataset.column;
        var clickEl = document.querySelector("[data-column=" + clickTableColumn + "]");
        clickEl.style.opacity = "0.5";
        clickEl.style.border = "5px solid #000";
    })
    tableWrap.addEventListener("mousemove", function(e){
        if(!isMouseMove){return;}
        if(!e.path[1].dataset.column){return};
    
    
        // if(hoverTableColumn!==e.path[1].dataset.column){
        //     if(hoverTableColumn){
        //         document.querySelector("[data-column=" + hoverTableColumn + "]").style.borderTop = 0;
        //     }
        // }
        var currentShadow = document.querySelector(".tableShadow");
        if(currentShadow){
            currentShadow.remove();
        }
    
        hoverTableColumn = e.path[1].dataset.column;
        var hoverEl = document.querySelector("[data-column=" + hoverTableColumn + "]");
    
        var shadowGraph = document.createElement('div');
        shadowGraph.classList.add("tableShadow");
    
        hoverEl.parentNode.insertBefore(shadowGraph, hoverEl);
    })
    tableWrap.addEventListener("mouseup", function(e){
        if(!isMouseMove){return}
        isMouseMove = false;
        
        var clickEl = document.querySelector("[data-column=" + clickTableColumn + "]");
        clickEl.style.opacity = "1";
        clickEl.style.border = "0";

        var currentShadow = document.querySelector(".tableShadow");
        if(!currentShadow){return}
        clickEl.parentNode.replaceChild(clickEl, currentShadow);
        sortTableData();
    })
    
}




// ------------------------------------------------------
//                         사진찍기
// ------------------------------------------------------
function downloadGraphImg(e){
    var graphContainer = document.querySelector(".graphContainer");
    graphContainer.style.width = "unset";
    graphContainer.style.height = "unset";

    html2canvas(graphWrap).then(function(canvas){
        var myImage = canvas.toDataURL();
        downloadURI(myImage, "graph.png") 
    });
}
function downloadTableImg(e){
    var tableWrap = document.querySelector(".tableWrap");
    tableWrap.style.width = "unset";
    tableWrap.style.height = "unset";
    tableWrap.style.overflow = "unset";

    html2canvas(tableWrap).then(function(canvas){
        var myImage = canvas.toDataURL();
        downloadURI(myImage, "table.png") 
    });
}
function downloadModalImg(){
    var modalGraph_Wrap = document.querySelector(".modalGraph_Wrap");
    var modalGraph_scale = document.querySelector(".modalGraph_scale");
    var modalGraphEl = document.querySelectorAll(".modalGraphEl");
    modalGraph_Wrap.style.overflow = "unset";
    modalGraph_Wrap.style.width = "unset";
    modalGraph_Wrap.style.height = "unset";
    modalGraph_scale.style.transform = "scale(1)";

    for(var i = 0 ; i < modalGraphEl.length ; i++){
        modalGraphEl[i].style.overflow = "unset";
    }

    html2canvas(modalGraph_Wrap).then(function(canvas){
        var myImage = canvas.toDataURL();
        downloadURI(myImage, "plz.png") 
    });
}
function downloadURI(uri, name){
	var link = document.createElement("a")
	link.download = name;
	link.href = uri;
	document.body.appendChild(link);
	link.click();

    var tableWrap = document.querySelector(".tableWrap");
    var graphContainer = document.querySelector(".graphContainer");
    var modalGraph_Wrap = document.querySelector(".modalGraph_Wrap");
    var modalGraphEl = document.querySelectorAll(".modalGraphEl");

    modalGraph_Wrap.style.overflow = "scroll";
    modalGraph_Wrap.style.width = "90%";

    graphContainer.style.width = "700px";
    graphContainer.style.height = "600px";
    tableWrap.style.width = "520px";
    tableWrap.style.height = "500px";
    tableWrap.style.overflow = "scroll";

    for(var i = 0 ; i < modalGraphEl.length ; i++){
        modalGraphEl[i].style.overflow = "hidden";
    }

}



// ------------------------------------------------------
//                         초기화
// ------------------------------------------------------
function onClickInit(){
    document.querySelector(".addMabcFile").value = "";
    var visualWrap = document.querySelector(".visualWrap");
    var visualWrapPosition = document.querySelector(".visualWrapPosition");
    visualWrap.remove();
    visualWrapPosition.innerHTML = "<div class='visualWrap'><div class='tableWrap' ><div class='tableContent'><table id='table' class='table'></table></div></div><div class='graphContainer'><div class='dotline'></div><div class='graphWrap'></div></div></div>"
    
    var chrOptionBox = document.querySelectorAll(".chrOption");
    for(var i = 0 ; i < chrOptionBox.length; i++){
        console.log(chrOptionBox[i]);
        chrOptionBox[i].remove();
    }

    xlsxData = {};
    chartDataArr = {};
    chrTotalData = {};
    chrTotalIndex = 0; 
    chrPercent = {};
    clickX = 0;
    clickY = 0;
    isFirst = true;

    clickTableColumn = "";
    hoverTableColumn = "";
    isTable = false;
}




// ------------------------------------------------------
//                         모달
// ------------------------------------------------------
function drawModalGraph(_graphName){

    // 데이터 변환 작업
    var graphName = chartDataArr[_graphName];
    var modalGraph_scale = document.querySelector(".modalGraph_scale");
    modalGraph_scale.innerHTML = "";
    let modalGraphData = {};
    for(var i = 0 ; i < graphName.length ; i++){
        modalGraphData[graphName[i].chr] = modalGraphData[graphName[i].chr]?modalGraphData[graphName[i].chr]:[];
        modalGraphData[graphName[i].chr].push({
            pos:graphName[i].pos,
            name:graphName[i].name,
            type:graphName[i].type,
            chr:graphName[i].chr
        })
    }
    
    // 그래프 그리기 
    for(var key in modalGraphData){
        var modalGraphSection = document.createElement('div');
        modalGraphSection.classList.add("modalGraphSection");

        var modalGraph = document.createElement('div');
        modalGraph.classList.add("modalGraphEl");
        
        var modalGraphElWrap = document.createElement('div');
        modalGraphElWrap.classList.add("modalGraphElWrap");
        
        var modalGraphName = document.createElement('div');
        modalGraphName.classList.add("modalGraphName");
        modalGraphName.innerText = key;

        for(var i = 0 ; i <  modalGraphData[key].length; i++){
            // 스택
            var modalGraphStack = document.createElement('div');
            modalGraphStack.classList.add("modalGraphElStack");
            modalGraphStack.setAttribute("data-column", key+"_modal");

            // 스택 이름
            var modalStackDesc = document.createElement('div');
            modalStackDesc.classList.add("modalStackDesc");
            modalStackDesc.setAttribute("data-column", key+"_modalDesc");
            modalStackDesc.innerHTML = modalGraphData[key][i]["name"];

            // 스택 이름
            var modalStackDescLine = document.createElement('div');
            modalStackDescLine.classList.add("modalStackDescLine");
            modalStackDescLine.setAttribute("data-column", key+"_modalDescLine");

            // 높이값
            var gap = 0;
            if(i==0){
                gap = modalGraphData[key][i]["pos"];
            }else{
                gap = modalGraphData[key][i]["pos"] - modalGraphData[key][i-1]["pos"];
            }
        
            modalGraphStack.style.height = (  100/chrTotalData[key]  ) * gap + "%";
            
            // // 배경색
            if(modalGraphData[key][i]["type"] == "A"){
                modalGraphStack.style.backgroundColor= "#FF9BBD"
            }else if(modalGraphData[key][i]["type"] == "B"){
                modalGraphStack.style.backgroundColor= "#95CAFF"
            }else{
                modalGraphStack.style.backgroundColor= "#FFE395"
            }

            modalGraph.appendChild( modalStackDesc );
            modalGraph.appendChild( modalStackDescLine );
            modalGraph.appendChild( modalGraphStack );
        }

        modalGraphSection.appendChild(modalGraphName);
        modalGraphSection.appendChild(modalGraph);
        modalGraph_scale.appendChild( modalGraphSection );

        var stacEls = modalGraph.querySelectorAll("[data-column=" +key+"_modal"+ "]");
        var stackDescEls = modalGraph.querySelectorAll("[data-column=" +key+"_modalDesc"+ "]");
        var stackDescLineEls = modalGraph.querySelectorAll("[data-column=" +key+"_modalDescLine"+ "]");
        var marinLeft = 0;
        
        for(var i = 0 ; i < stackDescEls.length ; i++){
            // 탑
            stackDescEls[i].style.top = stacEls[i].offsetTop + (stacEls[i].clientHeight/2) + "px";
            stackDescLineEls[i].style.top = stacEls[i].offsetTop + (stacEls[i].clientHeight/2) + "px"

            // 높이값 조장
            if(i !== 0){
                var offsetBottom = stackDescEls[i-1].offsetTop + stackDescEls[i-1].offsetHeight;
                if(offsetBottom > stackDescEls[i].offsetTop){
                    stackDescEls[i].style.top = offsetBottom + "px";
                }
            }

            // 마진
            if(marinLeft < stackDescEls[i].clientWidth){
                marinLeft = stackDescEls[i].clientWidth;
            }

            var lineX = stackDescLineEls[i].offsetLeft; 
            var lineY = stackDescLineEls[i].offsetTop; 

            var descX = stackDescEls[i].offsetLeft;
            var descY = stackDescEls[i].offsetTop + (stackDescEls[i].clientHeight/2);
            
            var x = descX - lineX;
            var y = descY - lineY;
            var radian = Math.atan2(y, x);
            var degree = radian * 180 / Math.PI // 라디안 -> 디그리 변환

            stackDescLineEls[i].style.transform = "rotate(" + degree + "deg)";
            stackDescLineEls[i].style.width = 
            Math.sqrt(
                Math.pow((descY - lineY), 2) + Math.pow((Math.abs(descX - lineX)), 2)
            ) - 4 + "px";

        }
        modalGraph.style.marginRight = marinLeft + 60 + "px";
    }

    var mabcModalSelect = document.querySelector(".mabcModalSelect");
    for(var key in chartDataArr){
        var selectOption = document.createElement('option');
        selectOption.innerText = key;
        selectOption.classList.add("modalSelectOption");
        if(_graphName == key){
            selectOption.setAttribute("selected", true);
        }
        mabcModalSelect.appendChild(selectOption);
    }

}
function closeMOdal(){
    var modal = document.querySelector(".modal");
    modal.style.display = "none";
}
function onChangeModalSelect(){
    var mabcModalSelect = document.querySelector(".mabcModalSelect");  
  

    drawModalGraph(mabcModalSelect.options[mabcModalSelect.selectedIndex].innerText)
}
function onClickZoom(isZoomIn){
    var modalGraph_scale = document.querySelector(".modalGraph_scale");
    var style = window.getComputedStyle(modalGraph_scale);
    var matrix = new WebKitCSSMatrix(style.transform);
    modalGraph_scale.style.transform = "scale(" + (matrix.m11 + (isZoomIn?0.3:-0.3)) + ")"
}






// ------------------------------------------------------
//                         정렬
// ------------------------------------------------------
function onChangeChrSort(){
    var chrSelectBox = document.querySelector(".chrSelectBox");  
    var selectText = chrSelectBox.options[chrSelectBox.selectedIndex].innerText;
    var sortData = [];
    for(var key in chrPercent){
        sortData.push({name:key, percent: chrPercent[key][selectText]});
    };

    sortData.sort(function(a, b){
        return b.percent - a.percent;
    });

    var newChartDataArr = {}

    for(var i = 0 ; i < sortData.length ; i++){
        newChartDataArr[sortData[i].name] = chartDataArr[sortData[i].name];
    }

    chartDataArr = newChartDataArr;
    var allChrBtn = document.querySelector(".allChrBtn");
    if(allChrBtn.classList.contains("activeAllChr")){
        onClickAllChr(false)
    }else{
        buildGraph();
    }
}
function onClickAllChr(isClick){
    if(isClick){
        var allChrBtn = document.querySelector(".allChrBtn");
        if(allChrBtn.classList.contains("activeAllChr")){
            allChrBtn.classList.remove("activeAllChr");
        }else{
            allChrBtn.classList.add("activeAllChr");
        }
    }


    var chrSelectBox = document.querySelector(".chrSelectBox");  
    var selectText = chrSelectBox.options[chrSelectBox.selectedIndex];
    if(!selectText){return;}
    selectText = selectText.innerText;

    var sortData = [];
    
    for(var key in chrPercent){
        sortData.push({name:key, percent: chrPercent[key][selectText], totalPercent : chrPercent[key]["total"]});
    };

    sortData.sort(function(a, b){
        if(b.percent < a.percent) return -1; 
        if(b.percent > a.percent) return 1;
        if(b.totalPercent < a.totalPercent) return -1;
        if(b.totalPercent > a.totalPercent) return 1;
        return 0;        
    });

    var newChartDataArr = {}

    for(var i = 0 ; i < sortData.length ; i++){
        newChartDataArr[sortData[i].name] = chartDataArr[sortData[i].name];
    }

    chartDataArr = newChartDataArr;
    buildGraph();
}