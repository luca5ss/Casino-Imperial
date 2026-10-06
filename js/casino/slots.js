(function(){'use strict';
  const CI=window.CI,machines={imperial:{symbols:['🍒','🍋','🍊','🔔','7','★','♜'],winFactor:1,special:'7'},royal:{symbols:['🍇','🍉','🍀','♦','Q','★','♜'],winFactor:1.1,special:'♦'}},patterns=[[0,0,0,0,0],[1,1,1,1,1],[2,2,2,2,2],[0,1,2,1,0],[2,1,0,1,2],[0,0,1,2,2],[2,2,1,0,0],[1,0,0,0,1],[1,2,2,2,1],[0,1,1,1,0],[2,1,1,1,2],[0,1,0,1,0],[2,1,2,1,2],[1,0,1,2,1],[1,2,1,0,1],[0,2,0,2,0],[2,0,2,0,2],[0,2,2,2,0],[2,0,0,0,2],[1,1,0,1,1]];
  let spinning=false,autoTimer=null,autoEnabled=false,selected='imperial';
  function build(){const reels=CI.$('#reels');reels.replaceChildren();for(let x=0;x<5;x++){const col=document.createElement('div');col.className='reel-column';for(let y=0;y<3;y++){const cell=document.createElement('div');cell.className='reel-symbol';cell.textContent=CI.pick(machines[selected].symbols);col.append(cell);}reels.append(col);}}
  function play(){
    if(spinning)return;const s=CI.state,bet=CI.checkedInteger(s.slotBet,10,500),lines=CI.checkedInteger(s.slotLines,10,20);
    const cost=bet*lines;if(!CI.canWager(cost)){CI.toast(s.settings.cooldownUntil>Date.now()?'Pauza na zodpovědnou hru právě probíhá.':'Sázka překračuje váš limit hry nebo stav kreditů.','bad');return;}
    spinning=true;CI.placeWager(cost);s.spins++;CI.saveSilent();const cols=CI.$$('.reel-column');cols.forEach((c,i)=>{c.classList.add('spinning');c.querySelectorAll('.reel-symbol').forEach(e=>e.classList.remove('winner'));});
    const final=Array.from({length:3},()=>Array.from({length:5},()=>CI.pick(machines[selected].symbols)));
    let stopped=0;const started=performance.now(),duration=1500;
    function animate(now){if(!spinning)return;const progress=Math.min(1,(now-started)/duration);cols.forEach((col,i)=>{if(progress<Math.min(1,.42+i*.14)){col.querySelectorAll('.reel-symbol').forEach(cell=>{if(Math.random()<.45)cell.textContent=CI.pick(machines[selected].symbols);});}else if(!col.dataset.stopped){col.dataset.stopped='1';col.classList.remove('spinning');col.querySelectorAll('.reel-symbol').forEach((cell,row)=>cell.textContent=final[row][i]);stopped++;CI.sound(350+i*90,.07);}});if(stopped<5)requestAnimationFrame(animate);else{cols.forEach(c=>delete c.dataset.stopped);finish(final,bet,lines);}}
    requestAnimationFrame(animate);
  }
  function finish(grid,bet,lines){
    const machine=machines[selected],winners=[];let reward=0;for(let p=0;p<Math.min(lines,patterns.length);p++){const pattern=patterns[p],symbols=pattern.map((r,c)=>grid[r][c]);let target=symbols.find(s=>s!=='★'&&s!=='♜');if(!target)target=machine.special;let count=0;for(const symbol of symbols){if(symbol===target||symbol==='★')count++;else break;}if(count>=3){const mult={3:2,4:8,5:30}[count]||0;reward+=bet*mult*(target===machine.special?2:1);winners.push(pattern);}}
    const scatter=grid.flat().filter(s=>s==='♜').length;if(scatter>=3)reward+=bet*(lines/10)*(scatter===3?8:scatter===4?20:50);reward=Math.floor(reward*machine.winFactor*(1+CI.casinoBonus()));
    if(reward)CI.payCasino(reward);CI.saveSilent();CI.render();spinning=false;
    const message=reward?'Výhra '+CI.money(reward)+' kreditů!'+(scatter>=3?' Bonusový rozptyl!':''):'Tentokrát bez výhry. Zkuste to znovu.';CI.$('#slot-message').textContent=message;CI.toast(message,reward?'good':'');if(reward)CI.sound(660,.3,'sine');
    winners.forEach(pattern=>pattern.forEach((r,c)=>{const cell=CI.$$('.reel-column')[c].children[r];cell.classList.add('winner');}));
    if(autoEnabled){autoTimer=setTimeout(()=>{autoTimer=null;if(CI.canWager(bet*lines))play();else CI.toggleAutoplay(false);},900);}
  }
  CI.toggleAutoplay=enabled=>{autoEnabled=enabled;if(autoTimer)clearTimeout(autoTimer);autoTimer=null;if(enabled){autoTimer=setTimeout(()=>{autoTimer=null;if(CI.canWager(CI.state.slotBet*CI.state.slotLines))play();else CI.toggleAutoplay(false);},250);CI.$('#autoplay-label').textContent='zapnuta';}else CI.$('#autoplay-label').textContent='vypnuta';};
  CI.initSlots=()=>{build();CI.$('[data-action="spin"]').addEventListener('click',play);CI.$('[data-action="autoplay"]').addEventListener('click',()=>CI.toggleAutoplay(CI.$('#autoplay-label').textContent==='vypnuta'));CI.$$('.slot-choice').forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.slot;CI.$$('.slot-choice').forEach(x=>x.classList.toggle('selected',x===b));CI.$('.machine-top span').textContent=selected==='imperial'?'✧ IMPERIAL ✧':'✧ ROYAL ✧';CI.$('#slot-machine').classList.toggle('royal-machine',selected==='royal');build();}));};
})();
