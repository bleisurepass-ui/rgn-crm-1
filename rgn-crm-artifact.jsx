import { useState, useMemo, useEffect, useRef } from "react";

const STAGES_ACTIVE=["Opportunity Identified","Researching","Draft In Progress","Internal Review","Submitted","Under Review","Awarded","Implementation","Reporting","Completed"];
const STAGES_TERMINAL=["Declined","Closed Before Applying","Stopped / Strategic Pause","Reapplication Eligible","Archived"];
const STAGES=[...STAGES_ACTIVE,...STAGES_TERMINAL];
const PILLARS=["Labour Justice & Inclusion","Skills Development & Workforce Acceleration","Enterprise Development & Formalisation","Market Access & Aggregation"];
const SECTORS=["Labour & Legal Services","Skills Development (SETA/QCTO)","Digital & 4IR","Healthcare","Green Economy & Agritech","Manufacturing","Creative Industries","Technical Trades","Retail & Township Trade","Youth Employability","Cooperative Development","Infrastructure & Innovation Hubs","Funding & Investment Facilitation","Personal Care & Beauty","Cleaning & Hygiene"];
const PROVINCES=["Gauteng","Western Cape","KwaZulu-Natal","Eastern Cape","Limpopo","Mpumalanga","North West","Free State","Northern Cape","National"];
const REVENUE_TYPES=["Grant","Corporate Contract","Management Fee","Hybrid","SETA Levy","CSI","International Aid"];
const FUNDER_TYPES=["Government","Private Foundation","Corporate CSI","Government SETA","International Foundation","Corporate ESD","Bilateral Donor","Trust","DFI"];
const CATEGORY_TAGS=["Labour Rights","Access to Justice","Youth Employment","Skills Training","Worker Education","Legal Empowerment","Civil Society","Social Justice","Gender Justice","Economic Justice","Enterprise Development","Digital Skills"];
const BUDGET_CATS=["Personnel","Travel & Transport","Accommodation","Training Materials","Venue Hire","Communications","Admin & Overheads","Equipment","Sub-Contracts","M&E","Contingency","Other"];
const DEFAULT_TEAM=["Director","Naledi K.","Sipho M.","Thabo D."];

const STAGE_GUIDE={
  "Opportunity Identified":{tip:"Verify eligibility, confirm alignment with RGN pillars, and assess strategic fit before investing research time.",icon:"🔍"},
  "Researching":{tip:"Actively gathering intel. Find past grantees, identify programme officer, download application guidelines, confirm deadline.",icon:"📚"},
  "Draft In Progress":{tip:"Writing phase. Match narrative language to funder's stated priorities. Assign a lead writer and a reviewer.",icon:"✍️"},
  "Internal Review":{tip:"Draft complete — circulate to Director and relevant staff. Set firm internal deadline at least 5 days before funder deadline.",icon:"👁"},
  "Submitted":{tip:"Application sent. Log confirmation number, submission date, and portal link. Send a thank-you note to your programme officer.",icon:"📤"},
  "Under Review":{tip:"Funder is reviewing. Stay available for questions. Prepare for a potential site visit, reference check, or budget clarification.",icon:"⏳"},
  "Awarded":{tip:"Grant awarded! Set up reporting schedule, disbursement tracker, compliance checklist, and impact measurement plan.",icon:"🏆"},
  "Implementation":{tip:"Programme is running. Log monthly progress notes, beneficiary counts, and variances against approved budget and work plan.",icon:"⚙️"},
  "Reporting":{tip:"Reporting phase. Compile evidence: case data, financial records, photos, testimonials. Submit reports on time.",icon:"📋"},
  "Completed":{tip:"Grant cycle complete. Log final impact data, lessons learned, and assess reapplication eligibility.",icon:"✅"},
  "Declined":{tip:"Application unsuccessful. Log the reason if given, request funder feedback, and decide whether to reapply next cycle.",icon:"📎"},
  "Closed Before Applying":{tip:"Decision made not to pursue this cycle. Record the reason and set a reminder for the next funding window.",icon:"🔒"},
  "Stopped / Strategic Pause":{tip:"Temporarily paused. Document the reason and conditions under which this application would be reactivated.",icon:"⏸"},
  "Reapplication Eligible":{tip:"Previous cycle declined or completed. Prepare a stronger application using feedback and new impact data.",icon:"🔁"},
  "Archived":{tip:"Inactive — record kept for history and analysis.",icon:"📦"},
};

const SC={
  "Opportunity Identified":{bg:"#0f1a28",border:"#1a3040",dot:"#3a6080",text:"#7aadcc"},
  "Researching":{bg:"#0f1530",border:"#1a2550",dot:"#3a50a0",text:"#7a90d0"},
  "Draft In Progress":{bg:"#1a1030",border:"#302050",dot:"#6030a0",text:"#a070d0"},
  "Internal Review":{bg:"#281a08",border:"#503010",dot:"#c87020",text:"#e09040"},
  "Submitted":{bg:"#081825",border:"#0f3050",dot:"#1a70b0",text:"#50a0d0"},
  "Under Review":{bg:"#082020",border:"#104040",dot:"#108080",text:"#40b0a0"},
  "Awarded":{bg:"#082010",border:"#104020",dot:"#1a8040",text:"#40b060"},
  "Implementation":{bg:"#101830",border:"#182840",dot:"#2a5080",text:"#5080b0"},
  "Reporting":{bg:"#201808",border:"#402810",dot:"#a07020",text:"#c8a040"},
  "Completed":{bg:"#101a10",border:"#203020",dot:"#408040",text:"#60a860"},
  "Declined":{bg:"#201010",border:"#401818",dot:"#802020",text:"#c06060"},
  "Closed Before Applying":{bg:"#181818",border:"#282828",dot:"#484848",text:"#888"},
  "Stopped / Strategic Pause":{bg:"#1a1408",border:"#302408",dot:"#706020",text:"#a09040"},
  "Reapplication Eligible":{bg:"#101828",border:"#1a2840",dot:"#2a4878",text:"#5a88c0"},
  "Archived":{bg:"#101010",border:"#1a1a1a",dot:"#303030",text:"#505050"},
};
const PC={
  "Labour Justice & Inclusion":{bg:"rgba(200,131,42,0.1)",b:"rgba(200,131,42,0.3)",t:"#c8a060",dot:"#c8832a"},
  "Skills Development & Workforce Acceleration":{bg:"rgba(80,100,180,0.12)",b:"rgba(80,100,180,0.35)",t:"#8090d0",dot:"#5070c0"},
  "Enterprise Development & Formalisation":{bg:"rgba(60,140,80,0.12)",b:"rgba(60,140,80,0.35)",t:"#60b870",dot:"#408050"},
  "Market Access & Aggregation":{bg:"rgba(120,60,160,0.12)",b:"rgba(120,60,160,0.35)",t:"#a060c8",dot:"#8040b0"},
};

const DEFAULT_DOCS=[
  {name:"Project concept note / proposal",done:false,file:null},{name:"Detailed budget breakdown",done:false,file:null},
  {name:"Signed cover letter",done:false,file:null},{name:"Theory of change",done:false,file:null},
  {name:"M&E framework",done:false,file:null},{name:"Organisational chart",done:false,file:null},
  {name:"CV of key personnel",done:false,file:null},{name:"Letters of support",done:false,file:null},
];
const DEFAULT_COMPLIANCE=[
  {name:"CIPC registration current",done:false,file:null},{name:"Tax clearance certificate",done:false,file:null},
  {name:"Section 18A status active",done:false,file:null},{name:"Latest audited financial statements",done:false,file:null},
  {name:"SARS good standing letter",done:false,file:null},{name:"Board resolution authorising application",done:false,file:null},
  {name:"Organisational profile / annual report",done:false,file:null},
];

const SEED=[
  {id:"g1",grantName:"Labour Law Training Initiative",funderName:"Dept. Employment & Labour",applicationURL:"https://www.labour.gov.za/",description:"Government training initiative for workplace rights education in townships.",contactName:"Grants Office",contactEmail:"grants@labour.gov.za",contactPhone:"+27 12 309 4000",contactRole:"Grants Officer",amountRequested:"R2,000,000",totalBudget:"R2,500,000",matchReq:"",eligibility:"Eligible",funderType:"Government",categoryTag:"Labour Rights",pillar:"Labour Justice & Inclusion",sectors:["Labour & Legal Services","Youth Employability"],province:"Gauteng",revenueType:"Grant",stars:5,loiDeadline:"",fullDeadline:"2026-03-15",internalDeadline:"2026-03-08",followup:"",lead:"Director",support:["Naledi K."],status:"Researching",submissionNum:"",awardAmount:"",awardDate:"",disbursements:[],budget:[],compliance:DEFAULT_COMPLIANCE.map(d=>({...d})),docs:DEFAULT_DOCS.map(d=>({...d})),researchNotes:[],drafts:[],reviewMsgs:[],submission:null,award:null,implPlan:[],isArchived:false,activities:[{ts:"2026-02-01T08:00:00Z",author:"Director",type:"note",content:"Confirmed eligible. Strong alignment with Pillar 1. Start concept note immediately."}]},
  {id:"g2",grantName:"Youth Employment & Civil Society Innovation",funderName:"DG Murray Trust (DGMT)",applicationURL:"https://dgmt.co.za/",description:"SA's largest independent funder targeting youth employment and civil society capacity.",contactName:"Applications Team",contactEmail:"applications@dgmt.co.za",contactPhone:"+27 21 670 9840",contactRole:"Programme Manager",amountRequested:"R1,500,000",totalBudget:"R2,000,000",matchReq:"",eligibility:"Eligible",funderType:"Private Foundation",categoryTag:"Youth Employment",pillar:"Skills Development & Workforce Acceleration",sectors:["Youth Employability","Labour & Legal Services"],province:"National",revenueType:"Grant",stars:4,loiDeadline:"2026-03-15",fullDeadline:"2026-03-31",internalDeadline:"2026-03-08",followup:"",lead:"Naledi K.",support:["Sipho M."],status:"Draft In Progress",submissionNum:"",awardAmount:"",awardDate:"",disbursements:[],budget:[],compliance:DEFAULT_COMPLIANCE.map(d=>({...d})),docs:DEFAULT_DOCS.map(d=>({...d})),researchNotes:[{id:"rn1",content:"Portal reopened Feb 2, 2026. Apply before end of March. Lead with candidate attorney development.",author:"Director",date:"2026-02-10T08:00:00Z",files:[]}],drafts:[{id:"dv1",name:"Concept Note Draft v1.docx",date:"2026-02-23T16:00:00Z",author:"Naledi K.",notes:"First draft complete. Pending Director review.",sentTo:"",sentDate:"",reviewNotes:"",reviewedBy:"",reviewDate:"",file:{name:"Concept Note Draft v1.docx",size:45000}}],reviewMsgs:[],submission:null,award:null,implPlan:[],isArchived:false,activities:[{ts:"2026-02-23T16:00:00Z",author:"Naledi K.",type:"note",content:"Concept note first draft complete. Internal deadline March 8."}]},
  {id:"g4",grantName:"Access to Justice — Expression of Interest",funderName:"Legal Empowerment Fund",applicationURL:"https://legalempowermentfund.org/apply/",description:"$100M programme awarding 2-year UNRESTRICTED core funding to grassroots legal empowerment organisations.",contactName:"Applications",contactEmail:"applications@globalhumanrights.org",contactPhone:"",contactRole:"Grants Administrator",amountRequested:"R750,000",totalBudget:"R750,000",matchReq:"",eligibility:"Eligible",funderType:"International Foundation",categoryTag:"Legal Empowerment",pillar:"Labour Justice & Inclusion",sectors:["Labour & Legal Services"],province:"National",revenueType:"International Aid",stars:5,loiDeadline:"2026-03-07",fullDeadline:"",internalDeadline:"2026-03-04",followup:"2026-04-01",lead:"Sipho M.",support:["Director"],status:"Researching",submissionNum:"",awardAmount:"",awardDate:"",disbursements:[],budget:[],compliance:DEFAULT_COMPLIANCE.map(d=>({...d})),docs:[{name:"Expression of Interest (1-2 pages)",done:false,file:null},{name:"Three-Pillar Framing",done:true,file:null},{name:"Annual Budget Evidence",done:false,file:null},{name:"Organisational Profile",done:true,file:null}],researchNotes:[{id:"rn1",content:"PERFECT MATCH: unrestricted 2-year core funding covers salaries and overheads. EOI due urgently. Three pillars: Know the Law, Use the Law, Shape the Law.",author:"Sipho M.",date:"2026-02-20T09:30:00Z",files:[]}],drafts:[],reviewMsgs:[],submission:null,award:null,implPlan:[],isArchived:false,activities:[{ts:"2026-02-20T09:30:00Z",author:"Sipho M.",type:"note",content:"PERFECT MATCH: unrestricted 2-year core funding."},{ts:"2026-02-24T08:00:00Z",author:"Sipho M.",type:"note",content:"EOI first draft written. Internal review deadline March 4."}]},
];

