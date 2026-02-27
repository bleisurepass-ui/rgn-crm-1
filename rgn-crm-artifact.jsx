import { useState, useMemo, useEffect } from "react";

const STAGES_ACTIVE = ["Opportunity Identified","Researching","Draft In Progress","Internal Review","Submitted","Under Review","Awarded","Implementation","Reporting","Completed"];
const STAGES_TERMINAL = ["Declined","Closed Before Applying","Stopped / Strategic Pause","Reapplication Eligible","Archived"];
const STAGES = [...STAGES_ACTIVE, ...STAGES_TERMINAL];

const PILLARS = ["Labour Justice & Inclusion","Skills Development & Workforce Acceleration","Enterprise Development & Formalisation","Market Access & Aggregation"];
const SECTORS = ["Labour & Legal Services","Skills Development (SETA/QCTO)","Digital & 4IR","Personal Care & Beauty","Cleaning & Hygiene","Green Economy & Agritech","Manufacturing","Creative Industries","Technical Trades","Healthcare","Retail & Township Trade","Youth Employability","Cooperative Development","Infrastructure & Innovation Hubs","Funding & Investment Facilitation"];
const PARTNER_TYPES = ["SETA","Corporate","School / University","Youth Organisation","Municipality","Funder","Government Dept.","NGO / NPO","International Body"];
const PROVINCES = ["Gauteng","Western Cape","KwaZulu-Natal","Eastern Cape","Limpopo","Mpumalanga","North West","Free State","Northern Cape","National"];
const REVENUE_TYPES = ["Grant","Corporate Contract","Management Fee","Hybrid","SETA Levy","CSI","International Aid"];
const FUNDER_TYPES = ["Government","Private Foundation","Corporate CSI","Government SETA","International Foundation","Corporate ESD","Bilateral Donor","Trust","DFI"];
const CATEGORY_TAGS = ["Labour Rights","Access to Justice","Youth Employment","Skills Training","Worker Education","Legal Empowerment","Civil Society","Social Justice","Gender Justice","Economic Justice","Enterprise Development","Digital Skills"];

const STAGE_GUIDE = {
  "Opportunity Identified":    {tip:"Verify eligibility, confirm alignment with RGN's pillars, and assess strategic fit before investing research time.",icon:"🔍"},
  "Researching":               {tip:"Actively gathering intel. Find past grantees, identify programme officer, download application guidelines, confirm deadline.",icon:"📚"},
  "Draft In Progress":         {tip:"Writing phase. Match narrative language to funder's stated priorities. Assign a lead writer and a reviewer.",icon:"✍️"},
  "Internal Review":           {tip:"Draft complete — circulate to Director and relevant staff. Set firm internal deadline at least 5 days before funder's deadline.",icon:"👁"},
  "Submitted":                 {tip:"Application sent. Log confirmation number, submission date, and portal link. Send a thank-you note to your programme officer.",icon:"📤"},
  "Under Review":              {tip:"Funder is reviewing. Stay available for questions. Prepare for a potential site visit, reference check, or budget clarification.",icon:"⏳"},
  "Awarded":                   {tip:"Grant awarded! Set up reporting schedule, disbursement tracker, compliance checklist, and impact measurement plan.",icon:"🏆"},
  "Implementation":            {tip:"Programme is running. Log monthly progress notes, beneficiary counts, and variances against approved budget and work plan.",icon:"⚙️"},
  "Reporting":                 {tip:"Reporting phase. Compile evidence: case data, financial records, photos, testimonials. Submit reports on time.",icon:"📋"},
  "Completed":                 {tip:"Grant cycle complete. Log final impact data, lessons learned, and assess reapplication eligibility.",icon:"✅"},
  "Declined":                  {tip:"Application unsuccessful. Log the reason if given, request funder feedback, and decide whether to reapply next cycle.",icon:"📎"},
  "Closed Before Applying":    {tip:"Decision made not to pursue this cycle. Record the reason and set a reminder for the next funding window.",icon:"🔒"},
  "Stopped / Strategic Pause": {tip:"Temporarily paused. Document the reason and conditions under which this application would be reactivated.",icon:"⏸"},
  "Reapplication Eligible":    {tip:"Previous cycle declined or completed. Prepare a stronger application using feedback and new impact data.",icon:"🔁"},
  "Archived":                  {tip:"Inactive — record kept for history and analysis. Reactivate if funder reopens or becomes relevant again.",icon:"📦"},
};

const STAGE_COLORS = {
  "Opportunity Identified":    {bg:"#0f1a28",border:"#1a3040",dot:"#3a6080",text:"#7aadcc"},
  "Researching":               {bg:"#0f1530",border:"#1a2550",dot:"#3a50a0",text:"#7a90d0"},
  "Draft In Progress":         {bg:"#1a1030",border:"#302050",dot:"#6030a0",text:"#a070d0"},
  "Internal Review":           {bg:"#281a08",border:"#503010",dot:"#c87020",text:"#e09040"},
  "Submitted":                 {bg:"#081825",border:"#0f3050",dot:"#1a70b0",text:"#50a0d0"},
  "Under Review":              {bg:"#082020",border:"#104040",dot:"#108080",text:"#40b0a0"},
  "Awarded":                   {bg:"#082010",border:"#104020",dot:"#1a8040",text:"#40b060"},
  "Implementation":            {bg:"#101830",border:"#182840",dot:"#2a5080",text:"#5080b0"},
  "Reporting":                 {bg:"#201808",border:"#402810",dot:"#a07020",text:"#c8a040"},
  "Completed":                 {bg:"#101a10",border:"#203020",dot:"#408040",text:"#60a860"},
  "Declined":                  {bg:"#201010",border:"#401818",dot:"#802020",text:"#c06060"},
  "Closed Before Applying":    {bg:"#181818",border:"#282828",dot:"#484848",text:"#888888"},
  "Stopped / Strategic Pause": {bg:"#1a1408",border:"#302408",dot:"#706020",text:"#a09040"},
  "Reapplication Eligible":    {bg:"#101828",border:"#1a2840",dot:"#2a4878",text:"#5a88c0"},
  "Archived":                  {bg:"#101010",border:"#1a1a1a",dot:"#303030",text:"#505050"},
};

const PILLAR_COLORS = {
  "Labour Justice & Inclusion":                  {bg:"rgba(200,131,42,0.09)",b:"rgba(200,131,42,0.32)",t:"#c8832a",dot:"#c8832a"},
  "Skills Development & Workforce Acceleration": {bg:"rgba(50,100,200,0.09)",b:"rgba(50,100,200,0.32)",t:"#5080d0",dot:"#5080d0"},
  "Enterprise Development & Formalisation":      {bg:"rgba(40,160,80,0.09)",b:"rgba(40,160,80,0.32)",t:"#40a060",dot:"#40a060"},
  "Market Access & Aggregation":                 {bg:"rgba(160,50,160,0.09)",b:"rgba(160,50,160,0.32)",t:"#a050a0",dot:"#a050a0"},
};

const DEFAULT_DOCS = [{name:"NPO/NPC Registration Certificate",isCompleted:false,link:""},{name:"Section 18A PBO Certificate",isCompleted:true,link:""},{name:"SARS Tax Clearance Certificate",isCompleted:false,link:""},{name:"Audited Financial Statements (3 years)",isCompleted:false,link:""},{name:"Theory of Change Document",isCompleted:false,link:""},{name:"Logical Framework (LogFrame)",isCompleted:false,link:""},{name:"Board Resolution / Authorisation Letter",isCompleted:false,link:""},{name:"Organisation Profile / Brochure",isCompleted:false,link:""}];
const DEFAULT_COMPLIANCE = [{name:"Quarterly Progress Report",dueDate:"",isCompleted:false},{name:"Mid-Term Evaluation",dueDate:"",isCompleted:false},{name:"Annual Financial Audit",dueDate:"",isCompleted:false},{name:"Final Impact Report",dueDate:"",isCompleted:false}];
const DEFAULT_TEAM = ["Director","Sipho M.","Naledi K.","Thabo D.","Priya N."];

