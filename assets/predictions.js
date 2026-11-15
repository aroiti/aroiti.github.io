// Onglet « Prédictions du Set 19 ».
// La page porte un état d'attente écrit en dur (lisible sans script) ; ce
// script le complète à partir de predictions/set19.json : l'état, la date de
// mise à jour, les sept cases et une fiche par compo.
(function(){
  var sec = document.getElementById('predictions');
  if (!sec) return;
  var L = (document.documentElement.lang || 'fr').slice(0, 2);

  var I = {
    fr: {
      cases: {A:'Compo trois étoiles · 1 coût', B:'Compo trois étoiles · 2 coûts', C:'Compo trois étoiles · 3 coûts', D:'Niveau 8 · dégâts physiques', E:'Niveau 8 · dégâts magiques', F:'Niveau 9 · légendaires', G:'Trait vertical'},
      vide:'à remplir', n:function(k){return k + (k > 1 ? ' compos' : ' compo');},
      confiance:{forte:'confiance forte', moyenne:'confiance moyenne', speculative:'spéculative'},
      porteurs:'Porteurs', front:'Ligne de front', traits:'Traits visés', niveau:'Niveau', objets:'Objets', composants:'Composants à ramasser d’abord',
      deblocage:'Déblocage', sur:'se remplit en jouant la compo', detour:'demande un détour', debut:'Début de partie', td:'True Damage',
      faceA:'face A, série de victoires', faceB:'face B, série de défaites',
      tomber:'Ce qui la ferait tomber', sources:'Sources', maj:'Mis à jour le ',
      etats:{attente:'Aucun champion publié pour l’instant. Les premières compos arrivent avec la révélation des champions.',
             fuites:function(k){return k + ' champions connus. Compos construites sur des informations sourcées, avant le PBE.';},
             pbe:'Construit sur les données du PBE. Elles changent presque chaque jour jusqu’à la sortie.',
             termine:'Le Set 19 est sorti : voici lesquelles ont tenu.'},
      verdict:{tenue:'A tenu', tombee:'N’a pas tenu'}, pour:' pour '
    },
    en: {
      cases: {A:'1-cost reroll', B:'2-cost reroll', C:'3-cost reroll', D:'Level 8 · AD carry', E:'Level 8 · AP carry', F:'Level 9 · legendaries', G:'Vertical trait'},
      vide:'to fill', n:function(k){return k + (k > 1 ? ' comps' : ' comp');},
      confiance:{forte:'high confidence', moyenne:'medium confidence', speculative:'speculative'},
      porteurs:'Carries', front:'Frontline', traits:'Target traits', niveau:'Level', objets:'Items', composants:'Components to collect first',
      deblocage:'Unlock', sur:'met naturally by playing the comp', detour:'needs a detour', debut:'Early game', td:'True Damage',
      faceA:'side A, win streak', faceB:'side B, loss streak',
      tomber:'What would break it', sources:'Sources', maj:'Updated ',
      etats:{attente:'No champions released yet. The first comps arrive with the champion reveal.',
             fuites:function(k){return k + ' champions known. Comps built on sourced information, before the PBE.';},
             pbe:'Built on PBE data, which changes almost every day until release.',
             termine:'Set 19 is out: here is which ones held up.'},
      verdict:{tenue:'Held up', tombee:'Did not hold up'}, pour:' on '
    },
    ko: {
      cases: {A:'1코스트 리롤', B:'2코스트 리롤', C:'3코스트 리롤', D:'8레벨 · AD 캐리', E:'8레벨 · AP 캐리', F:'9레벨 · 전설', G:'시너지 집중'},
      vide:'비어 있음', n:function(k){return '덱 ' + k + '개';},
      confiance:{forte:'신뢰도 높음', moyenne:'신뢰도 보통', speculative:'추측'},
      porteurs:'캐리', front:'탱커 라인', traits:'목표 시너지', niveau:'레벨', objets:'아이템', composants:'먼저 모을 재료',
      deblocage:'해금', sur:'덱을 운영하면 자연스럽게 충족', detour:'별도로 노려야 함', debut:'초반', td:'True Damage',
      faceA:'A면, 연승', faceB:'B면, 연패',
      tomber:'이 예측이 틀어지는 조건', sources:'출처', maj:'업데이트: ',
      etats:{attente:'아직 공개된 챔피언이 없습니다. 챔피언이 공개되면 첫 덱이 올라옵니다.',
             fuites:function(k){return '알려진 챔피언 ' + k + '명. 출처가 확인된 정보로 PBE 이전에 만든 덱입니다.';},
             pbe:'PBE 데이터 기준입니다. 출시 전까지 거의 매일 바뀝니다.',
             termine:'세트 19가 출시되었습니다. 어떤 예측이 맞았는지 확인하세요.'},
      verdict:{tenue:'적중', tombee:'빗나감'}, pour:' · '
    },
    ja: {
      cases: {A:'1コスト リロール', B:'2コスト リロール', C:'3コスト リロール', D:'レベル8・ADキャリー', E:'レベル8・APキャリー', F:'レベル9・レジェンダリー', G:'縦シナジー'},
      vide:'未定', n:function(k){return k + '構成';},
      confiance:{forte:'信頼度：高', moyenne:'信頼度：中', speculative:'推測'},
      porteurs:'キャリー', front:'前衛', traits:'狙うシナジー', niveau:'レベル', objets:'アイテム', composants:'優先して集める素材',
      deblocage:'アンロック', sur:'構成を組めば自然に達成', detour:'別途狙う必要あり', debut:'序盤', td:'True Damage',
      faceA:'A面、連勝', faceB:'B面、連敗',
      tomber:'この予想が崩れる条件', sources:'出典', maj:'更新：',
      etats:{attente:'まだチャンピオンは公開されていません。公開され次第、最初の構成を掲載します。',
             fuites:function(k){return '判明しているチャンピオン：' + k + '体。出典のある情報をもとに、PBE前に組んだ構成です。';},
             pbe:'PBEのデータに基づいています。リリースまでほぼ毎日変わります。',
             termine:'セット19がリリースされました。どの予想が当たったかをご覧ください。'},
      verdict:{tenue:'的中', tombee:'外れ'}, pour:'：'
    },
    zh: {
      cases: {A:'1费追三星', B:'2费追三星', C:'3费追三星', D:'8级 · 物理主C', E:'8级 · 法系主C', F:'9级 · 五费传说', G:'纯羁绊'},
      vide:'待填', n:function(k){return k + '套阵容';},
      confiance:{forte:'把握较大', moyenne:'把握一般', speculative:'推测'},
      porteurs:'主C', front:'前排', traits:'目标羁绊', niveau:'等级', objets:'装备', composants:'优先收集的散件',
      deblocage:'解锁', sur:'按阵容运营即可顺路完成', detour:'需要专门绕路', debut:'前期', td:'True Damage',
      faceA:'A面，连胜', faceB:'B面，连败',
      tomber:'什么情况会推翻它', sources:'来源', maj:'更新于 ',
      etats:{attente:'目前还没有公布任何英雄。英雄公布后，第一批阵容就会上线。',
             fuites:function(k){return '已知英雄 ' + k + ' 位。阵容基于有出处的信息，在 PBE 之前构建。';},
             pbe:'基于 PBE 数据。正式上线前几乎每天都在变化。',
             termine:'第19赛季已上线：来看看哪些预测成立了。'},
      verdict:{tenue:'成立', tombee:'未成立'}, pour:'：'
    }
  };
  var T = I[L] || I.en;

  function t(x){
    if (x == null) return '';
    if (typeof x === 'string') return x;
    return x[L] || x.en || x.fr || '';
  }
  function esc(s){
    return String(s).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function unite(u){
    var c = u.cout ? '<span class="cout c' + esc(u.cout) + '" title="' + esc(u.cout) + '">' + esc(u.cout) + '</span>' : '';
    return '<span class="unite">' + c + esc(t(u.nom)) + '</span>';
  }
  function unites(l){ return '<div class="unites">' + (l || []).map(unite).join('') + '</div>'; }
  function ligne(dt, dd){ return dd ? '<dt>' + esc(dt) + '</dt><dd>' + dd + '</dd>' : ''; }

  function fiche(c){
    var h = '<article class="fiche" id="compo-' + esc(c.id) + '">';
    h += '<div class="fiche-tete"><h3>' + esc(t(c.nom)) + '</h3>';
    if (c.confiance && T.confiance[c.confiance])
      h += '<span class="confiance ' + esc(c.confiance) + '">' + esc(T.confiance[c.confiance]) + '</span>';
    h += '</div>';
    if (c.pourquoi) h += '<p class="pourquoi">' + esc(t(c.pourquoi)) + '</p>';
    h += '<dl>';
    h += ligne(T.porteurs, c.porteurs && c.porteurs.length ? unites(c.porteurs) : '');
    h += ligne(T.front, c.front && c.front.length ? unites(c.front) : '');
    h += ligne(T.traits, c.traits && c.traits.length ? '<div class="puces">' + c.traits.map(function(x){
      return '<span class="puce">' + esc(t(x.nom)) + (x.palier ? ' ' + esc(x.palier) : '') + '</span>';
    }).join('') + '</div>' : '');
    h += ligne(T.niveau, c.niveau ? esc(c.niveau) : '');
    h += ligne(T.objets, c.objets && c.objets.length ? c.objets.map(function(o){
      return '<div>' + esc((o.objets || []).map(t).join(', ')) + (o.pour ? '<span class="faible">' + esc(T.pour + t(o.pour)) + '</span>' : '') + '</div>';
    }).join('') : '');
    h += ligne(T.composants, c.composants && c.composants.length ? '<div class="puces">' + c.composants.map(function(x){
      return '<span class="puce">' + esc(t(x)) + '</span>';
    }).join('') + '</div>' : '');
    if (c.deblocage) {
      var d = c.deblocage;
      h += ligne(T.deblocage, '<div class="deblocage">' + unite(d) + ' · <span class="' + (d.sur_le_chemin ? 'sur' : 'detour') + '">' +
        esc(d.sur_le_chemin ? T.sur : T.detour) + '</span>' + (d.condition ? '<p>' + esc(t(d.condition)) + '</p>' : '') + '</div>');
    }
    h += ligne(T.debut, c.debut && c.debut.length ? unites(c.debut) : '');
    h += ligne(T.td, c.true_damage === 'A' ? esc(T.faceA) : c.true_damage === 'B' ? esc(T.faceB) : '');
    h += '</dl>';
    if (c.verdict && T.verdict[c.verdict])
      h += '<p class="verdict ' + esc(c.verdict) + '">' + esc(T.verdict[c.verdict]) + (c.verdict_note ? ' — ' + esc(t(c.verdict_note)) : '') + '</p>';
    var sources = (c.sources || []).filter(function(s){ return /^https?:\/\//.test(s.url || ''); });
    if (c.tomberait_si || sources.length) {
      h += '<details><summary>' + esc(T.tomber) + ' · ' + esc(T.sources) + '</summary>';
      if (c.tomberait_si) h += '<p>' + esc(t(c.tomberait_si)) + '</p>';
      if (sources.length) h += '<ul>' + sources.map(function(s){
        return '<li><a href="' + esc(s.url) + '" rel="noopener">' + esc(t(s.titre) || s.url) + '</a></li>';
      }).join('') + '</ul>';
      h += '</details>';
    }
    return h + '</article>';
  }

  function afficher(d){
    var compos = (d.compos || []).filter(function(c){ return c && c.case && T.cases[c.case]; });
    var etat = sec.querySelector('.pr-etat'), maj = sec.querySelector('.pr-maj');
    var e = T.etats[d.etat] || T.etats.attente;
    if (etat) etat.textContent = typeof e === 'function' ? e((d.connus || {}).champions || 0) : e;
    if (maj && d.maj) {
      try {
        maj.textContent = T.maj + new Intl.DateTimeFormat(document.documentElement.lang || L,
          {day:'numeric', month:'long', hour:'2-digit', minute:'2-digit'}).format(new Date(d.maj));
      } catch (err) { maj.textContent = ''; }
    }
    var par = {};
    compos.forEach(function(c){ (par[c.case] = par[c.case] || []).push(c); });
    sec.querySelectorAll('.case').forEach(function(el){
      var k = el.dataset.case, n = (par[k] || []).length, s = el.querySelector('span');
      el.classList.toggle('pleine', n > 0);
      if (s) s.textContent = n ? T.n(n) : T.vide;
      // Une case remplie mène à ses compos. Le lien ne change pas l'ancre de
      // la page : c'est elle qui garde l'onglet ouvert.
      if (n && !el.querySelector('.case-lien')) {
        var a = document.createElement('a');
        a.className = 'case-lien'; a.href = '#case-' + k;
        a.setAttribute('aria-label', T.cases[k] + ' : ' + T.n(n));
        a.addEventListener('click', function(ev){
          ev.preventDefault();
          var g = document.getElementById('case-' + k);
          if (g) g.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
        });
        el.appendChild(a);
      }
    });
    var zone = sec.querySelector('.pr-compos');
    if (!zone) return;
    zone.innerHTML = 'ABCDEFG'.split('').filter(function(k){ return par[k]; }).map(function(k){
      return '<section class="pr-groupe" id="case-' + k + '"><h2>' + esc(T.cases[k]) + '</h2>' +
        '<div class="fiches">' + par[k].map(fiche).join('') + '</div></section>';
    }).join('');
  }

  fetch(sec.dataset.donnees, {cache: 'no-cache'})
    .then(function(r){ if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(afficher)
    .catch(function(){ /* l'état d'attente écrit dans la page reste affiché */ });
})();
