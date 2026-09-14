/* 原生 HTML / CSS / JS，hash 路由，CSS 幾何轉場，不需 View Transitions API。 */
(() => {
  'use strict';
  const data = window.PersonalityExplorerData;
  if (!data || data.personalities.length !== 16) return;
  const {personalities, groups, sources} = data;
  const byId = new Map(personalities.map(p => [p.id,p]));
  const groupById = new Map(groups.map(g => [g.id,g]));
  const landing = document.querySelector('#landing');
  const overview = document.querySelector('#overview');
  const detail = document.querySelector('#detail');
  const main = document.querySelector('main');
  const live = document.querySelector('#live-status');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const baseTitle = '16 型人格｜世界的真相與人性';
  let currentId = null;
  let desiredId = null;
  let busy = false;
  let overviewY = 0;
  let overviewFocus = null;
  let lastInput = null;
  const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const e = escapeHtml;
  const delay = ms => new Promise(resolve=>setTimeout(resolve,ms));
  const frames = () => new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const groupStyle = g => `--group:${g.color};--group-soft:${g.soft};--group-dark:${g.dark};--group-ink:${g.ink}`;

  // 每型使用不同組合的抽象線段、圓弧與幾何形，無官方角色素材。
  function symbol(p, cls='type-symbol') {
    const i = personalities.indexOf(p);
    const shapes = [
      '<path d="M12 47V13h34v34H12m12 0V25h34v34H24M12 13l12 12m22-12 12 12M46 47l12 12"/>',
      '<circle cx="27" cy="27" r="17"/><circle cx="43" cy="43" r="17"/><path d="m22 43 26-20M18 56h11m21-44v11"/>',
      '<path d="M12 56h46M18 56V37h12v19m5 0V25h12v31M13 25l18-13 24 3m-7-6 7 6-4 9"/>',
      '<path d="m13 21 17-9 15 9-15 9-17-9Zm15 28 16-9 15 9-15 9-16-9ZM13 21v19l14 8m18-27v12M30 30v9M44 58V49"/>',
      '<path d="M35 59V24m0 14C13 38 11 19 13 12c16 0 22 13 22 26Zm0 9c22 0 24-19 22-26-16 0-22 13-22 26Z"/>',
      '<path d="M35 57c-8-9-23-12-23-25a12 12 0 0 1 23-5 12 12 0 0 1 23 5c0 13-15 16-23 25Z"/><path d="M24 39c4 2 8 6 11 10"/>',
      '<path d="M13 55V33a22 22 0 0 1 44 0v22M24 55V33a11 11 0 0 1 22 0v22M35 14v12M13 55h11m22 0h11"/>',
      '<path d="M35 12v46M12 35h46M19 19l32 32M19 51l32-32"/><circle cx="35" cy="35" r="10"/>',
      '<rect x="13" y="13" width="44" height="44" rx="5"/><path d="M13 28h44M28 28v29M39 39h9m-9 10h9"/>',
      '<path d="m35 11 22 9v17c0 12-22 23-22 23S13 49 13 37V20l22-9Z"/><path d="m25 35 7 7 14-16"/>',
      '<path d="M13 57V13h44v44H13m14-44v44m15-44v44M13 28h44M13 43h44"/>',
      '<path d="M11 55c0-12 10-22 24-22s24 10 24 22M22 55V42m26 13V42"/><circle cx="35" cy="19" r="9"/><path d="M9 26h9m34 0h9"/>',
      '<path d="m13 47 21-35 23 35H13Zm12-1 10-16 11 16M13 57h44"/>',
      '<path d="M13 50c12-26 12 4 24-22s13 4 21-15M13 60c12-26 12 4 24-22s13 4 21-15"/>',
      '<path d="m12 23 23-12 23 12v25L35 60 12 48V23Zm0 0 23 12 23-12M35 35v25M24 29l22-12"/>',
      '<circle cx="35" cy="35" r="17"/><path d="M35 8v7m0 40v7M8 35h7m40 0h7M16 16l5 5m28 28 5 5M16 54l5-5m28-28 5-5"/>'
    ];
    return `<svg class="${cls}" viewBox="0 0 70 70" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${shapes[i]}</svg>`;
  }
  function card(p,i) {
    return `<button type="button" class="personality-card" data-type="${p.id}" id="card-${p.id}" aria-label="查看 ${p.code} ${p.nickname}，${groupById.get(p.group).short} ${p.groupZh}"><span class="card-top">${symbol(p)}<span class="card-number" aria-hidden="true">${String(i+1).padStart(2,'0')}</span></span><span class="personality-identity"><span class="type-code">${p.code}</span><span class="type-nickname">${p.nickname}</span></span><span class="card-tagline">${e(p.tagline)}</span><span class="card-arrow" aria-hidden="true">↗</span></button>`;
  }
  function renderOverview() {
    document.querySelector('#personality-groups').innerHTML = groups.map(g=>`<section class="group-section" style="${groupStyle(g)}" aria-labelledby="group-${g.id}"><div class="group-heading"><h3 id="group-${g.id}">${g.name}<span class="english" lang="en">${g.english}</span></h3><div class="group-meta"><span>${g.short}</span><b>${g.traits}</b></div><p>${g.description}</p></div><div class="cards-grid">${g.types.map(code=>{const p=byId.get(code.toLowerCase());return card(p,personalities.indexOf(p));}).join('')}</div></section>`).join('');
  }
  const list = rows => `<ul class="facts">${rows.map(([title,text])=>`<li><strong>${e(title)}</strong><p>${e(text)}</p></li>`).join('')}</ul>`;
  function section(id,num,title,body,classes='') {
    return `<section class="info-card ${classes}" id="section-${id}" aria-labelledby="heading-${id}"><span class="section-kicker" aria-hidden="true">${num} / EXPLORE</span><h2 id="heading-${id}">${title}</h2>${body}</section>`;
  }
  function note() {
    return '<aside class="reading-note" aria-label="人格測驗的使用提醒"><strong>四個字母，裝不下完整的你。</strong><p>人格測驗提供的是自我探索的角度，不是對一個人的完整定義。相同人格代號的人，仍可能因家庭、文化、經驗、年齡與情境而非常不同。</p><p>本網站不是心理診斷工具，也不應用來判定誰比較聰明、適合什麼科系、適合哪種工作，或誰和誰一定合得來。</p></aside>';
  }
  function related(p) {
    const distance = q => [...p.code].filter((c,i)=>c!==q.code[i]).length;
    const candidates = [...personalities.filter(q=>distance(q)===1),...personalities.filter(q=>distance(q)===4),...personalities.filter(q=>distance(q)===3).slice(0,1)];
    return candidates.map(q=>`<button type="button" data-type="${q.id}" class="related-card" style="${groupStyle(groupById.get(q.group))}" aria-label="查看 ${q.code} ${q.nickname}，差 ${distance(q)} 個字母"><strong>${q.code} <span>${q.nickname}</span></strong><small>差 ${distance(q)} 個字母 · ${groupById.get(q.group).short}</small></button>`).join('');
  }
  function renderDetail(p) {
    const g = groupById.get(p.group);
    detail.setAttribute('style',groupStyle(g));
    detail.innerHTML = `<div class="detail-toolbar"><button type="button" class="text-btn" data-home>← 返回 16 型人格</button><div class="switcher"><label for="type-switch">切換人格</label><select id="type-switch" aria-label="切換至其他人格">${groups.map(g=>`<optgroup label="${g.short}｜${g.name}">${g.types.map(code=>{const q=byId.get(code.toLowerCase());return `<option value="${q.id}"${q.id===p.id?' selected':''}>${q.code}｜${q.nickname}</option>`;}).join('')}</optgroup>`).join('')}</select></div></div>
    <header class="detail-hero">${symbol(p,'detail-symbol')}<p class="group-label">${g.short}｜${g.name} <span lang="en">${g.english}</span></p><h1 class="personality-identity" id="detail-title" tabindex="-1"><span class="type-code">${p.code}</span><span class="type-nickname">${p.nickname}</span></h1><p class="detail-tagline">${e(p.tagline)}</p><div class="preference-grid">${p.letters.map(l=>`<div class="preference"><b>${l.code}</b>${l.zh}<span lang="en">${l.name}</span><small>${l.description}</small></div>`).join('')}</div><p class="preference-note">上方採 MBTI 偏好術語；16Personalities 的 S、P 分別稱 Observant、Prospecting，兩者模型並不相同。偏好描述注意與判斷的起點，不代表能力高低。</p></header>
    <div class="detail-panel entering"><nav class="section-nav" aria-label="本頁段落">${[['core','看世界'],['school','學校生活'],['learning','學習與合作'],['strengths','優勢與盲點'],['scenario','生活情境'],['reflection','想一想']].map(([id,text])=>`<button type="button" data-section="${id}">${text}</button>`).join('')}</nav><div class="content-grid">
    ${section('core','01','你可能怎麼看世界',`<div class="body-copy">${p.overview.map(t=>`<p>${e(t)}</p>`).join('')}</div>`,'wide')}
    ${section('school','02','在學校裡可能的樣子',`<ul class="school-grid">${p.schoolLife.map(([title,text])=>`<li><strong>${e(title)}</strong><p>${e(text)}</p></li>`).join('')}</ul><p class="small-note">學校例子、學習策略與合作建議為教學延伸，請用自己的經驗檢驗；不是對這一型學生的實證預測。</p>`,'wide')}
    ${section('learning','03','學習與做事方式',`<dl class="learning-list">${[['engage','容易投入'],['stuck','可能卡住'],['deadline','面對期限'],['mode','獨立與合作'],['strategy','試試這個方法']].map(([key,label])=>`<div${key==='strategy'?' class="strategy"':''}><dt>${label}</dt><dd>${e(p.learning[key])}</dd></div>`).join('')}</dl>`)}
    ${section('friends','04','朋友與團隊合作',list(p.teamwork))}
    ${section('strengths','05','可能的優勢',list(p.strengths))}
    ${section('blindspots','06','可能的盲點',list(p.blindspots))}
    ${section('stress','07','壓力來時可能的反應',p.stress.map(t=>`<p>${e(t)}</p>`).join(''))}
    ${section('growth','08','可以嘗試的成長方向',`<ol class="growth-list">${p.growth.map(t=>`<li>${e(t)}</li>`).join('')}</ol><p class="small-note">練習多一種做法，讓自己有更多選擇。</p>`)}
    ${section('scenario','09','學生生活情境',`<div class="scenario-grid">${p.scenarios.map(([title,text],i)=>`<article class="scenario"><span class="scenario-number">情境 ${String(i+1).padStart(2,'0')}</span><h3>${e(title)}</h3><p>${e(text)}</p></article>`).join('')}</div><p class="small-note">但真實反應仍會受到個人經驗、情境與當下狀態影響。這些情境沒有唯一正確答案。</p>`,'wide')}
    ${section('reflection','10','想一想',`<ol class="reflection-list">${p.reflections.map((t,i)=>`<li><span class="reflection-number" aria-hidden="true">0${i+1}</span><p>${e(t)}</p></li>`).join('')}</ol>`,'wide reflection-card')}
    </div>${note()}<section class="cross-types" aria-labelledby="cross-title"><div class="cross-heading"><h2 id="cross-title">看看和我不同的人</h2><button type="button" class="text-btn" data-home>查看全部 16 型人格 →</button></div><p>從差一個字母開始，再看看差異較多的類型。這只是比較入口，與人際配對無關。</p><div class="related-grid">${related(p)}</div></section><p class="page-source">本頁內容為多個公開資料來源的教育性整理與改寫。<a href="${p.source}" target="_blank" rel="noopener noreferrer">閱讀 ${p.code} 原始介紹 ↗</a>；完整來源見頁尾。</p></div>`;
  }

  function snapshot(el) {
    if (!el) return null;
    const rect=el.getBoundingClientRect();
    if (rect.width===0 || rect.bottom<0 || rect.top>innerHeight) return null;
    const clone=el.cloneNode(true);
    clone.removeAttribute('id'); clone.removeAttribute('tabindex');
    clone.className='personality-identity flight-identity';
    clone.setAttribute('aria-hidden','true');
    clone.style.color=getComputedStyle(el).color;
    clone.style.width=`${el.offsetWidth}px`;
    clone.style.height=`${el.offsetHeight}px`;
    clone.style.left='0'; clone.style.top='0';
    [...el.children].forEach((child,i)=>{
      const style=getComputedStyle(child);
      for(const key of ['fontSize','fontWeight','fontFamily','lineHeight','letterSpacing','marginTop','marginBottom','display']) clone.children[i].style[key]=style[key];
    });
    return {clone,rect,width:el.offsetWidth,height:el.offsetHeight};
  }
  async function fly(snap,target) {
    if(!snap || !target || reduced.matches) return;
    const to=target.getBoundingClientRect();
    if(to.width===0 || to.bottom<0 || to.top>innerHeight) return;
    const {clone,rect,width,height}=snap;
    target.style.visibility='hidden';
    clone.style.transform=`translate(${rect.left}px,${rect.top}px) scale(${rect.width/width},${rect.height/height})`;
    document.body.append(clone);
    try {
      await frames();
      clone.style.transform=`translate(${to.left}px,${to.top}px) scale(${to.width/width},${to.height/height})`;
      await delay(540);
    } finally {clone.remove();target.style.visibility='';}
  }
  function setOverviewState() {
    const state={...(history.state||{}),personalityExplorer:true,overviewY,overviewFocus};
    try{history.replaceState(state,'',location.href);}catch{/* file:// implementations may restrict history state */}
  }
  async function transitionTo(id) {
    const fromId=currentId;
    if(!fromId && id){
      overviewY=window.scrollY;
      const source=lastInput?.closest?.('.personality-card') || document.querySelector(`#card-${id}`);
      overviewFocus=lastInput?.id || `card-${id}`;
      overview.classList.add('is-selecting');
      source?.classList.add('is-selected');
      await delay(reduced.matches?80:280);
      const snap=snapshot(source?.querySelector('.personality-identity'));
      renderDetail(byId.get(id));
      landing.hidden=true; detail.hidden=false;
      window.scrollTo({top:0,behavior:'instant'});
      await frames();
      await fly(snap,detail.querySelector('.personality-identity'));
      detail.querySelector('.detail-panel').classList.remove('entering');
      await delay(reduced.matches?90:430);
      overview.classList.remove('is-selecting');source?.classList.remove('is-selected');
    } else if(fromId && !id){
      detail.querySelector('.detail-panel')?.classList.add('leaving');
      await delay(reduced.matches?80:200);
      const snap=snapshot(detail.querySelector('.personality-identity'));
      detail.hidden=true; landing.hidden=false;
      const dest=document.querySelector(`#card-${fromId}`);
      overview.classList.add('is-selecting');dest?.classList.add('is-selected');
      window.scrollTo({top:overviewY,behavior:'instant'});
      await frames();
      await fly(snap,dest?.querySelector('.personality-identity'));
      dest?.classList.remove('is-selected');overview.classList.remove('is-selecting');
      await delay(reduced.matches?90:360);
      detail.innerHTML='';
    } else if(fromId && id){
      detail.querySelector('.detail-panel')?.classList.add('leaving');
      await delay(reduced.matches?80:180);
      renderDetail(byId.get(id));
      window.scrollTo({top:0,behavior:'instant'});
      await frames();
      detail.querySelector('.detail-panel').classList.remove('entering');
      await delay(reduced.matches?90:430);
    }
    currentId=id;
    document.title=id?`${byId.get(id).code} ${byId.get(id).nickname}｜16 型人格`:baseTitle;
  }
  async function processRoute() {
    if(busy) return;
    busy=true;main.inert=true;main.setAttribute('aria-busy','true');document.body.classList.add('transitioning');
    try {
      // 連續返回或切換時只處理最新目的地，避免動畫留下半完成畫面。
      while(currentId!==desiredId) await transitionTo(desiredId);
    } catch(error){
      console.error('人格導覽發生錯誤',error);
      document.querySelectorAll('.flight-identity').forEach(el=>el.remove());
      overview.classList.remove('is-selecting');
      document.querySelectorAll('.is-selected').forEach(el=>el.classList.remove('is-selected'));
      currentId=desiredId;
      if(currentId){renderDetail(byId.get(currentId));landing.hidden=true;detail.hidden=false;detail.querySelector('.detail-panel').classList.remove('entering');}
      else{landing.hidden=false;detail.hidden=true;}
    } finally {
      busy=false;main.inert=false;main.removeAttribute('aria-busy');document.body.classList.remove('transitioning');
      const focus=currentId?document.querySelector('#detail-title'):(document.getElementById(overviewFocus)||document.querySelector('#overview-title'));
      focus?.focus({preventScroll:true});
      live.textContent=currentId?`已開啟 ${byId.get(currentId).code} ${byId.get(currentId).nickname}。`:'已返回 16 型人格總覽。';
      lastInput=null;
    }
  }
  function readHash() {
    const hash=location.hash.slice(1).toLowerCase();
    const valid=byId.has(hash);
    const msg=document.querySelector('#route-message');
    msg.hidden=!hash||valid;
    if(hash&&!valid) msg.textContent='找不到這個人格代號，請從下方 16 型人格總覽選擇。';
    return valid?hash:null;
  }
  function navigate(id,trigger) {
    if(id && !byId.has(id)) return;
    if(id===desiredId) return;
    document.querySelector('#route-message').hidden=true;
    if(!currentId && !busy){overviewY=window.scrollY;overviewFocus=trigger?.id||`card-${id}`;setOverviewState();}
    lastInput=trigger||null;
    const url=`${location.pathname}${location.search}${id?'#'+id:''}`;
    try{history.pushState({personalityExplorer:true,overviewY,overviewFocus},'',url);}catch{location.hash=id||'';}
    desiredId=id;
    processRoute();
  }
  function onHistory() {
    // 初次以深連結進入時也保有可返回的總覽位置；不劫持站外歷史。
    if(history.state?.personalityExplorer && !busy){overviewY=history.state.overviewY||0;overviewFocus=history.state.overviewFocus||null;}
    desiredId=readHash();
    processRoute();
  }
  document.addEventListener('click',event=>{
    if(event.target.closest('.skip-link')){
      event.preventDefault();main.focus({preventScroll:true});
      main.scrollIntoView({behavior:'instant',block:'start'});return;
    }
    const button=event.target.closest('[data-type]');
    if(button && !busy){navigate(button.dataset.type,button);return;}
    if(event.target.closest('[data-home]')){event.preventDefault();if(currentId||busy)navigate(null,event.target);else window.scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'});return;}
    const jump=event.target.closest('[data-section]');
    if(jump){
      const target=document.querySelector(`#section-${jump.dataset.section}`);
      target?.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});
      const heading=target?.querySelector('h2');heading?.setAttribute('tabindex','-1');heading?.focus({preventScroll:true});
    }
  });
  document.addEventListener('change',event=>{
    if(event.target.id==='type-switch') navigate(event.target.value,event.target);
  });
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&(currentId||desiredId)){event.preventDefault();navigate(null,event.target);}
  });
  window.addEventListener('popstate',onHistory);
  window.addEventListener('hashchange',onHistory);
  if('scrollRestoration' in history) history.scrollRestoration='manual';

  renderOverview();
  document.querySelectorAll('[data-js-only]').forEach(el=>el.hidden=false);
  const finder=document.querySelector('#finder');
  const result=document.querySelector('#finder-label');
  const openButton=document.querySelector('#finder-open');
  finder.addEventListener('change',()=>{
    const code=['energy','information','decision','approach'].map(name=>finder.querySelector(`input[name="${name}"]:checked`)?.value||'').join('');
    const p=byId.get(code.toLowerCase());
    openButton.disabled=!p;
    if(p){result.textContent=`你選的是 ${p.code}｜${p.nickname}`;openButton.dataset.type=p.id;openButton.innerHTML=`查看 ${p.code} <span aria-hidden="true">→</span>`;}
    else{result.textContent='依照測驗結果，選出前四個字母。';delete openButton.dataset.type;openButton.textContent='查看人格介紹';}
  });
  document.querySelector('#sources-list').innerHTML=sources.map(s=>`<li><a href="${s.url}" target="_blank" rel="noopener noreferrer">${e(s.name)} ↗</a><small>${e(s.url)}<br>存取日期：${s.accessed}</small></li>`).join('');
  const initial=readHash();
  if(initial){
    currentId=desiredId=initial;
    renderDetail(byId.get(initial));landing.hidden=true;detail.hidden=false;detail.querySelector('.detail-panel').classList.remove('entering');
    document.title=`${byId.get(initial).code} ${byId.get(initial).nickname}｜16 型人格`;
    window.scrollTo({top:0,behavior:'instant'});
    document.querySelector('#detail-title').focus({preventScroll:true});
  }
})();
