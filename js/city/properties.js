(function(){'use strict';
  const CI=window.CI,homes=[
    {name:'Garsónka',price:0,income:5,prestige:0},{name:'Byt',price:1500,income:18,prestige:2},{name:'Dům',price:8000,income:55,prestige:8},{name:'Vila',price:42000,income:180,prestige:25},{name:'Penthouse',price:210000,income:800,prestige:80},{name:'Hotel',price:900000,income:3700,prestige:250}
  ];
  function property(){return homes[Math.min(CI.state.property.index,homes.length-1)];}
  function upgradeCost(){const h=property();return Math.ceil((h.price||700)*(.45+CI.state.property.level*.18));}
  CI.propertyName=()=>property().name;
  CI.passiveIncome=()=>Math.floor(property().income*CI.state.property.level*(1+(CI.state.property.level-1)*.2));
  CI.propertyModal=()=>{const s=CI.state,h=property(),cost=upgradeCost(),level=s.property.level,next=homes[Math.min(s.property.index+1,homes.length-1)];let body=`<p class="modal-copy">${CI.escape(h.name)} • úroveň ${level}/10. Každá úroveň zvyšuje váš denní příjem i prestiž.</p><div class="modal-row"><span>Pasivní příjem</span><b>${CI.money(CI.passiveIncome())} kr./den</b></div><div class="modal-row"><span>Vylepšení úrovně ${Math.min(level+1,10)}</span><b>${CI.money(cost)} kr.</b></div>`;
    if(level===10&&s.property.index<homes.length-1)body+=`<p class="modal-copy">Další bydlení: <b>${next.name}</b> • ${CI.money(next.price)} kr.</p>`;else if(level===10)body+='<p class="modal-copy">Toto bydlení dosáhlo maximální úrovně.</p>';
    CI.modal('Vaše bydlení',body,[{label:level===10&&s.property.index===homes.length-1?'Maximální úroveň':level===10?'Koupit '+next.name:'Vylepšit za '+CI.money(cost)+' kr.',kind:'gold-button',fn:close=>{if(level===10&&s.property.index===homes.length-1){close();return;}if(level===10&&s.property.index<homes.length-1){if(s.credits<next.price){CI.toast('Na další bydlení nemáte dostatek kreditů.','bad');return;}CI.updateCredit(-next.price);s.property.index++;s.property.level=1;s.prestige+=next.prestige;s.stats.propertiesBought++;}else{if(s.credits<cost){CI.toast('Na toto vylepšení nemáte dostatek kreditů.','bad');return;}CI.updateCredit(-cost);s.property.level++;s.prestige+=Math.ceil(h.prestige/10);s.stats.propertiesBought++;}CI.saveSilent();CI.render();close();CI.toast('Vaše bydlení bylo vylepšeno.','good');}},{label:'Zavřít',fn:close=>close()}]);
  };
  CI.initProperties=()=>{CI.$('[data-action="propertyUpgrade"]').addEventListener('click',CI.propertyModal);};
})();
