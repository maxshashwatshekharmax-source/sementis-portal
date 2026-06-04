/**
 * Seed Production Management Portal - Local Storage Database
 * Provides structured access to application data and maintains persistence.
 */

const DEFAULT_SEASONS = [
    { id: "S-101", name: "Kharif 2025", status: "Completed", startDate: "2025-06-01", endDate: "2025-10-31" },
    { id: "S-102", name: "Rabi 2025-26", status: "Active", startDate: "2025-11-01", endDate: "2026-04-30" },
    { id: "S-103", name: "Kharif 2026", status: "Planning", startDate: "2026-06-01", endDate: "2026-10-31" }
];

const DEFAULT_CROPS = [
    { id: "C-01", name: "Wheat", variety: "HD-2967", seasonType: "Rabi", category: "Cereal", standardGermination: 85, standardPurity: 98, standardMoisture: 12 },
    { id: "C-02", name: "Wheat", variety: "PBW-343", seasonType: "Rabi", category: "Cereal", standardGermination: 85, standardPurity: 98, standardMoisture: 12 },
    { id: "C-03", name: "Rice", variety: "Pusa Basmati 1121", seasonType: "Kharif", category: "Cereal", standardGermination: 80, standardPurity: 97, standardMoisture: 14 },
    { id: "C-04", name: "Rice", variety: "PR-126", seasonType: "Kharif", category: "Cereal", standardGermination: 80, standardPurity: 97, standardMoisture: 14 },
    { id: "C-05", name: "Mustard", variety: "RH-749", seasonType: "Rabi", category: "Oilseed", standardGermination: 85, standardPurity: 98, standardMoisture: 9 },
    { id: "C-06", name: "Mustard", variety: "Pusa Mustard 25", seasonType: "Rabi", category: "Oilseed", standardGermination: 85, standardPurity: 98, standardMoisture: 9 },
    { id: "C-07", name: "Maize", variety: "PMH-1", seasonType: "Kharif", category: "Coarse Grain", standardGermination: 90, standardPurity: 99, standardMoisture: 13 }
];

const DEFAULT_USERS = [
    { id: "U-01", username: "admin", password: "123", role: "admin", name: "Amit Sharma", phone: "+91 98765 43210", email: "admin@seedportal.org", language: "en", status: "Active" },
    { id: "U-02", username: "manager", password: "123", role: "manager", name: "Dr. Vinay Kapoor", phone: "+91 87654 32109", email: "vinay@seedportal.org", language: "en", status: "Active" },
    { id: "U-03", username: "officer1", password: "123", role: "officer", name: "Rajesh Kumar", phone: "+91 76543 21098", email: "rajesh@seedportal.org", language: "en", status: "Active" },
    { id: "U-04", username: "officer2", password: "123", role: "officer", name: "Sunita Sharma", phone: "+91 65432 10987", email: "sunita@seedportal.org", language: "en", status: "Active" },
    { id: "U-05", username: "farmer1", password: "123", role: "farmer", name: "Ram Singh", phone: "+91 99999 11111", email: "ram.singh@farmers.in", language: "hi", status: "Active", location: "Karnal, Haryana", landArea: 15, cropHistory: "Wheat, Rice", agreementDate: "2025-10-15", rating: 4.8, balance: 45000, bankAccount: "SBIN0001234 - 10098765432" },
    { id: "U-06", username: "farmer2", password: "123", role: "farmer", name: "Shyam Lal", phone: "+91 88888 22222", email: "shyam.lal@farmers.in", language: "hi", status: "Active", location: "Kurukshetra, Haryana", landArea: 10, cropHistory: "Wheat, Mustard", agreementDate: "2025-10-18", rating: 4.5, balance: 30000, bankAccount: "HDFC0000432 - 20087654321" },
    { id: "U-07", username: "farmer3", password: "123", role: "farmer", name: "Anil Patel", phone: "+91 77777 33333", email: "anil.patel@farmers.in", language: "en", status: "Active", location: "Anand, Gujarat", landArea: 25, cropHistory: "Rice, Maize", agreementDate: "2025-11-05", rating: 4.9, balance: 75000, bankAccount: "BARB0ANAND - 30076543210" },
    { id: "U-08", username: "farmer4", password: "123", role: "farmer", name: "Suresh Kumar", phone: "+91 66666 44444", email: "suresh.kumar@farmers.in", language: "hi", status: "Active", location: "Hisar, Haryana", landArea: 8, cropHistory: "Mustard, Barley", agreementDate: "2025-10-22", rating: 4.6, balance: 12000, bankAccount: "PUNB0123400 - 40065432109" },
    { id: "U-09", username: "farmer5", password: "123", role: "farmer", name: "Hari Prasad", phone: "+91 55555 55555", email: "hari.prasad@farmers.in", language: "hi", status: "Pending", location: "Ludhiana, Punjab", landArea: 12, cropHistory: "Wheat, Rice", agreementDate: "N/A", rating: 4.2, balance: 0, bankAccount: "SBIN0004321 - 50054321098" },
    { id: "U-10", username: "lab", password: "123", role: "lab", name: "Dr. Amit Verma", phone: "+91 94160 55555", email: "amit.verma@seedlab.gov.in", language: "en", status: "Active" },
    { id: "U-11", username: "warehouse", password: "123", role: "warehouse", name: "Vikram Singh", phone: "+91 98120 44444", email: "vikram@seedwarehouse.in", language: "en", status: "Active" }
];

