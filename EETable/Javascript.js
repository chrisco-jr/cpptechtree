
/*<!--<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>-->
<!--function getContent(filename) {
    return HtmlService.createTemplateFromFile(filename).getRawContent();
}-->

<script>*/

<!--<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>-->
<!--function getContent(filename) {
    return HtmlService.createTemplateFromFile(filename).getRawContent();
}-->

<script>
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

//Variables for paths and elements
var uniquePaths = [];
var foundElements = [];
var futurePaths = [];
var futurePathRawValues = [];
var uniqueFuturePaths = [];
var depth = 1;

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

//Iterates through classBoxes, adds and applies event listeners to update appearance of boxes, lines, colors, etc.
for (let i = 0; i < box.length; i++) {
  var x = 0;
  box[i].addEventListener("click", function changeColor() {
  if (x==0) 
  {
    //Updates CSS style when clicked
    box[i].classList.add("clicked");
    //Clears CSS formatting of boxes applied after a search
    for(let j = 0; j < foundElements.length; j++)
      {
       box[foundElements[j]].classList.remove("found"); 
       box[foundElements[j]].classList.remove("currentSearch");
      }
    x = 1;
  } 
    else 
  {
    //Updates CSS style when box clicked again
    box[i].classList.remove("clicked");
    x = 0;
  }   
});

  box[i].addEventListener("click", function drawLines()
  {
    //When classBox is unselected, clears all lines and resets paths and CSS styles applied
    if(x==0)
    {
      ctx.clearRect(0, 0, canvasW, canvasH);
      paths = [];
      pathRawValues = [];
      uniquePaths = [];
      futurePaths = [];
      futurePathRawValues = [];
      uniqueFuturePaths = [];
      for (let o = 0; o < box.length; o++)
        {
          box[o].classList.remove("hide");
          box[o].classList.remove("disabled");
          box[i].classList.remove("found");
        }
    }
    else //When classBox is clicked
    {
      //Checks if zoom is nonstandard, sets to standard amount when classBox is selected
      if (zoom != 1)
        {
          zoom = 1;
          document.getElementById("mainGrid").style.transform = "scale(" + zoom + ")";
          document.getElementById("myCanvas").style.transform = "scale(" + zoom + ")";
          let yCoords = getCoords(box[i]).top - window.innerHeight / 2;
          let xCoords = getCoords(box[i]).left - window.innerWidth / 2;
          window.scrollTo(xCoords, yCoords);
        }
      
      //Updates all paths/element values
      findPrereqPaths(i);
      findFuturePaths(i, depth);
      uniquePaths = [...new Set(pathRawValues)];
      uniquePaths.sort(function(a, b){return b-a});
      uniqueFuturePaths = [...new Set(futurePathRawValues)];
      uniqueFuturePaths.sort(function(a, b){return a-b});
  
      updateSideBar(i);
      
      //Draws Lines for prereqs and futureReqs
      for (let k = 0; k < paths.length; k++)
        {
          drawLineBetweenElements(box[paths[k][0]], box[paths[k][1]], false);
          
        }
      for (let k = 0; k < futurePaths.length; k++)
        {
          drawLineBetweenElements(box[futurePaths[k][1]], box[futurePaths[k][0]], true);
        }
      //Updates CSS styles for all irrelevant classBoxes
      hideUnconnectedBoxes(uniquePaths, uniqueFuturePaths);
      if (uniquePaths.length == 0)
        {
          box[i].classList.remove('hide');
        }
      disableButtonsExceptParam(i);
    }
  });
}

