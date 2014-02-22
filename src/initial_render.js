
	//Block object constructor
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
	
	//Arrow object constructor
var Arrow = function (from, to, parent) {

			//Calculates some arrow paramethers:
		var vertical //True for vertical arrow, false for horizontal
        var direction//True for arrows that point down/right, false for up/left
		var thin_short //For vertical arrows: the thinner box. For horizontal arrows: the shorter one.
		//the arrow <div>
		this.div = document.createElement("div");
		//the arrow's triangle <div>
		this.triangle_div=document.createElement("div");
		
		if((from.x>=to.x&&from.x+from.h<=to.x+to.h)||(from.x<=to.x&&from.x+from.h>=to.x+to.h)){
		vertical=false
		} else if ((from.y>=to.y&&from.y+from.w<=to.y+to.w)||(from.y<=to.y&&from.y+from.w>=to.y+to.w)) {
		vertical=true
		}else{vertical=null;console.log("I cannot draw diagonal arrows");
		return
		}
		
		if (vertical){
		if (from.w<=to.w){thin_short=from}else{thin_short=to}
		if (from.x<to.x){
			direction=true;this.top_box=from;this.down_box=to;
			this.triangle_div.className=" arrow_level_"+(parent.level+1)+" downarrow"
		} else { 
			direction=false;this.down_box=from;this.top_box=to
			this.triangle_div.className=" arrow_level_"+(parent.level+1)+" uparrow"}
		} else {
		if (from.h<=to.h){thin_short=from}else{thin_short=to}
		if (from.y<to.y){
			direction=true;this.left_box=from;this.right_box=to
			this.triangle_div.className=" arrow_level_"+(parent.level+1)+" rightarrow"
		}else{
			direction=false;this.left_box=to;this.right_box=from
			this.triangle_div.className="arrow_level_"+(parent.level+1)+" leftarrow"
		} 
		
		}
		//console.log("starting from "+thin_short.id+". "+"down/right= "+direction)
	
			//Creates a div for the arrow
		
		this.div.id = from.id+"to"+to.id.replace(/[^a-z0-9]/gi, '_')
		this.div.className = "arrow arrow_level_"+(parent.level+1)
		parent.children.appendChild(this.div)
		parent.children.appendChild(this.triangle_div)
		
		this.vertical=vertical
		this.direction=direction
		this.thin_short=thin_short
		}
		

	//Initial rendering of the canvas. 
	//A recursive function that is called once for each box
	Block.prototype.render = function (scale, level, canvas) {
		this.canvas = canvas
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
			
			
			//When the user clicks on a box with the right button, we go up one level

					$(canvas).bind("contextmenu", function (e) {
		
	if (canvas.current.parent){canvas.current.parent.go_to()}
		return false;
		
	});
		} else {
			this.parent.children.appendChild(this.div)
		}		
		
			//A box draws itself when the user clicks on it with the left mouse button	
		var that=this
		$(this.div).click( function (event) {

		if ($.inArray(that, canvas.current.blocks)!==-1){
	
		that.go_to()
		}
			
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
				this.blocks[i].render(scale, level, canvas)
			}

		}
	}