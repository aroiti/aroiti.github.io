// Builder du Set 19, dans l'onglet Prédictions.
// Un plateau de 4 × 7 cases, les champions de predictions/set19-unites.json,
// et les traits qui s'activent. Une compo de l'onglet s'y ouvre par son
// bouton ; un plateau se partage par son lien, ?b=…#predictions (l'ancre doit
// rester #predictions : c'est elle qui ouvre l'onglet).
// Le comptage est le même que celui qui calcule les traits des fiches : un
// champion compte une fois par trait, K|DA additionne les étoiles, un emblème
// ajoute son trait au champion qui ne l'a pas déjà.
(function(){
  var sec = document.getElementById('predictions');
  var zone = document.getElementById('builder');
  if (!sec || !zone) return;
  var L = (document.documentElement.lang || 'fr').slice(0, 2);

  var I = {
    fr: {
      vers:'Ouvrir le builder', vide:'Plateau vide. Clique sur un champion pour le poser.',
      compte:function(n, c){ return n + (n > 1 ? ' champions' : ' champion') + ' · niveau ' + c; },
      devant:'Ligne de front', vider:'Vider le plateau', copier:'Copier le lien', copie:'Lien copié.', manuel:'Copie ce lien :',
      traits:'Traits', aucunTrait:'Les traits du plateau s’affichent ici.', unique:'trait unique',
      cherche:'Chercher un champion', tous:'Tous les traits', deb:'À débloquer seulement', rien:'Aucun champion ne correspond.',
      cout:function(c){ return c + (c > 1 ? ' costs' : ' cost'); },
      etoiles:'Étoiles', embleme:'Emblème', aucun:'aucun', retirer:'Retirer du plateau', deuxCases:'Occupe deux cases.',
      debloquer:'À débloquer : ', caseVide:function(r, c){ return 'Case vide, rangée ' + r + ', colonne ' + c; },
      aide:'Clique sur un champion pour le poser. Clique sur un champion du plateau pour régler ses étoiles, lui donner un emblème ou le déplacer. Sur ordinateur, tu peux aussi le glisser.',
      deplacer:'Choisis une case vide pour l’y déplacer, ou un autre champion pour le régler.',
      roles:{tank:'tank', combattant:'combattant', AD:'dégâts physiques', AP:'dégâts magiques', 'AP/AD':'dégâts mixtes'},
      liste:'Liste des champions : '
    },
    en: {
      vers:'Open the team builder', vide:'Empty board. Click a champion to place it.',
      compte:function(n, c){ return n + (n > 1 ? ' champions' : ' champion') + ' · level ' + c; },
      devant:'Frontline', vider:'Clear the board', copier:'Copy link', copie:'Link copied.', manuel:'Copy this link:',
      traits:'Traits', aucunTrait:'The board’s traits show up here.', unique:'unique trait',
      cherche:'Search a champion', tous:'All traits', deb:'Unlockables only', rien:'No champion matches.',
      cout:function(c){ return c + '-cost'; },
      etoiles:'Stars', embleme:'Emblem', aucun:'none', retirer:'Remove from board', deuxCases:'Takes two hexes.',
      debloquer:'Unlock: ', caseVide:function(r, c){ return 'Empty hex, row ' + r + ', column ' + c; },
      aide:'Click a champion to place it. Click a champion on the board to set its stars, give it an emblem or move it. On a computer, you can also drag it.',
      deplacer:'Pick an empty hex to move it there, or another champion to edit that one.',
      roles:{tank:'tank', combattant:'fighter', AD:'physical damage', AP:'magic damage', 'AP/AD':'mixed damage'},
      liste:'Champion list: '
    },
    ko: {
      vers:'덱 빌더 열기', vide:'보드가 비어 있습니다. 챔피언을 눌러 배치하세요.',
      compte:function(n, c){ return n + '명 · 레벨 ' + c; },
      devant:'앞줄', vider:'보드 비우기', copier:'링크 복사', copie:'링크를 복사했습니다.', manuel:'이 링크를 복사하세요:',
      traits:'시너지', aucunTrait:'보드의 시너지가 여기에 표시됩니다.', unique:'고유 시너지',
      cherche:'챔피언 검색', tous:'모든 시너지', deb:'해금 챔피언만', rien:'일치하는 챔피언이 없습니다.',
      cout:function(c){ return c + '코스트'; },
      etoiles:'별', embleme:'상징', aucun:'없음', retirer:'보드에서 빼기', deuxCases:'두 칸을 차지합니다.',
      debloquer:'해금 조건: ', caseVide:function(r, c){ return '빈 칸, ' + r + '행 ' + c + '열'; },
      aide:'챔피언을 눌러 배치합니다. 보드의 챔피언을 누르면 별, 상징, 위치를 바꿀 수 있습니다. PC에서는 끌어서 놓을 수도 있습니다.',
      deplacer:'옮길 빈 칸을 고르거나, 다른 챔피언을 눌러 그 챔피언을 설정하세요.',
      roles:{tank:'탱커', combattant:'전사', AD:'물리 피해', AP:'마법 피해', 'AP/AD':'혼합 피해'},
      liste:'챔피언 목록: '
    },
    ja: {
      vers:'チームビルダーを開く', vide:'盤面は空です。チャンピオンをクリックして配置します。',
      compte:function(n, c){ return n + '体 · レベル' + c; },
      devant:'前列', vider:'盤面をクリア', copier:'リンクをコピー', copie:'リンクをコピーしました。', manuel:'このリンクをコピーしてください：',
      traits:'シナジー', aucunTrait:'盤面のシナジーがここに表示されます。', unique:'ユニークシナジー',
      cherche:'チャンピオンを検索', tous:'すべてのシナジー', deb:'アンロック対象のみ', rien:'該当するチャンピオンはいません。',
      cout:function(c){ return c + 'コスト'; },
      etoiles:'☆', embleme:'紋章', aucun:'なし', retirer:'盤面から外す', deuxCases:'2マスを占めます。',
      debloquer:'アンロック条件：', caseVide:function(r, c){ return '空きマス、' + r + '列目 ' + c + '番目'; },
      aide:'チャンピオンをクリックして配置します。盤面のチャンピオンをクリックすると、☆・紋章・位置を変更できます。PCではドラッグもできます。',
      deplacer:'移動先の空きマスを選ぶか、別のチャンピオンを選んでその設定を変更します。',
      roles:{tank:'タンク', combattant:'ファイター', AD:'物理ダメージ', AP:'魔法ダメージ', 'AP/AD':'混合ダメージ'},
      liste:'チャンピオン一覧：'
    },
    zh: {
      vers:'打开阵容模拟器', vide:'棋盘是空的。点击英雄即可放上棋盘。',
      compte:function(n, c){ return n + ' 名英雄 · ' + c + ' 级'; },
      devant:'前排', vider:'清空棋盘', copier:'复制链接', copie:'链接已复制。', manuel:'请复制此链接：',
      traits:'羁绊', aucunTrait:'棋盘上的羁绊会显示在这里。', unique:'独特羁绊',
      cherche:'搜索英雄', tous:'全部羁绊', deb:'只看可解锁英雄', rien:'没有符合条件的英雄。',
      cout:function(c){ return c + ' 费'; },
      etoiles:'星级', embleme:'纹章', aucun:'无', retirer:'移出棋盘', deuxCases:'占两个格子。',
      debloquer:'解锁条件：', caseVide:function(r, c){ return '空格，第 ' + r + ' 排第 ' + c + ' 列'; },
      aide:'点击英雄即可放上棋盘。点击棋盘上的英雄，可以调整星级、纹章和位置。电脑上也可以直接拖动。',
      deplacer:'选择一个空格把它移过去，或点击另一名英雄来调整那名英雄。',
      roles:{tank:'坦克', combattant:'战士', AD:'物理伤害', AP:'法术伤害', 'AP/AD':'混合伤害'},
      liste:'英雄列表：'
    }
  };
  var T = I[L] || I.en;

  var COLS = 7, LIGNES = 4, N = COLS * LIGNES;
  var ORDRE = [3, 2, 4, 1, 5, 0, 6];          // on remplit une rangée par le milieu
  var TEINTES = {prisme:0, or:1, argent:2, bronze:3, unique:4, inactif:5};
  var R = null, parId = {}, hexes = [], jetons = {};
  var plateau = [], choisi = -1, nomCompo = '', compoEnAttente = null;
  var filtre = {texte:'', trait:'', deb:false};
  for (var z = 0; z < N; z++) plateau.push(null);

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
  function slug(s){ return String(s).toLowerCase().replace(/[^a-z0-9]/g, ''); }
  function defiler(el){
    el.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block:'start'});
  }
  var CLE = '<svg class="cle" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10V7a5 5 0 0 1 9.6-1.9" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><rect x="4.5" y="10" width="15" height="11" rx="2" fill="currentColor"/></svg>';

  // ── Le comptage ──────────────────────────────────────────────────────────
  function compter(){
    var n = {}, vus = {};
    plateau.forEach(function(p){
      if (!p || vus[p.id]) return;
      vus[p.id] = 1;
      var tr = parId[p.id].traits.slice();
      if (p.embleme && tr.indexOf(p.embleme) < 0) tr.push(p.embleme);
      tr.forEach(function(x){
        var d = R.traits[x];
        if (d) n[x] = (n[x] || 0) + (d.compte === 'etoiles' ? p.etoiles : 1);
      });
    });
    return n;
  }
  function rang(x, k){
    var i = -1;
    R.traits[x].paliers.forEach(function(p, j){ if (p <= k) i = j; });
    return i;
  }
  function teinte(x, i){
    var d = R.traits[x], n = d.paliers.length;
    if (i < 0) return 'inactif';
    if (d.unique) return 'unique';
    if (i === n - 1) return n >= 4 ? 'prisme' : 'or';
    return ['bronze', 'argent', 'or'][Math.min(i, 2)];
  }
  function nb(){ return plateau.filter(Boolean).length; }
  function cases(){
    return plateau.reduce(function(s, p){ return s + (p ? (parId[p.id].cases || 1) : 0); }, 0);
  }
  function ou(id){
    for (var i = 0; i < N; i++) if (plateau[i] && plateau[i].id === id) return i;
    return -1;
  }

  // ── Poser, déplacer ──────────────────────────────────────────────────────
  function rangs(u, place){
    if (place === 'front') return [0, 1];
    if (place === 'porteur') return [3, 2];
    return (u.role === 'tank' || u.role === 'combattant') ? [0, 1] : [3, 2];
  }
  function libre(rs){
    for (var a = 0; a < rs.length; a++)
      for (var b = 0; b < COLS; b++){ var i = rs[a] * COLS + ORDRE[b]; if (!plateau[i]) return i; }
    for (var j = 0; j < N; j++) if (!plateau[j]) return j;
    return -1;
  }
  function poser(id, i, etoiles, place){
    var u = parId[id];
    if (!u) return -1;
    var deja = ou(id);
    if (i == null || i < 0){
      if (deja >= 0) return deja;
      i = libre(rangs(u, place));
      if (i < 0) return -1;
    }
    if (deja >= 0){ echanger(deja, i); return i; }
    var avant = plateau[i];
    plateau[i] = {id:id, etoiles:etoiles || 1, embleme:''};
    if (avant){
      var k = libre(rangs(parId[avant.id]));
      if (k >= 0) plateau[k] = avant;
    }
    return i;
  }
  function echanger(a, b){ var x = plateau[a]; plateau[a] = plateau[b]; plateau[b] = x; }
  function changer(){ nomCompo = ''; rendre(); }

  // ── Le lien ──────────────────────────────────────────────────────────────
  function code(){
    var l = [];
    plateau.forEach(function(p, i){
      if (p) l.push([p.id, i, p.etoiles].concat(p.embleme ? [slug(p.embleme)] : []).join('~'));
    });
    return l.join('_');
  }
  function lire(c){
    var emb = {};
    Object.keys(R.traits).forEach(function(x){ emb[slug(x)] = x; });
    String(c).split('_').forEach(function(e){
      var p = e.split('~'), i = parseInt(p[1], 10), s = parseInt(p[2], 10);
      if (!parId[p[0]] || !(i >= 0 && i < N) || plateau[i] || ou(p[0]) >= 0) return;
      plateau[i] = {id:p[0], etoiles:(s >= 1 && s <= 3) ? s : 1, embleme:(p[3] && emb[p[3]]) || ''};
    });
  }
  function copier(){
    var url = location.origin + location.pathname + '?b=' + encodeURIComponent(code()) + '#predictions';
    var msg = zone.querySelector('.bd-lien');
    try { history.replaceState(null, '', url); } catch (e) {}
    function montrer(){ msg.hidden = false; msg.textContent = T.copie; setTimeout(function(){ msg.hidden = true; }, 3000); }
    function manuel(){
      msg.hidden = false;
      msg.innerHTML = esc(T.manuel) + '<input type="text" readonly value="' + esc(url) + '">';
      var inp = msg.querySelector('input'); inp.focus(); inp.select();
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(montrer, manuel);
    else manuel();
  }

  // ── Une compo de l'onglet ────────────────────────────────────────────────
  function ouvrirCompo(c){
    if (!R){ compoEnAttente = c; return; }
    for (var i = 0; i < N; i++) plateau[i] = null;
    var noms = function(l){ return (l || []).map(function(u){ return slug(t(u.nom)); }); };
    var front = noms(c.front), porteurs = noms(c.porteurs);
    var pl = (c.plateau || []).slice().sort(function(a, b){
      var ra = front.indexOf(slug(t(a.nom))) >= 0 ? 0 : porteurs.indexOf(slug(t(a.nom))) >= 0 ? 1 : 2;
      var rb = front.indexOf(slug(t(b.nom))) >= 0 ? 0 : porteurs.indexOf(slug(t(b.nom))) >= 0 ? 1 : 2;
      return ra - rb;
    });
    pl.forEach(function(u){
      var id = slug(t(u.nom));
      poser(id, null, u.etoiles, front.indexOf(id) >= 0 ? 'front' : porteurs.indexOf(id) >= 0 ? 'porteur' : null);
    });
    choisi = -1;
    rendre();
    nomCompo = t(c.nom);
    rendreNiveau();
    defiler(zone);
  }

  // ── Le rendu ─────────────────────────────────────────────────────────────
  function squelette(){
    var opts = Object.keys(R.traits).sort(function(a, b){ return a.localeCompare(b); }).map(function(x){
      return '<option value="' + esc(x) + '">' + esc(x) + '</option>';
    }).join('');
    var rangees = '';
    for (var r = 0; r < LIGNES; r++){
      rangees += '<div class="bd-rangee' + (r % 2 ? ' decale' : '') + '">';
      for (var c = 0; c < COLS; c++) rangees += '<button type="button" class="hex" data-i="' + (r * COLS + c) + '"></button>';
      rangees += '</div>';
    }
    var parCout = {};
    R.unites.forEach(function(u){ (parCout[u.cout] = parCout[u.cout] || []).push(u); });
    var groupes = Object.keys(parCout).sort(function(a, b){ return a - b; }).map(function(k){
      return '<section class="bd-groupe" data-cout="' + k + '"><h4>' + esc(T.cout(+k)) + '</h4><div class="bd-jetons">' +
        parCout[k].map(function(u){
          var nom = u.court || u.nom, titre = u.nom + ' · ' + T.cout(u.cout) + ' · ' + u.traits.join(', ') + ' · ' + (T.roles[u.role] || u.role);
          if (u.cases === 2) titre += '\n' + T.deuxCases;
          if (u.deblocage) titre += '\n' + T.debloquer + t(u.deblocage);
          return '<button type="button" class="hex jeton k' + u.cout + (nom.length > 7 ? ' long' : '') + (u.deblocage ? ' deb' : '') +
            '" data-id="' + esc(u.id) + '" draggable="true" title="' + esc(titre) + '" aria-label="' + esc(titre) + '">' +
            '<span class="bd-nom">' + esc(nom) + '</span>' + (u.deblocage ? CLE : '') + '</button>';
        }).join('') + '</div></section>';
    }).join('');
    zone.querySelector('.bd-zone').innerHTML =
      '<div class="bd">' +
        '<div class="bd-gauche">' +
          '<div class="bd-barre"><p class="bd-niveau" role="status"></p><div class="bd-actions">' +
            '<button type="button" class="bd-btn" data-action="copier">' + esc(T.copier) + '</button>' +
            '<button type="button" class="bd-btn" data-action="vider">' + esc(T.vider) + '</button></div></div>' +
          '<p class="bd-lien" role="status" hidden></p>' +
          '<div class="bd-cadre"><p class="bd-devant">' + esc(T.devant) + '</p><div class="bd-plateau">' + rangees + '</div></div>' +
          '<p class="bd-aide"></p>' +
          '<div class="bd-choisi" hidden></div>' +
        '</div>' +
        '<aside class="bd-traits"><h3>' + esc(T.traits) + '</h3><ul></ul></aside>' +
      '</div>' +
      '<div class="bd-reserve">' +
        '<div class="bd-filtres">' +
          '<input type="search" class="bd-cherche" placeholder="' + esc(T.cherche) + '" aria-label="' + esc(T.cherche) + '">' +
          '<select class="bd-trait" aria-label="' + esc(T.tous) + '"><option value="">' + esc(T.tous) + '</option>' + opts + '</select>' +
          '<label class="bd-deb"><input type="checkbox"> ' + esc(T.deb) + '</label>' +
        '</div>' + groupes +
        '<p class="bd-rien" hidden>' + esc(T.rien) + '</p>' +
      '</div>' +
      '<p class="bd-note">' + esc(t(R.note)) + ' ' + esc(T.liste) + '<a href="' + esc(R.source.url) + '" rel="noopener">' + esc(R.source.titre) + '</a>.</p>';
    hexes = [].slice.call(zone.querySelectorAll('.bd-plateau .hex'));
    [].forEach.call(zone.querySelectorAll('.jeton'), function(j){ jetons[j.dataset.id] = j; });
  }

  function rendreNiveau(){
    var n = nb();
    zone.querySelector('.bd-niveau').textContent = n ? T.compte(n, cases()) + (nomCompo ? ' · ' + nomCompo : '') : T.vide;
  }

  function rendre(){
    var foc = document.activeElement && zone.contains(document.activeElement) ? document.activeElement.getAttribute('data-focus') : null;
    rendreNiveau();
    zone.querySelector('.bd-plateau').classList.toggle('deplace', choisi >= 0);
    hexes.forEach(function(b, i){
      var p = plateau[i];
      b.classList.remove('survol');
      if (!p){
        b.className = 'hex';
        b.innerHTML = '';
        b.draggable = false;
        b.removeAttribute('aria-pressed');
        b.setAttribute('aria-label', T.caseVide(Math.floor(i / COLS) + 1, i % COLS + 1));
        return;
      }
      var u = parId[p.id], nom = u.court || u.nom;
      b.className = 'hex unite k' + u.cout + (nom.length > 7 ? ' long' : '') + (choisi === i ? ' choisi' : '');
      b.innerHTML = '<span class="bd-etoiles" aria-hidden="true">' + new Array(p.etoiles + 1).join('★') + '</span>' +
        '<span class="bd-nom">' + esc(nom) + '</span>' + (p.embleme ? '<span class="bd-emb" aria-hidden="true">◆</span>' : '');
      b.draggable = true;
      b.setAttribute('aria-pressed', choisi === i ? 'true' : 'false');
      b.setAttribute('aria-label', u.nom + ', ' + p.etoiles + ' ★' + (p.embleme ? ', ' + T.embleme + ' ' + p.embleme : ''));
    });
    zone.querySelector('.bd-aide').textContent = choisi >= 0 ? T.deplacer : T.aide;
    rendreTraits();
    rendreChoisi();
    rendreReserve();
    if (foc){ var f = zone.querySelector('[data-focus="' + foc + '"]'); if (f) f.focus(); }
  }

  function rendreTraits(){
    var n = compter();
    var l = Object.keys(n).map(function(x){ var i = rang(x, n[x]); return {x:x, k:n[x], i:i, te:teinte(x, i)}; });
    l.sort(function(a, b){ return TEINTES[a.te] - TEINTES[b.te] || b.k - a.k || a.x.localeCompare(b.x); });
    zone.querySelector('.bd-traits ul').innerHTML = l.length ? l.map(function(e){
      var d = R.traits[e.x];
      var ps = d.unique ? esc(T.unique) : d.paliers.map(function(p, j){ return j === e.i ? '<b>' + p + '</b>' : String(p); }).join(' · ');
      return '<li><button type="button" class="bd-t t-' + e.te + '" data-trait="' + esc(e.x) + '" aria-pressed="' + (filtre.trait === e.x) + '">' +
        '<span class="bd-k">' + e.k + '</span><span class="bd-tn">' + esc(e.x) + (d.note ? '<small>' + esc(t(d.note)) + '</small>' : '') + '</span>' +
        '<span class="bd-ps">' + ps + '</span></button></li>';
    }).join('') : '<li class="bd-vide">' + esc(T.aucunTrait) + '</li>';
  }

  function rendreChoisi(){
    var box = zone.querySelector('.bd-choisi');
    var p = choisi >= 0 ? plateau[choisi] : null;
    if (!p){ box.hidden = true; box.innerHTML = ''; return; }
    var u = parId[p.id];
    var embs = Object.keys(R.traits).filter(function(x){ return R.traits[x].embleme && u.traits.indexOf(x) < 0; }).sort();
    box.hidden = false;
    box.innerHTML =
      '<div class="bd-ch-tete"><span class="cout c' + u.cout + '">' + u.cout + '</span><strong>' + esc(u.nom) + '</strong>' +
        '<span class="faible">' + esc(T.roles[u.role] || u.role) + '</span></div>' +
      '<p>' + esc(u.traits.join(' · ')) + '</p>' +
      (u.cases === 2 ? '<p>' + esc(T.deuxCases) + '</p>' : '') +
      (u.deblocage ? '<p class="bd-ch-deb">' + esc(T.debloquer + t(u.deblocage)) + '</p>' : '') +
      '<div class="bd-ch-ctrl">' +
        '<div class="bd-ch-etoiles" role="group" aria-label="' + esc(T.etoiles) + '">' + [1, 2, 3].map(function(s){
          return '<button type="button" class="bd-btn" data-etoiles="' + s + '" data-focus="e' + s + '" aria-pressed="' + (p.etoiles === s) + '">' + new Array(s + 1).join('★') + '</button>';
        }).join('') + '</div>' +
        '<label class="bd-ch-emb">' + esc(T.embleme) + ' <select class="bd-emblemes" data-focus="emb"><option value="">' + esc(T.aucun) + '</option>' +
          embs.map(function(x){ return '<option value="' + esc(x) + '"' + (p.embleme === x ? ' selected' : '') + '>' + esc(x) + ' (' + esc(t(R.traits[x].embleme)) + ')</option>'; }).join('') +
        '</select></label>' +
        '<button type="button" class="bd-btn" data-action="retirer" data-focus="ret">' + esc(T.retirer) + '</button>' +
      '</div>';
  }

  function rendreReserve(){
    var q = filtre.texte.trim().toLowerCase(), visibles = 0;
    R.unites.forEach(function(u){
      var j = jetons[u.id];
      var ok = (!q || u.nom.toLowerCase().indexOf(q) >= 0 || (u.court || '').toLowerCase().indexOf(q) >= 0) &&
        (!filtre.trait || u.traits.indexOf(filtre.trait) >= 0) && (!filtre.deb || !!u.deblocage);
      j.hidden = !ok;
      j.classList.toggle('pose', ou(u.id) >= 0);
      if (ok) visibles++;
    });
    [].forEach.call(zone.querySelectorAll('.bd-groupe'), function(g){
      g.hidden = !g.querySelector('.jeton:not([hidden])');
    });
    zone.querySelector('.bd-rien').hidden = visibles > 0;
    var sel = zone.querySelector('.bd-trait');
    if (sel.value !== filtre.trait) sel.value = filtre.trait;
  }

  // ── Les gestes ───────────────────────────────────────────────────────────
  // Un champion choisi va sur la case vide qu'on touche ensuite ; toucher un
  // autre champion le choisit à son tour (l'échange se fait en glissant).
  function clicHex(i){
    if (choisi >= 0 && !plateau[i]){ echanger(choisi, i); choisi = -1; rendre(); return; }
    if (plateau[i]){ choisi = (i === choisi) ? -1 : i; rendre(); }
  }

  function brancher(){
    zone.addEventListener('click', function(e){
      var b = e.target.closest('button');
      if (!b || !zone.contains(b)) return;
      var a = b.getAttribute('data-action');
      if (a === 'vider'){ for (var i = 0; i < N; i++) plateau[i] = null; choisi = -1; changer(); return; }
      if (a === 'copier'){ copier(); return; }
      if (a === 'retirer' && choisi >= 0){ var h = hexes[choisi]; plateau[choisi] = null; choisi = -1; changer(); h.focus(); return; }
      if (b.hasAttribute('data-etoiles') && choisi >= 0){ plateau[choisi].etoiles = +b.getAttribute('data-etoiles'); changer(); return; }
      if (b.hasAttribute('data-trait')){
        var x = b.getAttribute('data-trait');
        filtre.trait = filtre.trait === x ? '' : x;
        rendreTraits(); rendreReserve();
        return;
      }
      if (b.classList.contains('jeton')){
        var id = b.getAttribute('data-id'), k = ou(id);
        if (k >= 0){ choisi = k; rendre(); return; }
        poser(id); changer();
        return;
      }
      if (b.hasAttribute('data-i')) clicHex(+b.getAttribute('data-i'));
    });
    zone.addEventListener('change', function(e){
      var el = e.target;
      if (el.classList.contains('bd-emblemes') && choisi >= 0){ plateau[choisi].embleme = el.value; changer(); }
      else if (el.classList.contains('bd-trait')){ filtre.trait = el.value; rendreTraits(); rendreReserve(); }
      else if (el.closest('.bd-deb')){ filtre.deb = el.checked; rendreReserve(); }
    });
    zone.addEventListener('input', function(e){
      if (e.target.classList.contains('bd-cherche')){ filtre.texte = e.target.value; rendreReserve(); }
    });
    zone.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && choisi >= 0){ var h = hexes[choisi]; choisi = -1; rendre(); h.focus(); }
      var i = e.target.getAttribute && e.target.getAttribute('data-i');
      if ((e.key === 'Delete' || e.key === 'Backspace') && i != null && plateau[+i]){
        e.preventDefault(); plateau[+i] = null; choisi = -1; changer();
      }
    });
    // Glisser-déposer, sur ordinateur. Au doigt, les clics font la même chose.
    zone.addEventListener('dragstart', function(e){
      var b = e.target.closest && e.target.closest('.jeton, .hex.unite');
      if (!b) return;
      e.dataTransfer.setData('text/plain', b.classList.contains('jeton') ? 'u:' + b.getAttribute('data-id') : 'h:' + b.getAttribute('data-i'));
      e.dataTransfer.effectAllowed = 'move';
    });
    zone.addEventListener('dragover', function(e){
      var h = e.target.closest && e.target.closest('.bd-plateau .hex, .bd-reserve');
      if (!h) return;
      e.preventDefault();
      if (h.classList.contains('hex')){
        hexes.forEach(function(x){ x.classList.toggle('survol', x === h); });
      }
    });
    zone.addEventListener('dragleave', function(e){
      var h = e.target.closest && e.target.closest('.bd-plateau .hex');
      if (h) h.classList.remove('survol');
    });
    zone.addEventListener('drop', function(e){
      var d = e.dataTransfer.getData('text/plain') || '';
      var h = e.target.closest && e.target.closest('.bd-plateau .hex');
      e.preventDefault();
      if (h){
        var i = +h.getAttribute('data-i');
        if (d.indexOf('u:') === 0) poser(d.slice(2), i);
        else if (d.indexOf('h:') === 0) echanger(+d.slice(2), i);
        choisi = -1; changer();
      } else if (e.target.closest && e.target.closest('.bd-reserve') && d.indexOf('h:') === 0){
        plateau[+d.slice(2)] = null; choisi = -1; changer();
      }
    });
    zone.addEventListener('dragend', function(){ hexes.forEach(function(x){ x.classList.remove('survol'); }); });
  }

  // Le bouton « Ouvrir dans le builder » des fiches.
  sec.addEventListener('click', function(e){
    var b = e.target.closest && e.target.closest('.ouvrir-builder');
    if (!b) return;
    var d = sec._predictions, id = b.getAttribute('data-compo');
    var c = d && (d.compos || []).filter(function(x){ return x.id === id; })[0];
    if (c) ouvrirCompo(c);
  });

  // Le lien vers le builder, en tête de l'onglet. Il ne change pas l'ancre.
  var tete = sec.querySelector('.pr-tete');
  if (tete){
    var p = document.createElement('p'), a = document.createElement('a');
    a.className = 'pr-vers-builder'; a.href = '#builder'; a.textContent = T.vers;
    a.addEventListener('click', function(ev){ ev.preventDefault(); defiler(zone); });
    p.appendChild(a); tete.appendChild(p);
  }

  fetch(zone.dataset.unites, {cache: 'no-cache'})
    .then(function(r){ if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function(d){
      R = d;
      d.unites.forEach(function(u){ parId[u.id] = u; });
      squelette();
      brancher();
      var b = new URLSearchParams(location.search).get('b');
      if (b) lire(b);
      rendre();
      if (compoEnAttente){ var c = compoEnAttente; compoEnAttente = null; ouvrirCompo(c); }
      else if (b && location.hash === '#predictions') setTimeout(function(){ defiler(zone); }, 300);
    })
    .catch(function(){ /* sans la liste, le builder reste fermé : le texte d'accueil suffit */ });
})();
