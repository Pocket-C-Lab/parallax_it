var app = angular.module('app-main', ['ngRoute', 'ng-context-menu']);

app.controller('side-nav', function displayMessage($scope, stringService) {
	$scope.message = "Hello World!";
	$scope.transformString = function (input) {
		$scope.output = stringService.processString(input);
	}

	var brush = {
		name: "brush",
		opacity: 1,
		size: 5,
		color: "black"
	};

	// tools logic starts here...
	var tools = 
		['J', 'K', 'L', 'M',
		 'N', 'O', 'P', 'Q']
	;
	$scope.selected_tool = 'K';
	$scope.tool_options = {
		J: ['line', 'pen', 'pencil'],
		K: ['select'],
		L: ['bucket fill', 'color picker', 'color wheel'],
		M: ['select'],
		N: ['select'],
		O: ['triangel', 'square', 'circle'],
		P: ['select'],
		Q: ['select'],
	};
	$scope.selectTool = (evt, s) => {
		switch(evt.which) {
	        case 1:
	            increment(); // left click
	            break;
	        case 2:
	            // in case you need some middle click things
	            break;
	        case 3:
	        	// right click
	            break;
	        default:
	            alert("you have a strange mouse!");
	            break;
	    }
		$scope.selected_tool = s;
		console.log($scope.selected_tool + " " + $scope.tool_options[$scope.selected_tool]);
	}

	// tools logic starts here...
	var settings = 
		[
		 {name:'size', value:5, type:'number'},
		 {name:'width', value:'100%', type:'text'},
		 {name:'height', value:'100%', type:'text'},
		 {name:'color', value:'black', type:'text'},
		 {name:'grid', value: true, type:'checkbox'}
		]
	;
	var selected_setting = 'J';

	// tools login ends here...
	$scope.brush = brush;
	$scope.tools = tools;
	$scope.settings = settings;
	$scope.o_oO = function(i) {
		switch(i) {
			case 'C':
				$scope.message = "Option 1";
			break;
			case 'D':
				$scope.message = "Option 2";
			break;
			case 'H':
				$scope.message = "Option 3";
			break;
			case 'G':
				$scope.message = "Option 4";
			break;
		}
	}
	$scope.o_oF = function(i) {
		switch(i) {
			case 'C':
				$scope.message = "New File";
			break;
			case 'D':
				$scope.message = "Open File";

			break;
			case 'H':
				$scope.message = "Import";
				console.log(i);
				var fileSelector = document.createElement('input');
				fileSelector.setAttribute('type', 'file');
				fileSelector.setAttribute('accept', 'image/gif, image/jpeg, image/png');

			    fileSelector.click();
			    fileSelector.onchange = function(e) {
				    // img = new Image();
				    var file = e.target.files[0];

				    var reader = new FileReader();
			        reader.onloadend = function() {
			             img.src = reader.result;
			        }
			        reader.readAsDataURL(file);


			        var newWindow = window.open("", "_blank", "height=56,width=56,status=yes,toolbar=no,menubar=no,location=no");  
			        
			        newWindow.document.write("<canvas id='imagePlaceholder'>Canvas not supported!</canvas>");
			        var canvas = newWindow.document.getElementById("imagePlaceholder");
			        var ctx = canvas.getContext("2d");

			        ctx.drawImage(img, 0, 0);
			        // console.log(ctx.getImageData(0, 0, 56, 56).data);
			        dest = ctx.getImageData(0, 0, img.width, img.height).data;
			        console.log(dest);
			        newWindow.close();
			        draw = true;
			    }
			break;
			case 'G':
				$scope.message = "Export";
			break;
		}
	}

	$scope.toolsVisibility = "";
	$scope.tools_visibility = () => {
		if ($scope.toolsVisibility == "")
			$scope.toolsVisibility = "none";
		else $scope.toolsVisibility = "";
	}

	$scope.settingsVisibility = "";
	$scope.settings_visibility = () => {
		if ($scope.settingsVisibility == "")
			$scope.settingsVisibility = "none";
		else $scope.settingsVisibility = "";
	}

	$scope.dropdownVisibility = "";
	$scope.dropdown_visibility = () => {
		if ($scope.dropdownVisibility == "")
			$scope.dropdownVisibility = "none";
		else $scope.dropdownVisibility = "";
	}

	$scope.openContextMenu = (evt) => {
		evt.preventDefault();
		const time = menu.isOpen() ? 100 : 0;
		menu.hide();
		setTimeout(() => { menu.show(evt.pageX, evt.pageY) }, time);
		document.addEventListener('click', hideContextMenu, false);
	}
	$scope.hideContextMenu = (evt) => {
		menu.hide();
		document.removeEventListener('click', hideContextMenu);
	}
	$scope.inputChanged = () => {
		console.log("Changed!");
	}


	var canvas = document.getElementById("canvas");
	var redraw = true, width = window.innerWidth - 460, height = window.innerHeight - 75;
	var canvasX1 = canvas.offsetLeft, canvasY1 = canvas.offsetTop, canvasX2 = canvasX1+width, canvasY2 = canvasY1+height;
	var pixels = new Array(), pixelRow=0;
	var colors = ['white', 'black'], colorSelected = 1;

	let sketch = function(p) {
		var x=0, y=0;
		p.setup = () => {
			p5.disableFriendlyErrors = true;
			p.createCanvas(width, height);
			p.background("#FFFFFF");	//#f5f5f6
			p.strokeWeight(0.2);

			pixels.push(new Array());
			while (y < height) {
				pixels[pixelRow].push(new PixelRec(p, x, y, settings[0].value, settings[4].value));
				if (x > width) {
					x=0;
					y+=settings[0].value;
					pixels.push(new Array());
					pixelRow++;
				} else {
					x+=settings[0].value;
				}
			}
			for (var i=0; i<pixels.length; i++) {
				for (var j=0; j<pixels[i].length; j++) {
					pixels[i][j].resize(settings[0].value);
					pixels[i][j].draw();
				}
			}
			redraw = false;
		}

		p.draw = () => {
			if (redraw) {
				let a = (p.mouseX)/settings[0].value;
				let b = (p.mouseY)/settings[0].value;
				a = parseInt(a);
				b = parseInt(b);
				pixels[b][a].draw();
				redraw = false;
			}
		}
		p.mouseClicked = () => {
			canvasClick();
	  	}
		p.mouseWheel = (event) => {
			// print(event.delta);
			if (event.delta > 0 || settings[0].value > 1)
			settings[0].value += event.delta/2;
			// resize();
			//return false;
		}
		p.mouseMoved = () => {}
		p.mouseDragged = (event) => {
			// for (var i=0; i<pixels.length; i++) {
			// 	for (var j=0; j<pixels[i].length; j++) {
			// 		pixels[i][j].click();
			// 	}
			// }
			canvasClick();
		}
		p.mousePressed = () => {}
		p.mouseReleased = () => {}
		p.doubleClicked = () => {}
		p.keyTyped = () => {
			switch(p.key) {
				case 'z':
					colorSelected = 0;
					break;
				case 'x':
					colorSelected = 1;
					break;
			}
			return false;
		}
		p.requestPointerLock = () => {}
		p.exitPointerLock = () => {}

		canvasClick = () => {
			if (event.x > canvasX1 && event.y > canvasY1
				 && event.x < canvasX2 && event.y < canvasY2) {
					let a = (p.mouseX)/settings[0].value;
					let b = (p.mouseY)/settings[0].value;
					a = parseInt(a);
					b = parseInt(b);
					pixels[b][a].click(colors[colorSelected]);
					redraw = true;
				}
		}
		resize = () => {
			// resize the canvas according to the zoom level

			// draw the resized canvas
			for (var i=0; i<pixels.length; i++) {
				for (var j=0; j<pixels[i].length; j++) {
					pixels[i][j].resize(settings[0].value);
					pixels[i][j].draw();
				}
			}
			redraw = false;
		}
	};

	$scope.s = new p5(sketch, 'canvas');
});

// app.directive( "ngContextmenu", function(){
//     contextMenu = {replace: false};
//     contextMenu.restrict = "AE";
    
//     contextMenu.scope = {"visible": "="};
//     contextMenu.link = function( $scope, lElem, lAttr ){
//         lElem.on("contextmenu", function (e) {
                
//                 e.preventDefault();
            
//                 console.log("Element right clicked.");
//                 $scope.$apply(function () {
//                      $scope.visible = true;
//                 })
            
                
      
//         });
//         lElem.on("mouseleave", function(e){
         
//                 console.log("Leaved the div");
//                  console.log("Element right clicked.");
//                 $scope.$apply(function () {
//                      $scope.visible = false;
//                 })
         
//         });
//     };
//     return contextMenu;
// });
