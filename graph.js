//---------------Constants----------------
var margin =0.2
var airmargin = 1
var speed=300
var headingsize=1.2
var debug=false

$(document).ready(function() {
$( ".info" ).each(function() {mesmerize($(this), $.parseJSON($(this).html()) )})



$("#json").keyup(function(){
		
input=null
input = $.parseJSON($(this).val())
if (input!=null){

 mesmerize($('.jsoninput'),input)
}
    });
    




});

 


function mesmerize(canvas, input){
var plainobjects = input
canvas.html('')

//---------------The drawing function----------------

function draw(blockId, block){


if(debug){console.log("draw("+blockId)}
if (block==null){//console.log("block="+root)
block=root}

if (block.div.id.valueOf()===blockId.valueOf()){
//we found it
block.go_to()}
else{
if (block.blocks!=null){
for (var i = 0; i < block.blocks.length; i++){
draw(blockId, block.blocks[i])
}
}}
}


//---------------Right Click----------------


canvas.bind("contextmenu", function(e) {

 current.parent.go_to();
 return false;
});

//---------------The Block class----------------

//constructor
var Block = function(id,x,y, blocks_plain){
//coordinates
this.x=x;
this.y=y;
this.blocks_plain=blocks_plain;
//name/id
this.id=id;
//children
blocks = new Array()
this.blocks=blocks;

arrows = new Array()
this.arrows=arrows;
}

Block.prototype.append = function(block){
this.blocks.push(block)
}

//initial render
Block.prototype.render = function(scale, level){

this.scale = scale
this.level = level



this.div = document.createElement("div");
this.div.id = this.id.replace(/[^a-z0-9]/gi, '_')
this.div.className="level"+this.level+" block"
this.div.style.opacity=0
this.div.style.display="none"
if (scale === 0){
canvas.append(this.div)

} 
else {
this.parent.children.appendChild(this.div)}


$(this.div).bind('click', function(event) {
event.stopPropagation()

draw(this.id)
})

this.heading = document.createElement("div");
this.heading.setAttribute("class", "label");
this.heading.innerHTML = this.id;
this.div.appendChild(this.heading);


this.children = document.createElement("div");
this.div.appendChild(this.children);
this.children.id = this.id.replace(" ", "_")+"_blocks";

if(this.blocks_plain!=null){
for (var i = 0; i < this.blocks_plain.length; i++){


this.append(parseBlock(this.blocks_plain[i]))

}


//We have to figure how many columns and rows are there:

scale=0
for (var i = 0; i < this.blocks.length; i++){

if(scale<this.blocks[i].y){scale=this.blocks[i].y} 
if(scale<this.blocks[i].x){scale=this.blocks[i].x}

}
scale++

level++
for (var i = 0; i < this.blocks.length; i++){
this.blocks[i].parent=this
this.blocks[i].render(scale, level)
}

if(this.arrows!=null){
//draw arrows
}
}}





//draws the root block (the one that occupies the whole screen) 
Block.prototype.go_to = function(){

if (debug){console.log("goto"+this.div.id)}


//we mark that this is the current block
current=this;

//The root block should occupy all of the  
//Therefore we will set the scale so it would appear in so:
this.width = canvas.width();
this.height = canvas.height(); 



//the element's neighbour blocks must fade out, while it takes the screen
if (current.parent){
	this.parent.div.style.marginLeft="0px";
	this.parent.div.style.marginTop="0px";
	neighbours = current.parent.blocks;

	for (i=0; i<neighbours.length;i++){
	
	if(neighbours[i]!=current){
	
	$(neighbours[i].div).animate({
top: (neighbours[i].x-this.x)*this.height+"px",

left: (neighbours[i].y-this.y)*this.width+"px",
height:this.height+"px",
width: this.width+"px",
opacity: 0,
}, speed, function(){$(this).css("display","none") } );

	}
	}
}



//After we know when the block should be placed, we can do the actual moving:


this.div.style.display="table"
$("#"+this.div.id, canvas).animate({
left: "0px",
top: "0px",
height: this.height+"px",
width: this.width+"px",
opacity: 1,
}, speed );


$(this.heading, canvas).animate({fontSize: Math.round(this.width/10*headingsize)+"px", marginTop: Math.round(this.height/2-this.width/10*headingsize)+"px", opacity:0.3} ,speed);


//if the root block has children we draw them also
if(this.blocks!=null){

for (var i = 0; i < this.blocks.length; i++){
this.blocks[i].drawchild( document.getElementById(this.div.id+"_blocks"))
if (debug){console.log("drawchild "+this.blocks[i].div.id)}
}


}



} 




//draws the child blocks
Block.prototype.drawchild = function(parent_div, invisible){


this.div.style.display="table"

var width = this.parent.width
var height = this.parent.height
var scale =this.scale
var x=this.x
var y=this.y

//some calculations in order to get the block's proportions
columnwidth=Math.round(width/scale)

widthmargin = Math.round(margin*columnwidth)
this.width =columnwidth-widthmargin
left=columnwidth*y

rowheight=Math.round(height/scale)
heightmargin = Math.round(margin*rowheight)

this.height =rowheight-heightmargin
down=rowheight*x

//After we know when the block should be placed, we can do the actual moving:

var style = new Object({
height: Math.round(this.height)+"px",
width: Math.round(this.width)+"px",
})
if(invisible!=true){style.opacity=1} else {style.opacity=0}
style.left=left+widthmargin/2+"px"
style.top=down+heightmargin/2+"px"

$("#"+this.div.id, canvas).animate(style, speed, function(){if(invisible===true){$(this).css("display","none") }});
$(this.heading).animate({fontSize: Math.round(this.width/10*headingsize)+"px", 
marginTop: Math.round(this.height/2-this.width/10*headingsize)+"px",
opacity:1} ,speed);


if(debug){console.log("animate "+this.div.id+"(left="+left+" top="+down)}


//if the current block has children we draw them
if(this.blocks!=null){

for (var i = 0; i < this.blocks.length; i++){

this.blocks[i].drawchild(document.getElementById(this.div.id+"_blocks"), true)

}


}



}

//connects the blocks
Block.prototype.connect = function(targetblock){

}



//---------------Parsing input----------------

function parseBlock(blockarray){

var place="a1"
var children=new Array()
var size="1x1"

for(var i=1;i<blockarray.length;i++){
infopiece=blockarray[i]
if(typeof infopiece==="string"){
if (infopiece.length===2){ place=infopiece
}else if (infopiece.length===3){size=infopiece}
}else if(infopiece instanceof Array){
children.push(infopiece)
}
}

x=place.toLowerCase().charCodeAt(0)-97
y=parseInt(place.charAt(1))-1
console.log(blockarray[0])
block = new Block (blockarray[0], x, y, children)
return block
}

var root = parseBlock(plainobjects)
root.render(0,0)
root.go_to()
}