/* Isometric hero illustration. */
/* Isometric illustration: database, API, interface */
function cube(cx,cy,s,h,t,l,r){
  const W=s*.866,H=s*.5,p=a=>a.map(q=>q.join(",")).join(" ");
  return `<polygon points="${p([[cx-W,cy-h],[cx,cy+H-h],[cx,cy+H],[cx-W,cy]])}" fill="${l}"/>
  <polygon points="${p([[cx,cy+H-h],[cx+W,cy-h],[cx+W,cy],[cx,cy+H]])}" fill="${r}"/>
  <polygon points="${p([[cx,cy-H-h],[cx+W,cy-h],[cx,cy+H-h],[cx-W,cy-h]])}" fill="${t}"/>`;
}
const cream=["#F5F0E8","#DDD5C8","#B0A498"],amb=["#D08C4A","#C07B3A","#9A6230"],nav=["#5A6C94","#46577b","#2e3b58"];
$("iso").innerHTML=`<g stroke="#1C1813" stroke-width="2" stroke-linejoin="round">
 <ellipse cx="270" cy="470" rx="190" ry="44" fill="#2e3b58" stroke="none"/>
 <g class="f1">${cube(260,440,220,48,...cream)}<line x1="150" y1="436" x2="150" y2="404" stroke="#B0A498"/></g>
 <g class="f2">${cube(260,352,180,40,...amb)}</g>
 <g class="f3">${cube(260,274,140,32,...cream)}${cube(260,236,64,56,...nav)}
  <circle cx="260" cy="188" r="6" fill="#EBB97C"/></g>
</g>
<g fill="#F5F0E8" font-size="14" font-weight="500" font-family="Manrope,sans-serif">
 <text x="430" y="420">Database</text><text x="430" y="332">REST API</text><text x="430" y="254">Interface</text></g>
<g stroke="#EBB97C" stroke-width="1.5"><line x1="400" y1="416" x2="424" y2="416"/><line x1="400" y1="328" x2="424" y2="328"/><line x1="400" y1="250" x2="424" y2="250"/></g>`;

