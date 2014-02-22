//Graphic Settings
var headingsize = 1
var margin = 0.2
var margin_top_bottom = 0.02
var margin_sides = 0.02
var text_margin =0.5

//Animation Speed
var speed = 250

//Turn Debug On/Off
var debug = false

//Constants
var css_styles = ["important", "minor", "many"]
var special_styles = ["transparent", "rounded"]
var arrow = "connect"




function mesmerize(canvas, input) {
	var plainobjects = input
	canvas.html('')
	var root = parseBlock(plainobjects)
	
	//Initial render
	root.render(0, 0, canvas)
	//Drawing
	root.go_to()
}