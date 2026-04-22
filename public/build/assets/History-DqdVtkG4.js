import{u as T,r as s,j as e,H as A}from"./app-C8oj3Gtf.js";const z=({auth:l})=>{const{props:_}=T(),[j,v]=s.useState([]),[w,f]=s.useState(!0),[r,N]=s.useState(""),[n,C]=s.useState("all"),[i,h]=s.useState(!1);s.useEffect(()=>{g()},[]);const g=async()=>{try{f(!0);const t=await fetch(route("user.history"),{headers:{"Content-Type":"application/json","X-CSRF-TOKEN":document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")}});if(t.ok){const a=await t.json();v(a.activities||[])}}catch(t){console.error("Failed to fetch user history:",t)}finally{f(!1)}},u=async(t="all")=>{try{h(!0),(await fetch(route("cache.clear"),{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")},body:JSON.stringify({type:t})})).ok&&await g()}catch(a){console.error("Failed to clear cache:",a)}finally{h(!1)}},m=j.filter(t=>{const a=t.description?.toLowerCase().includes(r.toLowerCase())||t.action?.toLowerCase().includes(r.toLowerCase()),c=n==="all"||t.type===n;return a&&c}),S=t=>({login:"fas fa-sign-in-alt",logout:"fas fa-sign-out-alt",profile_update:"fas fa-user-edit",password_change:"fas fa-lock",nin_verification:"fas fa-id-card",wallet_transaction:"fas fa-wallet",bug_report:"fas fa-bug",admin_login:"fas fa-user-shield",admin_action:"fas fa-cogs",cache_clear:"fas fa-trash-alt",email_verification:"fas fa-envelope",google_login:"fab fa-google"})[t]||"fas fa-circle",y=t=>({auth:"#10b981",profile:"#3b82f6",security:"#f59e0b",verification:"#8b5cf6",transaction:"#06b6d4",admin:"#ef4444",system:"#6b7280"})[t]||"#6b7280",b=t=>new Date(t).toLocaleString(),k=t=>{const a=new Date,c=new Date(t),d=a-c,o=Math.floor(d/6e4),p=Math.floor(d/36e5),x=Math.floor(d/864e5);return o<1?"Just now":o<60?`${o} minute${o>1?"s":""} ago`:p<24?`${p} hour${p>1?"s":""} ago`:x<7?`${x} day${x>1?"s":""} ago`:b(t)};return e.jsxs(e.Fragment,{children:[e.jsx(A,{title:"Activity History"}),e.jsxs("div",{className:"history-page",children:[e.jsx("div",{className:"history-header",children:e.jsxs("div",{className:"header-content",children:[e.jsxs("div",{className:"header-text",children:[e.jsx("h2",{children:"Activity History"}),e.jsx("p",{children:l.user.isAdmin?"View system-wide activity and manage cache":"View your recent activity and manage your data"})]}),e.jsxs("div",{className:"header-actions",children:[e.jsx("button",{onClick:()=>u("user"),disabled:i,className:"btn btn-secondary",style:{backgroundColor:"#6b7280",color:"white",padding:"10px 20px",border:"none",borderRadius:"8px",cursor:i?"not-allowed":"pointer",fontSize:"14px",fontWeight:"500",transition:"background-color 0.2s"},onMouseOver:t=>{i||(t.currentTarget.style.backgroundColor="#4b5563")},onMouseOut:t=>{i||(t.currentTarget.style.backgroundColor="#6b7280")},children:i?e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"fas fa-spinner fa-spin",style:{marginRight:"8px"}}),"Clearing..."]}):e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"fas fa-trash-alt",style:{marginRight:"8px"}}),"Clear My Cache"]})}),l.user.isAdmin&&e.jsx("button",{onClick:()=>u("all"),disabled:i,className:"btn btn-danger",style:{backgroundColor:"#ef4444",color:"white",padding:"10px 20px",border:"none",borderRadius:"8px",cursor:i?"not-allowed":"pointer",fontSize:"14px",fontWeight:"500",transition:"background-color 0.2s",marginLeft:"12px"},onMouseOver:t=>{i||(t.currentTarget.style.backgroundColor="#dc2626")},onMouseOut:t=>{i||(t.currentTarget.style.backgroundColor="#ef4444")},children:i?e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"fas fa-spinner fa-spin",style:{marginRight:"8px"}}),"Clearing..."]}):e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"fas fa-server",style:{marginRight:"8px"}}),"Clear All Cache"]})})]})]})}),e.jsx("div",{className:"filters-section",children:e.jsxs("div",{className:"filter-controls",children:[e.jsx("input",{type:"text",placeholder:"Search activities...",value:r,onChange:t=>N(t.target.value),className:"search-input",style:{padding:"10px 16px",border:"1px solid #d1d5db",borderRadius:"8px",fontSize:"14px",width:"300px"}}),e.jsxs("select",{value:n,onChange:t=>C(t.target.value),className:"filter-select",style:{padding:"10px 16px",border:"1px solid #d1d5db",borderRadius:"8px",fontSize:"14px",marginLeft:"12px"},children:[e.jsx("option",{value:"all",children:"All Activities"}),e.jsx("option",{value:"auth",children:"Authentication"}),e.jsx("option",{value:"profile",children:"Profile"}),e.jsx("option",{value:"security",children:"Security"}),e.jsx("option",{value:"verification",children:"Verification"}),e.jsx("option",{value:"transaction",children:"Transactions"}),l.user.isAdmin&&e.jsx("option",{value:"admin",children:"Admin Actions"}),e.jsx("option",{value:"system",children:"System"})]})]})}),e.jsx("div",{className:"activities-container",children:w?e.jsxs("div",{className:"loading-state",style:{textAlign:"center",padding:"40px"},children:[e.jsx("i",{className:"fas fa-spinner fa-spin",style:{fontSize:"24px",color:"#6b7280"}}),e.jsx("p",{style:{marginTop:"16px",color:"#6b7280"},children:"Loading activity history..."})]}):m.length===0?e.jsxs("div",{className:"empty-state",style:{textAlign:"center",padding:"40px"},children:[e.jsx("i",{className:"fas fa-history",style:{fontSize:"48px",color:"#d1d5db"}}),e.jsx("h3",{style:{marginTop:"16px",color:"#6b7280"},children:"No activities found"}),e.jsx("p",{style:{marginTop:"8px",color:"#9ca3af"},children:r||n!=="all"?"Try adjusting your search or filters":"Your activity will appear here as you use the application"})]}):e.jsx("div",{className:"activities-list",children:m.map((t,a)=>e.jsxs("div",{className:"activity-item",children:[e.jsx("div",{className:"activity-icon",style:{backgroundColor:`${y(t.type)}20`,color:y(t.type)},children:e.jsx("i",{className:S(t.action)})}),e.jsxs("div",{className:"activity-content",children:[e.jsxs("div",{className:"activity-header",children:[e.jsx("h4",{children:t.description||t.action}),e.jsx("span",{className:"activity-time",title:b(t.created_at),children:k(t.created_at)})]}),t.details&&e.jsx("p",{className:"activity-details",children:t.details}),t.ip_address&&e.jsxs("div",{className:"activity-meta",children:[e.jsxs("span",{className:"meta-item",children:[e.jsx("i",{className:"fas fa-globe",style:{marginRight:"4px"}}),t.ip_address]}),t.user_agent&&e.jsxs("span",{className:"meta-item",children:[e.jsx("i",{className:"fas fa-desktop",style:{marginRight:"4px"}}),t.user_agent.split(" ")[0]]})]})]})]},t.id||a))})})]}),e.jsx("style",{children:`
                .history-page {
                    padding: 24px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .history-header {
                    background: white;
                    border-radius: 12px;
                    padding: 24px;
                    margin-bottom: 24px;
                    box-shadow: '0 1px 3px rgba(0, 0, 0, 0.1)';
                }

                .header-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .header-text h2 {
                    margin: 0 0 8px 0;
                    color: #1f2937;
                    font-size: 24px;
                    font-weight: 600;
                }

                .header-text p {
                    margin: 0;
                    color: #6b7280;
                    font-size: 14px;
                }

                .header-actions {
                    display: flex;
                    gap: 12px;
                }

                .filters-section {
                    background: white;
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 24px;
                    box-shadow: '0 1px 3px rgba(0, 0, 0, 0.1)';
                }

                .filter-controls {
                    display: flex;
                    align-items: center;
                }

                .activities-container {
                    background: white;
                    border-radius: 12px;
                    padding: 24px;
                    box-shadow: '0 1px 3px rgba(0, 0, 0, 0.1)';
                }

                .activities-list {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .activity-item {
                    display: flex;
                    gap: 16px;
                    padding: 16px;
                    border: 1px solid #f3f4f6;
                    border-radius: 8px;
                    transition: all 0.2s;
                }

                .activity-item:hover {
                    background: #f9fafb;
                    border-color: #e5e7eb;
                }

                .activity-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .activity-content {
                    flex: 1;
                }

                .activity-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 4px;
                }

                .activity-header h4 {
                    margin: 0;
                    color: #1f2937;
                    font-size: 14px;
                    font-weight: 500;
                }

                .activity-time {
                    color: #6b7280;
                    font-size: 12px;
                    white-space: nowrap;
                }

                .activity-details {
                    color: #6b7280;
                    font-size: 13px;
                    margin: 4px 0 0 0;
                }

                .activity-meta {
                    display: flex;
                    gap: 16px;
                    margin-top: 8px;
                }

                .meta-item {
                    color: #9ca3af;
                    font-size: 11px;
                    display: flex;
                    align-items: center;
                }

                @media (max-width: 768px) {
                    .history-page {
                        padding: 16px;
                    }

                    .header-content {
                        flex-direction: column;
                        gap: 16px;
                        align-items: flex-start;
                    }

                    .header-actions {
                        width: 100%;
                        justify-content: flex-start;
                    }

                    .filter-controls {
                        flex-direction: column;
                        gap: 12px;
                    }

                    .search-input,
                    .filter-select {
                        width: 100%;
                        margin-left: 0 !important;
                    }

                    .activity-header {
                        flex-direction: column;
                        gap: 4px;
                    }

                    .activity-meta {
                        flex-direction: column;
                        gap: 4px;
                    }
                }
            `})]})};export{z as default};
