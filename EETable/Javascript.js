
/*<!--<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>-->
<!--function getContent(filename) {
    return HtmlService.createTemplateFromFile(filename).getRawContent();
}-->

<script>*/
//Initializations for variables
//Constants for canvas elements
const canvas = document.getElementById('myCanvas');
const canvasW = canvas.getBoundingClientRect().width;
const canvasH = canvas.getBoundingClientRect().height;
const ctx = canvas.getContext("2d");

//Constants for Class Information
const box = document.getElementsByClassName("classBox");
const originalClassText = [];
const className = [];
const preRequisites = [];
const boxClicked = [];

//Variables for uniqueP
var uniquePaths = [];
var foundElements = [];

//Constants for Regexes Used
const classFullNameRegex = /(?<=\>).*(?=\<)/;
const classNameRegex = /(?<=\>).*(?=\s-)/;
const preReqRegex = /(?<=Prerequisites:\s).+(?=\<)/;


//Iterates through available classes, fills in class name and prereq info to arrays
for (let i = 0; i < box.length; i++)
  {
    var contents = box[i].innerHTML
    
    originalClassText.push(contents.match(classFullNameRegex));
    
    className.push(contents.match(classNameRegex));  
   
    let preReqs = contents.match(preReqRegex);
    preRequisites.push(preReqs);
  }

