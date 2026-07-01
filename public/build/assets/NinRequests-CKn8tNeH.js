import{r,j as a,H as f,L as t,a as b}from"./app-CjlnaK9E.js";const u=({auth:p,requests:n})=>{const[s,c]=r.useState(""),[m,d]=r.useState(n?.data||[]),[l,i]=r.useState(!1);r.useEffect(()=>{n?.data&&d(n.data)},[n]),r.useEffect(()=>{if(s){const e=n.data.filter(o=>o.nin?.toLowerCase().includes(s.toLowerCase())||o.user?.name?.toLowerCase().includes(s.toLowerCase()));d(e)}else d(n.data||[])},[s,n]);const x=e=>new Date(e).toLocaleDateString(),h=e=>{e.preventDefault(),confirm("Are you sure you want to logout?")&&b.post(route("logout"))};return a.jsxs(a.Fragment,{children:[a.jsx(f,{title:"NIN Requests - Admin"}),a.jsxs("div",{className:"dashboard-layout",children:[l&&a.jsx("div",{className:"sidebar-overlay",onClick:()=>i(!1)}),a.jsxs("aside",{className:`sidebar ${l?"open":""}`,children:[a.jsxs("div",{className:"sidebar-logo",children:[a.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px"},children:[a.jsx("div",{className:"logo-image"}),a.jsx("span",{children:"IDENTIFYAM"})]}),a.jsx("button",{className:"sidebar-close-btn",onClick:()=>i(!1),"aria-label":"Close sidebar",children:a.jsx("i",{className:"fas fa-times"})})]}),a.jsxs("nav",{className:"sidebar-menu",children:[a.jsxs(t,{href:route("admin.dashboard"),className:"sidebar-link",onClick:()=>i(!1),children:[a.jsx("i",{className:"fas fa-tachometer-alt"}),"Dashboard"]}),a.jsxs(t,{href:"lagacy-nin",className:"sidebar-link",onClick:()=>i(!1),children:[a.jsx("i",{className:"fas fa-history"})," Lagacy NIN"]}),a.jsxs(t,{href:route("exam.cards"),className:"sidebar-link",onClick:()=>i(!1),children:[a.jsx("i",{className:"fas fa-credit-card"})," Exam Cards"]}),a.jsxs(t,{href:"/admin/users",className:"sidebar-link",onClick:()=>i(!1),children:[a.jsx("i",{className:"fas fa-credit-card"})," Manage Users"]}),a.jsxs(t,{href:"/admin/nin-requests",className:"sidebar-link active",onClick:()=>i(!1),children:[a.jsx("i",{className:"fas fa-search"})," NIN Requests"]}),a.jsxs(t,{href:"/admin/send-email",className:"sidebar-link",onClick:()=>i(!1),children:[a.jsx("i",{className:"fas fa-envelope"})," Send Email"]}),a.jsxs(t,{href:"history",className:"sidebar-link",onClick:()=>i(!1),children:[a.jsx("i",{className:"fas fa-history"}),"History"]}),a.jsxs(t,{href:"profile",className:"sidebar-link",onClick:()=>i(!1),children:[a.jsx("i",{className:"fas fa-user-edit"}),"Profile Edit"]}),a.jsxs(t,{href:route("admin.nin-profit"),className:"sidebar-link",onClick:()=>i(!1),children:[a.jsx("i",{className:"fas fa-chart-line"})," NIN Profit"]}),a.jsxs(t,{href:route("admin.exam-profit"),className:"sidebar-link",onClick:()=>i(!1),children:[a.jsx("i",{className:"fas fa-chart-pie"})," Exam Profit"]}),a.jsxs("button",{onClick:h,style:{padding:"15px 20px",backgroundColor:"red",color:"#fff",fontSize:"15px",border:"none",borderRadius:"20px",cursor:"pointer",marginTop:"15px"},children:[a.jsx("i",{className:"fas fa-sign-out"})," Logout"]})]})]}),a.jsxs("div",{className:"dashboard-main",children:[a.jsxs("header",{className:"topbar",children:[a.jsxs("div",{style:{display:"flex",alignItems:"center"},children:[a.jsx("button",{className:"sidebar-toggle-btn",onClick:()=>i(!0),"aria-label":"Toggle sidebar",children:a.jsx("i",{className:"fas fa-bars"})}),a.jsx("h3",{children:"NIN Verification Requests"})]}),a.jsx("div",{className:"topbar-right",children:a.jsx("div",{className:"user-profile",children:a.jsx("span",{children:p?.user?.name})})})]}),a.jsx("div",{className:"dashboard-content",children:a.jsxs("div",{className:"admin-page",children:[a.jsxs("div",{className:"admin-header",children:[a.jsx("h2",{children:"NIN Verification Requests"}),a.jsxs("div",{className:"admin-actions",children:[a.jsx("input",{type:"text",placeholder:"Search requests...",value:s,onChange:e=>c(e.target.value),className:"search-input"}),a.jsxs(t,{href:route("admin.nin.requests",{},!1),className:"btn btn-primary",children:[a.jsx("i",{className:"fas fa-refresh"})," Refresh"]})]})]}),a.jsxs("div",{className:"requests-table-container",children:[a.jsx("div",{className:"table-responsive",children:a.jsxs("table",{className:"admin-table",children:[a.jsx("thead",{children:a.jsxs("tr",{children:[a.jsx("th",{children:"ID"}),a.jsx("th",{children:"NIN"}),a.jsx("th",{children:"User"}),a.jsx("th",{children:"API Version"}),a.jsx("th",{children:"Search Type"}),a.jsx("th",{children:"Created At"}),a.jsx("th",{children:"Actions"})]})}),a.jsx("tbody",{children:m.map(e=>a.jsxs("tr",{children:[a.jsx("td",{children:e.id}),a.jsx("td",{children:e.nin||"N/A"}),a.jsx("td",{children:e.user?.name||"N/A"}),a.jsx("td",{children:e.api_version||"N/A"}),a.jsx("td",{children:e.search_type||"N/A"}),a.jsx("td",{children:x(e.created_at)}),a.jsx("td",{children:a.jsxs("div",{className:"action-buttons",children:[a.jsxs("button",{className:"btn btn-sm btn-primary",children:[a.jsx("i",{className:"fas fa-eye"}),"View"]}),a.jsxs("button",{className:"btn btn-sm btn-secondary",children:[a.jsx("i",{className:"fas fa-download"}),"Download"]})]})})]},e.id))})]})}),n?.links&&a.jsx("div",{className:"pagination",children:n.links.map((e,o)=>a.jsx(t,{href:e.url||"#",className:e.active?"pagination-link active":"pagination-link",dangerouslySetInnerHTML:{__html:e.label}},o))})]})]})})]})]}),a.jsx("style",{children:`
                .dashboard-layout {
                    display: flex;
                    min-height: 100vh;
                    background: #f8f9fa;
                }

                .sidebar {
                    width: 280px;
                    background: white;
                    box-shadow: 2px 0 10px rgba(0,0,0,0.1);
                    position: fixed;
                    height: 100vh;
                    left: 0;
                    top: 0;
                    z-index: 1000;
                }

                .sidebar-logo {
                    padding: 20px;
                    border-bottom: 1px solid #e5e7eb;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-weight: 700;
                    color: #1f2937;
                }

                .sidebar-menu {
                    padding: 20px 0;
                }

                .sidebar-link {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 15px 20px;
                    color: #6b7280;
                    text-decoration: none;
                    transition: all 0.2s ease;
                }

                .sidebar-link:hover,
                .sidebar-link.active {
                    background: #f3f4f6;
                    color: #059669;
                }

                .dashboard-main {
                    flex: 1;
                    margin-left: 280px;
                }

                .topbar {
                    background: white;
                    padding: 20px 30px;
                    border-bottom: 1px solid #e5e7eb;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .topbar-right {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }

                .user-profile {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .user-profile span {
                    font-weight: 500;
                    color: #374151;
                }

                .dashboard-content {
                    padding: 30px;
                }

                .admin-page {
                    padding: 0;
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

                .admin-actions {
                    display: flex;
                    gap: 15px;
                    align-items: center;
                }

                .search-input {
                    padding: 10px 15px;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    font-size: 14px;
                    width: 300px;
                }

                .search-input:focus {
                    border-color: #10b981;
                    outline: none;
                }

                .requests-table-container {
                    background: white;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    padding-bottom: 20px;
                }

                .table-responsive {
                    overflow-x: auto;
                    width: 100%;
                }

                .admin-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .admin-table th {
                    background: #f8fafc;
                    padding: 12px;
                    text-align: left;
                    font-weight: 600;
                    color: #374151;
                    border-bottom: 2px solid #e5e7eb;
                    white-space: nowrap;
                }

                .admin-table td {
                    padding: 12px;
                    border-bottom: 1px solid #f3f4f6;
                    white-space: nowrap;
                }

                .admin-table tr:hover {
                    background: #f9fafb;
                }

                .pagination {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin-top: 20px;
                    padding: 0 20px;
                }

                .pagination-link {
                    padding: 8px 12px;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    text-decoration: none;
                    color: #374151;
                }

                .pagination-link.active {
                    background: #10b981;
                    color: white;
                }

                .pagination-link:hover {
                    background: #f3f4f6;
                }

                .action-buttons {
                    display: flex;
                    gap: 8px;
                }

                .btn {
                    padding: 10px 18px;
                    border-radius: 6px;
                    text-decoration: none;
                    font-weight: 500;
                    font-size: 14px;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    border: none;
                    cursor: pointer;
                }

                .btn-sm {
                    padding: 6px 12px;
                    font-size: 12px;
                }

                .btn-secondary {
                    background: #6b7280;
                    color: white;
                }

                .btn-primary {
                    background: #059669;
                    color: white;
                }

                .sidebar-close-btn {
                    display: none !important;
                }

                /* Responsive Design */
                @media (max-width: 991px) {
                    .dashboard-layout {
                        flex-direction: column !important;
                    }

                    .sidebar {
                        position: fixed !important;
                        top: 0 !important;
                        left: -290px !important;
                        width: 280px !important;
                        height: 100vh !important;
                        z-index: 1000 !important;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                        box-shadow: 4px 0 15px rgba(0, 0, 0, 0.1) !important;
                        overflow-y: auto !important;
                        display: block !important;
                    }

                    .sidebar.open {
                        left: 0 !important;
                    }

                    .sidebar-logo {
                        display: flex !important;
                        justify-content: space-between !important;
                        align-items: center !important;
                        width: 100% !important;
                    }

                    .sidebar-close-btn {
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        background: transparent !important;
                        border: none !important;
                        font-size: 20px !important;
                        color: #ef4444 !important;
                        cursor: pointer !important;
                        padding: 4px !important;
                    }

                    .sidebar-menu {
                        position: static !important;
                        width: 100% !important;
                        padding-bottom: 30px !important;
                    }

                    .sidebar-toggle-btn {
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        background: transparent !important;
                        border: none !important;
                        font-size: 20px !important;
                        color: #374151 !important;
                        cursor: pointer !important;
                        padding: 8px !important;
                        margin-right: 15px !important;
                        border-radius: 6px !important;
                        transition: background-color 0.2s !important;
                    }

                    .sidebar-toggle-btn:hover {
                        background-color: #f3f4f6 !important;
                    }

                    .sidebar-overlay {
                        position: fixed !important;
                        top: 0 !important;
                        left: 0 !important;
                        width: 100vw !important;
                        height: 100vh !important;
                        background: rgba(0, 0, 0, 0.4) !important;
                        z-index: 999 !important;
                        backdrop-filter: blur(2px) !important;
                    }

                    .dashboard-main {
                        margin-left: 0 !important;
                        width: 100% !important;
                    }

                    .topbar {
                        padding: 15px 20px !important;
                        position: sticky !important;
                        top: 0 !important;
                        z-index: 100 !important;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.05) !important;
                    }

                    .topbar h3 {
                        font-size: 18px !important;
                    }

                    .dashboard-content {
                        padding: 20px 15px !important;
                    }

                    .admin-header {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        gap: 15px !important;
                        padding: 15px !important;
                    }

                    .admin-actions {
                        width: 100% !important;
                        flex-direction: column !important;
                        align-items: stretch !important;
                        gap: 10px !important;
                    }

                    .search-input {
                        width: 100% !important;
                    }

                    .btn {
                        width: 100% !important;
                        justify-content: center !important;
                    }

                    .action-buttons {
                        flex-direction: column !important;
                        gap: 4px !important;
                    }
                }

                @media (min-width: 992px) {
                    .sidebar-toggle-btn {
                        display: none !important;
                    }
                }
            `})]})};export{u as default};
