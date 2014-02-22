
	//Called when the user clicks on a box. Makes it occupy the whole screen
	Block.prototype.go_to = function () {
	
		if (debug) {
			console.log("goto" + this.div.id)
		}
		//we mark that this is the current box
		this.canvas.current = this;
		//The size of the box will be equal to the size of the canvas
		this.width = this.canvas.width();
		this.height = this.canvas.height();
		//this makes the other boxes fade out, while our box takes the screen
		if (this.canvas.current.parent) {
			neighbours = this.canvas.current.parent.blocks;
			for (i = 0; i < neighbours.length; i++) {
				if (neighbours[i] != this.canvas.current) {
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

			for (i = 0; i < this.canvas.current.parent.arrows.length; i++) {
			
			 $(this.canvas.current.parent.arrows[i].div).animate(
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
		
		$("#" + this.div.id, this.canvas).animate(style, speed);
		//Making its label bigger
		$(this.heading, this.canvas).animate({
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
		
		$(this.div).animate(style, speed, function () {
			if (invisible === true) {
				$(this).css("display", "none")
			}
		});
		//Making its label bigger
		$(this.heading).animate({
			fontSize: Math.round(columnwidth / 10 * headingsize) + "px",
			paddingLeft: Math.round(columnwidth / 10 * text_margin),
			paddingRight: Math.round(columnwidth / 10 * text_margin),
			opacity: 1
		}, speed);
		if (debug) {
			console.log("Draw box " + this.div.id + "(left=" + left + " top=" + tops + " height="+this.height+" width="+this.width)
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
		
		if (this.arrows != null) {
		for (var i = 0; i < this.arrows.length; i++) {
	
		this.arrows[i].draw(true)
		}
		}
	}
	
	//Draws the arrows in a graphic
	Arrow.prototype.draw = function (isinvisible) {
	if (this.vertical!==null){
	style={opacity: 1}
	style_triangle={}
	if (isinvisible){style.opacity=0;style_triangle.opacity=0} else {style.opacity=1;style_triangle.opacity=1}
		if (this.vertical){
			style.top=this.top=(this.top_box.tops+this.top_box.height)
			style.height=this.height=(this.down_box.tops-this.top_box.tops-this.top_box.height)
			style.left=this.left=(this.thin_short.left+this.thin_short.width/2)
			style.width=this.width="0"
			
			style_triangle.left=this.left-9
			if(this.direction){
			style_triangle.top=this.height+this.top-9
			} else{
			style_triangle.top=this.top+2
			}
		} else{
			style.left=this.left=(this.left_box.left+this.left_box.width)
			style.width=this.width=(this.right_box.left-this.left_box.left-this.left_box.width)
			style.top=this.top=(this.thin_short.tops+this.thin_short.height/2)
			style.height=this.height="0"
			
			style_triangle.top=this.top-9
			if(this.direction){
			style_triangle.left=this.left+this.width-9
			} else{
			style_triangle.left=this.left+2}
		
		}
		
		
	}
	$(this.triangle_div).animate(style_triangle,speed)
	$(this.div).animate(style,speed)
	}