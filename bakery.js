'use strict';
function bakeryPhoto(b){
 if(b.kind==='Pogácsa')return 'bake-pogacsa';
 if(b.kind==='Rúd és csavart'||b.taste==='Sós'&&['Keksz és aprósüti','Leveles sütemény'].includes(b.kind))return 'bake-sticks';
 if(b.taste==='Sós')return 'bake-savory';
 if(b.kind==='Réteges sütemény')return 'bake-layer';
 if(b.kind==='Torta')return 'bake-cake';
 if(b.kind==='Keksz és aprósüti')return 'bake-cookie';
 if(b.kind==='Sütés nélküli sütemény')return 'bake-nobake';
 if(['Kelt tekercs','Kelt kifli és kalács','Fánk','Leveles sütemény','Rétes'].includes(b.kind))return 'bake-roll';
 return 'bake-fruit';
}
function openBakery(taste=''){resetFilters();S.filter.baking=true;S.filter.bakeTaste=taste;go('browse')}
function bakeryBar(){
 const f=S.filter;
 if(!f.baking)return '<div class="section row wrap"><button class="chip bake-chip" onclick="openBakery()">'+ic('book')+' Sütemények</button></div>';
 return '<div class="card section bake-controls"><div class="row between"><b>Süteményválogatás</b><button class="link" onclick="resetFilters()">Minden recept</button></div><div class="bake-toggle" role="group" aria-label="Sütemény jellege">'+[['','Mindegy'],['Édes','Édes'],['Sós','Sós']].map(([v,l])=>'<button class="'+(f.bakeTaste===v?'active':'')+'" data-taste="'+esc(v)+'" onclick="setFilter(\'bakeTaste\',this.dataset.taste)">'+esc(l)+'</button>').join('')+'</div><div class="fields">'+selectField('Típus',bakingKinds,f.bakeKind,"setFilter('bakeKind',this.value)",'Minden típus')+selectField('Ízesítés',bakingFlavors,f.bakeFlavor,"setFilter('bakeFlavor',this.value)",'Minden íz')+selectField('Elkészítés',methods,f.method,"setFilter('method',this.value)",'Mindegy')+selectField('Nehézség',difficulties,f.difficulty,"setFilter('difficulty',this.value)",'Mindegy')+'</div><div class="row wrap">'+btn('Sorsolj sütit!','rollBakery()','primary grow','shuffle')+btn('További szűrők','showFilters()','secondary','filter')+'</div></div>';
}
function bakeryFilterFields(){const f=S.filter;return '<div class="full bake-filter-head"><b>Sütemények</b><label class="row small"><input type="checkbox" '+(f.baking?'checked':'')+' onchange="setBakeryOnly(this.checked)"> Csak sütemények</label></div>'+selectField('Édes vagy sós',bakingTastes,f.bakeTaste,"setFilter('bakeTaste',this.value)",'Mindegy')+selectField('Sütemény típusa',bakingKinds,f.bakeKind,"setFilter('bakeKind',this.value)",'Mindegy')+selectField('Sütemény ízesítése',bakingFlavors,f.bakeFlavor,"setFilter('bakeFlavor',this.value)",'Mindegy')}
function setBakeryOnly(on){if(!on){S.filter.bakeTaste='';S.filter.bakeKind='';S.filter.bakeFlavor=''}setFilter('baking',on)}
function rollBakery(){const pool=filtered().filter(r=>r.bakery),r=choose(pool);if(!r){notify('Nincs a szűrőknek megfelelő sütemény.');return}S.seen.push(r.id);S.seen=S.seen.slice(-40);openRecipe(r.id)}
