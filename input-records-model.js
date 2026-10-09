/* Local prototype extraction. No remote AI or audio upload is performed. */
(function(root){
  const all = blocks => blocks.flatMap(b=>b.type === 'day' ? (b.items || b.entries || []) : []);
  const title = r => r.feedType || r.primary?.recordLabel || r.primary?.periodLabel || r.primary?.symptomLabel || r.recordName || '记录';
  const value = r => r.value || r.primary?.recordValue || r.primary?.symptomValue || '';
  const subject = r => r.babyName || r.owner || '自己';
  const privateSource = r => !r.readOnly && r.creatorId !== 'family' && r.isOwnRecord !== false ? r.inputSource : null;
  function extract(source, mode, catalog){
    const records = [];
    const raw = source.originalText;
    let owner = '';
    let dateOffset = /昨天|昨晚/.test(raw) ? 1 : 0;
    let recordTime = source.time;
    const add = (data)=>{
      const id = source.id+'-r'+records.length;
      records.push({...data,id,time:recordTime,dateOffset,inputId:source.id,inputSource:{id:source.id,text:raw,voice:source.voice,time:source.time,date:source.date},noteText:'',creatorId:'self',isOwnRecord:true,isNew:false});
    };
    const personal = (type,label,val,icon=type)=>add({kind:'record-group',primary:{kind:'daily-record',time:recordTime,recordType:type,recordLabel:label,recordValue:val,recordDetail:val,text:label+'：'+val,icon,tags:[]}});
    // Keep left/right feeding and food lists together; split only when the next clause starts another event.
    const parts = raw.split(/[。；;\n]|[，,](?=\s*(?:小豆苗|小豆芽|宝宝|我|今天|昨天|昨晚|刚刚|顺便|还|换|喝|喂|睡|心情|体重|头|左|右))/).filter(Boolean);
    for(let i=0;i<parts.length;i++){
      let part = parts[i].trim();
      const named = part.match(/小豆苗|小豆芽/);
      if(named) owner = named[0];
      if(/今天/.test(part)) dateOffset=0;
      if(/昨天|昨晚/.test(part)) dateOffset=1;
      const clock = part.match(/(\d{1,2})[:：](\d{2})/);
      const hour = part.match(/(上午|下午|晚上|凌晨|早上)?\s*(\d{1,2})点(?:(\d{1,2})分)?/);
      if(clock) recordTime=clock[1].padStart(2,'0')+':'+clock[2];
      else if(hour){let h=Number(hour[2]);if(/下午|晚上/.test(hour[1]||'')&&h<12)h+=12;recordTime=String(h).padStart(2,'0')+':'+String(hour[3]||0).padStart(2,'0');}
      let type = null;
      if(mode==='育儿' && (!/^\s*(我|自己|妈妈)/.test(part)||/吸奶/.test(part))){
        type = /瓶喂母乳/.test(part)?'瓶喂母乳':/吸奶/.test(part)?'吸奶':/配方奶|奶粉/.test(part)?'配方奶':/母乳|左边?喂|右边?喂/.test(part)?'母乳':/尿布|尿不湿/.test(part)?'换尿布':/睡了|睡眠|睡觉/.test(part)?'睡眠':/辅食|米粉|果泥/.test(part)?'辅食':/营养补剂|维生素|益生菌|DHA/.test(part)?'营养补剂':/洗澡/.test(part)?'洗澡':/玩耍|玩了/.test(part)?'玩耍':/游泳/.test(part)?'游泳':/喝.*水|喝水/.test(part)?'喝水':null;
      }
      if(!type && mode==='育儿' && /奶/.test(part) && /\d+\s*(?:ml|毫升)/i.test(part)) type='奶';
      if(type){
        if(type==='母乳' && /左/.test(part) && parts[i+1] && /右/.test(parts[i+1])) part += '，'+parts[++i];
        const item = catalog.find(x=>x.label===type);
        const volume = part.match(/(\d+(?:\.\d+)?)\s*(?:毫升|ml)/i);
        const hours = Number(part.match(/(\d+)\s*(?:小时|个小时)/)?.[1] || 0);
        const mins = Number(part.match(/(\d+)\s*分钟/)?.[1] || 0);
        const left = Number(part.match(/左[^\d，]*?(\d+)\s*分钟/)?.[1] || 0);
        const right = Number(part.match(/右[^\d，]*?(\d+)\s*分钟/)?.[1] || 0);
        const duration = type==='母乳' && (left||right) ? left+right : hours*60+mins;
        let result='';
        const extra={};
        if(['奶','配方奶','瓶喂母乳','吸奶','喝水'].includes(type)) result=volume?volume[1]+'ml':'';
        else if(['母乳','睡眠','洗澡','玩耍','游泳'].includes(type)){
          result=duration?duration+'分钟':'';
          Object.assign(extra,{durationMinutes:duration,statDurationMinutes:duration,elapsedSeconds:duration*60,sleepMode:'manual',activityMode:'manual',leftMinutes:left,rightMinutes:right});
          if(type==='母乳' && (left||right)) extra.detailLines=[`母乳：左${left}分钟，右${right}分钟`];
        }else if(type==='换尿布'){
          result=/嘘嘘.*臭臭|臭臭.*嘘嘘/.test(part)?'嘘嘘+臭臭':/臭臭|便便/.test(part)?'臭臭':/嘘嘘/.test(part)?'嘘嘘':'';
          extra.diaperState=result;
        }else if(type==='辅食'){
          const food=part.replace(/小豆苗|小豆芽|宝宝|刚刚|吃了|辅食[:：]?/g,'').trim();
          result=food || '已记录';
          extra.foodName=food.replace(/\d+\s*(克|g)/gi,'').replace(/[，,]+$/,'');
          extra.foodWeight=part.match(/(\d+)\s*(?:克|g)/i)?.[1] || '';
        }else{
          result=part.replace(/小豆苗|小豆芽|宝宝|刚刚|吃了|营养补剂[:：]?/g,'').trim();
          extra.supplement=result.replace(/\d+\s*(mg|粒|滴|毫克).*$/i,'').trim();
          extra.dose=part.match(/\d+\s*(?:mg|粒|滴|毫克)/i)?.[0] || '';
        }
        if(result || type==='换尿布') add({kind:'baby-feeding-card',feedType:type,babyName:owner,value:result,text:type+(result?'：'+result:''),icon:item?.cardIcon || '✦',iconSrc:item?.iconSrc,color:item?.color,railDot:'baby',confirmationFields:[...(!owner?['babyName']:[]),...(type==='奶'?['feedType']:[])],...extra});
      }
      if(/月经|姨妈|例假/.test(part)){
        const end=/走了|走喽|结束|干净/.test(part);
        add({kind:'record-group',primary:{kind:'period',time:recordTime,periodLabel:end?'月经走喽':'月经来了',text:end?'月经走喽':'月经来了',tags:[]}});
      }
      const symptoms=part.match(/头痛|头疼|腹痛|腹胀|腰酸|痛经|恶心|失眠/g);
      if(symptoms) add({kind:'record-group',primary:{kind:'symptom',time:recordTime,symptomLabel:'症状',symptomValue:[...new Set(symptoms)].join('、'),text:[...new Set(symptoms)].join('、'),tags:[]}});
      const mood=part.match(/开心|高兴|焦虑|难过|烦躁|平静|疲惫/);
      if(mood) personal('mood','心情',mood[0]);
      const weight=part.match(/(?:体重\s*[:：]?\s*)?(\d+(?:\.\d+)?)\s*(公斤|千克|kg|斤)/i);
      if(weight) personal('weight','体重',weight[1]+weight[2]);
      const temp=part.match(/(?:体温\s*[:：]?\s*)(\d+(?:\.\d+)?)\s*(?:度|℃)?/);
      if(temp) personal('temp','体温',temp[1]+'℃');
      if(!type && /吃了|午餐|晚餐|早餐/.test(part)) personal('diet','饮食',part.replace(/^我/,'').trim());
    }
    return records;
  }
  function project(blocks, scheme, family){
    const entries=all(blocks);
    const sources=new Map(entries.filter(r=>r.kind==='input-source').map(r=>[r.id,r]));
    const children=new Map();
    entries.forEach(r=>{if(r.inputId){if(!children.has(r.inputId))children.set(r.inputId,[]);children.get(r.inputId).push(r);}});
    return blocks.map(b=>{
      if(b.type!=='day')return b;
      let items=(b.items||b.entries||[]).filter(r=>!family || r.kind!=='input-source');
      if(scheme==='grouped'&&!family) items=items.filter(r=>!r.inputId||!sources.has(r.inputId));
      items=items.map(r=>{
        if(family){const {inputSource,voiceQuote,voice,...publicRecord}=r;return {...publicRecord,readOnly:true,isOwnRecord:false};}
        if(r.kind==='input-source')return {...r,relatedRecords:children.get(r.id)||[],grouped:scheme==='grouped'};
        return r;
      });
      return {...b,items,entries:undefined};
    }).filter(b=>b.type!=='day'||b.items.length);
  }
  function subjectTags(records){
    const groups=new Map();
    records.forEach(record=>{
      const name=subject(record);
      if(!groups.has(name))groups.set(name,new Set());
      groups.get(name).add(title(record));
    });
    return [...groups].map(([subject,labels])=>({subject,labels:[...labels]}));
  }
  // One receipt gets one existing feedback module, based on its first supported event.
  function feedbackRecord(records){
    const record=records.find(r=>['配方奶','母乳','瓶喂母乳','换尿布','睡眠'].includes(r.feedType));
    if(!record)return null;
    return {...record,diaperFeedback:record.feedType==='换尿布',sleepFeedback:record.feedType==='睡眠',sleepWeekCombo:null};
  }
  const api={all,title,value,subject,privateSource,extract,project,feedbackRecord,subjectTags};
  root.InputRecords=api;
  if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
