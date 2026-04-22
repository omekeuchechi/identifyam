import{u as O,r as m,j as e,H as B,L as g}from"./app-C8oj3Gtf.js";const q=({auth:A})=>{const{props:z}=O(),[i,I]=m.useState({nin:"",search_type:"nin search by nin",api_version:"v1",surName:"",firstName:"",dateOfBirth:"",gender:""}),[v,j]=m.useState(!1),[l,y]=m.useState(null),[P,t]=m.useState(""),[C,b]=m.useState(!1),[u,T]=m.useState("slip");m.useEffect(()=>{const s=setInterval(async()=>{try{const a=document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");await fetch("/api/lagacy-nin/keep-alive",{method:"POST",credentials:"include",headers:{"X-CSRF-TOKEN":a,"X-Requested-With":"XMLHttpRequest"}})}catch(a){console.log("Session keep-alive failed:",a)}},3e5);return()=>clearInterval(s)},[]),m.useEffect(()=>{if(l&&l.data&&!C){b(!0);const s=u==="card"?"NIN Card":"NIN Slip";window.confirm(`Would you like to download the ${s} PDF?`)?S():b(!1)}},[l]);const h=s=>{const{name:a,value:r}=s.target;I(n=>({...n,[a]:r})),t(""),y(null),b(!1)},R=async s=>{if(s.preventDefault(),!A.user){t("Please login to use this service");return}try{j(!0),t("");let a="/api/lagacy-nin/search";i.api_version==="v2"?a="/api/lagacy-nin/v2/search":i.api_version==="v3"?a="/api/lagacy-nin/v3/search":i.api_version==="v4"&&(a="/api/lagacy-nin/v4/search");const r=document.querySelector('meta[name="csrf-token"]')?.getAttribute("content"),n=await fetch(a,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":r,"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify(i)}),o=n.headers.get("content-type");if(o&&o.includes("text/html")){t("Session expired. Please refresh the page and login again.");return}if(!n.ok){const x=await n.json();t(x.error||"Search failed");return}const d=await n.json();if(n.ok&&d)y(d);else if(n.ok)t("Invalid response format received from server");else{const x=await n.json();t(x.error||"Search failed")}}catch(a){t(a.message||"An error occurred during search")}finally{j(!1)}},w=s=>s?s.startsWith("data:")?s:typeof s=="string"?`data:image/jpeg;base64,${s}`:"":"",k=(s,a)=>{try{if(!s||typeof s!="string")throw new Error("Invalid image data");let r=s;if(s.startsWith("data:")&&(r=s.split(",")[1]),!r||r.length===0)throw new Error("Empty base64 data");const n=r.replace(/[^A-Za-z0-9+/=]/g,""),o=atob(n),d=new Array(o.length);for(let f=0;f<o.length;f++)d[f]=o.charCodeAt(f);const x=new Uint8Array(d),N=new Blob([x],{type:"image/jpeg"}),c=window.URL.createObjectURL(N),p=document.createElement("a");p.href=c,p.download=`${a}-${Date.now()}.jpg`,document.body.appendChild(p),p.click(),document.body.removeChild(p),window.URL.revokeObjectURL(c)}catch(r){console.error("Error downloading image:",r),alert("Failed to download image: "+r.message)}},S=async()=>{if(!l||!l.data){t("No verification results available for PDF generation");return}try{j(!0),t("");const s=document.querySelector('meta[name="csrf-token"]')?.getAttribute("content"),a=await fetch("/api/lagacy-nin/pdf",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":s,"X-Requested-With":"XMLHttpRequest",Accept:"application/json, application/pdf"},body:JSON.stringify({data:l.data,nin:l.data.data?.nin||i.nin,api_version:i.api_version,search_type:i.search_type,template_type:u})}),r=a.headers.get("content-type");if(a.status===401){t("Session expired. Please refresh the page and login again."),setTimeout(()=>{window.location.href="/login"},2e3);return}if(r&&r.includes("text/html")){t("Session expired. Please refresh the page and login again.");return}if(r&&r.includes("application/json")&&!a.ok){const L=await a.json();t(L.error||"PDF generation failed");return}if(!a.ok)throw new Error(`HTTP ${a.status}: ${a.statusText}`);const n=await a.blob(),o=n.type,d=o==="application/pdf",x=o==="text/html";if(n.size<100)throw new Error("Generated file is too small (possibly corrupted)");const N=window.URL.createObjectURL(n),c=document.createElement("a");c.href=N;const p=u==="card"?"NIN-Card":"NIN-Slip",f=l.data.data?.nin||i.nin,F=d?".pdf":".html";c.download=`${p}-${f}-${Date.now()}${F}`,document.body.appendChild(c),c.click(),document.body.removeChild(c),setTimeout(()=>{window.URL.revokeObjectURL(N)},100);const D=d?"PDF":"HTML",E=x?" (PDF generation failed, HTML fallback provided)":"";alert("✅ "+p+" "+D+" downloaded successfully!"+E),b(!1)}catch(s){console.error("PDF generation error:",s),t(s.message||"Failed to generate PDF"),alert("❌ Failed to generate PDF: "+(s.message||"Unknown error"))}finally{j(!1)}},_=s=>s?s.status==="failed"||s.status==="error"?e.jsxs("div",{className:"result-container",children:[e.jsx("h3",{children:"API Response"}),e.jsxs("div",{className:"alert alert-danger",children:[e.jsxs("h4",{children:["Error: ",s.status]}),e.jsx("p",{children:s.message||"An error occurred"})]})]}):e.jsxs("div",{className:"result-container",children:[e.jsx("h3",{children:"Verification Results"}),e.jsxs("div",{className:"result-section",children:[e.jsx("h4",{children:"PDF Template Selection"}),e.jsxs("div",{className:"template-selection",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Select PDF Template:"}),e.jsxs("div",{className:"template-options",children:[e.jsxs("label",{className:"template-option",children:[e.jsx("input",{type:"radio",name:"template",value:"slip",checked:u==="slip",onChange:a=>T(a.target.value)}),e.jsxs("div",{className:"template-preview",children:[e.jsx("i",{className:"fas fa-file-alt"}),e.jsx("span",{children:"NIN Slip"}),e.jsx("small",{children:"Traditional NIN slip format with official layout"})]})]}),e.jsxs("label",{className:"template-option",children:[e.jsx("input",{type:"radio",name:"template",value:"card",checked:u==="card",onChange:a=>{T(a.target.value),l&&l.data&&window.confirm("Would you like to download the "+(a.target.value==="card"?"NIN Card":"NIN Slip")+" PDF?")&&setTimeout(()=>S(),100)}}),e.jsxs("div",{className:"template-preview",children:[e.jsx("i",{className:"fas fa-id-card"}),e.jsx("span",{children:"NIN Card"}),e.jsx("small",{children:"Plastic card style with photo and details"})]})]})]})]}),e.jsxs("button",{onClick:S,className:"btn btn-success btn-lg",disabled:v,children:[e.jsx("i",{className:"fas fa-download"}),"Download ",u==="card"?"NIN Card":"NIN Slip"," PDF"]})]})]}),e.jsxs("div",{className:"result-section",children:[e.jsx("h4",{children:"Basic Information"}),e.jsxs("div",{className:"result-grid",children:[e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"NIN:"}),e.jsx("span",{children:s.data?.nin||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Full Name:"}),e.jsx("span",{children:s.data?.fullName||`${s.data?.surName||s.data?.surname||""} ${s.data?.firstName||s.data?.firstname||""} ${s.data?.middleName||s.data?.middlename||""}`.trim()||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Phone:"}),e.jsx("span",{children:s.data?.telephoneno||s.data?.phone||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Email:"}),e.jsx("span",{children:s.data?.email||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Date of Birth:"}),e.jsx("span",{children:s.data?.dateOfBirth||s.data?.birthdate||s.data?.birth_date||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Gender:"}),e.jsx("span",{children:s.data?.gender||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Marital Status:"}),e.jsx("span",{children:s.data?.maritalstatus||s.data?.marital_status||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Religion:"}),e.jsx("span",{children:s.data?.religion||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Title:"}),e.jsx("span",{children:s.data?.title||"N/A"})]})]})]}),e.jsxs("div",{className:"result-section",children:[e.jsx("h4",{children:"Tracking Information"}),e.jsxs("div",{className:"result-grid",children:[e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Tracking ID:"}),e.jsx("span",{children:s.data?.trackingId||s.data?.tracking_id||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Title:"}),e.jsx("span",{children:s.data?.title||"N/A"})]})]})]}),(s.data?.birthCountry||s.data?.birthState)&&e.jsxs("div",{className:"result-section",children:[e.jsx("h4",{children:"Birth Information"}),e.jsxs("div",{className:"result-grid",children:[e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Birth Country:"}),e.jsx("span",{children:s.data?.birthCountry||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Birth State:"}),e.jsx("span",{children:s.data?.birthState||"N/A"})]})]})]}),(s.data?.residenceState||s.data?.residenceTown)&&e.jsxs("div",{className:"result-section",children:[e.jsx("h4",{children:"Residence Information"}),e.jsxs("div",{className:"result-grid",children:[e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Residence State:"}),e.jsx("span",{children:s.data?.residenceState||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Residence Town:"}),e.jsx("span",{children:s.data?.residenceTown||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Residential Address:"}),e.jsx("span",{children:s.data?.residentialAddress||"N/A"})]})]})]}),s.data.nextOfKin&&e.jsxs("div",{className:"result-section",children:[e.jsx("h4",{children:"Next of Kin Information"}),e.jsxs("div",{className:"result-grid",children:[e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Next of Kin Name:"}),e.jsx("span",{children:`${s.data.nextOfKin?.firstName||""} ${s.data.nextOfKin?.middleName||""} ${s.data.nextOfKin?.lastName||""}`.trim()||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Next of Kin Address:"}),e.jsx("span",{children:s.data.nextOfKin?.residentialAddress||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Next of Kin LGA:"}),e.jsx("span",{children:s.data.nextOfKin?.lga||"N/A"})]})]})]}),(s.data?.photo||s.data?.image||s.data?.signature)&&e.jsxs("div",{className:"result-section",children:[e.jsx("h4",{children:"Media"}),e.jsxs("div",{className:"media-grid",children:[s.data?.photo&&e.jsxs("div",{className:"media-item",children:[e.jsx("label",{children:"Photo:"}),e.jsx("img",{src:w(s.data.photo),alt:"Passport Photo",className:"result-image"}),e.jsxs("button",{onClick:()=>k(s.data.photo,"passport-photo"),className:"btn btn-sm btn-primary mt-2",children:[e.jsx("i",{className:"fas fa-download"})," Download Photo"]})]}),s.data?.image&&e.jsxs("div",{className:"media-item",children:[e.jsx("label",{children:"Image:"}),e.jsx("img",{src:w(s.data.image),alt:"Image",className:"result-image"}),e.jsxs("button",{onClick:()=>k(s.data.image,"image"),className:"btn btn-sm btn-primary mt-2",children:[e.jsx("i",{className:"fas fa-download"})," Download Image"]})]}),s.data?.signature&&e.jsxs("div",{className:"media-item",children:[e.jsx("label",{children:"Signature:"}),e.jsx("img",{src:w(s.data.signature),alt:"Signature",className:"result-image"}),e.jsxs("button",{onClick:()=>k(s.data.signature,"signature"),className:"btn btn-sm btn-primary mt-2",children:[e.jsx("i",{className:"fas fa-download"})," Download Signature"]})]})]})]}),s.data?.all_validation_passed!==void 0&&e.jsxs("div",{className:"result-section",children:[e.jsx("h4",{children:"Validation Status"}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"All Validation Passed:"}),e.jsx("span",{className:s.data?.all_validation_passed?"status-success":"status-error",children:s.data?.all_validation_passed?"Yes":"No"})]})]})]}):null;return e.jsxs(e.Fragment,{children:[e.jsx(B,{title:"Lagacy NIN Verification"}),e.jsxs("div",{className:"dashboard-layout",children:[e.jsxs("aside",{className:"sidebar",children:[e.jsxs("a",{href:"/",className:"sidebar-logo",children:[e.jsx("div",{className:"logo-image"}),e.jsx("span",{children:"IDENTIFYAM"})]}),e.jsxs("nav",{className:"sidebar-menu",children:[e.jsxs(g,{href:route("dashboard"),className:"sidebar-link",children:[e.jsx("i",{className:"fas fa-home"}),"Dashboard"]}),e.jsxs(g,{href:"/lagacy-nin",className:"sidebar-link active",children:[e.jsx("i",{className:"fas fa-history"}),"NIN Service"]}),e.jsxs(g,{href:route("exam.cards"),className:"sidebar-link",children:[e.jsx("i",{className:"fas fa-credit-card"})," Exam Cards"]}),e.jsxs(g,{href:route("funding"),className:"sidebar-link",children:[e.jsx("i",{className:"fas fa-wallet"}),"Wallet"]}),e.jsxs(g,{href:"history",className:"sidebar-link",children:[e.jsx("i",{className:"fas fa-history"}),"History"]}),e.jsxs(g,{href:route("settings"),className:"sidebar-link",children:[e.jsx("i",{className:"fas fa-cog"}),"Settings"]})]})]}),e.jsxs("div",{className:"dashboard-main",children:[e.jsxs("header",{className:"topbar",children:[e.jsx("h3",{children:"Lagacy NIN Verification"}),e.jsxs("div",{className:"topbar-right",children:[e.jsx("span",{className:"notification",children:e.jsx("i",{className:"fas fa-bell"})}),e.jsxs("div",{className:"user-profile",children:[e.jsx("img",{src:"/assets/img/user_profile.png",alt:"avatar"}),e.jsx("span",{children:A.user.name})]})]})]}),e.jsxs("div",{className:"dashboard-content",children:[e.jsxs("div",{className:"nin-search-card",children:[e.jsx("h3",{children:"Lagacy NIN Verification Service"}),e.jsx("p",{children:"Verify NIN details using multiple search methods and API versions"}),e.jsxs("form",{onSubmit:R,className:"nin-search-form",children:[e.jsxs("div",{className:"search-options",children:[e.jsxs("div",{className:"option-group",children:[e.jsx("label",{children:"Search Type"}),e.jsxs("select",{value:i.search_type,onChange:h,name:"search_type",className:"api-select",children:[e.jsx("option",{value:"nin search by nin",children:"Basic Search"}),e.jsx("option",{value:"nin search by phone",children:"Phone"}),e.jsx("option",{value:"nin search by demographic",children:"Demographic Search"})]})]}),e.jsxs("div",{className:"option-group",children:[e.jsx("label",{children:"API Version"}),e.jsxs("select",{value:i.api_version,onChange:h,name:"api_version",className:"api-select",children:[e.jsx("option",{value:"v1",children:"API v1"}),e.jsx("option",{value:"v2",children:"API v2"}),e.jsx("option",{value:"v3",children:"API v3"}),e.jsx("option",{value:"v4",children:"API v4"})]})]})]}),i.search_type==="nin search by demographic"&&e.jsxs("div",{className:"demographic-inputs",children:[e.jsxs("div",{className:"input-row",children:[e.jsxs("div",{className:"input-group",children:[e.jsx("label",{children:"Surname"}),e.jsx("input",{type:"text",value:i.surName,onChange:h,name:"surName",placeholder:"Enter surname",required:!0,className:"search-input"})]}),e.jsxs("div",{className:"input-group",children:[e.jsx("label",{children:"First Name"}),e.jsx("input",{type:"text",value:i.firstName,onChange:h,name:"firstName",placeholder:"Enter first name",required:!0,className:"search-input"})]})]}),e.jsxs("div",{className:"input-row",children:[e.jsxs("div",{className:"input-group",children:[e.jsx("label",{children:"Birth Date"}),e.jsx("input",{type:"date",value:i.dateOfBirth,onChange:h,name:"dateOfBirth",required:!0,className:"search-input"})]}),e.jsxs("div",{className:"input-group",children:[e.jsx("label",{children:"Gender"}),e.jsxs("select",{value:i.gender,onChange:h,name:"gender",required:!0,className:"search-input",children:[e.jsx("option",{value:"",children:"Select Gender"}),e.jsx("option",{value:"Male",children:"Male"}),e.jsx("option",{value:"Female",children:"Female"})]})]})]})]}),i.search_type!=="nin search by demographic"&&e.jsxs("div",{className:"input-group",children:[e.jsx("label",{children:"Enter NIN Number"}),e.jsx("input",{type:"text",value:i.nin,onChange:h,name:"nin",placeholder:"Enter 11-digit NIN",pattern:"[0-9]{11}",maxLength:11,required:!0,className:"search-input"})]}),P&&e.jsxs("div",{className:"error-message",children:[e.jsx("i",{className:"fas fa-exclamation-circle"}),P]}),e.jsxs("div",{className:"form-actions",children:[e.jsx("button",{type:"submit",className:"btn btn-primary",disabled:v,style:{background:"linear-gradient(135deg, #0B6B3A 0%, #10B981 70.71%)",color:"#fff",padding:"13px 30px",border:"none",borderRadius:"8px"},children:v?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-border spinner-border-sm",role:"status","aria-hidden":"true"}),"Searching..."]}):e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"fas fa-search"}),"Search NIN"]})}),e.jsx("button",{type:"button",className:"reset-btn",onClick:()=>{I({nin:"",search_type:"nin search by nin",api_version:"v1",surName:"",firstName:"",dateOfBirth:"",gender:""}),y(null),t(""),b(!1)},children:"Clear Results"})]})]})]}),l&&e.jsxs("div",{className:"nin-results-card",children:[e.jsx("h3",{children:"Verification Results"}),l.data?e.jsx("div",{className:"results-content",children:_(l)}):e.jsxs("div",{className:"no-results",children:[e.jsx("i",{className:"fas fa-search"}),e.jsx("p",{children:"No results found for the provided information"})]})]})]})]})]}),e.jsx("style",{jsx:!0,children:`
                .nin-search-card {
                    background: white;
                    padding: 25px;
                    border-radius: 12px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    margin-bottom: 25px;
                }

                .nin-search-card h3 {
                    color: #1f2937;
                    margin-bottom: 8px;
                    font-size: 24px;
                }

                .nin-search-card p {
                    color: #6b7280;
                    margin-bottom: 25px;
                }

                .nin-search-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .search-options {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }

                .option-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 500;
                    color: #374151;
                }

                .api-select, .search-input {
                    width: 100%;
                    padding: 12px 15px;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 14px;
                    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
                }

                .api-select:focus, .search-input:focus {
                    border-color: #10b981;
                    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
                    outline: 0;
                }

                .demographic-inputs {
                    background: #f9fafb;
                    padding: 20px;
                    border-radius: 8px;
                    border: 1px solid #e5e7eb;
                }

                .input-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                    margin-bottom: 15px;
                }

                .input-group label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: 500;
                    color: #374151;
                    font-size: 14px;
                }

                .error-message {
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    color: #dc2626;
                    padding: 12px 15px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .form-actions {
                    display: flex;
                    gap: 15px;
                    margin-top: 10px;
                }

                .reset-btn {
                    background: #6b7280;
                    color: white;
                    padding: 13px 25px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    transition: background-color 0.15s ease-in-out;
                }

                .reset-btn:hover {
                    background: #4b5563;
                }

                .nin-results-card {
                    background: white;
                    padding: 25px;
                    border-radius: 12px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }

                .nin-results-card h3 {
                    color: #1f2937;
                    margin-bottom: 20px;
                    font-size: 24px;
                }

                .result-container {
                    display: flex;
                    flex-direction: column;
                    gap: 25px;
                }

                .result-section {
                    background: #f9fafb;
                    padding: 20px;
                    border-radius: 8px;
                    border: 1px solid #e5e7eb;
                }

                .result-section h4 {
                    color: #1f2937;
                    margin-bottom: 15px;
                    font-size: 18px;
                    font-weight: 600;
                    border-bottom: 2px solid #10b981;
                    padding-bottom: 8px;
                }

                .template-selection {
                    background: #ecfdf5;
                    padding: 20px;
                    border-radius: 8px;
                    border: 1px solid #d1fae5;
                }

                .template-options {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                    margin: 15px 0;
                }

                .template-option {
                    display: flex;
                    align-items: flex-start;
                    padding: 15px;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    background: white;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .template-option:hover {
                    border-color: #10b981;
                    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.1);
                }

                .template-option input[type="radio"] {
                    margin-right: 12px;
                    margin-top: 2px;
                }

                .template-preview {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }

                .template-preview i {
                    font-size: 24px;
                    color: #6b7280;
                }

                .template-preview span {
                    font-size: 16px;
                    font-weight: 600;
                    color: #1f2937;
                }

                .template-preview small {
                    color: #6b7280;
                    font-size: 12px;
                    line-height: 1.4;
                }

                .result-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 15px;
                }

                .result-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 15px;
                    background: white;
                    border-radius: 6px;
                    border: 1px solid #e5e7eb;
                }

                .result-item label {
                    font-weight: 600;
                    color: #374151;
                    font-size: 14px;
                }

                .result-item span {
                    color: #1f2937;
                    font-size: 14px;
                    text-align: right;
                }

                .media-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-top: 15px;
                }

                .media-item {
                    text-align: center;
                    padding: 15px;
                    background: white;
                    border-radius: 8px;
                    border: 1px solid #e5e7eb;
                }

                .media-item label {
                    display: block;
                    font-weight: 600;
                    color: #374151;
                    margin-bottom: 10px;
                }

                .result-image {
                    max-width: 100%;
                    max-height: 200px;
                    border-radius: 6px;
                    border: 1px solid #e5e7eb;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                .no-results {
                    text-align: center;
                    padding: 40px;
                    color: #6b7280;
                }

                .no-results i {
                    font-size: 48px;
                    margin-bottom: 15px;
                    color: #d1d5db;
                }

                .status-success {
                    color: #059669;
                    font-weight: 600;
                }

                .status-error {
                    color: #dc2626;
                    font-weight: 600;
                }

                .btn {
                    padding: 13px 25px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.15s ease-in-out;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }

                .btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .btn-success {
                    background: #059669;
                    color: white;
                }

                .btn-success:hover:not(:disabled) {
                    background: #047857;
                }

                .btn-primary {
                    background: #059669;
                    color: white;
                }

                .btn-primary:hover:not(:disabled) {
                    background: #047857;
                }

                .btn-sm {
                    padding: 8px 15px;
                    font-size: 12px;
                }

                .spinner-border-sm {
                    width: 1rem;
                    height: 1rem;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top: 2px solid white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @media (max-width: 768px) {
                    .search-options {
                        grid-template-columns: 1fr;
                    }
                    
                    .input-row {
                        grid-template-columns: 1fr;
                    }
                    
                    .template-options {
                        grid-template-columns: 1fr;
                    }
                    
                    .result-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `})]})};export{q as default};
