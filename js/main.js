/* Shared helpers, menu, scroll effects. Loaded first. */
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

/* Menu */
const btn=$("menu-btn"),panel=$("panel");
function toggleMenu(o){btn.setAttribute("aria-expanded",o);panel.classList.toggle("open",o);panel.setAttribute("aria-hidden",!o);btn.setAttribute("aria-label",o?"Close menu":"Open menu");document.body.style.overflow=o?"hidden":""}
btn.addEventListener("click",()=>toggleMenu(btn.getAttribute("aria-expanded")!=="true"));
panel.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>toggleMenu(false)));
addEventListener("keydown",e=>{if(e.key==="Escape")toggleMenu(false)});

/* Reveal once */
const rio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");rio.unobserve(e.target)}}),{threshold:.12});
const watch=()=>document.querySelectorAll(".reveal:not(.in)").forEach(el=>rio.observe(el));watch();

/* Current section */
const links=[...document.querySelectorAll(".nav-links a")];
const sio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.setAttribute("aria-current",a.getAttribute("href")==="#"+e.target.id))}),{rootMargin:"-40% 0px -55% 0px"});
["projects","stack","about","contact"].forEach(id=>sio.observe($(id)));

/* Tagline word reveal */
const tl=$("tagline-text");
tl.innerHTML=tl.textContent.trim().split(/\s+/).map(w=>`<span class="w">${esc(w)}</span>`).join(" ");
const words=[...tl.querySelectorAll(".w")];
if(reduce)words.forEach(w=>w.classList.add("on"));
else{const wio=new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle("on",e.isIntersecting||e.boundingClientRect.top<0)),{rootMargin:"0px 0px -40% 0px"});words.forEach(w=>wio.observe(w))}

