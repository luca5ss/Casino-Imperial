(function(){'use strict';
  const CI=window.CI;
  CI.newState=()=>({
    version:1,credits:1000,prestige:0,casinoSpent:0,casinoWon:0,spins:0,rouletteRounds:0,blackjackRounds:0,
    property:{index:0,level:1},vehicle:0,business:null,inventory:[],day:1,auctionWeek:-1,lastIncomeAt:Date.now(),loans:[],sharkLoan:null,
    bets:{roulette:[]},missions:{date:'',claimed:[],base:null},cashback:{dailyDate:'',weeklyDate:''},settings:{sound:true,responsibleLimit:5000,cooldownUntil:0},
    slotBet:10,slotLines:10,blackjackBet:25,selectedChip:10,stats:{jobs:0,propertiesBought:0,businessBought:0,largestWin:0}
  });
  CI.state=CI.newState();
  CI.updateCredit=amount=>{CI.state.credits=Math.max(0,Math.floor(CI.state.credits+amount));};
  CI.placeWager=amount=>{CI.state.casinoSpent+=amount;CI.updateCredit(-amount);};
  CI.payCasino=amount=>{if(amount<=0)return;CI.state.casinoWon+=amount;CI.state.stats.largestWin=Math.max(CI.state.stats.largestWin,amount);CI.updateCredit(amount);};
  CI.vipName=()=>{const thresholds=[0,2500,10000,40000,150000,500000],names=['Bronz','Stříbro','Zlato','Platina','Diamant','Imperiální'];let level=0;thresholds.forEach((n,i)=>{if(CI.state.casinoSpent>=n)level=i;});return names[level];};
  CI.vipBonus=()=>Math.min(.12,Math.floor(CI.state.casinoSpent/10000)*.01);
  CI.casinoBonus=()=>{const business=CI.businessData?CI.businessData():null;return Math.min(.25,(CI.vehicleData?CI.vehicleData().bonus:0)+(CI.state.property.level-1)*.004+(business&&business.name==='Pobočka kasina'?0.04:0)+CI.vipBonus());};
  CI.canWager=amount=>CI.state.settings.cooldownUntil<=Date.now()&&CI.state.casinoSpent+amount<=CI.state.settings.responsibleLimit&&amount<=CI.state.credits;
  CI.dayCycle=()=>{const d=new Date(),h=d.getHours();return h>=6&&h<18?'DEN':'NOC';};
})();
