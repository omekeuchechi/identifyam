import{u as z,r as u,j as e,H as M,L as N}from"./app-6MZEwRUJ.js";/* empty css                     */import{l as q}from"./identifyam_logo-CDTxRL5p.js";import{c as K,e as H}from"./activityTracker-C6kgrK7t.js";const J=({auth:C})=>{const{props:U}=z(),[r,P]=u.useState({nin:"",search_type:"nin search by nin",api_version:"v1",surName:"",firstName:"",dateOfBirth:"",gender:""}),[k,j]=u.useState(!1),[p,v]=u.useState(null),[T,l]=u.useState(""),[X,S]=u.useState(!1),[d,R]=u.useState("slip"),[y,h]=u.useState(!1);u.useEffect(()=>{const i=setInterval(async()=>{try{const a=document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");await fetch("/api/lagacy-nin/keep-alive",{method:"POST",credentials:"include",headers:{"X-CSRF-TOKEN":a,"X-Requested-With":"XMLHttpRequest"}})}catch(a){console.log("Session keep-alive failed:",a)}},3e5);return()=>clearInterval(i)},[]);const _=i=>{const a=i.target.value;R(a),v(null),l("")},g=i=>{const{name:a,value:n}=i.target;P(t=>({...t,[a]:n})),l(""),v(null),S(!1)},o=i=>{if("speechSynthesis"in window){window.speechSynthesis.cancel();const a=new SpeechSynthesisUtterance(i);a.rate=1,a.pitch=1,a.volume=1,window.speechSynthesis.speak(a)}else console.log("Speech synthesis not supported in this browser")},D=async i=>{if(i.preventDefault(),!C.user){l("Please login to use this service");return}try{j(!0),l(""),o("Searching");let a="/api/lagacy-nin/search";r.api_version==="v2"?a="/api/lagacy-nin/v2/search":r.api_version==="v3"?a="/api/lagacy-nin/v3/search":r.api_version==="v4"&&(a="/api/lagacy-nin/v4/search");const n=document.querySelector('meta[name="csrf-token"]')?.getAttribute("content"),t=await fetch(a,{method:"POST",credentials:"include",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":n,"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({...r,selected_action:d})}),c=t.headers.get("content-type");if(c&&c.includes("text/html")){l("Session expired. Please refresh the page and login again.");return}if(!t.ok){const f=await t.json();l(f.error||"Search failed");return}const s=await t.json();if(t.ok&&s)v(s),K(H.LAGACY_NIN,"NIN verification completed","completed",{nin:r.nin||r.phone,method:r.nin?"NIN Number":"Phone Number",timestamp:new Date().toISOString(),success:!0});else if(t.ok)l("Invalid response format received from server");else{const f=await t.json();l(f.error||"Search failed")}}catch(a){l(a.message||"An error occurred during search")}finally{j(!1)}},A=i=>i?i.startsWith("data:")?i:typeof i=="string"?`data:image/jpeg;base64,${i}`:"":"",I=(i,a)=>{try{if(o("Downloading NIN Profile Image"),!i||typeof i!="string")throw new Error("Invalid image data");let n=i;if(i.startsWith("data:")&&(n=i.split(",")[1]),!n||n.length===0)throw new Error("Empty base64 data");const t=n.replace(/[^A-Za-z0-9+/=]/g,""),c=atob(t),s=new Array(c.length);for(let b=0;b<c.length;b++)s[b]=c.charCodeAt(b);const f=new Uint8Array(s),w=new Blob([f],{type:"image/jpeg"}),m=window.URL.createObjectURL(w),x=document.createElement("a");x.href=m,x.download=`${a}-${Date.now()}.jpg`,document.body.appendChild(x),x.click(),document.body.removeChild(x),window.URL.revokeObjectURL(m)}catch(n){console.error("Error downloading image:",n),alert("Failed to download image: "+n.message)}},E=async()=>{if(!p||!p.data){l("No verification results available for PDF generation");return}try{o("Downloading NIN "+d),j(!0),l("");const i=document.querySelector('meta[name="csrf-token"]')?.getAttribute("content"),a=await fetch("/api/lagacy-nin/pdf",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":i,"X-Requested-With":"XMLHttpRequest",Accept:"application/json, application/pdf"},body:JSON.stringify({data:p.data,nin:p.data.data?.nin||r.nin,api_version:r.api_version,search_type:r.search_type,template_type:d})}),n=a.headers.get("content-type");if(a.status===401){l("Session expired. Please refresh the page and login again."),o("Session expired. Please refresh the page and login again"),setTimeout(()=>{window.location.href="/login"},2e3);return}if(n&&n.includes("text/html")){l("Session expired. Please refresh the page and login again.");return}if(n&&n.includes("application/json")&&!a.ok){const B=await a.json();l(B.error||"PDF generation failed"),o("PDF generation failed");return}if(!a.ok)throw new Error(`HTTP ${a.status}: ${a.statusText}`);const t=await a.blob(),c=t.type,s=c==="application/pdf",f=c==="text/html";if(t.size<100)throw new Error("Generated file is too small (possibly corrupted)");const w=window.URL.createObjectURL(t),m=document.createElement("a");m.href=w;const x=d==="card"?"NIN-Card":"NIN-Slip",b=p.data.data?.nin||r.nin,F=s?".pdf":".html";m.download=`${x}-${b}-${Date.now()}${F}`,document.body.appendChild(m),m.click(),document.body.removeChild(m),setTimeout(()=>{window.URL.revokeObjectURL(w)},100);const L=s?"PDF":"HTML",$=f?" (PDF generation failed, HTML fallback provided)":"";alert("✅ "+x+" "+L+" downloaded successfully!"+$),o("downloaded successfully!"),S(!1)}catch(i){console.error("PDF generation error:",i),l(i.message||"Failed to generate PDF"),alert("❌ Failed to generate PDF: "+(i.message||"Unknown error")),o("downloaded successfully!")}finally{j(!1)}},O=i=>{if(!i)return null;const a=i.data||{},n=i.status,t=a.status,c=a.message||i.message;if(n==="failed"||n==="error"||t==="failed"||t==="error")return e.jsxs("div",{className:"result-container",children:[e.jsx("h3",{children:"API Response"}),e.jsxs("div",{className:"alert alert-danger",children:[e.jsxs("h4",{children:["Status: ",t||n||"Error"]}),e.jsx("p",{children:c||"No record found or search failed"})]})]});const s=a.data||(t==="success"?a:null);return s?e.jsxs("div",{className:"result-container",children:[e.jsx("div",{className:"result-section",children:e.jsx("div",{className:"template-selection",children:e.jsxs("button",{onClick:E,className:"btn btn-success btn-lg",disabled:k,children:[e.jsx("i",{className:"fas fa-download"}),"Download ",d==="card"?"NIN Card":"NIN Slip"]})})}),e.jsxs("div",{className:"result-section",children:[e.jsx("h4",{children:"Basic Information"}),e.jsxs("div",{className:"result-grid",children:[e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"NIN:"}),e.jsx("span",{children:s.nin||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Full Name:"}),e.jsx("span",{children:s.fullName||`${s.surName||s.surname||""} ${s.firstName||s.firstname||""} ${s.middleName||s.middlename||""}`.trim()||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Phone:"}),e.jsx("span",{children:s.telephoneno||s.phone||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Email:"}),e.jsx("span",{children:s.email||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Date of Birth:"}),e.jsx("span",{children:s.dateOfBirth||s.birthdate||s.birth_date||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Gender:"}),e.jsx("span",{children:s.gender||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Marital Status:"}),e.jsx("span",{children:s.maritalstatus||s.marital_status||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Religion:"}),e.jsx("span",{children:s.religion||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Title:"}),e.jsx("span",{children:s.title||"N/A"})]})]})]}),e.jsxs("div",{className:"result-section",children:[e.jsx("h4",{children:"Tracking Information"}),e.jsxs("div",{className:"result-grid",children:[e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Tracking ID:"}),e.jsx("span",{children:s.trackingId||s.tracking_id||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Title:"}),e.jsx("span",{children:s.title||"N/A"})]})]})]}),(s.birthCountry||s.birthState)&&e.jsxs("div",{className:"result-section",children:[e.jsx("h4",{children:"Birth Information"}),e.jsxs("div",{className:"result-grid",children:[e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Birth Country:"}),e.jsx("span",{children:s.birthCountry||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Birth State:"}),e.jsx("span",{children:s.birthState||"N/A"})]})]})]}),(s.residenceState||s.residenceTown||s.residentialAddress)&&e.jsxs("div",{className:"result-section",children:[e.jsx("h4",{children:"Residence Information"}),e.jsxs("div",{className:"result-grid",children:[e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Residence State:"}),e.jsx("span",{children:s.residenceState||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Residence Town:"}),e.jsx("span",{children:s.residenceTown||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Residential Address:"}),e.jsx("span",{children:s.residentialAddress||"N/A"})]})]})]}),s.nextOfKin&&e.jsxs("div",{className:"result-section",children:[e.jsx("h4",{children:"Next of Kin Information"}),e.jsxs("div",{className:"result-grid",children:[e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Next of Kin Name:"}),e.jsx("span",{children:`${s.nextOfKin.firstName||""} ${s.nextOfKin.middleName||""} ${s.nextOfKin.lastName||""}`.trim()||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Next of Kin Address:"}),e.jsx("span",{children:s.nextOfKin.residentialAddress||"N/A"})]}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"Next of Kin LGA:"}),e.jsx("span",{children:s.nextOfKin.lga||"N/A"})]})]})]}),(s.photo||s.image||s.signature)&&e.jsxs("div",{className:"result-section",children:[e.jsx("h4",{children:"Media"}),e.jsxs("div",{className:"media-grid",children:[s.photo&&e.jsxs("div",{className:"media-item",children:[e.jsx("label",{children:"Photo:"}),e.jsx("img",{src:A(s.photo),alt:"Passport Photo",className:"result-image"}),e.jsxs("button",{onClick:()=>I(s.photo,"passport-photo"),className:"btn btn-sm btn-primary mt-2",children:[e.jsx("i",{className:"fas fa-download"})," Download Photo"]})]}),s.image&&e.jsxs("div",{className:"media-item",children:[e.jsx("label",{children:"Image:"}),e.jsx("img",{src:A(s.image),alt:"Image",className:"result-image"}),e.jsxs("button",{onClick:()=>I(s.image,"image"),className:"btn btn-sm btn-primary mt-2",children:[e.jsx("i",{className:"fas fa-download"})," Download Image"]})]}),s.signature&&e.jsxs("div",{className:"media-item",children:[e.jsx("label",{children:"Signature:"}),e.jsx("img",{src:A(s.signature),alt:"Signature",className:"result-image"}),e.jsxs("button",{onClick:()=>I(s.signature,"signature"),className:"btn btn-sm btn-primary mt-2",children:[e.jsx("i",{className:"fas fa-download"})," Download Signature"]})]})]})]}),s.all_validation_passed!==void 0&&e.jsxs("div",{className:"result-section",children:[e.jsx("h4",{children:"Validation Status"}),e.jsxs("div",{className:"result-item",children:[e.jsx("label",{children:"All Validation Passed:"}),e.jsx("span",{className:s.all_validation_passed?"status-success":"status-error",children:s.all_validation_passed?"Yes":"No"})]})]})]}):e.jsx("div",{className:"result-container",children:e.jsx("div",{className:"alert alert-warning",children:e.jsx("p",{children:"Search completed but no detailed data was returned."})})})};return e.jsxs(e.Fragment,{children:[e.jsx(M,{title:"Lagacy NIN Verification"}),e.jsxs("div",{className:"dashboard-layout",children:[e.jsx("div",{className:`mobile-menu-overlay ${y?"active":""}`,onClick:()=>h(!1)}),e.jsxs("aside",{className:`sidebar ${y?"mobile-open":""}`,children:[e.jsxs("a",{href:"/",className:"sidebar-logo",children:[e.jsx("img",{src:q,className:"logo-image"}),e.jsx("span",{children:"IDENTIFYAM"})]}),e.jsxs("nav",{className:"sidebar-menu",children:[e.jsxs(N,{href:route("dashboard"),className:"sidebar-link",onClick:()=>{h(!1),o("Navigating to Dashboard screen")},children:[e.jsx("i",{className:"fas fa-home"}),"Dashboard"]}),e.jsxs(N,{href:"/lagacy-nin",className:"sidebar-link active",onClick:()=>{h(!1),o("Still on nin service screen")},children:[e.jsx("i",{className:"fas fa-history"}),"NIN Service"]}),e.jsxs(N,{href:route("exam.cards"),className:"sidebar-link",onClick:()=>{h(!1),o("Navigating to Exam card screen")},children:[e.jsx("i",{className:"fas fa-credit-card"})," Exam Cards"]}),e.jsxs(N,{href:route("funding"),className:"sidebar-link",onClick:()=>{h(!1),o("Navigating to funding screen")},children:[e.jsx("i",{className:"fas fa-wallet"}),"Wallet"]}),e.jsxs(N,{href:"history",className:"sidebar-link",onClick:()=>{h(!1),o("Navigating to History screen")},children:[e.jsx("i",{className:"fas fa-history"}),"History"]}),e.jsxs(N,{href:route("settings"),className:"sidebar-link",onClick:()=>{h(!1),o("Navigating to settings screen")},children:[e.jsx("i",{className:"fas fa-cog"}),"Settings"]})]})]}),e.jsxs("div",{className:"dashboard-main",children:[e.jsxs("header",{className:"topbar",children:[e.jsxs("div",{className:"topbar-left",children:[e.jsx("button",{className:"mobile-menu-toggle",onClick:()=>h(!y),children:e.jsx("i",{className:`fas ${y?"fa-times":"fa-bars"}`})}),e.jsx("h3",{children:"Lagacy NIN Verification"})]}),e.jsx("div",{className:"topbar-right",children:e.jsx("div",{className:"user-profile",children:e.jsx("span",{children:C.user.name})})})]}),e.jsxs("div",{className:"dashboard-content",children:[e.jsxs("div",{className:"choose-nin-service-actions",children:[e.jsxs("label",{className:`template-option-nin-action ${d==="slip"?"active":""}`,children:[e.jsx("input",{type:"radio",name:"template_action",value:"slip",checked:d==="slip",onChange:_}),e.jsxs("div",{className:"template-preview",children:[e.jsx("i",{className:"fas fa-file-alt"}),e.jsx("span",{children:"NIN Slip"}),e.jsx("small",{children:"NIN Slip style with photo and details (Price: ₦500)"})]})]}),e.jsxs("label",{className:`template-option-nin-action ${d==="card"?"active":""}`,children:[e.jsx("input",{type:"radio",name:"template_action",value:"card",checked:d==="card",onChange:_}),e.jsxs("div",{className:"template-preview",children:[e.jsx("i",{className:"fas fa-id-card"}),e.jsx("span",{children:"NIN Card"}),e.jsx("small",{children:"Plastic card style with photo and details (Price: ₦700)"})]})]})]}),e.jsxs("div",{className:"nin-search-card",children:[e.jsxs("h3",{children:[d==="card"?"NIN Card":"NIN Slip"," (Price: ₦",d==="card"?"700":"500",")"]}),e.jsx("p",{children:"Verify NIN details using multiple search methods and API versions"}),e.jsxs("form",{onSubmit:D,className:"nin-search-form",children:[e.jsxs("div",{className:"search-options",children:[e.jsxs("div",{className:"option-group",children:[e.jsx("label",{children:"Search Type"}),e.jsxs("select",{value:r.search_type,onChange:g,name:"search_type",className:"api-select",children:[e.jsx("option",{value:"nin search by nin",children:"Basic Search"}),e.jsx("option",{value:"nin search by phone",children:"Phone"}),e.jsx("option",{value:"nin search by demographic",children:"Demographic Search"})]})]}),e.jsxs("div",{className:"option-group",children:[e.jsx("label",{children:"API Version"}),e.jsxs("select",{value:r.api_version,onChange:g,name:"api_version",className:"api-select",children:[e.jsx("option",{value:"v1",children:"API v1"}),e.jsx("option",{value:"v2",children:"API v2"}),e.jsx("option",{value:"v3",children:"API v3"}),e.jsx("option",{value:"v4",children:"API v4"})]})]})]}),r.search_type==="nin search by demographic"&&e.jsxs("div",{className:"demographic-inputs",children:[e.jsxs("div",{className:"input-row",children:[e.jsxs("div",{className:"input-group",children:[e.jsx("label",{children:"Surname"}),e.jsx("input",{type:"text",value:r.surName,onChange:g,name:"surName",placeholder:"Enter surname",required:!0,className:"search-input"})]}),e.jsxs("div",{className:"input-group",children:[e.jsx("label",{children:"First Name"}),e.jsx("input",{type:"text",value:r.firstName,onChange:g,name:"firstName",placeholder:"Enter first name",required:!0,className:"search-input"})]})]}),e.jsxs("div",{className:"input-row",children:[e.jsxs("div",{className:"input-group",children:[e.jsx("label",{children:"Birth Date"}),e.jsx("input",{type:"date",value:r.dateOfBirth,onChange:g,name:"dateOfBirth",required:!0,className:"search-input"})]}),e.jsxs("div",{className:"input-group",children:[e.jsx("label",{children:"Gender"}),e.jsxs("select",{value:r.gender,onChange:g,name:"gender",required:!0,className:"search-input",children:[e.jsx("option",{value:"",children:"Select Gender"}),e.jsx("option",{value:"Male",children:"Male"}),e.jsx("option",{value:"Female",children:"Female"})]})]})]})]}),r.search_type!=="nin search by demographic"&&e.jsxs("div",{className:"input-group",children:[e.jsx("label",{children:"Enter NIN Number"}),e.jsx("input",{type:"text",value:r.nin,onChange:g,name:"nin",placeholder:"Enter 11-digit NIN",pattern:"[0-9]{11}",maxLength:11,required:!0,className:"search-input"})]}),T&&e.jsxs("div",{className:"error-message",children:[e.jsx("i",{className:"fas fa-exclamation-circle"}),T]}),e.jsxs("div",{className:"form-actions",children:[e.jsx("button",{type:"submit",className:"btn btn-primary",disabled:k,style:{background:"linear-gradient(135deg, #0B6B3A 0%, #10B981 70.71%)",color:"#fff",padding:"13px 30px",border:"none",borderRadius:"8px"},children:k?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-border spinner-border-sm",role:"status","aria-hidden":"true"}),"Searching..."]}):e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"fas fa-search"}),"Search NIN"]})}),e.jsx("button",{type:"button",className:"reset-btn",onClick:()=>{P({nin:"",search_type:"nin search by nin",api_version:"v1",surName:"",firstName:"",dateOfBirth:"",gender:""}),v(null),l(""),S(!1)},children:"Clear Results"})]})]})]}),p&&e.jsxs("div",{className:"nin-results-card",children:[e.jsx("h3",{children:"Verification Results"}),p.data?e.jsx("div",{className:"results-content",children:O(p)}):e.jsxs("div",{className:"no-results",children:[e.jsx("i",{className:"fas fa-search"}),e.jsx("p",{children:"No results found for the provided information"})]})]})]})]})]}),e.jsx("style",{children:`
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
            `})]})};export{J as default};
