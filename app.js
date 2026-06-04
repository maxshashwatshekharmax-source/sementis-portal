/**
 * Sementis - Seed Production Management Portal Logic
 * SPA Controller and View Builder
 */

// Global Application State
let currentUser = null;
let currentCharts = {};
let activeLanguage = "en"; // 'en' or 'hi'

// Hindi Translations Map for Farmer View
const TRANSLATIONS = {
    en: {
        welcome: "Namaste,",
        earnings: "Total Accrued Earnings",
        registerBtn: "Register New Crop Field",
        activeCrops: "Your Cultivated Fields",
        sowingGuide: "Seed Cultivation Guidelines",
        guideTitle: "Standard Seed Sowing Isolation Checklist",
        guideDesc: "Critical instructions to maintain genetic purity and pass inspection.",
        guideP1: "Maintain a minimum isolation distance of 3 meters from other wheat varieties to prevent pollen cross-contamination.",
        guideP2: "Use only approved Foundation/Breeder source seed tag tags provided at registration. Save physical tags.",
        guideP3: "Ensure mechanical rogueing: uproot and remove off-type plants and visual weeds before the flowering stage.",
        guideP4: "Keep soil moisture adequate but avoid waterlogging during germination and flowering stages.",
        langBtn: "हिन्दी (Hindi)",
        farmerFields: "Cultivated Fields",
        step1: "Field Registered",
        step2: "Crop Sown",
        step3: "Inspected & Approved",
        step4: "Harvest Completed",
        step5: "Processed in Plant",
        step6: "Quality Certified",
        step7: "Farmer Payout Disbursed",
        area: "Area",
        acres: "Acres",
        sownOn: "Sown on",
        status: "Status"
    },
    hi: {
        welcome: "नमस्ते,",
        earnings: "कुल अर्जित कमाई",
        registerBtn: "नया फसल खेत पंजीकृत करें",
        activeCrops: "आपके खेती वाले खेत",
        sowingGuide: "बीज खेती दिशानिर्देश",
        guideTitle: "मानक बीज बुआई अलगाव चेकलिस्ट",
        guideDesc: "आनुवंशिक शुद्धता बनाए रखने और निरीक्षण पास करने के लिए महत्वपूर्ण निर्देश।",
        guideP1: "पराग पार-दूषण को रोकने के लिए अन्य गेहूं की किस्मों से कम से कम 3 मीटर की अलगाव दूरी बनाए रखें।",
        guideP2: "पंजीकरण के समय प्रदान किए गए केवल अनुमोदित फाउंडेशन/ब्रीडर स्रोत बीज टैग का उपयोग करें। भौतिक टैग सुरक्षित रखें।",
        guideP3: "यांत्रिक रोगिंग सुनिश्चित करें: फूल आने की अवस्था से पहले भिन्न प्रकार के पौधों और खरपतवारों को उखाड़कर हटा दें।",
        guideP4: "अंकुरण और फूल आने की अवस्था के दौरान मिट्टी में पर्याप्त नमी सुनिश्चित करें लेकिन जलभराव से बचें।",
        langBtn: "English",
        farmerFields: "खेती वाले खेत",
        step1: "खेत पंजीकृत किया गया",
        step2: "फसल बोई गई",
        step3: "निरीक्षण और स्वीकृत",
        step4: "कटाई पूरी हुई",
        step5: "संयंत्र में संसाधित",
        step6: "गुणवत्ता प्रमाणित",
        step7: "किसान भुगतान वितरित",
        area: "क्षेत्रफल",
        acres: "एकड़",
        sownOn: "बुआई की तारीख",
        status: "स्थिति"
    }
};

// Document Loaded Init
document.addEventListener("DOMContentLoaded", () => {
    initApp();
    bindEvents();
});

// App Initialization
function initApp() {
    // Check if session exists (simplified by role selector)
    const savedUser = sessionStorage.getItem("sp_session_user");
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        document.getElementById("role-switcher").value = currentUser.role;
        setupUserSession(currentUser);
    } else {
        showLoginView();
    }
    // Set Lucide Icons
    lucide.createIcons();
}

// Bind Global UI Events
function bindEvents() {
    document.getElementById("login-form").addEventListener("submit", handleLogin);

    // Toggle Evaluator Demo Mode Controls
    document.getElementById("btn-toggle-demo").addEventListener("click", () => {
        document.body.classList.toggle("show-demo-controls");
        const btn = document.getElementById("btn-toggle-demo");
        if (document.body.classList.contains("show-demo-controls")) {
            btn.innerHTML = `<i data-lucide="settings"></i> Hide Evaluator Demo Mode`;
        } else {
            btn.innerHTML = `<i data-lucide="settings"></i> Show Evaluator Demo Mode`;
        }
        lucide.createIcons();
    });

    // Toggle to Sign Up form
    document.getElementById("link-show-signup").addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("login-form").classList.add("hidden");
        document.getElementById("signup-form").classList.remove("hidden");
        document.getElementById("demo-login-panel").classList.add("hidden");
        lucide.createIcons();
    });

    // Toggle to Sign In form
    document.getElementById("link-show-signin").addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("signup-form").classList.add("hidden");
        document.getElementById("login-form").classList.remove("hidden");
        document.getElementById("demo-login-panel").classList.remove("hidden");
        lucide.createIcons();
    });

    // Toggle farmer fields dynamically in registration
    document.getElementById("reg-role").addEventListener("change", (e) => {
        const isFarmer = e.target.value === "farmer";
        document.getElementById("signup-farmer-fields").classList.toggle("hidden", !isFarmer);
        const farmerInputs = document.querySelectorAll("#signup-farmer-fields input");
        farmerInputs.forEach(input => {
            if (isFarmer) input.setAttribute("required", "");
            else input.removeAttribute("required");
        });
    });

    // Signup form submit
    document.getElementById("signup-form").addEventListener("submit", handleSignUp);

    // Quick Login Demo buttons
    document.querySelectorAll(".demo-login-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const username = btn.dataset.user;
            const users = SeedPortalDB.getUsers();
            const user = users.find(u => u.username === username);
            if (user) {
                document.getElementById("username").value = user.username;
                document.getElementById("password").value = "123";
                handleLogin(new Event("submit"));
            }
        });
    });

    // Logout button
    document.getElementById("logout-btn").addEventListener("click", handleLogout);

    // Evaluator Role Switcher
    document.getElementById("role-switcher").addEventListener("change", (e) => {
        const selectedRole = e.target.value;
        const users = SeedPortalDB.getUsers();
        let user;
        if (selectedRole === "admin") user = users.find(u => u.role === "admin");
        else if (selectedRole === "manager") user = users.find(u => u.role === "manager");
        else if (selectedRole === "officer") user = users.find(u => u.username === "officer1");
        else if (selectedRole === "farmer") user = users.find(u => u.username === "farmer1");
        else if (selectedRole === "lab") user = users.find(u => u.role === "lab");
        else if (selectedRole === "warehouse") user = users.find(u => u.role === "warehouse");

        if (user) {
            setupUserSession(user);
        }
    });

    // Theme Toggle
    document.getElementById("theme-toggle").addEventListener("click", toggleTheme);

    // Sidebar Mobile Toggle
    document.getElementById("sidebar-toggle").addEventListener("click", () => {
        document.getElementById("app-sidebar").classList.toggle("active");
        document.getElementById("sidebar-overlay").classList.toggle("active");
    });
    
    document.getElementById("sidebar-overlay").addEventListener("click", () => {
        document.getElementById("app-sidebar").classList.remove("active");
        document.getElementById("sidebar-overlay").classList.remove("active");
    });

    // Notifications menu toggle
    document.getElementById("notification-bell").addEventListener("click", (e) => {
        e.stopPropagation();
        document.getElementById("notifications-dropdown").classList.toggle("hidden");
    });

    document.addEventListener("click", () => {
        document.getElementById("notifications-dropdown").classList.add("hidden");
    });

    document.getElementById("notifications-dropdown").addEventListener("click", (e) => {
        e.stopPropagation();
    });

    document.getElementById("mark-all-read-btn").addEventListener("click", () => {
        SeedPortalDB.markNotificationsAsRead(currentUser.role, currentUser.id);
        renderNotifications();
    });

    // Modals generic close trigger
    document.querySelectorAll(".close-modal-trigger").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            closeModal();
        });
    });

    // Admin View Actions
    document.getElementById("btn-add-user").addEventListener("click", () => {
        openModal("modal-add-user");
    });
    document.getElementById("new-user-role").addEventListener("change", (e) => {
        const isFarmer = e.target.value === "farmer";
        document.getElementById("farmer-only-fields").classList.toggle("hidden", !isFarmer);
    });
    document.getElementById("form-add-user").addEventListener("submit", handleAddUser);
    document.getElementById("user-search").addEventListener("input", renderUsersList);
    document.getElementById("user-role-filter").addEventListener("change", renderUsersList);

    // Production Manager View Actions
    document.getElementById("btn-add-plan").addEventListener("click", () => {
        populateCropsSelect("plan-crop-select");
        openModal("modal-add-plan");
    });
    document.getElementById("form-add-plan").addEventListener("submit", handleAddPlan);
    document.getElementById("plan-season-filter").addEventListener("change", renderCropsAndPlans);
    document.getElementById("field-search").addEventListener("input", renderFieldsList);
    document.getElementById("field-status-filter").addEventListener("change", renderFieldsList);

    // Field Officer View Actions
    document.getElementById("photo-upload-trigger").addEventListener("click", () => {
        document.getElementById("ins-photo-file").click();
    });
    document.getElementById("ins-photo-file").addEventListener("change", handlePhotoSelection);
    document.getElementById("btn-retake-photo").addEventListener("click", removeInspectionPhoto);
    document.getElementById("form-add-inspection").addEventListener("submit", handleSaveInspection);
    document.getElementById("form-record-harvest").addEventListener("submit", handleRecordHarvest);
    
    // Calculate cleaning shrinkage automatically
    const rawQtyInput = document.getElementById("harv-raw-qty");
    const procQtyInput = document.getElementById("harv-proc-qty");
    const lossInput = document.getElementById("harv-loss");
    const updateLoss = () => {
        const raw = parseFloat(rawQtyInput.value) || 0;
        const proc = parseFloat(procQtyInput.value) || 0;
        lossInput.value = Math.max(0, (raw - proc)).toFixed(1);
    };
    rawQtyInput.addEventListener("input", updateLoss);
    procQtyInput.addEventListener("input", updateLoss);

    // Farmer View Actions
    document.getElementById("btn-lang-toggle").addEventListener("click", toggleFarmerLanguage);
    document.getElementById("btn-farmer-register-field").addEventListener("click", () => {
        populateCropsSelect("ff-crop-select");
        openModal("modal-farmer-field");
    });
    document.getElementById("btn-gps-trigger").addEventListener("click", triggerGPSCapture);
    document.getElementById("form-farmer-field").addEventListener("submit", handleFarmerFieldRegistration);

    // Quality Lab Actions
    document.getElementById("form-lab-test").addEventListener("submit", handleSaveLabTest);
    
    // Show rejection text-box if parameters fail
    const germInput = document.getElementById("lab-germination");
    const purInput = document.getElementById("lab-purity");
    const moistInput = document.getElementById("lab-moisture");
    const checkLabThresholds = () => {
        const lotId = document.getElementById("lab-lot-id").value;
        const lot = SeedPortalDB.getLots().find(l => l.id === lotId);
        if (!lot) return;
        const field = SeedPortalDB.getFieldWithRelations(lot.fieldId);
        if (!field) return;

        const gVal = parseInt(germInput.value) || 0;
        const pVal = parseFloat(purInput.value) || 0;
        const mVal = parseFloat(moistInput.value) || 0;

        const gFailed = gVal < field.crop.standardGermination;
        const pFailed = pVal < field.crop.standardPurity;
        const mFailed = mVal > field.crop.standardMoisture;

        document.getElementById("fail-reason-container").classList.toggle("hidden", !(gFailed || pFailed || mFailed));
    };
    germInput.addEventListener("input", checkLabThresholds);
    purInput.addEventListener("input", checkLabThresholds);
    moistInput.addEventListener("input", checkLabThresholds);

    // Warehouse Actions
    document.getElementById("btn-simulate-dispatch").addEventListener("click", () => {
        populateInventorySelect("disp-inv-select");
        openModal("modal-dispatch");
    });
    document.getElementById("disp-inv-select").addEventListener("change", (e) => {
        const invId = e.target.value;
        const item = SeedPortalDB.getInventory().find(v => v.id === invId);
        if (item) {
            document.getElementById("disp-max-qty").innerText = `Available: ${item.stockQty}kg`;
            document.getElementById("disp-qty").max = item.stockQty;
        }
    });
    document.getElementById("form-dispatch").addEventListener("submit", handleDispatchOrder);
    document.getElementById("inventory-search").addEventListener("input", renderInventoryList);
    document.getElementById("btn-print-qr").addEventListener("click", () => {
        alert("Simulating Print Dialog... Ticket Tag printed successfully!");
    });

    // Reports Actions
    document.getElementById("btn-generate-report").addEventListener("click", generateReportData);
    document.getElementById("btn-report-excel").addEventListener("click", () => alert("Exporting report as Excel spreadsheet (.xlsx)..."));
    document.getElementById("btn-report-pdf").addEventListener("click", () => alert("Initiating PDF Export printer layout..."));

    // Quick Inspect shortcut in Dashboard
    document.getElementById("btn-quick-inspect").addEventListener("click", () => {
        const switcher = document.getElementById("role-switcher");
        switcher.value = "officer";
        switcher.dispatchEvent(new Event("change"));
    });
}

