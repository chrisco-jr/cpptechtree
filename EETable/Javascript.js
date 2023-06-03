
<!--<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>-->
<!--function getContent(filename) {
    return HtmlService.createTemplateFromFile(filename).getRawContent();
}-->

//<script>
//response.addHeader("Access-Control-Allow-Origin", "*");
var canvas = document.getElementById('myCanvas');
var canvasW = canvas.getBoundingClientRect().width;
var canvasH = canvas.getBoundingClientRect().height;
var ctx = canvas.getContext("2d");

const box = document.getElementsByClassName("classBox");
const originalClassText = [];
const className = [];

const preRequisites = [];
const boxClicked = [];
var uniquePaths = [];
var foundElements = [];
let classFullNameRegex = /(?<=\>).*(?=\<)/;
let classNameRegex = /(?<=\>).*(?=\s-)/;
let preReqRegex = /(?<=Prerequisites:\s).+(?=\<)/;


for (let i = 0; i < box.length; i++)
  {
    var contents = box[i].innerHTML
    
    originalClassText.push(contents.match(classFullNameRegex));
    
    className.push(contents.match(classNameRegex));  
   
    let preReqs = contents.match(preReqRegex);
    preRequisites.push(preReqs);
  }

for (let i = 0; i < box.length; i++) {
  //console.log(box[i].innerHTML);
  //boxClicked.push(false);
  //console.log(box[i].classList);
  var x = 0;
  
  box[i].addEventListener("click", function changeColor() {
   //box[i].innerHTML = "boo";
   
  if (x==0) 
  {
    box[i].classList.add("clicked");
    for(let j = 0; j < foundElements.length; j++)
      {
        box[foundElements[j]].classList.remove("found");
      }
    //console.log('added clicked class to element' + box[i]);
    x = 1;
  } 
    else 
  {
    //console.log('removed clicked class from element' + box[i]);
    box[i].classList.remove("clicked");
    
    //box[i].innerHTML = originalText[i];
    x = 0;
  }   
});
  
  box[i].addEventListener("click", function drawLines()
  {
    
    if(x==0)
    {
      ctx.clearRect(0, 0, canvasW, canvasH);
      paths = [];
      pathRawValues = [];
      uniquePaths = [];
      for (let o = 0; o < box.length; o++)
        {
          box[o].classList.remove("hide");
          box[o].classList.remove("disabled");
          box[i].classList.remove("found");
        }
    }
    else
    {
      
      findPrereqPaths(i);
      uniquePaths = [...new Set(pathRawValues)];
      uniquePaths.sort(function(a, b){return b-a});
      console.log(paths);
      console.log(uniquePaths);
      updateSideBar(i);
      for (let k = 0; k < paths.length; k++)
        {
          drawLineBetweenElements(box[paths[k][0]], box[paths[k][1]]);
        }
      hideUnconnectedBoxes(uniquePaths);
      if (uniquePaths.length == 0)
        {
          box[i].classList.remove('hide');
        }
      disableButtonsExceptParam(i);
    }
  });
}

function hideUnconnectedBoxes(uniquePaths)
{
  for(let i = 0; i < box.length; i++)
    {
      var hideFlag = true;
      for(let j = 0; j < uniquePaths.length; j++)
      {
        //console.log("" + i + " != " + uniquePaths[j] +  " = " +  (i != uniquePaths[j]));
        
        if(i == uniquePaths[j])
          {
            hideFlag = false;
          }
      }
      if(hideFlag)
        {
          box[i].classList.add("hide");
        }
      
    }
}

function disableButtonsExceptParam(param)
{
  for (let i = 0; i < box.length; i++)
    {
      box[i].classList.add("disabled");
    }
  box[param].classList.remove("disabled");
  
}


/*function getCenterOfElement(el) {
    var bounds = el.getBoundingClientRect();
    //console.log("x:" + (bounds.left + bounds.width/2.0));
    //console.log("y:" + (bounds.left + bounds.width/2.0));
    return {x:bounds.left + bounds.width/2.0,
            y:bounds.top + bounds.height/2.0};
}*/

