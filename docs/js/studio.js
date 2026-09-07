import {workRows,pageControls,number} from './content-render.mjs';
const $=id=>document.getElementById(id);
const dialog=$('project-dialog');
const options=document.querySelector('.work-options');
const pagination=$('work-pagination');
let works=[],page=1,pageSize=4,selected=null,lastOpener=null,revision=0;
function setImage(img,path,alt){img.hidden=!path;if(path){img.src=path;img.alt=alt||'';}else{img.removeAttribute('src');img.alt='';}}
function updateViewer(){
 const w=works.find(w=>w.id===selected);
 $('open-work').hidden=!w;
 if(!w){$('frame-label').textContent='SELECTED WORK';$('frame-count').textContent='00 / 00';$('image-credit').textContent='';setImage($('work-image'),'','');$('work-placeholder').hidden=false;$('placeholder-kind').textContent='';$('placeholder-title').textContent='No works to display';return;}
 setImage($('work-image'),w.image,w.alt);
 $('work-placeholder').hidden=!!w.image;
 $('placeholder-title').textContent=w.title;$('placeholder-kind').textContent=w.test?'TEST ENTRY':w.listKind;
 $('frame-label').textContent='FIG. '+number(w.index+1)+' / '+w.title.toUpperCase();
 $('frame-count').textContent=number(w.index+1)+' / '+number(works.length);$('image-credit').textContent=w.credit;
}
function render(){
 const start=(page-1)*pageSize;
 options.innerHTML=works.length?workRows(works.slice(start,start+pageSize),selected):'<p class="empty-works">No works to display.</p>';
 pagination.innerHTML=pageControls(page,Math.ceil(works.length/pageSize));pagination.hidden=works.length<=pageSize;
 $('wander').disabled=works.length<2;
 updateViewer();
}
function rememberPage(){const url=new URL(location.href);if(page>1)url.searchParams.set('workPage',page);else url.searchParams.delete('workPage');history.replaceState(null,'',url);}
function selectWork(id,announce=true){
 const index=works.findIndex(w=>w.id===id);if(index<0)return;
 selected=id;page=Math.floor(index/pageSize)+1;render();rememberPage();
 if(announce)$('announcement').textContent=works[index].title+' selected. Page '+page+'.';
}
options.addEventListener('click',event=>{const row=event.target.closest('[data-work]');if(row){selectWork(row.dataset.work);options.querySelector(`[data-work="${row.dataset.work}"]`)?.focus();}});
 pagination.addEventListener('click',event=>{
 const button=event.target.closest('[data-page]');if(!button||button.disabled)return;
 const next=Number(button.dataset.page);if(next<1||next>Math.ceil(works.length/pageSize))return;
 page=next;selected=works[(page-1)*pageSize].id;render();rememberPage();
 pagination.querySelector('[aria-current="page"]')?.focus();$('announcement').textContent='Page '+page+' of '+Math.ceil(works.length/pageSize)+'.';
});
$('wander').addEventListener('click',()=>{const other=works.filter(w=>w.id!==selected);if(other.length)selectWork(other[Math.floor(Math.random()*other.length)].id);});
function resetFork(){$('fork-text').textContent='我心中想着我需要做出一个决定。';document.querySelectorAll('[data-direction]').forEach(b=>b.hidden=false);$('fork-reset').hidden=true;}
function openWork(){
 const w=works.find(w=>w.id===selected);if(!w)return;
 lastOpener=document.activeElement;$('dialog-label').textContent='WORK / '+number(w.index+1);$('dialog-kind').textContent=w.kind;$('dialog-title').textContent=w.title;
 setImage($('dialog-image'),w.image,w.alt);
 $('dialog-body').replaceChildren(...w.body.map(text=>{const p=document.createElement('p');p.textContent=text;return p;}));
 if(w.status){const p=document.createElement('p');p.className='project-status';p.textContent=w.status;$('dialog-body').append(p);}
 $('fork-experiment').hidden=!w.scriptExcerpt;resetFork();dialog.showModal();dialog.scrollTop=0;$('close-dialog').focus();
}
$('open-work').addEventListener('click',openWork);$('close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>lastOpener?.focus());
document.querySelectorAll('[data-direction]').forEach(button=>button.addEventListener('click',()=>{$('fork-text').textContent='在感知到了拉扯之后，我决定向前走。';document.querySelectorAll('[data-direction]').forEach(b=>b.hidden=true);$('fork-reset').hidden=false;$('fork-reset').focus();}));
$('fork-reset').addEventListener('click',()=>{resetFork();document.querySelector('[data-direction]').focus();});
$('year').textContent=new Date().getFullYear();
async function load(){
 try{
  const response=await fetch('/content/site.json',{cache:'no-store'});if(!response.ok)throw new Error('Could not load works');
  const data=await response.json();if(revision&&revision!==data.revision){location.reload();return;}
  if(revision)return;revision=data.revision;works=data.works.map((work,index)=>({...work,index}));pageSize=data.settings.pageSize;
  page=Math.min(Math.max(1,Number(new URL(location.href).searchParams.get('workPage'))||1),Math.max(1,Math.ceil(works.length/pageSize)));
  selected=works[(page-1)*pageSize]?.id||null;render();
 }catch(error){$('announcement').textContent='The work list could not be loaded. Please refresh.';}
}
await load();window.addEventListener('focus',load);document.addEventListener('visibilitychange',()=>{if(!document.hidden)load();});
