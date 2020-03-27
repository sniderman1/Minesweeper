//Welcome to JavaScript Minesweeper
//Made by Seth Snider

//Start/Restart Function +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var startBtn = document.getElementById("startBtn");
startBtn.addEventListener("click", mainFuntion);

//Main function / Beginning function ******************************************************************************************
var squareCount = 1;
var rowCount = 1;
var currentSquare = 0;
var allBoardSquare =[];
var currentStr = 0;
var allBoardStr = [];
var startBtnClick = false;
var gameOver = false;

//When the start button is pressed this is the first function that is ran. There are 480 squares in this game version.
//This funtion includes a for loop that adds 1 to the var squareCount until it reaches 30, which then it adds 1 to rowCount.
//This funtion then runs listSquareAndCreateEventListener which will use the squareCount and rowCount var. 
//After the for loop the functions randomBombPlacer and findEmpty are then executed.
function mainFuntion(){
	//Checks if the start button has been clicked. 
	if(startBtnClick === false){
		startBtnClick = true;
		startBtn.innerHTML = "Restart";
		//Runs this for loop for each one of the 480 square on the board. 
		for(var i = 1; i <= 480; i++){
			//If the squareCount reaches 30 it will add one to the RowCount and set the squareCount back to 1.
			if(squareCount === 30){
				listSquareAndCreateEventListener();
				squareCount = 1;
				rowCount++;
			}
			//If the squareCount is below 30 it will continue to add to the squareCount.
			else{
				listSquareAndCreateEventListener();
				squareCount++;
			}
		}
		//RandomBombPlacer generates the bombs. FindEmpty finds all the squares that are not bombs and are not touching bombs. 
		randomBombPlacer();
		findEmpty();	
		document.getElementById("message").innerHTML = "Get To Sweep'in";
		timer();
	}
	else{
		startBtnClick = false;
		restartGame();
	}
}

//This function uses the squareCount and the rowCount to get the element.id of the ever square. This function is executed with each
//irration of the for loop in the mainFunction.
function listSquareAndCreateEventListener(){
	currentSquare = document.getElementById("container" + rowCount + "square" + squareCount);
	currentStr = "container" + rowCount + "square" + squareCount;
	allBoardStr.push(currentStr);
	currentSquare.setAttribute("onmousedown", "mouseDown(this)");
	currentSquare.setAttribute("onmouseup", "mouseUp(this)");
	allBoardSquare.push(currentSquare);
}

//Bomb generating function *****************************************************************************************************************

var bombSquares = [];
//This funciton randomly picks one of the squares and places a bomb in it.
function randomBombPlacer(){
	for(var i = 0; i < 90; i++){
		squareCount = Math.round(Math.random() * 30);
		rowCount = Math.round(Math.random() * 16);
		currentSquare = "container" + rowCount + "square" + squareCount;
		if(rowCount > 0 && squareCount > 0 && bombSquares.includes(currentSquare) === false){
			bombSquares.push(currentSquare);
			findTouchingSquares();
		}
		else{
			i = i - 1;
		}
	}
	document.getElementById("numberOfMines").innerHTML = bombSquares.length;
	getOccurrence();
}

//Finds square touching bombs ******************************************************************************************************
var squareListMultiple = [];
var squareListOnce = []
var numberOfTimes = 0;
var square1 = 0;
var square2 = 0;
var square3 = 0;
var square4 = 0;
var square5 = 0;
var square6 = 0;
var square7 = 0;
var square8 = 0;

//This function finds all the square touching the bomb square. It uses the squareCurrent and the rowCount numbers to find the squares
//around the currentSquare. 
function findTouchingSquares(){
	var theSquares = []
	if(rowCount > 1){
		if(squareCount > 1){
			square1 = "container" + (rowCount - 1) + "square" + (squareCount - 1);
			theSquares.push(square1);	
		}
		square2 = "container" + (rowCount - 1) + "square" + squareCount;
		theSquares.push(square2);
		if(squareCount < 30){
			square3 = "container" + (rowCount - 1) + "square" + (squareCount + 1);
			theSquares.push(square3);	
		}	
	}
	if(squareCount < 30){
		square4 = "container" + rowCount + "square" + (squareCount + 1);
		theSquares.push(square4);	
	}
	if(rowCount < 16){ 
		if(squareCount < 30){
			square5 = "container" + (rowCount + 1) + "square" + (squareCount + 1);
			theSquares.push(square5);	
		}
		square6 = "container" + (rowCount + 1) + "square" + squareCount;
		theSquares.push(square6);
		if(squareCount > 1){
			square7 = "container" + (rowCount + 1) + "square" + (squareCount - 1);
			theSquares.push(square7);	
		}	
	}
	if(squareCount > 1){
		square8 = "container" + rowCount + "square" + (squareCount - 1);
		theSquares.push(square8);	
	}
	//Pushes all of the squares around the bomb square into two arrays. 
	for(var i = 0; i < theSquares.length; i++){
		if(bombSquares.includes(theSquares[i]) === false){
			//This pushes the touching square into the array once. 
			if(squareListOnce.includes(theSquares[i]) === false){
				squareListOnce.push(theSquares[i]);
			}
			//This pushes the touching square into the array as many times as it occoures. 
			squareListMultiple.push(theSquares[i])				
		}
	}
}

