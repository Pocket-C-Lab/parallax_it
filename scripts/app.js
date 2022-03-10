var app = angular.module('app-main', ['ngRoute', 'ng-context-menu']);

app.controller('side-nav', function displayMessage($scope) {
	$scope.message = "Hello World!";
	$loadingMessage = "Loading...";

	$scope.images = [];
	$scope.totalImages = 0;
	$scope.animationPlay = false;
	$scope.animationSpeed = 10;

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
		K: ['leaf cutter', 'packer', 'unpacker'],
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

	var settings = 
		[
		 {name:'size', value:5, type:'number'},
		 {name:'width', value: 0, type:'number'},
		 {name:'height', value: 0, type:'number'},
		 {name:'bg-color', value:'black', type:'text'},
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
			case 'Layers':
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
						img = $scope.p.createImg(reader.result, '', '', function() {
							console.log(img.elt.width, img.elt.height);
							console.log(settings[1].value, settings[2].value);
							if (settings[1].value == 0 && settings[2].value == 0) {
								settings[1].value = img.elt.width;
								settings[2].value = img.elt.height;
							}
							img.hide();
							console.log(file);
							$scope.images.push(new Layer($scope.totalImages++, file.name, file.type, img, img, $scope.totalImages));
							if (img.width > width) {width = img.width; $scope.p.resizeCanvas(width, height, true);}
							if (img.height > height) {height = img.height; $scope.p.resizeCanvas(width, height, true);}
							$scope.$apply();
						});
			        };
			        img = reader.readAsDataURL(file);
			    };
			break;
			case 'Speed':
				$scope.message = "Speed";
			break;
			case 'Save':
				$scope.message = "Save";
			break;
			case 'Export':
				$scope.message = "Export";
			break;
		}
	};
	$scope.Log = function(message) {
		console.log(message);
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
	$scope.exportLayerId = -1;
	$scope.setExportLayerId = (id) => {
		$scope.exportLayerId = id;
		console.log($scope.exportLayerId, id);
	}
	$scope.exportGif = () => {
		console.log("exportGif!", $scope.images);
		if ($scope.images.length > 0) {
			$scope.images.forEach(element => {
				element.reset();
			});
		
			recording = true;
			$scope.animationPlay = true;
			$scope.loadingMessage = "Loading...";
		} else {
			$scope.loadingMessage = "Add images first!";
		}
	};
	
	// Gif Export Logic Start
	function setupGif() {
		gif = new GIF({
			workers: 5,
			quality: 1,
			// width: settings[1].value,
			// height: settings[2].value
		});
		gif.on('finished', function(blob) {
			window.open(URL.createObjectURL(blob));
		});
	}
	function addGifFrame() {
		gif.addFrame(cnv.elt, {
			delay: 20, // 20 is the minimum
			copy: true
		});
	}
	function renderGif() {
		gif.render();
		console.log("Gif Rendering!");
	}
	// Gif Export Logic

	function flipImage(img) {
		var imginv;
		let c = document.createElement("canvas");
		c.style.width = img.width;
		c.style.height = img.height;
		c.width = img.width;
		c.height = img.height;
		let ctx = c.getContext("2d");
		ctx.save();
		ctx.translate(img.width, 0);
		ctx.scale(-1, 1);
		ctx.drawImage(img.elt, 0, 0);	
		ctx.restore();
		
		// console.log(img.src = ctx.getImageData(0, 0, img.width, img.height).data);
		// imginv = $scope.p.createImg(img.width, img.height);
		// imginv.elt.src = c.toDataURL();
		// console.log(imginv.width, imginv.height, imginv.elt);

		imginv = $scope.p.createImg(c.toDataURL(), img.width, img.height, (e) => {
			console.log(e);
			imginv.hide();
			console.log("Finish!");
		});
		
		return imginv;
	}

	
	class Layer {
		constructor(id, name, type, image1, image2, speedModifier) {
			this.id = id;
			this.name = name;
			this.type = type;
			this.visible = true;
			this.x = 0;
			this.y = 0;
			this.width = image1.width;
			this.height = image1.height;
			this.x2 = this.width;
			if (this.type == "image/gif") {
				this.img = $scope.p.loadGif(image1.elt.src);
				this.imginv = $scope.p.loadGif(image2.elt.src);
			} else {
				this.img = image1;
				this.imginv = flipImage(image2);
				// this.imginv = image2;
			}
			this.speedModifier = speedModifier;
			this.speed = (angular.isUndefined($scope.animationSpeed)? 10: $scope.animationSpeed) * this.speedModifier;
		}
		
		update() {
			let temp = (this.speedModifier * 0.1);
			this.speed = (angular.isUndefined($scope.animationSpeed)? 10: $scope.animationSpeed) * temp;
			if (this.x <= -this.width) {
				this.x = this.width;
				// this.x = this.width + this.x - this.speed;
			} if (this.x2 <= -this.width) {
				this.x2 = this.width;
				// this.x2 = this.width + this.x - this.speed;
			}
			this.x = Math.ceil(this.x - this.speed);
			this.x2 = Math.ceil(this.x2 - this.speed);

			console.log(this.width, this.height);
			if (this.id == $scope.exportLayerId && this.x2 <= -this.width) {
				renderGif();
				recording = false;
				$scope.animationPlay = false;
			}
		}

		reset() {
			this.x = 0;
			this.x2 = width;
		}

		draw() {
			$scope.p.image(this.img, this.x, this.y, this.width, this.height);
			$scope.p.image(this.imginv, this.x2, this.y, this.width, this.height);
		}
	}


	var canvas = document.getElementById("canvas");
	var redraw = true, width = 0, height = 0;
	// var redraw = true, width = window.innerWidth - 460, height = window.innerHeight - 75;
	var canvasX1 = canvas.offsetLeft, canvasY1 = canvas.offsetTop, canvasX2 = canvasX1+width, canvasY2 = canvasY1+height;
	var colors = ['white', 'black'], colorSelected = 1;
	let img;

	var cnv, gif, recording = false;

	let sketch = function(p) {
		p.setup = () => {
			// p5.disableFriendlyErrors = true;
			cnv = p.createCanvas(width, height);
			p.background("#FFFFFF");	//#f5f5f6
			p.strokeWeight(0.2);
		
			setupGif();
		};

		p.draw = () => {
			p.clear();
			if ($scope.images) {
				$scope.images.forEach(element => {
					if ($scope.animationPlay) element.update();
					if (element.visible) element.draw();									
				});
			}

			if (recording) {
				addGifFrame();
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
			return true;
		};
		p.requestPointerLock = () => {};
		p.exitPointerLock = () => {};
	};

	$scope.p = new p5(sketch, 'canvas');
});

app.config(function($routeProvider) {
	$routeProvider
	.when("/", {
		templateUrl : "pages/export.htm"
	})
	.when("/animatedShapes", {
		templateUrl : "pages/animated_shapes.htm"
	})
	.when("/openDating", {
		templateUrl : "pages/open_dating.htm"
	})
	.when("/pixels", {
		templateUrl : "pages/pixels.htm"
	})
	.when("/work", {
		templateUrl : "pages/work_profile.htm"
	})
	.when("/test", {
		templateUrl : "pages/test2.htm"
	})
	.when("/credits", {
		templateUrl : "pages/credits.htm"
	});
});