const SEED_GRANTS = [
  {id:"g1",grantName:"Labour Law Training Initiative",funderName:"Dept. Employment & Labour",applicationURL:"https://www.labour.gov.za/",description:"Partners with civil society to train vulnerable workers on BCEA, LRA, EEA, UIA, COIDA & OHSA. Targets domestic workers, farm workers, and retrenched employees in townships.",contactName:"Labour Grant Desk",contactEmail:"info@labour.gov.za",contactPhone:"0800 20 13 00",contactLinkedIn:"",amountRequested:"R2,000,000",totalBudget:"R2,500,000",matchRequirementPercent:"",eligibilityStatus:"Eligible",funderType:"Government",categoryTag:"Labour Rights",pillar:"Labour Justice & Inclusion",sectors:["Labour & Legal Services"],partnerType:"Government Dept.",province:"Gauteng",revenueType:"Grant",strategicAlignmentScore:5,loiDeadline:"",fullProposalDeadline:"",internalReviewDeadline:"",followupDate:"2026-03-15",reportingDeadline:"",reapplicationDate:"",assignedLead:"Director",supportTeam:[],dateAssigned:"2026-02-20",projectWeekStart:"2026-02-24",targetWeek:"Week 1 (Immediate)",status:"Researching",submissionConfirmationNumber:"",awardAmount:"",awardDate:"",disbursements:[],budgetActuals:[],complianceItems:DEFAULT_COMPLIANCE.map(d=>({...d})),impactMetrics:{beneficiaries:"",jobsCreated:"",trainingSessions:"",notes:""},kpiTargets:[{name:"Workers trained",target:"1000",current:""},{name:"Workshops delivered",target:"100",current:""}],sustainabilityPlan:"",revenueDiversification:"",corporateLinkages:"",reapplicationFlag:false,nextFundingWindow:"",isArchived:false,archiveReason:"",documentChecklist:DEFAULT_DOCS.map(d=>({...d})),documentLinks:[{name:"Application Guidelines",url:""},{name:"Budget Template",url:""}],activities:[{timestamp:"2026-02-20T09:00:00Z",author:"Director",type:"note",content:"#1 priority — government credibility unlocks all CSI funders. Rolling deadline — apply immediately."},{timestamp:"2026-02-22T14:30:00Z",author:"Sipho M.",type:"note",content:"Reviewed eligibility. All boxes checked: NPO Act registered, labour law focus, township delivery."}]},
  {id:"g2",grantName:"Youth Employment & Civil Society Innovation",funderName:"DG Murray Trust (DGMT)",applicationURL:"https://dgmt.co.za/apply-for-funding/",description:"SA's largest independent funder. Targets 10 inequality trap opportunities including youth employment and civil society capacity. Portal reopened Feb 2, 2026.",contactName:"Applications Team",contactEmail:"applications@dgmt.co.za",contactPhone:"+27 21 670 9840",contactLinkedIn:"linkedin.com/company/dgmt",amountRequested:"R1,500,000",totalBudget:"R2,000,000",matchRequirementPercent:"",eligibilityStatus:"Eligible",funderType:"Private Foundation",categoryTag:"Youth Employment",pillar:"Skills Development & Workforce Acceleration",sectors:["Youth Employability","Labour & Legal Services"],partnerType:"Funder",province:"National",revenueType:"Grant",strategicAlignmentScore:4,loiDeadline:"2026-03-15",fullProposalDeadline:"2026-03-31",internalReviewDeadline:"2026-03-08",followupDate:"2026-03-16",reportingDeadline:"",reapplicationDate:"",assignedLead:"Naledi K.",supportTeam:["Sipho M."],dateAssigned:"2026-02-10",projectWeekStart:"2026-02-24",targetWeek:"Week 2",status:"Draft In Progress",submissionConfirmationNumber:"",awardAmount:"",awardDate:"",disbursements:[],budgetActuals:[],complianceItems:DEFAULT_COMPLIANCE.map(d=>({...d})),impactMetrics:{beneficiaries:"",jobsCreated:"",trainingSessions:"",notes:""},kpiTargets:[{name:"Candidate attorneys placed",target:"20",current:""},{name:"Permanent employment rate",target:"40%",current:""}],sustainabilityPlan:"",revenueDiversification:"SETA accreditation as secondary funding stream post-Year 2",corporateLinkages:"",reapplicationFlag:false,nextFundingWindow:"",isArchived:false,archiveReason:"",documentChecklist:DEFAULT_DOCS.map(d=>({...d})),documentLinks:[{name:"Concept Note Draft v1",url:""},{name:"DGMT Guidelines 2026",url:""}],activities:[{timestamp:"2026-02-10T08:00:00Z",author:"Director",type:"note",content:"Portal reopened Feb 2, 2026. Apply before end of March. Lead with candidate attorney development: 20/year, 40% permanent = 8 legal jobs annually."},{timestamp:"2026-02-23T16:00:00Z",author:"Naledi K.",type:"note",content:"Concept note first draft complete. Pending Director review. Internal deadline March 8."}]},
  {id:"g3",grantName:"Social Justice Core Grant",funderName:"RAITH Foundation",applicationURL:"https://raith.org.za/apply/",description:"Regular core grants for NPOs doing systemic social change. Funds work holding power accountable where it affects the marginalised and vulnerable.",contactName:"Grants Team",contactEmail:"grants@raith.org.za",contactPhone:"",contactLinkedIn:"",amountRequested:"R800,000",totalBudget:"R1,200,000",matchRequirementPercent:"",eligibilityStatus:"Eligible",funderType:"Private Foundation",categoryTag:"Social Justice",pillar:"Labour Justice & Inclusion",sectors:["Labour & Legal Services"],partnerType:"Funder",province:"National",revenueType:"Grant",strategicAlignmentScore:5,loiDeadline:"",fullProposalDeadline:"2026-04-30",internalReviewDeadline:"2026-04-15",followupDate:"2026-05-15",reportingDeadline:"",reapplicationDate:"",assignedLead:"Thabo D.",supportTeam:[],dateAssigned:"2026-02-15",projectWeekStart:"2026-03-01",targetWeek:"Week 3",status:"Researching",submissionConfirmationNumber:"",awardAmount:"",awardDate:"",disbursements:[],budgetActuals:[],complianceItems:DEFAULT_COMPLIANCE.map(d=>({...d})),impactMetrics:{beneficiaries:"",jobsCreated:"",trainingSessions:"",notes:""},kpiTargets:[{name:"CCMA cases represented",target:"150",current:""},{name:"Successful outcomes",target:"70%",current:""}],sustainabilityPlan:"",revenueDiversification:"",corporateLinkages:"Legal Resources Centre partnership",reapplicationFlag:false,nextFundingWindow:"",isArchived:false,archiveReason:"",documentChecklist:DEFAULT_DOCS.map(d=>({...d})),documentLinks:[],activities:[{timestamp:"2026-02-15T10:00:00Z",author:"Thabo D.",type:"note",content:"RAITH criteria are verbatim match to RGN mandate. Use RAITH language — accountability, not charity."}]},
  {id:"g4",grantName:"Access to Justice — Expression of Interest",funderName:"Legal Empowerment Fund",applicationURL:"https://legalempowermentfund.org/apply/",description:"$100M programme awarding 2-year UNRESTRICTED core funding to grassroots legal empowerment organisations. Three pillars: Know the Law, Use the Law, Shape the Law.",contactName:"Applications",contactEmail:"applications@globalhumanrights.org",contactPhone:"",contactLinkedIn:"legalempowermentfund.org",amountRequested:"R750,000",totalBudget:"R750,000",matchRequirementPercent:"",eligibilityStatus:"Eligible",funderType:"International Foundation",categoryTag:"Legal Empowerment",pillar:"Labour Justice & Inclusion",sectors:["Labour & Legal Services"],partnerType:"International Body",province:"National",revenueType:"International Aid",strategicAlignmentScore:5,loiDeadline:"2026-03-07",fullProposalDeadline:"",internalReviewDeadline:"2026-03-04",followupDate:"2026-04-01",reportingDeadline:"",reapplicationDate:"",assignedLead:"Sipho M.",supportTeam:["Director"],dateAssigned:"2026-02-20",projectWeekStart:"2026-02-23",targetWeek:"Week 1 (Immediate)",status:"Draft In Progress",submissionConfirmationNumber:"",awardAmount:"",awardDate:"",disbursements:[],budgetActuals:[],complianceItems:DEFAULT_COMPLIANCE.map(d=>({...d})),impactMetrics:{beneficiaries:"",jobsCreated:"",trainingSessions:"",notes:""},kpiTargets:[{name:"Rights awareness sessions",target:"100",current:""},{name:"CCMA referrals supported",target:"500",current:""}],sustainabilityPlan:"Unrestricted 2-year core funding covers operational costs — use period to diversify income",revenueDiversification:"",corporateLinkages:"",reapplicationFlag:true,nextFundingWindow:"2028-01-01",isArchived:false,archiveReason:"",documentChecklist:[{name:"Expression of Interest (1-2 pages)",isCompleted:false,link:""},{name:"Three-Pillar Framing",isCompleted:true,link:""},{name:"Annual Budget Evidence",isCompleted:false,link:""},{name:"Organisational Profile",isCompleted:true,link:""}],documentLinks:[{name:"EOI Draft v1",url:""},{name:"LEF Guidelines",url:""}],activities:[{timestamp:"2026-02-20T09:30:00Z",author:"Sipho M.",type:"note",content:"PERFECT MATCH: unrestricted 2-year core funding covers salaries and overheads. EOI due urgently."},{timestamp:"2026-02-24T08:00:00Z",author:"Sipho M.",type:"note",content:"EOI first draft written. 1.5 pages. Internal review deadline March 4."}]},
  {id:"g5",grantName:"Future of Work(ers) Programme — LOI",funderName:"Ford Foundation",applicationURL:"https://www.fordfoundation.org/work/our-grants/",description:"Funds organisations addressing power imbalances between workers and employers. Active in SA — funds LHR, SERI, and LRC. 6–12 month decision cycle.",contactName:"Grants Portal",contactEmail:"grants@fordfoundation.org",contactPhone:"",contactLinkedIn:"linkedin.com/company/ford-foundation",amountRequested:"R5,000,000",totalBudget:"R5,000,000",matchRequirementPercent:"",eligibilityStatus:"Eligible",funderType:"International Foundation",categoryTag:"Labour Rights",pillar:"Labour Justice & Inclusion",sectors:["Labour & Legal Services","Youth Employability"],partnerType:"International Body",province:"National",revenueType:"International Aid",strategicAlignmentScore:4,loiDeadline:"2026-04-30",fullProposalDeadline:"",internalReviewDeadline:"2026-04-20",followupDate:"2026-05-30",reportingDeadline:"",reapplicationDate:"",assignedLead:"Director",supportTeam:["Naledi K."],dateAssigned:"2026-02-20",projectWeekStart:"2026-03-24",targetWeek:"Week 4–6",status:"Researching",submissionConfirmationNumber:"",awardAmount:"",awardDate:"",disbursements:[],budgetActuals:[],complianceItems:DEFAULT_COMPLIANCE.map(d=>({...d})),impactMetrics:{beneficiaries:"",jobsCreated:"",trainingSessions:"",notes:""},kpiTargets:[{name:"Workers from informal sector served",target:"5000",current:""}],sustainabilityPlan:"Ford funds systemic change — use funding period to build evidence base for policy reform",revenueDiversification:"",corporateLinkages:"",reapplicationFlag:false,nextFundingWindow:"",isArchived:false,archiveReason:"",documentChecklist:[{name:"Theory of Change (required)",isCompleted:false,link:""},{name:"Letter of Inquiry (2 pages)",isCompleted:false,link:""},{name:"Evidence of Systemic Impact",isCompleted:false,link:""},{name:"Audited Financials",isCompleted:false,link:""}],documentLinks:[],activities:[{timestamp:"2026-02-20T10:00:00Z",author:"Director",type:"note",content:"6–12 month cycle: LOI in April = funding early 2027. Frame around 35% case abandonment rate as structural barrier."}]},
  {id:"g6",grantName:"SETA Skills Development Learnership",funderName:"Services SETA",applicationURL:"https://dynamics365.servicesseta.org.za/special-projects/",description:"Special Projects for accredited NPOs delivering skills programmes. Next window expected November 2026. SETA accreditation required — start 3-6 month process immediately.",contactName:"Special Projects",contactEmail:"specialprojects26@serviceseta.org.za",contactPhone:"",contactLinkedIn:"servicesseta.org.za",amountRequested:"R5,000,000",totalBudget:"R6,000,000",matchRequirementPercent:"",eligibilityStatus:"Pending SETA Accreditation",funderType:"Government SETA",categoryTag:"Skills Training",pillar:"Skills Development & Workforce Acceleration",sectors:["Skills Development (SETA/QCTO)","Youth Employability"],partnerType:"SETA",province:"Gauteng",revenueType:"SETA Levy",strategicAlignmentScore:4,loiDeadline:"",fullProposalDeadline:"2026-11-01",internalReviewDeadline:"",followupDate:"2026-06-01",reportingDeadline:"",reapplicationDate:"",assignedLead:"Thabo D.",supportTeam:[],dateAssigned:"2026-02-20",projectWeekStart:"2026-03-01",targetWeek:"Week 6–8 (Accreditation)",status:"Opportunity Identified",submissionConfirmationNumber:"",awardAmount:"",awardDate:"",disbursements:[],budgetActuals:[],complianceItems:DEFAULT_COMPLIANCE.map(d=>({...d})),impactMetrics:{beneficiaries:"",jobsCreated:"",trainingSessions:"",notes:""},kpiTargets:[{name:"Candidate attorneys trained",target:"20",current:""}],sustainabilityPlan:"SETA accreditation makes attorney programme a recurring funded learnership — creates structural income",revenueDiversification:"SETA levy funding as secondary annual income",corporateLinkages:"IDC Enterprise Development for candidate attorney placement",reapplicationFlag:false,nextFundingWindow:"2026-11-01",isArchived:false,archiveReason:"",documentChecklist:[{name:"SETA Skills Provider Accreditation (START NOW)",isCompleted:false,link:""},{name:"Sector Skills Plan Alignment",isCompleted:false,link:""},{name:"Learnership Curriculum (NQF-aligned)",isCompleted:false,link:""}],documentLinks:[],activities:[{timestamp:"2026-02-20T09:00:00Z",author:"Thabo D.",type:"note",content:"CRITICAL: Cannot access SETA funding without accreditation. Starting process now — 3-6 month timeline. Target: accredited by August 2026."}]},
];

