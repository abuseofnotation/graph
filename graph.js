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
	var Block = function (id, x, y, h, w, blocks_plain, css_style, special_style) {
		//name/id
		this.id = id;
		//CSS style
		this.css_style = css_style;
		//special style
		this.special_style = special_style;
		//coordinates
		this.x = x;
		this.y = y;
		//size
		this.h = h;
		this.w = w;
		//children (not yet parsed)
		this.blocks_plain = blocks_plain;
		//children (represented as Block objects)
		blocks = new Array()
		this.blocks = blocks;
		arrows = new Array()
		this.arrows = arrows;
	}
	Block.prototype.append = function (block) {
		this.blocks.push(block)
	}
	//Initial rendering of the canvas. 
	//A recursive function that is started one for each box
	Block.prototype.render = function (scale, level) {
		this.scale = scale
		this.level = level
		//creates the <div> elements for the box.
		this.div = document.createElement("div");
		this.div.id = this.id.replace(/[^a-z0-9]/gi, '_')
		this.div.className = "level" + this.level + " level" + this.level + this.css_style + " block"
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
		if (this.blocks_plain != null) {
			//convert the input data to "Block" objects
			for (var i = 0; i < this.blocks_plain.length; i++) {
				this.append(parseBlock(this.blocks_plain[i]))
			}
			//Determine the size of the canvas(how many columns and rows must be added
			// on this level):
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
			this.parent.div.style.marginLeft = "0px";
			this.parent.div.style.marginTop = "0px";
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
		down = rowheight * x + this.parent.height*margin_top_bottom
		this.down = down + heightmargin / 2
		
		
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
		style.top = Math.round(this.down) + "px"
		
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
			console.log("animate " + this.div.id + "(left=" + left + " top=" + down)
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
	
	
	//---------------Parsing input----------------

	function parseBlock(blockarray) {
		var position = "a1"
		var children = new Array()
		var size = "1x1"
		var css_style = ""
		var special_style = ""
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
		block = new Block(blockarray[0], x, y, h, w, children, css_style, special_style)
		return block
	}
	
	var root = parseBlock(plainobjects)
	var current=root
	root.render(0, 0)
	root.go_to()
}