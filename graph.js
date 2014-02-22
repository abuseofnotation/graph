//---------------Settings----------------
var headingsize = 1
var margin = 0.2
var margin_top_bottom = 0.02
var margin_sides = 0.02
var text_margin =0.5
var speed = 200

var debug = false
var css_styles = ["important", "minor"]
var special_styles = ["transparent", "rounded"]

var arrow = "connect"

$(document).ready(function () {
	$(".info").each(function () {
		mesmerize($(this), $.parseJSON($(this).html()))
	})
	$("#json").keyup(function () {
		input = null
		input = $.parseJSON($(this).val())
		if (input != null) {
			mesmerize($('.jsoninput'), input)
		}
	});
});

function mesmerize(canvas, input) {

	var plainobjects = input
	canvas.html('')
	//---------------The drawing function----------------


		 function draw(block_id) {

			for (var i = 0; i < current.blocks.length; i++) {
				theblock=current.blocks[i]
			
				if (block_id===theblock.div.id){theblock.go_to()}
			}
		}

//---------------Right Click----------------
	canvas.bind("contextmenu", function (e) {
		current.parent.go_to();
		return false;
	});
	
//---------------The Block class----------------
	//constructor
	var Block = function (id, x, y, h, w, blocks_arrows, css_style, special_style) {
		//name/id
		this.id = id;
		//CSS style
		this.css_style = css_style;
		//special style
		this.special_style = special_style;
		//coordinates
		this.x = x;//vertical
		this.y = y;//horizontal
		//size
		this.h = h;//height
		this.w = w;//width
		//children (not yet parsed)
		this.blocks_arrows = blocks_arrows;
		//children (represented as Block objects)
		blocks = new Array()
		this.blocks = blocks;
		arrowarray = new Array()
		this.arrows = new Array()
	}

	//Initial rendering of the canvas. 
	//A recursive function that is called once for each box
	Block.prototype.render = function (scale, level) {
		this.scale = scale
		this.level = level
		//creates the <div> elements for the box.
		this.div = document.createElement("div");
		this.div.id = this.id.replace(/[^a-z0-9]/gi, '_')
		this.div.className = "block_level_" + this.level + " block_level_" + this.level + this.css_style + " block"
		this.div.style.opacity = 0
		this.div.style.display = "none"
		if (scale === 0) {
			canvas.append(this.div)
		} else {
			this.parent.children.appendChild(this.div)
		}
		//binds the drawing function so that the box draws itself
		//when the user clicks on it 
		$(this.div).bind('click', function (event) {
			draw(this.id)
		})
		
		this.heading = document.createElement("div");
		this.heading.setAttribute("class", "label");
		this.heading.innerHTML = this.id;
		this.div.appendChild(this.heading);
		this.children = document.createElement("div");
		this.div.appendChild(this.children);
		this.children.id = this.id.replace(" ", "_") + "_blocks";
		
		if (this.blocks_arrows != null) {
		arrowarray=null
		
			//convert the input data to "Block" objects
			for (var i = 0; i < this.blocks_arrows.length; i++) {
				if (this.blocks_arrows[i][0]===arrow){
					arrowarray.push(this.blocks_arrows[i])}
			  else {this.blocks.push(parseBlock(this.blocks_arrows[i]))}
			}
		if (arrowarray!==null){
			for (var i = 0; i < arrowarray.length; i++) {
				this.arrows=this.arrows.concat(parseArrows(arrowarray[i], this))		
				}
		}
			//Determine the size of the canvas(how many columns and rows must be added
			//on this level):
			scale = 0
			for (var i = 0; i < this.blocks.length; i++) {
				if (scale < this.blocks[i].y+this.blocks[i].w-1) {
					scale = this.blocks[i].y+this.blocks[i].w-1
				}
				if (scale < this.blocks[i].x+this.blocks[i].h-1) {
					scale = this.blocks[i].x+this.blocks[i].h-1
				}
			}
			scale++
			level++
			//And call itself over the children
			for (var i = 0; i < this.blocks.length; i++) {
				this.blocks[i].parent = this
				this.blocks[i].render(scale, level)
			}
			if (this.arrows != null) {
				//draw arrows
			}
		}
	}
	
	
	//Called when the user clicks on a box. Makes it occupy the whole screen
	Block.prototype.go_to = function () {
		if (debug) {
			console.log("goto" + this.div.id)
		}
		//we mark that this is the current box
		current = this;
		//The size of the box will be equal to the size of the canvas
		this.width = canvas.width();
		this.height = canvas.height();
		//this makes the other boxes fade out, while our box takes the screen
		if (current.parent) {
			neighbours = current.parent.blocks;
			for (i = 0; i < neighbours.length; i++) {
				if (neighbours[i] != current) {
					$(neighbours[i].div).animate({
						top: (neighbours[i].x - this.x) * this.height + "px",
						left: (neighbours[i].y - this.y) * this.width + "px",
						height: this.height + "px",
						width: this.width + "px",
						opacity: 0,
					}, speed, function () {
						$(this).css("display", "none")
					});
				}
			}

			for (i = 0; i < current.parent.arrows.length; i++) {
			console.log(current.parent.arrows[i])
			 $(current.parent.arrows[i].div).animate(
			 {opacity: 0, 
			 height:0,
			 width:0 
			}, speed/4)
	//	current.parent.arrows[i].div.style.opacity=0
			}
		}
		//Moving of the box:
		this.div.style.display = "table"
		
		style={
			left: "0px",
			top: "0px",
			height: this.height + "px",
			width: this.width + "px",
			opacity: 1,
		}
		if (this.special_style === special_styles[1]) {style.borderRadius =  this.height/ 4 + "px"}
		
		$("#" + this.div.id, canvas).animate(style, speed);
		//Making its label bigger
		$(this.heading, canvas).animate({
			fontSize: Math.round(this.width / 10 * headingsize) + "px",
			//marginTop: Math.round(this.height / 2 - this.width / 10 * headingsize) + "px",
			paddingLeft: Math.round(this.width / 10 * text_margin),
			paddingRight: Math.round(this.width / 10 * text_margin),
			opacity: 0.3
		}, speed);
		//if the box has children we must draw them:
		if (this.blocks != null) {
			for (var i = 0; i < this.blocks.length; i++) {
				this.blocks[i].drawchild(document.getElementById(this.div.id + "_blocks"), false)
				if (debug) {
					console.log("drawchild " + this.blocks[i].div.id)
				}
			}
		}
		
		if (this.arrows != null) {
		for (var i = 0; i < this.arrows.length; i++) {
	
		this.arrows[i].draw()
		}
		}
		
	}
	//draws the boxes in a graphic
	Block.prototype.drawchild = function (parent_div, invisible) {
		this.div.style.display = "table"
		var width = this.parent.width - this.parent.width*margin_sides*2
		var height = this.parent.height- this.parent.height*margin_top_bottom*2
		var scale = this.scale
		var x = this.x
		var y = this.y
		//some calculations in order to get the block's proportions
		columnwidth = Math.round(width / scale)
		rowheight = Math.round(height / scale)
		
		widthmargin = heightmargin = Math.round(margin * (columnwidth + rowheight)/2)		

		this.width = columnwidth*this.w - widthmargin
		left = columnwidth * y + this.parent.width*margin_sides 
		this.left = left + widthmargin / 2
		
		this.height = rowheight*this.h - heightmargin
		tops = rowheight * x + this.parent.height*margin_top_bottom
		
		this.tops = tops + heightmargin / 2
		
		
		//Moving of the box:
		var style = new Object({
			height: Math.round(this.height) + "px",
			width: Math.round(this.width) + "px",
		})
		if (invisible != true) {
			style.opacity = 1
		} else {
			style.opacity = 0
		}
		style.left = Math.round(this.left) + "px"
		style.top = Math.round(this.tops) + "px"
		
		if (this.special_style === special_styles[1]) {style.borderRadius =  rowheight/ 4 + "px"}
		
		$("#" + this.div.id, canvas).animate(style, speed, function () {
			if (invisible === true) {
				$(this).css("display", "none")
			}
		});
		//Making its label bigger
		$(this.heading).animate({
			fontSize: Math.round(columnwidth / 10 * headingsize) + "px",
			//marginTop: Math.round(this.height / 2 - columnwidth / 10 * headingsize) + "px",
			paddingLeft: Math.round(columnwidth / 10 * text_margin),
			paddingRight: Math.round(columnwidth / 10 * text_margin),
			opacity: 1
		}, speed);
		if (debug) {
			console.log("animate " + this.div.id + "(left=" + left + " top=" + tops)
		}
		//If the box has a "transparent" property set, we want its children to be visible 
		var isinvisible
		if (this.special_style === special_styles[0]) {
			isinvisible = false
		} else {
			isinvisible = true
		}
		//if the current block has children we draw them
		if (this.blocks != null) {
			for (var i = 0; i < this.blocks.length; i++) {
				this.blocks[i].drawchild(document.getElementById(this.div.id + "_blocks"), isinvisible)
			}
		}
	}
	//---------------The Arrow class--------------
var Arrow = function (from, to, parent) {

			//Calculates some arrow paramethers:
		var vertical //True for vertical arrow, false for horizontal
        var direction//True for arrows that point down/right, false for up/left
		var thin_short //For vertical arrows: the thinner box. For horizontal arrows: the shorter one.
		var up_left//For vertical arrows: the upper box. For horizontal arrows: the one from the left.

		if((from.x>=to.x&&from.x+from.h<=to.x+to.h)||(from.x<=to.x&&from.x+from.h>=to.x+to.h)){
		vertical=false
		} else if ((from.y>=to.y&&from.y+from.w<=to.y+to.w)||(from.y<=to.y&&from.y+from.w>=to.y+to.w)) {
		vertical=true
		}else{vertical=null;console.log("I cannot draw diagonal arrows");
		return
		}
		
		if (vertical){
		if (from.w<=to.w){thin_short=from}else{thin_short=to}
		if (from.x<to.x){direction=true;this.top_box=from;this.down_box=to} else{ direction=false;this.down_box=from;this.top_box=to}
		
		} else {
		if (from.h<=to.h){thin_short=from}else{thin_short=to}
		if (from.y<to.y){direction=true;this.left_box=from;this.right_box=to}else{direction=false;this.left_box=to;this.right_box=from} 
		
		}
		//console.log("starting from "+thin_short.id+". "+"down/right= "+direction)
	
			//Creates a div for the arrow
		this.div = document.createElement("div");
		this.div.id = from.id+"to"+to.id.replace(/[^a-z0-9]/gi, '_')
		this.div.className = "arrow arrow_level_"+(parent.level+1)
		parent.children.appendChild(this.div)
		
		
		this.vertical=vertical
		this.direction=direction
		this.thin_short=thin_short
		}
		
	Arrow.prototype.draw = function () {
	if (this.vertical!==null){
	style={opacity: 1}
		if (this.vertical){
			style.top=(this.top_box.tops+this.top_box.height)
			style.height=this.height=(this.down_box.tops-this.top_box.tops-this.top_box.height)
			style.left=(this.thin_short.left+this.thin_short.width/2)
			style.width=this.width="0"
		
		} else{
			style.left=(this.left_box.left+this.left_box.width)
			style.width=this.width=(this.right_box.left-this.left_box.left-this.left_box.width)
			style.top=(this.thin_short.tops+this.thin_short.height/2)
			style.height=this.height="0"
		
		}
		
		
	}

	$(this.div).animate(style,speed)
	}
	
	
	
	
	
	
	
	
		
	//---------------Parsing input----------------

	function parseBlock(blockarray) {
		 position = "a1"
		 children = new Array()
		 size = "1x1"
		 css_style = ""
		 special_style = ""
		//For each property
		for (var i = 1; i < blockarray.length; i++) {
			property = blockarray[i]
			if (typeof property === "string") {
				//Check if it is a CSS style 
				for (var j = 0; j < css_styles.length; j++) {
					if (css_styles[j] === property) {
						css_style = "_" + property
						property = ""
					}
				}
				//Check if it is a special style 
				for (var j = 0; j < special_styles.length; j++) {
					if (special_styles[j] === property) {
						special_style = property
						property = ""
					}
				}
				//If it is only two characters it must be the position
				if (property.length === 2) {
					position = property
					//if it is three it must be the size
				} else if (property.length === 3) {
					size = property
				}
				//if it is an array, it must be a child box
			} else if (property instanceof Array) {
				children.push(property)
			}
		}
		//parse position
		x = position.toLowerCase().charCodeAt(0) - 97
		y = parseInt(position.charAt(1)) - 1
		//parse size
		h = parseInt(size.charAt(0))
		w = parseInt(size.charAt(2))
		if (debug) {
			console.log("new Block (" + blockarray[0] + ", " + x + ", " + y + ", " + children + ", " + css_style + ", " + special_style + ")")
		}
		//create a new block object from the properties
		
		return new Block(blockarray[0], x, y, h, w, children, css_style, special_style)
	}
	
	function parseArrows(arrowarray, block) {
blocks=block.blocks
sequential_arrows=new Array()

		for (var j = 2; j < arrowarray.length; j++) {
	
		from=null
		to=null
		for (var i = 0; i < blocks.length; i++) {
	
		if (blocks[i].id===arrowarray[j-1]){from=blocks[i]}
		else if(blocks[i].id===arrowarray[j]){to=blocks[i]}
		}
		if (from===null) {console.log("I coudn't find a box called '"+arrowarray[j-1]+"'.")}
		else if (to===null) {console.log("I coudn't find a box called '"+arrowarray[j]+"'.")}
		else{
		if (debug){console.log("Creating an arrow from "+from.id+" to "+to.id)}

	sequential_arrows.push(new Arrow(from, to, block))
		}
		}
		return sequential_arrows
	}
	
	
	var root = parseBlock(plainobjects)
	var current=root
	root.render(0, 0)
	root.go_to()
}