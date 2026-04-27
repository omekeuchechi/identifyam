import{r as p,a as u,j as s}from"./app-BFN8PMyn.js";import"./TextInput-BFO3HNTd.js";function h({className:d=""}){const i=p.useRef(),l=p.useRef(),{data:o,setData:t,errors:r,put:m,reset:n,processing:a,recentlySuccessful:f}=u({current_password:"",password:"",password_confirmation:""}),x=e=>{e.preventDefault(),m(route("password.update"),{preserveScroll:!0,onSuccess:()=>n(),onError:c=>{c.password&&(n("password","password_confirmation"),i.current.focus()),c.current_password&&(n("current_password"),l.current.focus())}})};return s.jsxs("section",{className:`profile-form ${d}`,children:[s.jsxs("form",{onSubmit:x,className:"password-update-form",children:[s.jsxs("div",{className:"form-row",children:[s.jsxs("div",{className:"form-group",children:[s.jsxs("label",{htmlFor:"current_password",className:"form-label",children:["Current Password ",s.jsx("span",{className:"required",children:"*"})]}),s.jsx("input",{type:"password",id:"current_password",ref:l,value:o.current_password,onChange:e=>t("current_password",e.target.value),className:"form-input",autoComplete:"current-password",placeholder:"Enter your current password"}),r.current_password&&s.jsx("p",{className:"error-message",children:r.current_password})]}),s.jsxs("div",{className:"form-group",children:[s.jsxs("label",{htmlFor:"password",className:"form-label",children:["New Password ",s.jsx("span",{className:"required",children:"*"})]}),s.jsx("input",{type:"password",id:"password",ref:i,value:o.password,onChange:e=>t("password",e.target.value),className:"form-input",autoComplete:"new-password",placeholder:"Enter your new password"}),r.password&&s.jsx("p",{className:"error-message",children:r.password})]})]}),s.jsxs("div",{className:"form-group",children:[s.jsxs("label",{htmlFor:"password_confirmation",className:"form-label",children:["Confirm New Password ",s.jsx("span",{className:"required",children:"*"})]}),s.jsx("input",{type:"password",id:"password_confirmation",value:o.password_confirmation,onChange:e=>t("password_confirmation",e.target.value),className:"form-input",autoComplete:"new-password",placeholder:"Confirm your new password"}),r.password_confirmation&&s.jsx("p",{className:"error-message",children:r.password_confirmation})]}),s.jsxs("div",{className:"password-requirements",style:{backgroundColor:"#f0f9ff",border:"1px solid #0ea5e9",borderRadius:"8px",padding:"16px",marginTop:"16px"},children:[s.jsxs("h4",{style:{fontSize:"14px",fontWeight:"600",color:"#0369a1",marginBottom:"12px",display:"flex",alignItems:"center"},children:[s.jsx("i",{className:"fas fa-shield-alt",style:{marginRight:"8px"}}),"Password Requirements:"]}),s.jsxs("ul",{style:{listStyle:"none",padding:0,margin:0,fontSize:"13px",color:"#0c4a6e"},children:[s.jsxs("li",{style:{marginBottom:"4px",display:"flex",alignItems:"center"},children:[s.jsx("i",{className:"fas fa-check",style:{marginRight:"8px",color:"#10b981",fontSize:"12px"}}),"At least 8 characters long"]}),s.jsxs("li",{style:{marginBottom:"4px",display:"flex",alignItems:"center"},children:[s.jsx("i",{className:"fas fa-check",style:{marginRight:"8px",color:"#10b981",fontSize:"12px"}}),"Contains uppercase and lowercase letters"]}),s.jsxs("li",{style:{marginBottom:"4px",display:"flex",alignItems:"center"},children:[s.jsx("i",{className:"fas fa-check",style:{marginRight:"8px",color:"#10b981",fontSize:"12px"}}),"Contains at least one number"]}),s.jsxs("li",{style:{display:"flex",alignItems:"center"},children:[s.jsx("i",{className:"fas fa-check",style:{marginRight:"8px",color:"#10b981",fontSize:"12px"}}),"Contains at least one special character"]})]})]}),s.jsxs("div",{className:"form-actions",children:[s.jsx("button",{type:"submit",disabled:a,className:"btn-primary",style:{backgroundColor:a?"#9ca3af":"#10b981",color:"white",padding:"12px 24px",border:"none",borderRadius:"8px",cursor:a?"not-allowed":"pointer",fontSize:"16px",fontWeight:"500",transition:"background-color 0.2s"},onMouseOver:e=>{a||(e.currentTarget.style.backgroundColor="#059669")},onMouseOut:e=>{a||(e.currentTarget.style.backgroundColor="#10b981")},children:a?s.jsxs(s.Fragment,{children:[s.jsx("i",{className:"fas fa-spinner fa-spin",style:{marginRight:"8px"}}),"Updating..."]}):s.jsxs(s.Fragment,{children:[s.jsx("i",{className:"fas fa-lock",style:{marginRight:"8px"}}),"Update Password"]})}),f&&s.jsxs("div",{className:"success-message",style:{display:"flex",alignItems:"center",color:"#059669",fontSize:"14px",fontWeight:"500",marginLeft:"16px"},children:[s.jsx("i",{className:"fas fa-check-circle",style:{marginRight:"8px"}}),"Password updated successfully!"]})]})]}),s.jsx("style",{jsx:!0,children:`
                .password-update-form {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }

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

                .form-input {
                    padding: 12px;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 14px;
                    transition: border-color 0.2s;
                }

                .form-input:focus {
                    outline: none;
                    border-color: #10b981;
                    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
                }

                .error-message {
                    color: #ef4444;
                    font-size: 12px;
                    margin-top: 4px;
                }

                .form-actions {
                    display: flex;
                    align-items: center;
                    margin-top: 32px;
                }

                @media (max-width: 768px) {
                    .form-row {
                        grid-template-columns: 1fr;
                        gap: 16px;
                    }

                    .form-actions {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 12px;
                    }

                    .success-message {
                        margin-left: 0 !important;
                    }
                }
            `})]})}export{h as default};