function daysUntil(d){if(!d)return null;return Math.ceil((new Date(d)-new Date())/86400000);}
function urgCls(d){if(d===null)return"neutral";if(d<=0)return"overdue";if(d<=7)return"critical";if(d<=21)return"warning";return"safe";}
function fd(d){if(!d)return"—";return new Date(d).toLocaleDateString("en-ZA",{day:"numeric",month:"short",year:"numeric"});}
function fts(t){return new Date(t).toLocaleString("en-ZA",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"});}
function uid(){return"g"+Date.now()+Math.random().toString(36).slice(2,7);}
const US={overdue:{bg:"rgba(180,40,30,0.18)",b:"rgba(180,40,30,0.55)",t:"#ff7060"},critical:{bg:"rgba(180,40,30,0.10)",b:"rgba(180,40,30,0.4)",t:"#ff9070"},warning:{bg:"rgba(200,131,42,0.12)",b:"rgba(200,131,42,0.4)",t:"#e8a84a"},safe:{bg:"rgba(40,160,80,0.08)",b:"rgba(40,160,80,0.3)",t:"#60c880"},neutral:{bg:"rgba(255,255,255,0.04)",b:"rgba(255,255,255,0.1)",t:"#6a7a8a"}};

const I={background:"rgba(255,255,255,0.05)",border:"1px solid rgba(200,131,42,0.22)",borderRadius:8,padding:"10px 14px",color:"#d0c0a8",fontSize:14,outline:"none",fontFamily:"system-ui,sans-serif",width:"100%",transition:"border-color 0.2s"};
const L={fontSize:11,color:"#5a6a7a",letterSpacing:2,textTransform:"uppercase",display:"block",marginBottom:6,fontWeight:600};
const S_style={fontSize:12,color:"#7a6a5a",letterSpacing:3,textTransform:"uppercase",marginBottom:12,paddingBottom:8,borderBottom:"1px solid rgba(200,131,42,0.12)",fontWeight:700};

function StarRating({value=0,onChange,size=16}){
  return <div style={{display:"flex",gap:3}}>{[1,2,3,4,5].map(n=><span key={n} onClick={()=>onChange&&onChange(n)} style={{fontSize:size,cursor:onChange?"pointer":"default",color:n<=value?"#c8832a":"rgba(200,131,42,0.2)",textShadow:n<=value?"0 0 8px rgba(200,131,42,0.5)":"none",transition:"all 0.15s"}}>★</span>)}</div>;
}

function SectorChip({sector}){
  return <span style={{fontSize:11,padding:"2px 8px",borderRadius:20,background:"rgba(80,100,160,0.12)",border:"1px solid rgba(80,100,160,0.25)",color:"#7090c0",fontWeight:600,letterSpacing:0.5,display:"inline-block"}}>{sector}</span>;
}

function Card({grant,onClick}){
  const d=grant.fullProposalDeadline||grant.loiDeadline||grant.internalReviewDeadline||grant.followupDate;
  const dy=d?daysUntil(d):null;const u=urgCls(dy);
  const sc=STAGE_COLORS[grant.status]||STAGE_COLORS["Opportunity Identified"];
  const docsOk=grant.documentChecklist.filter(d=>d.isCompleted).length;
  const docsTotal=grant.documentChecklist.length;
  const pc=PILLAR_COLORS[grant.pillar];
  const borderAccent=dy!==null&&dy<=7?"rgba(200,70,50,0.6)":dy!==null&&dy<=21?"rgba(200,131,42,0.5)":sc.border;
  const [hov,setHov]=useState(false);
  return(
    <div onClick={onClick} onMouseOver={()=>setHov(true)} onMouseOut={()=>setHov(false)} style={{background:`linear-gradient(145deg,${sc.bg},rgba(6,10,18,0.95))`,border:`1px solid ${hov?"#c8832a":borderAccent}`,borderRadius:10,padding:"13px 14px",cursor:"pointer",transition:"all 0.2s",marginBottom:6,boxShadow:"0 4px 16px rgba(0,0,0,0.4)"}}>
      <div style={{fontSize:10,color:"#4a5a6a",letterSpacing:1,marginBottom:3,textTransform:"uppercase",fontWeight:600}}>{grant.funderName}</div>
      <div style={{fontFamily:"Georgia,serif",fontSize:14,color:"#e0d0b8",fontWeight:700,lineHeight:1.35,marginBottom:7}}>{grant.grantName}</div>
      {pc&&<div style={{fontSize:11,padding:"2px 8px",borderRadius:10,background:pc.bg,border:`1px solid ${pc.b}`,color:pc.t,display:"inline-block",marginBottom:6,fontWeight:600}}>{(grant.pillar||"").split("&")[0].trim()}</div>}
      <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:7}}>{(grant.sectors||[]).slice(0,2).map(s=><SectorChip key={s} sector={s}/>)}{(grant.sectors||[]).length>2&&<span style={{fontSize:10,color:"#3a4a5a"}}>+{(grant.sectors||[]).length-2}</span>}</div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
        {grant.amountRequested&&<span style={{fontFamily:"Georgia,serif",fontSize:13,color:"#c8a060",fontWeight:600}}>{grant.amountRequested}</span>}
        {grant.strategicAlignmentScore>0&&<StarRating value={grant.strategicAlignmentScore} size={11}/>}
      </div>
      {d&&<div style={{background:US[u].bg,border:`1px solid ${US[u].b}`,borderRadius:6,padding:"4px 9px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
        <span style={{fontSize:10,color:"#6a7a8a"}}>{fd(d)}</span>
        <span style={{fontSize:11,fontWeight:700,color:US[u].t}}>{dy<=0?"OVERDUE":`${dy}d`}</span>
      </div>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:10,color:"#3a4a5a"}}>{grant.assignedLead||"Unassigned"}</span>
        <div style={{display:"flex",alignItems:"center",gap:5}}>
          <div style={{width:30,height:2,background:"rgba(255,255,255,0.07)",borderRadius:1,overflow:"hidden"}}><div style={{width:`${docsTotal>0?(docsOk/docsTotal)*100:0}%`,height:"100%",background:"#c8832a"}}/></div>
          <span style={{fontSize:10,color:"#2a3a4a"}}>{docsOk}/{docsTotal}</span>
        </div>
      </div>
    </div>
  );
}

function Detail({grant,team,onUpdate,onClose}){
  const[note,setNote]=useState("");
  const[author,setAuthor]=useState(team[0]||"Director");
  const[tab,setTab]=useState("overview");
  const[edit,setEdit]=useState(false);

  function addNote(){if(!note.trim())return;onUpdate({...grant,activities:[...grant.activities,{timestamp:new Date().toISOString(),author,type:"note",content:note.trim()}]});setNote("");}
  function moveStage(dir){const idx=STAGES_ACTIVE.indexOf(grant.status);const next=STAGES_ACTIVE[idx+dir];if(next)onUpdate({...grant,status:next,activities:[...grant.activities,{timestamp:new Date().toISOString(),author,type:"status",content:`Stage moved to: ${next}`}]});}
  function toggleDoc(i){const dl=[...grant.documentChecklist];dl[i]={...dl[i],isCompleted:!dl[i].isCompleted};onUpdate({...grant,documentChecklist:dl});}

  const sc=STAGE_COLORS[grant.status]||STAGE_COLORS["Opportunity Identified"];
  const stageGuide=STAGE_GUIDE[grant.status];
  const deadlines=[{l:"LOI Deadline",d:grant.loiDeadline},{l:"Internal Review",d:grant.internalReviewDeadline},{l:"Full Proposal",d:grant.fullProposalDeadline},{l:"Follow-Up",d:grant.followupDate}].filter(x=>x.d);
  const docsOk=grant.documentChecklist.filter(d=>d.isCompleted).length;
  const pc=PILLAR_COLORS[grant.pillar];

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",display:"flex",justifyContent:"flex-end",zIndex:40,backdropFilter:"blur(4px)"}} onClick={onClose}>
      <div style={{background:"linear-gradient(160deg,#080e1a,#0c1525)",borderLeft:"1px solid rgba(200,131,42,0.3)",width:"100%",maxWidth:560,height:"100%",overflowY:"auto",display:"flex",flexDirection:"column",boxShadow:"-40px 0 80px rgba(0,0,0,0.8)"}} onClick={e=>e.stopPropagation()}>
        <div style={{background:`linear-gradient(135deg,${sc.bg},rgba(8,14,26,0.97))`,borderBottom:`1px solid ${sc.border}`,padding:"20px 24px",flexShrink:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
            <div style={{flex:1}}>
              <div style={{fontSize:9,color:"#c8832a",letterSpacing:4,marginBottom:4}}>GRANT OPPORTUNITY</div>
              <h2 style={{fontFamily:"Georgia,serif",fontSize:20,color:"#f0e8d8",fontWeight:700,margin:"0 0 3px",lineHeight:1.2}}>{grant.grantName}</h2>
              <div style={{fontSize:13,color:"#5a6a7a",marginBottom:8}}>{grant.funderName}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                <span style={{fontSize:11,padding:"3px 9px",borderRadius:20,background:sc.bg,color:sc.text,border:`1px solid ${sc.border}`}}>{stageGuide?.icon} {grant.status}</span>
                {pc&&<span style={{fontSize:11,padding:"3px 9px",borderRadius:20,background:pc.bg,color:pc.t,border:`1px solid ${pc.b}`}}>{(grant.pillar||"").split("&")[0].trim()}</span>}
                {grant.assignedLead&&<span style={{fontSize:11,padding:"3px 9px",borderRadius:20,background:"rgba(100,100,160,0.15)",color:"#9090d0",border:"1px solid rgba(100,100,160,0.3)"}}>👤 {grant.assignedLead}</span>}
                {grant.strategicAlignmentScore>0&&<StarRating value={grant.strategicAlignmentScore} size={12}/>}
              </div>
            </div>
            <div style={{display:"flex",gap:7,flexShrink:0,marginLeft:10}}>
              <button onClick={()=>setEdit(true)} style={{background:"rgba(200,131,42,0.15)",border:"1px solid rgba(200,131,42,0.3)",borderRadius:7,color:"#c8832a",padding:"6px 12px",fontSize:11,cursor:"pointer",letterSpacing:1}}>EDIT</button>
              <button onClick={onClose} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:7,color:"#6a7a8a",width:32,height:32,cursor:"pointer",fontSize:18,lineHeight:1}}>×</button>
            </div>
          </div>
          {stageGuide&&<div style={{background:"rgba(200,131,42,0.06)",border:"1px solid rgba(200,131,42,0.14)",borderRadius:8,padding:"8px 12px",fontSize:12,color:"#9a8a6a",lineHeight:1.7,marginBottom:10}}>{stageGuide.icon} <strong style={{color:"#c8832a"}}>What to do now:</strong> {stageGuide.tip}</div>}
          <div style={{display:"flex",alignItems:"center",gap:8,background:"rgba(0,0,0,0.3)",borderRadius:9,padding:"7px 10px",border:"1px solid rgba(255,255,255,0.05)"}}>
            <button onClick={()=>moveStage(-1)} disabled={STAGES_ACTIVE.indexOf(grant.status)<=0} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:6,color:"#8a9ab0",padding:"4px 11px",fontSize:11,cursor:"pointer"}}>← Back</button>
            <div style={{flex:1,textAlign:"center"}}>
              <div style={{fontSize:10,color:"#2a3a4a",letterSpacing:2,marginBottom:3}}>STAGE {STAGES_ACTIVE.indexOf(grant.status)+1} / {STAGES_ACTIVE.length}</div>
              <div style={{display:"flex",gap:2,justifyContent:"center"}}>{STAGES_ACTIVE.map((s,i)=><div key={s} style={{width:10,height:2.5,borderRadius:2,background:i<=STAGES_ACTIVE.indexOf(grant.status)?sc.dot:"rgba(255,255,255,0.07)"}}/>)}</div>
            </div>
            <button onClick={()=>moveStage(1)} disabled={STAGES_ACTIVE.indexOf(grant.status)>=STAGES_ACTIVE.length-1} style={{background:"linear-gradient(135deg,#c8832a,#a06020)",border:"none",borderRadius:6,color:"#fff",padding:"4px 11px",fontSize:11,cursor:"pointer",fontWeight:600}}>Advance →</button>
          </div>
        </div>
        <div style={{display:"flex",borderBottom:"1px solid rgba(255,255,255,0.06)",padding:"0 24px",background:"rgba(0,0,0,0.2)",flexShrink:0}}>
          {[["overview","Overview"],["sector","Sector"],["docs","Documents"],["award","Award"],["activity","Activity"]].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{padding:"9px 12px",fontSize:12,cursor:"pointer",background:"transparent",border:"none",borderBottom:tab===id?"2px solid #c8832a":"2px solid transparent",color:tab===id?"#c8832a":"#3a4a5a",whiteSpace:"nowrap"}}>{label}</button>
          ))}
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"18px 24px",display:"grid",gap:14,alignContent:"start"}}>
          {tab==="overview"&&<>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              {[{l:"REQUESTED",v:grant.amountRequested||"TBD"},{l:"TOTAL BUDGET",v:grant.totalBudget||"TBD"},{l:"MATCH REQ.",v:grant.matchRequirementPercent?grant.matchRequirementPercent+"%":"None"}].map(k=>(
                <div key={k.l} style={{background:"rgba(200,131,42,0.06)",border:"1px solid rgba(200,131,42,0.18)",borderRadius:9,padding:"10px",textAlign:"center"}}>
                  <div style={{fontSize:9,color:"#7a6a5a",letterSpacing:2,marginBottom:3}}>{k.l}</div>
                  <div style={{fontFamily:"Georgia,serif",fontSize:15,fontWeight:700,color:"#e8c88a"}}>{k.v}</div>
                </div>
              ))}
            </div>
            {deadlines.length>0&&<div>
              <div style={{fontSize:10,color:"#4a5a6a",letterSpacing:3,textTransform:"uppercase",marginBottom:7,fontWeight:600}}>DEADLINES</div>
              {deadlines.map(d=>{const dy=daysUntil(d.d);const u=US[urgCls(dy)];return(
                <div key={d.l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:u.bg,border:`1px solid ${u.b}`,borderRadius:7,padding:"8px 12px",marginBottom:5}}>
                  <span style={{fontSize:13,color:"#7a8a9a"}}>{d.l}</span>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <span style={{fontSize:12,color:"#5a6a7a"}}>{fd(d.d)}</span>
                    <span style={{fontSize:12,fontWeight:700,color:u.t}}>{dy<=0?"OVERDUE":`${dy}d`}</span>
                  </div>
                </div>
              );})}
            </div>}
            <div>
              <div style={{fontSize:10,color:"#4a5a6a",letterSpacing:3,textTransform:"uppercase",marginBottom:7,fontWeight:600}}>TEAM & PLANNING</div>
              <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:9,padding:"12px 14px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[["Assigned Lead",grant.assignedLead||"—"],["Date Assigned",grant.dateAssigned?fd(grant.dateAssigned):"—"],["Focus Week Start",grant.projectWeekStart?fd(grant.projectWeekStart):"—"],["Target Timeframe",grant.targetWeek||"—"],["Support Team",(grant.supportTeam||[]).join(", ")||"—"],["Confirmation #",grant.submissionConfirmationNumber||"—"]].map(([l,v])=>(
                  <div key={l}><div style={{fontSize:10,color:"#3a4a5a",letterSpacing:1,marginBottom:2,textTransform:"uppercase",fontWeight:600}}>{l}</div><div style={{fontSize:13,color:"#c0b0a0"}}>{v}</div></div>
                ))}
              </div>
            </div>
            {grant.description&&<div><div style={{fontSize:10,color:"#4a5a6a",letterSpacing:3,textTransform:"uppercase",marginBottom:7,fontWeight:600}}>DESCRIPTION</div><p style={{fontSize:13,color:"#8a7a6a",lineHeight:1.85,margin:0}}>{grant.description}</p></div>}
            <div>
              <div style={{fontSize:10,color:"#4a5a6a",letterSpacing:3,textTransform:"uppercase",marginBottom:7,fontWeight:600}}>CONTACT</div>
              <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:9,padding:"12px 14px",display:"grid",gap:6}}>
                {[["Name",grant.contactName],["Email",grant.contactEmail],["Phone",grant.contactPhone]].map(([l,v])=>v?(<div key={l} style={{display:"flex",gap:10,alignItems:"center"}}><span style={{fontSize:10,color:"#3a4a5a",width:40,letterSpacing:1,flexShrink:0,textTransform:"uppercase",fontWeight:600}}>{l}</span><span style={{fontSize:13,color:"#c0b0a0"}}>{v}</span></div>):null)}
                {grant.applicationURL&&<a href={grant.applicationURL} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:11,color:"#c8832a",marginTop:3,textDecoration:"none",letterSpacing:1,border:"1px solid rgba(200,131,42,0.3)",padding:"5px 12px",borderRadius:6,alignSelf:"start"}}>↗ OPEN APPLICATION PORTAL</a>}
              </div>
            </div>
          </>}
          {tab==="sector"&&<>
            {pc&&<div style={{background:pc.bg,border:`1px solid ${pc.b}`,borderRadius:11,padding:"14px 18px"}}>
              <div style={{fontSize:9,color:pc.t,letterSpacing:3,marginBottom:3,fontWeight:700}}>STRATEGIC PILLAR</div>
              <div style={{fontFamily:"Georgia,serif",fontSize:17,color:"#f0e0c0",fontWeight:700}}>{grant.pillar}</div>
            </div>}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              {[["Province",grant.province||"—"],["Partner Type",grant.partnerType||"—"],["Revenue Type",grant.revenueType||"—"]].map(([l,v])=>(
                <div key={l} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:9,padding:"10px 12px"}}>
                  <div style={{fontSize:10,color:"#3a4a5a",letterSpacing:1,marginBottom:2,fontWeight:600}}>{l}</div>
                  <div style={{fontSize:13,color:"#c0b0a0"}}>{v}</div>
                </div>
              ))}
            </div>
            {(grant.sectors||[]).length>0&&<div>
              <div style={{fontSize:10,color:"#4a5a6a",letterSpacing:3,textTransform:"uppercase",marginBottom:7,fontWeight:600}}>SECTORS</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{(grant.sectors||[]).map(s=><SectorChip key={s} sector={s}/>)}</div>
            </div>}
            {(grant.sustainabilityPlan||grant.revenueDiversification||grant.corporateLinkages)&&<div>
              <div style={{fontSize:10,color:"#4a5a6a",letterSpacing:3,textTransform:"uppercase",marginBottom:7,fontWeight:600}}>SUSTAINABILITY & PIPELINE</div>
              <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:9,padding:"12px 14px",display:"grid",gap:9}}>
                {grant.sustainabilityPlan&&<div><div style={{fontSize:10,color:"#3a4a5a",letterSpacing:1,marginBottom:2,fontWeight:600}}>SUSTAINABILITY PLAN</div><p style={{fontSize:12,color:"#8a7a6a",lineHeight:1.8,margin:0}}>{grant.sustainabilityPlan}</p></div>}
                {grant.revenueDiversification&&<div><div style={{fontSize:10,color:"#3a4a5a",letterSpacing:1,marginBottom:2,fontWeight:600}}>REVENUE DIVERSIFICATION</div><p style={{fontSize:12,color:"#8a7a6a",lineHeight:1.8,margin:0}}>{grant.revenueDiversification}</p></div>}
                {grant.corporateLinkages&&<div><div style={{fontSize:10,color:"#3a4a5a",letterSpacing:1,marginBottom:2,fontWeight:600}}>CORPORATE LINKAGES</div><p style={{fontSize:12,color:"#8a7a6a",lineHeight:1.8,margin:0}}>{grant.corporateLinkages}</p></div>}
              </div>
            </div>}
            {grant.reapplicationFlag&&<div style={{background:"rgba(80,100,160,0.08)",border:"1px solid rgba(80,100,160,0.25)",borderRadius:9,padding:"11px 14px"}}>
              <div style={{fontSize:12,color:"#7090c0",fontWeight:600,marginBottom:3}}>🔁 Marked for Reapplication</div>
              {grant.nextFundingWindow&&<div style={{fontSize:12,color:"#8a9ab0"}}>Next window: {fd(grant.nextFundingWindow)}</div>}
            </div>}
          </>}
          {tab==="docs"&&<>
            <div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
                <div style={{fontSize:10,color:"#4a5a6a",letterSpacing:3,textTransform:"uppercase",fontWeight:600}}>DOCUMENT CHECKLIST</div>
                <span style={{fontSize:12,color:"#c8832a"}}>{docsOk}/{grant.documentChecklist.length} ready</span>
              </div>
              <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:9,padding:"12px 14px",display:"grid",gap:8}}>
                {grant.documentChecklist.map((doc,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:9}}>
                    <input type="checkbox" checked={doc.isCompleted} onChange={()=>toggleDoc(i)} style={{width:14,height:14,accentColor:"#c8832a",cursor:"pointer",flexShrink:0}}/>
                    <span style={{fontSize:13,flex:1,color:doc.isCompleted?"#4a6a4a":"#8a7a6a",textDecoration:doc.isCompleted?"line-through":"none"}}>{doc.name}</span>
                  </div>
                ))}
                <div style={{height:3,background:"rgba(255,255,255,0.07)",borderRadius:2,marginTop:3,overflow:"hidden"}}><div style={{width:`${grant.documentChecklist.length>0?(docsOk/grant.documentChecklist.length)*100:0}%`,height:"100%",background:"linear-gradient(90deg,#c8832a,#e8a84a)",transition:"width 0.5s"}}/></div>
              </div>
            </div>
            {grant.complianceItems?.length>0&&<div>
              <div style={{fontSize:10,color:"#4a5a6a",letterSpacing:3,textTransform:"uppercase",marginBottom:7,fontWeight:600}}>COMPLIANCE REPORTING</div>
              {grant.complianceItems.map((c,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:9,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:7,padding:"8px 12px",marginBottom:5}}><input type="checkbox" checked={c.isCompleted} onChange={()=>{const ci=[...grant.complianceItems];ci[i]={...ci[i],isCompleted:!ci[i].isCompleted};onUpdate({...grant,complianceItems:ci});}} style={{width:14,height:14,accentColor:"#c8832a",cursor:"pointer",flexShrink:0}}/><span style={{fontSize:12,flex:1,color:c.isCompleted?"#4a6a4a":"#8a7a6a",textDecoration:c.isCompleted?"line-through":"none"}}>{c.name}</span>{c.dueDate&&<span style={{fontSize:11,color:"#3a4a5a"}}>{fd(c.dueDate)}</span>}</div>))}
            </div>}
          </>}
          {tab==="award"&&<>
            {grant.awardAmount?(
              <div style={{background:"rgba(40,160,80,0.08)",border:"1px solid rgba(40,160,80,0.25)",borderRadius:11,padding:"16px 18px"}}>
                <div style={{fontSize:9,color:"#40a060",letterSpacing:3,marginBottom:5}}>AWARD CONFIRMED</div>
                <div style={{fontFamily:"Georgia,serif",fontSize:28,fontWeight:700,color:"#5dc080",marginBottom:3}}>{grant.awardAmount}</div>
                <div style={{fontSize:13,color:"#4a7a4a"}}>Awarded on {fd(grant.awardDate)}</div>
              </div>
            ):(
              <div style={{background:"rgba(255,255,255,0.03)",border:"1px dashed rgba(255,255,255,0.08)",borderRadius:11,padding:"22px",textAlign:"center"}}>
                <div style={{fontSize:14,color:"#2a3a4a",marginBottom:5}}>No award recorded yet</div>
                <div style={{fontSize:12,color:"#1a2a3a"}}>Edit this grant → Award tab to record funding received</div>
              </div>
            )}
            {grant.kpiTargets?.filter(k=>k.name).length>0&&<div>
              <div style={{fontSize:10,color:"#4a5a6a",letterSpacing:3,textTransform:"uppercase",marginBottom:7,fontWeight:600}}>KPI TARGETS</div>
              {grant.kpiTargets.filter(k=>k.name).map((k,i)=>{const cur=parseFloat(k.current)||0;const tar=parseFloat(k.target)||1;const pct=Math.min((cur/tar)*100,100);return(<div key={i} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:8,padding:"11px 13px",marginBottom:7}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:13,color:"#c0b0a0"}}>{k.name}</span><span style={{fontSize:12,color:"#c8a060"}}>{k.current||"—"} / {k.target}</span></div><div style={{height:4,background:"rgba(255,255,255,0.07)",borderRadius:2,overflow:"hidden"}}><div style={{width:`${k.current?pct:0}%`,height:"100%",background:"linear-gradient(90deg,#c8832a,#e8a84a)",transition:"width 0.5s"}}/></div></div>);})}
            </div>}
          </>}
          {tab==="activity"&&<>
            <div style={{fontSize:10,color:"#4a5a6a",letterSpacing:3,textTransform:"uppercase",marginBottom:10,fontWeight:600}}>ACTIVITY LOG — {grant.activities.length} ENTRIES</div>
            {grant.activities.length===0&&<div style={{fontSize:13,color:"#1a2a3a",fontStyle:"italic",padding:"20px 0",textAlign:"center"}}>No activity yet. Add the first note below.</div>}
            {[...grant.activities].reverse().map((a,i)=>(
              <div key={i} style={{background:a.type==="status"?"rgba(80,100,160,0.07)":"rgba(255,255,255,0.03)",border:`1px solid ${a.type==="status"?"rgba(80,100,160,0.2)":"rgba(255,255,255,0.07)"}`,borderRadius:8,padding:"11px 13px",marginBottom:7}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,gap:7}}>
                  <span style={{fontSize:11,fontWeight:700,color:a.type==="status"?"#7090c0":"#c8832a"}}>{a.author}</span>
                  <span style={{fontSize:10,color:"#2a3a4a"}}>{fts(a.timestamp)}</span>
                </div>
                <p style={{fontSize:12,color:"#9a8a7a",lineHeight:1.8,margin:0}}>{a.content}</p>
              </div>
            ))}
          </>}
        </div>
        <div style={{flexShrink:0,borderTop:"1px solid rgba(200,131,42,0.18)",padding:"12px 24px",background:"rgba(0,0,0,0.4)"}}>
          <div style={{display:"flex",gap:7,marginBottom:7,alignItems:"center"}}>
            <span style={{fontSize:10,color:"#3a4a5a",letterSpacing:2}}>AUTHOR:</span>
            <select value={author} onChange={e=>setAuthor(e.target.value)} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(200,131,42,0.2)",borderRadius:6,padding:"4px 9px",color:"#c0b0a0",fontSize:12,outline:"none",cursor:"pointer",fontFamily:"inherit"}}>
              {team.map(m=><option key={m}>{m}</option>)}
            </select>
          </div>
          <div style={{display:"flex",gap:7}}>
            <textarea value={note} onChange={e=>setNote(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&e.ctrlKey)addNote();}} placeholder="Add a note… (Ctrl+Enter to save)" style={{...I,flex:1,padding:"9px 12px",fontSize:13,resize:"none",height:62}}/>
            <button onClick={addNote} style={{background:"linear-gradient(135deg,#c8832a,#a06020)",border:"none",borderRadius:8,color:"#fff",padding:"0 16px",fontSize:13,cursor:"pointer",fontWeight:700,letterSpacing:1,minWidth:52}}>LOG</button>
          </div>
        </div>
        {edit&&<GrantModal initial={grant} team={team} onSave={g=>{onUpdate(g);setEdit(false);}} onClose={()=>setEdit(false)}/>}
      </div>
    </div>
  );
}

