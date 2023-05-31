/*<!--<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>-->
<!--function getContent(filename) {
    return HtmlService.createTemplateFromFile(filename).getRawContent();
}-->

<script>*/

const canvasWidth = 2500;
const canvasHeight = 1200;
const box = document.getElementsByClassName("classBox");

const originalText = [];
const className = [];
const preRequisites = [];
const boxClicked = [];
let classNameRegex = /(?<=\>).*(?=\s-)/;
let preReqRegex = /(?<=Prerequisites:\s).+(?=\<)/;


for (let i = 0; i < box.length; i++)
  {
    var contents = box[i].innerHTML
    originalText.push(contents);
    
 className.push(contents.match(classNameRegex));  
   
    let preReqs = contents.match(preReqRegex);
    //console.log(preReqs);
    //let preReqsArray = [preReqs[0].split(", ")];
    preRequisites.push(preReqs);
  }
//console.log(originalText);
//console.log(className);
//console.log(preRequisites);
/*console.log(className[0][0]);
console.log(preRequisites[3][0]);
let var1 = preRequisites[3][0];
let var2 = className[0][0];
console.log(typeof(var1));
console.log(var1.includes(var2));*/
/*function colorChange()
{
    box[i].style.backgroundColor = 'salmon';
    box[i].style.color = 'white';
}*/
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
    console.log('added clicked class to element' + box[i]);
    x = 1;
  } 
    else 
  {
    console.log('removed clicked class from element' + box[i]);
    box[i].classList.remove("clicked");
    //box[i].innerHTML = originalText[i];
    x = 0;
  }   
});
  /*box[i].addEventListener("click", function drawLines()
  {
    var canvas = document.querySelector('canvas'),
    ctx = canvas.getContext('2d');
    if(x==0)
    {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    }
    else
    {
      for(let j = 0; j < box.length; j++)
        {
          //if(preRequisites[i][0] !== null && className[j][0] !== null)
           {
          let preReqs = preRequisites[i][0];
          let name = className[j][0];
          
          if (preReqs.includes(name))
            {
              drawLineBetweenElements(box[i], box[j]);
              //drawLines();
            }
           }
        }
    }
  });*/
  box[i].addEventListener("click", function drawLines()
  {
    var canvas = document.querySelector('canvas'),
    ctx = canvas.getContext('2d');
    if(x==0)
    {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      paths = [];
      pathRawValues = [];
      uniquePaths = [];
      for (let o = 0; o < box.length; o++)
        {
          box[o].classList.remove("hide");
          box[o].classList.remove("disabled");
        }
    }
    else
    {
      findPrereqPaths(i);
      uniquePaths = [...new Set(pathRawValues)];
      console.log(paths);
      console.log(uniquePaths);
      for (let k = 0; k < paths.length; k++)
        {
          drawLineBetweenElements(box[paths[k][0]], box[paths[k][1]]);
        }
      hideUnconnectedBoxes(uniquePaths);
      if(uniquePaths.length == 0)
      {
        box[i].classList.remove("hide")
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
/*function changeColor() {
  var x = 0;
  if (x == 0) {
    box[i].classList.add("clicked");
    x = 1;
  } else {
    box[i].classList.remove("clicked");
    x = 0;
  }
}*/

function getCenterOfElement(el) {
    var bounds = el.getBoundingClientRect();
    //console.log("x:" + (bounds.left + bounds.width/2.0));
    //console.log("y:" + (bounds.left + bounds.width/2.0));
    return {x:bounds.left + bounds.width/2.0,
            y:bounds.top + bounds.height/2.0};
}

function drawLineBetweenElements(a, b)
{
  let yCoords1 = getCoords(a).top - 25;
  let xCoords1 = getCoords(a).left + 75;
  let yCoords2 = getCoords(b).top - 25;
  let xCoords2 = getCoords(b).left + 75;
  let c = document.getElementById("myCanvas");
  let ctx = c.getContext("2d");
  ctx.beginPath();
  ctx.moveTo(xCoords1, yCoords1);
  ctx.lineTo(xCoords2, yCoords2);
  ctx.stroke();
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
//</script>

