import{r as i,a as b,j as e}from"./app-C8oj3Gtf.js";import"./TextInput-DNKspAA2.js";function j({className:c=""}){const[d,t]=i.useState(!1),s=i.useRef(),{data:p,setData:x,delete:u,processing:r,reset:n,errors:a,clearErrors:m}=b({password:""}),g=()=>{t(!0)},f=o=>{o.preventDefault(),u(route("profile.destroy"),{preserveScroll:!0,onSuccess:()=>l(),onError:()=>s.current.focus(),onFinish:()=>n()})},l=()=>{t(!1),m(),n()};return e.jsxs("section",{className:`profile-form ${c}`,children:[e.jsxs("div",{className:"delete-account-content",children:[e.jsxs("div",{className:"warning-message",style:{backgroundColor:"#fef2f2",border:"1px solid #fecaca",borderRadius:"8px",padding:"20px",marginBottom:"24px"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",marginBottom:"12px"},children:[e.jsx("i",{className:"fas fa-exclamation-triangle",style:{marginRight:"12px",color:"#dc2626",fontSize:"24px"}}),e.jsx("h3",{style:{fontSize:"18px",fontWeight:"600",color:"#dc2626",margin:0},children:"Delete Account"})]}),e.jsx("p",{style:{color:"#991b1b",fontSize:"14px",lineHeight:"1.5",margin:0},children:"Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain."})]}),e.jsxs("button",{onClick:g,className:"btn-danger",style:{backgroundColor:"#dc2626",color:"white",padding:"12px 24px",border:"none",borderRadius:"8px",cursor:"pointer",fontSize:"16px",fontWeight:"500",transition:"background-color 0.2s",display:"flex",alignItems:"center"},onMouseOver:o=>o.currentTarget.style.backgroundColor="#b91c1c",onMouseOut:o=>o.currentTarget.style.backgroundColor="#dc2626",children:[e.jsx("i",{className:"fas fa-trash-alt",style:{marginRight:"8px"}}),"Delete Account"]})]}),d&&e.jsx("div",{className:"modal-overlay",style:{position:"fixed",top:0,left:0,right:0,bottom:0,backgroundColor:"rgba(0, 0, 0, 0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1e3},children:e.jsx("div",{className:"modal-content",style:{backgroundColor:"white",borderRadius:"12px",padding:"32px",maxWidth:"500px",width:"90%",boxShadow:"0 20px 25px -5px rgba(0, 0, 0, 0.1)"},children:e.jsxs("form",{onSubmit:f,children:[e.jsxs("div",{style:{marginBottom:"24px"},children:[e.jsxs("h3",{style:{fontSize:"20px",fontWeight:"600",color:"#dc2626",marginBottom:"12px",display:"flex",alignItems:"center"},children:[e.jsx("i",{className:"fas fa-exclamation-triangle",style:{marginRight:"12px",color:"#dc2626"}}),"Confirm Account Deletion"]}),e.jsx("p",{style:{color:"#6b7280",fontSize:"14px",lineHeight:"1.5",marginBottom:"16px"},children:"Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account."})]}),e.jsxs("div",{style:{marginBottom:"24px"},children:[e.jsxs("label",{htmlFor:"password",className:"form-label",children:["Password ",e.jsx("span",{className:"required",children:"*"})]}),e.jsx("input",{type:"password",id:"password",ref:s,value:p.password,onChange:o=>x("password",o.target.value),className:"form-input",placeholder:"Enter your password to confirm",autoFocus:!0}),a.password&&e.jsx("p",{className:"error-message",children:a.password})]}),e.jsxs("div",{className:"modal-actions",style:{display:"flex",justifyContent:"flex-end",gap:"12px"},children:[e.jsx("button",{type:"button",onClick:l,className:"btn-secondary",style:{backgroundColor:"#6b7280",color:"white",padding:"10px 20px",border:"none",borderRadius:"6px",cursor:"pointer",fontSize:"14px",fontWeight:"500",transition:"background-color 0.2s"},onMouseOver:o=>o.currentTarget.style.backgroundColor="#4b5563",onMouseOut:o=>o.currentTarget.style.backgroundColor="#6b7280",children:"Cancel"}),e.jsx("button",{type:"submit",disabled:r,className:"btn-danger",style:{backgroundColor:r?"#9ca3af":"#dc2626",color:"white",padding:"10px 20px",border:"none",borderRadius:"6px",cursor:r?"not-allowed":"pointer",fontSize:"14px",fontWeight:"500",transition:"background-color 0.2s"},onMouseOver:o=>{r||(o.currentTarget.style.backgroundColor="#b91c1c")},onMouseOut:o=>{r||(o.currentTarget.style.backgroundColor="#dc2626")},children:r?e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"fas fa-spinner fa-spin",style:{marginRight:"8px"}}),"Deleting..."]}):e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"fas fa-trash-alt",style:{marginRight:"8px"}}),"Delete Account"]})})]})]})})}),e.jsx("style",{jsx:!0,children:`
                .delete-account-content {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .form-label {
                    font-weight: 600;
                    margin-bottom: 8px;
                    color: #374151;
                    font-size: 14px;
                    display: block;
                }

                .required {
                    color: #ef4444;
                }

                .form-input {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 14px;
                    transition: border-color 0.2s;
                }

                .form-input:focus {
                    outline: none;
                    border-color: #dc2626;
                    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
                }

                .error-message {
                    color: #ef4444;
                    font-size: 12px;
                    margin-top: 4px;
                }

                @media (max-width: 640px) {
                    .modal-content {
                        margin: 16px;
                        padding: 24px;
                    }

                    .modal-actions {
                        flex-direction: column;
                    }

                    .modal-actions button {
                        width: 100%;
                    }
                }
            `})]})}export{j as default};