function GrantModal({initial,team,onSave,onClose}){
  const BLANK={id:"",grantName:"",funderName:"",applicationURL:"",description:"",contactName:"",contactEmail:"",contactPhone:"",contactLinkedIn:"",amountRequested:"",totalBudget:"",matchRequirementPercent:"",eligibilityStatus:"Eligible",funderType:"Government",categoryTag:"Labour Rights",pillar:"Labour Justice & Inclusion",sectors:[],partnerType:"",province:"Gauteng",revenueType:"Grant",strategicAlignmentScore:3,loiDeadline:"",fullProposalDeadline:"",internalReviewDeadline:"",followupDate:"",reportingDeadline:"",reapplicationDate:"",assignedLead:"",supportTeam:[],dateAssigned:new Date().toISOString().slice(0,10),projectWeekStart:"",targetWeek:"",status:"Opportunity Identified",submissionConfirmationNumber:"",awardAmount:"",awardDate:"",disbursements:[],budgetActuals:[],complianceItems:DEFAULT_COMPLIANCE.map(d=>({...d})),impactMetrics:{beneficiaries:"",jobsCreated:"",trainingSessions:"",notes:""},kpiTargets:[{name:"",target:"",current:""}],sustainabilityPlan:"",revenueDiversification:"",corporateLinkages:"",reapplicationFlag:false,nextFundingWindow:"",isArchived:false,archiveReason:"",documentChecklist:DEFAULT_DOCS.map(d=>({...d})),documentLinks:[{name:"",url:""}],activities:[]};
  const[form,setForm]=useState(initial?{...BLANK,...initial}:{...BLANK,id:uid()});
  const[tab,setTab]=useState("basic");
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"flex-start",justifyContent:"center",zIndex:60,overflow:"auto",padding:"20px 16px",backdropFilter:"blur(8px)"}} onClick={onClose}>
      <div style={{background:"linear-gradient(160deg,#0a1525,#07101c)",border:"1px solid rgba(200,131,42,0.3)",borderRadius:14,width:"100%",maxWidth:680,boxShadow:"0 40px 100px rgba(0,0,0,0.9)",marginTop:12}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"18px 24px 0",borderBottom:"1px solid rgba(200,131,42,0.15)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
            <div>
              <div style={{fontSize:9,color:"#c8832a",letterSpacing:4,marginBottom:3}}>RGN GRANT MANAGEMENT</div>
              <h2 style={{fontFamily:"Georgia,serif",fontSize:20,color:"#f0e0c0",fontWeight:700,margin:0}}>{initial?.id?"Edit Grant Record":"New Grant Opportunity"}</h2>
            </div>
            <button onClick={onClose} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:7,color:"#5a6a7a",width:34,height:34,cursor:"pointer",fontSize:18,flexShrink:0,lineHeight:1}}>×</button>
          </div>
          <div style={{display:"flex",gap:0,overflowX:"auto"}}>
            {[["basic","Basic"],["sector","Sector"],["financials","Financials"],["deadlines","Deadlines"],["team","Team"],["documents","Docs"]].map(([id,label])=>(
              <button key={id} onClick={()=>setTab(id)} style={{padding:"9px 14px",fontSize:12,cursor:"pointer",background:"transparent",border:"none",borderBottom:tab===id?"2px solid #c8832a":"2px solid transparent",color:tab===id?"#c8832a":"#3a4a5a",whiteSpace:"nowrap"}}>{label}</button>
            ))}
          </div>
        </div>
        <div style={{padding:"18px 24px",maxHeight:"55vh",overflowY:"auto"}}>
          {tab==="basic"&&<div style={{display:"grid",gap:14}}>
            <div style={S_style}>Basic Details</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div style={{gridColumn:"span 2"}}><label style={L}>Grant / Opportunity Name *</label><input style={I} value={form.grantName} onChange={e=>f("grantName",e.target.value)}/></div>
              <div><label style={L}>Funder Name *</label><input style={I} value={form.funderName} onChange={e=>f("funderName",e.target.value)}/></div>
              <div><label style={L}>Funder Type</label><select style={{...I,cursor:"pointer"}} value={form.funderType} onChange={e=>f("funderType",e.target.value)}>{FUNDER_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
              <div style={{gridColumn:"span 2"}}><label style={L}>Application URL</label><input style={I} value={form.applicationURL} onChange={e=>f("applicationURL",e.target.value)} placeholder="https://..."/></div>
              <div><label style={L}>Category Tag</label><select style={{...I,cursor:"pointer"}} value={form.categoryTag} onChange={e=>f("categoryTag",e.target.value)}>{CATEGORY_TAGS.map(t=><option key={t}>{t}</option>)}</select></div>
              <div><label style={L}>Eligibility Status</label><input style={I} value={form.eligibilityStatus} onChange={e=>f("eligibilityStatus",e.target.value)}/></div>
              <div style={{gridColumn:"span 2"}}><label style={L}>Description</label><textarea style={{...I,resize:"vertical",height:80}} value={form.description} onChange={e=>f("description",e.target.value)}/></div>
              {[["Contact Name","contactName"],["Email","contactEmail"],["Phone","contactPhone"]].map(([l,k])=>(
                <div key={k}><label style={L}>{l}</label><input style={I} value={form[k]} onChange={e=>f(k,e.target.value)}/></div>
              ))}
            </div>
          </div>}
          {tab==="sector"&&<div style={{display:"grid",gap:14}}>
            <div style={S_style}>Multi-Sector Classification</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div><label style={L}>Strategic Pillar</label><select style={{...I,cursor:"pointer"}} value={form.pillar} onChange={e=>f("pillar",e.target.value)}><option value="">Select pillar…</option>{PILLARS.map(p=><option key={p}>{p}</option>)}</select></div>
              <div><label style={L}>Province</label><select style={{...I,cursor:"pointer"}} value={form.province} onChange={e=>f("province",e.target.value)}>{PROVINCES.map(p=><option key={p}>{p}</option>)}</select></div>
              <div><label style={L}>Partner Type</label><select style={{...I,cursor:"pointer"}} value={form.partnerType} onChange={e=>f("partnerType",e.target.value)}><option value="">Select…</option>{PARTNER_TYPES.map(p=><option key={p}>{p}</option>)}</select></div>
              <div><label style={L}>Revenue Type</label><select style={{...I,cursor:"pointer"}} value={form.revenueType} onChange={e=>f("revenueType",e.target.value)}>{REVENUE_TYPES.map(r=><option key={r}>{r}</option>)}</select></div>
              <div><label style={L}>Strategic Alignment (1–5)</label><StarRating value={form.strategicAlignmentScore} onChange={v=>f("strategicAlignmentScore",v)} size={22}/></div>
            </div>
            <div><label style={L}>Sectors (multi-select)</label>
              <div style={{display:"flex",flexWrap:"wrap",gap:7,marginTop:4}}>
                {SECTORS.map(s=>{const sel=(form.sectors||[]).includes(s);return(<button key={s} onClick={()=>{const cur=form.sectors||[];f("sectors",sel?cur.filter(x=>x!==s):[...cur,s]);}} style={{padding:"5px 11px",borderRadius:20,fontSize:12,cursor:"pointer",background:sel?"rgba(80,100,160,0.2)":"rgba(255,255,255,0.04)",border:sel?"1px solid rgba(80,100,160,0.5)":"1px solid rgba(255,255,255,0.08)",color:sel?"#8ab0e0":"#4a5a6a"}}>{s}</button>);})}
              </div>
            </div>
            <div><label style={L}>Sustainability Plan</label><textarea style={{...I,resize:"vertical",height:64}} value={form.sustainabilityPlan} onChange={e=>f("sustainabilityPlan",e.target.value)}/></div>
            <div><label style={L}>Revenue Diversification Strategy</label><input style={I} value={form.revenueDiversification} onChange={e=>f("revenueDiversification",e.target.value)}/></div>
          </div>}
          {tab==="financials"&&<div style={{display:"grid",gap:14}}>
            <div style={S_style}>Requested Funding</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
              {[["Amount Requested","amountRequested"],["Total Project Budget","totalBudget"],["Match Req. (%)","matchRequirementPercent"]].map(([l,k])=>(<div key={k}><label style={L}>{l}</label><input style={I} value={form[k]} onChange={e=>f(k,e.target.value)}/></div>))}
            </div>
            <div style={S_style}>Impact Metrics</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
              {[["Beneficiaries","beneficiaries"],["Jobs Created","jobsCreated"],["Training Sessions","trainingSessions"]].map(([l,k])=>(<div key={k}><label style={L}>{l}</label><input style={I} value={form.impactMetrics[k]} onChange={e=>f("impactMetrics",{...form.impactMetrics,[k]:e.target.value})}/></div>))}
            </div>
          </div>}
          {tab==="deadlines"&&<div style={{display:"grid",gap:12}}>
            <div style={S_style}>Key Deadlines</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {[["LOI Deadline","loiDeadline"],["Full Proposal Deadline","fullProposalDeadline"],["Internal Review Deadline","internalReviewDeadline"],["Follow-Up Date","followupDate"],["Reporting Deadline","reportingDeadline"],["Reapplication Date","reapplicationDate"]].map(([l,k])=>{const dy=daysUntil(form[k]);const u=urgCls(dy);return(
                <div key={k}><label style={L}>{l}</label>
                  <input style={{...I,borderColor:dy!==null&&dy<=7?"rgba(200,60,40,0.5)":dy!==null&&dy<=21?"rgba(200,131,42,0.5)":"rgba(200,131,42,0.22)"}} type="date" value={form[k]} onChange={e=>f(k,e.target.value)}/>
                  {form[k]&&<span style={{fontSize:11,color:US[u].t,fontWeight:600,display:"block",marginTop:4}}>{dy<=0?"OVERDUE":`${dy} days remaining`}</span>}
                </div>
              );})}
            </div>
          </div>}
          {tab==="team"&&<div style={{display:"grid",gap:12}}>
            <div style={S_style}>Assignment & Planning</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div><label style={L}>Assigned Lead</label><select style={{...I,cursor:"pointer"}} value={form.assignedLead} onChange={e=>f("assignedLead",e.target.value)}><option value="">Unassigned</option>{team.map(m=><option key={m}>{m}</option>)}</select></div>
              <div><label style={L}>Date Assigned</label><input type="date" style={I} value={form.dateAssigned} onChange={e=>f("dateAssigned",e.target.value)}/></div>
              <div><label style={L}>Focus Week (Start Date)</label><input type="date" style={I} value={form.projectWeekStart} onChange={e=>f("projectWeekStart",e.target.value)}/></div>
              <div><label style={L}>Target Timeframe / Sprint</label><input style={I} value={form.targetWeek} onChange={e=>f("targetWeek",e.target.value)} placeholder="e.g. Week 3 — 10 Mar"/></div>
              <div><label style={L}>Pipeline Stage</label><select style={{...I,cursor:"pointer"}} value={form.status} onChange={e=>f("status",e.target.value)}>{STAGES.map(s=><option key={s}>{s}</option>)}</select>
                {form.status&&<div style={{marginTop:6,background:"rgba(200,131,42,0.05)",border:"1px solid rgba(200,131,42,0.15)",borderRadius:7,padding:"8px 12px",fontSize:12,color:"#9a8a6a",lineHeight:1.7}}>{STAGE_GUIDE[form.status]?.icon} {STAGE_GUIDE[form.status]?.tip}</div>}
              </div>
              <div><label style={L}>Submission Confirmation #</label><input style={I} value={form.submissionConfirmationNumber} onChange={e=>f("submissionConfirmationNumber",e.target.value)}/></div>
            </div>
            <div><label style={L}>Support Team Members</label>
              <div style={{display:"flex",flexWrap:"wrap",gap:7,marginTop:4}}>
                {team.filter(m=>m!==form.assignedLead).map(m=>{const inT=(form.supportTeam||[]).includes(m);return(<button key={m} onClick={()=>{const st=form.supportTeam||[];f("supportTeam",inT?st.filter(x=>x!==m):[...st,m]);}} style={{padding:"6px 13px",borderRadius:20,fontSize:13,cursor:"pointer",background:inT?"rgba(200,131,42,0.18)":"rgba(255,255,255,0.05)",border:inT?"1px solid rgba(200,131,42,0.45)":"1px solid rgba(255,255,255,0.1)",color:inT?"#c8832a":"#3a4a5a"}}>{m}</button>);})}
              </div>
            </div>
          </div>}
          {tab==="documents"&&<div style={{display:"grid",gap:12}}>
            <div style={S_style}>Document Checklist</div>
            {form.documentChecklist.map((doc,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:9,background:"rgba(255,255,255,0.03)",borderRadius:7,padding:"8px 11px",border:"1px solid rgba(255,255,255,0.06)"}}>
                <input type="checkbox" checked={doc.isCompleted} onChange={()=>{const dl=[...form.documentChecklist];dl[i]={...dl[i],isCompleted:!dl[i].isCompleted};f("documentChecklist",dl);}} style={{width:14,height:14,accentColor:"#c8832a",cursor:"pointer",flexShrink:0}}/>
                <input style={{...I,flex:1,padding:"6px 9px",fontSize:13}} value={doc.name} onChange={e=>{const dl=[...form.documentChecklist];dl[i]={...dl[i],name:e.target.value};f("documentChecklist",dl);}}/>
              </div>
            ))}
            <button onClick={()=>f("documentChecklist",[...form.documentChecklist,{name:"New Document",isCompleted:false,link:""}])} style={{background:"transparent",border:"1px dashed rgba(200,131,42,0.3)",borderRadius:7,color:"#c8832a",padding:"8px 14px",fontSize:12,cursor:"pointer",letterSpacing:1}}>+ ADD DOCUMENT</button>
          </div>}
        </div>
        <div style={{borderTop:"1px solid rgba(200,131,42,0.2)",padding:"14px 24px",display:"flex",justifyContent:"flex-end",gap:10,background:"rgba(0,0,0,0.3)"}}>
          <button onClick={onClose} style={{background:"transparent",border:"1px solid rgba(255,255,255,0.1)",borderRadius:9,color:"#5a6a7a",padding:"9px 22px",fontSize:13,cursor:"pointer"}}>Cancel</button>
          <button onClick={()=>{onSave(form);onClose();}} style={{background:"linear-gradient(135deg,#c8832a,#a06020)",border:"none",borderRadius:9,color:"#fff",padding:"9px 28px",fontSize:13,fontWeight:700,cursor:"pointer",letterSpacing:2,boxShadow:"0 8px 24px rgba(200,131,42,0.4)"}}>
            {initial?.id?"SAVE CHANGES":"ADD TO PIPELINE"}
          </button>
        </div>
      </div>
    </div>
  );
}

