import{u,a as f,j as e}from"./app-C-_Ym-hM.js";import"./TextInput-C3aeDQiQ.js";function h({mustVerifyEmail:n,status:t,className:c=""}){const o=u().props.auth.user,{data:i,setData:l,patch:m,errors:s,processing:a,recentlySuccessful:d}=f({name:o.name,email:o.email}),p=r=>{r.preventDefault(),m(route("profile.update"))};return e.jsxs("section",{className:`profile-form ${c}`,children:[e.jsxs("form",{onSubmit:p,className:"profile-update-form",children:[e.jsxs("div",{className:"form-row",children:[e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"name",className:"form-label",children:["Full Name ",e.jsx("span",{className:"required",children:"*"})]}),e.jsx("input",{type:"text",id:"name",value:i.name,onChange:r=>l("name",r.target.value),className:"form-input",required:!0,autoFocus:!0,autoComplete:"name",placeholder:"Enter your full name"}),s.name&&e.jsx("p",{className:"error-message",children:s.name})]}),e.jsxs("div",{className:"form-group",children:[e.jsxs("label",{htmlFor:"email",className:"form-label",children:["Email Address ",e.jsx("span",{className:"required",children:"*"})]}),e.jsx("input",{type:"email",id:"email",value:i.email,onChange:r=>l("email",r.target.value),className:"form-input",required:!0,autoComplete:"username",placeholder:"Enter your email address"}),s.email&&e.jsx("p",{className:"error-message",children:s.email})]})]}),n&&o.email_verified_at===null&&e.jsxs("div",{className:"verification-notice",style:{backgroundColor:"#fef3c7",border:"1px solid #f59e0b",borderRadius:"8px",padding:"16px",marginTop:"24px"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",marginBottom:"8px"},children:[e.jsx("i",{className:"fas fa-exclamation-triangle",style:{marginRight:"8px",color:"#f59e0b"}}),e.jsx("span",{style:{fontWeight:"600",color:"#92400e"},children:"Email Verification Required"})]}),e.jsx("p",{style:{color:"#92400e",fontSize:"14px",marginBottom:"12px"},children:"Your email address is unverified. Please verify your email to secure your account."}),e.jsxs("button",{onClick:()=>window.location.href=route("verification.send"),className:"verification-button",style:{backgroundColor:"#f59e0b",color:"white",padding:"8px 16px",border:"none",borderRadius:"6px",fontSize:"14px",cursor:"pointer",transition:"background-color 0.2s"},onMouseOver:r=>r.currentTarget.style.backgroundColor="#d97706",onMouseOut:r=>r.currentTarget.style.backgroundColor="#f59e0b",children:[e.jsx("i",{className:"fas fa-envelope",style:{marginRight:"8px"}}),"Resend Verification Email"]}),t==="verification-link-sent"&&e.jsxs("div",{style:{marginTop:"12px",fontSize:"14px",color:"#059669",fontWeight:"500"},children:[e.jsx("i",{className:"fas fa-check-circle",style:{marginRight:"8px"}}),"A new verification link has been sent to your email address."]})]}),e.jsxs("div",{className:"form-actions",children:[e.jsx("button",{type:"submit",disabled:a,className:"btn-primary",style:{backgroundColor:a?"#9ca3af":"#3b82f6",color:"white",padding:"12px 24px",border:"none",borderRadius:"8px",cursor:a?"not-allowed":"pointer",fontSize:"16px",fontWeight:"500",transition:"background-color 0.2s"},onMouseOver:r=>{a||(r.currentTarget.style.backgroundColor="#2563eb")},onMouseOut:r=>{a||(r.currentTarget.style.backgroundColor="#3b82f6")},children:a?e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"fas fa-spinner fa-spin",style:{marginRight:"8px"}}),"Saving..."]}):e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"fas fa-save",style:{marginRight:"8px"}}),"Save Changes"]})}),d&&e.jsxs("div",{className:"success-message",style:{display:"flex",alignItems:"center",color:"#059669",fontSize:"14px",fontWeight:"500",marginLeft:"16px"},children:[e.jsx("i",{className:"fas fa-check-circle",style:{marginRight:"8px"}}),"Profile updated successfully!"]})]})]}),e.jsx("style",{jsx:!0,children:`
                .profile-update-form {
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
