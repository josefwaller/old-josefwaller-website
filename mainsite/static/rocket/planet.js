Planet = Class({

	x: 0,
	y: 0,
	r: 0,

	inOrbit: false,
	orbitHeight: null,
	orbitParent: null,
	orbitV: 0,
	orbitDegree: 0,

	vX: 0,
	vY: 0,

	mass: 0,
	color: 0,

	// Initializes the class
	init: function(p){

		this.x = p.x;
		this.y = p.y;
		this.mass = p.mass;
		this.r = p.radius;
		this.vX = p.vX / 1000;
		this.vY = p.vY / 1000;
		this.color = p.color;

		if (p.inOrbit == true ){

			this.orbitParent = p.orbitParent;
			this.orbitHeight = p.orbitHeight;
			this.orbitV = p.orbitV / 1000;
			this.inOrbit = true;

			this.x = this.orbitParent.x + this.orbitHeight;
			this.y = this.orbitParent.y;

		}else {
			this.inOrbit = false
		}
	},

	// Moves in accordance with velocity
	update: function(){

		// Planets are on a fixed orbit

		if (this.inOrbit){
			// Positive velocity is clockwise, negative is anticlockwise

			// Gets the percentage of the circumfrence to orbit
			radians = this.orbitV / (this.orbitParent.r + this.orbitHeight)

			// Adds the rotation for this frame
			this.orbitDegree += radians;

			// Checks if the rotation is over tau, and if it is subtracts tau
			if (this.orbitDegree > 2 * Math.PI){
				this.orbitDegree -= 2 * Math.PI;
			}

			// Gets the x and y corrdinate

			// -> sin(t) = opp/hyp
			// -> sin(orbDeg) = x/orbHeight
			// -> orbHeight * sin(orgDeg) = x
			// same for y, except cos() instead of sin()
			yAddon = (this.orbitHeight) * Math.sin(this.orbitDegree);
			xAddon = (this.orbitHeight) * Math.cos(this.orbitDegree);

			// Sets the y position
			this.x = this.orbitParent.x + xAddon;
			this.y = this.orbitParent.y + yAddon;

		}
	},

	// Draws the planet
	render: function(){

		// Checks that it is in the canvas
		if (0 < this.x + this.r && this.x - this.r < canvas.width){
			if (0 < this.y + this.r && this.y - this.r < canvas.height){

				ctx.beginPath();
				ctx.fillStyle = this.color;
				ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
				ctx.fill();
			}
		}
	}
})