/*jshint esversion: 6 */

var app = angular.module('app-main', ['ngRoute', 'ng-context-menu']);

app.controller('side-nav', function displayMessage($scope, stringService) {
	$scope.message = "Hello World!";
	$scope.transformString = function (input) {
		$scope.output = stringService.processString(input);
	};

	$scope.images = [];

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
	$scope.speed = {
		value: 50,
		options: {
		  floor: 0,
		  ceil: 100,
		  step: 1,
		  minLimit: 10,
		  maxLimit: 90
		}
	};
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
	};

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
	$scope.printImages = function() {
		console.log($scope.images);
	};
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
	};
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
				var fileSelector = document.createElement('input');
				fileSelector.setAttribute('type', 'file');
				fileSelector.setAttribute('accept', 'image/webp, image/gif, image/jpeg, image/png');

			    fileSelector.click();
			    fileSelector.onchange = function(e) {
				    img = new Image();
				    var file = e.target.files[0];

				    var reader = new FileReader();
			        reader.onloadend = function() {
						console.log(reader.result);
						
						img = $scope.s.createImg(reader.result, '');
						img.hide();
						$scope.images.push({"img": img, "name": file.name});
						$scope.$apply();
			        };
			        img = reader.readAsDataURL(file);
			    };
			break;
			case 'G':
				$scope.message = "Export";
			break;
		}
	};

	$scope.toolsVisibility = "";
	$scope.tools_visibility = () => {
		if ($scope.toolsVisibility == "")
			$scope.toolsVisibility = "none";
		else $scope.toolsVisibility = "";
	};

	$scope.settingsVisibility = "";
	$scope.settings_visibility = () => {
		if ($scope.settingsVisibility == "")
			$scope.settingsVisibility = "none";
		else $scope.settingsVisibility = "";
	};

	$scope.dropdownVisibility = "";
	$scope.dropdown_visibility = () => {
		if ($scope.dropdownVisibility == "")
			$scope.dropdownVisibility = "none";
		else $scope.dropdownVisibility = "";
	};

	$scope.openContextMenu = (evt) => {
		evt.preventDefault();
		const time = menu.isOpen() ? 100 : 0;
		menu.hide();
		setTimeout(() => { menu.show(evt.pageX, evt.pageY) }, time);
		document.addEventListener('click', hideContextMenu, false);
	};
	$scope.hideContextMenu = (evt) => {
		menu.hide();
		document.removeEventListener('click', hideContextMenu);
	};
	$scope.inputChanged = () => {
		console.log("Changed!");
	};



	var canvas = document.getElementById("canvas");
	var redraw = true, width = window.innerWidth - 460, height = window.innerHeight - 75;
	var canvasX1 = canvas.offsetLeft, canvasY1 = canvas.offsetTop, canvasX2 = canvasX1+width, canvasY2 = canvasY1+height;
	var colors = ['white', 'black'], colorSelected = 1;
	let img;

	let x = 0;
	let x2 = 360;

	class Layer {
		constructor(image1, image2, speedModifier) {
			this.x = 0;
			this.y = 0;
			this.width = 360;
			this.height = 450;
			this.x2 = this.width;
			this.image1 = image1;
			this.image2 = image2;
			this.speedModifier = speedModifier;
			this.speed = gameSpeed * this.speedModifier;
		}
		
		update() {
			this.speed = gameSpeed * this.speedModifier;
			if (this.x <= -this.width) {
				this.x = this.width;
				// this.x = this.width + this.x - this.speed;
			} if (this.x2 <= -this.width) {
				this.x2 = this.width;
				// this.x2 = this.width + this.x - this.speed;
			}
			this.x = Math.floor(this.x - this.speed);
			this.x2 = Math.floor(this.x2 - this.speed);
		}
		draw() {
			ctx.drawImage(this.image1, this.x, this.y, this.width, this.height);
			ctx.drawImage(this.image2, this.x2, this.y, this.width, this.height);
		}
	}

	let sketch = function(p) {
		var x=0, y=0;
		p.setup = () => {
			// p5.disableFriendlyErrors = true;
			p.createCanvas(width, height);
			p.background("#FFFFFF");	//#f5f5f6
			p.strokeWeight(0.2);
			
		};

		p.draw = () => {
			if ($scope.images) {
				$scope.images.forEach(element => {
					p.image(element.img, 0, 0, element.img.width, element.img.height);					
				});
			}
		};
		p.mouseClicked = () => {};
		p.mouseWheel = (event) => {
			// print(event.delta);
			if (event.delta > 0 || settings[0].value > 1)
			settings[0].value += event.delta/2;
			// resize();
			//return false;
		};
		p.mouseMoved = () => {};
		p.mouseDragged = (event) => {};
		p.mousePressed = () => {};
		p.mouseReleased = () => {};
		p.doubleClicked = () => {};
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
		};
		p.requestPointerLock = () => {};
		p.exitPointerLock = () => {};
	};

	$scope.s = new p5(sketch, 'canvas');
});
