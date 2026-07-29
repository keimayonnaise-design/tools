/* =========================================================
   Diamond⭐︎ — 試合シミュレータ（実践編の正解を"生成"する）
   ---------------------------------------------------------
   仕様書 §6-1: 正解シート・検算の答え・盤面は、すべてここが
   シナリオのイベント列を再生して導出する。人間（AI執筆者）が
   正解を直接書く場所を作らない＝転記ミスの経路を構造的に消す。

   入力（シナリオ）:
     plays: [
       // 打席
       { say:'…', batter:3, pitches:['B','W','X'],
         r:'out'|'hit'|'bb'|'db'|'k'|'kl'|'e'|'fc'|'sh'|'sf',
         at:'6-3',            // 処理した野手（記号系は不要）
         trace:'ground'|'fly'|'liner',
         bases:2,             // r:'hit' のとき到達塁（1〜4）＝赤い斜線の本数
         dot:'under',         // 打球の落下位置 under=野手の前／over=越えた／side=線
         ih:true,             // 内野安打（数字を半円で囲む）
         bh:true,             // バントヒット（半円＋BH）
         adv:{1:2, 2:4},      // 走者の進塁 {いまの塁: 行き先}（4=本塁）
         outsOn:{2:'8-4'}     // 走者がアウト {いまの塁: 経路}
       },
       // 打席の途中の走者の動き
       { say:'…', run:'sb'|'wp'|'pb'|'bk', adv:{1:2} }
       { say:'…', run:'cs', from:1, at:'2-4' }
     ]

   出力:
     { innings:[ {no, cells:{打順:glyph}, order:[], outs, runs, lob, batters,
                  checks:[…見比べの確認項目…] } ],
       pitches:{total, byBatter}, timeline:[…1プレーずつ…] }
   ========================================================= */