//Finds the number of bombs touching a square*********************************************************************************************
var theFinalNumberList = [];
var touchList = [];
 
//This function uses the squareListOnce and the squareListMultiple to find the number of bombs that are touching a non-bomb square. 
function getOccurrence() {
	for(var i = 0; i < squareListOnce.length; i++){
		//Checks to make sure that squareListOnce[i] is not a bomb.
		if(bombSquares.includes(squareListOnce[i]) === false){
			var count = 0;
			//Adds up how many times squareListOnce[i] appears in squareListMultiple. 
			squareListMultiple.forEach((v) => (v === squareListOnce[i] && count++));
			//Pushes the squareListOnce[i] and the number of times it appears. 
			theFinalNumberList.push([squareListOnce[i], count]);
			//touchList is used in findEmpty to determin if the square is touching a bomb or not. 
			touchList.push(squareListOnce[i]);			
		}
	}
} 

//Finds all of the square that are not bomb or are touching bombs************************************************************************
emptyList = [];

function findEmpty(){
	for(var i = 0; i < allBoardStr.length; i++){
		var item = allBoardStr[i];
		//Checks if the allBoardStr[i] is a bomb or a square touching a bomb. 
		if(touchList.includes(item) === false && bombSquares.includes(item) === false){
			emptyList.push(item);
		}
	}
	
}
// Timer function ***********************************************************************************************************************
var seconds = 0;
var minutes = 0;
var timerFunction = 0;

//The timer is found at the right side of the top of the board. Keeps track of the time from when the start/restart button is clicked
//till when you either win or lose. 
function timer(){
	timerFunction = setInterval(function(){
			if(seconds >= 60){
				seconds = 0;
				minutes = minutes + 1
			}
			else{
				seconds = seconds + 0.1;	
			}
			document.getElementById("min").innerHTML = minutes;
			//This is here just for appearances. If seconds is below 10 it will add a "0" in front of the seconds. 
			if(seconds < 10){
				document.getElementById("sec").innerHTML = "0" + Math.floor(seconds);		
			}
			else{
				document.getElementById("sec").innerHTML = Math.floor(seconds);		
			}	
		}, 100);
}

//Restart Function *********************************************************************************************************************
//Removes all the classes from all the squares, resets all of the arrys, and runs the mainfunction at the end. 
function restartGame(){
	document.getElementById("message").innerHTML = "New Game";
	for(var i = 0; i < allBoardSquare.length; i++){
		var item = allBoardSquare[i];
		item.innerHTML = "";
		item.classList.remove("squareClicked");
		item.classList.remove("bombMarker");
		item.classList.remove("squareBomb");
	}
	clearInterval(timerFunction);
	document.getElementById("min").innerHTML = 0;
	document.getElementById("sec").innerHTML = 00;
	seconds = 0;
	minutes = 0;
	allBoardSquare.length = 0;
	allBoardStr.length = 0;
	squareCount = 1;
	rowCount = 1;
	currentSquare = 0;
	currentStr = 0;
	currentElement = 0;
	markerNumber = 0;
	numberOfClicks = 0;
	gameOver = false;
	bombSquares.length = 0;
	squareListMultiple.length = 0;
	squareListOnce.length = 0;
	numberOfTimes = 0;
	square1 = 0;
	square2 = 0;
	square3 = 0;
	square4 = 0;
	square5 = 0;
	square6 = 0;
	square7 = 0;
	square8 = 0;
	theFinalNumberList.length = 0;
	touchList.length = 0;
	emptyList.length = 0;
	nonBombs.length = 0;
	num = 0;
	touchingList.length = 0;
	emptySquareList.length = 0;
	console.log("Restart Completed");
	mainFuntion();
}
//End of Start/Restart Function ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//Mouse Functions ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//Mouse Down Function ========================================
function mouseDown(element){
	if(gameOver === false){
		if(event.button === 0){
			console.log("Mouse down");
			console.log(element.id);
			if(document.getElementById(element.id).classList.contains("bombMarker") === false)
			document.getElementById("message").innerHTML = ":O";	
		}
	}
}