function daysUntil(d){if(!d)return null;return Math.ceil((new Date(d)-new Date())/86400000);}
function urgCls(d){if(d===null)return"n";if(d<=0)return"o";if(d<=7)return"c";if(d<=21)return"w";return"s";}
function fd(d){if(!d)return"—";return new Date(d).toLocaleDateString("en-ZA",{day:"numeric",month:"short",year:"numeric"});}
function fts(t){return new Date(t).toLocaleString("en-ZA",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"});}
function uid(){return"x"+Date.now()+Math.random().toString(36).slice(2,6);}
const UC={o:{bg:"rgba(180,40,30,0.18)",b:"rgba(180,40,30,0.55)",t:"#ff7060"},c:{bg:"rgba(180,40,30,0.10)",b:"rgba(180,40,30,0.4)",t:"#ff9070"},w:{bg:"rgba(200,131,42,0.12)",b:"rgba(200,131,42,0.4)",t:"#e8a84a"},s:{bg:"rgba(40,160,80,0.08)",b:"rgba(40,160,80,0.3)",t:"#60c880"},n:{bg:"rgba(255,255,255,0.04)",b:"rgba(255,255,255,0.1)",t:"#6a7a8a"}};
const I={background:"rgba(255,255,255,0.05)",border:"1px solid rgba(200,131,42,0.22)",borderRadius:8,padding:"10px 14px",color:"#d0c0a8",fontSize:14,outline:"none",fontFamily:"system-ui,sans-serif",width:"100%",transition:"border-color 0.2s"};
const L={fontSize:11,color:"#5a6a7a",letterSpacing:2,textTransform:"uppercase",display:"block",marginBottom:6,fontWeight:600};
const SS={fontSize:12,color:"#7a6a5a",letterSpacing:3,textTransform:"uppercase",marginBottom:12,paddingBottom:8,borderBottom:"1px solid rgba(200,131,42,0.12)",fontWeight:700};
const CB={background:"linear-gradient(160deg,#0d1825,#0a1220)",border:"1px solid rgba(200,131,42,0.16)",borderRadius:13,padding:"18px 20px",boxShadow:"0 8px 32px rgba(0,0,0,0.4)"};


// ── SMART PARSER ─────────────────────────────────────────────────────────────
function parseGrantText(raw){
  const t=raw,tl=t.toLowerCase();
  const urlM=t.match(/https?:\/\/[^\s"'\)]+|www\.[^\s"'\)]+/i);
  const applicationURL=urlM?(urlM[0].startsWith("http")?urlM[0]:"https://"+urlM[0]):"";
  const emailM=t.match(/[\w.+-]+@[\w-]+\.[a-z]{2,}/i);
  const contactEmail=emailM?emailM[0]:"";
  const phoneM=t.match(/(\+27|0)[0-9\s\-]{8,12}/);
  const contactPhone=phoneM?phoneM[0].trim():"";
  const lines=t.split("\n").map(l=>l.trim()).filter(Boolean);
  let funderName="";
  for(const line of lines){const c=line.replace(/^[\*\-•#\d\.]+\s*/,"").trim();if(c.length>3&&c.length<120&&/[A-Z]/.test(c)&&!/^(focus|who|apply|website|contact|description|email|phone)/i.test(c)){funderName=c.replace(/\s*\(.*\)\s*$/,"").trim();break;}}
  const amM=t.match(/R[\s]?[\d,]+(?:\s*[-–]\s*R[\s]?[\d,]+)?(?:\s*(?:million|m|k))?|\$[\d,]+/gi);
  const amountRequested=amM?amM.slice(0,2).join(" – ").trim():"";
  function pdate(s){if(!s)return"";let m=s.match(/(\d{4})-(\d{2})-(\d{2})/);if(m)return`${m[1]}-${m[2]}-${m[3]}`;m=s.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);if(m)return`${m[3]}-${m[2].padStart(2,"0")}-${m[1].padStart(2,"0")}`;const mo={january:"01",february:"02",march:"03",april:"04",may:"05",june:"06",july:"07",august:"08",september:"09",october:"10",november:"11",december:"12",jan:"01",feb:"02",mar:"03",apr:"04",jun:"06",jul:"07",aug:"08",sep:"09",oct:"10",nov:"11",dec:"12"};m=s.match(/(\d{1,2})\s+(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)\s+(\d{4})/i);if(m)return`${m[3]}-${mo[m[2].toLowerCase()]}-${m[1].padStart(2,"0")}`;m=s.match(/(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)\s+(\d{1,2}),?\s+(\d{4})/i);if(m)return`${m[3]}-${mo[m[1].toLowerCase()]}-${m[2].padStart(2,"0")}`;return"";}
  const loiM=t.match(/(?:loi|letter of intent|expression of interest|eoi)[^\n]*?(\d{1,2}[\s\/\-]\w+[\s\/\-]\d{4}|\d{4}-\d{2}-\d{2})/i);
  const propM=t.match(/(?:full proposal|submission|deadline|due)[^\n]*?(\d{1,2}[\s\/\-]\w+[\s\/\-]\d{4}|\d{4}-\d{2}-\d{2})/i);
  const loiDeadline=loiM?pdate(loiM[1]):"";
  const fullDeadline=propM?pdate(propM[1]):"";
  let pillar="Labour Justice & Inclusion";
  if(/skill|training|learner|seta|qcto|education|workforce/i.test(tl))pillar="Skills Development & Workforce Acceleration";
  else if(/enterprise|small business|sme|cooperativ|entrepreneur/i.test(tl))pillar="Enterprise Development & Formalisation";
  else if(/market access|agri|supply chain|aggregat|value chain/i.test(tl))pillar="Market Access & Aggregation";
  const smap=[["Labour & Legal Services",/labour|legal|ccma|workers right|lra|bcea|paralegal/i],["Skills Development (SETA/QCTO)",/seta|qcto|nqf|learnership|skills development/i],["Youth Employability",/youth|young people|school leaver|graduate|unemployed youth/i],["Healthcare",/health|clinic|medical|hiv|tb|primary care/i],["Green Economy & Agritech",/green|agri|climate|solar|renewable|environment/i],["Manufacturing",/manufactur|production|factory/i],["Cooperative Development",/cooperativ|co-op/i],["Retail & Township Trade",/retail|township|spaza|informal trade/i]];
  const sectors=smap.filter(([,re])=>re.test(tl)).map(([s])=>s).slice(0,3);
  if(sectors.length===0)sectors.push("Labour & Legal Services");
  let funderType="Private Foundation";
  if(/department|ministry|government|dept\.|municipality/i.test(tl))funderType="Government";
  else if(/seta\b/i.test(tl))funderType="Government SETA";
  else if(/csi|corporate social/i.test(tl))funderType="Corporate CSI";
  else if(/esd|enterprise.*development/i.test(tl))funderType="Corporate ESD";
  else if(/usaid|dfid|eu |european|giz|bilateral/i.test(tl))funderType="Bilateral Donor";
  else if(/dfi|development finance|dbsa|ifc/i.test(tl))funderType="DFI";
  let revenueType="Grant";
  if(/csi\b/i.test(tl))revenueType="CSI";
  else if(/seta|levy/i.test(tl))revenueType="SETA Levy";
  else if(/international|global|overseas|usaid/i.test(tl))revenueType="International Aid";
  let categoryTag="Labour Rights";
  if(/access to justice|legal empowerment|paralegal/i.test(tl))categoryTag="Access to Justice";
  else if(/youth employ/i.test(tl))categoryTag="Youth Employment";
  else if(/skill|training/i.test(tl))categoryTag="Skills Training";
  else if(/civil society|ngo/i.test(tl))categoryTag="Civil Society";
  else if(/social justice/i.test(tl))categoryTag="Social Justice";
  let province="National";
  const provM=[["Gauteng",/gauteng|johannesburg|pretoria|soweto|tshwane/i],["Western Cape",/western cape|cape town/i],["KwaZulu-Natal",/kwazulu|natal|durban/i],["Eastern Cape",/eastern cape|port elizabeth/i],["Limpopo",/limpopo|polokwane/i],["Mpumalanga",/mpumalanga|nelspruit/i]];
  for(const[p,re]of provM){if(re.test(tl)){province=p;break;}}
  let stars=3;
  if(["labour rights","access to justice","legal empowerment","worker","ccma","civil society","grassroots","marginalised"].some(w=>tl.includes(w)))stars++;
  if(["unrestricted","core funding","township","south africa","npo","ngo"].filter(w=>tl.includes(w)).length>=2)stars++;
  stars=Math.min(5,Math.max(1,stars));
  const focM=t.match(/(?:focus areas?)[:\s]+([^\n]+)/i);
  const whoM=t.match(/(?:who can apply|eligib)[:\s]+([^\n]+)/i);
  let description="";
  if(focM)description+=focM[1].trim()+". ";
  if(whoM)description+="Eligible: "+whoM[1].trim()+".";
  if(!description&&lines.length>1)description=lines.slice(1,4).join(" ").trim();
  const eligM=t.match(/(?:who can apply|eligible|eligib[a-z]*)[:\s]+([^\n]+)/i);
  return{grantName:funderName+" — Grant Opportunity",funderName,applicationURL,description:description.trim()||funderName+" — grant opportunity.",contactEmail,contactPhone,funderType,categoryTag,amountRequested,eligibility:eligM?eligM[1].trim():"Eligible",pillar,sectors,province,revenueType,stars,loiDeadline,fullDeadline,status:"Opportunity Identified"};
}

// ── IMPLEMENTATION PLAN PARSER ────────────────────────────────────────────────
function parseImplPlan(text){
  const lines=text.split("\n").map(l=>l.trim()).filter(Boolean);
  const phases=[];let cur=null;
  for(const line of lines){
    if(/^(phase|month|week|quarter|stage|period|step)\s*\d+|^[ivx]+\.|^\d+\./i.test(line)){
      cur={id:uid(),title:line.replace(/^[\d\.\-\*]+\s*/,"").trim(),tasks:[],dueDate:"",status:"Pending",progress:0,notes:"",responsible:""};
      phases.push(cur);
    }else if(cur&&line.length>4){
      const dateM=line.match(/by\s+(\w+\s+\d{4}|\d{4}-\d{2}-\d{2})/i);
      cur.tasks.push({id:uid(),text:line.replace(/^[\-\*•]\s*/,""),done:false,dueDate:dateM?dateM[1]:"",responsible:""});
    }
  }
  if(phases.length===0){
    const chunks=[];for(let i=0;i<lines.length;i+=4)chunks.push(lines.slice(i,i+4));
    chunks.forEach((ch,i)=>phases.push({id:uid(),title:`Phase ${i+1}: ${ch[0]||""}`,tasks:ch.slice(1).map(t=>({id:uid(),text:t,done:false,dueDate:"",responsible:""})),dueDate:"",status:"Pending",progress:0,notes:"",responsible:""}));
  }
  return phases;
}

// ── SHARED COMPONENTS ─────────────────────────────────────────────────────────
function Stars({value=0,onChange,size=18}){
  return(<div style={{display:"flex",gap:3}}>{[1,2,3,4,5].map(n=>(<span key={n} onClick={()=>onChange&&onChange(n)} style={{fontSize:size,cursor:onChange?"pointer":"default",color:n<=value?"#c8832a":"rgba(200,131,42,0.15)",transition:"all 0.15s"}}>★</span>))}</div>);
}

function UploadBtn({label,onFile,style:xs}){
  const ref=useRef();
  return(<><button onClick={()=>ref.current.click()} style={{background:"rgba(200,131,42,0.08)",border:"1px dashed rgba(200,131,42,0.35)",borderRadius:7,color:"#c8832a",padding:"6px 12px",fontSize:11,cursor:"pointer",letterSpacing:1,fontFamily:"inherit",...xs}}>📎 {label||"ATTACH"}</button><input ref={ref} type="file" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(f&&onFile)onFile({name:f.name,size:f.size,type:f.type,date:new Date().toISOString()});e.target.value="";}} /></>);
}

function FTag({file,onRemove}){
  if(!file)return null;
  return(<span style={{display:"inline-flex",alignItems:"center",gap:5,background:"rgba(200,131,42,0.07)",border:"1px solid rgba(200,131,42,0.2)",borderRadius:5,padding:"3px 9px",fontSize:11,color:"#c8a060",maxWidth:200}}>📄 <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{file.name}</span>{onRemove&&<button onClick={onRemove} style={{background:"none",border:"none",color:"#5a3a3a",cursor:"pointer",fontSize:13,padding:"0",lineHeight:1,flexShrink:0}}>×</button>}</span>);
}


// ── AI IMPORT PANEL ───────────────────────────────────────────────────────────
function AIImportPanel({onImport}){
  const[text,setText]=useState("");const[loading,setLoading]=useState(false);const[status,setStatus]=useState("");
  function run(){if(!text.trim()){setStatus("⚠️ Paste some funder text first.");return;}setLoading(true);setStatus("Parsing…");
    setTimeout(()=>{try{const r=parseGrantText(text);setStatus("✅ "+Object.keys(r).filter(k=>r[k]&&r[k]!=="").length+" fields filled — review then save.");setLoading(false);onImport(r);}catch{setStatus("⚠️ Could not parse. Paste more structured text.");setLoading(false);}},500);}
  return(<div style={{display:"grid",gap:14}}>
    <div style={{background:"rgba(200,131,42,0.06)",border:"1px solid rgba(200,131,42,0.2)",borderRadius:11,padding:"13px 16px"}}>
      <div style={{fontSize:13,color:"#c8832a",fontWeight:700,marginBottom:4}}>✦ Smart Import — works offline, no API key</div>
      <div style={{fontSize:12,color:"#7a6a5a",lineHeight:1.8}}>Paste any funder text — website, email, WhatsApp, document extract — and all fields auto-fill instantly.</div>
    </div>
    <div><label style={L}>Paste funder info</label><textarea value={text} onChange={e=>setText(e.target.value)} placeholder={"e.g.\n\nDevelopment Bank of Southern Africa (DBSA)\n• Focus Areas: Education & Health (townships)\n• Who Can Apply: Registered NPOs and NGOs\n• Website: www.dbsa.org/sustainability/csi\n\nPaste the full email or website section for best results."} style={{...I,height:180,resize:"vertical",fontSize:12,lineHeight:1.85,padding:"12px 14px"}}/></div>
    <button onClick={run} disabled={loading||!text.trim()} style={{width:"100%",padding:"13px",background:"linear-gradient(135deg,#c8832a,#a06020)",border:"none",borderRadius:10,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",letterSpacing:2,boxShadow:"0 6px 24px rgba(200,131,42,0.4)",fontFamily:"inherit"}}>{loading?"⟳ Parsing…":"✦ AUTO-FILL ALL FIELDS"}</button>
    {status&&<div style={{background:status.startsWith("✅")?"rgba(40,160,80,0.08)":"rgba(200,80,60,0.08)",border:`1px solid ${status.startsWith("✅")?"rgba(40,160,80,0.3)":"rgba(200,80,60,0.3)"}`,borderRadius:8,padding:"10px 14px",fontSize:13,color:status.startsWith("✅")?"#60c880":"#ff9070",textAlign:"center"}}>{status}</div>}
  </div>);
}

// ── ADD/EDIT MODAL ────────────────────────────────────────────────────────────
function GrantModal({initial,team,onSave,onClose}){
  const BLK={id:"",grantName:"",funderName:"",applicationURL:"",description:"",contactName:"",contactEmail:"",contactPhone:"",contactRole:"",amountRequested:"",totalBudget:"",matchReq:"",eligibility:"Eligible",funderType:"Government",categoryTag:"Labour Rights",pillar:"Labour Justice & Inclusion",sectors:[],province:"Gauteng",revenueType:"Grant",stars:3,loiDeadline:"",fullDeadline:"",internalDeadline:"",followup:"",lead:"",support:[],status:"Opportunity Identified",submissionNum:"",awardAmount:"",awardDate:"",disbursements:[],budget:[],compliance:DEFAULT_COMPLIANCE.map(d=>({...d})),docs:DEFAULT_DOCS.map(d=>({...d})),researchNotes:[],drafts:[],reviewMsgs:[],submission:null,award:null,implPlan:[],isArchived:false,activities:[]};
  const[form,setForm]=useState(initial?{...BLK,...initial}:{...BLK,id:uid()});
  const[tab,setTab]=useState(initial?.id?"basic":"ai");
  const[flash,setFlash]=useState([]);
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  function handleAI(parsed){setForm(p=>({...p,...parsed}));setFlash(Object.keys(parsed).filter(k=>parsed[k]&&parsed[k]!==""));setTimeout(()=>setFlash([]),3000);setTab("basic");}
  function autoCalc(deadline){
    if(!deadline)return;
    const d=new Date(deadline);const ws=new Date(d);ws.setDate(d.getDate()-d.getDay()+1);
    const days=daysUntil(deadline);
    f("focusWeekStart",ws.toISOString().slice(0,10));
    f("targetWeek",days?`${Math.ceil(days/7)} weeks out — w/c ${ws.toLocaleDateString("en-ZA",{day:"numeric",month:"short"})}`:"");
  }
  function dlICS(){
    const d=form.fullDeadline||form.loiDeadline;if(!d)return;
    const ics=`BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${d.replace(/-/g,"")}T090000Z\nDTEND:${d.replace(/-/g,"")}T100000Z\nSUMMARY:${form.grantName||"Grant Deadline"} — ${form.funderName||""}\nDESCRIPTION:RGN CRM Deadline Reminder\nBEGIN:VALARM\nTRIGGER:-P7D\nACTION:DISPLAY\nDESCRIPTION:1 week reminder\nEND:VALARM\nBEGIN:VALARM\nTRIGGER:-P3D\nACTION:DISPLAY\nDESCRIPTION:3 day reminder\nEND:VALARM\nEND:VEVENT\nEND:VCALENDAR`;
    const b=new Blob([ics],{type:"text/calendar"});const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download="grant-deadline.ics";a.click();URL.revokeObjectURL(u);
  }
  const TABS=[["ai","✦ AI Import"],["basic","Basic"],["sector","Sector"],["financials","Financials"],["deadlines","Deadlines"],["team","Team"],["docs","Docs"]];
  return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"flex-start",justifyContent:"center",zIndex:60,overflow:"auto",padding:"20px 16px",backdropFilter:"blur(8px)"}}>
    <div style={{background:"linear-gradient(160deg,#0a1525,#07101c)",border:"1px solid rgba(200,131,42,0.3)",borderRadius:14,width:"100%",maxWidth:720,boxShadow:"0 40px 100px rgba(0,0,0,0.9)",marginTop:12}} onClick={e=>e.stopPropagation()}>
      <div style={{padding:"18px 24px 0",borderBottom:"1px solid rgba(200,131,42,0.15)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
          <div><div style={{fontSize:9,color:"#c8832a",letterSpacing:4,marginBottom:3}}>RGN GRANT MANAGEMENT</div><h2 style={{fontFamily:"Georgia,serif",fontSize:20,color:"#f0e0c0",fontWeight:700,margin:0}}>{initial?.id?"Edit Grant Record":"New Grant Opportunity"}</h2></div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:7,color:"#5a6a7a",width:34,height:34,cursor:"pointer",fontSize:18,flexShrink:0,lineHeight:1}}>×</button>
        </div>
        <div style={{display:"flex",gap:0,overflowX:"auto"}}>{TABS.map(([id,label])=>(<button key={id} onClick={()=>setTab(id)} style={{padding:"9px 14px",fontSize:12,cursor:"pointer",background:"transparent",border:"none",borderBottom:tab===id?"2px solid #c8832a":"2px solid transparent",color:tab===id?"#c8832a":"#3a4a5a",whiteSpace:"nowrap",fontFamily:"inherit"}}>{label}</button>))}</div>
      </div>
      <div style={{padding:"18px 24px",maxHeight:"60vh",overflowY:"auto"}}>
        {flash.length>0&&tab!=="ai"&&<div style={{background:"rgba(200,131,42,0.07)",border:"1px solid rgba(200,131,42,0.3)",borderRadius:9,padding:"9px 14px",fontSize:12,color:"#c8a060",marginBottom:12}}>✦ AI filled {flash.length} fields — review and adjust if needed.</div>}
        {tab==="ai"&&<AIImportPanel onImport={handleAI}/>}
        {tab==="basic"&&<div style={{display:"grid",gap:14}}>
          <div style={SS}>Basic Details</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div style={{gridColumn:"span 2"}}><label style={L}>Grant / Opportunity Name *</label><input style={I} value={form.grantName} onChange={e=>f("grantName",e.target.value)} placeholder="e.g. Legal Empowerment Fund — EOI"/></div>
            <div><label style={L}>Funder Name *</label><input style={I} value={form.funderName} onChange={e=>f("funderName",e.target.value)}/></div>
            <div><label style={L}>Funder Type</label><select style={{...I,cursor:"pointer"}} value={form.funderType} onChange={e=>f("funderType",e.target.value)}>{FUNDER_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
            <div style={{gridColumn:"span 2"}}><label style={L}>Application URL</label><input style={I} value={form.applicationURL} onChange={e=>f("applicationURL",e.target.value)} placeholder="https://..."/></div>
            <div><label style={L}>Category Tag</label><select style={{...I,cursor:"pointer"}} value={form.categoryTag} onChange={e=>f("categoryTag",e.target.value)}>{CATEGORY_TAGS.map(t=><option key={t}>{t}</option>)}</select></div>
            <div><label style={L}>Eligibility Status</label><input style={I} value={form.eligibility} onChange={e=>f("eligibility",e.target.value)}/></div>
            <div style={{gridColumn:"span 2"}}><label style={L}>Description</label><textarea style={{...I,resize:"vertical",height:80}} value={form.description} onChange={e=>f("description",e.target.value)}/></div>
            <div><label style={L}>Contact Name</label><input style={I} value={form.contactName} onChange={e=>f("contactName",e.target.value)}/></div>
            <div><label style={L}>Contact Title / Role</label><input style={I} value={form.contactRole||""} onChange={e=>f("contactRole",e.target.value)} placeholder="e.g. Senior Grants Officer"/></div>
            <div><label style={L}>Email</label><input style={I} value={form.contactEmail} onChange={e=>f("contactEmail",e.target.value)}/></div>
            <div><label style={L}>Phone</label><input style={I} value={form.contactPhone} onChange={e=>f("contactPhone",e.target.value)}/></div>
          </div>
        </div>}
        {tab==="sector"&&<div style={{display:"grid",gap:14}}>
          <div style={SS}>Sector & Classification</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div style={{gridColumn:"span 2"}}><label style={L}>Strategic Pillar</label><select style={{...I,cursor:"pointer"}} value={form.pillar} onChange={e=>f("pillar",e.target.value)}>{PILLARS.map(p=><option key={p}>{p}</option>)}</select></div>
            <div><label style={L}>Province</label><select style={{...I,cursor:"pointer"}} value={form.province} onChange={e=>f("province",e.target.value)}>{PROVINCES.map(p=><option key={p}>{p}</option>)}</select></div>
            <div><label style={L}>Revenue Type</label><select style={{...I,cursor:"pointer"}} value={form.revenueType} onChange={e=>f("revenueType",e.target.value)}>{REVENUE_TYPES.map(r=><option key={r}>{r}</option>)}</select></div>
            <div style={{gridColumn:"span 2"}}><label style={L}>Strategic Alignment (1–5)</label><Stars value={form.stars} onChange={v=>f("stars",v)} size={24}/></div>
          </div>
          <div><label style={L}>Sectors (select all that apply)</label><div style={{display:"flex",flexWrap:"wrap",gap:7,marginTop:4}}>{SECTORS.map(s=>{const sel=(form.sectors||[]).includes(s);return(<button key={s} onClick={()=>{const c=form.sectors||[];f("sectors",sel?c.filter(x=>x!==s):[...c,s]);}} style={{padding:"5px 11px",borderRadius:20,fontSize:12,cursor:"pointer",background:sel?"rgba(80,100,160,0.2)":"rgba(255,255,255,0.04)",border:sel?"1px solid rgba(80,100,160,0.5)":"1px solid rgba(255,255,255,0.08)",color:sel?"#8ab0e0":"#4a5a6a"}}>{s}</button>);})}</div></div>
        </div>}
        {tab==="financials"&&<div style={{display:"grid",gap:12}}>
          <div style={SS}>Funding Details</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
            {[["Amount Requested","amountRequested"],["Total Project Budget","totalBudget"],["Match Req. (%)","matchReq"]].map(([label,key])=>(<div key={key}><label style={L}>{label}</label><input style={I} value={form[key]} onChange={e=>f(key,e.target.value)}/></div>))}
          </div>
        </div>}
        {tab==="deadlines"&&<div style={{display:"grid",gap:12}}>
          <div style={SS}>Key Dates</div>
          {[["LOI Deadline","loiDeadline"],["Full Proposal Deadline","fullDeadline"],["Internal Review Deadline","internalDeadline"],["Follow-Up Date","followup"]].map(([label,key])=>(
            <div key={key} style={{display:"grid",gridTemplateColumns:"1fr auto",gap:10,alignItems:"end"}}>
              <div><label style={L}>{label}</label><input type="date" style={I} value={form[key]||""} onChange={e=>{f(key,e.target.value);if(key==="fullDeadline"||key==="loiDeadline")autoCalc(e.target.value);}}/></div>
              {form[key]&&<div style={{paddingBottom:10,fontSize:12,color:"#7a8a9a"}}>{fd(form[key])} {daysUntil(form[key])!==null&&<span style={{color:daysUntil(form[key])<=7?"#ff9070":"#60c880",fontWeight:700}}>{daysUntil(form[key])}d</span>}</div>}
            </div>
          ))}
          {form.targetWeek&&<div style={{background:"rgba(200,131,42,0.05)",border:"1px solid rgba(200,131,42,0.15)",borderRadius:9,padding:"11px 14px",fontSize:12,color:"#c8a060"}}>✦ Auto-calculated: {form.targetWeek}</div>}
          <button onClick={dlICS} disabled={!form.fullDeadline&&!form.loiDeadline} style={{background:"rgba(200,131,42,0.08)",border:"1px solid rgba(200,131,42,0.25)",borderRadius:7,color:"#c8832a",padding:"8px 16px",fontSize:12,cursor:"pointer",fontFamily:"inherit",width:"fit-content"}}>📅 DOWNLOAD ICS CALENDAR FILE (with 1-week & 3-day reminders)</button>
        </div>}
        {tab==="team"&&<div style={{display:"grid",gap:12}}>
          <div style={SS}>Team Assignment</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div><label style={L}>Assigned Lead</label><select style={{...I,cursor:"pointer"}} value={form.lead} onChange={e=>f("lead",e.target.value)}><option value="">Unassigned</option>{team.map(m=><option key={m}>{m}</option>)}</select></div>
            <div><label style={L}>Pipeline Stage</label><select style={{...I,cursor:"pointer"}} value={form.status} onChange={e=>f("status",e.target.value)}>{STAGES.map(s=><option key={s}>{s}</option>)}</select>
              {form.status&&<div style={{marginTop:6,background:"rgba(200,131,42,0.05)",border:"1px solid rgba(200,131,42,0.15)",borderRadius:7,padding:"8px 12px",fontSize:12,color:"#9a8a6a",lineHeight:1.7}}>{STAGE_GUIDE[form.status]?.icon} {STAGE_GUIDE[form.status]?.tip}</div>}
            </div>
          </div>
          <div><label style={L}>Support Team</label><div style={{display:"flex",flexWrap:"wrap",gap:7,marginTop:4}}>{team.filter(m=>m!==form.lead).map(m=>{const inT=(form.support||[]).includes(m);return(<button key={m} onClick={()=>{const st=form.support||[];f("support",inT?st.filter(x=>x!==m):[...st,m]);}} style={{padding:"6px 13px",borderRadius:20,fontSize:13,cursor:"pointer",background:inT?"rgba(200,131,42,0.18)":"rgba(255,255,255,0.05)",border:inT?"1px solid rgba(200,131,42,0.45)":"1px solid rgba(255,255,255,0.1)",color:inT?"#c8832a":"#3a4a5a"}}>{m}</button>);})}</div></div>
        </div>}
        {tab==="docs"&&<div style={{display:"grid",gap:10}}>
          <div style={SS}>Document Checklist</div>
          {form.docs.map((doc,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:9,background:"rgba(255,255,255,0.03)",borderRadius:7,padding:"9px 12px",border:"1px solid rgba(255,255,255,0.06)"}}>
              <input type="checkbox" checked={doc.done} onChange={()=>{const dl=[...form.docs];dl[i]={...dl[i],done:!dl[i].done};f("docs",dl);}} style={{width:14,height:14,accentColor:"#c8832a",cursor:"pointer",flexShrink:0}}/>
              <input style={{...I,flex:1,padding:"6px 9px",fontSize:13,textDecoration:doc.done?"line-through":"none",color:doc.done?"#3a4a3a":"#d0c0a8"}} value={doc.name} onChange={e=>{const dl=[...form.docs];dl[i]={...dl[i],name:e.target.value};f("docs",dl);}}/>
              {doc.file?<FTag file={doc.file} onRemove={()=>{const dl=[...form.docs];dl[i]={...dl[i],file:null};f("docs",dl);}}/>:<UploadBtn label="" onFile={file=>{const dl=[...form.docs];dl[i]={...dl[i],file,done:true};f("docs",dl);}}/>}
              <button onClick={()=>f("docs",form.docs.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:"#3a2a2a",cursor:"pointer",fontSize:16,flexShrink:0}}>×</button>
            </div>
          ))}
          <button onClick={()=>f("docs",[...form.docs,{name:"",done:false,file:null}])} style={{background:"transparent",border:"1px dashed rgba(200,131,42,0.3)",borderRadius:7,color:"#c8832a",padding:"8px 14px",fontSize:12,cursor:"pointer",letterSpacing:1,fontFamily:"inherit"}}>+ ADD DOCUMENT SLOT</button>
        </div>}
      </div>
      <div style={{borderTop:"1px solid rgba(200,131,42,0.2)",padding:"14px 24px",display:"flex",justifyContent:"space-between",gap:10,background:"rgba(0,0,0,0.3)"}}>
        <button onClick={onClose} style={{background:"transparent",border:"1px solid rgba(255,255,255,0.1)",borderRadius:9,color:"#5a6a7a",padding:"9px 22px",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
        <button onClick={()=>{if(!form.grantName||!form.funderName)return;onSave(form);onClose();}} disabled={!form.grantName||!form.funderName} style={{background:"linear-gradient(135deg,#c8832a,#a06020)",border:"none",borderRadius:9,color:"#fff",padding:"9px 28px",fontSize:13,fontWeight:700,cursor:"pointer",letterSpacing:2,boxShadow:"0 8px 24px rgba(200,131,42,0.4)",fontFamily:"inherit"}}>
          {initial?.id?"SAVE CHANGES":"ADD TO PIPELINE"}
        </button>
      </div>
    </div>
  </div>);
}


// ── FULL-SCREEN GRANT DETAIL ──────────────────────────────────────────────────
function GrantDetailPage({grant,team,currentUser,notifications,onUpdate,onClose,onArchive,onDelete,onNotify}){
  const[g,setG]=useState(grant);
  const[tab,setTab]=useState("overview");
  const[note,setNote]=useState(""),noteAuthor=useRef(currentUser||team[0]||"Director");
  const[showEdit,setShowEdit]=useState(false);
  const[confirmDel,setConfirmDel]=useState(false);
  const[confirmArch,setConfirmArch]=useState(false);
  useEffect(()=>{setG(grant);},[grant]);
  const save=(u)=>{const ng={...g,...u};setG(ng);onUpdate(ng);};
  const addNote=()=>{if(!note.trim())return;save({activities:[...(g.activities||[]),{ts:new Date().toISOString(),author:noteAuthor.current,type:"note",content:note}]});setNote("");};
  const sc=SC[g.status]||SC["Opportunity Identified"];
  const pc=PC[g.pillar];
  const stIdx=STAGES_ACTIVE.indexOf(g.status);
  const nextStage=stIdx>=0&&stIdx<STAGES_ACTIVE.length-1?STAGES_ACTIVE[stIdx+1]:null;
  const prevStage=stIdx>0?STAGES_ACTIVE[stIdx-1]:null;
  const deadline=g.fullDeadline||g.loiDeadline||g.internalDeadline;
  const days=daysUntil(deadline);const uc=urgCls(days);
  const myNotifs=(notifications||[]).filter(n=>n.to===currentUser&&!n.read&&n.grantId===g.id);

  const stageTabs=[
    {id:"overview",label:"Overview",always:true},
    {id:"documents",label:"Documents",always:true},
    {id:"research",label:"Research",show:["Researching","Draft In Progress","Internal Review","Submitted","Under Review","Awarded","Implementation","Reporting","Completed"].includes(g.status)},
    {id:"drafts",label:"Drafts & Review",show:["Draft In Progress","Internal Review","Submitted","Under Review","Awarded","Implementation","Reporting","Completed"].includes(g.status)},
    {id:"submission",label:"Submission",show:["Submitted","Under Review","Awarded","Implementation","Reporting","Completed"].includes(g.status)},
    {id:"award",label:"Award & Finance",show:["Awarded","Implementation","Reporting","Completed"].includes(g.status)},
    {id:"impl",label:"Implementation",show:["Implementation","Reporting","Completed"].includes(g.status)},
    {id:"activity",label:"Activity",always:true},
  ].filter(t=>t.always||t.show);

  return(<div style={{position:"fixed",inset:0,background:"#060c14",zIndex:50,display:"flex",flexDirection:"column",overflow:"hidden"}}>
    <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>

    {/* TOP BAR */}
    <div style={{flexShrink:0,borderBottom:"1px solid rgba(200,131,42,0.2)",padding:"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"linear-gradient(135deg,#07101c,#060c14)",gap:14,flexWrap:"wrap"}}>
      <div style={{display:"flex",alignItems:"center",gap:14,minWidth:0}}>
        <button onClick={onClose} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:7,color:"#5a6a7a",padding:"7px 14px",cursor:"pointer",fontSize:12,fontFamily:"inherit",whiteSpace:"nowrap",flexShrink:0}}>← Back</button>
        <div style={{minWidth:0}}>
          <div style={{fontSize:9,color:"#c8832a",letterSpacing:4}}>GRANT OPPORTUNITY</div>
          <h2 style={{fontFamily:"Georgia,serif",fontSize:20,color:"#f0e0c0",fontWeight:700,margin:0,lineHeight:1.2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"min(600px,50vw)"}}>{g.grantName}</h2>
          <div style={{fontSize:12,color:"#3a4a5a",marginTop:1}}>{g.funderName}</div>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0,flexWrap:"wrap"}}>
        {days!==null&&days<=21&&<div style={{background:UC[uc].bg,border:`1px solid ${UC[uc].b}`,borderRadius:7,padding:"5px 12px",fontSize:11,fontWeight:700,color:UC[uc].t}}>{days<=0?"OVERDUE":`${days}d deadline`}</div>}
        {myNotifs.length>0&&<div style={{background:"rgba(200,131,42,0.15)",border:"1px solid rgba(200,131,42,0.35)",borderRadius:7,padding:"5px 12px",fontSize:11,color:"#c8832a"}}>🔔 {myNotifs.length} new</div>}
        <button onClick={()=>setShowEdit(true)} style={{background:"linear-gradient(135deg,rgba(200,131,42,0.25),rgba(200,131,42,0.1))",border:"1px solid rgba(200,131,42,0.35)",borderRadius:7,color:"#c8832a",padding:"7px 16px",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit"}}>✏ EDIT</button>
        <button onClick={()=>setConfirmArch(true)} style={{background:"transparent",border:"1px solid rgba(255,255,255,0.1)",borderRadius:7,color:"#4a5a4a",padding:"7px 12px",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>📦 Archive</button>
        <button onClick={()=>setConfirmDel(true)} style={{background:"transparent",border:"1px solid rgba(180,40,30,0.25)",borderRadius:7,color:"#6a2a2a",padding:"7px 12px",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>🗑 Delete</button>
      </div>
    </div>

    {/* STAGE PROGRESS */}
    <div style={{flexShrink:0,padding:"8px 16px",background:"rgba(7,16,28,0.8)",borderBottom:"1px solid rgba(255,255,255,0.04)",display:"flex",alignItems:"center",gap:6,overflowX:"auto"}}>
      <div style={{display:"flex",flex:1,overflowX:"auto",gap:0}}>
        {STAGES_ACTIVE.map((s,i)=>{
          const cur=s===g.status,past=stIdx>i;const sc2=SC[s];
          return(<div key={s} style={{display:"flex",alignItems:"center",flexShrink:0}}>
            <button onClick={()=>save({status:s,activities:[...(g.activities||[]),{ts:new Date().toISOString(),author:currentUser||"System",type:"advance",content:`Stage changed to ${s}`}]})} style={{padding:"5px 10px",fontSize:10,cursor:"pointer",background:cur?sc2.bg:"transparent",border:cur?`1px solid ${sc2.border}`:"1px solid transparent",borderRadius:5,color:cur?sc2.text:past?"#2a3a2a":"#1a2a3a",fontWeight:cur?700:400,whiteSpace:"nowrap",letterSpacing:0.5,fontFamily:"inherit",transition:"all 0.15s"}}>{STAGE_GUIDE[s]?.icon} {s}</button>
            {i<STAGES_ACTIVE.length-1&&<span style={{color:"#1a2a3a",fontSize:10}}>›</span>}
          </div>);
        })}
      </div>
      <div style={{display:"flex",gap:6,flexShrink:0}}>
        {prevStage&&<button onClick={()=>save({status:prevStage,activities:[...(g.activities||[]),{ts:new Date().toISOString(),author:currentUser||"System",type:"advance",content:`Moved back to ${prevStage}`}]})} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:7,color:"#3a4a5a",padding:"5px 12px",cursor:"pointer",fontSize:11,fontFamily:"inherit",whiteSpace:"nowrap"}}>← Back</button>}
        {nextStage&&<button onClick={()=>save({status:nextStage,activities:[...(g.activities||[]),{ts:new Date().toISOString(),author:currentUser||"System",type:"advance",content:`Advanced to ${nextStage}`}]})} style={{background:"linear-gradient(135deg,#c8832a,#a06020)",border:"none",borderRadius:7,color:"#fff",padding:"5px 16px",cursor:"pointer",fontSize:11,fontWeight:700,letterSpacing:1,fontFamily:"inherit",whiteSpace:"nowrap"}}>→ {nextStage}</button>}
      </div>
    </div>

    {/* BODY */}
    <div style={{flex:1,display:"flex",overflow:"hidden"}}>
      {/* LEFT META PANEL */}
      <div style={{width:280,flexShrink:0,borderRight:"1px solid rgba(255,255,255,0.05)",overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:12}}>
        {/* Tags */}
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
          <span style={{fontSize:11,padding:"3px 9px",borderRadius:7,background:sc.bg,color:sc.text,border:`1px solid ${sc.border}`,fontWeight:600}}>{STAGE_GUIDE[g.status]?.icon} {g.status}</span>
          {pc&&<span style={{fontSize:11,padding:"3px 9px",borderRadius:7,background:pc.bg,color:pc.t,border:`1px solid ${pc.b}`}}>{(g.pillar||"").split("&")[0].trim().substring(0,16)}</span>}
          {g.lead&&<span style={{fontSize:11,padding:"3px 9px",borderRadius:7,background:"rgba(255,255,255,0.04)",color:"#6a8a9a",border:"1px solid rgba(255,255,255,0.08)"}}>👤 {g.lead}</span>}
          <Stars value={g.stars||0} size={13}/>
        </div>
        {/* Stage tip */}
        {STAGE_GUIDE[g.status]&&<div style={{background:"rgba(200,131,42,0.05)",border:"1px solid rgba(200,131,42,0.12)",borderRadius:9,padding:"10px 13px"}}>
          <div style={{fontSize:11,color:"#c8832a",fontWeight:700,marginBottom:4}}>📋 What to do now:</div>
          <div style={{fontSize:12,color:"#7a7a6a",lineHeight:1.75}}>{STAGE_GUIDE[g.status].tip}</div>
        </div>}
        {/* Description */}
        {g.description&&<div style={{fontSize:12,color:"#6a7a5a",lineHeight:1.8}}>{g.description}</div>}
        {/* Deadlines */}
        <div>
          <div style={{fontSize:10,color:"#3a4a3a",letterSpacing:2,fontWeight:700,marginBottom:7}}>DEADLINES</div>
          {[["LOI",g.loiDeadline],["Full Proposal",g.fullDeadline],["Internal Review",g.internalDeadline]].filter(([,d])=>d).map(([l,d])=>{
            const dy=daysUntil(d);const u=urgCls(dy);
            return(<div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 10px",background:UC[u].bg,border:`1px solid ${UC[u].b}`,borderRadius:7,marginBottom:5}}>
              <div><div style={{fontSize:10,color:"#6a7a6a"}}>{l}</div><div style={{fontSize:12,color:"#c0b0a0",fontFamily:"Georgia,serif"}}>{fd(d)}</div></div>
              <span style={{fontSize:11,fontWeight:700,color:UC[u].t}}>{dy!==null?(dy<=0?"OVERDUE":`${dy}d`):"—"}</span>
            </div>);
          })}
        </div>
        {/* Financials */}
        {(g.amountRequested||g.awardAmount)&&<div>
          <div style={{fontSize:10,color:"#3a4a3a",letterSpacing:2,fontWeight:700,marginBottom:7}}>FINANCIALS</div>
          {[["Requested",g.amountRequested],["Budget",g.totalBudget],["Awarded",g.awardAmount]].filter(([,v])=>v).map(([l,v])=>(<div key={l} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid rgba(255,255,255,0.03)"}}><span style={{fontSize:11,color:"#3a4a3a"}}>{l}</span><span style={{fontSize:13,fontFamily:"Georgia,serif",color:"#c8a060",fontWeight:600}}>{v}</span></div>))}
        </div>}
        {/* Contact */}
        {(g.contactName||g.contactEmail)&&<div>
          <div style={{fontSize:10,color:"#3a4a3a",letterSpacing:2,fontWeight:700,marginBottom:7}}>CONTACT</div>
          {[["NAME",g.contactName],["ROLE",g.contactRole||""],["EMAIL",g.contactEmail],["PHONE",g.contactPhone]].filter(([,v])=>v).map(([l,v])=>(<div key={l} style={{display:"flex",gap:8,marginBottom:3}}><span style={{fontSize:10,color:"#2a3a4a",width:40,flexShrink:0}}>{l}</span>{l==="EMAIL"?<a href={`mailto:${v}`} style={{fontSize:11,color:"#5a80a0"}}>{v}</a>:<span style={{fontSize:12,color:"#7a8a9a"}}>{v}</span>}</div>))}
          {g.applicationURL&&<a href={g.applicationURL} target="_blank" rel="noopener noreferrer" style={{display:"block",background:"rgba(200,131,42,0.08)",border:"1px solid rgba(200,131,42,0.2)",borderRadius:7,padding:"7px 11px",fontSize:11,color:"#c8a060",textDecoration:"none",marginTop:7,textAlign:"center"}}>↗ OPEN APPLICATION PORTAL</a>}
        </div>}
        {/* Quick note */}
        <div style={{marginTop:"auto"}}>
          <select defaultValue={currentUser||team[0]} onChange={e=>{noteAuthor.current=e.target.value;}} style={{...I,padding:"6px 10px",fontSize:11,marginBottom:6}}>{team.map(m=><option key={m}>{m}</option>)}</select>
          <textarea value={note} onChange={e=>setNote(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&e.ctrlKey)addNote();}} placeholder="Add a note… (Ctrl+Enter)" style={{...I,resize:"vertical",height:70,fontSize:12,padding:"9px 12px"}}/>
          <button onClick={addNote} disabled={!note.trim()} style={{width:"100%",marginTop:7,background:"linear-gradient(135deg,#c8832a,#a06020)",border:"none",borderRadius:8,color:"#fff",padding:"9px",fontSize:12,fontWeight:700,cursor:"pointer",letterSpacing:2,fontFamily:"inherit"}}>LOG</button>
        </div>
      </div>

      {/* RIGHT CONTENT */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{flexShrink:0,borderBottom:"1px solid rgba(255,255,255,0.05)",padding:"0 16px",display:"flex",gap:0,overflowX:"auto"}}>
          {stageTabs.map(t=>(<button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"11px 15px",fontSize:12,cursor:"pointer",background:"transparent",border:"none",borderBottom:tab===t.id?"2px solid #c8832a":"2px solid transparent",color:tab===t.id?"#c8832a":"#3a4a5a",whiteSpace:"nowrap",fontFamily:"inherit"}}>{t.label}</button>))}
        </div>
        <div style={{flex:1,overflowY:"auto",padding:20,animation:"fadeIn 0.2s ease"}}>
          {tab==="overview"&&<OverviewTab g={g}/>}
          {tab==="documents"&&<DocsTab g={g} onSave={save}/>}
          {tab==="research"&&<ResearchTab g={g} team={team} currentUser={currentUser} onSave={save}/>}
          {tab==="drafts"&&<DraftsTab g={g} team={team} currentUser={currentUser} onSave={save} onNotify={onNotify}/>}
          {tab==="submission"&&<SubmissionTab g={g} onSave={save}/>}
          {tab==="award"&&<AwardTab g={g} onSave={save}/>}
          {tab==="impl"&&<ImplTab g={g} team={team} currentUser={currentUser} onSave={save}/>}
          {tab==="activity"&&<ActivityTab g={g}/>}
        </div>
      </div>
    </div>

    {/* MODALS */}
    {showEdit&&<GrantModal initial={g} team={team} onSave={updated=>save(updated)} onClose={()=>setShowEdit(false)}/>}
    {confirmArch&&<ConfirmModal title="Archive this grant?" body="It will be hidden from active views but kept in records. Restore any time via 'Show Archived'." onConfirm={()=>{onArchive(g.id);onClose();}} onCancel={()=>setConfirmArch(false)} confirmLabel="Archive" confirmStyle={{background:"rgba(200,131,42,0.15)",border:"1px solid rgba(200,131,42,0.3)",color:"#c8832a"}}/>}
    {confirmDel&&<ConfirmModal title="Delete this grant permanently?" body={`All data, notes, documents and history for "${g.grantName}" will be permanently removed. This cannot be undone.`} onConfirm={()=>{onDelete(g.id);onClose();}} onCancel={()=>setConfirmDel(false)} confirmLabel="Delete Permanently" confirmStyle={{background:"rgba(180,40,30,0.2)",border:"1px solid rgba(180,40,30,0.4)",color:"#ff8070"}}/>}
  </div>);
}

function ConfirmModal({title,body,onConfirm,onCancel,confirmLabel,confirmStyle}){
  return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:80}}>
    <div style={{background:"#0a1525",border:"1px solid rgba(200,131,42,0.3)",borderRadius:13,padding:28,maxWidth:420,width:"90%"}}>
      <div style={{fontFamily:"Georgia,serif",fontSize:16,color:"#e0d0b0",fontWeight:700,marginBottom:10}}>{title}</div>
      <div style={{fontSize:13,color:"#5a6a5a",marginBottom:18,lineHeight:1.8}}>{body}</div>
      <div style={{display:"flex",gap:9}}>
        <button onClick={onCancel} style={{flex:1,background:"transparent",border:"1px solid rgba(255,255,255,0.1)",borderRadius:7,color:"#5a6a7a",padding:"9px",cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
        <button onClick={onConfirm} style={{flex:1,padding:"9px",fontWeight:700,cursor:"pointer",borderRadius:7,fontFamily:"inherit",...confirmStyle}}>{confirmLabel}</button>
      </div>
    </div>
  </div>);
}


// ── TAB CONTENT COMPONENTS ────────────────────────────────────────────────────
function OverviewTab({g}){
  const pc=PC[g.pillar];
  return(<div style={{display:"grid",gap:14,maxWidth:900}}>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
      {[{l:"REQUESTED",v:g.amountRequested||"TBD",c:"#c8a060"},{l:"BUDGET",v:g.totalBudget||"TBD",c:"#c8a060"},{l:"MATCH REQ.",v:g.matchReq?g.matchReq+"%":"None",c:"#7a8a9a"}].map(s=>(<div key={s.l} style={CB}><div style={{fontSize:9,color:"#3a4a3a",letterSpacing:2,marginBottom:6}}>{s.l}</div><div style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:s.c}}>{s.v}</div></div>))}
    </div>
    <div style={CB}>
      <div style={{fontSize:10,color:"#3a4a3a",letterSpacing:2,fontWeight:700,marginBottom:10}}>TEAM</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
        {[["LEAD",g.lead||"—"],["SUPPORT",(g.support||[]).join(", ")||"—"],["STAGE",g.status]].map(([l,v])=>(<div key={l}><div style={{fontSize:9,color:"#2a3a4a",letterSpacing:2,marginBottom:3}}>{l}</div><div style={{fontSize:13,color:"#8a9aaa"}}>{v}</div></div>))}
      </div>
    </div>
    {(g.sectors||[]).length>0&&<div style={CB}><div style={{fontSize:10,color:"#3a4a3a",letterSpacing:2,fontWeight:700,marginBottom:10}}>SECTORS</div><div style={{display:"flex",flexWrap:"wrap",gap:7}}>{g.sectors.map(s=>(<span key={s} style={{fontSize:12,padding:"4px 11px",borderRadius:20,background:"rgba(80,100,160,0.15)",border:"1px solid rgba(80,100,160,0.3)",color:"#7a90d0"}}>{s}</span>))}</div></div>}
  </div>);
}

function DocsTab({g,onSave}){
  return(<div style={{display:"grid",gap:16,maxWidth:800}}>
    <div style={{fontFamily:"Georgia,serif",fontSize:16,color:"#e0d0b0",fontWeight:700}}>Document Checklist</div>
    <div style={CB}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontSize:10,color:"#3a4a3a",letterSpacing:2,fontWeight:700}}>APPLICATION DOCUMENTS</div>
        <div style={{fontSize:12,color:"#c8a060",fontWeight:600}}>{(g.docs||[]).filter(d=>d.done).length}/{(g.docs||[]).length} ready</div>
      </div>
      {(g.docs||[]).map((doc,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:10,background:doc.done?"rgba(40,160,80,0.05)":"rgba(255,255,255,0.03)",borderRadius:8,padding:"10px 13px",border:`1px solid ${doc.done?"rgba(40,160,80,0.2)":"rgba(255,255,255,0.07)"}`,marginBottom:7}}>
          <input type="checkbox" checked={doc.done} onChange={()=>{const dl=[...g.docs];dl[i]={...dl[i],done:!dl[i].done};onSave({docs:dl});}} style={{width:15,height:15,accentColor:"#c8832a",cursor:"pointer",flexShrink:0}}/>
          <span style={{flex:1,fontSize:13,color:doc.done?"#3a5a3a":"#c0b0a0",textDecoration:doc.done?"line-through":"none"}}>{doc.name||<em style={{color:"#2a3a4a"}}>Unnamed document</em>}</span>
          {doc.file?<><FTag file={doc.file}/><button onClick={()=>{const dl=[...g.docs];dl[i]={...dl[i],file:null};onSave({docs:dl});}} style={{background:"none",border:"none",color:"#3a2a2a",cursor:"pointer",fontSize:11}}>remove</button></>:<UploadBtn label="Attach" onFile={file=>{const dl=[...g.docs];dl[i]={...dl[i],file,done:true};onSave({docs:dl});}}/>}
        </div>
      ))}
      <button onClick={()=>onSave({docs:[...(g.docs||[]),{name:"",done:false,file:null}]})} style={{marginTop:7,background:"transparent",border:"1px dashed rgba(200,131,42,0.3)",borderRadius:7,color:"#c8832a",padding:"8px 14px",fontSize:12,cursor:"pointer",letterSpacing:1,fontFamily:"inherit",width:"100%"}}>+ ADD DOCUMENT</button>
    </div>
    <div style={CB}>
      <div style={{fontSize:10,color:"#3a4a3a",letterSpacing:2,fontWeight:700,marginBottom:12}}>ORGANISATIONAL COMPLIANCE</div>
      {(g.compliance||[]).map((doc,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
          <input type="checkbox" checked={doc.done} onChange={()=>{const dl=[...g.compliance];dl[i]={...dl[i],done:!dl[i].done};onSave({compliance:dl});}} style={{width:14,height:14,accentColor:"#c8832a",cursor:"pointer",flexShrink:0}}/>
          <span style={{flex:1,fontSize:13,color:doc.done?"#3a5a3a":"#8a9aaa",textDecoration:doc.done?"line-through":"none"}}>{doc.name}</span>
          {doc.file?<FTag file={doc.file} onRemove={()=>{const dl=[...g.compliance];dl[i]={...dl[i],file:null};onSave({compliance:dl});}}/>:<UploadBtn label="Upload" onFile={file=>{const dl=[...g.compliance];dl[i]={...dl[i],file,done:true};onSave({compliance:dl});}}/>}
        </div>
      ))}
    </div>
  </div>);
}

