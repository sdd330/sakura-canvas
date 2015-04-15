define("util",["require"],function(e){var t={};return t.shallowExtend=function(e,t,n){for(var r in t)t.hasOwnProperty(r)&&(n||e[r]===void "Heil Hydra!")&&(e[r]=t[r]);return e},t.getRandomInt=function(e,t){return t|=0,Math.floor(Math.random()*(e-t))+t},t.isSupportCanvas=function(){return!!document.createElement("CANVAS").getContext},t.inherits=function(e,t){var n=e.prototype,r=new Function;r.prototype=t.prototype;var i=e.prototype=new r;for(var s in n)i[s]=n[s];e.prototype.constructor=e,e.superClass=t.prototype},t}),define("base",["require","util"],function(e){function n(e){this.config=t.shallowExtend(e||{},this._defaultConfig),this._calcInitValues()}var t=e("util");return n.prototype._defaultConfig={},n.prototype._calcInitValues=function(){},n}),define("chip",["require","util","base"],function(e){function r(e){n.call(this,e)}var t=e("util"),n=e("base");return t.inherits(r,n),r.prototype._defaultConfig={canvasWidth:800,canvasHeight:600,maxDepth:250,minDepth:0,baseDepth:50,baseSize:4.5,baseSpeedX:.8,baseSpeedY:1.6,minAlpha:.5,maxAlpha:1,chipColor:{r:235,g:178,b:180}},r.prototype._calcInitValues=function(){var e=this.config;this.x=t.getRandomInt(e.canvasWidth),this.y=t.getRandomInt(e.canvasHeight),this.depth=t.getRandomInt(e.maxDepth,e.minDepth),this.r1=Math.random()*Math.PI*2,this.r2=Math.random()*Math.PI*2,this.rp1=Math.random()*.1,this.rp2=Math.random()*.1,this.color=[e.chipColor.r+t.getRandomInt(20),e.chipColor.g+t.getRandomInt(20),e.chipColor.b+t.getRandomInt(20)]},r.prototype.move=function(){var e=this.config;this.r1=this.r1+this.rp1<Math.PI*2?this.r1+this.rp1:this.r1+this.rp1-Math.PI*2,this.r2=this.r2+this.rp2<Math.PI*2?this.r2+this.rp2:this.r2+this.rp2-Math.PI*2,this.x+=e.baseSpeedX*(1+this.depth/e.baseDepth),this.y+=e.baseSpeedY*(1+this.depth/e.baseDepth)+Math.sin(this.r1)*2;var n=t.getRandomInt(e.maxDepth,e.minDepth);e.baseSpeedX>0?this.x>e.canvasWidth&&(this.x=0,this.y=e.canvasHeight-this.y,this.depth=n):this.x<0&&(this.x=e.canvasWidth,this.y=e.canvasHeight-this.y,this.depth=n),e.baseSpeedY>0?this.y>e.canvasHeight&&(this.x=e.canvasWidth-this.x,this.y=0,this.depth=n):this.y<0&&(this.x=e.canvasWidth-this.x,this.y=e.canvasHeight,this.depth=n)},r.prototype.getAlpha=function(){var e=this.config;return e.minAlpha+(e.maxAlpha-e.minAlpha)*(this.depth/e.baseDepth)},r.prototype.getPetal=function(){var e=this.config,t=e.baseSize*(1+this.depth/e.baseDepth),n=Math.sin(this.r1)*t,r=Math.sin(this.r2)*t,i=Math.cos(this.r1)*t,s=Math.cos(this.r2)*t,o=.9;return[[this.x,this.y],[this.x+i,this.y+n,this.x+i+r/2,this.y+n+s/2],[this.x+(i+r)*.75*o,this.y+(s+n)*.75*o],[this.x+r+i/2,this.y+s+n/2],[this.x+r,this.y+s,this.x,this.y]]},r}),define("sakura-canvas",["require","util","base","chip"],function(e){function r(e){if(!t.isSupportCanvas())throw new Error("The browser doesn't support <canvas>.");n.call(this,e)}var t=e("util"),n=e("base");return t.inherits(r,n),r.prototype._defaultConfig={canvasClassName:"ec-sakura-canvas",canvasWidth:800,canvasHeight:600,framerate:20,maxChips:24,shadowColor:"#DE8397",shadowBlur:2},r.prototype._calcInitValues=function(){this.config.createLimit=this.config.framespan/2,this.config.framespan=1e3/this.config.framerate,this.canvas,this.context,this.chips=[],this.chipsLen=0},r.prototype.init=function(){this._createCanvas(),this._createChips()},r.prototype._createCanvas=function(){var e=document.createElement("CANVAS");e.className=this.config.canvasClassName,e.width=this.config.canvasWidth,e.height=this.config.canvasHeight,this.canvas=e,this.context=e.getContext("2d")},r.prototype._createChips=function(){var t=this.config,n=[],r=0,i=new Date,s,o,u=e("chip");for(o=0;o<t.maxChips;++o){n.push(new u(t)),++r,s=new Date;if(s.getTime()-i.getTime()>t.createLimit)break}this.chips=n,this.chipsLen=r},r.prototype._loop=function(){var e=this.config,t=new Date,n=this.context,r,i,s,o;n.clearRect(0,0,n.canvas.width,n.canvas.height),n.shadowBlur=e.shadowBlur,n.shadowColor=e.shadowColor,n.save();for(o=0;o<this.chipsLen;++o){r=this.chips[o],r.move(),i=r.getAlpha(),s=r.getPetal(),n.fillStyle="rgba("+r.color[0]+","+r.color[1]+","+r.color[2]+","+i+")",n.beginPath(),n.moveTo(s[0][0],s[0][1]),n.quadraticCurveTo(s[1][0],s[1][1],s[1][2],s[1][3]),n.lineTo(s[2][0],s[2][1]),n.lineTo(s[3][0],s[3][1]),n.quadraticCurveTo(s[4][0],s[4][1],s[4][2],s[4][3]),n.closePath(),n.fill();if((new Date).getTime()-t.getTime()>e.createLimit)break}n.restore()},r.prototype.getCanvas=function(){return this.canvas},r.prototype.getCanvasContext=function(){return this.context},r.prototype.animate=function(){setInterval(function(e){return function(){e._loop.call(e)}}(this),this.config.framespan)},r});