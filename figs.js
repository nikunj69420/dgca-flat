/* Diagram library. Everything is inline SVG that follows the theme through CSS variables. */
(function(){
const rad=d=>d*Math.PI/180;
const INK='var(--ink)',MU='var(--mute)',AC='var(--acc)',OK='var(--ok)',BD='var(--bad)',WN='var(--warn)',LN='var(--line)',PN='var(--panel)',BG='var(--bg)';
const soft=(c,p)=>`color-mix(in srgb,${c} ${p||18}%,transparent)`;
function svg(w,h,b){return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Diagram">${b}</svg>`}
function ar(x1,y1,x2,y2,c,w,hd){const a=Math.atan2(y2-y1,x2-x1),h=hd||9;return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w||2.5}" stroke-linecap="round"/><path d="M${x2} ${y2} L${x2-h*Math.cos(a-.4)} ${y2-h*Math.sin(a-.4)} L${x2-h*Math.cos(a+.4)} ${y2-h*Math.sin(a+.4)}Z" fill="${c}"/>`}
const tx=(x,y,t,o)=>`<text x="${x}" y="${y}" text-anchor="${(o&&o.a)||'middle'}" font-size="${(o&&o.s)||11}" fill="${(o&&o.c)||INK}"${o&&o.b?' font-weight="700"':''}${o&&o.i?' font-style="italic"':''}>${t}</text>`;
const ln=(x1,y1,x2,y2,c,w,d)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c||INK}" stroke-width="${w||2}"${d?` stroke-dasharray="${d}"`:''} stroke-linecap="round"/>`;
const ci=(x,y,r,f,s,sw)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${f||'none'}"${s?` stroke="${s}" stroke-width="${sw||2}"`:''}/>`;
const rc=(x,y,w,h,f,s,r,sw)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f||'none'}"${s?` stroke="${s}" stroke-width="${sw||1.5}"`:''}${r?` rx="${r}"`:''}/>`;
const pa=(d,f,s,sw,x)=>`<path d="${d}" fill="${f||'none'}"${s?` stroke="${s}" stroke-width="${sw||2}" stroke-linecap="round" stroke-linejoin="round"`:''}${x||''}/>`;
const plane=(x,y,s,rot,c)=>`<g transform="translate(${x} ${y}) rotate(${rot||0}) scale(${s||1})"><path d="M0 -14 q2.5 0 2.5 5 v7 l13 6 v3 l-13 -2 v8 l4 3 v2.5 l-6.5 -1.2 l-6.5 1.2 v-2.5 l4 -3 v-8 l-13 2 v-3 l13 -6 v-7 q0 -5 2.5 -5z" fill="${c||INK}"/></g>`;
const cloud=(x,y,s,f,st)=>`<g transform="translate(${x} ${y}) scale(${s||1})"><path d="M-30 12 q-14 0 -14 -12 q0 -11 13 -11 q3 -14 19 -13 q12 -9 25 1 q16 -3 20 12 q12 1 12 12 q0 11 -12 11z" fill="${f||PN}" stroke="${st||MU}" stroke-width="1.6"/></g>`;

const FG={};
/* ---------- figures used inside questions ---------- */
Object.assign(FG,{
xw:f=>{const c=130,cy=105,a=rad(f.wd-f.rw),sc=62/Math.max(f.ws,12),px=c+Math.sin(a)*f.ws*sc,py=cy-Math.cos(a)*f.ws*sc;return svg(260,210,`<rect x="${c-14}" y="6" width="28" height="198" fill="var(--mute)" opacity=".35"/><path d="M${c} 22v176" stroke="var(--ink)" stroke-dasharray="10 8"/>`+ar(px,py,c,cy,'var(--ink)',3)+ar(px,py,c,py,'var(--acc)',2.5)+ar(c,py,c,cy,'var(--ok)',2.5)+tx(c,16,`RWY ${String(Math.round(f.rw/10)||36).padStart(2,'0')} (${f.rw}°) ↑`)+tx(px,py-9,`${f.wd}° / ${f.ws} kt`,{b:1}))},
wt:f=>{const c=130,cy=108,r=66,s1=Math.sin(rad(f.tc)),c1=Math.cos(rad(f.tc)),s2=Math.sin(rad(f.wd)),c2=Math.cos(rad(f.wd));return svg(260,216,`<circle cx="${c}" cy="${cy}" r="${r}" fill="none" stroke="var(--line)" stroke-width="2"/>`+tx(c,cy-r-6,'N')+ar(c,cy,c+s1*r,cy-c1*r,'var(--ok)',3)+tx(c+s1*(r+28),cy-c1*(r+28)+4,`track ${String(f.tc).padStart(3,'0')}°`,{c:'var(--ok)',b:1})+ar(c+s2*(r+34),cy-c2*(r+34),c+s2*10,cy-c2*10,'var(--acc)',3)+tx(c+s2*(r+34),cy-c2*(r+34)-6,`wind from ${String(f.wd).padStart(3,'0')}° ${f.ws} kt`,{c:'var(--acc)',b:1})+tx(c,208,`TAS ${f.tas} kt`))},
p60:f=>{const A=[30,150],B=[230,150],t=f.D?f.d1/f.D:1,pxx=f.D?A[0]+200*t:200,off=Math.min(70,Math.max(20,f.x*7)),Pp=[pxx,150-off];return svg(260,190,`<path d="M${A[0]} 150L${f.D?B[0]:Pp[0]} 150" stroke="var(--mute)" stroke-dasharray="6 5" stroke-width="2"/><path d="M${A[0]} 150L${Pp[0]} ${Pp[1]}" stroke="var(--ink)" stroke-width="2.5"/>`+(f.D?`<path d="M${Pp[0]} ${Pp[1]}L${B[0]} 150" stroke="var(--acc)" stroke-width="2.5" stroke-dasharray="6 4"/>`:'')+`<path d="M${Pp[0]} 150V${Pp[1]}" stroke="var(--ok)" stroke-width="2"/><circle cx="${A[0]}" cy="150" r="5" fill="var(--ink)"/><circle cx="${Pp[0]}" cy="${Pp[1]}" r="5" fill="var(--acc)"/>`+(f.D?`<circle cx="${B[0]}" cy="150" r="5" fill="var(--ink)"/>`+tx(B[0],170,'B'):'')+tx(A[0],170,'A')+tx((A[0]+Pp[0])/2,172,`${f.d1} NM flown`)+tx(Pp[0]+8,(150+Pp[1])/2,`${f.x} NM off`,{a:'start',c:'var(--ok)'})+(f.D?tx((Pp[0]+B[0])/2+10,128,`${f.D-f.d1} NM to go`,{c:'var(--acc)'}):'')+tx(130,18,'planned track (dashed) and actual track',{c:'var(--mute)'}))},
pet:f=>svg(260,150,`<path d="M30 80H230" stroke="var(--ink)" stroke-width="3"/><circle cx="30" cy="80" r="6" fill="var(--ink)"/><circle cx="230" cy="80" r="6" fill="var(--ink)"/>`+tx(30,104,'A')+tx(230,104,'B')+tx(130,64,`${f.D} NM`)+ar(40,38,110,38,'var(--ok)')+tx(75,30,`out ${f.go} kt`,{c:'var(--ok)'})+ar(220,128,150,128,'var(--acc)')+tx(185,146,`back ${f.gh} kt`,{c:'var(--acc)'})+`<path d="M${30+200*f.gh/(f.go+f.gh)} 70v20" stroke="var(--acc)" stroke-width="3"/>`+tx(30+200*f.gh/(f.go+f.gh),118,'PET ?',{b:1,c:'var(--acc)'})),
pnr:f=>svg(260,150,`<path d="M30 80H190" stroke="var(--ink)" stroke-width="3"/><circle cx="30" cy="80" r="6" fill="var(--ink)"/><circle cx="190" cy="80" r="6" fill="var(--acc)"/>`+tx(30,104,'A')+tx(190,104,'PNR ?',{b:1,c:'var(--acc)'})+ar(40,50,170,50,'var(--ok)')+tx(105,42,`out ${f.go} kt`,{c:'var(--ok)'})+ar(180,128,50,128,'var(--acc)')+tx(115,146,`home ${f.gh} kt`,{c:'var(--acc)'})+tx(130,16,`safe endurance ${f.E} h`)),
papi:f=>svg(260,100,[0,1,2,3].map(i=>`<circle cx="${50+i*54}" cy="40" r="19" fill="${i<f.w?'#ffffff':'#e11d48'}" stroke="var(--ink)" stroke-width="2"/>`).join('')+tx(130,86,`${f.w} white · ${4-f.w} red`,{c:'var(--mute)'})),
sig:f=>{const col={g:'#00e676',r:'#ff1744',w:'#ffffff'}[f.c],nm=(f.m==='s'?'STEADY ':'FLASHING ')+({g:'GREEN',r:'RED',w:'WHITE'}[f.c]);return svg(300,150,`<rect x="0" y="118" width="300" height="32" fill="var(--mute)" opacity=".3"/><rect x="26" y="70" width="34" height="48" fill="var(--mute)"/><rect x="18" y="52" width="50" height="20" fill="var(--ink)" opacity=".7"/><polygon points="68,62 200,${f.air?36:100} 200,${f.air?64:128}" fill="${col}" opacity="${f.m==='s'?.55:.3}"${f.m==='f'?' stroke-dasharray="4 4" stroke="'+col+'"':''}/><circle cx="68" cy="62" r="6" fill="${col}"/><path d="M210 ${f.air?50:114} l32 -4 l22 4 l-22 5z" fill="var(--ink)"/>`+tx(150,20,nm,{b:1})+tx(236,f.air?32:96,f.air?'in flight':'on the ground',{c:'var(--mute)'}))},
navl:()=>svg(260,150,`<path d="M130 20 q10 0 10 14 v28 l70 22 v10 l-70 -6 v34 l24 14 v8 l-34 -6 l-34 6 v-8 l24 -14 v-34 l-70 6 v-10 l70 -22 v-28 q0 -14 10 -14z" fill="var(--mute)" opacity=".5"/><circle cx="62" cy="86" r="7" fill="#ff1744"/><circle cx="198" cy="86" r="7" fill="#00e676"/><circle cx="130" cy="136" r="6" fill="#fff" stroke="var(--ink)"/>`+tx(50,108,'red · left (port)',{c:'#ff1744'})+tx(206,108,'green · right (starboard)',{c:'#00b45a'})+tx(130,12,'viewed from above')+tx(130,148,'white · tail',{s:10})),
rwy:()=>svg(260,200,`<rect x="104" y="20" width="52" height="160" fill="var(--mute)" opacity=".45"/><path d="M130 30v140" stroke="var(--ink)" stroke-dasharray="8 8"/>`+tx(130,50,'27',{b:1,s:14})+`<g transform="rotate(180 130 150)">`+'</g>'+tx(130,168,'09',{b:1,s:14})+tx(40,100,'N ↑',{c:'var(--mute)'})+tx(130,12,'Runway numbers = magnetic heading ÷ 10',{s:10})+tx(130,194,'(heading 090° and 270° ends)',{s:10,c:'var(--mute)'})),
lf:f=>{const c=130,cy=100,a=rad(f.b),L=70;return svg(260,200,`<path d="M${c-60*Math.cos(a)} ${cy+60*Math.sin(a)} L${c+60*Math.cos(a)} ${cy-60*Math.sin(a)}" stroke="var(--ink)" stroke-width="5"/><circle cx="${c}" cy="${cy}" r="7" fill="var(--ink)"/>`+ar(c,cy,c-Math.sin(a)*L,cy-Math.cos(a)*L*1.0,'var(--acc)',3)+ar(c,cy,c,cy+L*Math.cos(a)*0+56,'var(--ok)',3)+tx(c-Math.sin(a)*L-6,cy-Math.cos(a)*L-6,'L (lift)',{c:'var(--acc)',b:1})+tx(c+14,cy+68,'W (weight)',{a:'start',c:'var(--ok)',b:1})+tx(c,20,`bank ${f.b}°  ·  L cos φ = W`)+tx(c,190,'in a level turn, load factor n = L ÷ W = 1 ÷ cos φ',{s:10,c:'var(--mute)'}))}
});

/* ---------- concept diagrams ---------- */
const D={};

/* NAVIGATION */
D.conv=()=>svg(320,200,
 pa('M160 22L70 176',0,INK,2.5)+pa('M160 22L250 176',0,INK,2.5)+
 pa('M141.7 53A36 36 0 0 0 178.3 53',0,AC,2.5)+tx(160,76,'Δλ',{c:AC,b:1,s:13})+
 pa('M102.4 120A113.8 113.8 0 0 0 217.6 120',0,MU,2,' stroke-dasharray="5 4"')+
 tx(76,132,'parallel',{a:'end',c:MU})+tx(160,14,'Pole (90°)')+
 ar(112,150,126,140,OK,2)+ar(208,150,194,140,OK,2)+
 tx(160,160,'meridians converge',{c:OK,b:1})+
 tx(160,192,'convergence = change of long. × sin(mean lat)',{s:11,c:MU}));

D.rhumb=()=>svg(320,200,
 rc(24,24,272,140,BG,LN,10)+[1,2,3].map(i=>ln(24+i*68,24,24+i*68,164,LN,1)).join('')+[1,2].map(i=>ln(24,24+i*46.7,296,24+i*46.7,LN,1)).join('')+
 pa('M60 120Q160 52 260 120',0,AC,3)+ln(60,120,260,120,OK,3,'7 5')+ci(60,120,5,INK)+ci(260,120,5,INK)+tx(60,138,'A')+tx(260,138,'B')+
 tx(160,66,'Great circle: shortest, track keeps changing',{c:AC,b:1,s:10.5})+tx(160,112,'Rhumb line: constant track',{c:OK,b:1,s:10.5})+
 tx(160,184,'Mercator chart: rhumb line is straight, great circle curves to the pole',{s:10,c:MU})+tx(34,36,'N ↑',{a:'start',c:MU}));

D.tvmdc=()=>{const cx=160,cy=156,P=(an,l)=>[cx+Math.sin(rad(an))*l,cy-Math.cos(rad(an))*l];
 const t=P(0,118),m=P(26,112),c=P(12,70),h=P(96,96);
 return svg(320,200,ar(cx,cy,t[0],t[1],INK,3)+ar(cx,cy,m[0],m[1],AC,3)+ar(cx,cy,c[0],c[1],WN,3)+ar(cx,cy,h[0],h[1],OK,3,10)+
 tx(t[0]-4,t[1]-6,'T',{b:1,s:14})+tx(m[0]+8,m[1]-2,'M',{c:AC,b:1,s:14})+tx(c[0]-12,c[1]+2,'C',{c:WN,b:1,s:14})+tx(h[0]-2,h[1]-8,'heading',{c:OK,b:1,s:10.5})+
 pa(`M${P(0,88)[0]} ${P(0,88)[1]}A88 88 0 0 1 ${P(26,88)[0].toFixed(1)} ${P(26,88)[1].toFixed(1)}`,0,AC,2)+tx(P(13,102)[0]+4,P(13,102)[1]-2,'var',{c:AC,s:10.5,b:1,a:'start'})+
 pa(`M${P(12,44)[0].toFixed(1)} ${P(12,44)[1].toFixed(1)}A44 44 0 0 1 ${P(26,44)[0].toFixed(1)} ${P(26,44)[1].toFixed(1)}`,0,WN,2)+tx(P(19,60)[0]+10,P(19,60)[1]+4,'dev',{c:WN,s:10.5,b:1,a:'start'})+ci(cx,cy,4,INK)+
 tx(160,184,'T = true N · M = magnetic N · C = compass N',{s:10.5,c:MU})+tx(160,198,'var east, magnetic least · var west, magnetic best',{s:10.5,c:MU}))};

D.wtri=()=>svg(320,200,
 ar(46,160,262,160,OK,3.5)+ar(46,160,176,72,AC,3.5)+ar(176,72,262,160,WN,3.5)+
 pa('M82 160A36 36 0 0 0 76 140',0,INK,1.8)+tx(100,148,'WCA',{a:'start',s:10.5,b:1})+
 tx(104,104,'Heading + TAS',{c:AC,b:1,a:'end'})+tx(236,100,'Wind',{c:WN,b:1,a:'start'})+tx(154,180,'Track + Ground speed',{c:OK,b:1})+
 tx(30,24,'Wind blows along the orange vector',{a:'start',s:10.5,c:MU})+tx(30,38,'Point the nose upwind by the WCA to hold track',{a:'start',s:10.5,c:MU})+ci(46,160,4,INK));

D.p60=()=>svg(320,190,
 ln(36,140,286,140,MU,2,'6 5')+pa('M36 140L286 124',0,INK,2.5)+pa('M286 140V124',0,OK,2.5)+ci(36,140,5,INK)+
 pa('M72 140A36 36 0 0 0 71.7 137.7',0,AC,2)+tx(86,134,'1°',{c:AC,b:1,s:13,a:'start'})+
 tx(296,134,'1 NM off',{a:'start',c:OK,b:1,s:10.5})+tx(160,160,'60 NM along track',{c:MU})+
 tx(160,20,'1 in 60 rule',{b:1,s:14})+tx(160,38,'1° of error ≈ 1 NM off per 60 NM flown',{c:MU,s:11})+
 tx(160,182,'track error° = (off-track ÷ distance flown) × 60',{s:10.5,c:MU}));

D.xcomp=()=>{const C=[150,108],T=[150+86*Math.sin(rad(40)),108-86*Math.cos(rad(40))];
 return svg(320,200,rc(138,6,24,188,soft(MU,35))+ln(150,16,150,190,INK,2,'9 7')+
 ar(T[0],T[1],C[0],C[1],INK,3.5)+ln(T[0],T[1],T[0],C[1],MU,1.5,'4 4')+ar(T[0],C[1],C[0]+2,C[1],AC,3)+ar(T[0],T[1],T[0],C[1]-3,OK,3)+
 pa(`M150 ${108-34}A34 34 0 0 1 ${150+34*Math.sin(rad(40))} ${108-34*Math.cos(rad(40))}`,0,INK,1.8)+tx(166,64,'θ',{a:'start',b:1,s:13})+
 tx(T[0]+8,T[1]+4,'Wind',{a:'start',b:1})+tx(T[0]+8,C[1]+22,'Crosswind = V sin θ',{a:'start',c:AC,b:1,s:10.5})+tx(T[0]+8,(T[1]+C[1])/2,'Headwind',{a:'start',c:OK,b:1,s:10.5})+tx(T[0]+8,(T[1]+C[1])/2+13,'= V cos θ',{a:'start',c:OK,b:1,s:10.5})+
 tx(100,100,'RWY',{c:MU,s:10})+tx(100,112,'heading',{c:MU,s:10}))};

D.desc=()=>svg(320,200,
 pa('M20 168H300',0,MU,2)+pa('M36 56L266 168',0,AC,3)+ar(36,56,266,168,AC,3)+ci(36,56,4,INK)+
 ln(36,56,36,168,MU,1.5,'4 4')+tx(44,118,'height to lose',{a:'start',s:10.5})+
 pa('M222 168A44 44 0 0 0 226 146',0,INK,1.8)+tx(194,156,'3°',{b:1})+
 tx(150,186,'distance to go',{c:MU,s:10.5})+tx(36,40,'start of descent',{a:'start',s:10.5,c:MU})+
 tx(140,76,'3° ≈ 318 ft per NM ≈ 5.2 %',{a:'start',c:AC,b:1,s:11.5})+
 tx(140,92,'quick rule: 3 NM per 1000 ft',{a:'start',s:10.5,c:MU})+plane(266,160,.75,90,INK));

D.cgbeam=()=>svg(320,200,
 rc(30,92,262,10,PN,INK,5)+pa('M168 102L152 140H184Z',soft(AC,35),AC,2)+
 [[60,18],[128,30],[240,22]].map(([x,w],i)=>ar(x,40,x,88,OK,2.5)+rc(x-12,20,24,18,soft(OK,20),OK,5)+tx(x,33,'W'+(i+1),{b:1,s:10})).join('')+
 ln(30,92,30,150,INK,2)+tx(30,164,'Datum',{s:10.5,c:MU})+
 ln(30,126,60,126,MU,1.2)+ln(30,126,128,126,MU,1.2,'3 3')+ar(30,120,128,120,MU,1.2,6)+tx(79,116,'arm₂',{s:9.5,c:MU})+
 tx(168,158,'CG',{c:AC,b:1})+tx(160,186,'CG = Σ(weight × arm) ÷ Σ weight',{s:11.5,c:INK,b:1}));

D.scale=()=>svg(320,170,
 tx(160,20,'Chart scale 1 : 1 000 000',{b:1,s:13})+
 [0,1,2,3].map(i=>rc(40+i*60,36,60,22,i%2?soft(AC,22):soft(AC,8),AC,2)).join('')+
 [0,1,2,3,4].map(i=>tx(40+i*60,74,i,{s:10.5,c:MU})).join('')+tx(280,92,'cm on chart',{a:'end',s:10,c:MU})+
 [0,1,2,3].map(i=>rc(40+i*60,106,60,22,i%2?soft(OK,22):soft(OK,8),OK,2)).join('')+
 ['0','5.4','10.8','16.2','21.6'].map((v,i)=>tx(40+i*60,144,v,{s:10.5,c:MU})).join('')+tx(280,162,'NM on the ground',{a:'end',s:10,c:MU})+
 tx(160,98,'1 cm = 10 km ≈ 5.4 NM',{s:10.5,c:INK,b:1}));

D.climb=()=>svg(320,190,
 pa('M30 158H290',0,MU,2)+pa('M30 158L258 62V158',soft(AC,10),AC,3)+pa('M258 158H290',0,MU,2)+
 pa('M80 158A50 50 0 0 0 76 144',0,INK,1.8)+tx(100,150,'γ',{b:1,s:14,a:'start'})+
 tx(266,106,'height',{a:'start',s:10.5,c:OK,b:1})+tx(266,119,'gain',{a:'start',s:10.5,c:OK,b:1})+tx(144,176,'horizontal distance',{c:MU,s:10.5})+
 tx(130,98,'climb path',{c:AC,b:1,s:10.5,a:'end'})+
 tx(160,18,'Gradient % = height ÷ distance × 100',{b:1,s:11.5})+tx(160,36,'ft per NM = ROC ÷ GS × 60',{c:MU,s:11}));

/* METEOROLOGY */
D.isa=()=>svg(320,210,
 ln(50,178,300,178,MU,1.5)+ln(50,178,50,16,MU,1.5)+
 pa('M92 178L180 78L180 30',0,AC,3.5)+ci(92,178,4,INK)+ci(180,78,4,INK)+ln(50,78,300,78,LN,1.2,'5 4')+
 tx(60,196,'−60 °C',{a:'start',s:9.5,c:MU})+tx(300,196,'+20 °C',{a:'end',s:9.5,c:MU})+
 tx(194,30,'Stratosphere',{a:'start',b:1,s:11.5})+tx(194,44,'isothermal −56.5 °C',{a:'start',s:10.5,c:MU})+tx(194,57,'up to about 20 km',{a:'start',s:10.5,c:MU})+
 tx(194,108,'Troposphere',{a:'start',b:1,s:12})+tx(194,122,'−6.5 °C / km',{a:'start',s:10.5,c:MU})+tx(194,135,'≈ −2 °C / 1000 ft',{a:'start',s:10.5,c:MU})+
 tx(58,70,'Tropopause',{a:'start',s:10.5,b:1})+tx(58,94,'11 km · 36 090 ft',{a:'start',s:9.5,c:MU})+
 tx(84,160,'MSL +15 °C',{a:'end',s:10,c:INK,b:1})+tx(84,172,'1013.25 hPa',{a:'end',s:9.5,c:MU}));

D.qnh=()=>svg(320,210,
 pa('M0 188H320',0,MU,1.5)+tx(310,203,'mean sea level',{a:'end',s:9.5,c:MU})+
 pa('M0 188V150Q60 148 100 128Q130 112 160 112H236Q270 112 300 150L320 188Z',soft(MU,25),MU,2)+
 rc(150,108,86,5,INK,0,2)+tx(193,100,'aerodrome',{s:10,c:INK,b:1})+
 plane(280,44,.8,90,AC)+ar(280,58,280,106,OK,2)+ar(280,106,280,58,OK,2)+
 tx(20,24,'1013.25 → pressure altitude',{a:'start',c:WN,b:1,s:10.5})+tx(20,37,'flight levels',{a:'start',c:MU,s:10})+
 tx(20,62,'QNH → field elevation',{a:'start',c:AC,b:1,s:10.5})+tx(20,75,'altitude above sea level',{a:'start',c:MU,s:10})+
 tx(20,100,'QFE → 0 on the runway',{a:'start',c:OK,b:1,s:10.5})+tx(20,113,'height above aerodrome',{a:'start',c:MU,s:10}));

D.lapse=()=>svg(320,210,
 ln(40,184,300,184,MU,1.5)+ln(40,184,40,18,MU,1.5)+
 pa('M230 184L120 30',0,BD,3)+pa('M230 184L190 30',0,OK,3)+
 pa('M230 184L120 30L40 30L40 184Z',soft(BD,10))+pa('M230 184L190 30L300 30L300 184Z',soft(OK,10))+pa('M230 184L190 30L120 30Z',soft(WN,14))+
 tx(104,150,'ELR steeper',{s:10.5,c:BD,b:1})+tx(104,163,'than 3 °C: unstable',{s:10,c:MU})+
 tx(262,150,'ELR below SALR',{s:10.5,c:OK,b:1})+tx(262,163,'stable',{s:10,c:MU})+
 tx(168,104,'conditionally',{s:10,c:WN,b:1})+tx(168,116,'unstable',{s:10,c:WN,b:1})+
 tx(118,22,'DALR 3 °C/1000 ft',{c:BD,s:10,a:'end'})+tx(196,22,'SALR ~1.5 °C/1000 ft',{c:OK,s:10,a:'start'})+
 tx(170,200,'temperature →  (colder to the left)',{s:10,c:MU})+tx(34,100,'height',{s:10,c:MU,a:'end'}));

D.cbase=()=>svg(320,200,
 ln(40,170,296,170,MU,1.5)+ln(40,170,40,30,MU,1.5)+ln(40,60,296,60,LN,1.3,'5 4')+
 pa('M210 170L150 60',0,BD,3.5)+pa('M160 170L150 60',0,AC,3.5)+
 ci(210,170,4,INK)+ci(160,170,4,INK)+ci(150,60,5,WN,INK,1.5)+
 tx(214,186,'T 24 °C',{a:'start',s:10,c:BD,b:1})+tx(156,186,'Td 14 °C',{a:'end',s:10,c:AC,b:1})+
 tx(206,114,'T −3 °C / 1000 ft',{a:'start',s:10.5,c:BD})+tx(142,138,'Td −0.5 °C',{a:'end',s:10.5,c:AC})+tx(142,150,'/ 1000 ft',{a:'end',s:10.5,c:AC})+
 cloud(150,42,.4,soft(MU,25))+tx(180,56,'cloud base',{a:'start',s:10.5,b:1})+
 tx(40,24,'Base (ft) ≈ 400 × (T − Td)',{a:'start',b:1,s:12})+tx(40,100,'4000 ft',{a:'end',s:9.5,c:MU}));

D.clouds=()=>svg(320,210,
 rc(24,14,272,56,soft(AC,10),0,10)+rc(24,76,272,56,soft(OK,10),0,10)+rc(24,138,272,56,soft(WN,12),0,10)+
 tx(36,32,'HIGH  16 500 – 45 000 ft',{a:'start',b:1,s:11.5,c:AC})+tx(36,50,'Cirrus Ci · Cirrocumulus Cc · Cirrostratus Cs',{a:'start',s:10.5,c:MU})+
 tx(36,94,'MEDIUM  6 500 – 23 000 ft',{a:'start',b:1,s:11.5,c:OK})+tx(36,112,'Altocumulus Ac · Altostratus As · (Nimbostratus Ns)',{a:'start',s:10.5,c:MU})+
 tx(36,156,'LOW  surface – 6 500 ft',{a:'start',b:1,s:11.5,c:WN})+tx(36,174,'Stratus St · Stratocumulus Sc · (Cu, Cb bases)',{a:'start',s:10.5,c:MU})+
 tx(160,204,'temperate latitudes, approximate',{s:9.5,c:MU}));

D.geo=()=>svg(320,210,
 [28,52,78].map(r=>ci(150,105,r,0,LN,1.8)).join('')+ci(150,105,6,AC)+tx(150,109,'L',{c:'#fff',b:1,s:9})+
 ar(228,105,228,52,INK,3.5)+ar(228,105,196,105,OK,3)+ar(228,105,262,105,AC,3)+
 tx(228,44,'Wind',{b:1})+tx(192,96,'PGF',{c:OK,b:1,s:10.5,a:'end'})+tx(266,122,'Coriolis',{c:AC,b:1,s:10.5,a:'start'})+
 pa('M150 56A49 49 0 0 0 101 105',0,MU,1.5,' stroke-dasharray="3 3"')+
 tx(160,200,'Northern hemisphere: wind blows anticlockwise round a low',{s:10.5,c:MU})+
 tx(24,26,'Buys Ballot: back to the wind,',{a:'start',s:10.5,b:1})+tx(24,40,'low pressure is on your left',{a:'start',s:10.5,b:1}));

D.coldfront=()=>svg(320,200,
 pa('M20 166H300',0,MU,2)+pa('M20 166H210L120 70H20Z',soft(AC,22),AC,2.5)+
 tx(60,150,'cold air',{c:AC,b:1})+tx(256,150,'warm air',{c:BD,b:1})+
 ar(232,150,244,102,BD,2.5)+ar(268,142,278,94,BD,2.2)+
 cloud(200,56,.55,soft(MU,28))+cloud(240,40,.5,soft(MU,28))+
 ar(40,40,92,40,INK,2.5)+tx(40,28,'front moves →',{a:'start',s:10.5})+
 tx(150,184,'steep slope ≈ 1 : 50 · Cb, heavy showers, squalls',{s:10.5,c:MU})+tx(224,162,'front',{s:9.5,b:1}));

D.warmfront=()=>svg(320,200,
 pa('M20 166H300',0,MU,2)+pa('M150 166H300V64Z',soft(AC,22),AC,2.5)+
 tx(250,150,'cold air',{c:AC,b:1})+tx(70,130,'warm air',{c:BD,b:1})+
 ar(86,148,196,100,BD,2.5)+ar(60,112,170,56,BD,2.2)+
 pa('M170 60Q220 36 290 54',soft(MU,40),MU,2.5)+tx(210,40,'Cs',{s:10,c:MU,b:1})+tx(248,70,'As',{s:10,c:MU,b:1})+tx(230,92,'Ns · rain',{s:10,c:MU,b:1})+
 ar(40,30,92,30,INK,2.5)+tx(40,20,'front moves →',{a:'start',s:10.5})+
 tx(160,186,'gentle slope ≈ 1 : 150 · layered cloud, steady rain, lowering base',{s:10.5,c:MU}));

D.jet=()=>svg(320,210,
 ln(30,184,300,184,MU,1.5)+pa('M30 96Q100 90 150 100',0,AC,3)+pa('M170 54Q230 46 300 50',0,AC,3)+pa('M150 100Q160 78 170 54',0,AC,3,' stroke-dasharray="5 4"')+
 `<ellipse cx="160" cy="84" rx="40" ry="14" fill="${soft(WN,35)}" stroke="${WN}" stroke-width="2"/>`+
 `<ellipse cx="160" cy="84" rx="20" ry="7" fill="${soft(BD,40)}"/>`+
 tx(160,88,'JET',{b:1,s:10})+tx(70,86,'Polar tropopause',{s:10.5,c:AC,b:1})+tx(70,114,'~ 9 km  (30 000 ft)',{s:10,c:MU})+
 tx(250,40,'Tropical tropopause',{s:10.5,c:AC,b:1})+tx(250,72,'~ 16 km  (53 000 ft)',{s:10,c:MU})+
 tx(70,176,'polar air (cold)',{s:10,c:MU})+tx(250,176,'tropical air (warm)',{s:10,c:MU})+
 tx(160,16,'Jet core: wind ≥ 60 kt, at the tropopause break',{b:1,s:10.5}));

D.tstorm=()=>{const panel=(x,t,body)=>`<g transform="translate(${x} 0)">${rc(2,8,100,150,soft(MU,6),LN,14)}${body}${tx(52,176,t,{b:1,s:10.5})}</g>`;
 return svg(320,196,
 panel(4,'1 Cumulus',ar(52,150,52,100,OK,2.5)+ar(34,150,34,110,OK,2)+ar(70,150,70,110,OK,2)+cloud(52,80,.55,soft(MU,28))+tx(52,26,'updraft only',{s:10,c:MU}))+
 panel(110,'2 Mature',ar(36,150,36,86,OK,2.5)+ar(76,56,76,140,BD,2.5)+cloud(56,50,.75,soft(MU,34))+pa('M24 38H92',0,MU,3)+[60,70,80].map(x=>ln(x,92,x-3,128,AC,1.5,'3 3')).join('')+tx(52,26,'up + down + rain',{s:10,c:MU}))+
 panel(216,'3 Dissipating',ar(52,60,52,138,BD,2.5)+ar(34,60,34,128,BD,2)+cloud(52,52,.55,soft(MU,18))+tx(52,26,'downdraft only',{s:10,c:MU})))};

D.micro=()=>svg(320,210,
 ln(20,176,300,176,MU,2)+cloud(160,28,.9,soft(MU,28))+ar(160,52,160,150,BD,4,12)+
 ar(150,172,56,172,BD,2.5)+ar(170,172,264,172,BD,2.5)+
 pa('M40 112Q100 112 150 128T270 150',0,AC,2.5,' stroke-dasharray="6 5"')+plane(60,108,.7,100,INK)+
 tx(54,96,'1 headwind',{c:OK,b:1,s:10.5})+tx(162,120,'2 downdraft',{c:BD,b:1,s:10.5,a:'start'})+tx(268,134,'3 tailwind',{c:BD,b:1,s:10.5})+
 tx(160,200,'headwind, downdraft, tailwind: the aircraft sinks',{s:10.5,c:MU}));

D.tropcy=()=>{let b='',i;for(i=0;i<3;i++){const a0=i*120;b+=pa(`M160 100 `+Array.from({length:30},(_,k)=>{const t=k/29,r=26+t*80,a=rad(a0+t*210);return `L${(160+r*Math.cos(a)).toFixed(1)} ${(100+r*Math.sin(a)).toFixed(1)}`}).join(' '),0,MU,5,` opacity=".55"`)}
 return svg(320,210,b+ci(160,100,24,soft(AC,10),AC,2)+tx(160,104,'EYE',{b:1,s:10,c:AC})+ci(160,100,38,0,BD,2.5)+
 tx(24,26,'Eyewall: strongest wind, heavy rain',{a:'start',s:10.5,c:BD,b:1})+tx(24,40,'Eye: light wind, clear, lowest pressure',{a:'start',s:10.5,c:AC,b:1})+
 tx(160,192,'needs sea surface ≥ ~26.5 °C and latitude > ~5°',{s:10,c:MU})+tx(160,205,'anticlockwise in the N hemisphere',{s:10,c:MU}))};

D.psrssr=()=>svg(320,200,
 rc(26,140,38,28,soft(MU,30),MU,6)+ln(45,140,45,118,INK,3)+pa('M30 112Q45 98 60 112',0,INK,2.5)+
 plane(250,48,.9,90,INK)+plane(250,142,.9,90,INK)+
 ar(66,112,214,60,AC,2,8)+ar(214,66,70,116,AC,2,8)+tx(138,74,'PSR: echo',{c:AC,b:1,s:10.5,a:'end'})+tx(150,100,'reflected pulse only',{c:MU,s:9.5,a:'end'})+
 ar(68,152,214,146,OK,2,8)+ar(214,156,72,162,WN,2,8)+
 tx(140,138,'SSR interrogation 1030 MHz',{c:OK,b:1,s:10})+tx(140,181,'reply 1090 MHz: code + altitude',{c:WN,b:1,s:10})+
 tx(250,28,'no cooperation needed',{s:9.5,c:MU})+tx(250,126,'transponder needed',{s:9.5,c:MU}));

window.__FIGA={svg,ar,tx,ln,ci,rc,pa,plane,cloud,soft,rad,INK,MU,AC,OK,BD,WN,LN,PN,BG,D,FG};
})();