var currentElement = 0;

//Mouse Up Function =======================================
function mouseUp(element){
	console.log("Mouse Up");
	console.log(element.id);
	currentElement = document.getElementById(element.id);
	if(gameOver === false){
		//If the right mouse button is clicked it will run the markerFunction.  
		if(event.button === 2){
			markerFunction();			
		}
		//Checks if the left mouse button is clicked. 
		if(event.button === 0){
			//If the square clicked has a marker on it then nothing will happen. 
			if(currentElement.classList.contains("bombMarker") === false){
				//If the square is a bomb then it will run the losing function "youDied."
				if(bombSquares.includes(element.id) === true){
					youDied();
					console.log("BOOM");}
				else{
					//If the square is touching a bomb then it will use the theFinalNumberList arry to find how many bombs that square
					//is touching. Then it will add the "squareClicked" class and show the number of bombs that square is touching. 
					if(theFinalNumberList.some(row => row.includes(element.id))=== true){
						var index = theFinalNumberList.findIndex(row => row.includes(element.id));
						if(currentElement.classList.contains("squareClicked") === false){
							currentElement.classList.add("squareClicked");
							currentElement.innerHTML = theFinalNumberList[index][1];
							document.getElementById("message").innerHTML = ":)";
							checkClickedForWin();			
						}
					}
					//If the square is not touching any bombs then it will run the findEmptyTouching function. This will lead to 
					//all the empty squares touching each other and all the bomb touching square touching the empty ones to be shown. 
					else{
						emptySquareList.push(element.id)
						currentStr = element.id;
						document.getElementById("message").innerHTML = ":)";
						findEmptyTouching();	
					}			
				}				
			}
		}		
	}
}
//end of direct mouse funcitons***********************************************************************************************


//This function is for the right button on the mouse. When clicked this function will place a marker on the clicked square. That square
//cannot be left clicked again unless the marker is removed by right clicking the square again. 
var markerNumber = 0;
function markerFunction(){
	//Makes sure that the square has not already been clicked.
	if(currentElement.classList.contains("squareClicked") === false){
		//If the square does not already have a marker then it will place one on it. 
		if(currentElement.classList.contains("bombMarker") === false){
			currentElement.classList.add("bombMarker");
			currentElement.innerHTML = "&#8869";
			markerNumber = markerNumber + 1;	
		}
		//If the square already has a marker it wll be removed. 
		else{
			currentElement.classList.remove("bombMarker");
			currentElement.innerHTML = "";
			markerNumber = markerNumber - 1;	
		}
	}
	//Shows the amount of bombs left minus the number of markers placed. This is displayed at the top of the board. 
	var total = (bombSquares.length - markerNumber)
	document.getElementById("numberOfMines").innerHTML = total;
} 

//Winning funciton ******************************************************************************************************************
var numberOfClicks = 0;
function checkClickedForWin(){
	numberOfClicks = numberOfClicks + 1;
	//Checks if the number of squares clicked equals the number of empty and bomb-touching squares. 
	if(numberOfClicks === (theFinalNumberList.length + emptyList.length)){
		document.getElementById("message").innerHTML = "You Win!";
		alert("You Win!");
		clearInterval(timerFunction);
		gameOver = true;
	}
}

//Losing function *******************************************************************************************************************
function youDied(){
	document.getElementById("message").innerHTML = "You Lose :'( ";
	gameOver = true;
	//Shows all of the bomb squares
	for(var i = 0; i < bombSquares.length; i++){
		document.getElementById(bombSquares[i]).classList.add("squareBomb");
		document.getElementById(bombSquares[i]).innerHTML = "&#164";
	}
	clearInterval(timerFunction);
}

