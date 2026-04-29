import{u as L,r as x,j as e,H as O,L as g}from"./app-CHRbuAlC.js";const q=({auth:S})=>{const{props:B}=L(),[r,A]=x.useState({nin:"",search_type:"nin search by nin",api_version:"v1",surName:"",firstName:"",dateOfBirth:"",gender:""}),[N,b]=x.useState(!1),[d,v]=x.useState(null),[I,t]=x.useState(""),[z,y]=x.useState(!1),[f,P]=x.useState("slip");x.useEffect(()=>{const a=setInterval(async()=>{try{const s=document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");await fetch("/api/lagacy-nin/keep-alive",{method:"POST",credentials:"include",headers:{"X-CSRF-TOKEN":s,"X-Requested-With":"XMLHttpRequest"}})}catch(s){console.log("Session keep-alive failed:",s)}},3e5);return()=>clearInterval(a)},[]);const m=a=>{const{name:s,value:i}=a.target;A(n=>({...n,[s]:i})),t(""),v(null),y(!1)},T=async a=>{if(a.preventDefault(),!S.user){t("Please login to use this service");return}try{b(!0),t("");let s="/api/lagacy-nin/search";r.api_version==="v2"?s="/api/lagacy-nin/v2/search":r.api_version==="v3"?s="/api/lagacy-nin/v3/search":r.api_version==="v4"&&(s="/api/lagacy-nin/v4/search");const i=document.querySelector('meta[name="csrf-token"]')?.getAttribute("content"),n=await fetch(s,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":i,"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify(r)}),l=n.headers.get("content-type");if(l&&l.includes("text/html")){t("Session expired. Please refresh the page and login again.");return}if(!n.ok){const h=await n.json();t(h.error||"Search failed");return}const o=await n.json();if(n.ok&&o)v(o);else if(n.ok)t("Invalid response format received from server");else{const h=await n.json();t(h.error||"Search failed")}}catch(s){t(s.message||"An error occurred during search")}finally{b(!1)}},w=a=>a?a.startsWith("data:")?a:typeof a=="string"?`data:image/jpeg;base64,${a}`:"":"",k=(a,s)=>{try{if(!a||typeof a!="string")throw new Error("Invalid image data");let i=a;if(a.startsWith("data:")&&(i=a.split(",")[1]),!i||i.length===0)throw new Error("Empty base64 data");const n=i.replace(/[^A-Za-z0-9+/=]/g,""),l=atob(n),o=new Array(l.length);for(let u=0;u<l.length;u++)o[u]=l.charCodeAt(u);const h=new Uint8Array(o),j=new Blob([h],{type:"image/jpeg"}),c=window.URL.createObjectURL(j),p=document.createElement("a");p.href=c,p.download=`${s}-${Date.now()}.jpg`,document.body.appendChild(p),p.click(),document.body.removeChild(p),window.URL.revokeObjectURL(c)}catch(i){console.error("Error downloading image:",i),alert("Failed to download image: "+i.message)}},C=async()=>{if(!d||!d.data){t("No verification results available for PDF generation");return}try{b(!0),t("");const a=document.querySelector('meta[name="csrf-token"]')?.getAttribute("content"),s=await fetch("/api/lagacy-nin/pdf",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":a,"X-Requested-With":"XMLHttpRequest",Accept:"application/json, application/pdf"},body:JSON.stringify({data:d.data,nin:d.data.data?.nin||r.nin,api_version:r.api_version,search_type:r.search_type,template_type:f})}),i=s.headers.get("content-type");if(s.status===401){t("Session expired. Please refresh the page and login again."),setTimeout(()=>{window.location.href="/login"},2e3);return}if(i&&i.includes("text/html")){t("Session expired. Please refresh the page and login again.");return}if(i&&i.includes("application/json")&&!s.ok){const E=await s.json();t(E.error||"PDF generation failed");return}if(!s.ok)throw new Error(`HTTP ${s.status}: ${s.statusText}`);const n=await s.blob(),l=n.type,o=l==="application/pdf",h=l==="text/html";if(n.size<100)throw new Error("Generated file is too small (possibly corrupted)");const j=window.URL.createObjectURL(n),c=document.createElement("a");c.href=j;const p=f==="card"?"NIN-Card":"NIN-Slip",u=d.data.data?.nin||r.nin,R=o?".pdf":".html";c.download=`${p}-${u}-${Date.now()}${R}`,document.body.appendChild(c),c.click(),document.body.removeChild(c),setTimeout(()=>{window.URL.revokeObjectURL(j)},100);const F=o?"PDF":"HTML",D=h?" (PDF generation failed, HTML fallback provided)":"";alert("✅ "+p+" "+F+" downloaded successfully!"+D),y(!1)}catch(a){console.error("PDF generation error:",a),t(a.message||"Failed to generate PDF"),alert("❌ Failed to generate PDF: "+(a.message||"Unknown error"))}finally{b(!1)}},_=a=>a?a.status==="failed"||a.status==="error"?e.jsxs("div",{className:"result-container",children:[e.jsx("h3",{children:"API Response"}),e.jsxs("div",{className:"alert alert-danger",children:[e.jsxs("h4",{children:["Error: ",a.status]}),e.jsx("p",{children:a.message||"An error occurred"})]})]}):e.jsxs("div",{className:"result-container",children:[e.jsxs("div",{className:"result-section",children:[e.jsx("h4",{children:"PDF Template Selection"}),e.jsxs("div",{className:"template-selection",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Select PDF Template:"}),e.jsxs("div",{className:"template-options",children:[e.jsxs("label",{className:"template-option",children:[e.jsx("input",{type:"radio",name:"template",value:"slip",checked:f==="slip",onChange:s=>P(s.target.value)}),e.jsxs("div",{className:"template-preview",children:[e.jsx("i",{className:"fas fa-file-alt"}),e.jsx("span",{children:"NIN Slip"}),e.jsx("small",{children:"Traditional NIN slip format with official layout"})]})]}),e.jsxs("label",{className:"template-option",children:[e.jsx("input",{type:"radio",name:"template",value:"card",checked:f==="card",onChange:s=>P(s.target.value)}),e.jsxs("div",{className:"template-preview",children:[e.jsx("i",{className:"fas fa-id-card"}),e.jsx("span",{children:"NIN Card"}),e.jsx("small",{children:"Plastic card style with photo and details"})]})]})]})]}),e.jsxs("button",{onClick:C,className:"btn btn-success btn-lg",disabled:N,children:[e.jsx("i",{className:"fas fa-download"}),"Download ",f==="card"?"NIN Card":"NIN Slip"," PDF"]})]})]}),e.jsxs("div",{className:"result-section",children:[e.jsx("h4",{children:"Basic Information"}),e.jsxs("div",{className:"result-grid",children:[e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"NIN:"}),e.jsx("span",{children:a.data.data.nin||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Full Name:"}),e.jsx("span",{children:a.data.data.fullName||`${a.data.data.surName||a.data.data.surname||""} ${a.data.data.firstName||a.data.data.firstname||""} ${a.data.data.middleName||a.data.data.middlename||""}`.trim()||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Phone:"}),e.jsx("span",{children:a.data.data.telephoneno||a.data.data.phone||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Email:"}),e.jsx("span",{children:a.data.data.email||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Date of Birth:"}),e.jsx("span",{children:a.data.data.dateOfBirth||a.data.data.birthdate||a.data.data.birth_date||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Gender:"}),e.jsx("span",{children:a.data.data.gender||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Marital Status:"}),e.jsx("span",{children:a.data.data.maritalstatus||a.data.data.marital_status||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Religion:"}),e.jsx("span",{children:a.data.data.religion||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Title:"}),e.jsx("span",{children:a.data.data.title||"N/A"})]})]})]}),e.jsxs("div",{className:"result-section",children:[e.jsx("h4",{children:"Tracking Information"}),e.jsxs("div",{className:"result-grid",children:[e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Tracking ID:"}),e.jsx("span",{children:a.data.data.trackingId||a.data.data.tracking_id||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Title:"}),e.jsx("span",{children:a.data.data.title||"N/A"})]})]})]}),(a.data.data.birthCountry||a.data.data.birthState)&&e.jsxs("div",{className:"result-section",children:[e.jsx("h4",{children:"Birth Information"}),e.jsxs("div",{className:"result-grid",children:[e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Birth Country:"}),e.jsx("span",{children:a.data.data.birthCountry||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Birth State:"}),e.jsx("span",{children:a.data.data.birthState||"N/A"})]})]})]}),(a.data.residenceState||a.data.data.residenceTown)&&e.jsxs("div",{className:"result-section",children:[e.jsx("h4",{children:"Residence Information"}),e.jsxs("div",{className:"result-grid",children:[e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Residence State:"}),e.jsx("span",{children:a.data.data.residenceState||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Residence Town:"}),e.jsx("span",{children:a.data.data.residenceTown||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Residential Address:"}),e.jsx("span",{children:a.data.data.residentialAddress||"N/A"})]})]})]}),a.data.nextOfKin&&e.jsxs("div",{className:"result-section",children:[e.jsx("h4",{children:"Next of Kin Information"}),e.jsxs("div",{className:"result-grid",children:[e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Next of Kin Name:"}),e.jsx("span",{children:`${a.data.data.nextOfKin?.firstName||""} ${a.data.data.nextOfKin?.middleName||""} ${a.data.data.nextOfKin?.lastName||""}`.trim()||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Next of Kin Address:"}),e.jsx("span",{children:a.data.data.nextOfKin?.residentialAddress||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Next of Kin LGA:"}),e.jsx("span",{children:a.data.data.nextOfKin?.lga||"N/A"})]})]})]}),(a.data.data.photo||a.data.data.image||a.data.data.signature)&&e.jsxs("div",{className:"result-section",children:[e.jsx("h4",{children:"Media"}),e.jsxs("div",{className:"media-grid",children:[a.data.data.photo&&e.jsxs("div",{className:"media-item",children:[e.jsx("label",{children:"Photo:"}),e.jsx("img",{src:w(a.data.data.photo),alt:"Passport Photo",className:"result-image"}),e.jsxs("button",{onClick:()=>k(a.data.data.photo,"passport-photo"),className:"btn btn-sm btn-primary mt-2",children:[e.jsx("i",{className:"fas fa-download"})," Download Photo"]})]}),a.data.data.image&&e.jsxs("div",{className:"media-item",children:[e.jsx("label",{children:"Image:"}),e.jsx("img",{src:w(a.data.data.image),alt:"Image",className:"result-image"}),e.jsxs("button",{onClick:()=>k(a.data.data.image,"image"),className:"btn btn-sm btn-primary mt-2",children:[e.jsx("i",{className:"fas fa-download"})," Download Image"]})]}),a.data.data.signature&&e.jsxs("div",{className:"media-item",children:[e.jsx("label",{children:"Signature:"}),e.jsx("img",{src:w(a.data.data.signature),alt:"Signature",className:"result-image"}),e.jsxs("button",{onClick:()=>k(a.data.data.signature,"signature"),className:"btn btn-sm btn-primary mt-2",children:[e.jsx("i",{className:"fas fa-download"})," Download Signature"]})]})]})]}),a.data.data.all_validation_passed!==void 0&&e.jsxs("div",{className:"result-section",children:[e.jsx("h4",{children:"Validation Status"}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"All Validation Passed:"}),e.jsx("span",{className:a.data.data.all_validation_passed?"status-success":"status-error",children:a.data.data.all_validation_passed?"Yes":"No"})]})]})]}):null;return e.jsxs(e.Fragment,{children:[e.jsx(O,{title:"Lagacy NIN Verification"}),e.jsxs("div",{className:"dashboard-layout",children:[e.jsxs("aside",{className:"sidebar",children:[e.jsxs("a",{href:"/",className:"sidebar-logo",children:[e.jsx("div",{className:"logo-image"}),e.jsx("span",{children:"IDENTIFYAM"})]}),e.jsxs("nav",{className:"sidebar-menu",children:[e.jsxs(g,{href:route("dashboard"),className:"sidebar-link",children:[e.jsx("i",{className:"fas fa-home"}),"Dashboard"]}),e.jsxs(g,{href:"/lagacy-nin",className:"sidebar-link active",children:[e.jsx("i",{className:"fas fa-history"}),"NIN Service"]}),e.jsxs(g,{href:route("exam.cards"),className:"sidebar-link",children:[e.jsx("i",{className:"fas fa-credit-card"})," Exam Cards"]}),e.jsxs(g,{href:route("funding"),className:"sidebar-link",children:[e.jsx("i",{className:"fas fa-wallet"}),"Wallet"]}),e.jsxs(g,{href:"history",className:"sidebar-link",children:[e.jsx("i",{className:"fas fa-history"}),"History"]}),e.jsxs(g,{href:route("settings"),className:"sidebar-link",children:[e.jsx("i",{className:"fas fa-cog"}),"Settings"]})]})]}),e.jsxs("div",{className:"dashboard-main",children:[e.jsxs("header",{className:"topbar",children:[e.jsx("h3",{children:"Lagacy NIN Verification"}),e.jsxs("div",{className:"topbar-right",children:[e.jsx("span",{className:"notification",children:e.jsx("i",{className:"fas fa-bell"})}),e.jsxs("div",{className:"user-profile",children:[e.jsx("img",{src:"/assets/img/user_profile.png",alt:"avatar"}),e.jsx("span",{children:S.user.name})]})]})]}),e.jsxs("div",{className:"dashboard-content",children:[e.jsxs("div",{className:"nin-search-card",children:[e.jsx("h3",{children:"Lagacy NIN Verification Service"}),e.jsx("p",{children:"Verify NIN details using multiple search methods and API versions"}),e.jsxs("form",{onSubmit:T,className:"nin-search-form",children:[e.jsxs("div",{className:"search-options",children:[e.jsxs("div",{className:"option-group",children:[e.jsx("label",{children:"Search Type"}),e.jsxs("select",{value:r.search_type,onChange:m,name:"search_type",className:"api-select",children:[e.jsx("option",{value:"nin search by nin",children:"Basic Search"}),e.jsx("option",{value:"nin search by phone",children:"Phone"}),e.jsx("option",{value:"nin search by demographic",children:"Demographic Search"})]})]}),e.jsxs("div",{className:"option-group",children:[e.jsx("label",{children:"API Version"}),e.jsxs("select",{value:r.api_version,onChange:m,name:"api_version",className:"api-select",children:[e.jsx("option",{value:"v1",children:"API v1"}),e.jsx("option",{value:"v2",children:"API v2"}),e.jsx("option",{value:"v3",children:"API v3"}),e.jsx("option",{value:"v4",children:"API v4"})]})]})]}),r.search_type==="nin search by demographic"&&e.jsxs("div",{className:"demographic-inputs",children:[e.jsxs("div",{className:"input-row",children:[e.jsxs("div",{className:"input-group",children:[e.jsx("label",{children:"Surname"}),e.jsx("input",{type:"text",value:r.surName,onChange:m,name:"surName",placeholder:"Enter surname",required:!0,className:"search-input"})]}),e.jsxs("div",{className:"input-group",children:[e.jsx("label",{children:"First Name"}),e.jsx("input",{type:"text",value:r.firstName,onChange:m,name:"firstName",placeholder:"Enter first name",required:!0,className:"search-input"})]})]}),e.jsxs("div",{className:"input-row",children:[e.jsxs("div",{className:"input-group",children:[e.jsx("label",{children:"Birth Date"}),e.jsx("input",{type:"date",value:r.dateOfBirth,onChange:m,name:"dateOfBirth",required:!0,className:"search-input"})]}),e.jsxs("div",{className:"input-group",children:[e.jsx("label",{children:"Gender"}),e.jsxs("select",{value:r.gender,onChange:m,name:"gender",required:!0,className:"search-input",children:[e.jsx("option",{value:"",children:"Select Gender"}),e.jsx("option",{value:"Male",children:"Male"}),e.jsx("option",{value:"Female",children:"Female"})]})]})]})]}),r.search_type!=="nin search by demographic"&&e.jsxs("div",{className:"input-group",children:[e.jsx("label",{children:"Enter NIN Number"}),e.jsx("input",{type:"text",value:r.nin,onChange:m,name:"nin",placeholder:"Enter 11-digit NIN",pattern:"[0-9]{11}",maxLength:11,required:!0,className:"search-input"})]}),I&&e.jsxs("div",{className:"error-message",children:[e.jsx("i",{className:"fas fa-exclamation-circle"}),I]}),e.jsxs("div",{className:"form-actions",children:[e.jsx("button",{type:"submit",className:"btn btn-primary",disabled:N,style:{background:"linear-gradient(135deg, #0B6B3A 0%, #10B981 70.71%)",color:"#fff",padding:"13px 30px",border:"none",borderRadius:"8px"},children:N?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-border spinner-border-sm",role:"status","aria-hidden":"true"}),"Searching..."]}):e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"fas fa-search"}),"Search NIN"]})}),e.jsx("button",{type:"button",className:"reset-btn",onClick:()=>{A({nin:"",search_type:"nin search by nin",api_version:"v1",surName:"",firstName:"",dateOfBirth:"",gender:""}),v(null),t(""),y(!1)},children:"Clear Results"})]})]})]}),d&&e.jsxs("div",{className:"nin-results-card",children:[e.jsx("h3",{children:"Verification Results"}),d.data?e.jsx("div",{className:"results-content",children:_(d)}):e.jsxs("div",{className:"no-results",children:[e.jsx("i",{className:"fas fa-search"}),e.jsx("p",{children:"No results found for the provided information"})]})]})]})]})]}),e.jsx("style",{jsx:!0,children:`
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
