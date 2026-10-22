'use strict';
// Recreated V3 fluid-light motion. No dependency on Framer's private renderer.
(()=>{
 const canvas=document.querySelector('#flow'),toggle=document.querySelector('#motion-toggle');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let paused=reduced.matches,frame=0,time=0,last=0;
 const gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});
 const sync=()=>{document.body.classList.toggle('paused',paused);toggle.setAttribute('aria-pressed',String(!paused));toggle.title=paused?'Resume animation':'Pause animation';toggle.setAttribute('aria-label',toggle.title);};sync();
 if(!gl){toggle.hidden=true;return;}
 const vertex='attribute vec2 position;void main(){gl_Position=vec4(position,0.,1.);}';
 const fragment=`precision mediump float;
 uniform vec2 resolution;uniform float time;
 float field(vec2 p){float t=time*.17;return sin(p.x*2.2+t+sin(p.y*2.5-t)*1.2)+cos(p.y*2.1-t*.7+sin(p.x*1.8+t)*.8);}
 void main(){vec2 uv=gl_FragCoord.xy/resolution;vec2 p=(uv-.5)*vec2(resolution.x/resolution.y,1.)*3.0;
 float f=field(p);float wave=exp(-abs(f-.45)*2.6);float edge=exp(-abs(f-.62)*24.0);float outer=pow(smoothstep(.12,.72,length(uv-.5)),1.4);
 vec3 blue=vec3(.005,.20,.58)*wave+vec3(0.,.34,.72)*edge*.55;
 float cyan=pow(max(0.,sin(p.x*.8+p.y*.7+time*.12)),8.);blue+=vec3(.04,.66,.77)*edge*cyan*.7;
 float dark=1.-exp(-length((uv-.5)*vec2(1.25,1.))*5.);vec3 color=blue*outer*dark*1.7;gl_FragColor=vec4(color,1.);}`;
 function shader(type,source){const result=gl.createShader(type);gl.shaderSource(result,source);gl.compileShader(result);if(!gl.getShaderParameter(result,gl.COMPILE_STATUS))throw Error('Motion shader unavailable');return result;}
 let program;try{program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Motion renderer unavailable');}catch{toggle.hidden=true;return;}
 gl.useProgram(program);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const position=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);const r=gl.getUniformLocation(program,'resolution'),t=gl.getUniformLocation(program,'time');
 function resize(){const rect=canvas.getBoundingClientRect();const scale=Math.min(devicePixelRatio||1,1.25);canvas.width=Math.round(rect.width*scale);canvas.height=Math.round(rect.height*scale);gl.viewport(0,0,canvas.width,canvas.height);draw();}
 function draw(){gl.uniform2f(r,canvas.width,canvas.height);gl.uniform1f(t,time);gl.drawArrays(gl.TRIANGLES,0,6);}
 function tick(now){if(last)time+=Math.min((now-last)/1000,.05);last=now;draw();frame=requestAnimationFrame(tick);}
 function run(){cancelAnimationFrame(frame);last=0;if(!paused&&!document.hidden)frame=requestAnimationFrame(tick);else draw();}
 toggle.onclick=()=>{paused=!paused;sync();run();};reduced.addEventListener('change',()=>{paused=reduced.matches;sync();run();});document.addEventListener('visibilitychange',run);window.addEventListener('resize',resize);resize();run();
})();
