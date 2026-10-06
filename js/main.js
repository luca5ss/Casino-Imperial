(function(){'use strict';
  const CI=window.CI;
  async function start(){
    await CI.loadConfigs();CI.loadSave();
    CI.initSlots();CI.initRoulette();CI.initBlackjack();CI.initProperties();CI.initVehicles();CI.initBusinesses();CI.initEconomy();CI.initBank();CI.initLoanShark();CI.initJobs();CI.initMap();CI.initUI();
    CI.world='casino';CI.render();CI.renderRivals();CI.collectIncome();
    setInterval(()=>{if(CI.state.settings.cooldownUntil&&CI.state.settings.cooldownUntil<Date.now()){CI.state.settings.cooldownUntil=0;CI.saveSilent();}},5000);
    setInterval(CI.saveSilent,20000);
    setInterval(CI.render,60000);
  }
  start().catch(err=>{console.error('Casino Imperial se nepodařilo spustit:',err);CI.toast('Hru se nepodařilo spustit. Znovu načtěte stránku.','bad');});
})();
