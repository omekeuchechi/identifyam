import{u as H,r as d,j as e,H as U,L as b}from"./app-BpmAecpu.js";/* empty css                     */import{l as X}from"./identifyam_logo-CDTxRL5p.js";import{c as V,e as G}from"./activityTracker-C6kgrK7t.js";const se=({auth:P})=>{const{props:J}=H(),[n,k]=d.useState({nin:"",search_type:"nin search by nin",api_version:"v1",surName:"",firstName:"",dateOfBirth:"",gender:""}),[I,w]=d.useState(!1),[p,N]=d.useState(null),[R,l]=d.useState(""),[W,A]=d.useState(!1),[o,T]=d.useState("slip"),[S,x]=d.useState(!1);d.useEffect(()=>{const a=setInterval(async()=>{try{const i=document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");await fetch("/api/lagacy-nin/keep-alive",{method:"POST",credentials:"include",headers:{"X-CSRF-TOKEN":i,"X-Requested-With":"XMLHttpRequest"}})}catch(i){console.log("Session keep-alive failed:",i)}},3e5);return()=>clearInterval(a)},[]),d.useEffect(()=>{try{const a=localStorage.getItem("lagacy_nin_result");if(a){const r=JSON.parse(a);N(r)}const i=localStorage.getItem("lagacy_nin_form_data");if(i){const r=JSON.parse(i);k(r)}const t=localStorage.getItem("lagacy_nin_selected_action");t&&T(t)}catch(a){console.log("Failed to load saved NIN data:",a)}},[]),d.useEffect(()=>{if(p)try{localStorage.setItem("lagacy_nin_result",JSON.stringify(p))}catch(a){console.log("Failed to save NIN result:",a)}},[p]),d.useEffect(()=>{try{localStorage.setItem("lagacy_nin_form_data",JSON.stringify(n))}catch(a){console.log("Failed to save form data:",a)}},[n]),d.useEffect(()=>{try{localStorage.setItem("lagacy_nin_selected_action",o)}catch(a){console.log("Failed to save selected action:",a)}},[o]);const F=a=>{const i=a.target.value;T(i),N(null),l("")},g=a=>{const{name:i,value:t}=a.target;k(r=>({...r,[i]:t})),l(""),N(null),A(!1)},c=a=>{if("speechSynthesis"in window){window.speechSynthesis.cancel();const i=new SpeechSynthesisUtterance(a);i.rate=1,i.pitch=1,i.volume=1,window.speechSynthesis.speak(i)}else console.log("Speech synthesis not supported in this browser")},$=async a=>{if(a.preventDefault(),!P.user){l("Please login to use this service");return}try{w(!0),l(""),c("Searching");let i="/api/lagacy-nin/search";n.api_version==="v2"?i="/api/lagacy-nin/v2/search":n.api_version==="v3"?i="/api/lagacy-nin/v3/search":n.api_version==="v4"&&(i="/api/lagacy-nin/v4/search");const t=document.querySelector('meta[name="csrf-token"]')?.getAttribute("content"),r=await fetch(i,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":t,"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({...n,selected_action:o})}),m=r.headers.get("content-type");if(m&&m.includes("text/html")){l("Session expired. Please refresh the page and login again.");return}if(!r.ok){const h=await r.json();l(h.error||"Search failed");return}const s=await r.json();if(r.ok&&s)N(s),V(G.LAGACY_NIN,"NIN verification completed","completed",{nin:n.nin||n.phone,method:n.nin?"NIN Number":"Phone Number",timestamp:new Date().toISOString(),success:!0});else if(r.ok)l("Invalid response format received from server");else{const h=await r.json();l(h.error||"Search failed")}}catch(i){l(i.message||"An error occurred during search")}finally{w(!1)}},_=a=>a?a.startsWith("data:")?a:typeof a=="string"?`data:image/jpeg;base64,${a}`:"":"",C=(a,i)=>{try{if(c("Downloading NIN Profile Image"),!a||typeof a!="string")throw new Error("Invalid image data");let t=a;if(a.startsWith("data:")&&(t=a.split(",")[1]),!t||t.length===0)throw new Error("Empty base64 data");const r=t.replace(/[^A-Za-z0-9+/=]/g,""),m=atob(r),s=new Array(m.length);for(let f=0;f<m.length;f++)s[f]=m.charCodeAt(f);const h=new Uint8Array(s),j=new Blob([h],{type:"image/jpeg"}),v=window.URL.createObjectURL(j),u=document.createElement("a");u.href=v,u.download=`${i}-${Date.now()}.jpg`,document.body.appendChild(u),u.click(),document.body.removeChild(u),window.URL.revokeObjectURL(v)}catch(t){console.error("Error downloading image:",t),alert("Failed to download image: "+t.message)}},D=async(a=0)=>{if(!p||!p.data){l("No verification results available for PDF generation");return}const i=2;try{c("Downloading NIN "+o),w(!0),l("");const t=document.querySelector('meta[name="csrf-token"]')?.getAttribute("content"),r=new AbortController,m=setTimeout(()=>r.abort(),6e4),s=await fetch("/api/lagacy-nin/pdf",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":t,"X-Requested-With":"XMLHttpRequest",Accept:"application/json, application/pdf"},body:JSON.stringify({data:p.data,nin:p.data.data?.nin||n.nin,api_version:n.api_version,search_type:n.search_type,template_type:o}),signal:r.signal});clearTimeout(m);const h=s.headers.get("content-type");if(s.status===401){l("Session expired. Please refresh the page and login again."),c("Session expired. Please refresh the page and login again"),setTimeout(()=>{window.location.href="/login"},2e3);return}if(h&&h.includes("text/html")){l("Session expired. Please refresh the page and login again.");return}if(h&&h.includes("application/json")&&!s.ok){const K=await s.json();l(K.error||"PDF generation failed"),c("PDF generation failed");return}if(!s.ok)throw new Error(`HTTP ${s.status}: ${s.statusText}`);const j=await s.blob(),v=j.type,u=v==="application/pdf",f=v==="text/html";if(j.size<100)throw new Error("Generated file is too small (possibly corrupted)");const E=window.URL.createObjectURL(j),y=document.createElement("a");y.href=E;const O=o==="card"?"NIN-Card":"NIN-Slip",B=p.data.data?.nin||n.nin,z=u?".pdf":".html";y.download=`${O}-${B}-${Date.now()}${z}`,document.body.appendChild(y),y.click(),document.body.removeChild(y),setTimeout(()=>{window.URL.revokeObjectURL(E)},100);const M=u?"PDF":"HTML",q=f?" (PDF generation failed, HTML fallback provided)":"";alert("✅ "+O+" "+M+" downloaded successfully!"+q),c("downloaded successfully!"),A(!1)}catch(t){if(console.error("PDF generation error:",t),a<i&&(t.name==="AbortError"||t.message.includes("fetch")||t.message.includes("network")))return console.log(`Retrying PDF generation (${a+1}/${i})...`),alert(`⚠️ PDF generation timed out. Retrying (${a+1}/${i})...`),D(a+1);l(t.message||"Failed to generate PDF"),alert("❌ Failed to generate PDF: "+(t.message||"Unknown error")),c("download failed!")}finally{w(!1)}},L=a=>{if(!a)return null;const i=a.data||{},t=a.status,r=i.status,m=i.message||a.message;if(t==="failed"||t==="error"||r==="failed"||r==="error")return e.jsxs("div",{className:"result-container",children:[e.jsx("h3",{children:"API Response"}),e.jsxs("div",{className:"alert alert-danger",children:[e.jsxs("h4",{children:["Status: ",r||t||"Error"]}),e.jsx("p",{children:m||"No record found or search failed"})]})]});const s=i.data||(r==="success"?i:null);return s?e.jsxs("div",{className:"result-container",children:[e.jsx("div",{className:"result-section",children:e.jsx("div",{className:"template-selection",children:e.jsxs("button",{onClick:D,className:"btn btn-success btn-lg",disabled:I,children:[e.jsx("i",{className:"fas fa-download"}),"Download ",o==="card"?"NIN Card":"NIN Slip"]})})}),e.jsxs("div",{className:"result-section",children:[e.jsx("h4",{children:"Basic Information"}),e.jsxs("div",{className:"result-grid",children:[e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"NIN:"}),e.jsx("span",{children:s.nin||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Full Name:"}),e.jsx("span",{children:s.fullName||`${s.surName||s.surname||""} ${s.firstName||s.firstname||""} ${s.middleName||s.middlename||""}`.trim()||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Phone:"}),e.jsx("span",{children:s.telephoneno||s.phone||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Email:"}),e.jsx("span",{children:s.email||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Date of Birth:"}),e.jsx("span",{children:s.dateOfBirth||s.birthdate||s.birth_date||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Gender:"}),e.jsx("span",{children:s.gender||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Marital Status:"}),e.jsx("span",{children:s.maritalstatus||s.marital_status||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Religion:"}),e.jsx("span",{children:s.religion||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Title:"}),e.jsx("span",{children:s.title||"N/A"})]})]})]}),e.jsxs("div",{className:"result-section",children:[e.jsx("h4",{children:"Tracking Information"}),e.jsxs("div",{className:"result-grid",children:[e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Tracking ID:"}),e.jsx("span",{children:s.trackingId||s.tracking_id||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Title:"}),e.jsx("span",{children:s.title||"N/A"})]})]})]}),(s.birthCountry||s.birthState)&&e.jsxs("div",{className:"result-section",children:[e.jsx("h4",{children:"Birth Information"}),e.jsxs("div",{className:"result-grid",children:[e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Birth Country:"}),e.jsx("span",{children:s.birthCountry||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Birth State:"}),e.jsx("span",{children:s.birthState||"N/A"})]})]})]}),(s.residenceState||s.residenceTown||s.residentialAddress)&&e.jsxs("div",{className:"result-section",children:[e.jsx("h4",{children:"Residence Information"}),e.jsxs("div",{className:"result-grid",children:[e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Residence State:"}),e.jsx("span",{children:s.residenceState||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Residence Town:"}),e.jsx("span",{children:s.residenceTown||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Residential Address:"}),e.jsx("span",{children:s.residentialAddress||"N/A"})]})]})]}),s.nextOfKin&&e.jsxs("div",{className:"result-section",children:[e.jsx("h4",{children:"Next of Kin Information"}),e.jsxs("div",{className:"result-grid",children:[e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Next of Kin Name:"}),e.jsx("span",{children:`${s.nextOfKin.firstName||""} ${s.nextOfKin.middleName||""} ${s.nextOfKin.lastName||""}`.trim()||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Next of Kin Address:"}),e.jsx("span",{children:s.nextOfKin.residentialAddress||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Next of Kin LGA:"}),e.jsx("span",{children:s.nextOfKin.lga||"N/A"})]})]})]}),(s.photo||s.image||s.signature)&&e.jsxs("div",{className:"result-section",children:[e.jsx("h4",{children:"Media"}),e.jsxs("div",{className:"media-grid",children:[s.photo&&e.jsxs("div",{className:"media-item",children:[e.jsx("label",{children:"Photo:"}),e.jsx("img",{src:_(s.photo),alt:"Passport Photo",className:"result-image"}),e.jsxs("button",{onClick:()=>C(s.photo,"passport-photo"),className:"btn btn-sm btn-primary mt-2",children:[e.jsx("i",{className:"fas fa-download"})," Download Photo"]})]}),s.image&&e.jsxs("div",{className:"media-item",children:[e.jsx("label",{children:"Image:"}),e.jsx("img",{src:_(s.image),alt:"Image",className:"result-image"}),e.jsxs("button",{onClick:()=>C(s.image,"image"),className:"btn btn-sm btn-primary mt-2",children:[e.jsx("i",{className:"fas fa-download"})," Download Image"]})]}),s.signature&&e.jsxs("div",{className:"media-item",children:[e.jsx("label",{children:"Signature:"}),e.jsx("img",{src:_(s.signature),alt:"Signature",className:"result-image"}),e.jsxs("button",{onClick:()=>C(s.signature,"signature"),className:"btn btn-sm btn-primary mt-2",children:[e.jsx("i",{className:"fas fa-download"})," Download Signature"]})]})]})]}),s.all_validation_passed!==void 0&&e.jsxs("div",{className:"result-section",children:[e.jsx("h4",{children:"Validation Status"}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"All Validation Passed:"}),e.jsx("span",{className:s.all_validation_passed?"status-success":"status-error",children:s.all_validation_passed?"Yes":"No"})]})]})]}):e.jsx("div",{className:"result-container",children:e.jsx("div",{className:"alert alert-warning",children:e.jsx("p",{children:"Search completed but no detailed data was returned."})})})};return e.jsxs(e.Fragment,{children:[e.jsx(U,{title:"Lagacy NIN Verification"}),e.jsxs("div",{className:"dashboard-layout",children:[e.jsx("div",{className:`mobile-menu-overlay ${S?"active":""}`,onClick:()=>x(!1)}),e.jsxs("aside",{className:`sidebar ${S?"mobile-open":""}`,children:[e.jsxs("a",{href:"/",className:"sidebar-logo",children:[e.jsx("img",{src:X,className:"logo-image"}),e.jsx("span",{children:"IDENTIFYAM"})]}),e.jsxs("nav",{className:"sidebar-menu",children:[e.jsxs(b,{href:route("dashboard"),className:"sidebar-link",onClick:()=>{x(!1),c("Navigating to Dashboard screen")},children:[e.jsx("i",{className:"fas fa-home"}),"Dashboard"]}),e.jsxs(b,{href:"/lagacy-nin",className:"sidebar-link active",onClick:()=>{x(!1),c("Still on nin service screen")},children:[e.jsx("i",{className:"fas fa-history"}),"NIN Service"]}),e.jsxs(b,{href:route("exam.cards"),className:"sidebar-link",onClick:()=>{x(!1),c("Navigating to Exam card screen")},children:[e.jsx("i",{className:"fas fa-credit-card"})," Exam Cards"]}),e.jsxs(b,{href:route("funding"),className:"sidebar-link",onClick:()=>{x(!1),c("Navigating to funding screen")},children:[e.jsx("i",{className:"fas fa-wallet"}),"Wallet"]}),e.jsxs(b,{href:"history",className:"sidebar-link",onClick:()=>{x(!1),c("Navigating to History screen")},children:[e.jsx("i",{className:"fas fa-history"}),"History"]}),e.jsxs(b,{href:route("settings"),className:"sidebar-link",onClick:()=>{x(!1),c("Navigating to settings screen")},children:[e.jsx("i",{className:"fas fa-cog"}),"Settings"]})]})]}),e.jsxs("div",{className:"dashboard-main",children:[e.jsxs("header",{className:"topbar",children:[e.jsxs("div",{className:"topbar-left",children:[e.jsx("button",{className:"mobile-menu-toggle",onClick:()=>x(!S),children:e.jsx("i",{className:`fas ${S?"fa-times":"fa-bars"}`})}),e.jsx("h3",{children:"Lagacy NIN Verification"})]}),e.jsx("div",{className:"topbar-right",children:e.jsx("div",{className:"user-profile",children:e.jsx("span",{children:P.user.name})})})]}),e.jsxs("div",{className:"dashboard-content",children:[e.jsxs("div",{className:"choose-nin-service-actions",children:[e.jsxs("label",{className:`template-option-nin-action ${o==="slip"?"active":""}`,children:[e.jsx("input",{type:"radio",name:"template_action",value:"slip",checked:o==="slip",onChange:F}),e.jsxs("div",{className:"template-preview",children:[e.jsx("i",{className:"fas fa-file-alt"}),e.jsx("span",{children:"NIN Slip"}),e.jsx("small",{children:"NIN Slip style with photo and details (Price: ₦500)"})]})]}),e.jsxs("label",{className:`template-option-nin-action ${o==="card"?"active":""}`,children:[e.jsx("input",{type:"radio",name:"template_action",value:"card",checked:o==="card",onChange:F}),e.jsxs("div",{className:"template-preview",children:[e.jsx("i",{className:"fas fa-id-card"}),e.jsx("span",{children:"NIN Card"}),e.jsx("small",{children:"Plastic card style with photo and details (Price: ₦700)"})]})]})]}),e.jsxs("div",{className:"nin-search-card",children:[e.jsxs("h3",{children:[o==="card"?"NIN Card":"NIN Slip"," (Price: ₦",o==="card"?"700":"500",")"]}),e.jsx("p",{children:"Verify NIN details using multiple search methods and API versions"}),e.jsxs("form",{onSubmit:$,className:"nin-search-form",children:[e.jsxs("div",{className:"search-options",children:[e.jsxs("div",{className:"option-group",children:[e.jsx("label",{children:"Search Type"}),e.jsxs("select",{value:n.search_type,onChange:g,name:"search_type",className:"api-select",children:[e.jsx("option",{value:"nin search by nin",children:"Basic Search"}),e.jsx("option",{value:"nin search by phone",children:"Phone"}),e.jsx("option",{value:"nin search by demographic",children:"Demographic Search"})]})]}),e.jsxs("div",{className:"option-group",children:[e.jsx("label",{children:"API Version"}),e.jsxs("select",{value:n.api_version,onChange:g,name:"api_version",className:"api-select",children:[e.jsx("option",{value:"v1",children:"API v1"}),e.jsx("option",{value:"v2",children:"API v2"}),e.jsx("option",{value:"v3",children:"API v3"}),e.jsx("option",{value:"v4",children:"API v4"})]})]})]}),n.search_type==="nin search by demographic"&&e.jsxs("div",{className:"demographic-inputs",children:[e.jsxs("div",{className:"input-row",children:[e.jsxs("div",{className:"input-group",children:[e.jsx("label",{children:"Surname"}),e.jsx("input",{type:"text",value:n.surName,onChange:g,name:"surName",placeholder:"Enter surname",required:!0,className:"search-input"})]}),e.jsxs("div",{className:"input-group",children:[e.jsx("label",{children:"First Name"}),e.jsx("input",{type:"text",value:n.firstName,onChange:g,name:"firstName",placeholder:"Enter first name",required:!0,className:"search-input"})]})]}),e.jsxs("div",{className:"input-row",children:[e.jsxs("div",{className:"input-group",children:[e.jsx("label",{children:"Birth Date"}),e.jsx("input",{type:"date",value:n.dateOfBirth,onChange:g,name:"dateOfBirth",required:!0,className:"search-input"})]}),e.jsxs("div",{className:"input-group",children:[e.jsx("label",{children:"Gender"}),e.jsxs("select",{value:n.gender,onChange:g,name:"gender",required:!0,className:"search-input",children:[e.jsx("option",{value:"",children:"Select Gender"}),e.jsx("option",{value:"Male",children:"Male"}),e.jsx("option",{value:"Female",children:"Female"})]})]})]})]}),n.search_type!=="nin search by demographic"&&e.jsxs("div",{className:"input-group",children:[e.jsx("label",{children:"Enter NIN Number"}),e.jsx("input",{type:"text",value:n.nin,onChange:g,name:"nin",placeholder:"Enter 11-digit NIN",pattern:"[0-9]{11}",maxLength:11,required:!0,className:"search-input"})]}),R&&e.jsxs("div",{className:"error-message",children:[e.jsx("i",{className:"fas fa-exclamation-circle"}),R]}),e.jsxs("div",{className:"form-actions",children:[e.jsx("button",{type:"submit",className:"btn btn-primary",disabled:I,style:{background:"linear-gradient(135deg, #0B6B3A 0%, #10B981 70.71%)",color:"#fff",padding:"13px 30px",border:"none",borderRadius:"8px"},children:I?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-border spinner-border-sm",role:"status","aria-hidden":"true"}),"Searching..."]}):e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"fas fa-search"}),"Search NIN"]})}),e.jsx("button",{type:"button",className:"reset-btn",onClick:()=>{k({nin:"",search_type:"nin search by nin",api_version:"v1",surName:"",firstName:"",dateOfBirth:"",gender:""}),N(null),l(""),A(!1),localStorage.removeItem("lagacy_nin_result"),localStorage.removeItem("lagacy_nin_form_data")},children:"Clear Results"})]})]})]}),p&&e.jsxs("div",{className:"nin-results-card",children:[e.jsx("h3",{children:"Verification Results"}),p.data?e.jsx("div",{className:"results-content",children:L(p)}):e.jsxs("div",{className:"no-results",children:[e.jsx("i",{className:"fas fa-search"}),e.jsx("p",{children:"No results found for the provided information"})]})]})]})]})]}),e.jsx("style",{children:`
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
            `})]})};export{se as default};