function ResearchTab({g,team,currentUser,onSave}){
  const[text,setText]=useState("");const[author,setAuthor]=useState(currentUser||team[0]);
  function add(){if(!text.trim())return;onSave({researchNotes:[...(g.researchNotes||[]),{id:uid(),content:text,author,date:new Date().toISOString(),files:[]}]});setText("");}
  return(<div style={{display:"grid",gap:16,maxWidth:800}}>
    <div style={{fontFamily:"Georgia,serif",fontSize:16,color:"#e0d0b0",fontWeight:700}}>Research Notes & Intelligence</div>
    <div style={{background:"rgba(200,131,42,0.04)",border:"1px solid rgba(200,131,42,0.12)",borderRadius:11,padding:"12px 16px",fontSize:12,color:"#7a6a5a",lineHeight:1.8}}>📚 <strong style={{color:"#c8832a"}}>Researching stage:</strong> Gather all intelligence before writing. Find past grantees, identify programme officer, download guidelines, note the funder's exact language and priorities.</div>
    <div style={CB}>
      <div style={{fontSize:10,color:"#3a4a3a",letterSpacing:2,fontWeight:700,marginBottom:10}}>ADD RESEARCH NOTE</div>
      <select value={author} onChange={e=>setAuthor(e.target.value)} style={{...I,fontSize:12,padding:"7px 10px",marginBottom:9,width:"auto"}}>{team.map(m=><option key={m}>{m}</option>)}</select>
      <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Research findings, past grantees, programme officer name, funder priorities, key language to use…" style={{...I,resize:"vertical",height:90,fontSize:12,marginBottom:9}}/>
      <button onClick={add} disabled={!text.trim()} style={{background:"linear-gradient(135deg,#c8832a,#a06020)",border:"none",borderRadius:8,color:"#fff",padding:"9px 20px",fontSize:12,fontWeight:700,cursor:"pointer",letterSpacing:2,fontFamily:"inherit"}}>SAVE NOTE</button>
    </div>
    {(g.researchNotes||[]).map((rn,i)=>(
      <div key={rn.id||i} style={CB}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <span style={{fontSize:12,color:"#c8832a",fontWeight:600}}>{rn.author}</span>
          <div style={{display:"flex",gap:9,alignItems:"center"}}>
            <span style={{fontSize:11,color:"#2a3a4a"}}>{fts(rn.date)}</span>
            <button onClick={()=>onSave({researchNotes:(g.researchNotes||[]).filter((_,j)=>j!==i)})} style={{background:"none",border:"none",color:"#3a2a2a",cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>remove</button>
          </div>
        </div>
        <div style={{fontSize:13,color:"#8a8a7a",lineHeight:1.75,whiteSpace:"pre-wrap"}}>{rn.content}</div>
        {(rn.files||[]).length>0&&<div style={{marginTop:8,display:"flex",flexWrap:"wrap",gap:7}}>{rn.files.map((f,fi)=><FTag key={fi} file={f} onRemove={()=>{const u=[...(g.researchNotes||[])];u[i]={...u[i],files:u[i].files.filter((_,j)=>j!==fi)};onSave({researchNotes:u});}}/>)}</div>}
        <div style={{marginTop:9}}><UploadBtn label="Attach Research Document" onFile={file=>{const u=[...(g.researchNotes||[])];u[i]={...u[i],files:[...(u[i].files||[]),file]};onSave({researchNotes:u});}}/></div>
      </div>
    ))}
    {(g.researchNotes||[]).length===0&&<div style={{fontSize:13,color:"#2a3a4a",fontStyle:"italic",textAlign:"center",padding:30}}>No research notes yet. Add your first finding above.</div>}
  </div>);
}

function DraftsTab({g,team,currentUser,onSave,onNotify}){
  const[reviewTarget,setReviewTarget]=useState(team.find(m=>m!==currentUser)||team[0]);
  const[dnotes,setDnotes]=useState("");
  function addDraft(file){
    const dv={id:uid(),name:file.name,date:new Date().toISOString(),author:currentUser||team[0],notes:dnotes,sentTo:"",sentDate:"",reviewNotes:"",reviewedBy:"",reviewDate:"",file};
    onSave({drafts:[...(g.drafts||[]),dv]});setDnotes("");
  }
  function sendForReview(dvId){
    const updated=(g.drafts||[]).map(dv=>dv.id===dvId?{...dv,sentTo:reviewTarget,sentDate:new Date().toISOString()}:dv);
    onSave({drafts:updated});
    onNotify({to:reviewTarget,from:currentUser||team[0],type:"review_request",grantName:g.grantName,grantId:g.id,message:`${currentUser||team[0]} has sent a draft of "${g.grantName}" for your review.`,ts:new Date().toISOString(),read:false});
  }
  function submitReview(dvId,notes){
    const dv=(g.drafts||[]).find(d=>d.id===dvId);
    const updated=(g.drafts||[]).map(d=>d.id===dvId?{...d,reviewNotes:notes,reviewedBy:currentUser||team[0],reviewDate:new Date().toISOString()}:d);
    onSave({drafts:updated});
    if(dv?.author)onNotify({to:dv.author,from:currentUser||team[0],type:"review_complete",grantName:g.grantName,grantId:g.id,message:`${currentUser||team[0]} has reviewed your draft of "${g.grantName}". Click to see feedback.`,ts:new Date().toISOString(),read:false});
  }
  return(<div style={{display:"grid",gap:16,maxWidth:800}}>
    <div style={{fontFamily:"Georgia,serif",fontSize:16,color:"#e0d0b0",fontWeight:700}}>Drafts & Internal Review</div>
    <div style={{background:"rgba(200,131,42,0.04)",border:"1px solid rgba(200,131,42,0.12)",borderRadius:11,padding:"12px 16px",fontSize:12,color:"#7a6a5a",lineHeight:1.8}}>✍️ Upload your draft, then send it to a colleague for review. They will receive a notification when they log in. Feedback is tracked and sent back automatically.</div>
    <div style={CB}>
      <div style={{fontSize:10,color:"#3a4a3a",letterSpacing:2,fontWeight:700,marginBottom:10}}>UPLOAD NEW DRAFT</div>
      <textarea value={dnotes} onChange={e=>setDnotes(e.target.value)} placeholder="Version notes — what was changed, what needs review…" style={{...I,resize:"vertical",height:65,fontSize:12,marginBottom:9}}/>
      <UploadBtn label="UPLOAD DRAFT DOCUMENT" onFile={file=>addDraft(file)}/>
    </div>
    {(g.drafts||[]).map((dv,i)=>(
      <div key={dv.id||i} style={{...CB,borderColor:dv.reviewNotes?"rgba(40,160,80,0.3)":dv.sentTo?"rgba(200,131,42,0.3)":"rgba(200,131,42,0.16)"}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10,marginBottom:10}}>
          <div style={{minWidth:0}}>
            <div style={{fontSize:14,color:"#c0b0a0",fontWeight:600,fontFamily:"Georgia,serif",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{dv.name}</div>
            <div style={{fontSize:11,color:"#3a4a5a",marginTop:2}}>By {dv.author} · {fts(dv.date)}</div>
            {dv.notes&&<div style={{fontSize:12,color:"#6a7a5a",marginTop:4,lineHeight:1.6}}>{dv.notes}</div>}
          </div>
          <div style={{flexShrink:0}}>
            {!dv.sentTo&&!dv.reviewNotes&&<div style={{display:"flex",gap:6,alignItems:"center"}}>
              <select value={reviewTarget} onChange={e=>setReviewTarget(e.target.value)} style={{...I,padding:"4px 8px",fontSize:11,width:"auto"}}>{team.filter(m=>m!==dv.author).map(m=><option key={m}>{m}</option>)}</select>
              <button onClick={()=>sendForReview(dv.id)} style={{background:"linear-gradient(135deg,rgba(80,100,180,0.3),rgba(80,100,180,0.15))",border:"1px solid rgba(80,100,180,0.4)",borderRadius:7,color:"#8090d0",padding:"5px 12px",cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:"inherit",whiteSpace:"nowrap"}}>📨 Send for Review</button>
            </div>}
            {dv.sentTo&&!dv.reviewNotes&&<span style={{fontSize:11,padding:"4px 9px",background:"rgba(200,131,42,0.08)",border:"1px solid rgba(200,131,42,0.2)",borderRadius:6,color:"#c8a060"}}>⏳ Sent to {dv.sentTo}</span>}
            {dv.reviewNotes&&<span style={{fontSize:11,padding:"4px 9px",background:"rgba(40,160,80,0.08)",border:"1px solid rgba(40,160,80,0.2)",borderRadius:6,color:"#60c880"}}>✅ Reviewed by {dv.reviewedBy}</span>}
          </div>
        </div>
        {dv.reviewNotes&&<div style={{background:"rgba(40,160,80,0.04)",border:"1px solid rgba(40,160,80,0.15)",borderRadius:8,padding:"10px 13px",marginTop:8}}>
          <div style={{fontSize:10,color:"#3a5a3a",letterSpacing:2,fontWeight:700,marginBottom:4}}>REVIEW FEEDBACK — {dv.reviewedBy} · {fts(dv.reviewDate)}</div>
          <div style={{fontSize:13,color:"#6a8a6a",lineHeight:1.75,whiteSpace:"pre-wrap"}}>{dv.reviewNotes}</div>
        </div>}
        {dv.sentTo===currentUser&&!dv.reviewNotes&&<ReviewInput onSubmit={notes=>submitReview(dv.id,notes)}/>}
      </div>
    ))}
    {(g.drafts||[]).length===0&&<div style={{fontSize:13,color:"#2a3a4a",fontStyle:"italic",textAlign:"center",padding:30}}>No drafts yet. Upload the first version above.</div>}
  </div>);
}

function ReviewInput({onSubmit}){
  const[notes,setNotes]=useState("");
  return(<div style={{marginTop:10}}>
    <div style={{fontSize:11,color:"#c8832a",fontWeight:700,marginBottom:7}}>📝 You have been asked to review this draft — enter your feedback below:</div>
    <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Enter your review feedback, suggested edits, tracked changes notes…" style={{...I,resize:"vertical",height:80,fontSize:12,marginBottom:8}}/>
    <button onClick={()=>{if(notes.trim())onSubmit(notes);}} style={{background:"linear-gradient(135deg,rgba(40,160,80,0.3),rgba(40,160,80,0.15))",border:"1px solid rgba(40,160,80,0.4)",borderRadius:7,color:"#60c880",padding:"7px 16px",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit"}}>✅ Submit Review</button>
  </div>);
}

function SubmissionTab({g,onSave}){
  const[form,setForm]=useState(g.submission||{date:new Date().toISOString().slice(0,10),method:"Online portal",confirmNum:"",portalURL:"",submittedBy:"",notes:"",files:[]});
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  return(<div style={{display:"grid",gap:16,maxWidth:800}}>
    <div style={{fontFamily:"Georgia,serif",fontSize:16,color:"#e0d0b0",fontWeight:700}}>Submission Record</div>
    <div style={{background:"rgba(200,131,42,0.04)",border:"1px solid rgba(200,131,42,0.12)",borderRadius:11,padding:"12px 16px",fontSize:12,color:"#7a6a5a",lineHeight:1.8}}>📤 Log every submission detail. Upload the submitted documents. Record confirmation numbers and portal references as proof of submission.</div>
    <div style={CB}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div><label style={L}>Submission Date</label><input type="date" style={I} value={form.date} onChange={e=>f("date",e.target.value)}/></div>
        <div><label style={L}>Method</label><select style={{...I,cursor:"pointer"}} value={form.method} onChange={e=>f("method",e.target.value)}><option>Online portal</option><option>Email</option><option>Hand delivery</option><option>Post</option></select></div>
        <div><label style={L}>Confirmation Number</label><input style={I} value={form.confirmNum||""} onChange={e=>f("confirmNum",e.target.value)} placeholder="e.g. REF-2026-00312"/></div>
        <div><label style={L}>Submitted By</label><input style={I} value={form.submittedBy||""} onChange={e=>f("submittedBy",e.target.value)}/></div>
        <div style={{gridColumn:"span 2"}}><label style={L}>Portal / Submission URL</label><input style={I} value={form.portalURL||""} onChange={e=>f("portalURL",e.target.value)} placeholder="https://..."/></div>
        <div style={{gridColumn:"span 2"}}><label style={L}>Notes</label><textarea style={{...I,resize:"vertical",height:65}} value={form.notes||""} onChange={e=>f("notes",e.target.value)} placeholder="Confirmation messages, next steps, acknowledgement from funder…"/></div>
      </div>
      <div style={{marginTop:12}}>
        <div style={{fontSize:10,color:"#3a4a3a",letterSpacing:2,fontWeight:700,marginBottom:8}}>SUBMITTED DOCUMENTS</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:9}}>{(form.files||[]).map((f2,i)=><FTag key={i} file={f2} onRemove={()=>setForm(p=>({...p,files:p.files.filter((_,j)=>j!==i)}))}/>)}</div>
        <UploadBtn label="ATTACH SUBMITTED DOCUMENT" onFile={file=>setForm(p=>({...p,files:[...(p.files||[]),file]}))}/>
      </div>
      <button onClick={()=>onSave({submission:form,submissionNum:form.confirmNum})} style={{marginTop:14,background:"linear-gradient(135deg,#c8832a,#a06020)",border:"none",borderRadius:8,color:"#fff",padding:"9px 22px",fontSize:12,fontWeight:700,cursor:"pointer",letterSpacing:2,fontFamily:"inherit"}}>SAVE SUBMISSION RECORD</button>
    </div>
  </div>);
}


function AwardTab({g,onSave}){
  const[award,setAward]=useState(g.award||{letterDate:"",amount:"",startDate:"",endDate:"",reportCycle:"Quarterly",contact:"",conditions:"",files:[]});
  const[disb,setDisb]=useState({date:new Date().toISOString().slice(0,10),amount:"",tranche:"",status:"Pending",notes:""});
  const[bline,setBline]=useState({category:"Personnel",budgeted:"",spent:"",notes:""});
  const af=(k,v)=>setAward(p=>({...p,[k]:v}));
  const df=(k,v)=>setDisb(p=>({...p,[k]:v}));
  const bf=(k,v)=>setBline(p=>({...p,[k]:v}));
  const totalB=(g.budget||[]).reduce((s,b)=>s+(parseFloat(b.budgeted)||0),0);
  const totalS=(g.budget||[]).reduce((s,b)=>s+(parseFloat(b.spent)||0),0);
  const totalDisbRec=(g.disbursements||[]).filter(d=>d.status==="Received").reduce((s,d)=>s+(parseFloat(d.amount)||0),0);
  const awardAmt=parseFloat((award.amount||"").replace(/[^0-9.]/g,""))||0;
  return(<div style={{display:"grid",gap:16,maxWidth:900}}>
    <div style={{fontFamily:"Georgia,serif",fontSize:16,color:"#e0d0b0",fontWeight:700}}>Award & Financial Monitoring</div>
    <div style={{background:"rgba(40,160,80,0.04)",border:"1px solid rgba(40,160,80,0.15)",borderRadius:11,padding:"12px 16px",fontSize:12,color:"#4a7a5a",lineHeight:1.8}}>
      🏆 <strong style={{color:"#60c880"}}>This section proves financial accountability to funders.</strong> By maintaining a complete award record, disbursement tracker, and budget vs actuals, you demonstrate that RGN has the systems in place to manage grant funds responsibly — a critical requirement for future funding.
    </div>
    {awardAmt>0&&<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
      {[{l:"AWARD",v:award.amount,c:"#60c880"},{l:"DISBURSED",v:`R${totalDisbRec.toLocaleString()}`,c:"#c8a060"},{l:"OUTSTANDING",v:`R${Math.max(0,awardAmt-totalDisbRec).toLocaleString()}`,c:"#ff9070"},{l:"BUDGET USED",v:totalB>0?Math.round((totalS/totalB)*100)+"%":"—",c:totalB>0&&totalS/totalB>0.9?"#ff9070":"#60c880"}].map(s=>(<div key={s.l} style={CB}><div style={{fontSize:9,color:"#3a4a3a",letterSpacing:2,marginBottom:5}}>{s.l}</div><div style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:s.c}}>{s.v}</div></div>))}
    </div>}
    {/* Award details */}
    <div style={CB}>
      <div style={{fontSize:10,color:"#3a4a3a",letterSpacing:2,fontWeight:700,marginBottom:12}}>AWARD DETAILS</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
        {[["Award Letter Date","letterDate","date"],["Award Amount","amount","text"],["Grant Start Date","startDate","date"],["Grant End Date","endDate","date"],["Funder Contact","contact","text"]].map(([l,k,t])=>(<div key={k}><label style={L}>{l}</label><input type={t} style={I} value={award[k]||""} onChange={e=>af(k,e.target.value)}/></div>))}
        <div><label style={L}>Reporting Cycle</label><select style={{...I,cursor:"pointer"}} value={award.reportCycle||"Quarterly"} onChange={e=>af("reportCycle",e.target.value)}><option>Monthly</option><option>Quarterly</option><option>Bi-annual</option><option>Annual</option></select></div>
        <div style={{gridColumn:"span 3"}}><label style={L}>Special Conditions</label><textarea style={{...I,resize:"vertical",height:55}} value={award.conditions||""} onChange={e=>af("conditions",e.target.value)}/></div>
      </div>
      <div style={{marginTop:12}}>
        <div style={{fontSize:10,color:"#3a4a3a",letterSpacing:2,fontWeight:700,marginBottom:8}}>AWARD DOCUMENTS</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:9}}>{(award.files||[]).map((f,i)=><FTag key={i} file={f} onRemove={()=>setAward(p=>({...p,files:p.files.filter((_,j)=>j!==i)}))}/>)}</div>
        <UploadBtn label="ATTACH AWARD LETTER / AGREEMENT" onFile={file=>setAward(p=>({...p,files:[...(p.files||[]),file]}))}/>
      </div>
      <button onClick={()=>onSave({award,awardAmount:award.amount,awardDate:award.letterDate})} style={{marginTop:14,background:"linear-gradient(135deg,#c8832a,#a06020)",border:"none",borderRadius:8,color:"#fff",padding:"9px 22px",fontSize:12,fontWeight:700,cursor:"pointer",letterSpacing:2,fontFamily:"inherit"}}>SAVE AWARD DETAILS</button>
    </div>
    {/* Disbursements */}
    <div style={CB}>
      <div style={{fontSize:10,color:"#3a4a3a",letterSpacing:2,fontWeight:700,marginBottom:12}}>DISBURSEMENT TRACKER</div>
      {(g.disbursements||[]).map((d,i)=>(
        <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr auto",gap:8,alignItems:"center",padding:"9px 12px",background:"rgba(255,255,255,0.03)",borderRadius:8,border:"1px solid rgba(255,255,255,0.06)",marginBottom:7}}>
          {[["TRANCHE",d.tranche||"—"],["AMOUNT",d.amount],["DATE",fd(d.date)]].map(([l,v])=>(<div key={l}><div style={{fontSize:9,color:"#2a3a4a",letterSpacing:1}}>{l}</div><div style={{fontFamily:"Georgia,serif",fontSize:13,color:"#c8a060"}}>{v}</div></div>))}
          <select value={d.status} onChange={e=>{const dl=[...g.disbursements];dl[i]={...dl[i],status:e.target.value};onSave({disbursements:dl});}} style={{...I,padding:"4px 7px",fontSize:11,cursor:"pointer",color:d.status==="Received"?"#60c880":d.status==="Pending"?"#c8a060":"#ff9070"}}><option>Pending</option><option>Received</option><option>Late</option><option>Disputed</option></select>
          <button onClick={()=>onSave({disbursements:g.disbursements.filter((_,j)=>j!==i)})} style={{background:"none",border:"none",color:"#3a2a2a",cursor:"pointer",fontSize:14}}>×</button>
        </div>
      ))}
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr) auto",gap:9,alignItems:"end",marginTop:9}}>
        {[["Tranche","tranche"],["Amount (R)","amount"],["Date","date"],["Notes","notes"]].map(([l,k])=>(<div key={k}><label style={L}>{l}</label><input type={k==="date"?"date":"text"} style={{...I,fontSize:12,padding:"7px 10px"}} value={disb[k]||""} onChange={e=>df(k,e.target.value)}/></div>))}
        <div><label style={L}>Status</label><select style={{...I,fontSize:12,padding:"7px 10px",cursor:"pointer"}} value={disb.status} onChange={e=>df("status",e.target.value)}><option>Pending</option><option>Received</option><option>Late</option></select></div>
        <button onClick={()=>{if(!disb.amount)return;onSave({disbursements:[...(g.disbursements||[]),{...disb}]});setDisb({date:new Date().toISOString().slice(0,10),amount:"",tranche:"",status:"Pending",notes:""});}} style={{background:"rgba(200,131,42,0.12)",border:"1px solid rgba(200,131,42,0.3)",borderRadius:7,color:"#c8832a",padding:"9px 13px",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit"}}>+ ADD</button>
      </div>
    </div>
    {/* Budget vs actuals */}
    <div style={CB}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontSize:10,color:"#3a4a3a",letterSpacing:2,fontWeight:700}}>BUDGET vs ACTUALS</div>
        {totalB>0&&<div style={{fontSize:12,color:"#c8a060"}}>R{totalS.toLocaleString()} of R{totalB.toLocaleString()} used ({Math.round((totalS/totalB)*100)}%)</div>}
      </div>
      {totalB>0&&<div style={{height:8,background:"rgba(255,255,255,0.06)",borderRadius:4,overflow:"hidden",marginBottom:12}}><div style={{width:`${Math.min(100,(totalS/totalB)*100)}%`,height:"100%",background:totalS/totalB>0.9?"linear-gradient(90deg,#ff7060,#ff9070)":"linear-gradient(90deg,#c8832a,#40b060)",borderRadius:4,transition:"width 0.5s"}}/></div>}
      {(g.budget||[]).map((b,i)=>{
        const pct=parseFloat(b.budgeted)>0?(parseFloat(b.spent)||0)/parseFloat(b.budgeted)*100:0;
        return(<div key={i} style={{padding:"9px 12px",background:"rgba(255,255,255,0.03)",borderRadius:8,border:"1px solid rgba(255,255,255,0.06)",marginBottom:7}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
            <span style={{fontSize:12,color:"#c0b0a0"}}>{b.category}</span>
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              <span style={{fontSize:11,color:"#3a4a5a"}}>Budgeted: <strong style={{color:"#c8a060"}}>R{parseFloat(b.budgeted||0).toLocaleString()}</strong></span>
              <span style={{fontSize:11,color:"#3a4a5a"}}>Spent: <strong style={{color:pct>90?"#ff9070":"#60c880"}}>R{parseFloat(b.spent||0).toLocaleString()}</strong></span>
              <button onClick={()=>onSave({budget:g.budget.filter((_,j)=>j!==i)})} style={{background:"none",border:"none",color:"#3a2a2a",cursor:"pointer",fontSize:13}}>×</button>
            </div>
          </div>
          <div style={{height:4,background:"rgba(255,255,255,0.05)",borderRadius:2,overflow:"hidden"}}><div style={{width:`${Math.min(100,pct)}%`,height:"100%",background:pct>100?"#ff6060":pct>80?"#e8a84a":"#40b060"}}/></div>
          {b.notes&&<div style={{fontSize:11,color:"#3a4a5a",marginTop:4}}>{b.notes}</div>}
        </div>);
      })}
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 2fr auto",gap:9,alignItems:"end",marginTop:9}}>
        <div><label style={L}>Category</label><select style={{...I,fontSize:12,padding:"7px 10px",cursor:"pointer"}} value={bline.category} onChange={e=>bf("category",e.target.value)}>{BUDGET_CATS.map(c=><option key={c}>{c}</option>)}</select></div>
        <div><label style={L}>Budgeted (R)</label><input style={{...I,fontSize:12,padding:"7px 10px"}} value={bline.budgeted} onChange={e=>bf("budgeted",e.target.value)} placeholder="0"/></div>
        <div><label style={L}>Spent (R)</label><input style={{...I,fontSize:12,padding:"7px 10px"}} value={bline.spent} onChange={e=>bf("spent",e.target.value)} placeholder="0"/></div>
        <div><label style={L}>Notes</label><input style={{...I,fontSize:12,padding:"7px 10px"}} value={bline.notes} onChange={e=>bf("notes",e.target.value)}/></div>
        <button onClick={()=>{if(!bline.budgeted&&!bline.spent)return;onSave({budget:[...(g.budget||[]),{...bline}]});setBline({category:"Personnel",budgeted:"",spent:"",notes:""});}} style={{background:"rgba(200,131,42,0.12)",border:"1px solid rgba(200,131,42,0.3)",borderRadius:7,color:"#c8832a",padding:"9px 13px",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit"}}>+ ADD</button>
      </div>
    </div>
  </div>);
}

function ImplTab({g,team,currentUser,onSave}){
  const[showParser,setShowParser]=useState(false);
  const[planText,setPlanText]=useState("");
  const[editNote,setEditNote]=useState({});
  function parsePlan(){const m=parseImplPlan(planText);onSave({implPlan:m});setShowParser(false);setPlanText("");}
  function updM(id,u){onSave({implPlan:(g.implPlan||[]).map(m=>m.id===id?{...m,...u}:m)});}
  function updT(mId,tId,u){onSave({implPlan:(g.implPlan||[]).map(m=>m.id===mId?{...m,tasks:(m.tasks||[]).map(t=>t.id===tId?{...t,...u}:t)}:m)});}
  return(<div style={{display:"grid",gap:16,maxWidth:900}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:9}}>
      <div style={{fontFamily:"Georgia,serif",fontSize:16,color:"#e0d0b0",fontWeight:700}}>Implementation Plan & Progress Tracking</div>
      <button onClick={()=>setShowParser(p=>!p)} style={{background:"rgba(200,131,42,0.1)",border:"1px solid rgba(200,131,42,0.3)",borderRadius:7,color:"#c8832a",padding:"7px 14px",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit"}}>✦ {showParser?"Hide":"AI PARSE PLAN"}</button>
    </div>
    {showParser&&<div style={CB}>
      <div style={{fontSize:10,color:"#3a4a3a",letterSpacing:2,fontWeight:700,marginBottom:10}}>PASTE IMPLEMENTATION PLAN — AI WILL CREATE MILESTONES</div>
      <div style={{fontSize:12,color:"#5a6a5a",marginBottom:10,lineHeight:1.75}}>Paste your implementation plan text. The system will automatically extract phases, milestones, and tasks to build a project timeline with progress tracking.</div>
      <textarea value={planText} onChange={e=>setPlanText(e.target.value)} placeholder={"Phase 1: Baseline Assessment (Months 1-2)\n- Conduct community needs assessment\n- Identify 500 target beneficiaries\n- Establish M&E framework\n\nPhase 2: Capacity Building (Months 3-6)\n- Deliver 12 training workshops\n- Train 3 legal advisors\n\nPhase 3: Implementation (Months 7-12)\n- Run weekly legal clinics\n- File 200 CCMA referrals"} style={{...I,resize:"vertical",height:180,fontSize:12,lineHeight:1.85,marginBottom:9}}/>
      <button onClick={parsePlan} disabled={!planText.trim()} style={{background:"linear-gradient(135deg,#c8832a,#a06020)",border:"none",borderRadius:8,color:"#fff",padding:"9px 22px",fontSize:12,fontWeight:700,cursor:"pointer",letterSpacing:2,fontFamily:"inherit"}}>✦ GENERATE TIMELINE</button>
    </div>}
    {(g.implPlan||[]).length===0&&!showParser&&<div style={{fontSize:13,color:"#2a3a4a",fontStyle:"italic",textAlign:"center",padding:40}}>No implementation plan yet. Click "AI Parse Plan" to import from text, or add phases manually.</div>}
    {(g.implPlan||[]).map((m,mi)=>{
      const doneTasks=(m.tasks||[]).filter(t=>t.done).length;
      const totalTasks=(m.tasks||[]).length;
      const pct=totalTasks>0?Math.round((doneTasks/totalTasks)*100):m.progress||0;
      const stC={Pending:"#c8a060","In Progress":"#7a90d0",Completed:"#60c880",Blocked:"#ff9070"};
      return(<div key={m.id} style={{...CB,borderColor:pct===100?"rgba(40,160,80,0.3)":"rgba(200,131,42,0.16)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
          <div style={{fontFamily:"Georgia,serif",fontSize:15,color:"#e0d0b0",fontWeight:700,flex:1}}>{m.title}</div>
          <div style={{display:"flex",gap:7,flexShrink:0,marginLeft:12,flexWrap:"wrap"}}>
            <select value={m.status||"Pending"} onChange={e=>updM(m.id,{status:e.target.value})} style={{...I,padding:"4px 8px",fontSize:11,color:stC[m.status]||"#c8a060",cursor:"pointer",width:"auto"}}><option>Pending</option><option value="In Progress">In Progress</option><option>Completed</option><option>Blocked</option></select>
            <select value={m.responsible||""} onChange={e=>updM(m.id,{responsible:e.target.value})} style={{...I,padding:"4px 8px",fontSize:11,cursor:"pointer",width:"auto"}}><option value="">Assign lead…</option>{team.map(t=>(<option key={t}>{t}</option>))}</select>
            <button onClick={()=>onSave({implPlan:(g.implPlan||[]).filter(x=>x.id!==m.id)})} style={{background:"none",border:"none",color:"#3a2a2a",cursor:"pointer",fontSize:15}}>×</button>
          </div>
        </div>
        <div style={{marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:10,color:"#2a3a4a",letterSpacing:1}}>PROGRESS</span><span style={{fontSize:11,color:pct===100?"#60c880":"#c8a060",fontWeight:700}}>{pct}%</span></div>
          <div style={{height:6,background:"rgba(255,255,255,0.06)",borderRadius:3,overflow:"hidden"}}><div style={{width:`${pct}%`,height:"100%",background:pct===100?"#40b060":"linear-gradient(90deg,#c8832a,#e8a840)",transition:"width 0.4s",borderRadius:3}}/></div>
        </div>
        {(m.tasks||[]).map(task=>(<div key={task.id} style={{display:"flex",alignItems:"flex-start",gap:9,padding:"7px 10px",background:task.done?"rgba(40,160,80,0.04)":"rgba(255,255,255,0.02)",borderRadius:7,border:`1px solid ${task.done?"rgba(40,160,80,0.15)":"rgba(255,255,255,0.05)"}`,marginBottom:5}}>
          <input type="checkbox" checked={task.done} onChange={()=>updT(m.id,task.id,{done:!task.done})} style={{width:13,height:13,accentColor:"#c8832a",cursor:"pointer",flexShrink:0,marginTop:2}}/>
          <div style={{flex:1,fontSize:12,color:task.done?"#3a5a3a":"#b0a090",textDecoration:task.done?"line-through":"none",lineHeight:1.6}}>{task.text}{task.dueDate&&<span style={{fontSize:10,color:"#2a3a4a",marginLeft:8}}>Due: {task.dueDate}</span>}</div>
          <select value={task.responsible||""} onChange={e=>updT(m.id,task.id,{responsible:e.target.value})} style={{...I,padding:"3px 6px",fontSize:10,cursor:"pointer",width:"auto"}}><option value="">Assign…</option>{team.map(t=>(<option key={t}>{t}</option>))}</select>
        </div>))}
        <textarea placeholder="Add a task (Enter to save)…" style={{...I,resize:"none",height:45,fontSize:12,padding:"7px 10px",marginTop:7}} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();const t=e.target.value.trim();if(t){updM(m.id,{tasks:[...(m.tasks||[]),{id:uid(),text:t,done:false,dueDate:"",responsible:""}]});e.target.value="";};}}}/>
        {editNote[m.id]!==undefined?<div style={{marginTop:9}}>
          <textarea value={editNote[m.id]} onChange={e=>setEditNote(p=>({...p,[m.id]:e.target.value}))} style={{...I,resize:"vertical",height:65,fontSize:12}} placeholder="Progress note…"/>
          <div style={{display:"flex",gap:7,marginTop:6}}>
            <button onClick={()=>{updM(m.id,{notes:editNote[m.id]});setEditNote(p=>{const n={...p};delete n[m.id];return n;});}} style={{background:"linear-gradient(135deg,rgba(40,160,80,0.3),rgba(40,160,80,0.15))",border:"1px solid rgba(40,160,80,0.3)",borderRadius:6,color:"#60c880",padding:"6px 14px",cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:"inherit"}}>Save</button>
            <button onClick={()=>setEditNote(p=>{const n={...p};delete n[m.id];return n;})} style={{background:"none",border:"none",color:"#3a4a5a",cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>Cancel</button>
          </div>
        </div>:<div style={{marginTop:7}}>
          {m.notes&&<div style={{fontSize:12,color:"#5a6a5a",lineHeight:1.7,marginBottom:7,padding:"8px 11px",background:"rgba(255,255,255,0.02)",borderRadius:7,border:"1px solid rgba(255,255,255,0.04)"}}>{m.notes}</div>}
          <button onClick={()=>setEditNote(p=>({...p,[m.id]:m.notes||""}))} style={{background:"none",border:"none",color:"#3a4a5a",cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>+ {m.notes?"Edit":"Add"} progress note</button>
        </div>}
      </div>);
    })}
    <button onClick={()=>onSave({implPlan:[...(g.implPlan||[]),{id:uid(),title:"New Phase",tasks:[],dueDate:"",status:"Pending",progress:0,notes:"",responsible:""}]})} style={{background:"transparent",border:"1px dashed rgba(200,131,42,0.3)",borderRadius:9,color:"#c8832a",padding:"11px",fontSize:12,cursor:"pointer",letterSpacing:1,fontFamily:"inherit"}}>+ ADD PHASE / MILESTONE</button>
  </div>);
}

function ActivityTab({g}){
  return(<div style={{maxWidth:700}}>
    <div style={{fontFamily:"Georgia,serif",fontSize:16,color:"#e0d0b0",fontWeight:700,marginBottom:14}}>Activity Log</div>
    {[...(g.activities||[])].reverse().map((a,i)=>(<div key={i} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:9,padding:"11px 15px",marginBottom:9}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:12,color:"#c8832a",fontWeight:600}}>{a.author}</span><span style={{fontSize:11,color:"#2a3a4a"}}>{fts(a.ts)}</span></div>
      <div style={{fontSize:13,color:"#8a8a7a",lineHeight:1.75}}>{a.type==="advance"?<><span style={{color:"#60c880"}}>→ </span>{a.content}</>:a.content}</div>
    </div>))}
    {(g.activities||[]).length===0&&<div style={{color:"#2a3a4a",fontSize:13,fontStyle:"italic"}}>No activity yet. Add your first note from the panel on the left.</div>}
  </div>);
}


// ── GRANT CARD ────────────────────────────────────────────────────────────────
function Card({grant,onClick}){
  const sc=SC[grant.status]||SC["Opportunity Identified"];
  const d=grant.fullDeadline||grant.loiDeadline||grant.internalDeadline;
  const dy=d?daysUntil(d):null;const u=urgCls(dy);
  const docsOk=(grant.docs||[]).filter(x=>x.done).length;
  return(<div onClick={onClick} style={{marginBottom:6,padding:"11px 12px",background:sc.bg,border:`1px solid ${sc.border}`,borderRadius:8,cursor:"pointer",transition:"all 0.15s"}}>
    <div style={{fontFamily:"Georgia,serif",fontSize:13,color:"#e0d0b0",fontWeight:600,marginBottom:3,lineHeight:1.35}}>{grant.grantName}</div>
    <div style={{fontSize:11,color:"#3a4a5a",marginBottom:7}}>{grant.funderName}</div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div style={{display:"flex",gap:5,alignItems:"center"}}>
        {grant.lead&&<span style={{fontSize:10,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:4,padding:"1px 6px",color:"#3a4a5a"}}>👤 {grant.lead.split(" ")[0]}</span>}
        {grant.amountRequested&&<span style={{fontSize:10,color:"#8a7a5a",fontFamily:"Georgia,serif"}}>{grant.amountRequested}</span>}
      </div>
      {dy!==null&&<span style={{fontSize:10,fontWeight:700,padding:"1px 7px",borderRadius:5,background:UC[u].bg,color:UC[u].t,border:`1px solid ${UC[u].b}`}}>{dy<=0?"OVR":`${dy}d`}</span>}
    </div>
    {(grant.docs||[]).length>0&&<div style={{marginTop:6,height:2,background:"rgba(255,255,255,0.05)",borderRadius:1}}><div style={{width:`${(docsOk/(grant.docs||[]).length)*100}%`,height:"100%",background:"#c8832a",borderRadius:1}}/></div>}
  </div>);
}

// ── GRANTS TABLE ──────────────────────────────────────────────────────────────
function GrantsTable({grants,onSelect}){
  return(<div style={{overflowX:"auto"}}>
    <table style={{width:"100%",borderCollapse:"collapse"}}>
      <thead><tr style={{borderBottom:"1px solid rgba(200,131,42,0.2)"}}>
        {["Grant / Funder","Pillar","Stage","Lead","Requested","Alignment","Deadline","Days","Docs",""].map(h=>(<th key={h} style={{textAlign:"left",fontSize:10,color:"#3a5a3a",fontWeight:700,letterSpacing:2,textTransform:"uppercase",padding:"9px 12px"}}>{h}</th>))}
      </tr></thead>
      <tbody>{grants.map(g=>{
        const d=g.fullDeadline||g.loiDeadline||g.internalDeadline;
        const dy=d?daysUntil(d):null;const u=urgCls(dy);const sc=SC[g.status]||SC["Opportunity Identified"];
        const docsOk=(g.docs||[]).filter(x=>x.done).length;const pc=PC[g.pillar];
        return(<tr key={g.id} style={{borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
          <td style={{padding:"11px 12px",cursor:"pointer"}} onClick={()=>onSelect(g)}><div style={{fontFamily:"Georgia,serif",fontSize:14,color:"#e0d0b0",fontWeight:600,marginBottom:2}}>{g.grantName}</div><div style={{fontSize:12,color:"#3a4a5a"}}>{g.funderName}</div></td>
          <td style={{padding:"11px 12px"}}>{pc&&<span style={{fontSize:10,padding:"2px 7px",borderRadius:9,background:pc.bg,color:pc.t,border:`1px solid ${pc.b}`,display:"inline-block",fontWeight:600}}>{(g.pillar||"").split("&")[0].trim().substring(0,14)}</span>}</td>
          <td style={{padding:"11px 12px"}}><span style={{fontSize:11,padding:"3px 9px",borderRadius:9,background:sc.bg,color:sc.text,border:`1px solid ${sc.border}`,whiteSpace:"nowrap"}}>{g.status}</span></td>
          <td style={{padding:"11px 12px",fontSize:13,color:"#7a8a9a"}}>{g.lead||"—"}</td>
          <td style={{padding:"11px 12px",fontFamily:"Georgia,serif",fontSize:13,color:"#c8a060"}}>{g.amountRequested||"—"}</td>
          <td style={{padding:"11px 12px"}}><Stars value={g.stars||0} size={12}/></td>
          <td style={{padding:"11px 12px",fontSize:12,color:"#4a5a4a"}}>{d?fd(d):"—"}</td>
          <td style={{padding:"11px 12px"}}>{dy!==null?<span style={{fontSize:12,fontWeight:700,padding:"2px 8px",borderRadius:6,background:UC[u].bg,color:UC[u].t,border:`1px solid ${UC[u].b}`,whiteSpace:"nowrap"}}>{dy<=0?"OVERDUE":`${dy}d`}</span>:<span style={{color:"#141e28"}}>—</span>}</td>
          <td style={{padding:"11px 12px"}}><div style={{fontSize:12,color:"#2a4a2a",marginBottom:2}}>{docsOk}/{(g.docs||[]).length}</div><div style={{width:36,height:3,background:"rgba(255,255,255,0.07)",borderRadius:2,overflow:"hidden"}}><div style={{width:`${(g.docs||[]).length>0?(docsOk/(g.docs||[]).length)*100:0}%`,height:"100%",background:"#c8832a"}}/></div></td>
          <td style={{padding:"11px 12px"}}><button onClick={()=>onSelect(g)} style={{background:"rgba(200,131,42,0.08)",border:"1px solid rgba(200,131,42,0.2)",borderRadius:6,color:"#c8a060",padding:"4px 12px",cursor:"pointer",fontSize:11,fontFamily:"inherit",whiteSpace:"nowrap"}}>Open →</button></td>
        </tr>);
      })}</tbody>
    </table>
    {grants.length===0&&<div style={{textAlign:"center",padding:50,color:"#1a2a3a",fontSize:14}}>No grants match your filters.</div>}
  </div>);
}

// ── EXECUTIVE DASHBOARD ───────────────────────────────────────────────────────
function ExecutiveDashboard({grants,onSelect}){
  const total=grants.reduce((s,g)=>s+(parseFloat((g.amountRequested||"").replace(/[^0-9.]/g,""))||0),0);
  const awarded=grants.filter(g=>["Awarded","Implementation","Reporting","Completed"].includes(g.status));
  const totalAwarded=grants.reduce((s,g)=>s+(parseFloat((g.awardAmount||"").replace(/[^0-9.]/g,""))||0),0);
  const submitted=grants.filter(g=>["Submitted","Under Review","Awarded","Implementation","Reporting","Completed"].includes(g.status)).length;
  const successRate=submitted>0?Math.round((awarded.length/submitted)*100):0;
  const upcoming=grants.map(g=>{const d=g.fullDeadline||g.loiDeadline||g.internalDeadline;return{...g,_d:d,_days:d?daysUntil(d):null};}).filter(g=>g._days!==null&&g._days>=0&&g._days<=30).sort((a,b)=>a._days-b._days).slice(0,5);
  const bySector={};grants.forEach(g=>(g.sectors||[]).forEach(s=>{bySector[s]=(bySector[s]||0)+1;}));
  const sectorList=Object.entries(bySector).sort(([,a],[,b])=>b-a).slice(0,7);const maxSec=sectorList[0]?.[1]||1;
  const byPillar={};grants.forEach(g=>{if(g.pillar)byPillar[g.pillar]=(byPillar[g.pillar]||0)+1;});
  const active=grants.filter(g=>!["Archived","Declined","Closed Before Applying"].includes(g.status));
  return(<div style={{display:"grid",gap:16,maxWidth:1180}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div><div style={{fontSize:9,color:"#c8832a",letterSpacing:4,marginBottom:3}}>RGN GRANT MANAGEMENT</div><h2 style={{fontFamily:"Georgia,serif",fontSize:26,color:"#f0e0c0",fontWeight:700,margin:0}}>Executive Overview</h2></div>
      <div style={{fontSize:11,color:"#3a4a5a"}}>{new Date().toLocaleDateString("en-ZA",{day:"numeric",month:"long",year:"numeric"})}</div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:10}}>
      {[{l:"Active Grants",v:active.length,c:"#e0d0b0",s:"in pipeline"},{l:"Pipeline Value",v:`R${(total/1e6).toFixed(1)}M`,c:"#c8a060",s:"total requested"},{l:"Total Awarded",v:totalAwarded>0?`R${(totalAwarded/1e6).toFixed(2)}M`:"R0",c:"#5dc080",s:"approved"},{l:"Funds Received",v:"R0.000",c:"#60c0a0",s:"disbursed"},{l:"Submitted",v:submitted,c:"#70a0e0",s:"applications"},{l:"Success Rate",v:successRate+"%",c:successRate>50?"#60c880":successRate>25?"#e8a84a":"#ff9070",s:"award conversion"}].map(s=>(<div key={s.l} style={{...CB,padding:"14px 16px",textAlign:"center"}}><div style={{fontSize:9,color:"#3a4a3a",letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>{s.l}</div><div style={{fontFamily:"Georgia,serif",fontSize:26,fontWeight:700,color:s.c,lineHeight:1,marginBottom:3}}>{s.v}</div><div style={{fontSize:9,color:"#2a3a2a"}}>{s.s}</div></div>))}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
      <div style={CB}>
        <div style={{fontFamily:"Georgia,serif",fontSize:14,color:"#e0d0b0",fontWeight:700,marginBottom:14}}>⏰ Upcoming Deadlines</div>
        {upcoming.length===0&&<div style={{fontSize:13,color:"#1a2a3a",fontStyle:"italic"}}>No deadlines in next 30 days.</div>}
        {upcoming.map(g=>{const u=urgCls(g._days);return(<div key={g.id} onClick={()=>onSelect(g)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 10px",background:UC[u].bg,border:`1px solid ${UC[u].b}`,borderRadius:8,marginBottom:7,cursor:"pointer"}}><div><div style={{fontSize:12,color:"#c0b0a0",fontFamily:"Georgia,serif"}}>{g.funderName}</div><div style={{fontSize:10,color:"#3a4a5a",marginTop:1}}>{fd(g._d)}</div></div><span style={{fontSize:13,fontWeight:700,color:UC[u].t}}>{g._days}d</span></div>);})}
      </div>
      <div style={CB}>
        <div style={{fontFamily:"Georgia,serif",fontSize:14,color:"#e0d0b0",fontWeight:700,marginBottom:14}}>🏭 Sector Breakdown</div>
        {sectorList.map(([s,n])=>(<div key={s} style={{marginBottom:9}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:11,color:"#7a8a9a"}}>{s}</span><span style={{fontSize:11,color:"#7090c0",fontWeight:600}}>{n}</span></div><div style={{height:3,background:"rgba(255,255,255,0.05)",borderRadius:2,overflow:"hidden"}}><div style={{width:`${(n/maxSec)*100}%`,height:"100%",background:"linear-gradient(90deg,#3a5090,#7090d0)"}}/></div></div>))}
        {sectorList.length===0&&<div style={{fontSize:12,color:"#1a2a3a",fontStyle:"italic"}}>Assign sectors to see breakdown.</div>}
      </div>
      <div style={CB}>
        <div style={{fontFamily:"Georgia,serif",fontSize:14,color:"#e0d0b0",fontWeight:700,marginBottom:14}}>🎯 By Strategic Pillar</div>
        {PILLARS.map(p=>{const n=byPillar[p]||0;const pc=PC[p];if(!pc)return null;return(<div key={p} style={{marginBottom:11}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:11,color:pc.t}}>{p.split("&")[0].trim()}</span><span style={{fontSize:13,color:pc.t,fontWeight:700}}>{n}</span></div><div style={{height:4,background:"rgba(255,255,255,0.05)",borderRadius:2,overflow:"hidden"}}><div style={{width:`${grants.length>0?(n/grants.length)*100:0}%`,height:"100%",background:pc.dot}}/></div></div>);})}
      </div>
    </div>
    <div style={CB}>
      <div style={{fontFamily:"Georgia,serif",fontSize:14,color:"#e0d0b0",fontWeight:700,marginBottom:14}}>📊 Full Pipeline Status</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(10,1fr)",gap:8}}>
        {STAGES_ACTIVE.map(s=>{const n=grants.filter(g=>g.status===s).length;const sc=SC[s];return(<div key={s} style={{textAlign:"center"}}><div style={{fontFamily:"Georgia,serif",fontSize:26,fontWeight:700,color:n>0?sc.dot:"#1a2a3a",marginBottom:5}}>{n}</div><div style={{fontSize:9,color:"#1a2a3a",lineHeight:1.3,letterSpacing:0.5}}>{STAGE_GUIDE[s]?.icon} {s}</div></div>);})}
      </div>
    </div>
  </div>);
}

// ── FINANCIAL DASHBOARD ───────────────────────────────────────────────────────
function FinancialDashboard({grants}){
  const total=grants.reduce((s,g)=>s+(parseFloat((g.amountRequested||"").replace(/[^0-9.]/g,""))||0),0);
  const totalAwarded=grants.reduce((s,g)=>s+(parseFloat((g.awardAmount||"").replace(/[^0-9.]/g,""))||0),0);
  const totalDisbRec=grants.reduce((s,g)=>s+(g.disbursements||[]).filter(d=>d.status==="Received").reduce((s2,d)=>s2+(parseFloat(d.amount)||0),0),0);
  return(<div style={{display:"grid",gap:16,maxWidth:1000}}>
    <div style={{fontFamily:"Georgia,serif",fontSize:22,color:"#f0e0c0",fontWeight:700}}>Financial Dashboard</div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
      {[{l:"Pipeline Value",v:`R${(total/1e6).toFixed(1)}M`,c:"#c8a060"},{l:"Total Awarded",v:totalAwarded>0?`R${(totalAwarded/1e6).toFixed(2)}M`:"R0",c:"#60c880"},{l:"Funds Received",v:`R${(totalDisbRec/1e3).toFixed(1)}K`,c:"#60c0a0"},{l:"Outstanding",v:`R${Math.max(0,(totalAwarded-totalDisbRec)/1e3).toFixed(1)}K`,c:"#ff9070"}].map(s=>(<div key={s.l} style={CB}><div style={{fontSize:9,color:"#3a4a3a",letterSpacing:2,marginBottom:7}}>{s.l}</div><div style={{fontFamily:"Georgia,serif",fontSize:28,fontWeight:700,color:s.c,lineHeight:1}}>{s.v}</div></div>))}
    </div>
    <div style={CB}>
      <div style={{fontFamily:"Georgia,serif",fontSize:14,color:"#e0d0b0",fontWeight:700,marginBottom:14}}>💰 Grant Financial Summary</div>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",gap:8,marginBottom:8}}>
        {["Grant","Stage","Requested","Awarded","Received"].map(h=><div key={h} style={{fontSize:9,color:"#2a3a4a",letterSpacing:1,fontWeight:700,textTransform:"uppercase"}}>{h}</div>)}
      </div>
      {grants.map(g=>{
        const disbRec=(g.disbursements||[]).filter(d=>d.status==="Received").reduce((s,d)=>s+(parseFloat(d.amount)||0),0);
        const sc=SC[g.status]||SC["Opportunity Identified"];
        return(<div key={g.id} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",gap:8,padding:"9px 12px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,marginBottom:6,alignItems:"center"}}>
          <div><div style={{fontSize:13,fontFamily:"Georgia,serif",color:"#c0b0a0"}}>{g.grantName}</div><div style={{fontSize:11,color:"#3a4a5a"}}>{g.funderName}</div></div>
          <span style={{fontSize:11,padding:"2px 8px",borderRadius:7,background:sc.bg,color:sc.text,border:`1px solid ${sc.border}`,display:"inline-block"}}>{g.status}</span>
          <div style={{fontFamily:"Georgia,serif",fontSize:13,color:"#c8a060"}}>{g.amountRequested||"—"}</div>
          <div>{g.awardAmount?<span style={{fontSize:12,color:"#5dc080",fontFamily:"Georgia,serif",fontWeight:600}}>{g.awardAmount} ✓</span>:<span style={{fontSize:11,color:"#3a4a5a"}}>Pending</span>}</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:13,color:disbRec>0?"#60c0a0":"#2a3a4a"}}>{disbRec>0?`R${disbRec.toLocaleString()}`:"—"}</div>
        </div>);
      })}
    </div>
  </div>);
}

// ── REPORTS ───────────────────────────────────────────────────────────────────
function Reports({grants}){
  const total=grants.reduce((s,g)=>s+(parseFloat((g.amountRequested||"").replace(/[^0-9.]/g,""))||0),0);
  const totalAwarded=grants.reduce((s,g)=>s+(parseFloat((g.awardAmount||"").replace(/[^0-9.]/g,""))||0),0);
  const byStage=STAGES.map(s=>({stage:s,count:grants.filter(g=>g.status===s).length})).filter(s=>s.count>0);
  return(<div style={{display:"grid",gap:16,maxWidth:960}}>
    <div style={{fontFamily:"Georgia,serif",fontSize:22,color:"#f0e0c0",fontWeight:700}}>Reports & Strategy</div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
      {[{l:"Total",v:grants.length,c:"#e0d0b0"},{l:"Awarded",v:grants.filter(g=>["Awarded","Implementation","Reporting","Completed"].includes(g.status)).length,c:"#60c880"},{l:"Pipeline Value",v:`R${(total/1e6).toFixed(1)}M`,c:"#c8a060"},{l:"Total Awarded",v:totalAwarded>0?`R${(totalAwarded/1e6).toFixed(1)}M`:"—",c:"#5dc080"},{l:"Declined",v:grants.filter(g=>g.status==="Declined").length,c:"#907090"},{l:"Archived",v:grants.filter(g=>g.isArchived||g.status==="Archived").length,c:"#505050"},{l:"Avg Alignment",v:grants.length>0?(grants.reduce((s,g)=>s+(g.stars||0),0)/grants.length).toFixed(1)+"★":"—",c:"#c8832a"},{l:"In Research",v:grants.filter(g=>["Opportunity Identified","Researching"].includes(g.status)).length,c:"#7090c0"}].map(s=>(<div key={s.l} style={CB}><div style={{fontSize:9,color:"#2a3a2a",letterSpacing:2,textTransform:"uppercase",marginBottom:7}}>{s.l}</div><div style={{fontFamily:"Georgia,serif",fontSize:24,fontWeight:700,color:s.c,lineHeight:1}}>{s.v}</div></div>))}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <div style={CB}><div style={{fontFamily:"Georgia,serif",fontSize:14,color:"#e0d0b0",fontWeight:700,marginBottom:14}}>Pipeline by Stage</div>{byStage.map(s=>{const sc=SC[s.stage];const pct=grants.length>0?(s.count/grants.length)*100:0;return(<div key={s.stage} style={{marginBottom:9}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:12,color:"#6a7a8a"}}>{STAGE_GUIDE[s.stage]?.icon} {s.stage}</span><span style={{fontSize:12,color:sc.dot,fontWeight:600}}>{s.count}</span></div><div style={{height:4,background:"rgba(255,255,255,0.05)",borderRadius:2,overflow:"hidden"}}><div style={{width:`${pct}%`,height:"100%",background:`linear-gradient(90deg,${sc.dot},${sc.text})`,borderRadius:2}}/></div></div>);})}</div>
      <div style={CB}><div style={{fontFamily:"Georgia,serif",fontSize:14,color:"#e0d0b0",fontWeight:700,marginBottom:14}}>Universal Messaging — RGN Pillars</div><div style={{display:"grid",gap:8}}>{[{i:"⚖️",t:"Constitutional Framing",d:"Frame as closing a constitutional access-to-justice gap — not charity."},{i:"📊",t:"Lead with Data",d:"161K annual CCMA referrals · 35% abandoned · 60% unorganised workers."},{i:"🏙️",t:"Township Credibility",d:"15 years in Soweto & Thembisa — rare, bankable track record."},{i:"💼",t:"Economic ROI",d:"Every R1M = 60 workers represented + 1,000 educated."}].map(m=>(<div key={m.t} style={{background:"rgba(200,131,42,0.04)",border:"1px solid rgba(200,131,42,0.1)",borderRadius:8,padding:"9px 12px",display:"flex",gap:9}}><span style={{fontSize:16,flexShrink:0}}>{m.i}</span><div><div style={{fontSize:11,fontWeight:700,color:"#c8a060",marginBottom:2}}>{m.t}</div><div style={{fontSize:11,color:"#5a6a5a",lineHeight:1.65}}>{m.d}</div></div></div>))}</div></div>
    </div>
  </div>);
}

// ── SECTOR VIEW ───────────────────────────────────────────────────────────────
function SectorView({grants,onSelect}){
  const bySector={};grants.forEach(g=>(g.sectors||[]).forEach(s=>{if(!bySector[s])bySector[s]=[];bySector[s].push(g);}));
  return(<div style={{display:"grid",gap:14,maxWidth:1100}}>
    <div style={{fontFamily:"Georgia,serif",fontSize:22,color:"#f0e0c0",fontWeight:700}}>Sector View</div>
    {Object.entries(bySector).map(([sector,sg])=>(<div key={sector} style={CB}><div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><div style={{fontFamily:"Georgia,serif",fontSize:14,color:"#e0d0b0",fontWeight:700}}>{sector}</div><span style={{fontSize:12,color:"#7090c0",fontWeight:600}}>{sg.length} grant{sg.length!==1?"s":""}</span></div><div style={{display:"grid",gap:7}}>{sg.map(g=>{const sc=SC[g.status]||SC["Opportunity Identified"];return(<div key={g.id} onClick={()=>onSelect(g)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 12px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,cursor:"pointer"}}><div><div style={{fontSize:13,color:"#c0b0a0",fontFamily:"Georgia,serif"}}>{g.grantName}</div><div style={{fontSize:11,color:"#3a4a5a"}}>{g.funderName} · {g.lead||"Unassigned"}</div></div><div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:11,padding:"2px 8px",borderRadius:7,background:sc.bg,color:sc.text,border:`1px solid ${sc.border}`}}>{g.status}</span><span style={{fontSize:12,fontFamily:"Georgia,serif",color:"#c8a060"}}>{g.amountRequested||"—"}</span></div></div>);})}</div></div>))}
    {Object.keys(bySector).length===0&&<div style={{fontSize:13,color:"#2a3a4a",fontStyle:"italic",textAlign:"center",padding:40}}>No sectors assigned yet.</div>}
  </div>);
}