(function (root) {
  'use strict';

  // 進塁の理由に「打者の打順」を書く結果か（＝打撃で進めた）
  var BY_BATTING = {hit:1, out:1, bb:1, db:1, sh:1, sf:1, fc:1, e:1, k:1, kl:1};
  // 打点がつかない結果（失策・野選での得点。教材 詳説A-3）
  var NO_RBI = {e:1, fc:1};

  // 打席結果ごとのペン（色）。色そのものが「打数に入るか・誰の手柄か」を表す
  //   赤＝安打と得点（打者の手柄）／青＝四死球・犠打・犠飛（打数に入らない）／黒＝それ以外
  var KIND = {
    hit:'hit',
    bb:'walk', db:'walk',
    sh:'sac', sf:'sac'
  };

  function newCell(){
    return {result:null, hit:0, marks:{}, center:null, outAt:null,
      pitches:[], kind:null};
  }

  /* 安打の点（・）は「打球がどこへ飛んだか」を表す。何塁打かではない
     （何塁打かは斜線の本数。下＝野手の前／上＝越えた／横＝ライン際）。
     どこへ飛んだかはシナリオの読み上げ文が決めることなので、
     塁数から機械的に決めず、シナリオの dot をそのまま使う。 */
  function resultOf(p){
    switch(p.r){
      case 'out':  return {text:p.at, trace:p.trace || null};
      case 'hit':  return {text:p.at, dot:p.dot || null,
                           half:!!(p.ih || p.bh), bh:!!p.bh};
      case 'bb':   return {text:'B'};
      case 'db':   return {text:'DB'};
      case 'k':    return {text:'K'};
      case 'kl':   return {text:'SO'};
      case 'e':    return {text:p.at};          // 経路の中に E を入れて渡す（例 6E-3）
      case 'fc':   return {text:p.at + 'FC'};
      case 'sh':   return {text:p.at, box:'square'};
      case 'sf':   return {text:p.at, box:'triangle'};
      default:     return {text:p.at || '?'};
    }
  }
  // 打者が塁に出る結果か
  function reachesBase(r){
    return r === 'hit' || r === 'bb' || r === 'db' || r === 'e' || r === 'fc';
  }

  function simulate(sc){
    var innings = [];
    var timeline = [];
    var pitchTotal = 0;
    var byBatter = {};

    var inning = null;
    function openInning(no){
      inning = {no:no, cells:{}, order:[], outs:0, runs:0, lob:0, batters:0,
        bases:{1:null, 2:null, 3:null}, checks:[]};
      innings.push(inning);
    }
    openInning(1);

    function cell(no){
      if(!inning.cells[no]) inning.cells[no] = newCell();
      return inning.cells[no];
    }

    /* 走者を動かす。奥（本塁に近い方）から処理する＝教材ドリル11と同じ順。
       早稲田式では、走者としての進塁で斜線は増やさない。
       到達した塁の区画に (打順番号)、通過しただけの塁には ↰ を書く。 */
    function moveRunners(adv, reason, rbiBy){
      if(!adv) return;
      Object.keys(adv).map(Number).sort(function(a,b){ return b-a; }).forEach(function(from){
        var to = adv[from];
        var who = inning.bases[from];
        if(who === null || who === undefined) return;
        inning.bases[from] = null;
        var c = cell(who);
        // 通過しただけの塁に矢印（打者が得た塁より先で、到達点より手前）
        for(var mid = Math.max(from + 1, (c.hit || 0) + 1); mid < to; mid++){
          if(mid >= 2 && !c.marks[mid]) c.marks[mid] = '↰';
        }
        if(to >= 4){
          inning.runs++;
          c.center = {run:true};
          c.marks[4] = (rbiBy !== null && rbiBy !== undefined)
            ? {circle:String(rbiBy)} : reason;
        } else {
          inning.bases[to] = who;
          if(to >= 2) c.marks[to] = reason;
        }
      });
    }

    function runnerOut(from, path){
      var who = inning.bases[from];
      if(who === null || who === undefined) return;
      inning.bases[from] = null;
      inning.outs++;
      var c = cell(who);
      c.outAt = {base: Math.min(4, from + 1), text: path};
      c.center = {out: inning.outs};
    }

    (sc.plays || []).forEach(function(p, idx){
      // 投球数は、打席の途中で起きた走者の動き（盗塁・暴投）でも数える
      var np0 = (p.pitches || []).length;
      if(np0){
        pitchTotal += np0;
        var owner = p.batter;
        if(owner) byBatter[owner] = (byBatter[owner] || 0) + np0;
      }

      // ---- 走者だけが動くプレー ----
      if(p.run){
        if(p.run === 'cs'){
          runnerOut(p.from, p.at);
        } else {
          var sym = {sb:'S', wp:'WP', pb:'PB', bk:'BK'}[p.run] || p.run.toUpperCase();
          moveRunners(p.adv, sym, null);
        }
        timeline.push({say:p.say, outs:inning.outs, bases:snapshot(), inning:inning.no, kind:'run'});
        return;
      }

      // ---- 打席 ----
      var no = p.batter;
      inning.batters++;
      inning.order.push(no);
      var c = cell(no);
      c.result = resultOf(p);
      c.kind = KIND[p.r] || null;                 // ペンの決定に使う
      c.pitches = (c.pitches || []).concat(p.pitches || []);

      // 打者の結果を先に確定させ、そのあと走者（表示上は奥からだが、
      // 状態としては打者の到達塁と走者の行き先が独立して決まる）
      var rbiBy = (BY_BATTING[p.r] && !NO_RBI[p.r]) ? no : null;
      var reason = BY_BATTING[p.r] ? '(' + no + ')' : null;

      // 走者のアウト（併殺の前半など）
      if(p.outsOn){
        Object.keys(p.outsOn).map(Number).forEach(function(from){
          runnerOut(from, p.outsOn[from]);
        });
      }
      // 走者の進塁
      moveRunners(p.adv, reason, rbiBy);

      // 打者自身。赤い斜線を引くのは「安打で得た塁」の分だけ
      if(reachesBase(p.r)){
        var b = (p.r === 'hit') ? (p.bases || 1) : 1;
        if(p.r === 'hit') c.hit = b;
        if(b >= 4){
          inning.runs++;
          c.center = {run:true};
          c.marks[4] = {circle:String(no)};        // 本塁打は自分の打点
        } else {
          inning.bases[b] = no;
        }
      } else {
        // 打者アウト（三振・凡打・犠打犠飛）
        inning.outs++;
        c.center = {out: inning.outs};
      }

      timeline.push({say:p.say, outs:inning.outs, bases:snapshot(), inning:inning.no,
        kind:'pa', batter:no, pitches:p.pitches || []});

      // 3アウトでイニングを閉じる
      if(inning.outs >= 3) closeInning();
    });

    function snapshot(){
      return {1:inning.bases[1], 2:inning.bases[2], 3:inning.bases[3]};
    }

    function closeInning(){
      // 塁に残った走者は残塁（中央に○）
      [1,2,3].forEach(function(b){
        var who = inning.bases[b];
        if(who !== null && who !== undefined){
          inning.lob++;
          var c = cell(who);
          if(!c.center) c.center = {lob:true};
        }
      });
      inning.checks = buildChecks(inning);
      delete inning.bases;
      if(innings.length < (sc.innings || 1)) openInning(inning.no + 1);
    }

    // 最後のイニングが3アウトで終わっていない場合も締める（データ不備の検出用）
    if(inning && inning.bases) closeInning();

    return {
      scenario: sc,
      innings: innings,
      pitches: {total: pitchTotal, byBatter: byBatter},
      timeline: timeline
    };
  }

  /* 見比べチェックリストを、計算されたマスから自動生成する。
     手で書くと盤面とズレるので、必ずここから作る。 */
  var TRACE_JP = {fly:'上に弧＝フライ', liner:'上に直線＝ライナー'};
  var DOT_JP = {under:'数字の下に点＝その野手の前', over:'数字の上に点＝その野手を越えた',
    side:'数字の横に点＝そちらのライン際'};
  var PEN_JP = {hit:'赤', walk:'青', sac:'青'};
  var PITCH_JP = {B:'●', S:'×', W:'⊗', F:'△', X:'□'};

  function buildChecks(inn){
    var out = [];
    inn.order.forEach(function(no){
      var c = inn.cells[no];
      if(!c) return;
      var parts = [];
      var penJP = PEN_JP[c.kind] || '黒';
      if(c.pitches && c.pitches.length){
        parts.push('左の欄に ' + c.pitches.map(function(p){ return PITCH_JP[p] || p; }).join('') +
          '（' + c.pitches.length + '球）');
      }
      if(c.result){
        var s = '右下に ' + c.result.text + '（' + penJP + '）';
        if(c.result.trace) s += '＋' + TRACE_JP[c.result.trace];
        if(c.result.dot) s += '＋' + DOT_JP[c.result.dot];
        if(c.result.half) s += '＋斜線を弦にした半円で数字を囲む（内野安打）';
        if(c.result.bh) s += '＋斜線の上に BH（バントヒット）';
        if(c.result.box === 'square') s += '＋青い四角で囲む';
        if(c.result.box === 'triangle') s += '＋青い三角で囲む';
        parts.push(s);
      }
      if(c.hit > 0) parts.push('赤い斜線 ' + c.hit + '本（安打で得た塁の分だけ）');
      Object.keys(c.marks).map(Number).sort().forEach(function(b){
        var r = c.marks[b];
        var where = {2:'二塁', 3:'三塁', 4:'本塁'}[b] || (b + '塁');
        if(r && r.circle) parts.push(where + 'の区画に 丸囲みの' + r.circle + '（打点）');
        else if(r === '↰') parts.push(where + 'の区画に ↰（通過しただけ）');
        else if(r) parts.push(where + 'の区画に ' + r);
      });
      if(c.outAt) parts.push({2:'二塁',3:'三塁',4:'本塁'}[c.outAt.base] + 'の区画に ' + c.outAt.text + '（アウトの経路）');
      if(c.center){
        if(c.center.out) parts.push('中央に ' + ['','Ⅰ','Ⅱ','Ⅲ'][c.center.out]);
        else if(c.center.run) parts.push('中央に ●（得点・赤）');
        else if(c.center.lob) parts.push('中央に ℓ（残塁）');
      }
      out.push({batter:no, text: no + '番のマス: ' + parts.join(' ／ ')});
    });
    out.push({batter:null, text:'イニングの締め: 得点 ' + inn.runs + ' ／ 残塁 ' + inn.lob +
      ' ／ 3アウト目の下に区切り線'});
    return out;
  }

  root.DIAMOND_SIM = {simulate: simulate};
})(typeof window !== 'undefined' ? window : globalThis);