// Dynamic Theme Switcher
function toggleTheme() {
    const htmlEl = document.documentElement;
    const currentTheme = htmlEl.getAttribute("data-theme");
    const nextTheme = currentTheme === "light" ? "dark" : "light";
    
    htmlEl.setAttribute("data-theme", nextTheme);
    
    const darkIcon = document.querySelector(".theme-icon-dark");
    const lightIcon = document.querySelector(".theme-icon-light");
    
    if (nextTheme === "dark") {
        darkIcon.classList.add("hidden");
        lightIcon.classList.remove("hidden");
    } else {
        darkIcon.classList.remove("hidden");
        lightIcon.classList.add("hidden");
    }

    // Rerender charts to update grid color contrasts
    if (currentUser && (currentUser.role === "admin" || currentUser.role === "manager")) {
        renderDashboardCharts();
    }
}

// User Authentication Handlers
function handleSignUp(e) {
    e.preventDefault();
    const name = document.getElementById("reg-name").value;
    const username = document.getElementById("reg-username").value.trim().toLowerCase();
    const role = document.getElementById("reg-role").value;
    const phone = document.getElementById("reg-phone").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;

    const duplicate = SeedPortalDB.getUsers().find(u => u.username === username);
    const signupError = document.getElementById("signup-error");
    const signupSuccess = document.getElementById("signup-success");

    if (duplicate) {
        signupError.classList.remove("hidden");
        signupSuccess.classList.add("hidden");
        return;
    }
    signupError.classList.add("hidden");

    const newUser = {
        name,
        username,
        password,
        role,
        phone,
        email,
        language: "en",
        status: "Active"
    };

    if (role === "farmer") {
        newUser.location = document.getElementById("reg-location").value || "Unknown";
        newUser.landArea = parseFloat(document.getElementById("reg-area").value) || 0;
        newUser.bankAccount = document.getElementById("reg-bank").value || "N/A";
        newUser.cropHistory = "None";
        newUser.agreementDate = new Date().toISOString().split('T')[0];
        newUser.rating = 5.0;
        newUser.balance = 0;
    }

    const registeredUser = SeedPortalDB.addUser(newUser);
    signupSuccess.classList.remove("hidden");

    setTimeout(() => {
        signupSuccess.classList.add("hidden");
        currentUser = registeredUser;
        sessionStorage.setItem("sp_session_user", JSON.stringify(registeredUser));
        document.getElementById("role-switcher").value = registeredUser.role;
        
        // Reset forms and view panels
        document.getElementById("signup-form").reset();
        document.getElementById("signup-form").classList.add("hidden");
        document.getElementById("login-form").classList.remove("hidden");
        document.getElementById("demo-login-panel").classList.remove("hidden");

        setupUserSession(registeredUser);
    }, 1500);
}

function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById("username").value.trim().toLowerCase();
    const users = SeedPortalDB.getUsers();
    
    const matchedUser = users.find(u => u.username === username && u.status === "Active");
    if (matchedUser) {
        document.getElementById("login-error").classList.add("hidden");
        currentUser = matchedUser;
        sessionStorage.setItem("sp_session_user", JSON.stringify(matchedUser));
        document.getElementById("role-switcher").value = matchedUser.role;
        setupUserSession(matchedUser);
    } else {
        const errorBanner = document.getElementById("login-error");
        errorBanner.classList.remove("hidden");
    }
}

function handleLogout() {
    sessionStorage.removeItem("sp_session_user");
    currentUser = null;
    showLoginView();
}

function showLoginView() {
    document.getElementById("app-shell").classList.add("hidden");
    document.getElementById("view-login").classList.remove("hidden");
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("signup-form").classList.add("hidden");
    document.getElementById("login-form").classList.remove("hidden");
    document.getElementById("demo-login-panel").classList.remove("hidden");
}

// Role views loader and routing
function setupUserSession(user) {
    document.getElementById("view-login").classList.add("hidden");
    document.getElementById("app-shell").classList.remove("hidden");

    // Clear and construct sidebar menu based on roles
    buildSidebarMenu(user.role);

    // Profile metadata
    document.getElementById("header-user-name").innerText = user.name;
    document.getElementById("header-user-role").innerText = getRoleLabel(user.role);
    document.getElementById("header-avatar").innerText = getAvatarAbbr(user.name);

    // Trigger Notification Sync
    renderNotifications();

    // Route to default dashboard view
    const defaultViews = {
        admin: "view-dashboard",
        manager: "view-dashboard",
        officer: "view-inspections",
        farmer: "view-farmer-portal",
        lab: "view-lab",
        warehouse: "view-inventory"
    };

    switchView(defaultViews[user.role]);
    
    // Close mobile side drawer
    document.getElementById("app-sidebar").classList.remove("active");
    document.getElementById("sidebar-overlay").classList.remove("active");
}