function GrantsTable({grants,onSelect}){
  return(
    <div style={{overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr style={{borderBottom:"1px solid rgba(200,131,42,0.2)"}}>
          {["Grant / Funder","Pillar","Stage","Lead","Requested","Alignment","Deadline","Days","Docs"].map(h=>(<th key={h} style={{textAlign:"left",fontSize:10,color:"#3a5a3a",fontWeight:700,letterSpacing:2,textTransform:"uppercase",padding:"9px 12px"}}>{h}</th>))}
        </tr></thead>
        <tbody>{grants.map(g=>{
          const d=g.fullProposalDeadline||g.loiDeadline||g.internalReviewDeadline||g.followupDate;
          const dy=d?daysUntil(d):null;const u=urgCls(dy);const sc=STAGE_COLORS[g.status]||STAGE_COLORS["Opportunity Identified"];
          const docsOk=g.documentChecklist.filter(x=>x.isCompleted).length;const pc=PILLAR_COLORS[g.pillar];
          return(<tr key={g.id} onClick={()=>onSelect(g)} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",cursor:"pointer"}}>
            <td style={{padding:"11px 12px"}}><div style={{fontFamily:"Georgia,serif",fontSize:14,color:"#e0d0b0",fontWeight:600,marginBottom:2}}>{g.grantName}</div><div style={{fontSize:12,color:"#3a4a5a"}}>{g.funderName}</div></td>
            <td style={{padding:"11px 12px"}}>{pc&&<span style={{fontSize:10,padding:"2px 7px",borderRadius:9,background:pc.bg,color:pc.t,border:`1px solid ${pc.b}`,display:"inline-block",fontWeight:600}}>{(g.pillar||"").split("&")[0].trim().substring(0,14)}</span>}</td>
            <td style={{padding:"11px 12px"}}><span style={{fontSize:11,padding:"3px 9px",borderRadius:9,background:sc.bg,color:sc.text,border:`1px solid ${sc.border}`,whiteSpace:"nowrap"}}>{g.status}</span></td>
            <td style={{padding:"11px 12px",fontSize:13,color:"#7a8a9a"}}>{g.assignedLead||"—"}</td>
            <td style={{padding:"11px 12px",fontFamily:"Georgia,serif",fontSize:13,color:"#c8a060"}}>{g.amountRequested||"—"}</td>
            <td style={{padding:"11px 12px"}}><StarRating value={g.strategicAlignmentScore||0} size={12}/></td>
            <td style={{padding:"11px 12px",fontSize:12,color:"#4a5a4a"}}>{d?fd(d):"—"}</td>
            <td style={{padding:"11px 12px"}}>{dy!==null?<span style={{fontSize:12,fontWeight:700,padding:"2px 8px",borderRadius:6,background:US[u].bg,color:US[u].t,border:`1px solid ${US[u].b}`,whiteSpace:"nowrap"}}>{dy<=0?"OVERDUE":`${dy}d`}</span>:<span style={{color:"#141e28"}}>—</span>}</td>
            <td style={{padding:"11px 12px"}}><div style={{fontSize:12,color:"#2a4a2a",marginBottom:2}}>{docsOk}/{g.documentChecklist.length}</div><div style={{width:36,height:3,background:"rgba(255,255,255,0.07)",borderRadius:2,overflow:"hidden"}}><div style={{width:`${g.documentChecklist.length>0?(docsOk/g.documentChecklist.length)*100:0}%`,height:"100%",background:"#c8832a"}}/></div></td>
          </tr>);
        })}</tbody>
      </table>
      {grants.length===0&&<div style={{textAlign:"center",padding:50,color:"#1a2a3a",fontSize:14}}>No grants match your filters.</div>}
    </div>
  );
}

function ExecutiveDashboard({grants,onSelect}){
  const total=grants.reduce((s,g)=>s+(parseFloat((g.amountRequested||"").replace(/[^0-9.]/g,""))||0),0);
  const awarded=grants.filter(g=>["Awarded","Implementation","Reporting","Completed"].includes(g.status));
  const totalAwarded=grants.reduce((s,g)=>s+(parseFloat((g.awardAmount||"").replace(/[^0-9.]/g,""))||0),0);
  const submitted=grants.filter(g=>["Submitted","Under Review","Awarded","Implementation","Reporting","Completed"].includes(g.status)).length;
  const successRate=submitted>0?Math.round((awarded.length/submitted)*100):0;
  const upcoming=grants.map(g=>{const d=g.fullProposalDeadline||g.loiDeadline||g.internalReviewDeadline;return{...g,_d:d,_days:d?daysUntil(d):null};}).filter(g=>g._days!==null&&g._days>=0&&g._days<=30).sort((a,b)=>a._days-b._days).slice(0,5);
  const bySector={};grants.forEach(g=>(g.sectors||[]).forEach(s=>{bySector[s]=(bySector[s]||0)+1;}));
  const sectorList=Object.entries(bySector).sort(([,a],[,b])=>b-a).slice(0,7);const maxSec=sectorList[0]?.[1]||1;
  const byPillar={};grants.forEach(g=>{if(g.pillar)byPillar[g.pillar]=(byPillar[g.pillar]||0)+1;});
  const active=grants.filter(g=>!["Archived","Declined","Closed Before Applying"].includes(g.status));
  const C={background:"linear-gradient(160deg,#0d1825,#0a1220)",border:"1px solid rgba(200,131,42,0.16)",borderRadius:13,padding:"18px 20px",boxShadow:"0 8px 32px rgba(0,0,0,0.4)"};
  return(
    <div style={{display:"grid",gap:16,maxWidth:1180}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:9,color:"#c8832a",letterSpacing:4,marginBottom:3}}>RGN GRANT MANAGEMENT</div>
          <h2 style={{fontFamily:"Georgia,serif",fontSize:26,color:"#f0e0c0",fontWeight:700,margin:0}}>Executive Overview</h2>
        </div>
        <div style={{fontSize:11,color:"#3a4a5a"}}>{new Date().toLocaleDateString("en-ZA",{day:"numeric",month:"long",year:"numeric"})}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:10}}>
        {[{l:"Active Grants",v:active.length,c:"#e0d0b0",sub:"in pipeline"},{l:"Pipeline Value",v:`R${(total/1e6).toFixed(1)}M`,c:"#c8a060",sub:"total requested"},{l:"Total Awarded",v:totalAwarded>0?`R${(totalAwarded/1e6).toFixed(2)}M`:"R0",c:"#5dc080",sub:"approved"},{l:"Funds Received",v:"R0.000",c:"#60c0a0",sub:"disbursed"},{l:"Submitted",v:submitted,c:"#70a0e0",sub:"applications"},{l:"Success Rate",v:successRate+"%",c:successRate>50?"#60c880":successRate>25?"#e8a84a":"#ff9070",sub:"award conversion"}].map(s=>(
          <div key={s.l} style={{...C,padding:"14px 16px",textAlign:"center"}}>
            <div style={{fontSize:9,color:"#3a4a3a",letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>{s.l}</div>
            <div style={{fontFamily:"Georgia,serif",fontSize:26,fontWeight:700,color:s.c,lineHeight:1,marginBottom:3}}>{s.v}</div>
            <div style={{fontSize:9,color:"#2a3a2a"}}>{s.sub}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
        <div style={C}>
          <div style={{fontFamily:"Georgia,serif",fontSize:14,color:"#e0d0b0",fontWeight:700,marginBottom:14}}>⏰ Upcoming Deadlines</div>
          {upcoming.length===0&&<div style={{fontSize:13,color:"#1a2a3a",fontStyle:"italic"}}>No deadlines in next 30 days.</div>}
          {upcoming.map(g=>{const u=urgCls(g._days);return(
            <div key={g.id} onClick={()=>onSelect(g)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 10px",background:US[u].bg,border:`1px solid ${US[u].b}`,borderRadius:8,marginBottom:7,cursor:"pointer"}}>
              <div><div style={{fontSize:12,color:"#c0b0a0",fontFamily:"Georgia,serif"}}>{g.funderName}</div><div style={{fontSize:10,color:"#3a4a5a",marginTop:1}}>{fd(g._d)}</div></div>
              <span style={{fontSize:13,fontWeight:700,color:US[u].t}}>{g._days}d</span>
            </div>
          );})}
        </div>
        <div style={C}>
          <div style={{fontFamily:"Georgia,serif",fontSize:14,color:"#e0d0b0",fontWeight:700,marginBottom:14}}>🏭 Sector Breakdown</div>
          {sectorList.map(([s,n])=>(
            <div key={s} style={{marginBottom:9}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:11,color:"#7a8a9a"}}>{s}</span><span style={{fontSize:11,color:"#7090c0",fontWeight:600}}>{n}</span></div>
              <div style={{height:3,background:"rgba(255,255,255,0.05)",borderRadius:2,overflow:"hidden"}}><div style={{width:`${(n/maxSec)*100}%`,height:"100%",background:"linear-gradient(90deg,#3a5090,#7090d0)"}}/></div>
            </div>
          ))}
          {sectorList.length===0&&<div style={{fontSize:12,color:"#1a2a3a",fontStyle:"italic"}}>Assign sectors to see breakdown.</div>}
        </div>
        <div style={C}>
          <div style={{fontFamily:"Georgia,serif",fontSize:14,color:"#e0d0b0",fontWeight:700,marginBottom:14}}>🎯 By Strategic Pillar</div>
          {PILLARS.map(p=>{const n=byPillar[p]||0;const pc=PILLAR_COLORS[p];if(!pc)return null;return(
            <div key={p} style={{marginBottom:11}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:11,color:pc.t}}>{p.split("&")[0].trim()}</span><span style={{fontSize:13,color:pc.t,fontWeight:700}}>{n}</span></div>
              <div style={{height:4,background:"rgba(255,255,255,0.05)",borderRadius:2,overflow:"hidden"}}><div style={{width:`${grants.length>0?(n/grants.length)*100:0}%`,height:"100%",background:pc.dot}}/></div>
            </div>
          );})}
        </div>
      </div>
      <div style={C}>
        <div style={{fontFamily:"Georgia,serif",fontSize:14,color:"#e0d0b0",fontWeight:700,marginBottom:14}}>📊 Full Pipeline Status</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(10,1fr)",gap:8}}>
          {STAGES_ACTIVE.map(s=>{const n=grants.filter(g=>g.status===s).length;const sc=STAGE_COLORS[s];const guide=STAGE_GUIDE[s];return(
            <div key={s} style={{textAlign:"center"}}>
              <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,color:sc.text,marginBottom:3}}>{n}</div>
              <div style={{height:28,background:sc.bg,border:`1px solid ${sc.border}`,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:5}}><span style={{fontSize:14}}>{guide?.icon}</span></div>
              <div style={{fontSize:9,color:sc.text,lineHeight:1.3,textAlign:"center",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s}</div>
            </div>
          );})}
        </div>
      </div>
    </div>
  );
}

function SectorView({grants,onSelect}){
  const[filterPillar,setFilterPillar]=useState("All");
  const[filterSector,setFilterSector]=useState("All");
  const[filterProvince,setFilterProvince]=useState("All");
  const[minScore,setMinScore]=useState(0);
  const filtered=grants.filter(g=>{
    if(filterPillar!=="All"&&g.pillar!==filterPillar)return false;
    if(filterSector!=="All"&&!(g.sectors||[]).includes(filterSector))return false;
    if(filterProvince!=="All"&&g.province!==filterProvince)return false;
    if(minScore>0&&(g.strategicAlignmentScore||0)<minScore)return false;
    return true;
  });
  const sel2={...I,padding:"7px 12px",fontSize:12,width:"auto",cursor:"pointer"};
  return(
    <div style={{display:"grid",gap:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
        <div>
          <div style={{fontSize:9,color:"#c8832a",letterSpacing:4,marginBottom:2}}>MULTI-SECTOR</div>
          <h2 style={{fontFamily:"Georgia,serif",fontSize:22,color:"#f0e0c0",fontWeight:700,margin:0}}>Sector Filter View</h2>
        </div>
        <span style={{fontSize:12,color:"#c8832a"}}>{filtered.length} of {grants.length} grants shown</span>
      </div>
      <div style={{background:"rgba(0,0,0,0.3)",border:"1px solid rgba(200,131,42,0.14)",borderRadius:11,padding:"12px 16px",display:"flex",flexWrap:"wrap",gap:9,alignItems:"center"}}>
        <select style={sel2} value={filterPillar} onChange={e=>setFilterPillar(e.target.value)}><option value="All">All Pillars</option>{PILLARS.map(p=><option key={p}>{p}</option>)}</select>
        <select style={sel2} value={filterSector} onChange={e=>setFilterSector(e.target.value)}><option value="All">All Sectors</option>{SECTORS.map(s=><option key={s}>{s}</option>)}</select>
        <select style={sel2} value={filterProvince} onChange={e=>setFilterProvince(e.target.value)}><option value="All">All Provinces</option>{PROVINCES.map(p=><option key={p}>{p}</option>)}</select>
        <div style={{display:"flex",alignItems:"center",gap:7}}>
          <span style={{fontSize:10,color:"#4a5a6a",letterSpacing:2}}>MIN ★:</span>
          {[0,1,2,3,4,5].map(n=><button key={n} onClick={()=>setMinScore(n)} style={{fontSize:12,padding:"3px 7px",borderRadius:5,cursor:"pointer",background:minScore===n?"rgba(200,131,42,0.2)":"rgba(255,255,255,0.04)",border:minScore===n?"1px solid rgba(200,131,42,0.4)":"1px solid rgba(255,255,255,0.08)",color:minScore===n?"#c8832a":"#3a4a5a"}}>{n===0?"Any":n+"★"}</button>)}
        </div>
        <button onClick={()=>{setFilterPillar("All");setFilterSector("All");setFilterProvince("All");setMinScore(0);}} style={{marginLeft:"auto",fontSize:11,color:"#5a4a3a",background:"transparent",border:"none",cursor:"pointer",letterSpacing:1}}>CLEAR</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
        {filtered.map(g=>{
          const pc=PILLAR_COLORS[g.pillar];const sc=STAGE_COLORS[g.status]||STAGE_COLORS["Opportunity Identified"];
          const d=g.fullProposalDeadline||g.loiDeadline;const dy=d?daysUntil(d):null;const u=urgCls(dy);
          const [hov,setHov]=useState(false);
          return(
            <div key={g.id} onClick={()=>onSelect(g)} onMouseOver={()=>setHov(true)} onMouseOut={()=>setHov(false)} style={{background:"linear-gradient(145deg,#0d1825,#080e18)",border:`1px solid ${hov?"#c8832a":"rgba(200,131,42,0.14)"}`,borderRadius:11,padding:"15px 16px",cursor:"pointer",transition:"all 0.2s",boxShadow:"0 4px 20px rgba(0,0,0,0.4)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:9}}>
                <div><div style={{fontSize:11,color:"#4a5a6a",marginBottom:2}}>{g.funderName}</div><div style={{fontFamily:"Georgia,serif",fontSize:14,color:"#e0d0b0",fontWeight:700,lineHeight:1.3}}>{g.grantName}</div></div>
                <StarRating value={g.strategicAlignmentScore||0} size={12}/>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:9}}>
                {pc&&<span style={{fontSize:11,padding:"2px 8px",borderRadius:10,background:pc.bg,color:pc.t,border:`1px solid ${pc.b}`,fontWeight:600}}>{(g.pillar||"").split("&")[0].trim().substring(0,18)}</span>}
                {(g.sectors||[]).slice(0,2).map(s=><SectorChip key={s} sector={s}/>)}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:9}}>
                <div><div style={{fontSize:9,color:"#2a3a4a",letterSpacing:1}}>REQUESTED</div><div style={{fontFamily:"Georgia,serif",fontSize:13,color:"#c8a060",fontWeight:600}}>{g.amountRequested||"TBD"}</div></div>
                <div><div style={{fontSize:9,color:"#2a3a4a",letterSpacing:1}}>PROVINCE</div><div style={{fontSize:12,color:"#7a8a9a"}}>{g.province||"—"}</div></div>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:11,padding:"2px 8px",borderRadius:8,background:sc.bg,color:sc.text,border:`1px solid ${sc.border}`}}>{g.status}</span>
                {d&&<span style={{fontSize:11,fontWeight:700,color:US[u].t}}>{dy<=0?"OVERDUE":`${dy}d`}</span>}
              </div>
            </div>
          );
        })}
        {filtered.length===0&&<div style={{gridColumn:"span 3",textAlign:"center",padding:60,color:"#1a2a3a",fontSize:14}}>No grants match these filters.</div>}
      </div>
    </div>
  );
}