// ── TEAM MODAL ────────────────────────────────────────────────────────────────
function TeamModal({team,onSave,onClose}){
  const[members,setMembers]=useState([...team]);const[nm,setNm]=useState("");
  return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:70,backdropFilter:"blur(8px)"}} onClick={onClose}>
    <div style={{background:"linear-gradient(160deg,#0a1525,#07101c)",border:"1px solid rgba(200,131,42,0.3)",borderRadius:14,width:"100%",maxWidth:400,padding:24}} onClick={e=>e.stopPropagation()}>
      <div style={{fontFamily:"Georgia,serif",fontSize:18,color:"#e0d0b0",fontWeight:700,marginBottom:16}}>Manage Team</div>
      <div style={{display:"grid",gap:7,marginBottom:14}}>{members.map((m,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:7,padding:"8px 13px"}}><span style={{fontSize:13,color:"#c0b0a0"}}>{m}</span><button onClick={()=>setMembers(p=>p.filter((_,j)=>j!==i))} style={{background:"transparent",border:"none",color:"#6a2a2a",cursor:"pointer",fontSize:15,padding:"0 3px"}}>×</button></div>))}</div>
      <div style={{display:"flex",gap:7,marginBottom:16}}>
        <input style={{...I,flex:1}} placeholder="Add team member" value={nm} onChange={e=>setNm(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&nm.trim()){setMembers(p=>[...p,nm.trim()]);setNm("");}}}/>
        <button onClick={()=>{if(nm.trim()){setMembers(p=>[...p,nm.trim()]);setNm("");}}} style={{background:"rgba(200,131,42,0.15)",border:"1px solid rgba(200,131,42,0.3)",borderRadius:7,color:"#c8832a",padding:"9px 14px",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"inherit"}}>Add</button>
      </div>
      <div style={{display:"flex",justifyContent:"flex-end",gap:9}}>
        <button onClick={onClose} style={{background:"transparent",border:"1px solid rgba(255,255,255,0.1)",borderRadius:7,color:"#5a6a7a",padding:"8px 18px",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
        <button onClick={()=>{onSave(members);onClose();}} style={{background:"linear-gradient(135deg,#c8832a,#a06020)",border:"none",borderRadius:7,color:"#fff",padding:"8px 22px",fontSize:13,fontWeight:700,cursor:"pointer",letterSpacing:2,fontFamily:"inherit"}}>SAVE</button>
      </div>
    </div>
  </div>);
}

