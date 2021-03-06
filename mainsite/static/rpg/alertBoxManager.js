var alert;

var AlertBoxManager = Class({
	
	// the parent container
	container: null,
	
	// the actual box
	element: null,
	
	// the text element inside the box
	text: null,
	
	// the input element inside the box
	inputContainer: null,
	
	// the different <input> elements
	inputs: [],
	
	// the different labels for returning
	labels: [],
	
	// the div which contains the loading symbol
	loading: null,
	
	// the button
	button: null,
	
	// the callback function
	callback: null,
	
	// whether it is showing or not
	isShowing: false,

	init: function(p){
	
		// gets all the elements
		this.container = $("#alert-box-container");
		this.element = $("#alert-box");
		this.text = $("#alert-box-text");
		this.button = $("#alert-box-btn");
		this.inputContainer = $("#alert-box-input-container");
		this.loading = $("#alert-box-loading");
		
		// makes the button hide it
		this.button.click(function(){
			alert.hide();
		});
		
		this.container.hide();
		
		this.isShowing = false;
		
	},
	
	//  shows the box
	show: function(message, labels, callback){

		// removes the up anim
		if (this.container.hasClass("up-anim")){
			this.container.removeClass("up-anim");
		}
		
		this.container.show();
		
		
		this.text.text(message);
		// adds the down animation
		this.container.addClass("down-anim");
		
		// gives all the labels their own input box
		this.labels = [];
		this.inputContainer.html("");
		
		for (var i = 0; i < labels.length; i++){
			
			var name;
			var type;
			
			// if the label is a string, just uses it
			if (typeof labels[i] === "string"){
				name = labels[i];
				type = null;
				
			// if its an object, checks for type
			// mainly for passwords having type='password'
			}else if (typeof labels[i] === "object"){
				name = labels[i].name;
				type = labels[i].type;
				
			// somthing went wrong :(
			}else {
				console.error("Unsupported labels type " + typeof(labels[i]));
				return;
			}
			// adds it to local copy 
			this.labels.push(name);
			
			// adds a new line to the input container
			var singleInputContainer = $("<div class='alert-box-single-input'></div");
			
			singleInputContainer.append(name + ": ");
			this.inputs[i] = $("<input class='alert-box-input'></input>");
			if (type !== null){
				this.inputs[i].attr("type", type);
			}
			singleInputContainer.append(this.inputs[i]);
			
			this.inputContainer.append(singleInputContainer);
		}
		
		if (this.inputs.length > 0){
			this.inputs[0].focus();
		}
		
		// records the callback
		this.callback = callback;
		
		if (this.callback === null){
			this.button.click(function(){
				alert.hide();
			});
		}else {
			
			this.button.unbind("click");
		}
		
		this.button.click(function(){
			alert.doCallback()
		});
		
		this.isShowing = true;
		
		this.hideLoading();
		
	},

	hide: function(){
		
		// removes the up anim
		if (this.container.hasClass("down-anim")){
			this.container.removeClass("down-anim");
		}
		// adds the down animation
		this.container.addClass("up-anim");
		
		// hides all inputs
		for (var i = 0; i < this.inputs.length; i++){
			this.inputs[i].hide();
		}
		

		// removes the loading screen when it is done animating
		this.container.on("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(){
			
			// checks it is still hiding
			if (alert.container.hasClass("up-anim")){
				alert.isShowing = false;
				alert.hideLoading();
			}
		});
		
	},
	
	doCallback: function(){
		
		// creates a return object 
		var returnObj = {};
		
		for (var i = 0; i < this.labels.length; i++){
			returnObj[this.labels[i]] = this.inputs[i].val();
		}
		
		// runs the callback
		if (this.callback !== null && this.callback !== undefined){
			this.callback(returnObj);
		}
	},
	
	showLoading: function(){
		
		this.loading.show();
		this.button.hide();
		createLoading(this.loading);
	},
	
	hideLoading: function(){
		
		this.loading.html("");
		this.button.show();
		this.loading.hide();
		
	},
	
	getIsShowing: function(){
		return this.isShowing;
	}
});

$(window).on("load", function(){

	alert = new AlertBoxManager({});
});