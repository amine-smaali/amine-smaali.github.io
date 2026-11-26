/* Projects: reads data/projects.json (refreshed daily by a GitHub Action),
   and falls back to the live GitHub API if the file is missing or empty. */
const USER="amine-smaali",MAX=6,EXCLUDED=[USER+".github.io",USER];

function setStatus(s,t){$("dot").className="dot "+s;$("status-text").textContent=t}

function card(r,i){
  const desc=r.description||"No description provided.";
  return `<article class="card proj reveal"><div class="pn"><span class="title-1">${String(i+1).padStart(2,"0")}</span><span class="pill caption-3">${esc(r.language||"Code")}</span></div>
  <h3 class="heading-5" style="text-transform:capitalize">${esc(r.name.replace(/[-_]/g," "))}</h3><p class="body-6 mute">${esc(desc)}</p>
  <div class="proj-foot button-sm"><div class="links">${r.homepage?`<a href="${esc(r.homepage)}" target="_blank" rel="noopener">Live <i class="ph ph-arrow-up-right"></i></a>`:""}<a href="${esc(r.url)}" target="_blank" rel="noopener">View code <i class="ph ph-github-logo"></i></a></div>${r.stars>0?`<span class="caption-4 mute"><i class="ph ph-star"></i> ${r.stars}</span>`:""}</div></article>`;
}

const notice=(ic,t,m,retry)=>`<div class="card notice"><i class="ph ${ic} icon" style="font-size:32px;color:var(--amber-text)"></i><h3 class="title-2">${t}</h3><p class="body-6 mute">${m}</p>${retry?`<button class="btn btn-line sm button-sm" onclick="loadRepos()">Try again</button>`:""}</div>`;

async function fromFile(){
  const res=await fetch("data/projects.json",{cache:"no-cache"});
  if(!res.ok)throw new Error("no file");
  const data=await res.json();
  if(!Array.isArray(data.repos)||!data.repos.length)throw new Error("empty file");
  return data.repos;
}

async function fromApi(){
  const res=await fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=updated`);
  if(!res.ok)throw new Error("GitHub API "+res.status);
  return (await res.json()).filter(r=>!r.fork&&!EXCLUDED.includes(r.name)).slice(0,MAX)
    .map(r=>({name:r.name,description:r.description,language:r.language,stars:r.stargazers_count,homepage:r.homepage,url:r.html_url}));
}

async function loadRepos(){
  const grid=$("grid");setStatus("loading","Loading from GitHub");
  try{
    let repos;
    try{repos=await fromFile()}catch{repos=await fromApi()}
    if(!repos.length){grid.innerHTML=notice("ph-folder-open","No public repositories yet","Projects will appear here once a public repository is added on GitHub.");setStatus("error","No repositories found");return}
    grid.innerHTML=repos.map(card).join("");watch();setStatus("success",`${repos.length} repositories loaded`);
  }catch(e){console.error(e);grid.innerHTML=notice("ph-warning-circle","Repositories failed to load","GitHub did not respond. Check your connection and try again.",true);setStatus("error","Failed to load")}
}
loadRepos();