function FinancialDashboard({grants}){
  const total=grants.reduce((s,g)=>s+(parseFloat((g.amountRequested||"").replace(/[^0-9.]/g,""))||0),0);
  const totalAwarded=grants.reduce((s,g)=>s+(parseFloat((g.awardAmount||"").replace(/[^0-9.]/g,""))||0),0);
  const C={background:"linear-gradient(160deg,#0d1825,#0a1220)",border:"1px solid rgba(200,131,42,0.16)",borderRadius:13,padding:"18px 20px",boxShadow:"0 8px 32px rgba(0,0,0,0.4)"};
  return(
    <div style={{display:"grid",gap:16,maxWidth:1080}}>
      <div>
        <div style={{fontSize:9,color:"#c8832a",letterSpacing:4,marginBottom:3}}>RGN FINANCIAL OVERSIGHT</div>
        <h2 style={{fontFamily:"Georgia,serif",fontSize:26,color:"#f0e0c0",fontWeight:700,margin:0}}>Financial Dashboard</h2>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
        {[{l:"Total Requested",v:`R${(total/1e6).toFixed(2)}M`,c:"#c8a060",sub:"across all grants"},{l:"Total Approved",v:totalAwarded>0?`R${(totalAwarded/1e6).toFixed(2)}M`:"R0.00",c:"#5dc080",sub:"awarded amounts"},{l:"Funds Received",v:"R0.000",c:"#60c0a0",sub:"disbursed to date"},{l:"Funds Outstanding",v:"R0.000",c:"#3a5a3a",sub:"pending disbursement"}].map(s=>(
          <div key={s.l} style={{...C,padding:"16px 18px",textAlign:"center"}}>
            <div style={{fontSize:9,color:"#3a4a3a",letterSpacing:2,textTransform:"uppercase",marginBottom:7}}>{s.l}</div>
            <div style={{fontFamily:"Georgia,serif",fontSize:28,fontWeight:700,color:s.c,lineHeight:1,marginBottom:3}}>{s.v}</div>
            <div style={{fontSize:10,color:"#2a3a2a"}}>{s.sub}</div>
          </div>
        ))}
      </div>
      <div style={C}>
        <div style={{fontFamily:"Georgia,serif",fontSize:14,color:"#e0d0b0",fontWeight:700,marginBottom:14}}>💰 Grant Financial Summary</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:8}}>
          {["Grant","Stage","Requested","Award Status"].map(h=><div key={h} style={{fontSize:9,color:"#2a3a4a",letterSpacing:1,fontWeight:700,textTransform:"uppercase"}}>{h}</div>)}
        </div>
        {grants.map(g=>{const sc=STAGE_COLORS[g.status]||STAGE_COLORS["Opportunity Identified"];return(
          <div key={g.id} style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,padding:"9px 12px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,marginBottom:6,alignItems:"center"}}>
            <div><div style={{fontSize:13,fontFamily:"Georgia,serif",color:"#c0b0a0"}}>{g.grantName}</div><div style={{fontSize:11,color:"#3a4a5a"}}>{g.funderName}</div></div>
            <span style={{fontSize:11,padding:"2px 8px",borderRadius:7,background:sc.bg,color:sc.text,border:`1px solid ${sc.border}`,display:"inline-block"}}>{g.status}</span>
            <div style={{fontFamily:"Georgia,serif",fontSize:13,color:"#c8a060"}}>{g.amountRequested||"—"}</div>
            <div>{g.awardAmount?<span style={{fontSize:12,color:"#5dc080",fontFamily:"Georgia,serif",fontWeight:600}}>{g.awardAmount} ✓</span>:<span style={{fontSize:11,color:"#3a4a5a"}}>Pending</span>}</div>
          </div>
        );})}
      </div>
      <div style={C}>
        <div style={{fontFamily:"Georgia,serif",fontSize:14,color:"#e0d0b0",fontWeight:700,marginBottom:6}}>ℹ️ Getting Started with Financial Tracking</div>
        <p style={{fontSize:13,color:"#6a7a5a",lineHeight:1.8,margin:0}}>Once grants are awarded, click into each grant → Edit → Award tab to log actual award amounts, disbursement tranches, and budget vs actuals. The Financial Dashboard will populate automatically with received vs outstanding funds, burn rate, and variance analysis.</p>
      </div>
    </div>
  );
}

