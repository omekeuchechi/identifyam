import{u as _,r as s,j as e,H as z}from"./app-BsiuXe2T.js";const F=({auth:d})=>{const{props:A}=_(),[j,v]=s.useState([]),[w,f]=s.useState(!0),[n,N]=s.useState(""),[o,C]=s.useState("all"),[l,h]=s.useState(!1);s.useEffect(()=>{m()},[]);const m=async()=>{try{f(!0);const t=await fetch(route("user.history"),{headers:{"Content-Type":"application/json","X-CSRF-TOKEN":document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")}});if(t.ok){const a=await t.json();v(a.activities||[])}}catch(t){console.error("Failed to fetch user history:",t)}finally{f(!1)}},g=async(t="all")=>{try{h(!0),(await fetch(route("cache.clear"),{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")},body:JSON.stringify({type:t})})).ok&&await m()}catch(a){console.error("Failed to clear cache:",a)}finally{h(!1)}},u=j.filter(t=>{const a=t.description?.toLowerCase().includes(n.toLowerCase())||t.action?.toLowerCase().includes(n.toLowerCase()),i=o==="all"||t.type===o;return a&&i}),k=t=>({login:"fas fa-sign-in-alt",logout:"fas fa-sign-out-alt",profile_update:"fas fa-user-edit",password_change:"fas fa-lock",nin_verification:"fas fa-id-card",wallet_transaction:"fas fa-wallet",bug_report:"fas fa-bug",admin_login:"fas fa-user-shield",admin_action:"fas fa-cogs",cache_clear:"fas fa-trash-alt",email_verification:"fas fa-envelope",google_login:"fab fa-google"})[t]||"fas fa-circle",b=t=>({auth:"#10b981",profile:"#3b82f6",security:"#f59e0b",verification:"#8b5cf6",transaction:"#06b6d4",admin:"#ef4444",system:"#6b7280"})[t]||"#6b7280",y=t=>new Date(t).toLocaleString(),S=t=>{const a=new Date,i=new Date(t),r=a-i,c=Math.floor(r/6e4),p=Math.floor(r/36e5),x=Math.floor(r/864e5);return c<1?"Just now":c<60?`${c} minute${c>1?"s":""} ago`:p<24?`${p} hour${p>1?"s":""} ago`:x<7?`${x} day${x>1?"s":""} ago`:y(t)};return e.jsxs(e.Fragment,{children:[e.jsx(z,{title:"Activity History"}),e.jsxs("div",{className:"history-page",children:[e.jsx("div",{className:"history-header",children:e.jsxs("div",{className:"header-content",children:[e.jsxs("div",{className:"header-text",children:[e.jsx("h2",{children:"Activity History"}),e.jsx("p",{children:d.user.isAdmin?"View system-wide activity and manage cache":"View your recent activity and manage your data"})]}),e.jsxs("div",{className:"header-actions",children:[e.jsx("button",{onClick:()=>g("user"),disabled:l,className:"btn btn-clear-user",children:l?e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"fas fa-spinner fa-spin"}),e.jsx("span",{children:"Clearing..."})]}):e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"fas fa-trash-alt"}),e.jsx("span",{children:"Clear My Cache"})]})}),d.user.isAdmin&&e.jsx("button",{onClick:()=>g("all"),disabled:l,className:"btn btn-clear-all",children:l?e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"fas fa-spinner fa-spin"}),e.jsx("span",{children:"Clearing..."})]}):e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"fas fa-server"}),e.jsx("span",{children:"Clear All Cache"})]})})]})]})}),e.jsx("div",{className:"filters-section",children:e.jsxs("div",{className:"filter-controls",children:[e.jsxs("div",{className:"search-box",children:[e.jsx("i",{className:"fas fa-search"}),e.jsx("input",{type:"text",placeholder:"Search activities...",value:n,onChange:t=>N(t.target.value),className:"search-input"})]}),e.jsxs("div",{className:"filter-box",children:[e.jsx("i",{className:"fas fa-filter"}),e.jsxs("select",{value:o,onChange:t=>C(t.target.value),className:"filter-select",children:[e.jsx("option",{value:"all",children:"All Activities"}),e.jsx("option",{value:"auth",children:"Authentication"}),e.jsx("option",{value:"profile",children:"Profile"}),e.jsx("option",{value:"security",children:"Security"}),e.jsx("option",{value:"verification",children:"Verification"}),e.jsx("option",{value:"transaction",children:"Transactions"}),d.user.isAdmin&&e.jsx("option",{value:"admin",children:"Admin Actions"}),e.jsx("option",{value:"system",children:"System"})]})]})]})}),e.jsx("div",{className:"activities-container",children:w?e.jsxs("div",{className:"loading-state",children:[e.jsx("i",{className:"fas fa-spinner fa-spin"}),e.jsx("p",{children:"Loading activity history..."})]}):u.length===0?e.jsxs("div",{className:"empty-state",children:[e.jsx("i",{className:"fas fa-history"}),e.jsx("h3",{children:"No activities found"}),e.jsx("p",{children:n||o!=="all"?"Try adjusting your search or filters":"Your activity will appear here as you use the application"})]}):e.jsx("div",{className:"activities-list",children:u.map((t,a)=>e.jsxs("div",{className:"activity-item",children:[e.jsx("div",{className:"activity-icon",style:{backgroundColor:`${b(t.type)}20`,color:b(t.type)},children:e.jsx("i",{className:k(t.action)})}),e.jsxs("div",{className:"activity-content",children:[e.jsxs("div",{className:"activity-header",children:[e.jsxs("div",{className:"activity-title-row",children:[e.jsx("h4",{children:t.description||t.action}),t.amount&&e.jsxs("span",{className:"activity-amount",children:["₦",Number(t.amount).toLocaleString()]})]}),e.jsx("span",{className:"activity-time",title:y(t.created_at),children:S(t.created_at)})]}),t.reference&&e.jsxs("div",{className:"activity-reference",children:["REF: ",t.reference]}),t.details&&e.jsx("div",{className:"activity-details",children:typeof t.details=="object"?e.jsx("div",{className:"details-grid",children:Object.entries(t.details).map(([i,r])=>e.jsxs("span",{className:"detail-tag",children:[e.jsxs("strong",{children:[i.replace(/_/g," "),":"]})," ",String(r)]},i))}):e.jsx("p",{children:t.details})}),t.ip_address&&e.jsxs("div",{className:"activity-meta",children:[e.jsxs("span",{className:"meta-item",children:[e.jsx("i",{className:"fas fa-globe"}),t.ip_address]}),t.user_agent&&e.jsxs("span",{className:"meta-item",children:[e.jsx("i",{className:"fas fa-desktop"}),t.user_agent.split(" ")[0]]})]})]})]},t.id||a))})})]}),e.jsx("style",{children:`
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
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }

                .header-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 20px;
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

                .btn {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: all 0.2s;
                    white-space: nowrap;
                }

                .btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .btn-clear-user {
                    background-color: #10b981;
                    color: white;
                }

                .btn-clear-user:hover:not(:disabled) {
                    background-color: #059669;
                }

                .btn-clear-all {
                    background-color: #ef4444;
                    color: white;
                }

                .btn-clear-all:hover:not(:disabled) {
                    background-color: #dc2626;
                }

                .filters-section {
                    background: white;
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 24px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }

                .filter-controls {
                    display: flex;
                    gap: 16px;
                }

                .search-box, .filter-box {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .search-box i, .filter-box i {
                    position: absolute;
                    left: 14px;
                    color: #9ca3af;
                    font-size: 14px;
                }

                .search-input, .filter-select {
                    padding: 10px 16px 10px 40px;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 14px;
                    width: 100%;
                    outline: none;
                    transition: border-color 0.2s;
                }

                .search-input:focus, .filter-select:focus {
                    border-color: #10b981;
                }

                .search-box { flex: 1; max-width: 400px; }
                .filter-box { width: 220px; }

                .activities-container {
                    background: white;
                    border-radius: 12px;
                    padding: 24px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }

                .loading-state, .empty-state {
                    text-align: center;
                    padding: 60px 20px;
                }

                .loading-state i {
                    font-size: 24px;
                    color: #10b981;
                }

                .loading-state p {
                    margin-top: 16px;
                    color: #6b7280;
                }

                .empty-state i {
                    font-size: 48px;
                    color: #d1d5db;
                }

                .empty-state h3 {
                    margin: 16px 0 8px 0;
                    color: #374151;
                }

                .empty-state p {
                    color: #6b7280;
                    font-size: 14px;
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
                    border-radius: 12px;
                    transition: all 0.2s;
                }

                .activity-item:hover {
                    background: #f9fafb;
                    border-color: #e5e7eb;
                    transform: translateY(-1px);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                }

                .activity-icon {
                    width: 44px;
                    height: 44px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    font-size: 18px;
                }

                .activity-content {
                    flex: 1;
                    min-width: 0;
                }

                .activity-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 12px;
                    margin-bottom: 6px;
                }

                .activity-title-row {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    flex-wrap: wrap;
                }

                .activity-title-row h4 {
                    margin: 0;
                    color: #111827;
                    font-size: 15px;
                    font-weight: 600;
                }

                .activity-amount {
                    font-weight: 700;
                    color: #10b981;
                    font-size: 14px;
                }

                .activity-time {
                    color: #6b7280;
                    font-size: 12px;
                    white-space: nowrap;
                    background: #f3f4f6;
                    padding: 2px 8px;
                    border-radius: 4px;
                }

                .activity-reference {
                    font-size: 11px;
                    color: #9ca3af;
                    margin-bottom: 6px;
                    font-family: monospace;
                }

                .details-grid {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                    margin-top: 8px;
                }

                .detail-tag {
                    background: #f3f4f6;
                    padding: 4px 10px;
                    border-radius: 6px;
                    font-size: 12px;
                    color: #4b5563;
                    border: 1px solid #e5e7eb;
                }

                .activity-meta {
                    display: flex;
                    gap: 16px;
                    margin-top: 12px;
                    border-top: 1px solid #f3f4f6;
                    padding-top: 8px;
                }

                .meta-item {
                    color: #9ca3af;
                    font-size: 11px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                @media (max-width: 1024px) {
                    .filter-box { width: 200px; }
                }

                @media (max-width: 768px) {
                    .history-page {
                        padding: 16px;
                    }

                    .header-content {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 20px;
                    }

                    .header-actions {
                        width: 100%;
                        flex-direction: column;
                    }

                    .btn {
                        width: 100%;
                    }

                    .filter-controls {
                        flex-direction: column;
                    }

                    .search-box, .filter-box {
                        width: 100%;
                        max-width: none;
                    }

                    .activity-item {
                        padding: 12px;
                        gap: 12px;
                    }

                    .activity-icon {
                        width: 36px;
                        height: 36px;
                        font-size: 16px;
                    }

                    .activity-header {
                        flex-direction: column;
                        gap: 8px;
                    }

                    .activity-title-row {
                        width: 100%;
                        justify-content: space-between;
                    }

                    .activity-time {
                        align-self: flex-start;
                    }

                    .activity-meta {
                        flex-wrap: wrap;
                        gap: 10px;
                    }
                }

                @media (max-width: 480px) {
                    .activity-item {
                        flex-direction: column;
                    }

                    .activity-icon {
                        align-self: flex-start;
                    }

                    .activity-title-row {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 4px;
                    }

                    .activity-amount {
                        font-size: 16px;
                    }
                }
            `})]})};export{F as default};
