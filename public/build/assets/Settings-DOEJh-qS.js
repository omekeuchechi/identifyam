import{r as d,j as e,H as m}from"./app-BjAYIsIy.js";const p=()=>{const[s,n]=d.useState({siteName:"IDENTIFYAM",siteDescription:"NIN Verification System",maintenanceMode:!1,emailNotifications:!0,smsNotifications:!1,maxDailyVerifications:100,sessionTimeout:120}),i=a=>{const{name:r,value:t,type:c}=a.target;n(l=>({...l,[r]:c==="checkbox"?t==="on":t}))},o=async()=>{try{(await fetch("/api/admin/settings",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")},body:JSON.stringify(s)})).ok?alert("Settings saved successfully!"):alert("Failed to save settings")}catch(a){alert("Error saving settings: "+a.message)}};return e.jsxs(e.Fragment,{children:[e.jsx(m,{title:"System Settings - Admin"}),e.jsxs("div",{className:"admin-page",children:[e.jsxs("div",{className:"admin-header",children:[e.jsx("h2",{children:"System Settings"}),e.jsxs("button",{onClick:o,className:"btn btn-primary",children:[e.jsx("i",{className:"fas fa-save"}),"Save Settings"]})]}),e.jsxs("div",{className:"settings-container",children:[e.jsxs("div",{className:"settings-section",children:[e.jsx("h3",{children:"General Settings"}),e.jsxs("div",{className:"form-grid",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Site Name"}),e.jsx("input",{type:"text",name:"siteName",value:s.siteName,onChange:i,className:"form-input"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Site Description"}),e.jsx("textarea",{name:"siteDescription",value:s.siteDescription,onChange:i,className:"form-textarea",rows:"3"})]})]})]}),e.jsxs("div",{className:"settings-section",children:[e.jsx("h3",{children:"System Configuration"}),e.jsxs("div",{className:"form-grid",children:[e.jsxs("div",{className:"form-group checkbox-group",children:[e.jsxs("label",{className:"checkbox-label",children:[e.jsx("input",{type:"checkbox",name:"maintenanceMode",checked:s.maintenanceMode,onChange:i}),e.jsx("span",{children:"Maintenance Mode"})]}),e.jsx("small",{children:"Enable maintenance mode to disable user access"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Max Daily Verifications"}),e.jsx("input",{type:"number",name:"maxDailyVerifications",value:s.maxDailyVerifications,onChange:i,className:"form-input",min:"1"})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Session Timeout (minutes)"}),e.jsx("input",{type:"number",name:"sessionTimeout",value:s.sessionTimeout,onChange:i,className:"form-input",min:"5"})]})]})]}),e.jsxs("div",{className:"settings-section",children:[e.jsx("h3",{children:"Notification Settings"}),e.jsxs("div",{className:"form-grid",children:[e.jsx("div",{className:"form-group checkbox-group",children:e.jsxs("label",{className:"checkbox-label",children:[e.jsx("input",{type:"checkbox",name:"emailNotifications",checked:s.emailNotifications,onChange:i}),e.jsx("span",{children:"Email Notifications"})]})}),e.jsx("div",{className:"form-group checkbox-group",children:e.jsxs("label",{className:"checkbox-label",children:[e.jsx("input",{type:"checkbox",name:"smsNotifications",checked:s.smsNotifications,onChange:i}),e.jsx("span",{children:"SMS Notifications"})]})})]})]})]})]}),e.jsx("style",{jsx:!0,children:`
                .admin-page {
                    padding: 20px;
                }

                .admin-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding: 20px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }

                .admin-header h2 {
                    margin: 0;
                    color: #1f2937;
                }

                .settings-container {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 25px;
                }

                .settings-section {
                    background: white;
                    padding: 25px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }

                .settings-section h3 {
                    color: #1f2937;
                    margin-bottom: 20px;
                    font-size: 18px;
                    border-bottom: 2px solid #e5e7eb;
                    padding-bottom: 10px;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 500;
                    color: #374151;
                    font-size: 14px;
                }

                .form-input, .form-textarea {
                    width: 100%;
                    padding: 12px 15px;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 14px;
                    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
                }

                .form-input:focus, .form-textarea:focus {
                    border-color: #10b981;
                    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
                    outline: 0;
                }

                .form-textarea {
                    resize: vertical;
                    min-height: 80px;
                }

                .checkbox-group {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .checkbox-label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                }

                .checkbox-label input[type="checkbox"] {
                    margin: 0;
                }

                .checkbox-label small {
                    display: block;
                    color: #6b7280;
                    font-size: 12px;
                    margin-top: 4px;
                }

                @media (max-width: 768px) {
                    .form-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `})]})};export{p as default};
