var sprites;
var background;

var screens;

var colors = [
	{r:0, g:0, b:0, sat:100, bright:100, hue:0.1, hex:"#000000"},
	{r:0, g:0, b:0, sat:100, bright:100, hue:0, hex:"#000000"},
	{r:0, g:0, b:0, sat:100, bright:100, hue:0, hex:"#000000"},
	{r:0, g:0, b:0, sat:100, bright:100, hue:0, hex:"#000000"},
	{r:0, g:0, b:0, sat:100, bright:100, hue:0, hex:"#000000"},
	{r:0, g:0, b:0, sat:100, bright:100, hue:0, hex:"#000000"},
	{r:0, g:0, b:0, sat:100, bright:100, hue:0, hex:"#000000"},
	{r:0, g:0, b:0, sat:100, bright:100, hue:0, hex:"#000000"}
]

var currentScreen;

var art;
var music;
var dialog;

var mouse = {
	pos : {
		x:0,
		y:0
	},
	click: false,
	middleClick: false,
	hold: false
}

function setup () {
	
	sprites = {
		player: {
			runDownOne: [],
			runDownTwo: [],
			runSideOne: [],
			runSideTwo: [],
			runUpOne: [],
			runUpTwo: [],
			dialog: [],
		},
		enemyOne: {
			runDownOne: [],
			runDownTwo: [],
			runSideOne: [],
			runSideTwo: [],
			runUpOne: [],
			runUpTwo: []
		},
		enemyTwo: {
			runDownOne: [],
			runDownTwo: [],
			runSideOne: [],
			runSideTwo: [],
			runUpOne: [],
			runUpTwo: []
		},
		npcOne: {
			stand: [],
			dialog: []
		},
		npcTwo: {
			stand: [],
			dialog: []
		},
		npcThree: {
			stand: [],
			dialog: []
		}
	}

	// Fills the empty arrays
	size = 16
	for (s in sprites){

		for (index in sprites[s]){

			while (sprites[s][index].length < size){

				var arr = []
				while (arr.length < size){
					arr.push(null)
				}

				sprites[s][index].push(arr)
			}
		}
	}

	// Sets up art canvas
	art = Art({size: size});
	// sets up music canvas
	music = Music({});
	// sets up dialog
	dialog = Dialog({});

	// Sets up changing screens
	$("#level-editor-btn").click({i:0}, changeScreen)
	$("#art-btn").click({i:1}, changeScreen)
	$("#music-btn").click({i:2}, changeScreen)
	$("#dialog-btn").click({i:3}, changeScreen)

	// Sets screens
	screens = {
		levelEditor: $("#level-editor"),
		art: $("#art"),
		music: $("#music"),
		dialog: $("#dialog")
	}

	// Sets mouse position when it moves
	$(document).mousemove(function(event) {
		mouse.pos.x = event.pageX;
		mouse.pos.y = event.pageY;
	})

	// Sets mouse values in current situation
	$(document).mousedown(function(event){
		switch (event.which){
			case 1:
				mouse.down = true;
				mouse.click = true;
				break;

			case 2:
				mouse.middleClick = true;
				break;
		}
	})
	$(document).mouseup(function(event){
		mouse.down = false;
	})
	changeScreen(null, 2);
	window.setInterval(update, 1000/60)

}

function changeScreen(event, i) {

	if (event !== null){
		i = event.data.i;
	}
	screens.levelEditor.hide();
	screens.art.hide();
	screens.music.hide();

	switch(i){
		case 0:
			screens.levelEditor.show();
			break;
		case 1:
			screens.art.show();
			break;
		case 2:
			screens.music.show();
			break;
		case 3:
			screens.dialog.show();
			break;
	}

	currentScreen = i;
}

function update() {
	managers = [
		null,
		art,
		music,
		dialog
	];

	managers[currentScreen].update();

	if (mouse.down){
		managers[currentScreen].onMouseHold();
	}else {
		managers[currentScreen].onMouseUp();
	}

	if (mouse.click){
		managers[currentScreen].onClick();

		mouse.click = false;
	}else if (mouse.middleClick){
		managers[currentScreen].onMiddleClick();

		this.mouse.middleClick = false;
	}
}

$(document.body).ready(setup)