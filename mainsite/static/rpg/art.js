var selectedColor = 0;
var selectedObject = "player";
var selectedSprite = "runDownOne";

// The animation to display
var selectedAnimation = 0;
// Sprite in animation to show
var selectedAnimationSprite = 0;

var animations = [
	["runSideOne", "runSideTwo"],
	["runUpOne", "runUpTwo"],
	["runDownOne", "runDownTwo"],
	["attackDown", "runDownOne"],
	["stand"],
	["dialog"]
];

var hoverSprites =	{

	player: {},
	enemyOne: {
		attackDown: {
			object: "enemyOne",
			sprite: "runDownOne"
		}
	}

}

var Art = Class({
	canvas: null,
	ctx: null,

	w: 600,
	h: null,

	// The offset to draw the canvas
	offsetX: 0,
	offsetY: 0,

	// The number of pixels wide and high
	size: 0,
	// The size of a pixel the player can draw
	pixelSize: 0,

	// Mouse position
	mouseX: 0,
	mouseY: 0,

	// the different bars
	colorBar: null,
	saturationBar: null,
	brightnessBar: null,

	// The canvases inside the buttons that show the image
	spriteCanvases: {},
	objectCanvases: {},

	// the animation display coordinates
	animationDisplay: {
		x: 0,
		y: 0,
		w: 0,
		h: 0
	},
	// The interval between switching sprites
	animationInterval: null,

	// The buttons
	copyButton: null,
	mirrorButton: null,

	// Status variables
	isErasing: false,
	isCopying: false,
	isClickingCancel: false,

	// Used when the user copies a sprite
	// The object ot copy to
	copyObject: null,
	copySprite: null,

	init: function(p) {

		// Gets canvas and ctx
		this.canvas = $("#art-canvas");
		this.ctx = this.canvas[0].getContext("2d");

		// Sets height
		this.h = (this.canvas.height() / this.canvas.width()) * this.w

		// Sets inner dimension
		this.canvas[0].width = this.w;
		this.canvas[0].height = this.h;

		// Sets the size
		this.size = p.size

		// Sets offsets and pixelSize
		// Rounded so the canvas doesn't have to render anti-aliasing and is faster
		this.offsetX = Math.round(this.w * (1/10));
		this.offsetY = Math.round(this.h * (1/20));
		this.pixelSize = Math.round((this.h - 2 * this.offsetY) / this.size);
		
		// The x coord of everything beside the canvas
		x = Math.round(this.offsetX + this.pixelSize * this.size + 30);

		// Creates the bars
		this.colorBar = new ColorBar({
			x: x, 
			y: this.offsetY, 
			w: 200, 
			h: 20,
			img: $("#gradiant")[0]
		});

		this.saturationBar = new ColorBar({
			x: x, 
			y: this.offsetY + 30, 
			w: 200, 
			h: 20,
			img: null
		});

		this.brightnessBar = new ColorBar({
			x: x,
			y: this.offsetY + 60,
			w: 200,
			h: 20,
			img: null
		});

		// Creats the buttons
		this.copyButton = new Button({
			x: x,
			y: this.offsetY + 90,
			w: 200,
			h: (this.h - (this.offsetY + 90)) / 3 - 20,
			text: "Copy Sprite",
			textColor: "#ffffff",
			textY: null,
			font: "'Press Start 2P'",
			fontSize: 15,
			color: "#000000",
			hoverColor: "#333333",
			onClick: function(){
				art.isCopying = !art.isCopying;

				// Saves the selected object and sprite so that they will be copied into
				art.copyObject = selectedObject;
				art.copySprite = selectedSprite;
			}
		});

		this.mirrorButton = new Button({
			x: x,
			y: this.copyButton.y + this.copyButton.h + 10,
			w: 200,
			h: this.copyButton.h,
			text: "Mirror",
			textColor: "#ffffff",
			textY: null,
			font: "'Press Start 2P'",
			fontSize: 15,
			color: "#000000",
			hoverColor: "#333333",
			onClick: function() {
				art.mirrorSprite();
			}
		})

		// Sets the animation display coordinates
		this.animationDisplay.x = x,
		this.animationDisplay.y = Math.round(this.mirrorButton.y + this.mirrorButton.h + 10);
		this.animationDisplay.w = 200;
		this.animationDisplay.h = Math.round(this.mirrorButton.h);

		// Sets the offset and pixel size for the animation display
		if (this.animationDisplay.w > this.animationDisplay.h){
			this.animationDisplay.pixelSize = Math.round(this.animationDisplay.h / this.size);
			this.animationDisplay.offsetX = Math.round((this.animationDisplay.w - this.animationDisplay.h) / 2);
			this.animationDisplay.offsetY = 0;

		}else {
			this.animationDisplay.pixelSize = Math.round(this.animationDisplay.w / this.size);
			this.animationDisplay.offsetY = (this.animationDisplay.h - this.animationDisplay.w) / 2;
			this.animationDisplay.offsetX = 0;
		}

		// Creates the cancel button when copying
		text = "Cancel"
		this.ctx.font = "20px Arial"

		this.copyCancelButton = new Button({
			x: (this.w - this.ctx.measureText(text).width) / 2,
			y: this.h / 2,
			w: this.ctx.measureText(text).width,
			h: 20,
			color: null,
			text: text,
			textY: null,
			font: "'Arial'",
			fontSize: 20,
			textColor: "#000000",
			onClick: function() {
				art.isClickingCancel = true;
			}
		})

		// Sets the button's colors
		colorButtons = $("#color-btns");
		colorButtons.html("");

		for (i = 0; i < colors.length; i++){

			// Creates button for the color
			div = $("<a class='btn btn-lg'></a>");
			colorButtons.append(div);

			// Selected div to show when selected
			selectedDiv = $("<div class='selected-div'></div>");
			div.append(selectedDiv);
			
			// Sets the text color so it is visible
			if (colors[i].bright < 128){
				div.css("color", "#ffffff");
			}else {
				div.css("color", "#000000");
			}

			// Sets teh background color
			div.css("background-color", colors[i].hex);
			div.append(colors[i].hex);

			div.click({colorIndex: i}, function(event){

				art.selectColor(event.data.colorIndex);
			})
		}

		// Creates the eraser button
		eraserDiv = $("<a class='btn btn-lg' id='eraser'>Eraser</a>");
		eraserDiv.click(function(event) {
			art.selectColor("Eraser");
		})
		eraserDiv.css("background-color", "#66ccff");
		eraserDiv.css("color", "#ffffff");
		colorButtons.append(eraserDiv);

		// Adds the sprite buttons
		this.changeSpriteButtons();

		// Creates the object button groups
		objectButtonGroup = $("#art-objects-btns");
		for (i in sprites){

			// Creates button
			button = $("<a class='btn btn-lg' id='" + i + "'></a>");
			button.click({obj: i}, function(event) {

				obj = event.data.obj;
				art.changeSelectedObject(obj);

			})
			// Creates canvas
			canvas = $("<canvas id='" + i + "-canvas'></canvas>");

			objectButtonGroup.append(button);

			button.append(canvas);
			button.append("<br>" + i);

			// Gets the first sprite
			spriteName = Object.keys(sprites[i])[0];

			// Creats manager
			this.objectCanvases[i] = SpriteCanvas({canvas: canvas, object: i, sprite: spriteName});
			this.objectCanvases[i].draw();

		}

		// Sets the animation display to update 
		this.animationInterval = window.setInterval(this.updateSpriteAnimations, 1000/5);

		// Selects the first object
		this.changeSelectedObject(selectedObject);

		// Sets the selected sprite
		this.changeSprite(selectedSprite);

		// Selects the color
		this.selectColor(0);
	},
	update: function() {
		// Sets mouse position
		this.mouseX = (mouse.pos.x - this.canvas.offset().left) / this.canvas.width() * this.canvas[0].width;
		this.mouseY = (mouse.pos.y - this.canvas.offset().top) / this.canvas.height() * this.canvas[0].height;

		// draws
		this.draw();
	},
	onClick: function() {

		// Checks if the bars are selected
		if (!this.isCopying){
			this.colorBar.checkForSelection(this.mouseX, this.mouseY);
			this.saturationBar.checkForSelection(this.mouseX, this.mouseY);
			this.brightnessBar.checkForSelection(this.mouseX, this.mouseY);

			this.copyButton.checkForClick(this.mouseX, this.mouseY);
			this.mirrorButton.checkForClick(this.mouseX, this.mouseY);

		}else {
			this.copyCancelButton.checkForClick(this.mouseX, this.mouseY);
		}
	},
	onMouseUp: function() {
		// Deselects all the bars
		this.colorBar.isSelected = false;
		this.saturationBar.isSelected = false;
		this.brightnessBar.isSelected = false;

		// Cancels
		if (this.isClickingCancel){
			this.isCopying = false;
			this.isClickingCancel = false;
		}
	},
	onMouseHold: function() {

		// Cannot change the color of the eraser
		if (!this.isErasing){

			// Used so that the user cannot draw on the canvas while changing color
			var changingColor = false;

			// Changes color hue
			this.colorBar.onHold(ctx, this.mouseX, this.mouseY, function(percentage) {

				// gets rgb values
				red = getColorValue(7, 3, percentage);
				blue = getColorValue(1, 5, percentage);
				green = getColorValue(4, 9, percentage);

				// sets rgb
				colors[selectedColor].r = red;
				colors[selectedColor].g = green;
				colors[selectedColor].b = blue;

				colors[selectedColor].hue = percentage;

				//changes the color
				changeButtonColor();

				changingColor = true;
			});

			this.saturationBar.onHold(ctx, this.mouseX, this.mouseY, function(percentage){

				saturation = percentage * 255;

				colors[selectedColor].sat = saturation;

				changeButtonColor();

				changingColor = true;

			});

			this.brightnessBar.onHold(ctx, this.mouseX, this.mouseY, function(percentage){
				// Sets the proper brightness
				colors[selectedColor].bright = 255 * percentage;

				changeButtonColor();

				changingColor = true;
			})
		}

		// Checks if the mouse is on the canvas
		if (!changingColor && !this.isCopying){
			if (this.mouseX > this.offsetX && this.mouseX < this.offsetX + this.size * this.pixelSize){
				if (this.mouseY > this.offsetY && this.mouseY < this.offsetY + this.size * this.pixelSize){

					pixel = this.getSelectedPixel();
					sprite = sprites[selectedObject][selectedSprite];

					if (!this.isErasing){
						sprite[pixel[0]][pixel[1]] = selectedColor;
					}else {
						sprite[pixel[0]][pixel[1]] = null;
					}

					this.updateSelectedButtons();

				}
			}
		}
	},
	draw: function() {

		// Gets ctx for reference
		ctx = this.ctx;

		// Draws background
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(0, 0, this.w, this.h);

		// Draws grid
		for (i = 0; i <= this.size; i++){

			ctx.fillStyle = "#000000";

			// Draws x line
			ctx.fillRect(
				this.offsetX + this.pixelSize * i, 
				this.offsetY, 
				1, 
				this.size * this.pixelSize);

			// Draws y line
			ctx.fillRect(
				this.offsetX, 
				this.offsetY + this.pixelSize * i, 
				this.size * this.pixelSize, 
				1);

		}

		if (selectedObject in hoverSprites){
			if (selectedSprite in hoverSprites[selectedObject]){
				// Draws underlaying Sprite
				ctx.globalAlpha = 0.5;
				s = hoverSprites[selectedObject][selectedSprite];

				sprite = sprites[s.object][s.sprite];

				for (var x = 0; x < this.size; x++){
					for (var y = 0; y < this.size; y++){
						if (sprite[x][y] !== null){
							color = colors[sprite[x][y]];

							ctx.fillStyle = color.hex;

							ctx.fillRect(
								this.offsetX + this.pixelSize * x,
								this.offsetY + this.pixelSize * y,
								this.pixelSize,
								this.pixelSize
							);

						}
					}

				}
			}

			ctx.globalAlpha = 1;
		}

		//draws current sprite

		for (x = 0; x < this.size; x++){
			for (y = 0; y < this.size; y++){

				if (sprites[selectedObject][selectedSprite][x][y] !== null){

					// Gets the color
					color = colors[sprites[selectedObject][selectedSprite][x][y]];

					// Draws the pixel
					ctx.fillStyle = color.hex;
					ctx.fillRect(
						this.offsetX + this.pixelSize * x,
						this.offsetY + this.pixelSize * y,
						this.pixelSize,
						this.pixelSize
					);

				}

			}
		}

		// Checks if the mouse is on the grid
		if (!this.isCopying){
			
			if (this.mouseX > this.offsetX && this.mouseX < this.offsetX + (this.size * this.pixelSize)){
				if (this.mouseY > this.offsetY && this.mouseY < this.offsetY + (this.size * this.pixelSize)){
					// Draws highlighted pixel

					pixel = this.getSelectedPixel();

					// Draws the highlighted pixel
					ctx.fillStyle = "#ffffff"
					ctx.fillRect(
						this.offsetX + pixel[0] * this.pixelSize,
						this.offsetY + pixel[1] * this.pixelSize,
						this.pixelSize + 1,
						this.pixelSize + 1);
				}
			}
		}


		animationSprite = animations[selectedAnimation][selectedAnimationSprite];

		// Draws animation display

		sprite = sprites[selectedObject][animationSprite];

		for (x = 0; x < sprite.length; x++){
			for (y = 0; y < sprite[x].length; y++){

				if (sprite[x][y] !== null){

					ctx.fillStyle = colors[sprite[x][y]].hex;
					ctx.fillRect(
						Math.round(art.animationDisplay.x + art.animationDisplay.offsetX + art.animationDisplay.pixelSize * x),
						Math.round(art.animationDisplay.y + art.animationDisplay.offsetY + art.animationDisplay.pixelSize * y),
						Math.round(art.animationDisplay.pixelSize + 1),
						Math.round(art.animationDisplay.pixelSize + 1)
					);
				}
			}
		}
		// Draws bars/buttons
		this.colorBar.draw(ctx);

		brightness = colors[selectedColor].bright;
		this.saturationBar.draw(ctx, [{r:brightness, g:brightness, b:brightness}, colors[selectedColor]])

		black = {r: 0, g: 0, b:0};
		white = {r: 255, g: 255, b: 255}
		this.brightnessBar.draw(ctx, [black, colors[selectedColor], white]);

		this.copyButton.draw(ctx, this.mouseX, this.mouseY);
		this.mirrorButton.draw(ctx, this.mouseX, this.mouseY);

		if (this.isCopying){

			// Draws transparent white layer
			ctx.globalAlpha = 0.5;
			ctx.fillStyle = "#ffffff";
			ctx.fillRect(0, 0, this.w, this.h);
			ctx.globalAlpha = 1;

			// Draws text
			ctx.fillStyle = "#000000";
			ctx.font = "30px Arial";
			text = "Choose a sprite to copy";

			x = (this.w - ctx.measureText(text).width) / 2;
			ctx.fillText(text, x, this.h / 3);

			this.copyCancelButton.draw(ctx, this.mouseX, this.mouseY);
		}
	},
	selectColor: function(colorIndex) {

		if (this.isErasing){
			$("#eraser").removeAttr("selected");
		}else {
			$($("#color-btns").children()[selectedColor]).removeAttr("selected");
		}
		if (colorIndex == "Eraser"){
			this.isErasing = true;
			$("#eraser").attr("selected", "true");
		}else{
			this.isErasing = false;

			// Selects a color and sets the crosshairs appropriatly
			selectedColor = colorIndex;
			$($("#color-btns").children()[selectedColor]).attr("selected", "true");

			this.colorBar.setCrosshairs(colors[selectedColor].hue);
			this.saturationBar.setCrosshairs(colors[selectedColor].sat / 255);
			this.brightnessBar.setCrosshairs(colors[selectedColor].bright / 255);
		}
	},
	getSelectedPixel: function() {

		// Gets the pixel
		pixelX = Math.round((this.mouseX - this.offsetX - (this.pixelSize/2)) / this.pixelSize);
		pixelY = Math.round((this.mouseY - this.offsetY - (this.pixelSize/2)) / this.pixelSize);

		return [pixelX, pixelY];
	},
	changeSpriteButtons: function() {

		// Resets all of the sprite buttons

		this.spriteCanvases = {};

		// Sets all the canvases in the sprite buttons
		spriteButtonGroup = $("#art-sprites-btns");
		spriteButtonGroup.html("");
		for (i in sprites[selectedObject]){

			// Creates button
			button = $("<a class='btn btn-lg' id='" + selectedObject + "-" + i + "'></a>");
			button.click({sprite: i}, function(event) {

				sprite = event.data.sprite;
				art.changeSprite(sprite);

			})
			// Creates canvas
			canvas = $("<canvas id='" + selectedObject + "-" + i + "-canvas'></canvas>");

			spriteButtonGroup.append(button);

			button.append(canvas);
			button.append("<br>" + i);

			// Creats manager
			this.spriteCanvases[i] = SpriteCanvas({canvas: canvas, object: selectedObject, sprite: i});
			this.spriteCanvases[i].draw();
		}

		// sets the first as selected
		if (!this.isCopying){
			this.changeSprite(Object.keys(sprites[selectedObject])[0]);
		}
	},
	changeSprite: function(spriteIndex) {

		// Changes the sprite or copies it

		if (this.isCopying){

			// The previous object was saved as copyObject and copySprite
			// The sprite just selected is selectedObject and spriteIndex


			// Loops through and copys the sprite
			for (x = 0; x < sprites[selectedObject][spriteIndex].length; x++){
				for (y = 0; y < sprites[selectedObject][spriteIndex][x].length; y++){
					sprites[this.copyObject][this.copySprite][x][y] = sprites[selectedObject][spriteIndex][x][y];
				}
			}
			art.isCopying = false;

			// Switches back to selected object if the user copied a sprite from a different object
			this.changeSelectedObject(this.copyObject);
			this.changeSprite(this.copySprite);

		}else {
			// Unselectes the current button
			$("#" + selectedObject + "-" + selectedSprite).removeAttr("selected");

			selectedSprite = spriteIndex;

			// Selects the new button
			$("#" + selectedObject + "-" + selectedSprite).attr("selected", "true");

			selectedAnimationSprite = 0;
			// Find the animation to display
			for (i = 0; i < animations.length; i++){

				if ($.inArray(selectedSprite, animations[i]) !== -1){

					selectedAnimation = i;
					break;
				}
			}



		}
	},
	updateSelectedButtons: function() {
		// Updates the current selected sprite and object button canvases
		this.objectCanvases[selectedObject].draw();
		this.spriteCanvases[selectedSprite].draw();
	},
	updateAllButtons: function() {
		// Updates all the button canvases
		// When a color is changed, something that affects all sprites
		for (i in this.objectCanvases){
			this.objectCanvases[i].draw();
		}
		for (i in this.spriteCanvases){
			this.spriteCanvases[i].draw();
		}
	},
	changeSelectedObject: function(objIndex) { 

		// Changes the selected button
		$("#" + selectedObject).removeAttr("selected");

		// Changes the selected Object
		selectedObject = objIndex;

		// Sets the selected sprite
		selectedSprite = Object.keys(sprites[selectedObject])[0];
		$("#" + selectedObject).attr("selected", "true");

		// Changes the animation display sprites

		for (var i = 0; i < animations.length; i++){
			if ($.inArray(selectedSprite, animations[i]) !== -1){
				selectedAnimation = i;
				break;
			}
		}
		this.updateSpriteAnimations();

		this.objectCanvases[selectedObject].draw();
		this.changeSpriteButtons();
	},
	updateSpriteAnimations: function() {

		// Changes the sprite to draw in the animation display

		selectedAnimationSprite += 1;

		if (selectedAnimationSprite >= animations[selectedAnimation].length){

			selectedAnimationSprite = 0;

		}
	},
	mirrorSprite: function() {

		// Gets the sprite and makes a new array that will be the cloned copy
		sprite = sprites[selectedObject][selectedSprite];
		spriteCopy = [];

		// Cycles though and gets the clone
		for (x = 0; x < sprite.length; x++){

			spriteCopy[x] = sprite[sprite.length - 1 -x].slice();

		}

		// Cycles through and copies the mirrored sprite into the sprite
		// Needs to pass by value, not by reference
		for (x = 0; x < sprite.length; x++){
			sprites[selectedObject][selectedSprite][x] = spriteCopy[x].slice();
		}

		// Updates the buttons
		this.updateSelectedButtons();
	}
})

