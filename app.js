/* Shared behaviour: theme toggle, simulators menu, search overlay. */
(function(){
var root=document.documentElement;
function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
function setTheme(t){root.setAttribute('data-theme',t);store('dgca.theme',t);var m=document.querySelector('meta[name=theme-color]');if(m)m.content=t==='dark'?'#131926':'#f1f4f9'}
var tb=document.getElementById('themeBtn');
if(tb)tb.onclick=function(){setTheme(root.getAttribute('data-theme')==='dark'?'light':'dark')};

/* mark the current nav link */
(function(){var mock=/[?&]mode=test/.test(location.search),file=location.pathname.split('/').pop()||'index.html';
document.querySelectorAll('.nav>a').forEach(function(a){var h=a.getAttribute('href'),f=h.split('?')[0],m=/mode=test/.test(h);
a.classList.toggle('on',f===file&&(f!=='practice.html'||m===mock))})})();

/* simulators dropdown */
var dd=document.querySelector('.dd');
if(dd){var bt=dd.querySelector('button');
bt.onclick=function(e){e.stopPropagation();dd.classList.toggle('open');bt.setAttribute('aria-expanded',dd.classList.contains('open'))};
document.addEventListener('click',function(e){if(!dd.contains(e.target))dd.classList.remove('open')});
addEventListener('keydown',function(e){if(e.key==='Escape')dd.classList.remove('open')})}

/* search */
var X=window.SITE_INDEX||[];
var ov=document.getElementById('ov'),inp=ov&&ov.querySelector('input'),res=ov&&ov.querySelector('.ov-res'),sel=0,list=[];
function esc(s){return String(s).replace(/[&<>]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;'}[c]})}
function run(){var q=inp.value.toLowerCase().split(/\s+/).filter(Boolean);
list=X.filter(function(p){var h=(p[0]+' '+p[2]+' '+(p[3]||'')).toLowerCase();return q.every(function(w){return h.indexOf(w)>-1})});
if(!q.length)list=X.filter(function(p){return p[4]==='page'});
list=list.slice(0,40);sel=0;draw()}
function draw(){var h='',last='';list.forEach(function(p,i){if(p[5]!==last){last=p[5];h+='<div class="ov-h">'+esc(last)+'</div>'}
h+='<a href="'+p[1]+'" data-i="'+i+'" class="'+(i===sel?'sel':'')+'"><span>'+esc(p[0])+'</span><small>'+esc(p[2])+'</small></a>'});
res.innerHTML=h||'<p class="mute" style="padding:12px 16px">No match. Try another word, e.g. "holding", "QNH", "wind triangle".</p>'}
function open(on){if(!ov)return;ov.classList.toggle('on',on);if(on){inp.value='';inp.focus();run()}}
document.querySelectorAll('[data-search]').forEach(function(b){b.onclick=function(){open(true)}});
if(ov){ov.onclick=function(e){if(e.target===ov)open(false)};
inp.oninput=run;
inp.onkeydown=function(e){if(e.key==='ArrowDown'){sel=Math.min(list.length-1,sel+1);draw();e.preventDefault();var s=res.querySelector('.sel');s&&s.scrollIntoView({block:'nearest'})}
else if(e.key==='ArrowUp'){sel=Math.max(0,sel-1);draw();e.preventDefault();var s2=res.querySelector('.sel');s2&&s2.scrollIntoView({block:'nearest'})}
else if(e.key==='Enter'&&list[sel])location.href=list[sel][1];else if(e.key==='Escape')open(false)}}
addEventListener('keydown',function(e){var t=(e.target||{}).tagName||'';
if((e.key==='k'&&(e.ctrlKey||e.metaKey))||(e.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(t))){e.preventDefault();open(true)}
else if(e.key==='Escape'&&ov&&ov.classList.contains('on'))open(false)});
})();