function Reports({grants}){
  const byStage=STAGES.map(s=>({stage:s,count:grants.filter(g=>g.status===s).length})).filter(s=>s.count>0);
  const upcoming=grants.map(g=>{const d=g.fullProposalDeadline||g.loiDeadline||g.internalReviewDeadline||g.followupDate;return{...g,_d:d,_days:d?daysUntil(d):null};}).filter(g=>g._days!==null&&g._days>=0).sort((a,b)=>a._days-b._days).slice(0,8);
  const total=grants.reduce((s,g)=>s+(parseFloat((g.amountRequested||"").replace(/[^0-9.]/g,""))||0),0);
  const totalAwarded=grants.reduce((s,g)=>s+(parseFloat((g.awardAmount||"").replace(/[^0-9.]/g,""))||0),0);
  const C={background:"linear-gradient(160deg,#0d1825,#0a1220)",border:"1px solid rgba(200,131,42,0.16)",borderRadius:13,padding:"18px 20px",boxShadow:"0 6px 28px rgba(0,0,0,0.4)"};
  return(
    <div style={{display:"grid",gap:16,maxWidth:960}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
        {[{l:"Total Opportunities",v:grants.length,c:"#e0d0b0"},{l:"Awarded",v:grants.filter(g=>["Awarded","Implementation","Reporting","Completed"].includes(g.status)).length,c:"#60c880"},{l:"Pipeline Value",v:`R${(total/1e6).toFixed(1)}M`,c:"#c8a060"},{l:"Total Awarded",v:totalAwarded>0?`R${(totalAwarded/1e6).toFixed(1)}M`:"—",c:"#5dc080"},{l:"Declined",v:grants.filter(g=>g.status==="Declined").length,c:"#907090"},{l:"Archived",v:grants.filter(g=>g.status==="Archived"||g.isArchived).length,c:"#505050"},{l:"Reapplication Eligible",v:grants.filter(g=>g.reapplicationFlag||g.status==="Reapplication Eligible").length,c:"#7090c0"},{l:"Avg Alignment",v:grants.length>0?(grants.reduce((s,g)=>s+(g.strategicAlignmentScore||0),0)/grants.length).toFixed(1)+"★":"—",c:"#c8832a"}].map(s=>(<div key={s.l} style={C}><div style={{fontSize:9,color:"#2a3a2a",letterSpacing:2,textTransform:"uppercase",marginBottom:7}}>{s.l}</div><div style={{fontFamily:"Georgia,serif",fontSize:24,fontWeight:700,color:s.c,lineHeight:1}}>{s.v}</div></div>))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div style={C}><div style={{fontFamily:"Georgia,serif",fontSize:14,color:"#e0d0b0",fontWeight:700,marginBottom:14}}>Pipeline by Stage</div>{byStage.map(s=>{const sc=STAGE_COLORS[s.stage];const pct=grants.length>0?(s.count/grants.length)*100:0;return(<div key={s.stage} style={{marginBottom:9}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:12,color:"#6a7a8a"}}>{STAGE_GUIDE[s.stage]?.icon} {s.stage}</span><span style={{fontSize:12,color:sc.dot,fontWeight:600}}>{s.count}</span></div><div style={{height:4,background:"rgba(255,255,255,0.05)",borderRadius:2,overflow:"hidden"}}><div style={{width:`${pct}%`,height:"100%",background:`linear-gradient(90deg,${sc.dot},${sc.text})`,borderRadius:2}}/></div></div>);})}</div>
        <div style={C}><div style={{fontFamily:"Georgia,serif",fontSize:14,color:"#e0d0b0",fontWeight:700,marginBottom:14}}>Upcoming Deadlines</div>{upcoming.length===0&&<div style={{fontSize:13,color:"#1a2a3a",fontStyle:"italic"}}>No upcoming deadlines.</div>}{upcoming.map(g=>{const u=urgCls(g._days);return(<div key={g.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:9,marginBottom:9,borderBottom:"1px solid rgba(255,255,255,0.04)"}}><div><div style={{fontSize:13,color:"#c0b0a0",fontFamily:"Georgia,serif"}}>{g.funderName}</div><div style={{fontSize:11,color:"#2a3a4a"}}>{fd(g._d)}</div></div><span style={{fontSize:12,fontWeight:700,color:US[u].t}}>{g._days}d</span></div>);})}</div>
      </div>
      <div style={C}><div style={{fontFamily:"Georgia,serif",fontSize:14,color:"#e0d0b0",fontWeight:700,marginBottom:14}}>Universal Proposal Messaging — RGN Pillars</div><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>{[{i:"⚖️",t:"Constitutional Framing",d:"Frame as closing a constitutional access-to-justice gap — not charity."},{i:"📊",t:"Lead with Data",d:"161K annual CCMA referrals · 35% abandoned · 60% unorganised workers."},{i:"🏙️",t:"Township Credibility",d:"15 years in Soweto & Thembisa — rare, bankable track record."},{i:"💼",t:"Economic ROI",d:"Every R1M = 60 workers represented + 1,000 educated."},{i:"🎓",t:"Youth Development",d:"20 candidate attorneys/year, 40% permanent = 8 new legal jobs."},{i:"🔄",t:"Sustainability",d:"After Year 3, self-sustaining via Section 18A + SETA partnerships."}].map(m=>(<div key={m.t} style={{background:"rgba(200,131,42,0.05)",border:"1px solid rgba(200,131,42,0.12)",borderRadius:9,padding:"12px"}}><div style={{fontSize:18,marginBottom:6}}>{m.i}</div><div style={{fontSize:12,fontWeight:700,color:"#c8a060",marginBottom:4}}>{m.t}</div><div style={{fontSize:12,color:"#5a6a5a",lineHeight:1.75}}>{m.d}</div></div>))}</div></div>
    </div>
  );
}