function getColorValue(startPoint, endPoint, percentage){

	start = startPoint;
	end = endPoint;
	loops = false;
	if (start > end){
		if (percentage < (end/9) || percentage > (start/9)){
			loops = true
		}
	}

	if (percentage < (end/9) && percentage > (start/9) || loops){

		// Cehcks for blending
		if ((end/9) > percentage && percentage > ((end - 1)/9)){

			color = Math.round(255 * ( 1 - (percentage - ((end - 1)/9)) / (1/9)))

		}else if (start/9 < percentage && (start + 1) / 9 > percentage){

			color = Math.round(255 * ((percentage - ((start)/9)) / (1/9)))

		}else {
			color = 255;
		}
	}else {
		color = 0;
	}

	return color;
}

function toHex(color) {

	c = color.toString(16);
	if (c.length < 2){
		c = "0" + c;
	}

	return c;
}

function getFullHexColor(color) {

	percentage = (color.sat / 255)

	finishedColor = {
		r: Math.round((color.bright * (1 - percentage) + color.r * percentage)),
		g: Math.round((color.bright * (1 - percentage) + color.g * percentage)),
		b: Math.round((color.bright * (1 - percentage) + color.b * percentage))
	};

	return "#" + toHex(finishedColor.r) + toHex(finishedColor.g) + toHex(finishedColor.b);
}

function changeButtonColor() {

	// Gets the color in hex vaLUE
	hexColor = getFullHexColor(colors[selectedColor])

	// Gets the button
	div = $(colorButtons.children()[selectedColor]);
	
	// Changes the background color
	div.css("background-color", hexColor);

	// Sets the text
	div.html(hexColor);

	// Changes the text color
	if (colors[selectedColor].bright < 128){
		div.css("color", "#ffffff");
	}else {
		div.css("color", "#000000")
	}

	// Sets the color hex value
	colors[selectedColor].hex = hexColor;

	//Sets all the sprite canvases colors
	for (i in art.spriteCanvases){

		art.spriteCanvases[i].draw();
	}

	art.updateAllButtons();
}