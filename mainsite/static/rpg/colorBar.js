var ColorBar = Class({
	x: 0,
	y: 0,
	w: 0,
	h: 0,

	crosshairX: 0,
	crosshairY: 0,

	img: null,

	init: function(p) {

		this.x = p.x;
		this.y = p.y;
		this.w = p.w;
		this.h = p.h;

		this.crosshairX = this.x;
		this.crosshairY = this.y;

		this.img = p.img;

	},

	draw: function(ctx, colors){


		if (this.img != null){
			ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
		}else {

			for (var i = 0; i < this.w; i++){

				percentage = (i / this.w);

				partPercentage = percentage * (colors.length - 1)

				index = Math.floor((colors.length - 1) * percentage)
				startColor = colors[index]
				if (percentage == 1){
					endcolor = colors[index];
				}else {
					endColor = colors[index + 1];
				}

				color = {
					red: Math.round((startColor.r * ((colors.length - 1) - partPercentage) + endColor.r * partPercentage)),
					green: Math.round((startColor.g * ((colors.length - 1) - partPercentage) + endColor.g * partPercentage)),
					blue: Math.round((startColor.b * ((colors.length - 1) - partPercentage) + endColor.b * partPercentage))
				};

				hexColor = "#" + toHex(color.red) + toHex(color.green) + toHex(color.blue);

				ctx.fillStyle = hexColor;
				ctx.fillRect(this.x + i, this.y, 1, this.h);
			}
		}


		// Draws the crosshair
		crosshairLength = 10
		ctx.fillStyle = "#000000";
		ctx.fillRect(
			this.crosshairX + 2,
			this.crosshairY - 1,
			crosshairLength,
			2
		);
		ctx.fillRect(
			this.crosshairX - 2 - crosshairLength,
			this.crosshairY - 1,
			crosshairLength,
			2
		);
		ctx.fillRect(
			this.crosshairX - 1,
			this.crosshairY + 2,
			2,
			crosshairLength
		);
		ctx.fillRect(
			this.crosshairX - 1,
			this.crosshairY - 2 - crosshairLength,
			2,
			crosshairLength
		);

	},

	onClick: function(ctx, mouseX, mouseY, onSuccess){


		// Checks if the mouse is on the color gradient
		if (mouseX > this.x && mouseX < this.x + this.w){

			if (mouseY > this.y && mouseY < this.y + this.h){

				this.crosshairX = mouseX;
				this.crosshairY = mouseY;

				onSuccess(mouseX, mouseY, this.x, this.w);

			}
		}
	}
})