function TeamModal({team,onSave,onClose}){
  const[members,setMembers]=useState([...team]);const[nm,setNm]=useState("");
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:70,backdropFilter:"blur(8px)"}} onClick={onClose}>
      <div style={{background:"linear-gradient(160deg,#0a1525,#07101c)",border:"1px solid rgba(200,131,42,0.3)",borderRadius:14,width:"100%",maxWidth:400,padding:24,boxShadow:"0 40px 100px rgba(0,0,0,0.9)"}} onClick={e=>e.stopPropagation()}>
        <div style={{fontFamily:"Georgia,serif",fontSize:18,color:"#e0d0b0",fontWeight:700,marginBottom:16}}>Manage Team</div>
        <div style={{display:"grid",gap:7,marginBottom:14}}>
          {members.map((m,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:7,padding:"8px 13px"}}><span style={{fontSize:13,color:"#c0b0a0"}}>{m}</span><button onClick={()=>setMembers(p=>p.filter((_,j)=>j!==i))} style={{background:"transparent",border:"none",color:"#6a2a2a",cursor:"pointer",fontSize:15,padding:"0 3px"}}>×</button></div>))}
        </div>
        <div style={{display:"flex",gap:7,marginBottom:16}}>
          <input style={{...I,flex:1}} placeholder="Add team member" value={nm} onChange={e=>setNm(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&nm.trim()){setMembers(p=>[...p,nm.trim()]);setNm("");}}}/>
          <button onClick={()=>{if(nm.trim()){setMembers(p=>[...p,nm.trim()]);setNm("");}}} style={{background:"rgba(200,131,42,0.15)",border:"1px solid rgba(200,131,42,0.3)",borderRadius:7,color:"#c8832a",padding:"9px 14px",cursor:"pointer",fontSize:13,fontWeight:700}}>Add</button>
        </div>
        <div style={{display:"flex",justifyContent:"flex-end",gap:9}}>
          <button onClick={onClose} style={{background:"transparent",border:"1px solid rgba(255,255,255,0.1)",borderRadius:7,color:"#5a6a7a",padding:"8px 18px",fontSize:13,cursor:"pointer"}}>Cancel</button>
          <button onClick={()=>{onSave(members);onClose();}} style={{background:"linear-gradient(135deg,#c8832a,#a06020)",border:"none",borderRadius:7,color:"#fff",padding:"8px 22px",fontSize:13,fontWeight:700,cursor:"pointer",letterSpacing:2}}>SAVE</button>
        </div>
      </div>
    </div>
  );
}

export default function App(){
  const[grants,setGrants]=useState(SEED_GRANTS);
  const[team,setTeam]=useState(DEFAULT_TEAM);
  const[view,setView]=useState("executive");
  const[selected,setSelected]=useState(null);
  const[showAdd,setShowAdd]=useState(false);
  const[showTeam,setShowTeam]=useState(false);
  const[filterLead,setFilterLead]=useState("All");
  const[filterStatus,setFilterStatus]=useState("All");
  const[showArchived,setShowArchived]=useState(false);
  const[search,setSearch]=useState("");

  function upsertGrant(g){setGrants(gs=>{const i=gs.findIndex(x=>x.id===g.id);if(i>=0){const n=[...gs];n[i]=g;return n;}return[...gs,g];});setSelected(g);}

  const urgent=useMemo(()=>grants.map(g=>{const d=g.internalReviewDeadline||g.loiDeadline||g.fullProposalDeadline;const dy=d?daysUntil(d):null;return{...g,_dy:dy,_d:d};}).filter(g=>g._dy!==null&&g._dy>=0&&g._dy<=7&&!["Archived","Declined","Closed Before Applying"].includes(g.status)).sort((a,b)=>a._dy-b._dy).slice(0,4),[grants]);

  const filtered=useMemo(()=>grants.filter(g=>{
    if(!showArchived&&(g.status==="Archived"||g.status==="Closed Before Applying"||g.isArchived))return false;
    if(filterLead!=="All"&&g.assignedLead!==filterLead)return false;
    if(filterStatus!=="All"&&g.status!==filterStatus)return false;
    if(search){const q=search.toLowerCase();if(!g.grantName.toLowerCase().includes(q)&&!g.funderName.toLowerCase().includes(q)&&!(g.pillar||"").toLowerCase().includes(q)&&!(g.sectors||[]).join(" ").toLowerCase().includes(q))return false;}
    return true;
  }),[grants,filterLead,filterStatus,showArchived,search]);

  const total=useMemo(()=>grants.reduce((s,g)=>s+(parseFloat((g.amountRequested||"").replace(/[^0-9.]/g,""))||0),0),[grants]);
  const activeGrants=grants.filter(g=>!["Archived","Declined","Closed Before Applying"].includes(g.status)&&!g.isArchived);
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
        tr:hover td{background:rgba(200,131,42,0.025)}
        input:focus,textarea:focus,select:focus{border-color:rgba(200,131,42,0.5)!important}
      `}</style>

      {/* SIDEBAR */}
      <div style={{width:224,flexShrink:0,background:"linear-gradient(180deg,#07101c,#060c14)",borderRight:"1px solid rgba(200,131,42,0.2)",display:"flex",flexDirection:"column",boxShadow:"4px 0 30px rgba(0,0,0,0.6)"}}>
        <div style={{padding:"20px 16px 14px",borderBottom:"1px solid rgba(200,131,42,0.12)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:7}}>
            <div style={{width:38,height:38,borderRadius:"50%",background:"linear-gradient(135deg,#c8832a,#7a4a10)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 20px rgba(200,131,42,0.45)",flexShrink:0,fontSize:18}}>⚖</div>
            <div>
              <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,color:"#e8c88a",letterSpacing:1,lineHeight:1.1}}>RGN</div>
              <div style={{fontSize:9,color:"#5a4a3a",letterSpacing:3,textTransform:"uppercase"}}>Labour Desk</div>
            </div>
          </div>
          <div style={{fontSize:9,color:"#2a3a4a",letterSpacing:3,textTransform:"uppercase"}}>Grant & Programme CRM v4</div>
          <div style={{marginTop:7,display:"flex",alignItems:"center",gap:5}}>
            <div style={{width:5,height:5,borderRadius:"50%",background:"#c8832a",boxShadow:"0 0 6px rgba(200,131,42,0.6)"}}/>
            <span style={{fontSize:10,color:"#7a6a5a"}}>Local mode · Persistent</span>
          </div>
        </div>
        <div style={{padding:"11px 16px",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
          {[{l:"Active Grants",v:activeGrants.length,c:"#c0b0a0"},{l:"Pipeline Value",v:`R${(total/1e6).toFixed(1)}M`,c:"#c8a060"},{l:"Urgent (≤7d)",v:urgent.length,c:urgent.length>0?"#ff8070":"#1a2a3a"}].map(s=>(
            <div key={s.l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <span style={{fontSize:11,color:"#2a3a4a"}}>{s.l}</span>
              <span style={{fontSize:13,fontFamily:"Georgia,serif",fontWeight:700,color:s.c}}>{s.v}</span>
            </div>
          ))}
        </div>
        <nav style={{flex:1,padding:"8px",display:"grid",gap:2}}>
          {NAV.map(item=>(
            <button key={item.id} onClick={()=>setView(item.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:9,padding:"9px 11px",borderRadius:7,fontSize:12,fontWeight:500,cursor:"pointer",textAlign:"left",transition:"all 0.15s",background:view===item.id?"rgba(200,131,42,0.14)":"transparent",color:view===item.id?"#c8a060":"#3a4a5a",border:view===item.id?"1px solid rgba(200,131,42,0.26)":"1px solid transparent"}}>
              <span style={{fontSize:13,flexShrink:0}}>{item.icon}</span>{item.label}
            </button>
          ))}
          <div style={{height:1,background:"rgba(255,255,255,0.04)",margin:"5px 0"}}/>
          <button onClick={()=>setShowTeam(true)} style={{width:"100%",display:"flex",alignItems:"center",gap:9,padding:"9px 11px",borderRadius:7,fontSize:12,cursor:"pointer",background:"transparent",color:"#2a3a4a",border:"1px solid transparent",textAlign:"left"}}>👤 Manage Team</button>
          <button onClick={()=>setShowArchived(a=>!a)} style={{width:"100%",display:"flex",alignItems:"center",gap:9,padding:"9px 11px",borderRadius:7,fontSize:12,cursor:"pointer",background:showArchived?"rgba(80,80,80,0.12)":"transparent",color:showArchived?"#606060":"#2a3a4a",border:showArchived?"1px solid rgba(80,80,80,0.22)":"1px solid transparent",textAlign:"left"}}>📦 {showArchived?"Hide Archived":"Show Archived"}</button>
        </nav>
        <div style={{padding:"9px 8px"}}>
          <button onClick={()=>setShowAdd(true)} style={{width:"100%",padding:"10px",background:"linear-gradient(135deg,#c8832a,#a06020)",border:"none",borderRadius:9,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",letterSpacing:2,boxShadow:"0 4px 20px rgba(200,131,42,0.35)"}}>+ NEW GRANT</button>
        </div>
        <div style={{padding:"9px 16px 13px",borderTop:"1px solid rgba(255,255,255,0.03)"}}>
          <div style={{fontSize:9,color:"#141e28",lineHeight:2,letterSpacing:0.5}}>PBO 930082491 · Section 18A<br/>UNITED WE WIN · v4.0</div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {urgent.length>0&&(
          <div style={{flexShrink:0,background:"rgba(140,25,15,0.25)",borderBottom:"1px solid rgba(140,25,15,0.5)",padding:"8px 20px",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
            <span style={{fontSize:11,color:"#ff7060",letterSpacing:3,fontWeight:700,textTransform:"uppercase",flexShrink:0}}>🚨 URGENT DEADLINES</span>
            {urgent.map(g=>(
              <button key={g.id} onClick={()=>setSelected(g)} style={{fontSize:11,background:"rgba(140,25,15,0.3)",border:"1px solid rgba(140,25,15,0.55)",color:"#ffb0a0",padding:"3px 11px",borderRadius:20,cursor:"pointer",fontFamily:"inherit"}}>
                {g.funderName} — {g._dy===0?"TODAY":`${g._dy}d`} ({fd(g._d)})
              </button>
            ))}
          </div>
        )}
        {["pipeline","all"].includes(view)&&(
          <div style={{flexShrink:0,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 20px",borderBottom:"1px solid rgba(255,255,255,0.05)",background:"rgba(7,16,28,0.85)",backdropFilter:"blur(20px)",gap:9,flexWrap:"wrap"}}>
            <div style={{fontFamily:"Georgia,serif",fontSize:17,color:"#e0d0b0",fontWeight:700}}>{view==="pipeline"?"Kanban Pipeline":"All Grant Applications"}</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search grants, sectors, pillars…" style={{...sel,width:200}}/>
              <select value={filterLead} onChange={e=>setFilterLead(e.target.value)} style={sel}><option value="All">All Leads</option>{team.map(m=><option key={m}>{m}</option>)}</select>
              <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={sel}><option value="All">All Stages</option>{STAGES.map(s=><option key={s}>{s}</option>)}</select>
            </div>
          </div>
        )}
        <div style={{flex:1,overflow:"auto",padding:16}}>
          {view==="executive"&&<ExecutiveDashboard grants={grants} onSelect={setSelected}/>}
          {view==="sector"&&<SectorView grants={grants} onSelect={setSelected}/>}
          {view==="financial"&&<FinancialDashboard grants={grants}/>}
          {view==="reports"&&<Reports grants={grants}/>}
          {view==="all"&&<GrantsTable grants={filtered} onSelect={setSelected}/>}
          {view==="pipeline"&&(
            <div style={{display:"flex",gap:9,height:"100%",overflowX:"auto",paddingBottom:6}}>
              {[...STAGES_ACTIVE,...(showArchived?STAGES_TERMINAL:[])].map(stage=>{
                const cards=filtered.filter(g=>g.status===stage);const sc=STAGE_COLORS[stage];const guide=STAGE_GUIDE[stage];
                return(
                  <div key={stage} style={{flexShrink:0,width:220,display:"flex",flexDirection:"column"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 10px",borderRadius:"8px 8px 0 0",background:`linear-gradient(135deg,${sc.bg},rgba(8,14,26,0.85))`,border:`1px solid ${sc.border}`,borderBottom:"none"}}>
                      <div style={{display:"flex",alignItems:"center",gap:5,flex:1,minWidth:0}}>
                        <div style={{width:5,height:5,borderRadius:"50%",background:sc.dot,flexShrink:0}}/>
                        <span style={{fontSize:10,fontWeight:700,color:sc.text,letterSpacing:1,textTransform:"uppercase",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{guide?.icon} {stage}</span>
                      </div>
                      <span style={{fontSize:13,fontFamily:"Georgia,serif",fontWeight:700,color:sc.dot,flexShrink:0,marginLeft:3}}>{cards.length}</span>
                    </div>
                    <div style={{flex:1,overflowY:"auto",padding:"5px",background:"rgba(255,255,255,0.012)",border:`1px solid ${sc.border}`,borderTop:"none",borderRadius:"0 0 8px 8px",minHeight:50,maxHeight:"calc(100vh - 200px)"}}>
                      {cards.map(g=><Card key={g.id} grant={g} onClick={()=>setSelected(g)}/>)}
                      {cards.length===0&&<div style={{padding:14,textAlign:"center",fontSize:11,color:"#1a2a3a",fontStyle:"italic",borderRadius:7,border:"1px dashed rgba(255,255,255,0.04)",margin:3}}>No grants</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selected&&<Detail grant={grants.find(g=>g.id===selected.id)||selected} team={team} onUpdate={upsertGrant} onClose={()=>setSelected(null)}/>}
      {showAdd&&<GrantModal team={team} onSave={g=>upsertGrant({...g,id:g.id||uid(),activities:g.activities||[]})} onClose={()=>setShowAdd(false)}/>}
      {showTeam&&<TeamModal team={team} onSave={setTeam} onClose={()=>setShowTeam(false)}/>}
    </div>
  );
}