// ── NOTIFICATIONS PANEL ───────────────────────────────────────────────────────
function NotificationsPanel({notifications,currentUser,onMarkRead,onClose}){
  const mine=(notifications||[]).filter(n=>n.to===currentUser&&!n.read);
  return(<div style={{position:"fixed",top:0,right:0,bottom:0,width:340,background:"linear-gradient(180deg,#0a1525,#07101c)",borderLeft:"1px solid rgba(200,131,42,0.2)",boxShadow:"-20px 0 60px rgba(0,0,0,0.7)",zIndex:55,display:"flex",flexDirection:"column"}}>
    <div style={{padding:"18px 20px",borderBottom:"1px solid rgba(200,131,42,0.15)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div style={{fontFamily:"Georgia,serif",fontSize:16,color:"#e0d0b0",fontWeight:700}}>Notifications</div>
      <button onClick={onClose} style={{background:"none",border:"none",color:"#3a4a5a",cursor:"pointer",fontSize:18}}>×</button>
    </div>
    <div style={{flex:1,overflowY:"auto",padding:14}}>
      {mine.length===0&&<div style={{fontSize:13,color:"#2a3a4a",fontStyle:"italic",textAlign:"center",padding:30}}>No new notifications for {currentUser}.</div>}
      {mine.map((n,i)=>(<div key={i} style={{background:"rgba(200,131,42,0.06)",border:"1px solid rgba(200,131,42,0.2)",borderRadius:10,padding:"13px 15px",marginBottom:10}}>
        <div style={{fontSize:11,color:"#c8832a",fontWeight:700,marginBottom:4}}>{n.type==="review_request"?"📨 Review Requested":n.type==="review_complete"?"✅ Review Complete":"🔔 Notification"}</div>
        <div style={{fontSize:13,color:"#8a8a7a",lineHeight:1.75,marginBottom:8}}>{n.message}</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:10,color:"#2a3a4a"}}>{fts(n.ts)}</span>
          <button onClick={()=>onMarkRead(i)} style={{background:"rgba(200,131,42,0.1)",border:"1px solid rgba(200,131,42,0.2)",borderRadius:5,color:"#c8832a",padding:"4px 10px",cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>Mark read</button>
        </div>
      </div>))}
    </div>
  </div>);
}


// ── APP ───────────────────────────────────────────────────────────────────────
export default function App(){
  const[grants,setGrants]=useState(()=>{
    try{const s=localStorage.getItem("rgn_v6");return s?JSON.parse(s):SEED;}
    catch{return SEED;}
  });
  const[team,setTeam]=useState(DEFAULT_TEAM);
  const[view,setView]=useState("executive");
  const[selectedId,setSelectedId]=useState(null);
  const[showAdd,setShowAdd]=useState(false);
  const[showTeam,setShowTeam]=useState(false);
  const[filterLead,setFilterLead]=useState("All");
  const[filterStatus,setFilterStatus]=useState("All");
  const[showArchived,setShowArchived]=useState(false);
  const[search,setSearch]=useState("");
  const[currentUser,setCurrentUser]=useState("Director");
  const[notifications,setNotifications]=useState([]);
  const[showNotifs,setShowNotifs]=useState(false);

  // Persist grants to localStorage
  useEffect(()=>{try{localStorage.setItem("rgn_v6",JSON.stringify(grants));}catch(e){};},[grants]);

  function upsertGrant(g){
    setGrants(gs=>{
      const i=gs.findIndex(x=>x.id===g.id);
      if(i>=0){const n=[...gs];n[i]=g;return n;}
      return[...gs,g];
    });
  }
  function deleteGrant(id){setGrants(gs=>gs.filter(g=>g.id!==id));setSelectedId(null);}
  function archiveGrant(id){setGrants(gs=>gs.map(g=>g.id===id?{...g,isArchived:true,status:"Archived"}:g));setSelectedId(null);}
  function addNotification(n){setNotifications(prev=>[n,...prev]);}
  function markNotifRead(i){setNotifications(prev=>prev.map((n,j)=>j===i?{...n,read:true}:n));}

  const unread=notifications.filter(n=>n.to===currentUser&&!n.read).length;
  const urgent=useMemo(()=>grants.map(g=>{
    const d=g.internalDeadline||g.loiDeadline||g.fullDeadline;
    const dy=d?daysUntil(d):null;
    return{...g,_dy:dy,_d:d};
  }).filter(g=>g._dy!==null&&g._dy>=0&&g._dy<=7&&!["Archived","Declined","Closed Before Applying"].includes(g.status)).sort((a,b)=>a._dy-b._dy).slice(0,4),[grants]);

  const filtered=useMemo(()=>grants.filter(g=>{
    if(!showArchived&&(g.status==="Archived"||g.status==="Closed Before Applying"||g.isArchived))return false;
    if(filterLead!=="All"&&g.lead!==filterLead)return false;
    if(filterStatus!=="All"&&g.status!==filterStatus)return false;
    if(search){const q=search.toLowerCase();if(!g.grantName.toLowerCase().includes(q)&&!g.funderName.toLowerCase().includes(q)&&!(g.pillar||"").toLowerCase().includes(q))return false;}
    return true;
  }),[grants,filterLead,filterStatus,showArchived,search]);

  const total=useMemo(()=>grants.reduce((s,g)=>s+(parseFloat((g.amountRequested||"").replace(/[^0-9.]/g,""))||0),0),[grants]);
  const activeGrants=grants.filter(g=>!["Archived","Declined","Closed Before Applying"].includes(g.status)&&!g.isArchived);

  const selectedGrant=selectedId?grants.find(g=>g.id===selectedId):null;

  const sel={background:"rgba(255,255,255,0.05)",border:"1px solid rgba(200,131,42,0.2)",borderRadius:8,padding:"7px 12px",color:"#c0b0a0",fontSize:13,outline:"none",cursor:"pointer",fontFamily:"inherit"};
  const NAV=[
    {id:"executive",label:"Executive Overview",icon:"◆"},
    {id:"pipeline",label:"Kanban Pipeline",icon:"▦"},
    {id:"all",label:"All Grants",icon:"☰"},
    {id:"sector",label:"Sector View",icon:"⊞"},
    {id:"financial",label:"Financial Dashboard",icon:"◈"},
    {id:"reports",label:"Reports & Strategy",icon:"◎"},
  ];

  return(
    <div style={{display:"flex",height:"100vh",background:"#060c14",color:"#c0b0a0",fontFamily:"system-ui,sans-serif",overflow:"hidden"}}>
      <style>{`
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:#060c14}
        ::-webkit-scrollbar-thumb{background:rgba(200,131,42,0.4);border-radius:2px}
        select option{background:#0d1825;color:#c0b0a0}
        button:disabled{opacity:0.3!important;cursor:not-allowed!important}
        tr:hover td{background:rgba(200,131,42,0.025)!important}
        input:focus,textarea:focus,select:focus{border-color:rgba(200,131,42,0.5)!important;outline:none!important}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* SIDEBAR */}
      <div style={{width:224,flexShrink:0,background:"linear-gradient(180deg,#07101c,#060c14)",borderRight:"1px solid rgba(200,131,42,0.2)",display:"flex",flexDirection:"column",boxShadow:"4px 0 30px rgba(0,0,0,0.6)"}}>
        <div style={{padding:"16px 14px 12px",borderBottom:"1px solid rgba(200,131,42,0.12)"}}>
          <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:7}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#c8832a,#7a4a10)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(200,131,42,0.45)",flexShrink:0,fontSize:16}}>⚖</div>
            <div><div style={{fontFamily:"Georgia,serif",fontSize:19,fontWeight:700,color:"#e8c88a",letterSpacing:1,lineHeight:1.1}}>RGN</div><div style={{fontSize:9,color:"#5a4a3a",letterSpacing:3}}>LABOUR DESK</div></div>
          </div>
          <div style={{fontSize:9,color:"#2a3a4a",letterSpacing:2}}>GRANT & PROGRAMME CRM v6</div>
          <div style={{marginTop:6,display:"flex",alignItems:"center",gap:5}}><div style={{width:5,height:5,borderRadius:"50%",background:"#c8832a",boxShadow:"0 0 6px rgba(200,131,42,0.6)"}}/><span style={{fontSize:9,color:"#7a6a5a"}}>Local mode · Persistent</span></div>
        </div>

        {/* User switcher */}
        <div style={{padding:"8px 12px",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
          <div style={{fontSize:9,color:"#2a3a4a",letterSpacing:2,marginBottom:4}}>VIEWING AS</div>
          <select value={currentUser} onChange={e=>setCurrentUser(e.target.value)} style={{...sel,width:"100%",fontSize:12,padding:"6px 9px"}}>
            {team.map(m=><option key={m}>{m}</option>)}
          </select>
        </div>

        <div style={{padding:"9px 12px",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
          {[{l:"Active Grants",v:activeGrants.length,c:"#c0b0a0"},{l:"Pipeline Value",v:`R${(total/1e6).toFixed(1)}M`,c:"#c8a060"},{l:"Urgent (≤7d)",v:urgent.length,c:urgent.length>0?"#ff8070":"#1a2a3a"}].map(s=>(
            <div key={s.l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
              <span style={{fontSize:10,color:"#2a3a4a"}}>{s.l}</span>
              <span style={{fontSize:12,fontFamily:"Georgia,serif",fontWeight:700,color:s.c}}>{s.v}</span>
            </div>
          ))}
        </div>

        <nav style={{flex:1,padding:"7px",display:"grid",gap:2}}>
          {NAV.map(item=>(
            <button key={item.id} onClick={()=>setView(item.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:7,fontSize:12,fontWeight:500,cursor:"pointer",textAlign:"left",background:view===item.id?"rgba(200,131,42,0.14)":"transparent",color:view===item.id?"#c8a060":"#3a4a5a",border:view===item.id?"1px solid rgba(200,131,42,0.26)":"1px solid transparent",fontFamily:"inherit"}}>
              <span style={{fontSize:12,flexShrink:0}}>{item.icon}</span>{item.label}
            </button>
          ))}
          <div style={{height:1,background:"rgba(255,255,255,0.04)",margin:"4px 0"}}/>
          <button onClick={()=>setShowTeam(true)} style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:7,fontSize:12,cursor:"pointer",background:"transparent",color:"#2a3a4a",border:"1px solid transparent",textAlign:"left",fontFamily:"inherit"}}>👤 Manage Team</button>
          <button onClick={()=>setShowArchived(a=>!a)} style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:7,fontSize:12,cursor:"pointer",background:showArchived?"rgba(80,80,80,0.1)":"transparent",color:showArchived?"#606060":"#2a3a4a",border:showArchived?"1px solid rgba(80,80,80,0.2)":"1px solid transparent",textAlign:"left",fontFamily:"inherit"}}>📦 {showArchived?"Hide":"Show"} Archived</button>
        </nav>

        <div style={{padding:"8px 8px"}}>
          <button onClick={()=>setShowAdd(true)} style={{width:"100%",padding:"10px",background:"linear-gradient(135deg,#c8832a,#a06020)",border:"none",borderRadius:9,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",letterSpacing:2,boxShadow:"0 4px 20px rgba(200,131,42,0.35)",fontFamily:"inherit"}}>+ NEW GRANT</button>
        </div>
        <div style={{padding:"7px 14px 11px",borderTop:"1px solid rgba(255,255,255,0.03)"}}>
          <div style={{fontSize:9,color:"#141e28",lineHeight:2,letterSpacing:0.5}}>PBO 930082491 · Section 18A<br/>UNITED WE WIN · v6.0</div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {/* URGENT BANNER */}
        {urgent.length>0&&(
          <div style={{flexShrink:0,background:"rgba(140,25,15,0.25)",borderBottom:"1px solid rgba(140,25,15,0.5)",padding:"7px 20px",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
            <span style={{fontSize:11,color:"#ff7060",letterSpacing:3,fontWeight:700,flexShrink:0}}>🚨 URGENT DEADLINES</span>
            {urgent.map(g=>(<button key={g.id} onClick={()=>setSelectedId(g.id)} style={{fontSize:11,background:"rgba(140,25,15,0.3)",border:"1px solid rgba(140,25,15,0.55)",color:"#ffb0a0",padding:"3px 11px",borderRadius:20,cursor:"pointer",fontFamily:"inherit"}}>{g.funderName} — {g._dy===0?"TODAY":`${g._dy}d`} ({fd(g._d)})</button>))}
          </div>
        )}

        {/* TOP BAR for list views */}
        <div style={{flexShrink:0,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 20px",borderBottom:"1px solid rgba(255,255,255,0.05)",background:"rgba(7,16,28,0.85)",backdropFilter:"blur(20px)",gap:9,flexWrap:"wrap"}}>
          <div style={{fontFamily:"Georgia,serif",fontSize:16,color:"#e0d0b0",fontWeight:700}}>
            {NAV.find(n=>n.id===view)?.label||""}
          </div>
          <div style={{display:"flex",gap:7,flexWrap:"wrap",alignItems:"center"}}>
            {["pipeline","all"].includes(view)&&<>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…" style={{...sel,width:180}}/>
              <select value={filterLead} onChange={e=>setFilterLead(e.target.value)} style={sel}><option value="All">All Leads</option>{team.map(m=><option key={m}>{m}</option>)}</select>
              <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={sel}><option value="All">All Stages</option>{STAGES.map(s=><option key={s}>{s}</option>)}</select>
            </>}
            {/* Bell */}
            <button onClick={()=>setShowNotifs(p=>!p)} style={{position:"relative",background:unread>0?"rgba(200,131,42,0.15)":"rgba(255,255,255,0.04)",border:`1px solid ${unread>0?"rgba(200,131,42,0.4)":"rgba(255,255,255,0.1)"}`,borderRadius:8,color:unread>0?"#c8832a":"#3a4a5a",padding:"6px 12px",cursor:"pointer",fontSize:14,fontFamily:"inherit"}}>
              🔔{unread>0&&<span style={{position:"absolute",top:-5,right:-5,background:"#c8832a",color:"#fff",fontSize:9,fontWeight:700,width:16,height:16,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>{unread}</span>}
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{flex:1,overflow:"auto",padding:16}}>
          {view==="executive"&&<ExecutiveDashboard grants={grants} onSelect={id=>setSelectedId(id)}/>}
          {view==="sector"&&<SectorView grants={filtered} onSelect={g=>setSelectedId(g.id)}/>}
          {view==="financial"&&<FinancialDashboard grants={grants}/>}
          {view==="reports"&&<Reports grants={grants}/>}
          {view==="all"&&<GrantsTable grants={filtered} onSelect={g=>setSelectedId(g.id)}/>}
          {view==="pipeline"&&(
            <div style={{display:"flex",gap:9,height:"100%",overflowX:"auto",paddingBottom:6}}>
              {[...STAGES_ACTIVE,...(showArchived?STAGES_TERMINAL:[])].map(stage=>{
                const cards=filtered.filter(g=>g.status===stage);
                const sc=SC[stage];const guide=STAGE_GUIDE[stage];
                return(
                  <div key={stage} style={{flexShrink:0,width:220,display:"flex",flexDirection:"column"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 9px",borderRadius:"7px 7px 0 0",background:`linear-gradient(135deg,${sc.bg},rgba(8,14,26,0.85))`,border:`1px solid ${sc.border}`,borderBottom:"none"}}>
                      <span style={{fontSize:10,fontWeight:700,color:sc.text,letterSpacing:1,textTransform:"uppercase",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{guide?.icon} {stage}</span>
                      <span style={{fontSize:13,fontFamily:"Georgia,serif",fontWeight:700,color:sc.dot,flexShrink:0,marginLeft:3}}>{cards.length}</span>
                    </div>
                    <div style={{flex:1,overflowY:"auto",padding:5,background:"rgba(255,255,255,0.012)",border:`1px solid ${sc.border}`,borderTop:"none",borderRadius:"0 0 7px 7px",minHeight:50,maxHeight:"calc(100vh - 220px)"}}>
                      {cards.map(g=><Card key={g.id} grant={g} onClick={()=>setSelectedId(g.id)}/>)}
                      {cards.length===0&&<div style={{padding:12,textAlign:"center",fontSize:11,color:"#1a2a3a",fontStyle:"italic"}}>No grants</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* FULL-PAGE GRANT DETAIL */}
      {selectedGrant&&(
        <GrantDetailPage
          key={selectedGrant.id}
          grant={selectedGrant}
          team={team}
          currentUser={currentUser}
          notifications={notifications}
          onUpdate={upsertGrant}
          onDelete={deleteGrant}
          onArchive={archiveGrant}
          onClose={()=>setSelectedId(null)}
          onNotify={addNotification}
        />
      )}

      {/* MODALS */}
      {showAdd&&<GrantModal team={team} onSave={g=>{const ng={...g,id:g.id||uid(),activities:g.activities||[],docs:g.docs||DEFAULT_DOCS.map(d=>({...d})),compliance:g.compliance||DEFAULT_COMPLIANCE.map(d=>({...d})),researchNotes:[],drafts:[],reviewMsgs:[],submission:null,award:null,implPlan:[],disbursements:[],budget:[],isArchived:false};upsertGrant(ng);}} onClose={()=>setShowAdd(false)}/>}
      {showTeam&&<TeamModal team={team} onSave={setTeam} onClose={()=>setShowTeam(false)}/>}
      {showNotifs&&<NotificationsPanel notifications={notifications} currentUser={currentUser} onMarkRead={markNotifRead} onClose={()=>setShowNotifs(false)}/>}
    </div>
  );
}
