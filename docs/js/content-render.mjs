export const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const e=escapeHtml;
export const number=n=>String(n).padStart(2,'0');
export function workRows(works,selected){
  return works.map(w=>`<button class="work-row${w.id===selected?' active':''}" data-work="${e(w.id)}" aria-pressed="${w.id===selected}"><span class="work-number">${number(w.index+1)}</span><span class="work-text"><span class="work-name">${e(w.title)}</span>${w.listKind?`<span class="work-kind">${e(w.listKind)}</span>`:''}${w.presentation?`<span class="work-kind">${e(w.presentation)}</span>`:''}</span><span class="row-arrow" aria-hidden="true">↗</span></button>`).join('');
}
export function pageControls(page,total){
  if(total<=1)return '';
  const pages=new Set([1,total,page-1,page,page+1].filter(n=>n>=1&&n<=total));
  let previous=0;
  const numbers=[...pages].sort((a,b)=>a-b).map(n=>{const gap=n-previous>1?'<span class="page-gap" aria-hidden="true">…</span>':'';previous=n;return `${gap}<button data-page="${n}" ${n===page?'aria-current="page"':''} aria-label="Page ${n}">${number(n)}</button>`;}).join('');
  return `<button data-page="${page-1}" ${page===1?'disabled':''} aria-label="Previous page">←</button>${numbers}<button data-page="${page+1}" ${page===total?'disabled':''} aria-label="Next page">→</button>`;
}
export function publicationRows(items){return items.map(p=>`<div class="paper-row"><span class="paper-year">${e(p.year)}</span><span>${e(p.title)}<small>${e([p.authors,p.venue].filter(Boolean).join(' · '))}</small></span></div>`).join('');}
export function awardRows(items){return items.map(a=>`<article class="award-entry"><span class="award-year mono">${e(a.year)}</span><div><h3>${e(a.title)}</h3><p class="award-detail mono">${e([a.distinction,a.detail].filter(Boolean).join(' · '))}</p></div></article>`).join('');}
export function presentationRows(items){
  const years=[...new Set(items.map(item=>item.year))].sort((a,b)=>b.localeCompare(a));
  return years.map(year=>`<div class="presentation-year"><h3>${e(year)}</h3><div>${items.filter(p=>p.year===year).map(p=>`<article class="presentation-entry"><div class="presentation-meta mono"><span>${e(p.type)}</span>${p.date?`<span>${e(p.date)}</span>`:''}</div><h4>${e(p.title)}</h4>${p.venue?`<p>${e(p.venue)}</p>`:''}</article>`).join('')}</div></div>`).join('');
}
export function biographyParagraphs(items){return items.map(text=>`<p>${e(text)}</p>`).join('');}
