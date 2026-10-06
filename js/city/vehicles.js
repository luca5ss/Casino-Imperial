(function(){'use strict';
  const CI=window.CI,vehicles=[
    {name:'Jízdní kolo',price:0,prestige:0,bonus:0,speed:1},{name:'Motocykl',price:1200,prestige:2,bonus:.01,speed:1.4},{name:'Městský vůz',price:6500,prestige:7,bonus:.02,speed:1.8},{name:'Luxusní vůz',price:35000,prestige:22,bonus:.04,speed:2.3},{name:'Sportovní vůz',price:160000,prestige:60,bonus:.06,speed:3},{name:'Limuzína',price:450000,prestige:120,bonus:.08,speed:2.6},{name:'Helikoptéra',price:1500000,prestige:300,bonus:.1,speed:4},{name:'Jachta',price:2200000,prestige:350,bonus:.12,speed:2.5}
  ];
  CI.vehicleData=()=>vehicles[CI.state.vehicle]||vehicles[0];
  CI.vehicleModal=()=>{const current=CI.vehicleData(),next=vehicles[CI.state.vehicle+1];const rows=vehicles.map((v,i)=>`<div class="modal-row"><span>${v.name}${i===CI.state.vehicle?' • vaše':''}</span><b>${i<=CI.state.vehicle?'Vlastní':CI.money(v.price)+' kr.'}</b></div>`).join('');CI.modal('Garáž a vozidla',`<p class="modal-copy">Vozidlo zvyšuje prestiž, rychlost po městě a přináší drobný bonus v kasinu (${Math.round(current.bonus*100)} %).</p>${rows}`,next?[{label:'Koupit '+next.name,kind:'gold-button',fn:close=>{if(CI.state.credits<next.price){CI.toast('Na toto vozidlo nemáte dostatek kreditů.','bad');return;}CI.updateCredit(-next.price);CI.state.vehicle++;CI.state.prestige+=next.prestige;CI.saveSilent();CI.render();close();CI.toast('Nové vozidlo je vaše.','good');}}]:[{label:'Vlastníte všechna vozidla',fn:close=>close()}]);};
  CI.initVehicles=()=>{CI.$('[data-action="vehicle"]').addEventListener('click',CI.vehicleModal);};
})();