const DEFAULT_PLANS = [
    { id: "P-01", cropId: "C-01", variety: "HD-2967", seasonId: "S-102", targetArea: 500, expectedProduction: 2000, actualArea: 380, status: "Active" },
    { id: "P-02", cropId: "C-05", variety: "RH-749", seasonId: "S-102", targetArea: 200, expectedProduction: 400, actualArea: 180, status: "Active" },
    { id: "P-03", cropId: "C-03", variety: "Pusa Basmati 1121", seasonId: "S-101", targetArea: 300, expectedProduction: 1200, actualArea: 310, status: "Completed" },
    { id: "P-04", cropId: "C-07", variety: "PMH-1", seasonId: "S-103", targetArea: 150, expectedProduction: 600, actualArea: 0, status: "Planning" }
];

const DEFAULT_FIELDS = [
    { id: "F-01", farmerId: "U-05", cropId: "C-01", variety: "HD-2967", area: 10, gpsCoords: "29.6857° N, 76.9905° E", soilType: "Loam", previousCrop: "Rice", sowingDate: "2025-11-15", seedSource: "Mother Seed Lot W-987", status: "Harvested" },
    { id: "F-02", farmerId: "U-06", cropId: "C-05", variety: "RH-749", area: 5, gpsCoords: "29.9695° N, 76.8783° E", soilType: "Sandy Loam", previousCrop: "Fallow", sowingDate: "2025-10-20", seedSource: "Breeder Seed Lot M-412", status: "Harvested" },
    { id: "F-03", farmerId: "U-05", cropId: "C-02", variety: "PBW-343", area: 5, gpsCoords: "29.6860° N, 76.9912° E", soilType: "Clay Loam", previousCrop: "Maize", sowingDate: "2025-11-20", seedSource: "Foundation Seed Lot W-223", status: "Sown" },
    { id: "F-04", farmerId: "U-07", cropId: "C-07", variety: "PMH-1", area: 20, gpsCoords: "22.5645° N, 72.9287° E", soilType: "Alluvial", previousCrop: "Wheat", sowingDate: "2025-12-05", seedSource: "Foundation Seed Lot MZ-119", status: "Inspected" },
    { id: "F-05", farmerId: "U-08", cropId: "C-06", variety: "Pusa Mustard 25", area: 8, gpsCoords: "29.1492° N, 75.7217° E", soilType: "Sandy", previousCrop: "Fallow", sowingDate: "2025-10-25", seedSource: "Breeder Seed Lot M-410", status: "Harvested" }
];