//Iterates through all boxes, if not within a Prerequisite Path hides irrelevant classes
function hideUnconnectedBoxes(uniquePaths, uniqueFuturePaths)
{
  for(let i = 0; i < box.length; i++)
    {
      var hideFlag = true;
      for(let j = 0; j < uniquePaths.length; j++)
      {
        if(i == uniquePaths[j])
          {
            hideFlag = false;
          }
      }
      for(let j = 0; j < uniqueFuturePaths.length; j++)
      {
        if(i == uniqueFuturePaths[j])
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

//Disables ability to click all other Classboxes when one is selected
function disableButtonsExceptParam(param)
{
  for (let i = 0; i < box.length; i++)
    {
      box[i].classList.add("disabled");
    }
  box[param].classList.remove("disabled");
  
}

//Draws either solid or dashed lines between two boxes 'a' and 'b'
function drawLineBetweenElements(a, b, isDashed)
{
  let yCoords1 = getCoords(a).top - 0;
  let xCoords1 = getCoords(a).left + 75;
  let yCoords2 = getCoords(b).top - 0;
  let xCoords2 = getCoords(b).left + 75;
  //console.log("(" + xCoords1 + "," + yCoords1 + ")")
  let midwayX = (xCoords1 + xCoords2)/2;
  let midwayY = (yCoords1 + yCoords2)/2;
  
  var ctx = canvas.getContext("2d");
  
  
  ctx.beginPath();
  if (isDashed)
    {
      
      ctx.setLineDash([5, 15]);
      ctx.moveTo(xCoords1, yCoords1);
      ctx.lineTo(xCoords2, yCoords2);
      ctx.stroke();
    }
  else
    {
      ctx.setLineDash([]);
      canvasArrow(ctx, xCoords2, yCoords2, midwayX, midwayY, isDashed);
      ctx.stroke();
      ctx.moveTo(xCoords1, yCoords1);
      ctx.lineTo(midwayX, midwayY);
      ctx.stroke();
    }
}

//for solid lines only, implements an arrowhead to better indicate flow
function canvasArrow(context, fromx, fromy, tox, toy, isDashed) {
  
  var headlen = 8; // length of head in pixels
  var dx = tox - fromx;
  var dy = toy - fromy;
  var angle = Math.atan2(dy, dx);
  
  context.moveTo(fromx, fromy);
  context.lineTo(tox, toy);
  
  context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
  context.moveTo(tox, toy);
  context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
}

//Helper Function to get coordinates of a classbox
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


let paths = [];
let pathRawValues = [];

//Helper function to determine all prerequisites and prerequisites of prerequisites for a given classIndex
function findPrereqPaths(classIndex)
{
  var counter = 0;
  while(counter < box.length)
    {
      let preReqs = preRequisites[classIndex][0];
      let name = className[counter][0];
      //if a valid prerequisite is found, updates all lists
      if (preReqs.includes(name))
            {
              let addPaths = [classIndex, counter];
              paths.push(addPaths);

              pathRawValues.push(classIndex);
              pathRawValues.push(counter);
              findPrereqPaths(counter);
            }
      counter++;
    }
}


//Helper function to determine all future requisite classes for a classIndex at a given depth
function findFuturePaths(classIndex, depth)
{
 
  for (let i = 0; i < depth; i++)
    {
      var counter = 0;
      while(counter < box.length)
        {
          let futureReqs = preRequisites[counter][0];
          let name = className[classIndex][0];
          if (futureReqs.includes(name))
            {
              let addPaths = [classIndex, counter];
              futurePaths.push(addPaths);

              futurePathRawValues.push(classIndex);
              futurePathRawValues.push(counter);
              findFuturePaths(counter, depth - 1);
             }
      counter++;
    }
    }
  
}

//Sets Sidebar toggle behaviors
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

//Sets Legend/Key toggle behaviors
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("toggle2").addEventListener("click", () => {
    const keyEl = document.getElementsByClassName("legend")[0];
    keyEl.classList.toggle("legend--isHidden");

    document.getElementById("toggle2").innerHTML = keyEl.classList.contains(
      "legend--isHidden"
    )
      ? "Show Key"
      : "Hide Key";
  });
});

//Helper function that updates internal CSS of sidebar to display information for a selected Class Index
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
  if (addStr == "")
    {
      addStr  += "<br>See Class Information";
    }
  sidebarPrereqs[0].innerHTML = ("-All Classes Needed-" + addStr);
  //preRequisites[classIndex][0]
  addStr = "";
  for(let i = 0; i < uniqueFuturePaths.length; i++)
  
  {
      if(uniqueFuturePaths[i] == classIndex)
        {
          continue;
        }
      addStr += "<br>" + className[uniqueFuturePaths[i]];
    }
    if (addStr == "")
    {
      addStr  += "<br>None Found";
    }
  sidebarPrereqs[0].innerHTML = (sidebarPrereqs[0].innerHTML += "<br><br>--Prerequisite for-- " + addStr);
}

//Updates Sidebar to display buttons corresponding for any found searches of classes
function updateFoundSideBar(searchValue)
{
  foundElements.sort(function(a, b){return a-b});
  foundElements = [...new Set(foundElements)];
  console.log(foundElements);
  let sidebarclassSelected = document.getElementsByClassName("classSelected");
  let sidebarPrereqs = document.getElementsByClassName("prereqList");
  sidebarclassSelected[0].textContent = "Search for: " + searchValue;

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
        box[foundElements[j]].classList.remove("currentSearch");
      }
  for(let i = 0; i < originalClassText.length; i++)
    {
      if (box[i].classList.contains("clicked"))
        {
          box[i].click();
        }
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

//</script>

