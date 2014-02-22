	 //Contains functions for parsing the JSON input and for turning it into Block and Arrow objects

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
	    blocks = block.blocks
	    sequential_arrows = new Array()

	    for (var j = 2; j < arrowarray.length; j++) {

	        from = null
	        to = null
	        for (var i = 0; i < blocks.length; i++) {

	            if (blocks[i].id === arrowarray[j - 1]) {
	                from = blocks[i]
	            } else if (blocks[i].id === arrowarray[j]) {
	                to = blocks[i]
	            }
	        }
	        if (from === null) {
	            console.log("I coudn't find a box called '" + arrowarray[j - 1] + "'.")
	        } else if (to === null) {
	            console.log("I coudn't find a box called '" + arrowarray[j] + "'.")
	        } else {
	            if (debug) {
	                console.log("Creating an arrow from " + from.id + " to " + to.id)
	            }

	            sequential_arrows.push(new Arrow(from, to, block))
	        }
	    }
	    return sequential_arrows
	}