const DEFAULT_INSPECTIONS = [
    { id: "I-01", fieldId: "F-01", officerId: "U-03", date: "2025-12-20", growthStage: "Vegetative", pestDiseaseReport: "None detected. Growth is uniform.", moistureLevel: 14.2, status: "Approved", notes: "Excellent initial germination, minor weed growth resolved by manual weeding.", photoUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80" },
    { id: "I-02", fieldId: "F-01", officerId: "U-03", date: "2026-02-15", growthStage: "Flowering", pestDiseaseReport: "None. Zero occurrence of rust.", moistureLevel: 13.8, status: "Approved", notes: "Earheads forming nicely. Field is isolative and pure. Fit for seed multiplication.", photoUrl: "https://images.unsplash.com/photo-1605000797499-95a51c7769ae?auto=format&fit=crop&w=400&q=80" },
    { id: "I-03", fieldId: "F-02", officerId: "U-04", date: "2025-12-10", growthStage: "Vegetative", pestDiseaseReport: "Mild Alternaria blight flag (sprayed).", moistureLevel: 9.5, status: "Approved", notes: "Adequate plant population. Advised micro-nutrients.", photoUrl: "https://images.unsplash.com/photo-1599933333934-2e91244e6fae?auto=format&fit=crop&w=400&q=80" },
    { id: "I-04", fieldId: "F-02", officerId: "U-04", date: "2026-01-25", growthStage: "Flowering", pestDiseaseReport: "Aphid threat checked. Under control.", moistureLevel: 8.8, status: "Approved", notes: "Mustard pods filling. Recommended harvest schedule in late February.", photoUrl: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=400&q=80" }
];

const DEFAULT_LOTS = [
    { id: "L-01", fieldId: "F-01", harvestQty: 180, processedQty: 172, cleaningLoss: 8, grade: "Grade A", processingDate: "2026-04-10", status: "Processed" },
    { id: "L-02", fieldId: "F-02", harvestQty: 40, processedQty: 38.5, cleaningLoss: 1.5, grade: "Grade A", processingDate: "2026-03-15", status: "Certified" },
    { id: "L-03", fieldId: "F-05", harvestQty: 60, processedQty: 57, cleaningLoss: 3, grade: "Grade B", processingDate: "2026-03-20", status: "Rejected" }
];

const DEFAULT_TESTS = [
    { id: "T-01", lotId: "L-01", testerId: "U-10", testDate: "2026-04-20", germination: 92, purity: 98.8, moisture: 11.2, status: "Passed", certNumber: "CRT-W-2026-001" },
    { id: "T-02", lotId: "L-02", testerId: "U-10", testDate: "2026-03-25", germination: 89, purity: 99.1, moisture: 8.2, status: "Passed", certNumber: "CRT-M-2026-002" },
    { id: "T-03", lotId: "L-03", testerId: "U-10", testDate: "2026-04-02", germination: 76, purity: 97.2, moisture: 13.5, status: "Failed", certNumber: "N/A", failReason: "Germination and purity levels fell below seed catalog thresholds." }
];

const DEFAULT_INVENTORY = [
    { id: "V-01", lotId: "L-01", stockQty: 15000, packetSize: "40kg", warehouseLocation: "Warehouse A, Row 4", batchNumber: "BAT-W-HD-001", expiryDate: "2027-04-20" },
    { id: "V-02", lotId: "L-02", stockQty: 3500, packetSize: "10kg", warehouseLocation: "Warehouse B, Row 2", batchNumber: "BAT-M-RH-002", expiryDate: "2027-03-25" }
];

const DEFAULT_NOTIFICATIONS = [
    { id: "N-01", userId: "all", role: "all", title: "Rabi Harvesting Review", message: "All Field Officers must verify harvest weights and update the portal within 24 hours of cutting.", type: "warning", date: "2026-06-02", read: false },
    { id: "N-02", userId: "U-02", role: "manager", title: "New Field Sowing", message: "Ram Singh registered a new Wheat field F-03 of size 5 Acres in Karnal.", type: "info", date: "2026-06-02", read: false },
    { id: "N-03", userId: "U-03", role: "officer", title: "Inspection Scheduled", message: "Inspection scheduled for Field F-03 (PBW-343) at Karnal. Sowing was done on 2025-11-20.", type: "info", date: "2026-06-01", read: false },
    { id: "N-04", userId: "U-05", role: "farmer", title: "Inspection Approved", message: "Your second inspection for Field F-01 has been approved by Rajesh Kumar. Harvest clearance has been granted.", type: "success", date: "2026-02-16", read: true },
    { id: "N-05", userId: "U-10", role: "lab", title: "Lot Quality Check", message: "Processed Wheat Lot L-01 is waiting for lab quality entry and certification.", type: "info", date: "2026-04-12", read: true },
    { id: "N-06", userId: "U-11", role: "warehouse", title: "New Certified Lot Received", message: "Mustard Lot L-02 certified (CRT-M-2026-002). Ready to package and update batch stock.", type: "success", date: "2026-03-26", read: true }
];

const SeedPortalDB = {
    // Core setup
    init() {
        if (!localStorage.getItem("sp_seasons")) localStorage.setItem("sp_seasons", JSON.stringify(DEFAULT_SEASONS));
        if (!localStorage.getItem("sp_crops")) localStorage.setItem("sp_crops", JSON.stringify(DEFAULT_CROPS));
        if (!localStorage.getItem("sp_users")) localStorage.setItem("sp_users", JSON.stringify(DEFAULT_USERS));
        if (!localStorage.getItem("sp_plans")) localStorage.setItem("sp_plans", JSON.stringify(DEFAULT_PLANS));
        if (!localStorage.getItem("sp_fields")) localStorage.setItem("sp_fields", JSON.stringify(DEFAULT_FIELDS));
        if (!localStorage.getItem("sp_inspections")) localStorage.setItem("sp_inspections", JSON.stringify(DEFAULT_INSPECTIONS));
        if (!localStorage.getItem("sp_lots")) localStorage.setItem("sp_lots", JSON.stringify(DEFAULT_LOTS));
        if (!localStorage.getItem("sp_tests")) localStorage.setItem("sp_tests", JSON.stringify(DEFAULT_TESTS));
        if (!localStorage.getItem("sp_inventory")) localStorage.setItem("sp_inventory", JSON.stringify(DEFAULT_INVENTORY));
        if (!localStorage.getItem("sp_notifications")) localStorage.setItem("sp_notifications", JSON.stringify(DEFAULT_NOTIFICATIONS));
        
        console.log("Seed Portal Local Database Initialized Successfully!");
    },

    reset() {
        localStorage.removeItem("sp_seasons");
        localStorage.removeItem("sp_crops");
        localStorage.removeItem("sp_users");
        localStorage.removeItem("sp_plans");
        localStorage.removeItem("sp_fields");
        localStorage.removeItem("sp_inspections");
        localStorage.removeItem("sp_lots");
        localStorage.removeItem("sp_tests");
        localStorage.removeItem("sp_inventory");
        localStorage.removeItem("sp_notifications");
        this.init();
    },

    // Generic Getters/Setters
    getData(key) {
        return JSON.parse(localStorage.getItem(`sp_${key}`)) || [];
    },

    saveData(key, data) {
        localStorage.setItem(`sp_${key}`, JSON.stringify(data));
    },

    // Entity specific helpers
    getUsers() { return this.getData("users"); },
    getFarmers() { return this.getUsers().filter(u => u.role === "farmer"); },
    getOfficers() { return this.getUsers().filter(u => u.role === "officer"); },
    getCrops() { return this.getData("crops"); },
    getSeasons() { return this.getData("seasons"); },
    getPlans() { return this.getData("plans"); },
    getFields() { return this.getData("fields"); },
    getInspections() { return this.getData("inspections"); },
    getLots() { return this.getData("lots"); },
    getTests() { return this.getData("tests"); },
    getInventory() { return this.getData("inventory"); },
    getNotifications() { return this.getData("notifications"); },

    // Dynamic relational resolvers
    getFieldWithRelations(fieldId) {
        const field = this.getFields().find(f => f.id === fieldId);
        if (!field) return null;
        
        const farmer = this.getUsers().find(u => u.id === field.farmerId);
        const crop = this.getCrops().find(c => c.id === field.cropId);
        const inspections = this.getInspections().filter(i => i.fieldId === fieldId);
        const lot = this.getLots().find(l => l.fieldId === fieldId);

        return { ...field, farmer, crop, inspections, lot };
    },

    getLotWithRelations(lotId) {
        const lot = this.getLots().find(l => l.id === lotId);
        if (!lot) return null;
        const field = this.getFieldWithRelations(lot.fieldId);
        const test = this.getTests().find(t => t.lotId === lotId);
        return { ...lot, field, test };
    },

    // Mutator Operations
    addUser(user) {
        const users = this.getUsers();
        user.id = `U-${String(users.length + 1).padStart(2, '0')}`;
        users.push(user);
        this.saveData("users", users);
        return user;
    },

    updateUser(userId, updatedData) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === userId);
        if (index !== -1) {
            users[index] = { ...users[index], ...updatedData };
            this.saveData("users", users);
            return users[index];
        }
        return null;
    },

    addCrop(crop) {
        const crops = this.getCrops();
        crop.id = `C-${String(crops.length + 1).padStart(2, '0')}`;
        crops.push(crop);
        this.saveData("crops", crops);
        return crop;
    },

    addPlan(plan) {
        const plans = this.getPlans();
        plan.id = `P-${String(plans.length + 1).padStart(2, '0')}`;
        plans.push(plan);
        this.saveData("plans", plans);
        return plan;
    },

    addField(field) {
        const fields = this.getFields();
        field.id = `F-${String(fields.length + 1).padStart(2, '0')}`;
        fields.push(field);
        this.saveData("fields", fields);

        // Notify Production Manager
        const farmer = this.getUsers().find(u => u.id === field.farmerId);
        const crop = this.getCrops().find(c => c.id === field.cropId);
        this.addNotification({
            userId: "U-02", // Production Manager
            role: "manager",
            title: "New Field Sown",
            message: `${farmer ? farmer.name : 'A grower'} registered a new ${crop ? crop.name : 'crop'} variety ${field.variety} (${field.area} Acres).`,
            type: "info"
        });

        return field;
    },

    updateFieldStatus(fieldId, status) {
        const fields = this.getFields();
        const index = fields.findIndex(f => f.id === fieldId);
        if (index !== -1) {
            fields[index].status = status;
            this.saveData("fields", fields);
            return fields[index];
        }
        return null;
    },

    addInspection(inspection) {
        const inspections = this.getInspections();
        inspection.id = `I-${String(inspections.length + 1).padStart(2, '0')}`;
        inspections.push(inspection);
        this.saveData("inspections", inspections);

        // Update Field Status
        const field = this.getFieldWithRelations(inspection.fieldId);
        if (field) {
            let nextStatus = "Inspected";
            if (inspection.status === "Approved" && field.status === "Sown") {
                nextStatus = "Inspected";
            }
            this.updateFieldStatus(inspection.fieldId, nextStatus);

            // Notify Farmer
            this.addNotification({
                userId: field.farmerId,
                role: "farmer",
                title: `Field Inspection: ${inspection.status}`,
                message: `Field inspection by Rajesh/Sunita was ${inspection.status}. Remarks: ${inspection.notes}`,
                type: inspection.status === "Approved" ? "success" : "danger"
            });
        }

        return inspection;
    },

    addLot(lot) {
        const lots = this.getLots();
        lot.id = `L-${String(lots.length + 1).padStart(2, '0')}`;
        lots.push(lot);
        this.saveData("lots", lots);

        // Update field status to Harvested
        this.updateFieldStatus(lot.fieldId, "Harvested");

        // Notify Lab Officer
        this.addNotification({
            userId: "U-10", // Lab Officer
            role: "lab",
            title: "Lot Ready for Testing",
            message: `Harvest lot ${lot.id} is ready. Moisture, purity, and germination tests are pending.`,
            type: "info"
        });

        return lot;
    },

    addTest(test) {
        const tests = this.getTests();
        test.id = `T-${String(tests.length + 1).padStart(2, '0')}`;
        tests.push(test);
        this.saveData("tests", tests);

        // Update Lot status based on pass/fail
        const lots = this.getLots();
        const lotIndex = lots.findIndex(l => l.id === test.lotId);
        if (lotIndex !== -1) {
            lots[lotIndex].status = test.status === "Passed" ? "Certified" : "Rejected";
            this.saveData("lots", lots);

            const lot = lots[lotIndex];
            const field = this.getFieldWithRelations(lot.fieldId);

            // Notify Production Manager & Farmer
            this.addNotification({
                userId: "U-02",
                role: "manager",
                title: `Lot Certification Results`,
                message: `Lot ${test.lotId} has ${test.status} lab quality checks (Germination: ${test.germination}%).`,
                type: test.status === "Passed" ? "success" : "danger"
            });

            if (field) {
                this.addNotification({
                    userId: field.farmerId,
                    role: "farmer",
                    title: `Seed Testing Complete`,
                    message: `Your seed crop lot ${test.lotId} has been tested: ${test.status}. Germination: ${test.germination}%.`,
                    type: test.status === "Passed" ? "success" : "danger"
                });

                // Trigger payment increment for passing crops
                if (test.status === "Passed") {
                    const pricePerQuintal = field.crop.category === "Oilseed" ? 6000 : 3500;
                    const payout = Math.round(lot.processedQty * pricePerQuintal);
                    this.updateUser(field.farmerId, {
                        balance: (field.farmer.balance || 0) + payout
                    });
                    
                    // Create Inventory item automatically
                    this.addInventory({
                        lotId: lot.id,
                        stockQty: Math.round(lot.processedQty * 100), // convert quintals to kg
                        packetSize: "40kg",
                        warehouseLocation: `Warehouse ${field.crop.category === "Oilseed" ? "B" : "A"}, Row ${Math.floor(Math.random() * 5) + 1}`,
                        batchNumber: `BAT-${field.crop.name.substring(0,2).toUpperCase()}-${field.variety.substring(0,3).toUpperCase()}-${test.id}`,
                        expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
                    });
                }
            }
        }
        return test;
    },

    addInventory(item) {
        const inv = this.getInventory();
        item.id = `V-${String(inv.length + 1).padStart(2, '0')}`;
        inv.push(item);
        this.saveData("inventory", inv);

        // Notify Warehouse Staff
        this.addNotification({
            userId: "U-11", // Warehouse Staff
            role: "warehouse",
            title: "New Inventory Lot Logged",
            message: `Batch ${item.batchNumber} added to stock. Size: ${item.stockQty}kg. Location: ${item.warehouseLocation}`,
            type: "success"
        });

        return item;
    },

    addNotification(notif) {
        const notifs = this.getNotifications();
        notif.id = `N-${String(notifs.length + 1).padStart(2, '0')}`;
        notif.date = new Date().toISOString().split('T')[0];
        notif.read = false;
        notifs.unshift(notif); // Add to beginning
        this.saveData("notifications", notifs);
        return notif;
    },

    markNotificationsAsRead(role, userId) {
        const notifs = this.getNotifications();
        notifs.forEach(n => {
            if (n.role === role || n.userId === userId || n.userId === "all") {
                n.read = true;
            }
        });
        this.saveData("notifications", notifs);
    }
};

// Initialize DB on script load
SeedPortalDB.init();
