(function(){'use strict';
  const CI=window.CI=window.CI||{};
  CI.$=(s,root=document)=>root.querySelector(s);
  CI.$$=(s,root=document)=>Array.from(root.querySelectorAll(s));
  CI.money=n=>Math.floor(Number(n)||0).toLocaleString('cs-CZ');
  CI.random=(min,max)=>Math.floor(Math.random()*(max-min+1))+min;
  CI.pick=arr=>arr[Math.floor(Math.random()*arr.length)];
  CI.escape=text=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  CI.toast=(message,tone='')=>{const el=document.createElement('div');el.className='toast '+tone;el.textContent=message;CI.$('#toast-region').append(el);setTimeout(()=>el.remove(),3300);};
  CI.modal=(title,html,actions=[])=>{
    const root=CI.$('#modal-root'),card=document.createElement('section');card.className='modal-card';card.setAttribute('role','dialog');card.setAttribute('aria-modal','true');
    card.innerHTML='<button class="modal-close" aria-label="Zavřít">×</button><h2>'+CI.escape(title)+'</h2><div class="modal-body">'+html+'</div><div class="modal-actions"></div>';
    const close=()=>{root.replaceChildren();};card.querySelector('.modal-close').addEventListener('click',close);
    card.querySelector('.modal-actions').append(...actions.map(({label,fn,kind='wood-button'})=>{const b=document.createElement('button');b.className=kind;b.textContent=label;b.addEventListener('click',()=>fn(close));return b;}));
    root.replaceChildren(card);root.onclick=e=>{if(e.target===root)close();};return close;
  };
  CI.modalRootClear=()=>CI.$('#modal-root').replaceChildren();
  CI.sound=(frequency=440,duration=.08,type='triangle')=>{if(CI.state&&!CI.state.settings.sound)return;try{const ctx=CI.audio||(CI.audio=new(window.AudioContext||window.webkitAudioContext)()),osc=ctx.createOscillator(),gain=ctx.createGain();osc.type=type;osc.frequency.value=frequency;gain.gain.setValueAtTime(.055,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+duration);osc.connect(gain);gain.connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+duration);}catch(err){console.warn('Zvuk není dostupný:',err.message);}};
  CI.loadConfigs=async()=>{
    const names=['properties','vehicles','businesses','economy','vip','missions'];
    if(location.protocol==='file:'){CI.config=Object.fromEntries(names.map(name=>[name,null]));return CI.config;}
    const results=await Promise.all(names.map(async name=>{try{const r=await fetch('data/'+name+'.json');if(!r.ok)throw new Error('HTTP '+r.status);return [name,await r.json()];}catch(err){console.warn('Konfigurační soubor '+name+'.json se nepodařilo načíst; použijí se vestavěné hodnoty.',err);return[name,null];}}));
    CI.config=Object.fromEntries(results);return CI.config;
  };
  CI.checkedInteger=(value,min,max)=>Math.max(min,Math.min(max,Math.floor(Number(value)||min)));
})();