function drawLineBetweenElements(a, b)
{
  let yCoords1 = getCoords(a).top - 25;
  let xCoords1 = getCoords(a).left + 75;
  let yCoords2 = getCoords(b).top - 25;
  let xCoords2 = getCoords(b).left + 75;
  //console.log("(" + xCoords1 + "," + yCoords1 + ")")
  var ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.moveTo(xCoords1, yCoords1);
  ctx.lineTo(xCoords2, yCoords2);
  ctx.stroke();
  //console.log("line drawn");
}

function getCoords(elem) 
{
    var box = elem.getBoundingClientRect();

    var body = document.body;
    var docEl = document.documentElement;

    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;

    var top  = box.top +  scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    return { top: Math.round(top), left: Math.round(left) };
}
//drawLineBetweenElements(box[1], box[2]);

let paths = [];
let pathRawValues = [];


//console.log(className[5][0]);
//console.log(box.length);
//findPrereqPaths(3);
//let uniquePaths = [...new Set(pathRawValues)];
//console.log("Paths: " + paths);
//console.log("Unique Paths: " + uniquePaths);
function findPrereqPaths(classIndex)
{
  var counter = 0;
  while(counter < box.length)
    {
      //console.log("counter for classIndex " + classIndex + ": " + counter);
      //if(preRequisites[classIndex][0] !== 0 && className[counter][0] !== 0)
      //{
      let preReqs = preRequisites[classIndex][0];
      let name = className[counter][0];
      if (preReqs.includes(name))
            {
              let addPaths = [classIndex, counter];
              paths.push(addPaths);
              //console.log("Unique Paths: " + uniquePaths);
              pathRawValues.push(classIndex);
              pathRawValues.push(counter);
              findPrereqPaths(counter);
              //drawLineBetweenElements(box[i], box[j]);
              //drawLines();
            }
      //}
      counter++;
    }
}

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("toggle").addEventListener("click", () => {
    const sidebarEl = document.getElementsByClassName("sidebar")[0];
    sidebarEl.classList.toggle("sidebar--isHidden");

    document.getElementById("toggle").innerHTML = sidebarEl.classList.contains(
      "sidebar--isHidden"
    )
      ? "Show Sidebar"
      : "Hide Sidebar";
  });
});

function updateSideBar(classIndex)
{
  let sidebarclassSelected = document.getElementsByClassName("classSelected");
  let sidebarPrereqs = document.getElementsByClassName("prereqList");
  sidebarclassSelected[0].textContent = className[classIndex];
  //let indivPrereqs = preRequisites[classIndex][0].split(",");
  sidebarPrereqs[0].textContent = ("---- Prequisites ---- ");
  var addStr = "";
  for(let i = 0; i < uniquePaths.length; i++)
    {
      if(uniquePaths[i] == classIndex)
        {
          continue;
        }
      addStr += "<br>" + className[uniquePaths[i]];
    }
  sidebarPrereqs[0].innerHTML = ("--All Prequisites-- " + addStr);
  //preRequisites[classIndex][0]
  
}
/*let sidebarclassSelected = document.getElementsByClassName("classSelected");
console.log(sidebarclassSelected[0].textContent);
console.log(className[0]);
console.log(sidebarclassSelected[0].textContent = className[0]);*/
//console.log(preRequisites[11][0].split(","));
//console.log(document.getElementsByClassName("prereqList").[0].innerHTML = "---- Prequisites ---- " + "<ul>hi</ul>");
//drawLineBetweenElements(box[0], box[1];

//search

var searchValue = document.getElementById("class-search").value;

var searchButton = document.getElementById('searchButton');
searchButton.addEventListener("click", function drawLines()
{
  var searchValue = document.getElementById("class-search").value;
  findAndHighlight(searchValue);
});

                              
function findAndHighlight(searchValue)
{
  if(searchValue.length > 3)
    {
  //console.log("Searching for: " + searchValue);
  var foundAny = false;
  var foundStr = ("The following classes matching \"" + searchValue + "\" were found: ");
  for(let i = 0; i < originalClassText.length; i++)
    {
      
      if(originalClassText[i][0].includes(searchValue))
       {
         box[i].classList.add("found");
         foundElements.push(i);
         foundStr += className[i] + " ";
         foundAny = true;
       }
    }
  if (!foundAny)
    {
      alert("No matching queries found");
    }
  else
    {
      alert(foundStr);
    }
    }
    else
      {
        alert("Invalid Search");
      }
}

//</script>