//Iterates through classBoxes, adds and applites event listeners to update appearance of boxes, lines, colors, etc.
for (let i = 0; i < box.length; i++) {
  var x = 0;
  box[i].addEventListener("click", function changeColor() {
   //box[i].innerHTML = "boo";
   
  if (x==0) 
  {
    box[i].classList.add("clicked");
    for(let j = 0; j < foundElements.length; j++)
      {
       box[foundElements[j]].classList.remove("found"); 
       box[foundElements[j]].classList.remove("currentSearch");
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
      if (zoom != 1)
        {
          zoom = 1;
          document.getElementById("mainGrid").style.transform = "scale(" + zoom + ")";
          document.getElementById("myCanvas").style.transform = "scale(" + zoom + ")";
          let yCoords = getCoords(box[i]).top - window.innerHeight / 2;
          let xCoords = getCoords(box[i]).left - window.innerWidth / 2;
          window.scrollTo(xCoords, yCoords);
        }
      
      findPrereqPaths(i);
      uniquePaths = [...new Set(pathRawValues)];
      uniquePaths.sort(function(a, b){return b-a});
      //console.log(paths);
      //console.log(uniquePaths);
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


function drawLineBetweenElements(a, b)
{
  let yCoords1 = getCoords(a).top - 0;
  let xCoords1 = getCoords(a).left + 75;
  let yCoords2 = getCoords(b).top - 0;
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
  //sidebarPrereqs[0].textContent = ("---- Prequisites ---- ");
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

function updateFoundSideBar(searchValue)
{
  foundElements.sort(function(a, b){return a-b});
  foundElements = [...new Set(foundElements)];
  console.log(foundElements);
  let sidebarclassSelected = document.getElementsByClassName("classSelected");
  let sidebarPrereqs = document.getElementsByClassName("prereqList");
  sidebarclassSelected[0].textContent = "Search for: " + searchValue;
  //let indivPrereqs = preRequisites[classIndex][0].split(",");
  sidebarPrereqs[0].textContent = ("---- Classes Found ---- ");
  var addStr = "";
  for(let i = 0; i < foundElements.length; i++)
    {
      
      addStr += "<br><button class=\"foundbtn\" id=\"preReqBtn" + foundElements[i] + "\">" + className[foundElements[i]] + "</button>";
      
      
    }
  sidebarPrereqs[0].innerHTML = ("--Classes Found--<br>" + addStr);
  var activeSelection;
  for (let i = 0; i < foundElements.length; i++)
  {
      let preReqBtn = document.getElementById("preReqBtn" + foundElements[i]);
      preReqBtn.addEventListener("click", function(){
          if(activeSelection != null)
            {
              box[activeSelection].classList.remove("currentSearch");
          
            }
          activeSelection = foundElements[i];
          
          var yCoordsFocus = getCoords(box[activeSelection]).top - window.innerHeight / 2;
          var xCoordsFocus = getCoords(box[activeSelection]).left - window.innerWidth / 2;
          //console.log("Scrolling to: " + xCoordsFocus + ", " + yCoordsFocus);
          window.scrollTo(xCoordsFocus, yCoordsFocus);
          
          box[activeSelection].classList.add("currentSearch");
         
      });
  }
}

//foundElements = [0, 50, 60, 2]
//console.log("<br><button class=\"foundbtn\" id=\"preReqBtn" + foundElements[3] + "\">");
//let preReqBtn = document.getElementById("preReqBtn" + foundElements[3]);
//console.log("preReqBtn" + foundElements[3]);

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
  for(let j = 0; j < foundElements.length; j++)
      {
        box[foundElements[j]].classList.remove("found");
      }
  foundElements = [];
  if(searchValue.length > 3)
    {
  //console.log("Searching for: " + searchValue);
  var foundAny = false;
  var foundStr = ("The following classes matching \"" + searchValue + "\" were found: ");
  for(let i = 0; i < originalClassText.length; i++)
    {
      
      if(originalClassText[i][0].toLowerCase().includes(searchValue.toLowerCase()))
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
      //alert(foundStr);
      updateFoundSideBar(searchValue);
    }
    }
    else
      {
        alert("Invalid Search");
      }
}

//Drag to scroll
let pos = { x: 0, y: 0, scrollX: 0, scrollY: 0 };
window.addEventListener("mousedown", mouseDownHandler)

function mouseDownHandler()
{
  pos =
  {
    scrollX: window.pageXOffset,
    scrollY: window.pageYOffset,
    x: event.clientX,
    y: event.clientY
  };
  document.getElementById('mainGrid').style.cursor = 'grabbing';
  document.getElementById('tools').style.cursor = 'grabbing';
  document.getElementById('mainGrid').style.userSelect = 'none';
  document.getElementById('tools').style.userSelect = 'none';
  //console.log("you have clicked at point: (" + pos.x + ", " + pos.y + ") Scroll position is " + pos.scrollX + ", " + pos.scrollY);
  document.addEventListener('mousemove', mouseMoveHandler);
  document.addEventListener('mouseup', mouseUpHandler);
}

function mouseMoveHandler()
{
  const dx = event.clientX - pos.x;
  const dy = event.clientY - pos.y;
  
  //Scroll element
  
  //window.pageXOffset = pos.scrollX - dx;
  //window.pageYOffset = pos.scrollY - dy;
  window.scrollTo(pos.scrollX - dx * 1.5, pos.scrollY - dy * 1.5);
}

function mouseUpHandler()
{
  document.removeEventListener('mousemove', mouseMoveHandler);
  document.removeEventListener('mouseup', mouseUpHandler);
  document.getElementById('mainGrid').style.cursor = 'default';
}


//Zoom in and out
var zoom = 1;
var minZoom = 0.6;
var maxZoom = 1.4;
var zoomStep = 0.2;

document.getElementById("zoomIn").addEventListener("click", function() {
  if(zoom < maxZoom)
    {
      zoom += zoomStep;
      document.getElementById("mainGrid").style.transform = "scale(" + zoom + ")";
      document.getElementById("myCanvas").style.transform = "scale(" + zoom + ")";
      zoomFocus();
    }
  
    });
    
document.getElementById("zoomOut").addEventListener("click", function() {
      console.log(zoom + " > " + minZoom + " = " + (zoom > minZoom));
      if (zoom > minZoom) 
      {
        zoom -= zoomStep;
        document.getElementById("mainGrid").style.transform = "scale(" + zoom + ")";
        document.getElementById("myCanvas").style.transform = "scale(" + zoom + ")";
        zoomFocus();
      }
    
    });

document.getElementById("mainGrid").style.transform = "scale(" + 1 + ")";

function zoomFocus()
{
  for(let i = 0; i < box.length; i++)
    {
      if (box[i].classList.contains("clicked"))
        {
          var yCoordsFocus = getCoords(box[i]).top - window.innerHeight / 2;
          var xCoordsFocus = getCoords(box[i]).left - window.innerWidth / 2;
          //console.log("Scrolling to: " + xCoordsFocus + ", " + yCoordsFocus);
          window.scrollTo(xCoordsFocus, yCoordsFocus);
          break;
        } 
    } 
}
//console.log(box[1].classList.add("clicked"));
//console.log(box[1].classList);
//console.log(box[1].classList.contains("clicked"));
//</script>