(function(){
const {svg,ar,tx,ln,ci,rc,pa,plane,cloud,soft,rad,INK,MU,AC,OK,BD,WN,LN,PN,BG,D,FG}=window.__FIGA;

/* REGULATIONS */
D.rwymark=()=>svg(320,210,
 rc(120,10,80,190,soft(MU,45),MU,2)+ln(160,20,160,140,INK,2.5,'12 9')+
 [0,1,2,3,4,5].map(i=>rc(126+i*12,164,7,28,INK)).join('')+
 rc(131,106,12,34,INK)+rc(177,106,12,34,INK)+rc(134,60,12,26,INK)+rc(174,60,12,26,INK)+rc(138,30,8,18,INK)+rc(174,30,8,18,INK)+
 tx(160,156,'09',{b:1,s:15})+
 ar(240,178,206,178,MU,1.5,6)+tx(244,182,'threshold',{a:'start',s:10.5,c:MU})+
 ar(240,124,206,124,MU,1.5,6)+tx(244,128,'aiming point',{a:'start',s:10.5,c:MU})+
 ar(240,72,206,72,MU,1.5,6)+tx(244,70,'touchdown',{a:'start',s:10.5,c:MU})+tx(244,82,'zone bars',{a:'start',s:10.5,c:MU})+
 ar(76,100,116,100,MU,1.5,6)+tx(72,104,'edge line',{a:'end',s:10.5,c:MU})+
 ar(76,40,154,40,MU,1.5,6)+tx(72,44,'centre line',{a:'end',s:10.5,c:MU}));

D.giveway=()=>{const p=(x,t,body)=>`<g transform="translate(${x} 0)">${rc(2,8,102,160,soft(MU,6),LN,14)}${body}${tx(53,184,t,{b:1,s:10.5})}</g>`;
 return svg(320,196,
 p(4,'Head-on',plane(34,120,.9,0,INK)+plane(72,50,.9,180,AC)+ar(34,98,60,80,OK,2)+ar(72,72,48,90,OK,2)+tx(53,32,'both turn right',{s:10,c:OK,b:1}))+
 p(110,'Converging',plane(30,110,.9,0,INK)+plane(80,110,.9,-70,AC)+tx(53,32,'the aircraft with',{s:10,c:MU})+tx(53,45,'the other on its',{s:10,c:MU})+tx(53,58,'right gives way',{s:10,c:BD,b:1})+tx(20,150,'gives',{s:9.5,c:BD,b:1,a:'start'})+tx(80,150,'has way',{s:9.5,c:OK,b:1,a:'start'}))+
 p(216,'Overtaking',plane(40,110,.9,0,AC)+plane(40,60,.9,0,INK)+ar(58,44,86,44,OK,2)+tx(53,28,'overtaker alters',{s:10,c:OK,b:1})+tx(53,142,'to the right',{s:10,c:OK,b:1})+tx(53,155,'(stay clear)',{s:9.5,c:MU})))};

D.levels=()=>svg(320,210,
 ci(160,100,70,0,MU,2)+ln(160,30,160,170,MU,1.5,'5 4')+
 pa('M160 30A70 70 0 0 1 160 170Z',soft(AC,18))+pa('M160 30A70 70 0 0 0 160 170Z',soft(OK,18))+
 tx(160,22,'N 000°',{s:10.5,c:MU})+tx(160,186,'S 180°',{s:10.5,c:MU})+
 tx(196,92,'000°–179°',{b:1,s:12,c:AC})+tx(196,108,'ODD levels',{s:11.5,c:AC})+tx(124,92,'180°–359°',{b:1,s:12,c:OK})+tx(124,108,'EVEN levels',{s:11.5,c:OK})+
 tx(196,124,'FL 290, 310…',{s:10,c:AC})+tx(124,124,'FL 300, 320…',{s:10,c:OK})+
 tx(160,204,'ICAO semicircular rule (RVSM). Magnetic track decides the level.',{s:10,c:MU}));

D.circuit=()=>svg(320,210,
 rc(50,150,220,10,soft(MU,45),MU,3)+tx(160,174,'runway',{s:10.5,c:MU})+
 pa('M230 150H282V46H66V150H110',0,AC,3)+ar(230,150,250,150,AC,3)+ar(282,100,282,84,AC,3)+ar(200,46,160,46,AC,3)+ar(66,100,66,118,AC,3)+ar(86,150,108,150,AC,3)+
 plane(286,150,.0,0,INK)+
 tx(168,70,'DOWNWIND',{b:1,s:10.5,c:INK})+tx(300,104,'CROSSWIND',{s:10,a:'end',c:INK,b:1})+tx(42,96,'BASE',{s:10,b:1,c:INK,a:'end'})+tx(86,138,'FINAL',{s:10,b:1,c:INK,a:'start'})+tx(230,138,'UPWIND / take-off',{s:10,b:1,c:INK,a:'end'})+
 tx(160,20,'Left-hand circuit: all turns are to the left',{s:11,c:MU}));

D.papi=()=>{const rowv=(y,w,t,c)=>[0,1,2,3].map(i=>ci(60+i*36,y,11,i<w?'#ffffff':'#e11d48',INK,1.5)).join('')+tx(224,y+4,t,{a:'start',s:10.5,b:1,c:c||INK});
 return svg(320,200,rowv(22,4,'too high',WN)+rowv(58,3,'slightly high')+rowv(94,2,'ON SLOPE (3°)',OK)+rowv(130,1,'slightly low')+rowv(166,0,'too low',BD)+tx(160,196,'white = above the slope, red = below. 2 white + 2 red is on slope.',{s:10,c:MU}))};

/* TECHNICAL GENERAL */
D.forces=()=>svg(320,200,
 plane(160,100,2.3,90,INK)+ar(160,86,160,22,OK,3.5)+ar(160,114,160,178,BD,3.5)+ar(212,100,286,100,AC,3.5)+ar(108,100,34,100,WN,3.5)+
 tx(176,30,'Lift',{a:'start',b:1,c:OK})+tx(176,174,'Weight',{a:'start',b:1,c:BD})+tx(286,88,'Thrust',{a:'end',b:1,c:AC})+tx(34,88,'Drag',{a:'start',b:1,c:WN})+
 tx(160,196,'steady level flight: Lift = Weight, Thrust = Drag',{s:10.5,c:MU}));

D.dragcurve=()=>{const X=v=>40+(v-.2)/.8*250,Y=y=>172-y*128,par=v=>v*v,ind=v=>.0625/(v*v),tot=v=>par(v)+ind(v),pts=f=>Array.from({length:50},(_,k)=>{const v=.25+k/49*.75;return `${k?'L':'M'}${X(v).toFixed(1)} ${Y(f(v)).toFixed(1)}`}).join('');
 return svg(320,210,ln(40,172,300,172,MU,1.5)+ln(40,172,40,16,MU,1.5)+
 pa(pts(par),0,AC,2.5)+pa(pts(ind),0,OK,2.5)+pa(pts(tot),0,INK,3.5)+
 ln(X(.5),172,X(.5),Y(tot(.5)),MU,1.5,'4 4')+ci(X(.5),Y(tot(.5)),5,WN,INK,1.5)+tx(X(.5),188,'VMD',{b:1,s:11})+
 tx(66,50,'induced',{c:OK,b:1,s:10.5,a:'start'})+tx(278,64,'parasite',{c:AC,b:1,s:10.5,a:'end'})+tx(X(.5)+10,Y(tot(.5))-8,'total',{a:'start',b:1,s:10.5})+
 tx(300,186,'airspeed →',{a:'end',s:10,c:MU})+tx(36,24,'drag',{a:'end',s:10,c:MU})+tx(160,206,'at VMD induced drag = parasite drag',{s:10,c:MU}))};

D.clalpha=()=>svg(320,200,
 ln(40,176,300,176,MU,1.5)+ln(40,176,40,18,MU,1.5)+
 pa('M60 160L196 56Q218 40 232 56Q250 74 268 120',0,AC,3.5)+
 ci(214,46,5,BD)+ln(214,46,214,176,BD,1.5,'4 4')+tx(214,192,'critical angle ≈ 15–16°',{s:10.5,c:BD,b:1})+
 tx(66,138,'CL rises with α',{a:'start',s:10.5,c:AC,b:1})+tx(300,150,'flow separates',{a:'end',s:10,c:MU})+
 tx(298,166,'angle of attack →',{a:'end',s:9.5,c:MU})+tx(36,24,'CL',{a:'end',b:1,s:11})+
 tx(296,24,'stalls at the critical AoA, any speed',{a:'end',s:10,c:MU}));

D.pitotstatic=()=>svg(320,210,
 pa('M14 40H76',0,INK,5)+pa('M76 40H110',0,AC,3)+tx(14,30,'pitot',{a:'start',s:10,b:1})+
 pa('M30 170H200',0,OK,3)+rc(24,166,12,8,INK)+tx(30,190,'static port',{a:'start',s:10,b:1})+
 [[110,'ASI'],[190,'ALT'],[270,'VSI']].map(([x,n])=>ci(x,98,29,PN,INK,2.5)+tx(x,102,n,{b:1,s:12})).join('')+
 pa('M110 40V69',0,AC,3)+pa('M110 40H76',0,AC,3)+
 pa('M110 170V127M190 170V127M270 170V127',0,OK,3)+pa('M200 170H270',0,OK,3)+pa('M110 170H200',0,OK,3)+
 tx(160,22,'pitot (total) pressure',{c:AC,b:1,s:10.5})+tx(250,186,'static pressure',{c:OK,b:1,s:10.5})+
 tx(110,140,'both',{s:9,c:MU})+tx(190,140,'static',{s:9,c:MU})+tx(270,140,'static',{s:9,c:MU})+
 tx(160,206,'ASI = pitot − static · altimeter and VSI use static only',{s:10,c:MU}));

D.gyro=()=>svg(320,210,
 `<ellipse cx="160" cy="110" rx="26" ry="62" fill="${soft(AC,22)}" stroke="${AC}" stroke-width="3"/>`+ln(160,26,160,194,INK,2.5)+
 pa('M128 78Q116 108 128 138',0,AC,2.5)+ar(128,134,130,139,AC,2,8)+tx(104,112,'spin',{a:'end',s:10.5,c:AC,b:1})+
 ar(160,60,160,24,BD,3.5)+tx(172,32,'applied force F',{a:'start',s:10.5,c:BD,b:1})+
 ar(160,110,244,128,OK,3.5)+tx(250,134,'precession',{a:'start',s:10.5,c:OK,b:1})+
 tx(160,204,'rigid in space · precesses 90° on in the direction of spin',{s:10.5,c:MU}));

D.turnslip=()=>{const p=(x,t,bx,sub,col)=>`<g transform="translate(${x} 0)">${pa('M10 70Q55 92 100 70',0,MU,2)+pa('M10 70Q55 108 100 70',0,MU,2)+ci(bx,84,9,col,INK,1.5)+ln(55,60,55,100,MU,1,'3 3')+ar(34,40,76,46,INK,2)+tx(55,128,t,{b:1,s:11,c:col})+tx(55,142,sub,{s:9.5,c:MU})}</g>`;
 return svg(320,170,p(2,'Balanced',55,'ball centred',OK)+p(108,'Slip',80,'ball to inside',WN)+p(214,'Skid',30,'ball to outside',BD)+tx(160,164,'right turn shown: slip = too much bank for the rate, skid = too little',{s:10,c:MU}))};

D.machcone=()=>{const cx=270;let c='';[40,80,120,160].forEach(d=>{c+=ci(cx-d,100,d/2,0,soft(MU,70),1.5)});
 return svg(320,210,c+ln(cx,100,cx-147,15,AC,2.5)+ln(cx,100,cx-147,185,AC,2.5)+plane(cx-2,100,1.1,-90,INK)+
 pa('M210 100A60 60 0 0 1 218 70',0,INK,1.8)+tx(198,92,'μ',{b:1,s:13,a:'end'})+
 tx(24,20,'Mach cone: sin μ = 1 / M',{a:'start',b:1,s:11.5,c:AC})+tx(160,200,'above Mach 1 the pressure waves pile up into a shock wave',{s:10,c:MU}))};

D.speeds=()=>{const bx=(x,t,s)=>rc(x,70,62,50,soft(AC,12),AC,12)+tx(x+31,92,t,{b:1,s:15})+tx(x+31,108,s,{s:9.5,c:MU});
 return svg(320,190,bx(10,'IAS','indicated')+bx(86,'CAS','calibrated')+bx(162,'EAS','equivalent')+bx(238,'TAS','true')+
 [72,148,224].map(x=>ar(x,95,x+10,95,MU,2,6)).join('')+
 tx(79,52,'instrument',{s:9.5,c:WN})+tx(79,63,'+ position error',{s:9.5,c:WN})+tx(155,52,'compressi-',{s:9.5,c:BD})+tx(155,63,'bility',{s:9.5,c:BD})+tx(231,52,'density',{s:9.5,c:OK})+tx(231,63,'(alt, temp)',{s:9.5,c:OK})+
 tx(160,24,'IAS → CAS → EAS → TAS',{b:1,s:13})+tx(160,150,'TAS ≈ CAS + 2 % per 1000 ft (rule of thumb)',{s:10.5,c:MU})+tx(160,168,'in ISA at sea level all four are equal at low speed',{s:10,c:MU}));};

D.asi=()=>{const X=v=>30+(v-40)*1.75,bar=(y,a,b,c,t)=>rc(X(a),y,X(b)-X(a),18,soft(c,40),c,5,2)+tx(X(a),y+32,t[0],{s:10,b:1,a:'middle'})+tx(X(b),y+32,t[1],{s:10,b:1});
 return svg(320,190,bar(22,45,100,'var(--ink)',['VSO','VFE'])+bar(76,55,130,OK,['VS1','VNO'])+bar(130,130,160,WN,['VNO','VNE'])+ln(X(160),120,X(160),152,BD,4)+
 tx(X(100)+8,36,'white arc: flap range',{a:'start',s:10,c:MU})+tx(X(130)+8,90,'green arc: normal operating',{a:'start',s:10,c:MU})+tx(X(130)-6,144,'yellow: caution, smooth air only',{a:'end',s:10,c:MU})+tx(160,184,'red line: never exceed',{s:10,c:BD,b:1}))};

D.otto=()=>{const p=(x,t,up,vin,vex,sp)=>`<g transform="translate(${x} 0)">${rc(18,30,42,86,PN,INK,4,2)}${rc(20,up?58:82,38,16,soft(AC,30),AC,3,2)}${ln(39,up?58:82,39,128,MU,2)}${vin?ln(24,24,36,30,OK,3):ln(24,26,36,30,MU,3)}${vex?ln(44,30,56,24,BD,3):ln(44,30,56,26,MU,3)}${sp?pa('M39 34l-4 8 7 -3 -4 8',0,WN,2):''}${ar(39,up?140:150,39,up?126:162,up?OK:BD,2,7)}${tx(39,172,t,{b:1,s:10})}</g>`;
 return svg(320,190,p(2,'1 Intake',0,1,0,0)+p(82,'2 Compression',1,0,0,0)+p(162,'3 Power',0,0,0,1)+p(242,'4 Exhaust',1,0,1,0)+tx(160,16,'four-stroke: suck, squeeze, bang, blow',{s:11,b:1}))};

D.tcas=()=>{const s=(x,t,sub,shape)=>`<g transform="translate(${x} 0)">${shape}${tx(0,64,t,{b:1,s:10.5})}${tx(0,78,sub,{s:9.5,c:MU})}</g>`;
 return svg(320,150,
 s(40,'Other','traffic',pa('M0 -18L12 0L0 18L-12 0Z',0,INK,2.5)+tx(0,32,'+08',{s:9.5})).replace('translate(40 0)','translate(40 44)')+
 s(120,'Proximate','< 6 NM, ±1200 ft',pa('M0 -18L12 0L0 18L-12 0Z',INK,INK,2)+tx(0,32,'+08',{s:9.5})).replace('translate(120 0)','translate(120 44)')+
 s(200,'TA','traffic advisory',ci(0,0,15,WN,INK,1.5)+tx(0,32,'-05↓',{s:9.5})).replace('translate(200 0)','translate(200 44)')+
 s(280,'RA','resolution adv.',rc(-14,-14,28,28,BD,INK,2,1.5)+tx(0,32,'+02↑',{s:9.5})).replace('translate(280 0)','translate(280 44)')+
 tx(160,18,'TCAS display symbols (relative altitude in hundreds of feet)',{s:10.5,c:MU}))};

D.radalt=()=>svg(320,200,
 plane(160,40,1.2,90,INK)+pa('M0 176Q60 164 120 170Q180 180 240 166T320 172V200H0Z',soft(MU,30),MU,2)+
 ar(150,60,134,164,AC,2.2)+ar(142,166,158,66,OK,2.2,8)+
 tx(120,100,'transmit',{a:'end',c:AC,b:1,s:10.5})+tx(176,110,'reflected',{a:'start',c:OK,b:1,s:10.5})+
 tx(310,64,'h = c × Δt ÷ 2',{a:'end',b:1,s:12})+tx(310,80,'4.2–4.4 GHz FMCW',{a:'end',s:10.5,c:MU})+tx(310,95,'height above ground',{a:'end',s:10.5,c:MU})+
 tx(160,194,'accurate up to ~2500 ft AGL, used for autoland / GPWS',{s:10,c:MU}));

D.ai=()=>svg(320,200,
 `<clipPath id="aiC"><circle cx="160" cy="104" r="80"/></clipPath><g clip-path="url(#aiC)">${rc(60,24,200,80,soft(AC,45))}${rc(60,104,200,80,soft(WN,55))}${ln(60,104,260,104,INK,2.5)}${[30,60].map(d=>ln(138,104-d*.9,182,104-d*.9,INK,1.5)).join('')}${[30,60].map(d=>ln(146,104+d*.9,174,104+d*.9,INK,1.5)).join('')}</g>`+
 ci(160,104,80,0,INK,3)+pa('M120 106H148M172 106H200',0,WN,5)+ci(160,106,4,WN)+pa('M160 24l-6 -10h12z',INK)+
 tx(160,10,'bank pointer',{s:9.5,c:MU})+
 tx(262,60,'sky',{a:'start',b:1,c:AC})+tx(262,150,'ground',{a:'start',b:1,c:WN})+
 tx(160,196,'shows aircraft attitude relative to the horizon (gyro, erects to gravity)',{s:10,c:MU}));

window.FIG={
 q:function(f){try{return FG[f.k](f)}catch(e){return ''}},
 d:function(k,p){try{var g=D[k];return g?g(p||{}):''}catch(e){return ''}},
 keys:function(){return Object.keys(D)},
 raw:{holdentry:"<svg viewBox=\"0 0 420 300\" role=\"img\" aria-label=\"Holding pattern entry sectors\"><clipPath id=\"hc\"><rect width=\"420\" height=\"300\"/></clipPath><g clip-path=\"url(#hc)\"><polygon points=\"210,110 389,175 420,300 0,300 31,45\" fill=\"#2563eb\" opacity=\".18\"/><polygon points=\"210,110 0,34 0,0 210,0\" fill=\"#f59e0b\" opacity=\".28\"/><polygon points=\"210,110 210,0 420,0 420,186\" fill=\"#16a34a\" opacity=\".22\"/><path d=\"M-50 45L470 175\" stroke=\"var(--mute)\" stroke-dasharray=\"6 5\"/><path d=\"M210 0V300\" stroke=\"var(--mute)\" stroke-dasharray=\"2 5\"/></g>\n<path d=\"M210 250V110A30 30 0 0 1 270 110V250A30 30 0 0 1 210 250\" fill=\"none\" stroke=\"var(--acc)\" stroke-width=\"3\"/><path d=\"M210 190v-12l-5 8h10z\" fill=\"var(--acc)\"/><circle cx=\"210\" cy=\"110\" r=\"6\" fill=\"var(--ink)\"/>\n<text x=\"216\" y=\"104\" font-size=\"12\" fill=\"var(--ink)\">FIX</text><text x=\"100\" y=\"230\" text-anchor=\"middle\" font-size=\"14\" font-weight=\"700\" fill=\"var(--ink)\">DIRECT</text><text x=\"100\" y=\"248\" text-anchor=\"middle\" font-size=\"11\" fill=\"var(--mute)\">turn right onto the outbound leg</text>\n<text x=\"62\" y=\"30\" text-anchor=\"middle\" font-size=\"14\" font-weight=\"700\" fill=\"var(--ink)\">TEARDROP (70\u00b0)</text><text x=\"62\" y=\"46\" text-anchor=\"middle\" font-size=\"11\" fill=\"var(--mute)\">30\u00b0 off outbound, then turn right</text>\n<text x=\"330\" y=\"40\" text-anchor=\"middle\" font-size=\"14\" font-weight=\"700\" fill=\"var(--ink)\">PARALLEL (110\u00b0)</text><text x=\"330\" y=\"56\" text-anchor=\"middle\" font-size=\"11\" fill=\"var(--mute)\">outbound parallel, then turn left</text>\n<text x=\"210\" y=\"290\" text-anchor=\"middle\" font-size=\"11\" fill=\"var(--mute)\">Sectors show where you approach from. The dashed line is the 70\u00b0 line. For a left-hand pattern, mirror the diagram.</text></svg>"}
};
})();