var nonBombs = [];
var num = 0;
var touchingList = [];
var emptySquareList = [];
//If an empty square is click this function will find all of the empty squares touching it to the top, bottom, right, and left.
//This function will also find bomb-touching squares that are touching it on all sides and corrners. The empty squares that are 
//found with this function will be used to find any bomb-touching or empty squares touching it, and so on...
function findEmptyTouching(){
	for(num = 0; num < emptySquareList.length; num++){
		seperateRowCol();
		if(rowCount > 1){
			if(squareCount > 1){
				//Bottom right cornner
				square1 = "container" + (rowCount - 1) + "square" + (squareCount - 1);
				if(emptyList.includes(square1)=== false){
					nonBombs.push(square1);	
				}	 
			}
			//Bottom
			square2 = "container" + (rowCount - 1) + "square" + squareCount;
			nonBombs.push(square2);
			if(emptySquareList.includes(square2) === false && emptyList.includes(square2) === true){
				emptySquareList.push(square2);		
			}
			if(squareCount < 30){
				//Bottom left cornner
				square3 = "container" + (rowCount - 1) + "square" + (squareCount + 1);
				if(emptyList.includes(square3)=== false){
					nonBombs.push(square3);		
				}	
			}	
		}
		if(squareCount < 30){
			//Left
			square4 = "container" + rowCount + "square" + (squareCount + 1);
			nonBombs.push(square4);	
			if(emptySquareList.includes(square4) === false && emptyList.includes(square4) === true){
				emptySquareList.push(square4);	
			}
		}
		if(rowCount < 16){
			if(squareCount < 30){
				//Top left cornner
				square5 = "container" + (rowCount + 1) + "square" + (squareCount + 1);
				if(emptyList.includes(square5)=== false){
					nonBombs.push(square5);		
				}	
			}
			//Top
			square6 = "container" + (rowCount + 1) + "square" + squareCount;
			nonBombs.push(square6);
			if(emptySquareList.includes(square6) === false && emptyList.includes(square6) === true){
				emptySquareList.push(square6);	
			}
			if(squareCount > 1){
				//Top right cornner
				square7 = "container" + (rowCount + 1) + "square" + (squareCount - 1);
				if(emptyList.includes(square7)=== false){
					nonBombs.push(square7);	
				}		
			}	
		}
		if(squareCount > 1){
			//Right
			square8 = "container" + rowCount + "square" + (squareCount - 1);
			nonBombs.push(square8);
			if(emptySquareList.includes(square8) === false && emptyList.includes(square8) === true){
				emptySquareList.push(square8);	
			}
		}	
		nonBombs.push(currentSquare);
	}
	showAllEmpty();
	emptySquareList.length = 0; 
}

//This function uses the string object in the array to get the row number and square number. **************************************************
function seperateRowCol(){
	//the string will look something like this "container1square1" where container is the row number and square is the column number.
	var item = emptySquareList[num];
	//Starting at postion 9 and extracting the 2 characters in postion 10 and 11. If the row number is 10 and above then this will be 
	//a whole number. If not there will be a letter character in the var. 
	var row = item.substr(9,2);
	//Starting at postion 10 and extracting the character in postion 11. 
	var s = item.substr(10,1);
	//If the character in postion 11 is a "s" then only the character in postion 10 will be extracted for the row number. This means that
	//the row number is smaller than 10. 
	if(s === "s"){
		row = item.substr(9,1);
		//The characters in postion 17 and 18 will be used for the column number "squareCount"
		var col1 = item.substr(16,2);
		currentSquare = "container" + row + "square" + col1;
		squareCount = Number(col1);
	}
	else{
		//The characters in postion 18 and 19 will be used for the column number
		var col3 = item.substr(17, 2);
		currentSquare = "container" + row + "square" + col3;
		squareCount = Number(col3);
	}
	rowCount = Number(row);
}

//Adds the "squareClicked" class to all squares that are nonBombs array.
function showAllEmpty(){
	for(var i = 0; i < nonBombs.length; i++){
		var b = document.getElementById(nonBombs[i])
		if(b.classList.contains("squareClicked") === false){
			b.classList.add("squareClicked");
			if(b.classList.contains("bombMarker") === true){
				b.classList.remove("bombMarker");
				b.innerHTML = "";
				markerNumber = markerNumber - 1;
			}
			//If the nonBomb[i] is inclueded in the theFinalNumberList then it will add the number to the square. 
			if(theFinalNumberList.some(row => row.includes(nonBombs[i]))=== true){
				var index = theFinalNumberList.findIndex(row => row.includes(nonBombs[i]));
				b.innerHTML = theFinalNumberList[index][1];
			}
		checkClickedForWin();
		}
	}	
}

//Mouse Functions End ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//Cheat to show all the bombs and make them unclickable with the bombMarker class
function showAllBombs(){
	for(var i = 0; i < bombSquares.length; i++){
		document.getElementById(bombSquares[i]).classList.add("bombMarker");
	}
}