function switchView(viewId) {
    // Hide all view screens
    document.querySelectorAll(".content-view").forEach(view => {
        view.classList.add("hidden");
    });
    
    // Show active screen
    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.remove("hidden");
    }

    // Set Active State in Sidebar links
    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.toggle("active", link.dataset.view === viewId);
    });

    // Populate data depending on view loaded
    if (viewId === "view-dashboard") renderDashboardStats();
    else if (viewId === "view-users") renderUsersList();
    else if (viewId === "view-plans") renderCropsAndPlans();
    else if (viewId === "view-fields") renderFieldsList();
    else if (viewId === "view-inspections") renderInspectionsSection();
    else if (viewId === "view-lab") renderLabSection();
    else if (viewId === "view-inventory") renderInventoryList();
    else if (viewId === "view-farmer-portal") renderFarmerPortal();

    // Rerender icons
    lucide.createIcons();
}

// Generate dynamic sidebar options based on role
function buildSidebarMenu(role) {
    const menuContainer = document.getElementById("sidebar-menu");
    menuContainer.innerHTML = "";

    const menus = {
        admin: [
            { text: "Dashboard", view: "view-dashboard", icon: "layout-dashboard" },
            { text: "User Directory", view: "view-users", icon: "users" },
            { text: "Crop Planning", view: "view-plans", icon: "calendar" },
            { text: "Cultivated Fields", view: "view-fields", icon: "map" },
            { text: "Warehouse Stock", view: "view-inventory", icon: "package" },
            { text: "Reports Ledger", view: "view-reports", icon: "trending-up" }
        ],
        manager: [
            { text: "Dashboard", view: "view-dashboard", icon: "layout-dashboard" },
            { text: "Crop Planning", view: "view-plans", icon: "calendar" },
            { text: "Cultivated Fields", view: "view-fields", icon: "map" },
            { text: "Warehouse Stock", view: "view-inventory", icon: "package" },
            { text: "Reports Ledger", view: "view-reports", icon: "trending-up" }
        ],
        officer: [
            { text: "Inspections Queue", view: "view-inspections", icon: "clipboard-list" },
            { text: "Cultivated Fields", view: "view-fields", icon: "map" },
            { text: "Warehouse Stock", view: "view-inventory", icon: "package" }
        ],
        farmer: [
            { text: "Grower Portal", view: "view-farmer-portal", icon: "home" },
            { text: "Cultivated Fields", view: "view-fields", icon: "map" }
        ],
        lab: [
            { text: "Quality Testing Lab", view: "view-lab", icon: "shield-alert" },
            { text: "Warehouse Stock", view: "view-inventory", icon: "package" }
        ],
        warehouse: [
            { text: "Warehouse Stock", view: "view-inventory", icon: "package" },
            { text: "Reports Ledger", view: "view-reports", icon: "trending-up" }
        ]
    };

    const roleMenu = menus[role] || [];
    roleMenu.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="nav-link" data-view="${item.view}">
                <i data-lucide="${item.icon}"></i>
                <span>${item.text}</span>
            </div>
        `;
        li.querySelector(".nav-link").addEventListener("click", () => {
            switchView(item.view);
        });
        menuContainer.appendChild(li);
    });
}

// Helpers for users
function getRoleLabel(role) {
    const roles = {
        admin: "Administrator",
        manager: "Production Manager",
        officer: "Field Officer",
        farmer: "Farmer / Grower",
        lab: "Lab Quality Officer",
        warehouse: "Warehouse/Inventory Staff"
    };
    return roles[role] || role;
}

function getAvatarAbbr(name) {
    return name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
}

// Modal Toggle controllers
function openModal(modalId) {
    document.getElementById("modal-container").classList.remove("hidden");
    // Hide all modal forms
    document.querySelectorAll(".modal-content").forEach(content => {
        content.classList.add("hidden");
    });
    // Show active modal
    document.getElementById(modalId).classList.remove("hidden");
    lucide.createIcons();
}

function closeModal() {
    document.getElementById("modal-container").classList.add("hidden");
    // Clear forms
    document.querySelectorAll("form").forEach(form => form.reset());
    removeInspectionPhoto();
}

// Notifications Rendering & Event Handling
function renderNotifications() {
    const notifs = SeedPortalDB.getNotifications();
    const dropdownList = document.getElementById("notifications-list");
    const badge = document.getElementById("notification-badge");

    // Filter relevant notifications
    const relevantNotifs = notifs.filter(n => 
        n.userId === currentUser.id || 
        n.role === currentUser.role || 
        n.userId === "all" || 
        n.role === "all"
    );

    const unreadCount = relevantNotifs.filter(n => !n.read).length;
    if (unreadCount > 0) {
        badge.innerText = unreadCount;
        badge.classList.remove("hidden");
    } else {
        badge.classList.add("hidden");
    }

    dropdownList.innerHTML = "";
    if (relevantNotifs.length === 0) {
        dropdownList.innerHTML = `<div class="dropdown-item flex-center"><span class="text-secondary">No alerts found.</span></div>`;
        return;
    }

    relevantNotifs.forEach(n => {
        const item = document.createElement("div");
        item.className = `dropdown-item ${n.read ? '' : 'unread'}`;
        
        const icons = {
            success: "check-circle",
            danger: "x-circle",
            warning: "alert-triangle",
            info: "info"
        };
        const iconColors = {
            success: "text-success",
            danger: "text-danger",
            warning: "text-warning",
            info: "text-info"
        };

        item.innerHTML = `
            <i data-lucide="${icons[n.type] || 'info'}" class="activity-icon ${iconColors[n.type] || ''}"></i>
            <div class="dropdown-item-content">
                <span class="dropdown-item-title">${n.title}</span>
                <span class="dropdown-item-desc">${n.message}</span>
                <span class="dropdown-item-time">${n.date}</span>
            </div>
        `;
        
        item.addEventListener("click", () => {
            n.read = true;
            SeedPortalDB.saveData("notifications", notifs);
            renderNotifications();
        });

        dropdownList.appendChild(item);
    });
    lucide.createIcons();
}

// VIEW 1: Dashboard Stats & Charts
function renderDashboardStats() {
    const farmers = SeedPortalDB.getFarmers();
    const fields = SeedPortalDB.getFields();
    const inspections = SeedPortalDB.getInspections();
    const lots = SeedPortalDB.getLots();

    // Stats values
    document.getElementById("stat-farmers").innerText = farmers.length;
    
    const totalArea = fields.reduce((sum, f) => sum + f.area, 0);
    document.getElementById("stat-area").innerText = totalArea;

    // Wait, pending inspections are sown fields without a completed, recent inspection
    const activeFields = fields.filter(f => f.status === "Sown");
    document.getElementById("stat-inspections").innerText = activeFields.length;

    document.getElementById("stat-lots").innerText = lots.length;

    // Build critical fields table
    const tableBody = document.getElementById("dashboard-critical-table");
    tableBody.innerHTML = "";

    if (activeFields.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-secondary">All cultivation plots have completed inspection monitoring schedules.</td></tr>`;
    } else {
        activeFields.forEach(f => {
            const rel = SeedPortalDB.getFieldWithRelations(f.id);
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${f.id}</strong></td>
                <td>${rel.farmer ? rel.farmer.name : 'Unknown'}</td>
                <td>${rel.crop ? rel.crop.name : ''} (${f.variety})</td>
                <td>${f.area}</td>
                <td>${f.sowingDate}</td>
                <td><span class="badge-status status-sown">Needs Inspection</span></td>
            `;
            tableBody.appendChild(tr);
        });
    }

    // Build Alerts feed (Latest 4 alerts)
    const alertFeed = document.getElementById("dashboard-alerts-list");
    alertFeed.innerHTML = "";
    
    const alerts = SeedPortalDB.getNotifications().filter(n => n.type === "warning" || n.type === "danger").slice(0, 4);
    if (alerts.length === 0) {
        alertFeed.innerHTML = `<li class="text-center text-secondary py-4">No critical threat alerts registered.</li>`;
    } else {
        alerts.forEach(n => {
            const li = document.createElement("li");
            li.className = "activity-item";
            li.innerHTML = `
                <i data-lucide="alert-triangle" class="activity-icon text-warning"></i>
                <div class="activity-body">
                    <strong>${n.title}</strong>
                    <span>${n.message}</span>
                    <span class="activity-time">${n.date}</span>
                </div>
            `;
            alertFeed.appendChild(li);
        });
    }

    renderDashboardCharts();
    lucide.createIcons();
}

function renderDashboardCharts() {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const textThemeColor = isDark ? "#e2e8f0" : "#1e293b";
    const gridThemeColor = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)";

    // Chart 1: Acreage Target vs Registered Area
    const plans = SeedPortalDB.getPlans().filter(p => p.seasonId === "S-102"); // Active Rabi Season
    const crops = SeedPortalDB.getCrops();

    const chartLabels = plans.map(p => {
        const crop = crops.find(c => c.id === p.cropId);
        return `${crop ? crop.name : ''} (${p.variety})`;
    });
    const targetData = plans.map(p => p.targetArea);
    const actualData = plans.map(p => {
        // sum area of active registered fields for this variety
        const fields = SeedPortalDB.getFields().filter(f => f.variety === p.variety);
        return fields.reduce((sum, f) => sum + f.area, 0);
    });

    if (currentCharts.area) currentCharts.area.destroy();
    
    const ctx1 = document.getElementById("chart-area-target").getContext("2d");
    currentCharts.area = new Chart(ctx1, {
        type: "bar",
        data: {
            labels: chartLabels,
            datasets: [
                {
                    label: "Target Area (Acres)",
                    data: targetData,
                    backgroundColor: "rgba(100, 116, 139, 0.5)", // Slate
                    borderColor: "rgba(100, 116, 139, 0.8)",
                    borderWidth: 1,
                    borderRadius: 4
                },
                {
                    label: "Registered Cultivated Area",
                    data: actualData,
                    backgroundColor: "rgba(16, 185, 129, 0.75)", // Emerald
                    borderColor: "rgba(16, 185, 129, 1)",
                    borderWidth: 1,
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: textThemeColor, font: { family: "Inter", weight: 500 } }
                }
            },
            scales: {
                x: {
                    grid: { color: gridThemeColor },
                    ticks: { color: textThemeColor }
                },
                y: {
                    grid: { color: gridThemeColor },
                    ticks: { color: textThemeColor }
                }
            }
        }
    });

    // Chart 2: Quality Ratios (Passed vs Failed tests)
    const tests = SeedPortalDB.getTests();
    const passedCount = tests.filter(t => t.status === "Passed").length;
    const failedCount = tests.filter(t => t.status === "Failed").length;

    if (currentCharts.quality) currentCharts.quality.destroy();

    const ctx2 = document.getElementById("chart-quality-ratio").getContext("2d");
    currentCharts.quality = new Chart(ctx2, {
        type: "doughnut",
        data: {
            labels: ["Passed & Certified", "Rejected / Substandard"],
            datasets: [{
                data: [passedCount, failedCount],
                backgroundColor: [
                    "rgba(16, 185, 129, 0.75)", // Emerald
                    "rgba(239, 68, 68, 0.75)"  // Red
                ],
                borderColor: [
                    "rgba(16, 185, 129, 1)",
                    "rgba(239, 68, 68, 1)"
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "bottom",
                    labels: { color: textThemeColor, font: { family: "Inter", weight: 500 } }
                }
            },
            cutout: "70%"
        }
    });
}

// VIEW 2: Users Management
function renderUsersList() {
    const users = SeedPortalDB.getUsers();
    const query = document.getElementById("user-search").value.toLowerCase();
    const roleFilter = document.getElementById("user-role-filter").value;
    const tbody = document.getElementById("users-table-body");
    tbody.innerHTML = "";

    const filtered = users.filter(u => {
        const matchesQuery = u.name.toLowerCase().includes(query) || 
                             u.role.toLowerCase().includes(query) || 
                             u.phone.includes(query) || 
                             u.username.toLowerCase().includes(query);
        const matchesRole = roleFilter === "all" || u.role === roleFilter;
        return matchesQuery && matchesRole;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-secondary py-4">No matching users found in the system.</td></tr>`;
        return;
    }

    filtered.forEach(u => {
        const tr = document.createElement("tr");
        const badgeClass = u.status === "Active" ? "success" : "danger";
        tr.innerHTML = `
            <td><strong>${u.id}</strong></td>
            <td>
                <div class="user-profile-badge" style="border:0; padding:0;">
                    <div class="avatar avatar-sm">${getAvatarAbbr(u.name)}</div>
                    <div>
                        <strong style="display:block;">${u.name}</strong>
                        <span style="font-size:0.75rem; color:var(--text-secondary);">${u.email}</span>
                    </div>
                </div>
            </td>
            <td><span class="badge info">${getRoleLabel(u.role)}</span></td>
            <td><code>${u.username}</code></td>
            <td>${u.phone}</td>
            <td><span class="badge ${badgeClass}">${u.status}</span></td>
            <td>
                <div class="btn-group">
                    <button class="btn btn-secondary btn-sm" onclick="editUserStatus('${u.id}', '${u.status}')">
                        Toggle Status
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function handleAddUser(e) {
    e.preventDefault();
    const name = document.getElementById("new-user-name").value;
    const username = document.getElementById("new-user-username").value.trim().toLowerCase();
    const role = document.getElementById("new-user-role").value;
    const phone = document.getElementById("new-user-phone").value;
    const email = document.getElementById("new-user-email").value;
    
    // Check duplication
    const duplicate = SeedPortalDB.getUsers().find(u => u.username === username);
    if (duplicate) {
        alert("Username already registered!");
        return;
    }

    const newUser = {
        name,
        username,
        password: "123", // default password
        role,
        phone,
        email,
        language: "en",
        status: "Active"
    };

    if (role === "farmer") {
        newUser.location = document.getElementById("new-user-location").value || "Unknown";
        newUser.landArea = parseFloat(document.getElementById("new-user-area").value) || 0;
        newUser.bankAccount = document.getElementById("new-user-bank").value || "N/A";
        newUser.cropHistory = "None";
        newUser.agreementDate = new Date().toISOString().split('T')[0];
        newUser.rating = 5.0;
        newUser.balance = 0;
    }

    SeedPortalDB.addUser(newUser);
    closeModal();
    renderUsersList();
}

window.editUserStatus = function(userId, currentStatus) {
    const nextStatus = currentStatus === "Active" ? "Inactive" : "Active";
    SeedPortalDB.updateUser(userId, { status: nextStatus });
    renderUsersList();
};

// VIEW 3: Crop Planning view
function renderCropsAndPlans() {
    const plans = SeedPortalDB.getPlans();
    const crops = SeedPortalDB.getCrops();
    const seasons = SeedPortalDB.getSeasons();
    const seasonFilter = document.getElementById("plan-season-filter").value;
    const grid = document.getElementById("plans-grid-body");
    grid.innerHTML = "";

    const filteredPlans = plans.filter(p => seasonFilter === "all" || p.seasonId === seasonFilter);

    if (filteredPlans.length === 0) {
        grid.innerHTML = `<div class="card w-full text-center text-secondary py-8">No seed multiplication plans defined for this season.</div>`;
        return;
    }

    filteredPlans.forEach(p => {
        const crop = crops.find(c => c.id === p.cropId);
        const season = seasons.find(s => s.id === p.seasonId);
        
        // Calculate dynamic actual area from fields registered under this variety
        const fields = SeedPortalDB.getFields().filter(f => f.variety === p.variety);
        const actualArea = fields.reduce((sum, f) => sum + f.area, 0);
        const progressPercent = Math.min(100, Math.round((actualArea / p.targetArea) * 100));

        // Update database record dynamically for reporting consistency
        p.actualArea = actualArea;
        SeedPortalDB.saveData("plans", plans);

        const card = document.createElement("div");
        card.className = "plan-card";
        
        const badgeColors = {
            Active: "success",
            Completed: "info",
            Planning: "warning"
        };

        card.innerHTML = `
            <div>
                <div class="plan-header">
                    <div>
                        <h3>${crop ? crop.name : 'Unknown'}</h3>
                        <span class="text-secondary" style="font-size:0.8rem;">Variety: ${p.variety}</span>
                    </div>
                    <span class="badge ${badgeColors[p.status]}">${p.status}</span>
                </div>
                <div class="plan-body-stats">
                    <div class="plan-stat">
                        <span>Season:</span>
                        <strong>${season ? season.name : 'Unknown'}</strong>
                    </div>
                    <div class="plan-stat">
                        <span>Target Area:</span>
                        <strong>${p.targetArea} Acres</strong>
                    </div>
                    <div class="plan-stat">
                        <span>Expected Yield:</span>
                        <strong>${p.expectedProduction} Metric Tons</strong>
                    </div>
                    <div class="plan-stat">
                        <span>Registered Farmers Area:</span>
                        <strong>${actualArea} / ${p.targetArea} Acres (${progressPercent}%)</strong>
                    </div>
                    <div class="progress-bar-outer">
                        <div class="progress-bar-inner" style="width: ${progressPercent}%;"></div>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function handleAddPlan(e) {
    e.preventDefault();
    const cropId = document.getElementById("plan-crop-select").value;
    const variety = document.getElementById("plan-crop-select").selectedOptions[0].dataset.variety;
    const seasonId = document.getElementById("plan-season-select").value;
    const targetArea = parseInt(document.getElementById("plan-target-area").value);
    const expectedProduction = parseInt(document.getElementById("plan-expected-qty").value);

    SeedPortalDB.addPlan({
        cropId,
        variety,
        seasonId,
        targetArea,
        expectedProduction,
        actualArea: 0,
        status: seasonId === "S-102" ? "Active" : "Planning"
    });

    closeModal();
    renderCropsAndPlans();
}

// VIEW 4: Cultivated Fields View
function renderFieldsList() {
    const fields = SeedPortalDB.getFields();
    const query = document.getElementById("field-search").value.toLowerCase();
    const statusFilter = document.getElementById("field-status-filter").value;
    const tbody = document.getElementById("fields-table-body");
    tbody.innerHTML = "";

    const filtered = fields.filter(f => {
        const rel = SeedPortalDB.getFieldWithRelations(f.id);
        const farmerName = rel.farmer ? rel.farmer.name.toLowerCase() : '';
        
        const matchesQuery = f.id.toLowerCase().includes(query) || 
                             farmerName.includes(query) || 
                             f.variety.toLowerCase().includes(query);
        const matchesStatus = statusFilter === "all" || f.status === statusFilter;
        return matchesQuery && matchesStatus;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="text-center text-secondary py-4">No registered fields correspond to the search options.</td></tr>`;
        return;
    }

    filtered.forEach(f => {
        const rel = SeedPortalDB.getFieldWithRelations(f.id);
        const tr = document.createElement("tr");

        let actionBtn = "";
        // Show Field Officer / Manager options to record monitoring details
        if (currentUser.role === "officer" && f.status === "Sown") {
            actionBtn = `
                <button class="btn btn-primary btn-sm" onclick="openInspectionModal('${f.id}')">
                    <i data-lucide="clipboard-check"></i> Inspect
                </button>
            `;
        } else if (currentUser.role === "officer" && f.status === "Inspected") {
            actionBtn = `
                <button class="btn btn-secondary btn-sm" onclick="openHarvestModal('${f.id}')">
                    <i data-lucide="scissors"></i> Record Harvest
                </button>
            `;
        } else {
            actionBtn = `<button class="btn btn-secondary btn-sm" onclick="viewFieldDetails('${f.id}')">Details</button>`;
        }

        const statusBadges = {
            Registered: "badge-status status-registered",
            Sown: "badge-status status-sown",
            Inspected: "badge-status status-inspected",
            Harvested: "badge-status status-harvested"
        };

        tr.innerHTML = `
            <td><strong>${f.id}</strong></td>
            <td>${rel.farmer ? rel.farmer.name : 'Unknown'}</td>
            <td>${rel.crop ? rel.crop.name : ''} (<code>${f.variety}</code>)</td>
            <td>${f.area}</td>
            <td>${f.sowingDate}</td>
            <td><small><code>${f.gpsCoords}</code></small></td>
            <td><small>${f.seedSource}</small></td>
            <td><span class="${statusBadges[f.status] || ''}">${f.status}</span></td>
            <td>${actionBtn}</td>
        `;
        tbody.appendChild(tr);
    });
    lucide.createIcons();
}

window.viewFieldDetails = function(fieldId) {
    const rel = SeedPortalDB.getFieldWithRelations(fieldId);
    if (!rel) return;
    
    let message = `Field Report Details [${rel.id}]:\n`;
    message += `Grower: ${rel.farmer ? rel.farmer.name : 'Unknown'}\n`;
    message += `Crop Strain: ${rel.crop ? rel.crop.name : ''} - ${rel.variety}\n`;
    message += `Acreage: ${rel.area} Acres\n`;
    message += `GPS Coordinate: ${rel.gpsCoords}\n`;
    message += `Sowing Date: ${rel.sowingDate}\n\n`;

    if (rel.inspections.length > 0) {
        message += `Field Visits Completed (${rel.inspections.length}):\n`;
        rel.inspections.forEach(i => {
            message += `- Stage: ${i.growthStage} | Date: ${i.date} | Status: ${i.status}\n  Remarks: ${i.notes}\n`;
        });
    } else {
        message += `No active inspections recorded.`;
    }
    alert(message);
};

// VIEW 5: Field Officer Inspections Section
function renderInspectionsSection() {
    const fields = SeedPortalDB.getFields();
    const queueList = document.getElementById("inspections-queue-list");
    const historyList = document.getElementById("inspections-history-list");

    queueList.innerHTML = "";
    historyList.innerHTML = "";

    // Inspections Backlog Queue (Fields in Sown or Inspected state)
    const backlog = fields.filter(f => f.status === "Sown" || f.status === "Inspected");
    if (backlog.length === 0) {
        queueList.innerHTML = `<div class="text-secondary text-center py-4">No fields awaiting inspections. All up-to-date!</div>`;
    } else {
        backlog.forEach(f => {
            const rel = SeedPortalDB.getFieldWithRelations(f.id);
            const card = document.createElement("div");
            card.className = "queue-card";
            
            let actionBtn = "";
            if (f.status === "Sown") {
                actionBtn = `
                    <button class="btn btn-primary btn-sm mt-4" onclick="openInspectionModal('${f.id}')">
                        <i data-lucide="clipboard-check"></i> Record Inspection visit
                    </button>
                `;
            } else if (f.status === "Inspected") {
                actionBtn = `
                    <button class="btn btn-secondary btn-sm mt-4" onclick="openHarvestModal('${f.id}')">
                        <i data-lucide="scissors"></i> Log Harvest & Process Lot
                    </button>
                `;
            }

            card.innerHTML = `
                <div class="queue-header">
                    <span class="queue-field-id">${f.id}</span>
                    <span class="badge ${f.status === 'Sown' ? 'warning' : 'success'}">${f.status === 'Sown' ? 'Needs visit' : 'Approved'}</span>
                </div>
                <div class="queue-row">
                    <span class="text-secondary">Grower:</span>
                    <strong>${rel.farmer ? rel.farmer.name : 'Unknown'}</strong>
                </div>
                <div class="queue-row">
                    <span class="text-secondary">Crop Variety:</span>
                    <strong>${rel.crop ? rel.crop.name : ''} - ${f.variety}</strong>
                </div>
                <div class="queue-row">
                    <span class="text-secondary">Location/GPS:</span>
                    <span>${f.gpsCoords}</span>
                </div>
                <div class="queue-row">
                    <span class="text-secondary">Sown on:</span>
                    <span>${f.sowingDate}</span>
                </div>
                ${actionBtn}
            `;
            queueList.appendChild(card);
        });
    }

    // Historical Inspections feed
    const inspections = SeedPortalDB.getInspections();
    if (inspections.length === 0) {
        historyList.innerHTML = `<div class="text-secondary text-center py-4">No visit records created in system database.</div>`;
    } else {
        inspections.forEach(i => {
            const fieldRel = SeedPortalDB.getFieldWithRelations(i.fieldId);
            const officer = SeedPortalDB.getUsers().find(u => u.id === i.officerId);
            
            const card = document.createElement("div");
            card.className = "history-item";
            card.innerHTML = `
                <div class="history-item-header">
                    <div>
                        <strong>Field ID: ${i.fieldId}</strong>
                        <span class="text-secondary" style="font-size:0.75rem; display:block;">Visit date: ${i.date} by ${officer ? officer.name : 'Officer'}</span>
                    </div>
                    <span class="badge ${i.status === 'Approved' ? 'success' : 'danger'}">${i.status}</span>
                </div>
                <div class="queue-row">
                    <span class="text-secondary">Growth Stage:</span>
                    <strong>${i.growthStage}</strong>
                </div>
                <div class="queue-row">
                    <span class="text-secondary">Pest/Disease Info:</span>
                    <strong>${i.pestDiseaseReport}</strong>
                </div>
                <div class="queue-row">
                    <span class="text-secondary">Moisture Meter:</span>
                    <span>${i.moistureLevel}%</span>
                </div>
                <div class="history-item-notes">
                    <em>Remarks:</em> ${i.notes}
                </div>
                ${i.photoUrl ? `<img class="history-item-img" src="${i.photoUrl}" alt="Field Photo">` : ''}
            `;
            historyList.appendChild(card);
        });
    }
    lucide.createIcons();
}

window.openInspectionModal = function(fieldId) {
    const f = SeedPortalDB.getFields().find(fields => fields.id === fieldId);
    if (!f) return;
    const rel = SeedPortalDB.getFieldWithRelations(fieldId);

    document.getElementById("ins-field-id").value = fieldId;
    document.getElementById("ins-field-text").innerText = `Field ID: ${fieldId} (${rel.farmer ? rel.farmer.name : ''}, ${rel.crop ? rel.crop.name : ''} - ${f.variety})`;
    
    openModal("modal-add-inspection");
};

function handlePhotoSelection(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const dataUrl = event.target.result;
            // Display preview box
            document.getElementById("photo-upload-trigger").classList.add("hidden");
            document.getElementById("photo-preview-container").classList.remove("hidden");
            document.getElementById("photo-preview-img").src = dataUrl;
        };
        reader.readAsDataURL(file);
    }
}

function removeInspectionPhoto() {
    document.getElementById("ins-photo-file").value = "";
    document.getElementById("photo-preview-img").src = "";
    document.getElementById("photo-preview-container").classList.add("hidden");
    document.getElementById("photo-upload-trigger").classList.remove("hidden");
}

function handleSaveInspection(e) {
    e.preventDefault();
    const fieldId = document.getElementById("ins-field-id").value;
    const growthStage = document.getElementById("ins-growth-stage").value;
    const moistureLevel = parseFloat(document.getElementById("ins-moisture").value);
    const status = document.getElementById("ins-status").value;
    const pestDiseaseReport = document.getElementById("ins-pest").value;
    const notes = document.getElementById("ins-notes").value;
    const photoImg = document.getElementById("photo-preview-img").src;

    const newInspection = {
        fieldId,
        officerId: currentUser.id,
        date: new Date().toISOString().split('T')[0],
        growthStage,
        pestDiseaseReport,
        moistureLevel,
        status,
        notes,
        photoUrl: photoImg || "https://images.unsplash.com/photo-1599933333934-2e91244e6fae?auto=format&fit=crop&w=400&q=80" // Fallback standard agriculture photo
    };

    SeedPortalDB.addInspection(newInspection);
    closeModal();
    renderInspectionsSection();
}

window.openHarvestModal = function(fieldId) {
    const f = SeedPortalDB.getFields().find(fields => fields.id === fieldId);
    if (!f) return;
    const rel = SeedPortalDB.getFieldWithRelations(fieldId);

    document.getElementById("harv-field-id").value = fieldId;
    document.getElementById("harv-field-text").innerText = `Field ID: ${fieldId} (${rel.farmer ? rel.farmer.name : ''}, ${rel.crop ? rel.crop.name : ''} - ${f.variety})`;
    
    // Suggest default yields based on size (Roughly 12-18 quintals per acre)
    const suggestedHarvest = Math.round(f.area * 15);
    document.getElementById("harv-raw-qty").value = suggestedHarvest;
    document.getElementById("harv-proc-qty").value = Math.round(suggestedHarvest * 0.96);
    document.getElementById("harv-loss").value = Math.round(suggestedHarvest * 0.04);
    
    openModal("modal-record-harvest");
};

function handleRecordHarvest(e) {
    e.preventDefault();
    const fieldId = document.getElementById("harv-field-id").value;
    const harvestQty = parseFloat(document.getElementById("harv-raw-qty").value);
    const processedQty = parseFloat(document.getElementById("harv-proc-qty").value);
    const cleaningLoss = parseFloat(document.getElementById("harv-loss").value);
    const grade = document.getElementById("harv-grade").value;

    const newLot = {
        fieldId,
        harvestQty,
        processedQty,
        cleaningLoss,
        grade,
        processingDate: new Date().toISOString().split('T')[0],
        status: "Processed"
    };

    SeedPortalDB.addLot(newLot);
    closeModal();
    renderInspectionsSection();
}

// VIEW 6: Lab Quality Testing (Quality Officers)
function renderLabSection() {
    const lots = SeedPortalDB.getLots();
    const queueList = document.getElementById("lab-queue-list");
    const certsList = document.getElementById("lab-certificates-list");

    queueList.innerHTML = "";
    certsList.innerHTML = "";

    // Lab queue (lots in Processed status)
    const pendingLots = lots.filter(l => l.status === "Processed");
    if (pendingLots.length === 0) {
        queueList.innerHTML = `<div class="text-secondary text-center py-4">No processed lots awaiting testing. Clear pipeline!</div>`;
    } else {
        pendingLots.forEach(l => {
            const rel = SeedPortalDB.getLotWithRelations(l.id);
            const card = document.createElement("div");
            card.className = "queue-card";
            card.innerHTML = `
                <div class="queue-header">
                    <span class="queue-field-id">Lot: ${l.id}</span>
                    <span class="badge warning">Testing Pending</span>
                </div>
                <div class="queue-row">
                    <span class="text-secondary">Crop Variety:</span>
                    <strong>${rel.field ? rel.field.crop.name : ''} - ${rel.field ? rel.field.variety : ''}</strong>
                </div>
                <div class="queue-row">
                    <span class="text-secondary">Processed Qty:</span>
                    <strong>${l.processedQty} Quintals</strong>
                </div>
                <div class="queue-row">
                    <span class="text-secondary">Grading Level:</span>
                    <span>${l.grade}</span>
                </div>
                <button class="btn btn-primary btn-sm mt-4" onclick="openLabTestModal('${l.id}')">
                    <i data-lucide="flask-conical"></i> Enter Lab Results
                </button>
            `;
            queueList.appendChild(card);
        });
    }

    // Historical quality tests
    const tests = SeedPortalDB.getTests();
    if (tests.length === 0) {
        certsList.innerHTML = `<div class="text-secondary text-center py-4">No certified quality tests archived.</div>`;
    } else {
        tests.forEach(t => {
            const lotRel = SeedPortalDB.getLotWithRelations(t.lotId);
            const isPassed = t.status === "Passed";

            const card = document.createElement("div");
            card.className = `lab-cert-card ${isPassed ? '' : 'failed'}`;
            
            card.innerHTML = `
                <div class="cert-header">
                    <span>Cert No: <strong>${t.certNumber}</strong></span>
                    <span>Lot ID: <strong>${t.lotId}</strong></span>
                </div>
                <h4 class="${isPassed ? 'text-success' : 'text-danger'}">
                    ${isPassed ? '🌱 QUALITY CERTIFIED' : '❌ SUBSTANDARD REJECTED'}
                </h4>
                <div class="queue-row">
                    <span class="text-secondary">Crop Strain:</span>
                    <strong>${lotRel.field ? lotRel.field.crop.name : ''} (${lotRel.field ? lotRel.field.variety : ''})</strong>
                </div>
                
                <div class="cert-grid">
                    <div class="cert-stat">
                        <span class="cert-stat-val">${t.germination}%</span>
                        <span class="cert-stat-lbl">Germination</span>
                    </div>
                    <div class="cert-stat">
                        <span class="cert-stat-val">${t.purity}%</span>
                        <span class="cert-stat-lbl">Purity</span>
                    </div>
                    <div class="cert-stat">
                        <span class="cert-stat-val">${t.moisture}%</span>
                        <span class="cert-stat-lbl">Moisture</span>
                    </div>
                </div>

                ${!isPassed ? `<div class="history-item-notes text-danger" style="border-left-color:var(--danger-color);"><strong>Rejection cause:</strong> ${t.failReason}</div>` : ''}
                <div class="cert-header mt-4">
                    <span>Analyzed: ${t.testDate}</span>
                    <span>Tester: Dr. Verma</span>
                </div>
            `;
            certsList.appendChild(card);
        });
    }
    lucide.createIcons();
}

window.openLabTestModal = function(lotId) {
    const lot = SeedPortalDB.getLots().find(l => l.id === lotId);
    if (!lot) return;
    const rel = SeedPortalDB.getLotWithRelations(lotId);

    document.getElementById("lab-lot-id").value = lotId;
    document.getElementById("lab-lot-text").innerText = `Lot ID: ${lotId} (${rel.field ? rel.field.crop.name : ''} - ${rel.field ? rel.field.variety : ''}, ${lot.processedQty} Quintals)`;
    
    // Set placeholder standard guidelines hints
    document.getElementById("lab-germination-threshold").innerText = `Standard threshold: Min ${rel.field.crop.standardGermination}%`;
    document.getElementById("lab-purity-threshold").innerText = `Standard threshold: Min ${rel.field.crop.standardPurity}%`;
    document.getElementById("lab-moisture-threshold").innerText = `Standard threshold: Max ${rel.field.crop.standardMoisture}%`;

    // Suggest default passing scores for convenience
    document.getElementById("lab-germination").value = Math.floor(Math.random() * 10) + 87; // 87-96%
    document.getElementById("lab-purity").value = (98 + Math.random() * 1.8).toFixed(1); // 98.0-99.8%
    document.getElementById("lab-moisture").value = (10 + Math.random() * 1.5).toFixed(1); // 10.0-11.5%

    // Fire verification checks to trigger hide/show of fail box
    document.getElementById("lab-germination").dispatchEvent(new Event("input"));

    openModal("modal-lab-test");
};

function handleSaveLabTest(e) {
    e.preventDefault();
    const lotId = document.getElementById("lab-lot-id").value;
    const germination = parseInt(document.getElementById("lab-germination").value);
    const purity = parseFloat(document.getElementById("lab-purity").value);
    const moisture = parseFloat(document.getElementById("lab-moisture").value);
    const failReason = document.getElementById("lab-fail-reason").value;

    const lot = SeedPortalDB.getLots().find(l => l.id === lotId);
    const field = SeedPortalDB.getFieldWithRelations(lot.fieldId);

    // Calculate pass/fail based on database thresholds
    const isPassed = germination >= field.crop.standardGermination && 
                     purity >= field.crop.standardPurity && 
                     moisture <= field.crop.standardMoisture;

    const status = isPassed ? "Passed" : "Failed";
    const certNumber = isPassed ? `CRT-${field.crop.name.substring(0,1).toUpperCase()}-${new Date().getFullYear()}-${lotId}` : "N/A";

    const newTest = {
        lotId,
        testerId: currentUser.id,
        testDate: new Date().toISOString().split('T')[0],
        germination,
        purity,
        moisture,
        status,
        certNumber,
        failReason: isPassed ? "" : (failReason || "Failed standard seed inspection limits.")
    };

    SeedPortalDB.addTest(newTest);
    closeModal();
    renderLabSection();
}

// VIEW 7: Inventory & Stock Management (Warehouse Staff)
function renderInventoryList() {
    const inv = SeedPortalDB.getInventory();
    const query = document.getElementById("inventory-search").value.toLowerCase();
    const tbody = document.getElementById("inventory-table-body");
    tbody.innerHTML = "";

    const filtered = inv.filter(v => {
        const lot = SeedPortalDB.getLotWithRelations(v.lotId);
        const cropName = lot.field ? lot.field.crop.name.toLowerCase() : '';
        const variety = lot.field ? lot.field.variety.toLowerCase() : '';

        return v.batchNumber.toLowerCase().includes(query) || 
               v.lotId.toLowerCase().includes(query) || 
               cropName.includes(query) || 
               variety.includes(query);
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="text-center text-secondary py-4">No matching seed inventory batches logged in warehouse.</td></tr>`;
        return;
    }

    filtered.forEach(v => {
        const lotRel = SeedPortalDB.getLotWithRelations(v.lotId);
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td><strong>${v.id}</strong></td>
            <td><strong>${v.lotId}</strong></td>
            <td>${lotRel.field ? lotRel.field.crop.name : ''} (<code>${lotRel.field ? lotRel.field.variety : ''}</code>)</td>
            <td><code>${v.batchNumber}</code></td>
            <td>${v.stockQty.toLocaleString()} kg</td>
            <td><span class="badge info">${v.packetSize}</span></td>
            <td>${v.warehouseLocation}</td>
            <td>${v.expiryDate}</td>
            <td>
                <div class="btn-group">
                    <button class="btn btn-secondary btn-sm" onclick="showQRLabel('${v.id}')">
                        <i data-lucide="qr-code"></i> Print Label
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
    lucide.createIcons();
}

window.showQRLabel = function(invId) {
    const item = SeedPortalDB.getInventory().find(v => v.id === invId);
    if (!item) return;
    const lotRel = SeedPortalDB.getLotWithRelations(item.lotId);

    document.getElementById("qr-lbl-batch").innerText = item.batchNumber;
    document.getElementById("qr-lbl-crop").innerText = `${lotRel.field ? lotRel.field.crop.name : ''} (${lotRel.field ? lotRel.field.variety : ''})`;
    document.getElementById("qr-lbl-lot").innerText = item.lotId;
    document.getElementById("qr-lbl-expiry").innerText = item.expiryDate;
    document.getElementById("qr-lbl-pkg").innerText = item.packetSize;

    // Draw vector simulated QR
    const qrContainer = document.getElementById("qr-code-graphic");
    qrContainer.innerHTML = `
        <svg width="80" height="80" viewBox="0 0 29 29" style="shape-rendering:crispEdges; fill:#000;">
            <path d="M0,0 h7 v7 h-7 z M2,2 v3 h3 v-3 z M0,22 h7 v7 h-7 z M2,24 v3 h3 v-3 z M22,0 h7 v7 h-7 z M24,2 v3 h3 v-3 z M9,0 h2 v2 h-2 z M13,0 h3 v2 h-3 z M18,0 h2 v2 h-2 z M9,4 h4 v2 h-4 z M15,4 h3 v2 h-3 z M19,4 h2 v2 h-2 z M9,8 h2 v3 h-2 z M13,9 h2 v2 h-2 z M17,8 h3 v2 h-3 z M22,9 h2 v2 h-2 z M26,8 h2 v2 h-2 z M9,13 h3 v2 h-3 z M14,13 h3 v2 h-3 z M19,12 h2 v3 h-2 z M23,13 h4 v2 h-4 z M0,18 h2 v2 h-2 z M4,18 h3 v2 h-3 z M9,18 h2 v2 h-2 z M13,18 h2 v2 h-2 z M17,18 h2 v2 h-2 z M22,17 h4 v2 h-4 z M10,22 h3 v3 h-3 z M15,22 h2 v2 h-2 z M19,23 h2 v2 h-2 z M24,22 h3 v3 h-3 z M11,26 h2 v2 h-2 z M15,26 h3 v2 h-3 z M20,26 h2 v2 h-2 z M24,26 h4 v2 h-4 z" />
        </svg>
    `;

    openModal("modal-qr-preview");
};

function handleDispatchOrder(e) {
    e.preventDefault();
    const invId = document.getElementById("disp-inv-select").value;
    const qty = parseInt(document.getElementById("disp-qty").value);
    const buyer = document.getElementById("disp-buyer").value;
    const destination = document.getElementById("disp-dest").value;

    const inventory = SeedPortalDB.getInventory();
    const index = inventory.findIndex(v => v.id === invId);
    if (index !== -1) {
        if (inventory[index].stockQty < qty) {
            alert("Error: Dispatch quantity exceeds current warehouse stock!");
            return;
        }

        // Deduct inventory
        inventory[index].stockQty -= qty;
        SeedPortalDB.saveData("inventory", inventory);

        // Add Notification
        SeedPortalDB.addNotification({
            userId: "U-02", // Production Manager
            role: "manager",
            title: "Seed Dispatch Success",
            message: `Dispatched ${qty}kg of batch ${inventory[index].batchNumber} to ${buyer} at ${destination}.`,
            type: "success"
        });

        alert("Dispatch logged. Warehouse inventory adjusted!");
        closeModal();
        renderInventoryList();
    }
}

// VIEW 8: Specialized Farmer Portal (Mobile-friendly)
function renderFarmerPortal() {
    // Sync translated visual text
    translateFarmerUI();

    const fields = SeedPortalDB.getFields().filter(f => f.farmerId === currentUser.id);
    const container = document.getElementById("farmer-fields-container");
    container.innerHTML = "";

    // Welcome title & balance details
    document.getElementById("farmer-display-name").innerText = currentUser.name;
    document.getElementById("farmer-balance").innerText = `₹${currentUser.balance.toLocaleString()}`;
    document.getElementById("farmer-bank").innerText = currentUser.bankAccount;

    if (fields.length === 0) {
        container.innerHTML = `
            <div class="card text-center text-secondary py-6">
                <p class="farmer-lbl-no-fields">You do not have any crop fields registered currently.</p>
            </div>
        `;
        return;
    }

    fields.forEach(f => {
        const rel = SeedPortalDB.getFieldWithRelations(f.id);
        const card = document.createElement("div");
        card.className = "farmer-crop-card";

        // Determine current progress index
        // Timeline stages: Registered -> Sown -> Inspected -> Harvested -> Processed -> Certified -> Paid
        const stages = [
            { key: "Registered", lbl: TRANSLATIONS[activeLanguage].step1, desc: "Acreage details approved by portal manager." },
            { key: "Sown", lbl: TRANSLATIONS[activeLanguage].step2, desc: "Crop sown. Scheduled for vegetative inspect." },
            { key: "Inspected", lbl: TRANSLATIONS[activeLanguage].step3, desc: "Field officer Rajesh/Sunita passed isolation." },
            { key: "Harvested", lbl: TRANSLATIONS[activeLanguage].step4, desc: "Harvest weights logged at processing yard." },
            { key: "Processed", lbl: TRANSLATIONS[activeLanguage].step5, desc: "Cleaned and graded seeds inside the plant." },
            { key: "Certified", lbl: TRANSLATIONS[activeLanguage].step6, desc: "Germination and purity checks passed." },
            { key: "Paid", lbl: TRANSLATIONS[activeLanguage].step7, desc: "MSP premium payment transferred to bank." }
        ];

        let activeIndex = 0;
        if (f.status === "Registered") activeIndex = 0;
        else if (f.status === "Sown") activeIndex = 1;
        else if (f.status === "Inspected") activeIndex = 2;
        else if (f.status === "Harvested") {
            activeIndex = 3;
            // check processed lots status
            if (rel.lot) {
                if (rel.lot.status === "Processed") activeIndex = 4;
                else if (rel.lot.status === "Certified") activeIndex = 6; // Passed and paid
                else if (rel.lot.status === "Rejected") activeIndex = 5; // Rejected lab state
            }
        }

        // Build vertical stepper HTML
        let stepperHtml = "";
        stages.forEach((stage, idx) => {
            let stateClass = "";
            if (idx < activeIndex) stateClass = "completed";
            else if (idx === activeIndex) {
                if (f.status === "Harvested" && rel.lot && rel.lot.status === "Rejected" && idx === 5) {
                    stateClass = "active failed text-danger";
                    stage.lbl = "Lab Quality Testing (FAILED)";
                    stage.desc = "Lot failed purity / moisture requirements. Crop rejected.";
                } else {
                    stateClass = "active";
                }
            }
            
            stepperHtml += `
                <div class="stepper-step ${stateClass}">
                    <div class="stepper-step-dot"></div>
                    <span class="stepper-step-title">${stage.lbl}</span>
                    <span class="stepper-step-desc">${stage.desc}</span>
                </div>
            `;
        });

        const statusBadges = {
            Registered: "status-registered",
            Sown: "status-sown",
            Inspected: "status-inspected",
            Harvested: "status-harvested"
        };
        const activeStatusLabel = TRANSLATIONS[activeLanguage].status + ": " + f.status;

        card.innerHTML = `
            <div class="farmer-crop-card-header">
                <div class="farmer-crop-card-title">
                    <h4>${rel.crop ? rel.crop.name : ''} - <code>${f.variety}</code></h4>
                    <span>${TRANSLATIONS[activeLanguage].area}: ${f.area} ${TRANSLATIONS[activeLanguage].acres} | ${TRANSLATIONS[activeLanguage].sownOn}: ${f.sowingDate}</span>
                </div>
                <span class="badge-status ${statusBadges[f.status] || ''}">${activeStatusLabel}</span>
            </div>
            
            <div class="stepper-timeline">
                ${stepperHtml}
            </div>
        `;
        container.appendChild(card);
    });
}

function toggleFarmerLanguage() {
    activeLanguage = activeLanguage === "en" ? "hi" : "en";
    
    const flagBtn = document.getElementById("lbl-lang-btn");
    flagBtn.innerText = activeLanguage === "en" ? "हिन्दी (Hindi)" : "English";

    renderFarmerPortal();
}

function translateFarmerUI() {
    const t = TRANSLATIONS[activeLanguage];
    
    // Header welcome
    document.querySelector(".farmer-lbl-welcome").innerText = t.welcome;
    document.querySelector(".farmer-lbl-earnings").innerText = t.earnings;
    document.querySelector(".farmer-lbl-register-btn").innerText = t.registerBtn;
    document.querySelector(".farmer-lbl-active-crops").innerText = t.activeCrops;
    document.querySelector(".farmer-lbl-sowing-guide").innerText = t.sowingGuide;
    document.querySelector(".farmer-lbl-guide-title").innerText = t.guideTitle;
    document.querySelector(".farmer-lbl-guide-desc").innerText = t.guideDesc;
    
    document.querySelector(".farmer-lbl-guide-p1").innerText = t.guideP1;
    document.querySelector(".farmer-lbl-guide-p2").innerText = t.guideP2;
    document.querySelector(".farmer-lbl-guide-p3").innerText = t.guideP3;
    document.querySelector(".farmer-lbl-guide-p4").innerText = t.guideP4;

    // Modal labels mapping
    document.getElementById("farmer-lbl-modal-title").innerText = t.registerBtn;
    document.getElementById("farmer-lbl-select-crop").innerText = t.welcome + " " + t.activeCrops;
    document.getElementById("farmer-lbl-field-size").innerText = t.area + " (" + t.acres + ")";
    document.getElementById("farmer-lbl-sowing-date").innerText = t.sownOn;
    document.getElementById("farmer-lbl-submit").innerText = t.registerBtn;
}

function triggerGPSCapture() {
    const gpsInput = document.getElementById("ff-gps");
    gpsInput.placeholder = "Locating satellites...";
    
    setTimeout(() => {
        const randomLat = (29.6 + Math.random() * 0.4).toFixed(6);
        const randomLong = (76.8 + Math.random() * 0.4).toFixed(6);
        gpsInput.value = `${randomLat}° N, ${randomLong}° E`;
        lucide.createIcons();
    }, 800);
}

function handleFarmerFieldRegistration(e) {
    e.preventDefault();
    const cropId = document.getElementById("ff-crop-select").value;
    const variety = document.getElementById("ff-crop-select").selectedOptions[0].dataset.variety;
    const area = parseFloat(document.getElementById("ff-ff-area")?.value || document.getElementById("ff-area").value);
    const sowingDate = document.getElementById("ff-sowing-date").value;
    const soilType = document.getElementById("ff-soil-type").value;
    const previousCrop = document.getElementById("ff-prev-crop").value;
    const gpsCoords = document.getElementById("ff-gps").value;
    const seedSource = document.getElementById("ff-seed-source").value;

    SeedPortalDB.addField({
        farmerId: currentUser.id,
        cropId,
        variety,
        area,
        gpsCoords,
        soilType,
        previousCrop,
        sowingDate,
        seedSource,
        status: "Sown" // Seed field is sown upon registration
    });

    closeModal();
    renderFarmerPortal();
}

// VIEW 9: Reports Generator Logic
function generateReportData() {
    const reportType = document.getElementById("report-type").value;
    const seasonId = document.getElementById("report-season").value;
    const container = document.getElementById("reports-result-container");
    const table = document.getElementById("report-results-table");
    const title = document.getElementById("report-results-title");

    container.classList.remove("hidden");
    table.innerHTML = "";

    const crops = SeedPortalDB.getCrops();
    const fields = SeedPortalDB.getFields();
    const users = SeedPortalDB.getUsers();
    const tests = SeedPortalDB.getTests();

    // 1. Grower Performance & Payments
    if (reportType === "grower") {
        title.innerText = "Grower Yield & Payout Report Summary";
        const farmers = SeedPortalDB.getFarmers();
        
        let html = `
            <thead>
                <tr>
                    <th>Grower ID</th>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Active Fields</th>
                    <th>Total Acreage</th>
                    <th>Current Balance</th>
                    <th>Rating</th>
                </tr>
            </thead>
            <tbody>
        `;

        farmers.forEach(farmer => {
            const fFields = fields.filter(f => f.farmerId === farmer.id);
            const totalAc = fFields.reduce((sum, f) => sum + f.area, 0);
            
            html += `
                <tr>
                    <td><strong>${farmer.id}</strong></td>
                    <td>${farmer.name}</td>
                    <td>${farmer.location}</td>
                    <td>${fFields.length}</td>
                    <td>${totalAc} Acres</td>
                    <td><strong>₹${farmer.balance.toLocaleString()}</strong></td>
                    <td>⭐ ${farmer.rating}</td>
                </tr>
            `;
        });
        html += "</tbody>";
        table.innerHTML = html;
    }
    
    // 2. Crop variety analysis
    else if (reportType === "crop") {
        title.innerText = "Crop Strain Success and Certification Rates";
        const plans = SeedPortalDB.getPlans().filter(p => seasonId === "all" || p.seasonId === seasonId);
        
        let html = `
            <thead>
                <tr>
                    <th>Variety</th>
                    <th>Production Target</th>
                    <th>Cultivated Area</th>
                    <th>Yield Actuals</th>
                    <th>Success Ratio (Tests)</th>
                    <th>Certification Status</th>
                </tr>
            </thead>
            <tbody>
        `;

        plans.forEach(p => {
            const crop = crops.find(c => c.id === p.cropId);
            const varFields = fields.filter(f => f.variety === p.variety);
            
            // fetch tests for fields of this variety
            let pass = 0, total = 0;
            varFields.forEach(f => {
                const rel = SeedPortalDB.getFieldWithRelations(f.id);
                if (rel.lot) {
                    const test = tests.find(t => t.lotId === rel.lot.id);
                    if (test) {
                        total++;
                        if (test.status === "Passed") pass++;
                    }
                }
            });

            const ratioText = total > 0 ? `${Math.round((pass/total)*100)}% (${pass}/${total})` : "N/A";
            
            html += `
                <tr>
                    <td><strong>${crop ? crop.name : ''} (${p.variety})</strong></td>
                    <td>${p.expectedProduction} MT</td>
                    <td>${p.actualArea} Acres</td>
                    <td>${varFields.filter(f => f.status === 'Harvested').length * 15} Quintals</td>
                    <td>${ratioText}</td>
                    <td><span class="badge ${total > 0 && pass === total ? 'success' : 'warning'}">${total > 0 ? (pass === total ? 'High Quality' : 'Mixed') : 'Awaiting Harvest'}</span></td>
                </tr>
            `;
        });
        html += "</tbody>";
        table.innerHTML = html;
    }

    // 3. Inspections activity log
    else if (reportType === "inspection") {
        title.innerText = "Field Visit & Inspections Monitoring Log";
        const inspections = SeedPortalDB.getInspections();
        
        let html = `
            <thead>
                <tr>
                    <th>Visit ID</th>
                    <th>Field ID</th>
                    <th>Inspector</th>
                    <th>Date</th>
                    <th>Growth Stage</th>
                    <th>Observation Findings</th>
                    <th>Moisture %</th>
                    <th>Result</th>
                </tr>
            </thead>
            <tbody>
        `;

        inspections.forEach(i => {
            const inspector = users.find(u => u.id === i.officerId);
            
            html += `
                <tr>
                    <td><strong>${i.id}</strong></td>
                    <td><code>${i.fieldId}</code></td>
                    <td>${inspector ? inspector.name : 'Unknown'}</td>
                    <td>${i.date}</td>
                    <td>${i.growthStage}</td>
                    <td><small>${i.pestDiseaseReport}</small></td>
                    <td>${i.moistureLevel}%</td>
                    <td><span class="badge ${i.status === 'Approved' ? 'success' : 'danger'}">${i.status}</span></td>
                </tr>
            `;
        });
        html += "</tbody>";
        table.innerHTML = html;
    }

    // 4. Warehouse Stock expiry report
    else if (reportType === "stock") {
        title.innerText = "Warehouse Seed Inventory Stock Ledger";
        const inventory = SeedPortalDB.getInventory();
        
        let html = `
            <thead>
                <tr>
                    <th>Batch ID</th>
                    <th>Lot Origin</th>
                    <th>Crop Details</th>
                    <th>Available Stock</th>
                    <th>Size Type</th>
                    <th>Expiry Limit</th>
                    <th>Storage Row</th>
                </tr>
            </thead>
            <tbody>
        `;

        inventory.forEach(v => {
            const lotRel = SeedPortalDB.getLotWithRelations(v.lotId);
            
            html += `
                <tr>
                    <td><strong>${v.batchNumber}</strong></td>
                    <td>${v.lotId}</td>
                    <td>${lotRel.field ? lotRel.field.crop.name : ''} (${lotRel.field ? lotRel.field.variety : ''})</td>
                    <td><strong>${v.stockQty.toLocaleString()} kg</strong></td>
                    <td>${v.packetSize}</td>
                    <td>${v.expiryDate}</td>
                    <td>${v.warehouseLocation}</td>
                </tr>
            `;
        });
        html += "</tbody>";
        table.innerHTML = html;
    }
}

// Populate select elements helper
function populateCropsSelect(selectId) {
    const select = document.getElementById(selectId);
    select.innerHTML = "";
    
    const crops = SeedPortalDB.getCrops();
    crops.forEach(c => {
        const option = document.createElement("option");
        option.value = c.id;
        option.dataset.variety = c.variety;
        option.innerText = `${c.name} - Variety: ${c.variety}`;
        select.appendChild(option);
    });
}

function populateInventorySelect(selectId) {
    const select = document.getElementById(selectId);
    select.innerHTML = "<option value=''>-- Select Batch --</option>";
    
    const inventory = SeedPortalDB.getInventory();
    inventory.forEach(v => {
        const lotRel = SeedPortalDB.getLotWithRelations(v.lotId);
        if (v.stockQty > 0) {
            const option = document.createElement("option");
            option.value = v.id;
            option.innerText = `${v.batchNumber} (${lotRel.field ? lotRel.field.crop.name : ''} - ${v.stockQty}kg left)`;
            select.appendChild(option);
        }
    });
}
