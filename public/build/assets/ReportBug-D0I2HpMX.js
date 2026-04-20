import{a as x,r as u,j as e,H as h}from"./app-BjAYIsIy.js";import{l as g,d as f}from"./user_profile-B7T53hqi.js";function N({auth:t}){const{data:a,setData:i,post:c,processing:o,errors:r,reset:n,wasSuccessful:d}=x({title:"",description:"",category:"bug",priority:"medium",browser:"",user_agent:navigator.userAgent,reproduction_steps:""}),[m,l]=u.useState(!1),p=s=>{s.preventDefault(),c(route("report.bug.submit"),{onSuccess:()=>{l(!0),n(),setTimeout(()=>l(!1),5e3)}})};return e.jsxs(e.Fragment,{children:[e.jsx(h,{title:"Report Bug"}),e.jsxs("div",{className:"dashboard-layout",children:[e.jsxs("aside",{className:"sidebar",children:[e.jsxs("a",{href:"/",className:"sidebar-logo",children:[e.jsx("div",{className:"logo-image",children:e.jsx("img",{src:g,alt:""})}),e.jsx("span",{children:"IDENTIFYAM"})]}),e.jsxs("nav",{className:"sidebar-menu",children:[e.jsxs("a",{href:route("dashboard"),children:[e.jsx("i",{className:"fas fa-home"}),"Dashboard"]}),e.jsxs("a",{href:"lagacy-nin",children:[e.jsx("i",{className:"fas fa-id-card"})," NIN Services"]}),e.jsxs("a",{href:route("exam.cards"),children:[e.jsx("i",{className:"fas fa-credit-card"})," Exam Cards"]}),e.jsxs("a",{children:[e.jsx("i",{className:"fas fa-building"})," CAC Registration"]}),e.jsxs("a",{children:[e.jsx("i",{className:"fas fa-graduation-cap"})," Study Abroad"]}),e.jsxs("a",{href:route("funding"),children:[e.jsx("i",{className:"fas fa-wallet"})," Wallet"]}),e.jsxs("a",{children:[e.jsx("i",{className:"fas fa-history"})," History"]}),e.jsxs("a",{href:route("settings"),children:[e.jsx("i",{className:"fas fa-cog"})," Settings"]})]})]}),e.jsxs("div",{className:"dashboard-main",children:[e.jsxs("header",{className:"topbar",children:[e.jsx("h3",{children:"Report Bug"}),e.jsxs("div",{className:"topbar-right",children:[e.jsx("span",{className:"notification",children:e.jsx("i",{className:"fas fa-bell"})}),e.jsxs("div",{className:"user-profile",children:[e.jsx("img",{src:f,alt:"avatar"}),e.jsx("span",{children:t.user.name})]})]})]}),e.jsxs("div",{className:"dashboard-content",children:[e.jsxs("div",{className:"welcome",children:[e.jsx("h1",{children:"Report a Bug"}),e.jsx("p",{children:"Help us improve your experience by reporting any issues you encounter while using our platform"})]}),(m||d)&&e.jsxs("div",{className:"success-message",style:{backgroundColor:"#10b981",color:"white",padding:"16px",borderRadius:"8px",marginBottom:"24px",display:"flex",alignItems:"center",gap:"12px"},children:[e.jsx("i",{className:"fas fa-check-circle",style:{fontSize:"20px"}}),e.jsxs("div",{children:[e.jsx("strong",{children:"Success!"})," Bug report submitted successfully! We will investigate and resolve it soon."]})]}),e.jsx("div",{className:"bug-report-form",style:{backgroundColor:"white",borderRadius:"12px",padding:"32px",boxShadow:"0 4px 6px rgba(0, 0, 0, 0.1)"},children:e.jsxs("form",{onSubmit:p,className:"space-y-6",children:[e.jsxs("div",{className:"form-row",children:[e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"title",className:"form-label",children:["Title ",e.jsx("span",{className:"required",children:"*"})]}),e.jsx("input",{type:"text",id:"title",value:a.title,onChange:s=>i("title",s.target.value),className:"form-input",maxLength:"255",placeholder:"Brief description of the issue",required:!0}),r.title&&e.jsx("p",{className:"error-message",children:r.title})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"category",className:"form-label",children:["Category ",e.jsx("span",{className:"required",children:"*"})]}),e.jsxs("select",{id:"category",value:a.category,onChange:s=>i("category",s.target.value),className:"form-select",required:!0,children:[e.jsx("option",{value:"bug",children:"🐛 Bug"}),e.jsx("option",{value:"feature",children:"✨ Feature Request"}),e.jsx("option",{value:"other",children:"📋 Other"})]}),r.category&&e.jsx("p",{className:"error-message",children:r.category})]})]}),e.jsxs("div",{className:"form-row",children:[e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"priority",className:"form-label",children:["Priority ",e.jsx("span",{className:"required",children:"*"})]}),e.jsxs("select",{id:"priority",value:a.priority,onChange:s=>i("priority",s.target.value),className:"form-select",required:!0,children:[e.jsx("option",{value:"low",children:"🟢 Low"}),e.jsx("option",{value:"medium",children:"🟡 Medium"}),e.jsx("option",{value:"high",children:"🟠 High"}),e.jsx("option",{value:"critical",children:"🔴 Critical"})]}),r.priority&&e.jsx("p",{className:"error-message",children:r.priority})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"browser",className:"form-label",children:"Browser"}),e.jsx("input",{type:"text",id:"browser",value:a.browser,onChange:s=>i("browser",s.target.value),className:"form-input",maxLength:"100",placeholder:"e.g., Chrome 120.0.0.0"}),r.browser&&e.jsx("p",{className:"error-message",children:r.browser})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"description",className:"form-label",children:["Description ",e.jsx("span",{className:"required",children:"*"})]}),e.jsx("textarea",{id:"description",value:a.description,onChange:s=>i("description",s.target.value),rows:"4",className:"form-textarea",maxLength:"2000",placeholder:"Please describe the issue in detail...",required:!0}),r.description&&e.jsx("p",{className:"error-message",children:r.description})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"reproduction_steps",className:"form-label",children:"Steps to Reproduce"}),e.jsx("textarea",{id:"reproduction_steps",value:a.reproduction_steps,onChange:s=>i("reproduction_steps",s.target.value),rows:"3",className:"form-textarea",maxLength:"1000",placeholder:"Please describe the steps to reproduce the issue..."}),r.reproduction_steps&&e.jsx("p",{className:"error-message",children:r.reproduction_steps})]}),e.jsxs("div",{className:"form-actions",children:[e.jsx("button",{type:"button",onClick:()=>window.history.back(),className:"btn-secondary",style:{backgroundColor:"#6b7280",color:"white",padding:"12px 24px",border:"none",borderRadius:"8px",cursor:"pointer",marginRight:"12px"},children:"Cancel"}),e.jsx("button",{type:"submit",disabled:o,className:"btn-primary",style:{backgroundColor:o?"#9ca3af":"#3b82f6",color:"white",padding:"12px 24px",border:"none",borderRadius:"8px",cursor:o?"not-allowed":"pointer"},children:o?e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"fas fa-spinner fa-spin",style:{marginRight:"8px"}}),"Submitting..."]}):e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"fas fa-paper-plane",style:{marginRight:"8px"}}),"Submit Bug Report"]})})]})]})}),e.jsxs("div",{className:"help-section",style:{backgroundColor:"#f3f4f6",borderRadius:"12px",padding:"24px",marginTop:"32px",border:"1px solid #e5e7eb"},children:[e.jsxs("h3",{style:{marginBottom:"16px",color:"#374151"},children:[e.jsx("i",{className:"fas fa-info-circle",style:{marginRight:"8px",color:"#3b82f6"}}),"Tips for a Good Bug Report"]}),e.jsxs("ul",{style:{listStyle:"none",padding:0,margin:0},children:[e.jsxs("li",{style:{marginBottom:"8px",color:"#6b7280"},children:[e.jsx("i",{className:"fas fa-check",style:{marginRight:"8px",color:"#10b981"}}),"Be specific and provide as much detail as possible"]}),e.jsxs("li",{style:{marginBottom:"8px",color:"#6b7280"},children:[e.jsx("i",{className:"fas fa-check",style:{marginRight:"8px",color:"#10b981"}}),"Include steps to reproduce the issue"]}),e.jsxs("li",{style:{marginBottom:"8px",color:"#6b7280"},children:[e.jsx("i",{className:"fas fa-check",style:{marginRight:"8px",color:"#10b981"}}),"Mention your browser and operating system"]}),e.jsxs("li",{style:{color:"#6b7280"},children:[e.jsx("i",{className:"fas fa-check",style:{marginRight:"8px",color:"#10b981"}}),"Include screenshots if applicable"]})]})]})]})]})]}),e.jsx("style",{jsx:!0,children:`
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 24px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                }

                .form-label {
                    font-weight: 600;
                    margin-bottom: 8px;
                    color: #374151;
                    font-size: 14px;
                }

                .required {
                    color: #ef4444;
                }

                .form-input,
                .form-select,
                .form-textarea {
                    padding: 12px;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 14px;
                    transition: border-color 0.2s;
                }

                .form-input:focus,
                .form-select:focus,
                .form-textarea:focus {
                    outline: none;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }

                .error-message {
                    color: #ef4444;
                    font-size: 12px;
                    margin-top: 4px;
                }

                .form-actions {
                    display: flex;
                    justify-content: flex-end;
                    margin-top: 32px;
                }

                @media (max-width: 768px) {
                    .form-row {
                        grid-template-columns: 1fr;
                        gap: 16px;
                    }

                    .form-actions {
                        flex-direction: column;
                    }

                    .form-actions button {
                        width: 100%;
                        margin-right: 0 !important;
                        margin-bottom: 12px;
                    }
                }
            `})]})}export{N as default};
