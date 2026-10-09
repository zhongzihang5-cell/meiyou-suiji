const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('../input-records-model.js');
const source = text => ({id:'receipt',kind:'input-source',originalText:text,time:'09:30',voice:{seconds:12}});
const extract = (text,mode='育儿') => M.extract(source(text),mode,[]);

test('one input links three independent records across two babies without using notes',()=>{
  const text='小豆苗喝了130毫升配方奶，顺便换了一片尿布，小豆芽喝了110毫升配方奶';
  const rows=extract(text);
  assert.deepEqual(rows.map(r=>[r.babyName,r.feedType,r.value]),[['小豆苗','配方奶','130ml'],['小豆苗','换尿布',''],['小豆芽','配方奶','110ml']]);
  assert.equal(new Set(rows.map(r=>r.id)).size,3);
  rows.forEach(r=>{assert.equal(r.inputId,'receipt');assert.equal(r.inputSource.text,text);assert.equal(r.noteText,'');assert.equal(r.inputSource.voice.seconds,12);});
  assert.equal(rows[1].diaperState,'');
  assert.equal(rows[1].text,'换尿布');
});
test('all twelve baby shortcut types produce usable fields',()=>{
  const cases=[['配方奶','配方奶120ml'],['瓶喂母乳','瓶喂母乳90ml'],['母乳','母乳左10分钟，右8分钟'],['吸奶','我吸奶80ml'],['换尿布','换尿布嘘嘘'],['睡眠','睡了2小时10分钟'],['喝水','喝水50ml'],['辅食','吃了辅食南瓜米粉20克'],['营养补剂','营养补剂维生素D3，1粒'],['洗澡','洗澡12分钟'],['玩耍','玩耍30分钟'],['游泳','游泳20分钟']];
  cases.forEach(([type,text])=>{const rows=extract(text);assert.equal(rows.length,1,text);assert.equal(rows[0].feedType,type);assert.ok(rows[0].value);});
  const breast=extract('母乳左10分钟，右8分钟')[0];
  assert.deepEqual([breast.leftMinutes,breast.rightMinutes,breast.durationMinutes],[10,8,18]);
  assert.equal(extract('睡了2小时10分钟')[0].elapsedSeconds,7800);
});
test('missing numeric details and irrelevant input do not invent a result',()=>{
  assert.deepEqual(extract('给宝宝喂配方奶'),[]);
  assert.deepEqual(extract('今天风很大'),[]);
});
test('period mode and mixed dates preserve per-record day and time',()=>{
  const rows=extract('昨天15:20来了姨妈，今天08:30头痛，心情烦躁','经期');
  assert.equal(rows.length,3);
  assert.deepEqual(rows.map(r=>[r.dateOffset,r.time]),[[1,'15:20'],[0,'08:30'],[0,'08:30']]);
  assert.equal(rows[0].primary.kind,'period');
  assert.equal(rows[1].primary.symptomValue,'头痛');
  assert.deepEqual(extract('配方奶120ml','经期'),[]);
});
test('grouping associates results across days; changing scheme never changes source data',()=>{
  const s=source('昨天15:20来了姨妈，今天08:30头痛');
  const rows=M.extract(s,'经期',[]);
  const blocks=[{type:'day',id:'yesterday',items:[rows[0]]},{type:'day',id:'today',items:[s,rows[1]]}];
  const before=JSON.stringify(blocks);
  const grouped=M.project(blocks,'grouped',false);
  assert.equal(M.all(grouped).length,1);
  assert.equal(M.all(grouped)[0].relatedRecords.length,2);
  assert.equal(M.all(M.project(blocks,'independent',false)).length,3);
  assert.equal(JSON.stringify(blocks),before);
});
test('family projection strips private original data in both display schemes',()=>{
  const s=source('宝宝配方奶120ml');const row=extract(s.originalText)[0];
  const blocks=[{type:'day',items:[s,{...row,voiceQuote:'private legacy',voice:s.voice}]}];
  for(const scheme of ['independent','grouped']){
    const rows=M.all(M.project(blocks,scheme,true));
    assert.equal(rows.length,1);assert.equal(rows[0].value,'120ml');
    for(const key of ['inputSource','voiceQuote','voice'])assert.equal(key in rows[0],false);
    assert.equal(M.privateSource(rows[0]),null);
  }
  assert.equal(M.privateSource({...row,creatorId:'family'}),null);
});
test('deleting one result leaves original, sibling and updated tags association',()=>{
  const s=source('宝宝配方奶120ml，换尿布嘘嘘');const rows=extract(s.originalText);
  const blocks=[{type:'day',items:[s,...rows].filter(r=>r.id!==rows[0].id)}];
  const projected=M.all(M.project(blocks,'grouped',false));
  assert.equal(projected.length,1);assert.equal(projected[0].originalText,s.originalText);
  assert.equal(projected[0].relatedRecords.length,1);assert.equal(projected[0].relatedRecords[0].feedType,'换尿布');
});
test('failed and empty receipts persist without fabricating child cards',()=>{
  for(const status of ['processing','failed','done']){
    const s={...source('没有可识别的记录'),status};
    const rows=M.all(M.project([{type:'day',items:[s]}],'grouped',false));
    assert.equal(rows.length,1);assert.equal(rows[0].status,status);assert.deepEqual(rows[0].relatedRecords,[]);
  }
});


test('subject tags keep each baby and its own unique record labels on one row',()=>{
  const rows=extract('小豆芽配方奶100ml，换尿布嘘嘘，小豆苗配方奶120ml，小豆芽配方奶90ml');
  assert.deepEqual(M.subjectTags(rows),[
    {subject:'小豆芽',labels:['配方奶','换尿布']},
    {subject:'小豆苗',labels:['配方奶']}
  ]);
});
test('record provenance retains input date and time independently from event time',()=>{
  const receipt={...source('昨天08:10小豆苗配方奶120ml'),date:'2026-09-22'};
  const row=M.extract(receipt,'育儿',[])[0];
  assert.equal(row.time,'08:10');assert.equal(row.inputSource.time,'09:30');assert.equal(row.inputSource.date,'2026-09-22');
});

test('a multi-baby input selects exactly one existing feedback module',()=>{
  const rows=extract('小豆苗配方奶130ml，换尿布嘘嘘，小豆芽配方奶110ml');
  const feedback=M.feedbackRecord(rows);
  assert.equal(feedback.feedType,'配方奶');assert.equal(feedback.diaperFeedback,false);assert.equal(feedback.sleepFeedback,false);
  assert.equal(M.feedbackRecord(extract('换尿布嘘嘘，睡了30分钟')).diaperFeedback,true);
  assert.equal(M.feedbackRecord(extract('睡了30分钟')).sleepFeedback,true);
  assert.equal(M.feedbackRecord(extract('喝水50ml')),null);
});
test('ambiguous milk requires both type and baby without guessing',()=>{
  const rows=extract('喂了100ml奶');
  assert.equal(rows.length,1);
  assert.equal(rows[0].value,'100ml');
  assert.equal(rows[0].feedType,'奶');
  assert.equal(rows[0].babyName,'');
  assert.deepEqual(rows[0].confirmationFields,['babyName','feedType']);
  assert.deepEqual(extract('小豆芽喝了100ml奶')[0].confirmationFields,['feedType']);
  assert.deepEqual(extract('喂了100ml配方奶')[0].confirmationFields,['babyName']);
  assert.deepEqual(extract('小豆芽喝了100ml配方奶')[0].confirmationFields,[]);
});
