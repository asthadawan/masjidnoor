import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAnalytics, isSupported as isAnalyticsSupported } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-analytics.js";
import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp,
    query,
    orderBy,
    onSnapshot,
    updateDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBZXysolCVG8cTnTiC3m5Hk-eaDIVJlOpc",
    authDomain: "masjidnoor-72827.firebaseapp.com",
    projectId: "masjidnoor-72827",
    storageBucket: "masjidnoor-72827.firebasestorage.app",
    messagingSenderId: "900577400989",
    appId: "1:900577400989:web:06b5fcd70f41162635dc74",
    measurementId: "G-SZ5P153NY5"
};

const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp);
const entriesCollectionRef = collection(firestore, "entries");
const entriesQueryRef = query(entriesCollectionRef, orderBy("createdAt", "desc"));

isAnalyticsSupported().then((supported) => {
    if (supported) {
        getAnalytics(firebaseApp);
    }
}).catch(() => {
    // Analytics is optional; ignore failures silently.
});

document.addEventListener("DOMContentLoaded", () => {
    const navigation = document.getElementById("primary-navigation");
    const menuToggle = document.querySelector(".menu-toggle");
    const headingToggle = document.querySelector(".heading-toggle");
    const prayerGrid = document.querySelector("[data-prayer-grid]");
    const programGrid = document.querySelector("[data-program-grid]");
    const updatesContainer = document.querySelector("[data-updates]");
    const donationRange = document.getElementById("donation-amount");
    const donationOutput = document.getElementById("donation-output");
    const impactList = document.querySelector("[data-impact-list]");
    const donateNowButton = document.querySelector("[data-donate-now]");
    const contactForm = document.querySelector("[data-contact-form]");
    const currentYear = document.querySelector("[data-current-year]");
    const viewButtons = document.querySelectorAll(".view-toggle__btn");
    const viewPanels = document.querySelectorAll(".view-panel");
    const toggleGroups = document.querySelectorAll("[data-toggle-group]");
    const entryForm = document.querySelector("[data-entry-form]");
    const entryMonthSelect = document.getElementById("entry-month");
    const salaryInput = document.getElementById("salary-amount");
    const extraAmountInput = document.getElementById("extra-amount");
    const extraAmountWrapper = document.querySelector("[data-extra-amount-wrapper]");
    const extraAmountValueInput = document.getElementById("extra-amount-value");
    const reasonField = document.querySelector("[data-reason-field]");
    const reasonSelect = document.getElementById("amount-reason");
    const reasonOtherWrapper = document.querySelector("[data-reason-other-wrapper]");
    const reasonOtherInput = document.getElementById("amount-reason-other");
    const gasWrapper = document.querySelector("[data-gas-wrapper]");
    const gasAmountInput = document.getElementById("gas-amount");
    const householdSelect = document.getElementById("household-name");
    const paymentModeSelect = document.getElementById("payment-mode");
    const paymentDateInput = document.getElementById("payment-date");
    const authModal = document.querySelector("[data-auth-modal]");
    const authForm = document.querySelector("[data-auth-form]");
    const authError = document.querySelector("[data-auth-error]");
    const authCancelButton = document.querySelector("[data-auth-cancel]");
    const authBackdrop = document.querySelector("[data-auth-backdrop]");
    const authUsernameInput = document.getElementById("auth-username");
    const authPasswordInput = document.getElementById("auth-password");
    const sessionTimerBanner = document.querySelector("[data-session-timer]");
    const sessionCountdownText = document.querySelector("[data-session-countdown]");
    const entryTableHeadRow = document.querySelector("[data-entry-table-head-row]");
    const entryTableWrapper = document.querySelector("[data-entry-table-wrapper]");
    const entryTableBody = document.querySelector("[data-entry-table-body]");
    const entryEmptyState = document.querySelector("[data-entry-empty]");
    const entryLoadingIndicator = document.querySelector("[data-entry-loading]");
    const entryStatus = document.querySelector("[data-entry-status]");
    const dashboardSubheading = document.querySelector("[data-dashboard-subheading]");
    const entryEditingIndicator = document.querySelector("[data-entry-editing]");
    const entryEditingLabel = document.querySelector("[data-entry-editing-label]");
    const entryCancelEditButton = document.querySelector("[data-entry-cancel-edit]");
    const manageSection = document.querySelector("[data-manage-section]");
    const manageMonthSelect = document.querySelector("[data-manage-month]");
    const manageList = document.querySelector("[data-manage-list]");
    const manageEmptyState = document.querySelector("[data-manage-empty]");
    const entryPrintButton = document.querySelector("[data-entry-print]");
    const entryShareButton = document.querySelector("[data-entry-share]");
    const scrollToTopButton = document.querySelector("[data-scroll-to-top]");
    const overviewTotalHouseholds = document.querySelector("[data-overview-total-households]");
    const overviewPaidHouseholds = document.querySelector("[data-overview-paid-households]");
    const overviewPendingHouseholds = document.querySelector("[data-overview-pending-households]");
    const overviewTotalSalary = document.querySelector("[data-overview-total-salary]");
    const overviewTotalAmount = document.querySelector("[data-overview-total-amount]");
    const overviewProgressBar = document.querySelector("[data-overview-progress-bar]");
    const overviewProgressFill = document.querySelector("[data-overview-progress-fill]");
    const overviewProgressLabel = document.querySelector("[data-overview-progress-label]");
    const overviewPaymentCanvas = document.querySelector("[data-overview-payment-chart]");
    const overviewPaymentLegend = document.querySelector("[data-overview-payment-legend]");
    const overviewPaymentEmpty = document.querySelector("[data-overview-payment-empty]");
    const weatherWidget = document.querySelector("[data-weather-widget]");
    const weatherTemp = document.querySelector("[data-weather-temp]");
    const weatherCondition = document.querySelector("[data-weather-condition]");
    const weatherHumidity = document.querySelector("[data-weather-humidity]");
    const weatherHourly = document.querySelector("[data-weather-hourly]");
    const entrySubmitButton = entryForm ? entryForm.querySelector(".form-card__submit") : null;
    const defaultSubmitButtonLabel = entrySubmitButton ? entrySubmitButton.textContent : "";
    const defaultEmptyStateMessage = entryEmptyState ? entryEmptyState.textContent : "";
    const defaultManageEmptyMessage = manageEmptyState ? manageEmptyState.textContent : "";
    const filterMonthSelect = document.querySelector("[data-filter-month]");
    const filterHouseholdSelect = document.querySelector("[data-filter-household]");
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
    const instagramLink = document.querySelector("[data-instagram-link]");

    const getCssVariableValue = (name, fallback = "") => {
        try {
            const value = getComputedStyle(document.documentElement).getPropertyValue(name);
            return value ? value.trim() : fallback;
        } catch (error) {
            return fallback;
        }
    };

    const paymentModeMeta = [
        { key: "online", label: "Online", color: getCssVariableValue("--brand-deep-green", "#2b8a3e") },
        { key: "cash", label: "Cash", color: getCssVariableValue("--brand-sand", "#c0aa83") },
        { key: "none", label: "None", color: "#6c757d" }
    ];

    const uniqueHouseholdsList = (() => {
        if (!householdSelect) {
            return [];
        }

        const map = new Map();
        Array.from(householdSelect.options).forEach((option) => {
            const value = option.value ? option.value.toString().trim() : "";
            if (!value) {
                return;
            }
            const key = value.toLowerCase();
            if (!map.has(key)) {
                map.set(key, value);
            }
        });
        return Array.from(map.values());
    })();

    const totalHouseholdCount = uniqueHouseholdsList.length;

    const getPreviousMonthDetails = (baseDate = new Date()) => {
        const referenceDate = new Date(baseDate);
        referenceDate.setHours(0, 0, 0, 0);
        referenceDate.setMonth(referenceDate.getMonth() - 1);

        const monthIndex = referenceDate.getMonth();
        const monthName = monthNames[monthIndex] || "";
        const year = referenceDate.getFullYear();

        return { monthName, year };
    };

    const updateDashboardSubheading = (year = null) => {
        if (!dashboardSubheading) {
            return;
        }

        const monthValue = filterMonthSelect ? filterMonthSelect.value : "all";
        const householdValue = filterHouseholdSelect ? filterHouseholdSelect.value : "";

        const isAllMonths = !monthValue || monthValue === "all";
        const isAllHouseholds = !householdValue;

        if (isAllMonths && isAllHouseholds) {
            dashboardSubheading.textContent = formatTitleCase("Masjid Imam Overall Salary Collection");
            return;
        }

        if (isAllMonths && !isAllHouseholds) {
            const householdName = getSelectedOptionText(filterHouseholdSelect, householdValue);
            dashboardSubheading.textContent = formatTitleCase(`Masjid Imam Salary By ${householdName} Till Now`);
            return;
        }

        const displayYear = year || new Date().getFullYear();
        const monthName = getSelectedOptionText(filterMonthSelect, monthValue);

        if (!isAllMonths && isAllHouseholds) {
            dashboardSubheading.textContent = formatTitleCase(`Masjid Imam Salary for the month of ${monthName} ${displayYear} by All`);
            return;
        }

        if (!isAllMonths && !isAllHouseholds) {
            const householdName = getSelectedOptionText(filterHouseholdSelect, householdValue);
            dashboardSubheading.textContent = formatTitleCase(`Masjid Imam Salary for the month of ${monthName} ${displayYear} by ${householdName}`);
            return;
        }
    };

    let latestEntryDocs = [];
    let latestFilteredDocs = [];
    let latestVisibleColumns = [];
    let editingDocId = null;
    let printSheetContainer = null;

    const storageKey = "masjidnoorFormAccess";
    let hasFormAccess = false;
    let previousFocus = null;
    const sessionDurationMs = 10 * 60 * 1000;
    let sessionExpiryTimestamp = null;
    let sessionIntervalId = null;
    const toggleGroupControllers = [];
    let entriesUnsubscribe = null;
    let entryStatusTimeoutId = null;

    if (menuToggle && navigation) {
        menuToggle.addEventListener("click", () => {
            const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
            menuToggle.setAttribute("aria-expanded", String(!isExpanded));
            navigation.classList.toggle("is-open");
        });

        navigation.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                menuToggle.setAttribute("aria-expanded", "false");
                navigation.classList.remove("is-open");
            });
        });
    }

    if (headingToggle) {
        const headings = [
            {
                text: headingToggle.getAttribute("data-english") || "Masjid Noor Bathar Committee",
                dir: "ltr",
                className: "english"
            },
            {
                text: headingToggle.getAttribute("data-urdu") || "مسجد نور بٹھار کمیٹی",
                dir: "rtl",
                className: "urdu"
            }
        ];

        let activeIndex = 0;

        const applyHeading = (entry) => {
            headingToggle.textContent = entry.text;
            headingToggle.setAttribute("dir", entry.dir);
            headingToggle.classList.remove("english", "urdu", "is-visible");
            headingToggle.classList.add(entry.className);
            requestAnimationFrame(() => {
                headingToggle.classList.add("is-visible");
            });
        };

        applyHeading(headings[activeIndex]);

        setInterval(() => {
            headingToggle.classList.remove("is-visible");
            headingToggle.classList.add("is-switching");
            setTimeout(() => {
                activeIndex = (activeIndex + 1) % headings.length;
                applyHeading(headings[activeIndex]);
                headingToggle.classList.remove("is-switching");
            }, 720);
        }, 5200);
    }

    const activateView = (targetId) => {
        if (!viewButtons.length) {
            return;
        }
        const targetPanel = document.getElementById(`view-${targetId}`);
        if (!targetPanel) {
            return;
        }

        viewButtons.forEach((button) => {
            const isActive = button.getAttribute("data-view") === targetId;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-selected", String(isActive));
            button.setAttribute("tabindex", isActive ? "0" : "-1");
        });

        viewPanels.forEach((panel) => {
            const isActive = panel === targetPanel;
            panel.classList.toggle("is-active", isActive);
            panel.toggleAttribute("hidden", !isActive);
            panel.setAttribute("aria-hidden", String(!isActive));
        });
    };

    const readStoredSessionExpiry = () => {
        try {
            const rawValue = window.localStorage.getItem(storageKey);
            if (!rawValue) {
                return null;
            }

            let parsedExpiry = null;
            try {
                const parsed = JSON.parse(rawValue);
                if (parsed && typeof parsed.expiresAt === "number") {
                    parsedExpiry = parsed.expiresAt;
                } else if (typeof parsed === "number") {
                    parsedExpiry = parsed;
                }
            } catch (parseError) {
                const numericValue = Number(rawValue);
                if (Number.isFinite(numericValue)) {
                    parsedExpiry = numericValue;
                }
            }

            return typeof parsedExpiry === "number" ? parsedExpiry : null;
        } catch (error) {
            return null;
        }
    };

    const persistSessionExpiry = (expiresAt) => {
        try {
            window.localStorage.setItem(storageKey, JSON.stringify({ expiresAt }));
        } catch (error) {
            // Ignore storage failures and keep access scoped to the current session.
        }
    };

    const clearStoredSession = () => {
        try {
            window.localStorage.removeItem(storageKey);
        } catch (error) {
            // Ignore storage failures.
        }
    };

    const formatCountdown = (milliseconds) => {
        const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };

    const formatInr = (value) => {
        if (value === undefined || value === null || value === "") {
            return "";
        }

        const numericValue = Number(value);
        if (!Number.isFinite(numericValue)) {
            return "";
        }

        return new Intl.NumberFormat("en-IN", {
            maximumFractionDigits: 0
        }).format(numericValue);
    };

    const formatCurrencyInr = (value) => {
        const formatted = formatInr(value);
        return formatted ? `₹ ${formatted}` : "₹ 0";
    };

    const formatMonthWithYear = (month, timestamp, fallbackDate) => {
        if (!month) {
            return "—";
        }

        const baseMonth = month.toString();
        let year = null;
        let paymentMonthIndex = null;

        if (timestamp) {
            try {
                const dateInstance = typeof timestamp.toDate === "function" ? timestamp.toDate() : null;
                const date = dateInstance instanceof Date ? dateInstance : new Date(timestamp);
                if (!Number.isNaN(date.getTime())) {
                    year = date.getFullYear();
                    paymentMonthIndex = date.getMonth();
                }
            } catch (error) {
                // Ignore and fall back to alternate sources.
            }
        }

        if (!year && fallbackDate) {
            const isoPattern = /^(\d{4})-(\d{2})-(\d{2})$/;
            const match = isoPattern.exec(fallbackDate);
            if (match) {
                const [, y, m] = match;
                if (y) {
                    year = Number(y);
                    paymentMonthIndex = Number(m) - 1;
                }
            }
        }

        if (year) {
            const salaryMonthIndex = monthNames.findIndex((m) => m.toLowerCase() === baseMonth.toLowerCase());
            if (salaryMonthIndex !== -1 && paymentMonthIndex !== null) {
                // If the salary month is later in the year than the payment month,
                // it implies the salary belongs to the previous year.
                if (salaryMonthIndex > paymentMonthIndex) {
                    year -= 1;
                }
            }
            return `${baseMonth} ${year}`;
        }

        return baseMonth;
    };

    const formatIsoDate = (value) => {
        if (!value) {
            return "N/A";
        }

        const isoPattern = /^(\d{4})-(\d{2})-(\d{2})$/;
        const match = isoPattern.exec(value);
        if (!match) {
            return value;
        }

        const [_, year, month, day] = match;
        const date = new Date(Number(year), Number(month) - 1, Number(day));
        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    const formatTitleCase = (value) => {
        if (!value) {
            return "";
        }

        return value
            .toString()
            .toLowerCase()
            .split(/\s+/)
            .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1) : ""))
            .join(" ");
    };

    const normalizePaymentModeKey = (value) => {
        const raw = (value || "").toString().trim().toLowerCase();
        if (!raw || raw === "[none]" || raw === "none") {
            return "none";
        }
        return raw;
    };

    const setSelectValue = (selectElement, value) => {
        if (!selectElement) {
            return;
        }

        const normalizedValue = value || "";
        if (normalizedValue) {
            const optionExists = Array.from(selectElement.options).some((option) => option.value === normalizedValue);
            if (!optionExists) {
                const option = document.createElement("option");
                option.value = normalizedValue;
                option.textContent = normalizedValue;
                selectElement.appendChild(option);
            }
        }

        selectElement.value = normalizedValue;
    };

    const findToggleController = (name) => toggleGroupControllers.find((controller) => controller && controller.name === name) || null;

    const setToggleGroupValue = (name, value) => {
        const controller = findToggleController(name);
        if (controller && typeof controller.setValue === "function") {
            controller.setValue(value);
        }
    };

    const getPaymentModeLabel = (value) => {
        const normalized = normalizePaymentModeKey(value);
        const matched = paymentModeMeta.find((mode) => mode.key === normalized);
        if (matched) {
            return matched.label;
        }

        if (!value) {
            return "None";
        }

        return formatTitleCase(value);
    };

    const getDocSnapshotById = (docId) => {
        if (!docId || !Array.isArray(latestEntryDocs)) {
            return null;
        }

        return latestEntryDocs.find((docSnapshot) => docSnapshot.id === docId) || null;
    };

    const getHouseholdNameFromData = (data) => {
        if (!data) {
            return "";
        }

        const raw = (data.householdName || data["household-name"] || "").toString().trim();
        return raw;
    };

    const getSelectedOptionText = (selectElement, fallbackLabel) => {
        if (!selectElement) {
            return fallbackLabel;
        }

        const selectedOption = selectElement.options[selectElement.selectedIndex];
        const label = selectedOption ? selectedOption.textContent.trim() : "";
        return label || fallbackLabel;
    };

    const getMonthFilterLabel = () => {
        if (!filterMonthSelect || !filterMonthSelect.value || filterMonthSelect.value === "all") {
            return "All months";
        }

        return getSelectedOptionText(filterMonthSelect, filterMonthSelect.value);
    };

    const getHouseholdFilterLabel = () => {
        if (!filterHouseholdSelect || !filterHouseholdSelect.value) {
            return "All households";
        }

        return getSelectedOptionText(filterHouseholdSelect, filterHouseholdSelect.value);
    };

    const ensurePrintSheetContainer = () => {
        if (printSheetContainer && document.body.contains(printSheetContainer)) {
            return printSheetContainer;
        }

        const container = document.createElement("section");
        container.className = "print-sheet";
        container.setAttribute("hidden", "");
        document.body.appendChild(container);
        printSheetContainer = container;
        return container;
    };

    const resetPrintSheetContainer = () => {
        if (!printSheetContainer) {
            return;
        }

        printSheetContainer.setAttribute("hidden", "");
        printSheetContainer.innerHTML = "";
    };

    const toBoolean = (value) => value === true || value === "yes" || value === "true";

    const toNumberOrNull = (value) => {
        if (value === undefined || value === null || value === "") {
            return null;
        }

        const numericValue = Number(value);
        return Number.isFinite(numericValue) ? numericValue : null;
    };

    const parseIsoDateToMillis = (value) => {
        if (!value || typeof value !== "string") {
            return null;
        }

        const isoPattern = /^(\d{4})-(\d{2})-(\d{2})$/;
        const match = isoPattern.exec(value.trim());
        if (!match) {
            return null;
        }

        const [, year, month, day] = match;
        const date = new Date(Number(year), Number(month) - 1, Number(day));
        const millis = date.getTime();
        return Number.isNaN(millis) ? null : millis;
    };

    const parseIsoDateToYear = (value) => {
        if (!value || typeof value !== "string") {
            return null;
        }

        const isoPattern = /^(\d{4})-(\d{2})-(\d{2})$/;
        const match = isoPattern.exec(value.trim());
        if (!match) {
            return null;
        }

        const year = Number(match[1]);
        return Number.isFinite(year) ? year : null;
    };

    const deriveYearFromDocument = (docSnapshot) => {
        if (!docSnapshot || typeof docSnapshot.data !== "function") {
            return null;
        }

        const data = docSnapshot.data();
        if (!data) {
            return null;
        }

        let year = null;
        let paymentMonthIndex = null;

        const paymentYear = parseIsoDateToYear(data.paymentDate);
        if (paymentYear) {
            year = paymentYear;
            const isoPattern = /^(\d{4})-(\d{2})-(\d{2})$/;
            const match = isoPattern.exec(data.paymentDate);
            if (match) {
                paymentMonthIndex = Number(match[2]) - 1;
            }
        } else {
            const createdAt = data.createdAt;
            if (createdAt && typeof createdAt.toDate === "function") {
                const date = createdAt.toDate();
                if (date instanceof Date && !Number.isNaN(date.getTime())) {
                    year = date.getFullYear();
                    paymentMonthIndex = date.getMonth();
                }
            } else if (createdAt instanceof Date && !Number.isNaN(createdAt.getTime())) {
                year = createdAt.getFullYear();
                paymentMonthIndex = createdAt.getMonth();
            } else if (createdAt && typeof createdAt.seconds === "number") {
                const date = new Date(createdAt.seconds * 1000);
                if (!Number.isNaN(date.getTime())) {
                    year = date.getFullYear();
                    paymentMonthIndex = date.getMonth();
                }
            }
        }

        if (year && data.month) {
            const salaryMonthIndex = monthNames.findIndex((m) => m.toLowerCase() === data.month.toLowerCase());
            if (salaryMonthIndex !== -1 && paymentMonthIndex !== null) {
                // If the salary month is later in the year than the payment month,
                // it implies the salary belongs to the previous year.
                if (salaryMonthIndex > paymentMonthIndex) {
                    year -= 1;
                }
            }
        }

        return year;
    };

    const getDocSortTimestamps = (docSnapshot) => {
        const data = docSnapshot && typeof docSnapshot.data === "function" ? docSnapshot.data() : null;
        if (!data) {
            return { payment: Number.POSITIVE_INFINITY, created: Number.POSITIVE_INFINITY };
        }

        const paymentMillis = parseIsoDateToMillis(data.paymentDate);

        let createdMillis = Number.POSITIVE_INFINITY;
        if (data.createdAt && typeof data.createdAt.toMillis === "function") {
            createdMillis = data.createdAt.toMillis();
        } else if (data.createdAt instanceof Date) {
            const value = data.createdAt.getTime();
            createdMillis = Number.isNaN(value) ? Number.POSITIVE_INFINITY : value;
        }

        return {
            payment: paymentMillis !== null ? paymentMillis : Number.POSITIVE_INFINITY,
            created: createdMillis
        };
    };


    const preparePrintSheetContent = () => {
        if (!latestFilteredDocs.length || !latestVisibleColumns.length) {
            return null;
        }

        const container = ensurePrintSheetContainer();
        container.innerHTML = "";
        container.removeAttribute("hidden");

        const title = document.createElement("h1");
        title.className = "print-sheet__title";
        title.dir = "rtl";
        title.textContent = "مسجد نور بٹھار کمیٹی";
        container.appendChild(title);

        const subtitle = document.createElement("h2");
        subtitle.className = "print-sheet__subtitle";
        subtitle.textContent = "Imam Salary Records";
        container.appendChild(subtitle);

        const monthLabel = getMonthFilterLabel();
        const householdLabel = getHouseholdFilterLabel();

        const contextLine = document.createElement("p");
        contextLine.className = "print-sheet__context";
        contextLine.textContent = `Month: ${monthLabel} • Household: ${householdLabel}`;
        container.appendChild(contextLine);

        const linkLine = document.createElement("p");
        linkLine.className = "print-sheet__link";
        const link = document.createElement("a");
        link.href = "https://www.masjidnoor.tech";
        link.textContent = "www.masjidnoor.tech";
        link.target = "_blank";
        link.rel = "noopener";
        linkLine.appendChild(link);
        container.appendChild(linkLine);

        const totals = latestFilteredDocs.reduce((acc, docSnapshot) => {
            const data = docSnapshot && typeof docSnapshot.data === "function" ? docSnapshot.data() : null;
            if (!data) {
                return acc;
            }

            const salaryAmount = toNumberOrNull(data.salaryAmount) || 0;
            const extraAmountValue = toBoolean(data.extraAmount) ? toNumberOrNull(data.extraAmountValue) || 0 : 0;
            const gasAmountValue = toBoolean(data.gasRefill) ? toNumberOrNull(data.gasAmount) || 0 : 0;

            acc.salary += salaryAmount;
            acc.extra += extraAmountValue;
            acc.gas += gasAmountValue;
            return acc;
        }, { salary: 0, extra: 0, gas: 0 });

        const totalAmount = totals.salary + totals.extra + totals.gas;

        const metaLine = document.createElement("p");
        metaLine.className = "print-sheet__meta";
        const istDateTime = new Date().toLocaleString('en-IN', { 
            timeZone: 'Asia/Kolkata',
            dateStyle: 'medium',
            timeStyle: 'medium'
        });
        metaLine.textContent = `Records: ${latestFilteredDocs.length} • Total Amount: ${formatCurrencyInr(totalAmount)} • Printed: ${istDateTime} IST`;
        container.appendChild(metaLine);

        const table = document.createElement("table");
        table.className = "print-sheet__table";

        const thead = document.createElement("thead");
        const headRow = document.createElement("tr");
        latestVisibleColumns.forEach((column) => {
            const th = document.createElement("th");
            th.scope = "col";
            th.textContent = column.label;
            headRow.appendChild(th);
        });
        thead.appendChild(headRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        latestFilteredDocs.forEach((docSnapshot, index) => {
            const data = docSnapshot.data();
            const row = document.createElement("tr");

            latestVisibleColumns.forEach((column) => {
                const cell = document.createElement("td");
                const rawValue = column.getValue ? column.getValue(data, { index, doc: docSnapshot }) : "";
                const hasContent = rawValue !== undefined && rawValue !== null
                    && (!(typeof rawValue === "string") || rawValue.trim() !== "");
                const fallbackValue = column.emptyDisplay !== undefined ? column.emptyDisplay : "";
                const value = hasContent ? rawValue : fallbackValue;
                cell.textContent = typeof value === "string" ? value : (value !== null && value !== undefined ? String(value) : "");
                row.appendChild(cell);
            });

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        container.appendChild(table);

        return container;
    };

    const prepareCanvasForDrawing = (canvas, context) => {
        if (!canvas || !context) {
            return { width: 0, height: 0 };
        }

        const ratio = window.devicePixelRatio || 1;
        const width = canvas.clientWidth || canvas.width;
        const height = canvas.clientHeight || canvas.height;

        if (!width || !height) {
            return { width: 0, height: 0 };
        }

        const displayWidth = Math.round(width * ratio);
        const displayHeight = Math.round(height * ratio);

        if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
            canvas.width = displayWidth;
            canvas.height = displayHeight;
        }

        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.scale(ratio, ratio);

        return { width, height };
    };

    const updatePaymentLegend = (counts, total) => {
        if (!overviewPaymentLegend) {
            return;
        }

        overviewPaymentLegend.innerHTML = "";

        paymentModeMeta.forEach((mode) => {
            const count = counts[mode.key] || 0;
            const percent = total > 0 ? Math.round((count / total) * 100) : 0;

            const item = document.createElement("li");
            item.className = "overview-chart__legend-item";

            const swatch = document.createElement("span");
            swatch.className = "overview-chart__swatch";
            swatch.style.setProperty("--swatch-color", mode.color);

            const textWrapper = document.createElement("div");
            textWrapper.className = "overview-chart__legend-text";

            const label = document.createElement("span");
            label.className = "overview-chart__legend-label";
            label.textContent = mode.label;

            const value = document.createElement("span");
            value.className = "overview-chart__legend-value";
            value.textContent = `${count} (${percent}%)`;

            textWrapper.append(label, value);
            item.append(swatch, textWrapper);
            overviewPaymentLegend.appendChild(item);
        });
    };

    const drawPaymentModeChart = (counts, total) => {
        if (!overviewPaymentCanvas) {
            return;
        }

        const context = overviewPaymentCanvas.getContext("2d");
        if (!context) {
            return;
        }

        if (!total || total <= 0) {
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.clearRect(0, 0, overviewPaymentCanvas.width, overviewPaymentCanvas.height);
            return;
        }

        const { width, height } = prepareCanvasForDrawing(overviewPaymentCanvas, context);
        if (!width || !height) {
            return;
        }

        const radius = Math.min(width, height) / 2 - 6;
        const centerX = width / 2;
        const centerY = height / 2;
        let startAngle = -Math.PI / 2;

        paymentModeMeta.forEach((mode) => {
            const value = counts[mode.key] || 0;
            if (value <= 0) {
                return;
            }

            const sliceAngle = (value / total) * Math.PI * 2;
            context.beginPath();
            context.moveTo(centerX, centerY);
            context.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
            context.closePath();
            context.fillStyle = mode.color;
            context.fill();
            startAngle += sliceAngle;
        });

        context.beginPath();
        context.arc(centerX, centerY, radius, 0, Math.PI * 2);
        context.strokeStyle = "rgba(255, 255, 255, 0.85)";
        context.lineWidth = 1.5;
        context.stroke();
    };

    const updateOverviewMetrics = (documents) => {
        const paidHouseholdSet = new Set();
        const encounteredHouseholds = new Set();
        let totalSalary = 0;
        let totalExtra = 0;
        let totalGas = 0;
        const paymentCounts = {
            online: 0,
            cash: 0,
            none: 0
        };

        if (Array.isArray(documents)) {
            documents.forEach((docSnapshot) => {
                const data = docSnapshot && typeof docSnapshot.data === "function" ? docSnapshot.data() : null;
                if (!data) {
                    return;
                }

                const householdNameRaw = (data.householdName || data["household-name"] || "").toString().trim();
                const householdKey = householdNameRaw.toLowerCase();
                const salaryAmount = toNumberOrNull(data.salaryAmount);
                const hasPaid = salaryAmount !== null && salaryAmount > 0;
                const extraAmountValue = toBoolean(data.extraAmount) ? toNumberOrNull(data.extraAmountValue) : null;
                const gasAmountValue = toBoolean(data.gasRefill) ? toNumberOrNull(data.gasAmount) : null;
                const normalizedMode = normalizePaymentModeKey(data.paymentMode);
                const countsAsPaid = (hasPaid || normalizedMode === "none") && Boolean(householdKey);

                if (householdKey) {
                    encounteredHouseholds.add(householdKey);
                }

                if (countsAsPaid) {
                    paidHouseholdSet.add(householdKey);
                }

                if (salaryAmount !== null) {
                    totalSalary += salaryAmount;
                }

                if (extraAmountValue !== null) {
                    totalExtra += extraAmountValue;
                }

                if (gasAmountValue !== null) {
                    totalGas += gasAmountValue;
                }

                if (Object.prototype.hasOwnProperty.call(paymentCounts, normalizedMode)) {
                    paymentCounts[normalizedMode] += 1;
                } else {
                    paymentCounts.none += 1;
                }
            });
        }

        const datasetHouseholdCount = encounteredHouseholds.size;
        const usingSpecificHouseholdFilter = Boolean(filterHouseholdSelect && filterHouseholdSelect.value);
        let totalHouseholds = Math.max(totalHouseholdCount, datasetHouseholdCount);

        if (usingSpecificHouseholdFilter) {
            totalHouseholds = 1;
        }

    const paidHouseholds = Math.min(paidHouseholdSet.size, totalHouseholds);
        const pendingHouseholds = Math.max(totalHouseholds - paidHouseholds, 0);
    const totalCollected = totalSalary + totalExtra + totalGas;
        const progressPercent = totalHouseholds > 0 ? Math.round((paidHouseholds / totalHouseholds) * 100) : 0;
        const clampedProgress = Math.min(Math.max(progressPercent, 0), 100);
        const totalPaymentEntries = paymentModeMeta.reduce((acc, mode) => acc + (paymentCounts[mode.key] || 0), 0);

        if (overviewTotalHouseholds) {
            overviewTotalHouseholds.textContent = totalHouseholds;
        }

        if (overviewPaidHouseholds) {
            overviewPaidHouseholds.textContent = paidHouseholds;
        }

        if (overviewPendingHouseholds) {
            overviewPendingHouseholds.textContent = pendingHouseholds;
        }

        if (overviewTotalSalary) {
            overviewTotalSalary.textContent = formatCurrencyInr(totalSalary);
        }

        if (overviewTotalAmount) {
            overviewTotalAmount.textContent = formatCurrencyInr(totalCollected);
        }

        if (overviewProgressLabel) {
            overviewProgressLabel.textContent = `${clampedProgress}% • ${paidHouseholds}/${totalHouseholds || 0}`;
        }

        if (overviewProgressFill) {
            overviewProgressFill.style.width = `${clampedProgress}%`;
        }

        if (overviewProgressBar) {
            overviewProgressBar.setAttribute("aria-valuenow", String(clampedProgress));
        }

        const hasPaymentData = totalPaymentEntries > 0;

        if (overviewPaymentCanvas) {
            overviewPaymentCanvas.toggleAttribute("hidden", !hasPaymentData);
        }

        if (overviewPaymentEmpty) {
            overviewPaymentEmpty.toggleAttribute("hidden", hasPaymentData);
        }

        if (overviewPaymentLegend) {
            overviewPaymentLegend.toggleAttribute("hidden", !hasPaymentData);
        }

        drawPaymentModeChart(paymentCounts, totalPaymentEntries);
        updatePaymentLegend(paymentCounts, totalPaymentEntries);
    };

    const setDefaultMonthFilter = () => {
        if (!filterMonthSelect) {
            return;
        }

        const { monthName } = getPreviousMonthDetails();
        if (!monthName) {
            filterMonthSelect.value = "all";
            return;
        }

        const optionExists = Array.from(filterMonthSelect.options).some((option) => option.value === monthName);
        const targetValue = optionExists ? monthName : "all";
        filterMonthSelect.value = targetValue;
    };

    const setDefaultManageMonth = () => {
        if (!manageMonthSelect) {
            return;
        }

        const { monthName } = getPreviousMonthDetails();
        if (!monthName) {
            manageMonthSelect.value = "";
            return;
        }

        const optionExists = Array.from(manageMonthSelect.options).some((option) => option.value === monthName);
        manageMonthSelect.value = optionExists ? monthName : "";
    };

    const updateManageSectionVisibility = () => {
        if (!manageSection) {
            return;
        }

        if (hasFormAccess) {
            manageSection.removeAttribute("hidden");
            if (manageMonthSelect) {
                manageMonthSelect.removeAttribute("disabled");
            }
            if (manageEmptyState && defaultManageEmptyMessage) {
                manageEmptyState.textContent = defaultManageEmptyMessage;
            }
        } else {
            manageSection.setAttribute("hidden", "");
            if (manageMonthSelect) {
                manageMonthSelect.setAttribute("disabled", "");
                manageMonthSelect.value = "";
            }
            if (manageList) {
                manageList.innerHTML = "";
            }
            if (manageEmptyState && defaultManageEmptyMessage) {
                manageEmptyState.textContent = defaultManageEmptyMessage;
                manageEmptyState.removeAttribute("hidden");
            }
        }
    };

    const renderManageEntries = (documents) => {
        if (!manageList || !manageEmptyState) {
            return;
        }

        manageList.innerHTML = "";

        if (!hasFormAccess) {
            if (defaultManageEmptyMessage) {
                manageEmptyState.textContent = defaultManageEmptyMessage;
            }
            manageEmptyState.removeAttribute("hidden");
            return;
        }

        const selectedMonth = manageMonthSelect ? manageMonthSelect.value : "";

        if (!selectedMonth) {
            manageEmptyState.textContent = defaultManageEmptyMessage || "Select a month to view entries.";
            manageEmptyState.removeAttribute("hidden");
            return;
        }

        const normalizedSelectedMonth = selectedMonth.toLowerCase();
        const filteredDocs = Array.isArray(documents)
            ? documents.filter((docSnapshot) => {
                const data = docSnapshot && typeof docSnapshot.data === "function" ? docSnapshot.data() : null;
                if (!data) {
                    return false;
                }
                return (data.month || "").toString().toLowerCase() === normalizedSelectedMonth;
            })
            : [];

        if (!filteredDocs.length) {
            manageEmptyState.textContent = `No entries found for ${selectedMonth}.`;
            manageEmptyState.removeAttribute("hidden");
            return;
        }

        manageEmptyState.setAttribute("hidden", "");

        const fragment = document.createDocumentFragment();

        filteredDocs.forEach((docSnapshot) => {
            const data = docSnapshot.data();
            const listItem = document.createElement("li");
            listItem.className = "manage-entry";
            listItem.dataset.docId = docSnapshot.id;

            if (editingDocId && docSnapshot.id === editingDocId) {
                listItem.classList.add("is-editing");
            }

            const householdLabel = data.householdName || data["household-name"] || "—";
            const salaryAmount = toNumberOrNull(data.salaryAmount) || 0;
            const extraAmount = toBoolean(data.extraAmount) ? toNumberOrNull(data.extraAmountValue) || 0 : 0;
            const gasAmount = toBoolean(data.gasRefill) ? toNumberOrNull(data.gasAmount) || 0 : 0;
            const totalAmount = salaryAmount + extraAmount + gasAmount;

            const title = document.createElement("span");
            title.className = "manage-entry__title";
            title.textContent = householdLabel;

            const meta = document.createElement("p");
            meta.className = "manage-entry__meta";

            const salarySpan = document.createElement("span");
            salarySpan.textContent = `Salary: ${formatCurrencyInr(salaryAmount)}`;

            const totalSpan = document.createElement("span");
            totalSpan.textContent = `Total: ${formatCurrencyInr(totalAmount)}`;

            const modeSpan = document.createElement("span");
            modeSpan.textContent = `Mode: ${getPaymentModeLabel(data.paymentMode)}`;

            const dateSpan = document.createElement("span");
            dateSpan.textContent = `Date: ${formatIsoDate(data.paymentDate)}`;

            [salarySpan, totalSpan, modeSpan, dateSpan].forEach((element) => {
                meta.appendChild(element);
            });

            const actions = document.createElement("div");
            actions.className = "manage-entry__actions";

            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.className = "manage-entry__btn manage-entry__btn--edit";
            editButton.textContent = "Edit";
            editButton.setAttribute("data-manage-action", "edit");
            editButton.setAttribute("data-doc-id", docSnapshot.id);

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "manage-entry__btn manage-entry__btn--delete";
            deleteButton.textContent = "Delete";
            deleteButton.setAttribute("data-manage-action", "delete");
            deleteButton.setAttribute("data-doc-id", docSnapshot.id);

            actions.append(editButton, deleteButton);

            listItem.append(title, meta, actions);
            fragment.appendChild(listItem);
        });

        manageList.appendChild(fragment);
    };

    const clearEditingState = () => {
        editingDocId = null;
        if (entryForm) {
            entryForm.removeAttribute("data-editing-id");
        }
        if (entryEditingIndicator) {
            entryEditingIndicator.setAttribute("hidden", "");
        }
        if (entryEditingLabel) {
            entryEditingLabel.textContent = "";
        }
        if (entrySubmitButton) {
            entrySubmitButton.textContent = defaultSubmitButtonLabel;
        }
        renderManageEntries(latestEntryDocs);
    };

    const beginEditingEntry = (docSnapshot) => {
        if (!entryForm || !docSnapshot || typeof docSnapshot.data !== "function") {
            return;
        }

        const data = docSnapshot.data();
        if (!data) {
            return;
        }

        if (entryForm.reset) {
            entryForm.reset();
        }

        toggleGroupControllers.forEach((controller) => {
            if (controller && typeof controller.reset === "function") {
                controller.reset();
            }
        });

        setSelectValue(entryMonthSelect, data.month || "");
        setSelectValue(householdSelect, data.householdName || data["household-name"] || "");

        if (salaryInput) {
            const salaryAmountValue = toNumberOrNull(data.salaryAmount);
            salaryInput.value = salaryAmountValue !== null ? salaryAmountValue : "";
        }

        const extrasFlag = toBoolean(data.extraAmount) ? "yes" : "no";
        setToggleGroupValue("extra-amount", extrasFlag);
        if (extraAmountValueInput) {
            const extraAmountNumber = toBoolean(data.extraAmount) ? toNumberOrNull(data.extraAmountValue) : null;
            extraAmountValueInput.value = extraAmountNumber !== null ? extraAmountNumber : "";
        }

        const normalizedMode = normalizePaymentModeKey(data.paymentMode);
        setSelectValue(paymentModeSelect, normalizedMode);

        if (paymentDateInput) {
            paymentDateInput.value = data.paymentDate || "";
        }

        const riceFlag = toBoolean(data.riceCollected) ? "yes" : "no";
        setToggleGroupValue("rice-collected", riceFlag);

        const gasFlag = toBoolean(data.gasRefill) ? "yes" : "no";
        setToggleGroupValue("gas-refill", gasFlag);
        if (gasAmountInput) {
            const gasAmountNumber = toBoolean(data.gasRefill) ? toNumberOrNull(data.gasAmount) : null;
            gasAmountInput.value = gasAmountNumber !== null ? gasAmountNumber : "";
        }

        if (reasonSelect) {
            const reasonValue = data.amountReason ? data.amountReason.toString().trim() : "";
            let selectedValue = "";

            if (reasonValue) {
                const options = Array.from(reasonSelect.options || []);
                const match = options.find((option) => option.value === reasonValue);
                selectedValue = match ? match.value : "other";
            }

            reasonSelect.value = selectedValue;

            if (reasonOtherInput) {
                reasonOtherInput.value = selectedValue === "other" ? reasonValue : "";
            }
        }

        updateConditionalFields();

        editingDocId = docSnapshot.id;
        if (entryForm) {
            entryForm.setAttribute("data-editing-id", editingDocId);
        }

        if (entrySubmitButton) {
            entrySubmitButton.textContent = "Update Entry";
        }

        if (entryEditingIndicator) {
            entryEditingIndicator.removeAttribute("hidden");
        }

        if (entryEditingLabel) {
            const monthLabel = data.month || "—";
            const householdLabel = data.householdName || data["household-name"] || "—";
            entryEditingLabel.textContent = `${householdLabel} • ${monthLabel}`;
        }

        renderManageEntries(latestEntryDocs);

        if (entryForm && typeof entryForm.scrollIntoView === "function") {
            entryForm.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const columnsDefinition = [
        {
            id: "serial",
            label: "#",
            always: true,
            wrap: false,
            getValue: (_data, context) => String(context.index + 1)
        },
        {
            id: "month",
            label: "Month",
            always: true,
            wrap: false,
            getValue: (data) => formatMonthWithYear(data.month, data.createdAt, data.paymentDate)
        },
        {
            id: "household",
            label: "Household",
            always: true,
            wrap: true,
            getValue: (data) => data.householdName || data["household-name"] || "—"
        },
        {
            id: "salaryAmount",
            label: "Salary Amount",
            wrap: false,
            hasValue: (data) => toNumberOrNull(data.salaryAmount) !== null,
            getValue: (data) => {
                const amount = toNumberOrNull(data.salaryAmount);
                return amount !== null ? formatInr(amount) : "";
            }
        },
        {
            id: "paymentMode",
            label: "Payment Mode",
            wrap: false,
            hasValue: (data) => !!(data.paymentMode && data.paymentMode.toString().trim()),
            emptyDisplay: "N/A",
            getValue: (data) => {
                const rawValue = (data.paymentMode || "").toString();
                const normalizedMode = normalizePaymentModeKey(rawValue);

                if (normalizedMode === "none") {
                    return "None";
                }

                if (!rawValue.trim()) {
                    return null;
                }

                return formatTitleCase(rawValue);
            }
        },
        {
            id: "paymentDate",
            label: "Payment Date",
            always: true,
            wrap: false,
            hasValue: (data) => !!data.paymentDate,
            getValue: (data) => formatIsoDate(data.paymentDate)
        },
        {
            id: "extraAmount",
            label: "Extra Amount",
            wrap: false,
            hasValue: (data) => toBoolean(data.extraAmount),
            emptyDisplay: "N/A",
            getValue: (data) => (toBoolean(data.extraAmount) ? "Yes" : null)
        },
        {
            id: "extraAmountValue",
            label: "Extra Value",
            wrap: false,
            hasValue: (data) => toBoolean(data.extraAmount) && toNumberOrNull(data.extraAmountValue) !== null,
            emptyDisplay: "N/A",
            getValue: (data) => {
                const amount = toNumberOrNull(data.extraAmountValue);
                return amount !== null ? formatInr(amount) : null;
            }
        },
        {
            id: "riceCollected",
            label: "Rice Collected",
            wrap: false,
            hasValue: (data) => toBoolean(data.riceCollected),
            emptyDisplay: "N/A",
            getValue: (data) => (toBoolean(data.riceCollected) ? "Yes" : null)
        },
        {
            id: "gasRefill",
            label: "Gas Refill",
            wrap: false,
            hasValue: (data) => toBoolean(data.gasRefill),
            emptyDisplay: "N/A",
            getValue: (data) => (toBoolean(data.gasRefill) ? "Yes" : null)
        },
        {
            id: "gasAmount",
            label: "Gas Amount",
            wrap: false,
            hasValue: (data) => toBoolean(data.gasRefill) && toNumberOrNull(data.gasAmount) !== null,
            emptyDisplay: "N/A",
            getValue: (data) => {
                const amount = toNumberOrNull(data.gasAmount);
                return amount !== null ? formatInr(amount) : null;
            }
        },
        {
            id: "amountReason",
            label: "Reason",
            wrap: true,
            hasValue: (data) => {
                const reason = data.amountReason ? data.amountReason.toString().trim() : "";
                return Boolean(reason);
            },
            emptyDisplay: "N/A",
            getValue: (data) => {
                const reason = data.amountReason ? data.amountReason.toString().trim() : "";
                return reason ? reason : null;
            }
        }
    ];

    const setEntryLoadingState = (isLoading, message = "") => {
        if (!entryLoadingIndicator) {
            return;
        }

        entryLoadingIndicator.textContent = message || (isLoading ? "Loading entries…" : "");

        if (isLoading || message) {
            entryLoadingIndicator.removeAttribute("hidden");
        } else {
            entryLoadingIndicator.setAttribute("hidden", "");
        }
    };

    const setEntryStatus = (message, variant = "info", { persist = false } = {}) => {
        if (!entryStatus) {
            return;
        }

        if (entryStatusTimeoutId) {
            window.clearTimeout(entryStatusTimeoutId);
            entryStatusTimeoutId = null;
        }

        entryStatus.textContent = message;
        entryStatus.classList.remove("form-status--success", "form-status--error");

        if (variant === "success") {
            entryStatus.classList.add("form-status--success");
        } else if (variant === "error") {
            entryStatus.classList.add("form-status--error");
        }

        if (message && !persist) {
            entryStatusTimeoutId = window.setTimeout(() => {
                entryStatus.textContent = "";
                entryStatus.classList.remove("form-status--success", "form-status--error");
                entryStatusTimeoutId = null;
            }, 4000);
        }
    };

    const renderEntries = (documents) => {
        if (!entryTableBody || !entryTableWrapper || !entryEmptyState) {
            return;
        }

    renderManageEntries(documents);
        resetPrintSheetContainer();

        latestFilteredDocs = [];
        latestVisibleColumns = [];
        if (entryPrintButton) {
            entryPrintButton.setAttribute("hidden", "");
        }
        if (entryShareButton) {
            entryShareButton.setAttribute("hidden", "");
        }

        if (entryTableHeadRow) {
            entryTableHeadRow.innerHTML = "";
        }
        entryTableBody.innerHTML = "";

        if (!documents.length) {
            updateOverviewMetrics([]);
            entryTableWrapper.setAttribute("hidden", "");
            if (defaultEmptyStateMessage) {
                entryEmptyState.textContent = defaultEmptyStateMessage;
            }
            entryEmptyState.removeAttribute("hidden");
            updateDashboardSubheading();
            return;
        }

        const filteredDocs = documents.filter((docSnapshot) => {
            const data = docSnapshot.data();
            const monthMatch = filterMonthSelect && filterMonthSelect.value !== "all"
                ? (data.month || "").toLowerCase() === filterMonthSelect.value.toLowerCase()
                : true;
            const householdMatch = filterHouseholdSelect && filterHouseholdSelect.value
                ? (data.householdName || data["household-name"] || "").toString() === filterHouseholdSelect.value
                : true;
            return monthMatch && householdMatch;
        });

        filteredDocs.sort((a, b) => {
            const aTimes = getDocSortTimestamps(a);
            const bTimes = getDocSortTimestamps(b);

            if (aTimes.payment !== bTimes.payment) {
                return aTimes.payment - bTimes.payment;
            }

            return aTimes.created - bTimes.created;
        });

        latestFilteredDocs = filteredDocs;

        updateOverviewMetrics(filteredDocs);

        let yearForHeading = null;
        if (filterMonthSelect && filterMonthSelect.value !== "all") {
            const filteredYear = filteredDocs.reduce((acc, docSnapshot) => {
                if (acc) {
                    return acc;
                }
                return deriveYearFromDocument(docSnapshot);
            }, null);
            yearForHeading = filteredYear || new Date().getFullYear();
        }

        updateDashboardSubheading(yearForHeading);

        if (!filteredDocs.length) {
            entryTableWrapper.setAttribute("hidden", "");
            let emptyMessage = "No entries match the selected filters.";
            if (filterMonthSelect && filterMonthSelect.value !== "all") {
                const selectedOption = filterMonthSelect.options[filterMonthSelect.selectedIndex];
                const monthLabel = selectedOption ? selectedOption.textContent : filterMonthSelect.value;
                emptyMessage = `No entries found for ${monthLabel}.`;
            } else if (filterHouseholdSelect && filterHouseholdSelect.value) {
                emptyMessage = `No entries found for ${filterHouseholdSelect.value}.`;
            }
            entryEmptyState.textContent = emptyMessage;
            entryEmptyState.removeAttribute("hidden");
            return;
        }

        entryEmptyState.setAttribute("hidden", "");
        entryTableWrapper.removeAttribute("hidden");

        const visibleColumns = columnsDefinition.filter((column) => {
            if (column.always) {
                return true;
            }

            if (typeof column.hasValue === "function") {
                return filteredDocs.some((docSnapshot) => column.hasValue(docSnapshot.data()));
            }

            return false;
        });

        latestVisibleColumns = visibleColumns;

        if (entryTableHeadRow) {
            const headFragment = document.createDocumentFragment();
            visibleColumns.forEach((column) => {
                const th = document.createElement("th");
                th.scope = "col";
                th.textContent = column.label;
                headFragment.appendChild(th);
            });
            entryTableHeadRow.appendChild(headFragment);
        }

        const bodyFragment = document.createDocumentFragment();

        filteredDocs.forEach((docSnapshot, index) => {
            const data = docSnapshot.data();
            const row = document.createElement("tr");

            visibleColumns.forEach((column) => {
                const cell = document.createElement("td");
                const rawValue = column.getValue ? column.getValue(data, { index, doc: docSnapshot }) : "";
                const hasContent = rawValue !== undefined && rawValue !== null
                    && (!(typeof rawValue === "string") || rawValue.trim() !== "");
                const fallbackValue = column.emptyDisplay !== undefined ? column.emptyDisplay : "";
                const displayValue = hasContent ? rawValue : fallbackValue;
                cell.classList.add(column.wrap ? "entry-table__cell--wrap" : "entry-table__cell--nowrap");
                cell.textContent = displayValue;
                row.appendChild(cell);
            });

            bodyFragment.appendChild(row);
        });

        entryTableBody.appendChild(bodyFragment);

        if (entryPrintButton) {
            entryPrintButton.removeAttribute("hidden");
        }
        if (entryShareButton) {
            entryShareButton.removeAttribute("hidden");
        }

        if (defaultEmptyStateMessage) {
            entryEmptyState.textContent = defaultEmptyStateMessage;
        }
    };

    const buildEntryPayload = (formData, { includeCreatedAt = true } = {}) => {
        const extrasFlag = formData.get("extra-amount");
        const gasFlag = formData.get("gas-refill");

        const selectedReason = (formData.get("amount-reason") || "").toString();
        const resolvedReason = selectedReason === "other"
            ? (formData.get("amount-reason-other") || "").toString().trim()
            : selectedReason.toString().trim();

        const payload = {
            month: (formData.get("month") || "").toString(),
            householdName: (formData.get("household-name") || "").toString(),
            salaryAmount: toNumberOrNull(formData.get("salary-amount")),
            extraAmount: toBoolean(extrasFlag),
            extraAmountValue: toBoolean(extrasFlag) ? toNumberOrNull(formData.get("extra-amount-value")) : null,
            paymentMode: normalizePaymentModeKey(formData.get("payment-mode")),
            paymentDate: formData.get("payment-date") || "",
            riceCollected: toBoolean(formData.get("rice-collected")),
            gasRefill: toBoolean(gasFlag),
            gasAmount: toBoolean(gasFlag) ? toNumberOrNull(formData.get("gas-amount")) : null,
            amountReason: resolvedReason
        };

        if (includeCreatedAt) {
            payload.createdAt = serverTimestamp();
        }

        return payload;
    };

    const hasDuplicateEntryForPeriod = (month, household, ignoreDocId = null) => {
        if (!month || !household || !Array.isArray(latestEntryDocs) || !latestEntryDocs.length) {
            return false;
        }

        const normalizedMonth = month.toString().trim().toLowerCase();
        const normalizedHousehold = household.toString().trim().toLowerCase();

        if (!normalizedMonth || !normalizedHousehold) {
            return false;
        }

        return latestEntryDocs.some((docSnapshot) => {
            if (ignoreDocId && docSnapshot.id === ignoreDocId) {
                return false;
            }

            const data = docSnapshot.data ? docSnapshot.data() : null;
            if (!data) {
                return false;
            }

            const entryMonth = (data.month || "").toString().trim().toLowerCase();
            const entryHousehold = (data.householdName || data["household-name"] || "").toString().trim().toLowerCase();

            return entryMonth === normalizedMonth && entryHousehold === normalizedHousehold;
        });
    };

    const resetEntryFormState = () => {
        if (!entryForm) {
            return;
        }

        entryForm.reset();
        toggleGroupControllers.forEach((controller) => {
            if (controller && typeof controller.reset === "function") {
                controller.reset();
            }
        });
        updateConditionalFields();
        clearEditingState();
    };

    const startEntriesListener = () => {
        if (!entriesQueryRef) {
            return;
        }

        setEntryLoadingState(true);

        if (entriesUnsubscribe) {
            entriesUnsubscribe();
        }

        entriesUnsubscribe = onSnapshot(
            entriesQueryRef,
            (snapshot) => {
                setEntryLoadingState(false);
                latestEntryDocs = snapshot.docs;
                renderEntries(latestEntryDocs);
                if (editingDocId) {
                    const stillExists = latestEntryDocs.some((docSnapshot) => docSnapshot.id === editingDocId);
                    if (!stillExists) {
                        setEntryStatus("The entry you were editing is no longer available.", "info");
                        resetEntryFormState();
                    }
                }
            },
            (error) => {
                setEntryLoadingState(false, "Unable to load entries.");
                if (entryEmptyState) {
                    entryEmptyState.textContent = "Unable to load entries. Check your connection.";
                    entryEmptyState.removeAttribute("hidden");
                }
                console.error("Error fetching entries:", error);
            }
        );
    };

    const stopSessionCountdown = () => {
        if (sessionIntervalId) {
            window.clearInterval(sessionIntervalId);
            sessionIntervalId = null;
        }
        if (sessionTimerBanner) {
            sessionTimerBanner.setAttribute("hidden", "");
        }
        if (sessionCountdownText) {
            sessionCountdownText.textContent = formatCountdown(sessionDurationMs);
        }
    };

    const showAuthModal = (message = "") => {
        if (!authModal) {
            return;
        }

        if (!authModal.classList.contains("auth-modal--visible")) {
            if (authForm) {
                authForm.reset();
            }
            previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
            authModal.classList.add("auth-modal--visible");
            authModal.removeAttribute("hidden");
            window.setTimeout(() => {
                if (authUsernameInput) {
                    authUsernameInput.focus();
                }
            }, 0);
        }

        if (authError) {
            authError.textContent = message;
        }
    };

    const hideAuthModal = () => {
        if (!authModal) {
            return;
        }

        authModal.classList.remove("auth-modal--visible");
        authModal.setAttribute("hidden", "");
        if (authForm) {
            authForm.reset();
        }
        if (authError) {
            authError.textContent = "";
        }
        if (previousFocus && typeof previousFocus.focus === "function") {
            previousFocus.focus();
        }
        previousFocus = null;
    };

    const endSession = (shouldPrompt = false) => {
        stopSessionCountdown();
        hasFormAccess = false;
        sessionExpiryTimestamp = null;
        clearStoredSession();
        updateManageSectionVisibility();
        resetEntryFormState();

        const formPanel = document.getElementById("view-form");
        if (formPanel && formPanel.classList.contains("is-active")) {
            activateView("dashboard");
        }

        if (shouldPrompt) {
            showAuthModal("Session expired. Please log in again.");
        }
    };

    const updateSessionCountdownDisplay = () => {
        if (!sessionTimerBanner || !sessionCountdownText) {
            return;
        }

        if (!sessionExpiryTimestamp) {
            stopSessionCountdown();
            return;
        }

        const remaining = sessionExpiryTimestamp - Date.now();
        if (remaining <= 0) {
            endSession(true);
            return;
        }

        sessionTimerBanner.removeAttribute("hidden");
        sessionCountdownText.textContent = formatCountdown(remaining);
    };

    const startSessionCountdown = () => {
        if (!sessionExpiryTimestamp) {
            return;
        }

        if (sessionIntervalId) {
            window.clearInterval(sessionIntervalId);
        }

        updateSessionCountdownDisplay();
        sessionIntervalId = window.setInterval(updateSessionCountdownDisplay, 1000);
    };

    const restoreSessionFromStorage = () => {
        const storedExpiry = readStoredSessionExpiry();

        if (typeof storedExpiry === "number" && storedExpiry > Date.now()) {
            hasFormAccess = true;
            sessionExpiryTimestamp = storedExpiry;
            startSessionCountdown();
        } else if (typeof storedExpiry === "number") {
            clearStoredSession();
            stopSessionCountdown();
        }

        updateManageSectionVisibility();
        if (hasFormAccess && manageMonthSelect && !manageMonthSelect.value) {
            setDefaultManageMonth();
        }
        renderManageEntries(latestEntryDocs);
    };

    const markAccessGranted = () => {
        hasFormAccess = true;
        sessionExpiryTimestamp = Date.now() + sessionDurationMs;
        persistSessionExpiry(sessionExpiryTimestamp);
        startSessionCountdown();
        updateManageSectionVisibility();
        if (manageMonthSelect && !manageMonthSelect.value) {
            setDefaultManageMonth();
        }
        renderManageEntries(latestEntryDocs);
    };

    restoreSessionFromStorage();
    setDefaultMonthFilter();
    setDefaultManageMonth();
    updateDashboardSubheading();
    updateOverviewMetrics([]);
    renderManageEntries(latestEntryDocs);

    if (filterMonthSelect) {
        filterMonthSelect.addEventListener("change", () => {
            renderEntries(latestEntryDocs);
        });
    }

    if (filterHouseholdSelect) {
        filterHouseholdSelect.addEventListener("change", () => {
            renderEntries(latestEntryDocs);
        });
    }

    if (instagramLink) {
        instagramLink.addEventListener("click", (event) => {
            const fallbackUrl = instagramLink.getAttribute("data-instagram-web") || "";
            const appUrl = instagramLink.getAttribute("href") || "";

            if (appUrl) {
                let openTimeout;

                const handleVisibilityChange = () => {
                    if (document.visibilityState === "hidden") {
                        clearTimeout(openTimeout);
                    }
                };

                event.preventDefault();
                window.location.href = appUrl;

                openTimeout = window.setTimeout(() => {
                    if (fallbackUrl) {
                        window.location.href = fallbackUrl;
                    }
                }, 1800);

                document.addEventListener("visibilitychange", handleVisibilityChange, { once: true });
                window.addEventListener("blur", () => {
                    clearTimeout(openTimeout);
                }, { once: true });
            } else if (fallbackUrl) {
                event.preventDefault();
                window.location.href = fallbackUrl;
            }
        });
    }

    if (manageMonthSelect) {
        manageMonthSelect.addEventListener("change", () => {
            renderManageEntries(latestEntryDocs);
        });
    }

    if (entryPrintButton) {
        entryPrintButton.addEventListener("click", () => {
            const container = preparePrintSheetContent();
            if (!container) {
                return;
            }

            window.requestAnimationFrame(() => {
                window.print();
            });
        });
    }

    if (entryShareButton) {
        entryShareButton.addEventListener("click", async () => {
            const container = preparePrintSheetContent();
            if (!container) {
                return;
            }

            try {
                // Show loading state
                entryShareButton.disabled = true;
                entryShareButton.textContent = 'Generating PDF...';

                // Wait for libraries to be loaded
                await new Promise(resolve => setTimeout(resolve, 100));

                // Check if libraries are loaded
                if (typeof html2canvas === 'undefined') {
                    throw new Error('html2canvas library not loaded');
                }
                if (typeof window.jspdf === 'undefined') {
                    throw new Error('jsPDF library not loaded');
                }

                // Temporarily make container visible for html2canvas
                const wasHidden = container.hasAttribute('hidden');
                const hadPrintClass = container.classList.contains('print-sheet--visible');
                
                // Store original styles
                const originalStyles = {
                    display: container.style.display,
                    position: container.style.position,
                    left: container.style.left,
                    top: container.style.top,
                    width: container.style.width,
                    maxWidth: container.style.maxWidth,
                    zIndex: container.style.zIndex,
                    opacity: container.style.opacity
                };
                
                // Add class and make visible for capture
                container.classList.add('print-sheet--visible');
                container.removeAttribute('hidden');
                container.style.display = 'block';
                container.style.position = 'absolute';
                container.style.left = '-99999px';
                container.style.top = '0';
                container.style.width = 'auto';
                container.style.maxWidth = '800px';
                container.style.zIndex = '-1';
                container.style.opacity = '1';
                
                // Force reflow
                void container.offsetHeight;
                
                // Wait for fonts to load
                if (document.fonts && document.fonts.ready) {
                    await document.fonts.ready;
                }
                
                // Additional wait for rendering
                await new Promise(resolve => requestAnimationFrame(() => {
                    requestAnimationFrame(resolve);
                }));
                await new Promise(resolve => setTimeout(resolve, 300));

                // Generate PDF from the print sheet content
                const canvas = await html2canvas(container, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    logging: false,
                    backgroundColor: '#ffffff'
                });

                // Restore container state
                if (!hadPrintClass) {
                    container.classList.remove('print-sheet--visible');
                }
                if (wasHidden) {
                    container.setAttribute('hidden', '');
                }
                
                // Restore all original styles
                Object.keys(originalStyles).forEach(key => {
                    container.style[key] = originalStyles[key];
                });

                if (!canvas || canvas.width === 0 || canvas.height === 0) {
                    throw new Error('Canvas rendering failed - content may not be visible');
                }

                const imgData = canvas.toDataURL('image/png');
                
                if (!imgData || imgData === 'data:,') {
                    throw new Error('Failed to generate image from canvas');
                }

                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                });

                const imgWidth = 210; // A4 width in mm
                const pageHeight = 297; // A4 height in mm
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                let heightLeft = imgHeight;
                let position = 0;

                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }

                // Generate filename
                const monthLabel = getMonthFilterLabel();
                const householdLabel = getHouseholdFilterLabel();
                const filename = `Masjid_Noor_Records_${monthLabel.replace(/\s+/g, '_')}_${householdLabel.replace(/\s+/g, '_')}.pdf`;

                // Convert PDF to Blob
                const pdfBlob = pdf.output('blob');

                // Check if we can share files (mobile devices mostly)
                let canShareFiles = false;
                if (navigator.share && navigator.canShare) {
                    try {
                        const pdfFile = new File([pdfBlob], filename, { type: 'application/pdf' });
                        canShareFiles = navigator.canShare({ files: [pdfFile] });
                    } catch (e) {
                        canShareFiles = false;
                    }
                }

                if (canShareFiles) {
                    // Mobile: Share PDF via native share sheet
                    try {
                        const pdfFile = new File([pdfBlob], filename, { type: 'application/pdf' });
                        await navigator.share({
                            files: [pdfFile],
                            title: 'Masjid Noor - Imam Salary Records',
                            text: `Records for ${monthLabel} - ${householdLabel}`
                        });
                    } catch (error) {
                        if (error.name !== 'AbortError') {
                            console.error('Error sharing:', error);
                            // Fallback to download
                            pdf.save(filename);
                        }
                    }
                } else {
                    // Desktop: Show download/share options
                    showShareFallbackModal(pdf, filename, pdfBlob);
                }

            } catch (error) {
                console.error('Error generating PDF:', error);
                alert(`Failed to generate PDF: ${error.message}. Please try again.`);
            } finally {
                // Reset button state
                entryShareButton.disabled = false;
                entryShareButton.textContent = 'Share';
                resetPrintSheetContainer();
            }
        });
    }

    const downloadPDF = (pdf, filename) => {
        pdf.save(filename);
    };

    const showShareFallbackModal = (pdf, filename, pdfBlob) => {
        const existingModal = document.querySelector('.share-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'share-modal';
        modal.innerHTML = `
            <div class="share-modal__content">
                <h3 class="share-modal__title">Share PDF Report</h3>
                <p class="share-modal__text">Your PDF is ready! Choose an option:</p>
                <div class="share-modal__buttons">
                    <button class="share-modal__btn" data-share-action="download">
                        <span>⬇️</span> Download PDF
                    </button>
                    <button class="share-modal__btn" data-share-action="whatsapp-web">
                        <span>📱</span> WhatsApp Web
                    </button>
                    <button class="share-modal__btn" data-share-action="email-pdf">
                        <span>✉️</span> Email (Download First)
                    </button>
                </div>
                <p class="share-modal__note">Note: Download the PDF first, then share it through your preferred app.</p>
                <button class="share-modal__close" data-share-action="close">Cancel</button>
            </div>
        `;

        document.body.appendChild(modal);

        modal.addEventListener('click', (e) => {
            const target = e.target.closest('[data-share-action]');
            if (!target) return;

            const action = target.getAttribute('data-share-action');

            switch (action) {
                case 'download':
                    downloadPDF(pdf, filename);
                    target.innerHTML = '<span>✓</span> Downloaded!';
                    setTimeout(() => {
                        target.innerHTML = '<span>⬇️</span> Download PDF';
                    }, 2000);
                    return;
                case 'whatsapp-web':
                    downloadPDF(pdf, filename);
                    setTimeout(() => {
                        window.open('https://web.whatsapp.com/', '_blank');
                    }, 500);
                    break;
                case 'email-pdf':
                    downloadPDF(pdf, filename);
                    setTimeout(() => {
                        window.location.href = `mailto:?subject=${encodeURIComponent('Masjid Noor - Imam Salary Records')}&body=${encodeURIComponent('Please find the attached PDF report for Masjid Noor records.')}`;
                    }, 500);
                    break;
                case 'close':
                    break;
            }

            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    };

    window.addEventListener("beforeprint", () => {
        preparePrintSheetContent();
    });

    window.addEventListener("afterprint", () => {
        resetPrintSheetContainer();
    });

    if (manageList) {
        manageList.addEventListener("click", async (event) => {
            const target = event.target instanceof HTMLElement ? event.target.closest("[data-manage-action]") : null;
            if (!target) {
                return;
            }

            const action = target.getAttribute("data-manage-action");
            const docId = target.getAttribute("data-doc-id");

            if (!docId) {
                return;
            }

            if (!hasFormAccess) {
                showAuthModal("Please log in to manage entries.");
                return;
            }

            const docSnapshot = getDocSnapshotById(docId);
            if (!docSnapshot) {
                setEntryStatus("The selected entry could not be found. It may have been removed.", "error", { persist: true });
                renderManageEntries(latestEntryDocs);
                return;
            }

            if (action === "edit") {
                beginEditingEntry(docSnapshot);
                setEntryStatus("Loaded entry for editing. Update the fields and submit to save changes.", "info");
                return;
            }

            if (action === "delete") {
                const userConfirmed = window.confirm("Delete this entry? This action cannot be undone.");
                if (!userConfirmed) {
                    return;
                }

                target.disabled = true;
                target.setAttribute("aria-busy", "true");

                try {
                    const entryDocRef = doc(entriesCollectionRef, docId);
                    await deleteDoc(entryDocRef);
                    setEntryStatus("Entry deleted successfully.", "success");
                    if (editingDocId === docId) {
                        resetEntryFormState();
                    }
                } catch (error) {
                    console.error("Error deleting entry:", error);
                    setEntryStatus("Unable to delete the entry. Please try again.", "error", { persist: true });
                } finally {
                    target.disabled = false;
                    target.removeAttribute("aria-busy");
                }
            }
        });
    }
    startEntriesListener();

    if (viewButtons.length) {
        viewButtons.forEach((btn) => {
            btn.addEventListener("click", (event) => {
                const targetView = btn.getAttribute("data-view");
                if (targetView === "form" && !hasFormAccess) {
                    event.preventDefault();
                    showAuthModal();
                    return;
                }
                activateView(targetView);
            });
        });

        // Ensure initial state is synced.
        const initialButton = Array.from(viewButtons).find((btn) => btn.classList.contains("is-active"));
        if (initialButton) {
            activateView(initialButton.getAttribute("data-view"));
        }
    }

    if (authCancelButton) {
        authCancelButton.addEventListener("click", () => {
            hideAuthModal();
        });
    }

    if (authBackdrop) {
        authBackdrop.addEventListener("click", () => {
            hideAuthModal();
        });
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && authModal && authModal.classList.contains("auth-modal--visible")) {
            hideAuthModal();
        }
    });

    if (authForm && authUsernameInput && authPasswordInput) {
        authForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const username = authUsernameInput.value.trim();
            const password = authPasswordInput.value;

            if (username === "admin" && password === "tazor43214321") {
                markAccessGranted();
                hideAuthModal();
                activateView("form");
                if (entryForm) {
                    const firstField = entryForm.querySelector("input, select, textarea");
                    if (firstField instanceof HTMLElement) {
                        window.setTimeout(() => firstField.focus(), 0);
                    }
                }
            } else {
                if (authError) {
                    authError.textContent = "Incorrect username or password.";
                }
                authPasswordInput.focus();
                authPasswordInput.select();
            }
        });
    }

    const updateConditionalFields = () => {
        if (!entryForm) {
            return;
        }

        const salaryValue = salaryInput && salaryInput.value !== "" ? Number(salaryInput.value) : NaN;
        const salaryNeedsReason = Number.isFinite(salaryValue) && salaryValue !== 250;

        const extraAmountValue = extraAmountInput ? extraAmountInput.value : "no";
        const extraNeedsReason = extraAmountValue === "yes";
        const gasValue = document.getElementById("gas-refill") ? document.getElementById("gas-refill").value : "no";

        if (reasonField && reasonSelect) {
            const showReason = salaryNeedsReason || extraNeedsReason;
            reasonField.classList.toggle("is-hidden", !showReason);
            reasonSelect.required = showReason;

            if (!showReason) {
                reasonSelect.value = "";
                if (reasonOtherInput) {
                    reasonOtherInput.value = "";
                }
            }
        }

        if (reasonSelect && reasonOtherWrapper && reasonOtherInput) {
            const reasonVisible = !reasonField || !reasonField.classList.contains("is-hidden");
            const requireOther = reasonVisible && reasonSelect.value === "other";
            reasonOtherWrapper.classList.toggle("is-hidden", !requireOther);
            reasonOtherInput.required = requireOther;
            if (!requireOther) {
                reasonOtherInput.value = "";
            }
        }

        if (extraAmountWrapper && extraAmountValueInput) {
            const showExtraField = extraAmountValue === "yes";
            extraAmountWrapper.classList.toggle("is-hidden", !showExtraField);
            extraAmountValueInput.required = showExtraField;
            if (!showExtraField) {
                extraAmountValueInput.value = "";
            }
        }

        if (gasWrapper && gasAmountInput) {
            const showGasField = gasValue === "yes";
            gasWrapper.classList.toggle("is-hidden", !showGasField);
            gasAmountInput.required = showGasField;
            if (!showGasField) {
                gasAmountInput.value = "";
            }
        }
    };

    const configureToggleGroup = (group) => {
        const fieldName = group.getAttribute("data-toggle-group");
        const hiddenInput = fieldName ? document.getElementById(fieldName) : null;
        const options = Array.from(group.querySelectorAll(".binary-toggle__option"));

        if (!hiddenInput || !options.length) {
            return null;
        }

        const applyValue = (value) => {
            const targetOption = options.find((option) => option.getAttribute("data-value") === value) || options[0];
            const selectedValue = targetOption ? targetOption.getAttribute("data-value") : value;

            options.forEach((option) => {
                const isActive = option === targetOption;
                option.classList.toggle("is-active", isActive);
                option.setAttribute("aria-checked", String(isActive));
            });

            if (selectedValue) {
                hiddenInput.value = selectedValue;
            }

            if (hiddenInput === extraAmountInput || hiddenInput.id === "gas-refill") {
                updateConditionalFields();
            }
        };

        options.forEach((option) => {
            option.addEventListener("click", () => {
                applyValue(option.getAttribute("data-value"));
            });
        });

        const initialValue = hiddenInput.value || (options[0] ? options[0].getAttribute("data-value") : null);
        applyValue(initialValue);

        return {
            name: hiddenInput.id,
            reset: () => {
                applyValue(hiddenInput.defaultValue || (options[0] ? options[0].getAttribute("data-value") : null));
            },
            setValue: (value) => {
                applyValue(value);
            }
        };
    };

    if (toggleGroups.length) {
        toggleGroups.forEach((group) => {
            const controller = configureToggleGroup(group);
            if (controller) {
                toggleGroupControllers.push(controller);
            }
        });
    }

    if (salaryInput) {
        salaryInput.addEventListener("input", updateConditionalFields);
        updateConditionalFields();
    }

    if (reasonSelect) {
        reasonSelect.addEventListener("change", updateConditionalFields);
    }

    if (entryForm) {
        entryForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            if (!hasFormAccess) {
                showAuthModal("Please log in to submit an entry.");
                return;
            }

            const isEditing = Boolean(editingDocId);
            const formData = new FormData(entryForm);
            const payload = buildEntryPayload(formData, { includeCreatedAt: !isEditing });

            if (hasDuplicateEntryForPeriod(payload.month, payload.householdName, isEditing ? editingDocId : null)) {
                setEntryStatus(`An entry for ${payload.householdName || "this household"} in ${payload.month || "this month"} already exists.`, "error", { persist: true });
                return;
            }

            if (entrySubmitButton) {
                entrySubmitButton.disabled = true;
                entrySubmitButton.setAttribute("aria-busy", "true");
            }

            setEntryStatus(isEditing ? "Updating entry…" : "Saving entry…", "info", { persist: true });

            try {
                if (isEditing && editingDocId) {
                    const entryDocRef = doc(entriesCollectionRef, editingDocId);
                    await updateDoc(entryDocRef, {
                        ...payload,
                        updatedAt: serverTimestamp()
                    });
                    setEntryStatus("Entry updated successfully.", "success");
                } else {
                    await addDoc(entriesCollectionRef, payload);
                    setEntryStatus("Entry saved successfully.", "success");
                }
                resetEntryFormState();
            } catch (error) {
                console.error("Error saving entry:", error);
                setEntryStatus("Unable to save entry. Please try again.", "error", { persist: true });
            } finally {
                if (entrySubmitButton) {
                    entrySubmitButton.disabled = false;
                    entrySubmitButton.removeAttribute("aria-busy");
                }
            }
        });
    }

    if (entryCancelEditButton) {
        entryCancelEditButton.addEventListener("click", () => {
            if (editingDocId) {
                setEntryStatus("Editing cancelled.", "info");
            }
            resetEntryFormState();
        });
    }

    if (prayerGrid) {
        const prayerSchedule = [
            { name: "Fajr", adhan: "05:05 AM", iqamah: "05:25 AM", notes: "Tahajjud circle meets 40 minutes before Adhan." },
            { name: "Dhuhr", adhan: "01:00 PM", iqamah: "01:30 PM", notes: "Community lunch on Fridays." },
            { name: "Asr", adhan: "04:30 PM", iqamah: "04:45 PM", notes: "Youth mentoring every Tuesday." },
            { name: "Maghrib", adhan: "Sunset", iqamah: "+5 Minutes", notes: "Daily dua for the community." },
            { name: "Isha", adhan: "08:30 PM", iqamah: "08:45 PM", notes: "Hifz class meets after Isha." }
        ];

        const fragment = document.createDocumentFragment();

        prayerSchedule.forEach((prayer) => {
            const article = document.createElement("article");
            article.className = "card card--prayer";
            article.innerHTML = `
                <h3>${prayer.name}</h3>
                <p class="card__meta"><strong>Adhan:</strong> ${prayer.adhan}</p>
                <p class="card__meta"><strong>Iqamah:</strong> ${prayer.iqamah}</p>
                <p>${prayer.notes}</p>
            `;
            fragment.appendChild(article);
        });

        prayerGrid.appendChild(fragment);
    }

    if (programGrid) {
        const programs = [
            {
                title: "Weekend Quran School",
                schedule: "Saturday & Sunday • 9:00 AM",
                focus: "Foundational tajweed, memorization, and history for ages 6-14.",
                status: "Enrollment open"
            },
            {
                title: "Sisters' Halaqa",
                schedule: "Thursday • 11:00 AM",
                focus: "Rotating speakers, tafsir, and wellness workshops in a welcoming space.",
                status: "Childcare available"
            },
            {
                title: "Youth Leadership Lab",
                schedule: "Friday • 7:30 PM",
                focus: "Mentorship, service projects, and leadership training for teens.",
                status: "Next cohort starts November"
            },
            {
                title: "Community Pantry",
                schedule: "1st Sunday • 2:00 PM",
                focus: "Monthly distribution of essentials to local families in need.",
                status: "Volunteers needed"
            }
        ];

        const fragment = document.createDocumentFragment();

        programs.forEach((program) => {
            const article = document.createElement("article");
            article.className = "card card--program";
            article.innerHTML = `
                <h3>${program.title}</h3>
                <p class="card__meta">${program.schedule}</p>
                <p>${program.focus}</p>
                <p class="card__meta"><strong>${program.status}</strong></p>
            `;
            fragment.appendChild(article);
        });

        programGrid.appendChild(fragment);
    }

    if (updatesContainer) {
        const updates = [
            {
                title: "Solar backup installation",
                detail: "Phase one completed. Expect minor parking adjustments this week.",
                date: "12 Oct 2025"
            },
            {
                title: "Rabi ul-Awwal Seerah series",
                detail: "Weekly lectures after Maghrib throughout the month with guest scholars.",
                date: "16 Oct 2025"
            },
            {
                title: "Winter clothing drive",
                detail: "Drop donations in the multipurpose hall. Volunteers sorting every Saturday.",
                date: "Ongoing"
            }
        ];

        const fragment = document.createDocumentFragment();

        updates.forEach((update) => {
            const article = document.createElement("article");
            article.className = "update-card";
            article.innerHTML = `
                <h3>${update.title}</h3>
                <p>${update.detail}</p>
                <p class="card__meta">${update.date}</p>
            `;
            fragment.appendChild(article);
        });

        updatesContainer.appendChild(fragment);
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "PKR",
            maximumFractionDigits: 0
        }).format(amount);
    };

    if (donationRange && donationOutput && impactList) {
        const impactBands = [
            {
                max: 4000,
                items: [
                    "Supports daily utility expenses",
                    "Provides iftar for one family"
                ]
            },
            {
                max: 10000,
                items: [
                    "Funds youth mentorship session",
                    "Covers maintenance for main prayer hall",
                    "Stocks pantry staples for weekend distribution"
                ]
            },
            {
                max: Number.POSITIVE_INFINITY,
                items: [
                    "Accelerates facility expansion project",
                    "Sponsors Qur'an teacher stipend",
                    "Provides emergency relief for three families"
                ]
            }
        ];

        const updateImpact = (amount) => {
            donationOutput.textContent = `${formatCurrency(amount)}`;
            const band = impactBands.find((range) => amount <= range.max);
            impactList.innerHTML = "";
            band.items.forEach((item) => {
                const li = document.createElement("li");
                li.textContent = item;
                impactList.appendChild(li);
            });
        };

        donationRange.addEventListener("input", (event) => {
            updateImpact(Number(event.target.value));
        });

        updateImpact(Number(donationRange.value));
    }

    if (donateNowButton && donationRange) {
        donateNowButton.addEventListener("click", (event) => {
            event.preventDefault();
            donationRange.classList.add("is-highlighted");
            donationRange.focus({ preventScroll: false });
            setTimeout(() => donationRange.classList.remove("is-highlighted"), 1200);
        });
    }

    if (contactForm) {
        const status = contactForm.querySelector(".form-status");
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();
            if (status) {
                status.textContent = "Submitting...";
            }
            const formData = new FormData(contactForm);
            const payload = Object.fromEntries(formData.entries());

            window.setTimeout(() => {
                if (status) {
                    status.textContent = `Thank you, ${payload.name || "friend"}. We will respond shortly.`;
                }
                contactForm.reset();
            }, 800);
        });
    }

    if (currentYear) {
        currentYear.textContent = String(new Date().getFullYear());
    }

    // Scroll to Top Button Functionality
    if (scrollToTopButton) {
        // Show/hide button based on scroll position
        const toggleScrollButton = () => {
            if (window.scrollY > 300) {
                scrollToTopButton.classList.add('visible');
            } else {
                scrollToTopButton.classList.remove('visible');
            }
        };

        // Scroll to top when button is clicked
        scrollToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Listen for scroll events
        window.addEventListener('scroll', toggleScrollButton);
        
        // Initial check
        toggleScrollButton();
    }

    const fetchWeather = async () => {
        if (!weatherWidget || !weatherTemp || !weatherCondition || !weatherHumidity) {
            return;
        }

        const apiKey = "sk-live-y6nHpxNftkmANRvavSBQXBUJWRbsDILb0DCSAUMN";
        const coordinates = "34.137430248783886,74.21107746526778";
        const currentUrl = `https://weather.indianapi.in/global/current?location=${coordinates}`;
        const hourlyUrl = `https://weather.indianapi.in/global/forecast/hourly?location=${coordinates}`;

        try {
            // Fetch Current Weather
            const currentResponse = await fetch(currentUrl, {
                method: "GET",
                headers: { "x-api-key": apiKey }
            });

            if (currentResponse.ok) {
                const data = await currentResponse.json();
                const current = data.current || data;
                
                let temp = current.temp_c;
                if (temp === undefined) temp = current.temp_C;
                if (temp === undefined) temp = current.temp;
                if (temp === undefined) temp = current.temperature;
                if (temp === undefined && current.temp_f !== undefined) {
                    temp = (current.temp_f - 32) * 5/9;
                }

                const conditionText = current.condition ? (current.condition.text || current.condition) : "Unknown";
                const humidity = current.humidity;

                if (temp !== undefined && temp !== null) {
                    weatherTemp.textContent = `${Math.round(temp)}°C`;
                }
                
                if (conditionText) {
                    weatherCondition.textContent = conditionText;
                }
                
                if (humidity !== undefined) {
                    weatherHumidity.textContent = `${humidity}%`;
                }

                weatherWidget.removeAttribute("hidden");
            }

            // Fetch Hourly Forecast
            if (weatherHourly) {
                const hourlyResponse = await fetch(hourlyUrl, {
                    method: "GET",
                    headers: { "x-api-key": apiKey }
                });

                if (hourlyResponse.ok) {
                    const hourlyData = await hourlyResponse.json();
                    // Assuming structure: data.forecast.forecastday[0].hour or data.hour
                    // Or if it's a flat array of hours
                    let hours = [];
                    if (Array.isArray(hourlyData)) {
                        hours = hourlyData;
                    } else if (hourlyData.forecast && hourlyData.forecast.forecastday && hourlyData.forecast.forecastday[0]) {
                        hours = hourlyData.forecast.forecastday[0].hour;
                    } else if (hourlyData.hour) {
                        hours = hourlyData.hour;
                    }

                    if (hours && hours.length) {
                        weatherHourly.innerHTML = "";
                        weatherHourly.removeAttribute("hidden");
                        
                        // Get next 24 hours or remaining hours of today
                        const now = new Date();
                        const currentHour = now.getHours();
                        
                        // Filter for future hours if the API returns full day
                        // If API returns next 24h directly, we use that.
                        // Let's assume it returns full day (0-23) for today.
                        
                        let displayHours = hours;
                        
                        // Simple check if it has time property to filter
                        if (hours[0] && hours[0].time) {
                             // If time is "YYYY-MM-DD HH:MM", parse it
                             // Or if it's just epoch
                             displayHours = hours.filter(h => {
                                 const hTime = new Date(h.time_epoch ? h.time_epoch * 1000 : h.time);
                                 return hTime.getHours() > currentHour;
                             });
                        }

                        // Limit to next 4 hours for display
                        displayHours = displayHours.slice(0, 4);

                        displayHours.forEach((hour, index) => {
                            const time = new Date(hour.time_epoch ? hour.time_epoch * 1000 : hour.time);
                            const hourTemp = hour.temp_c !== undefined ? hour.temp_c : hour.temp;
                            const hourCondition = hour.condition ? (hour.condition.text || hour.condition) : "";
                            
                            const item = document.createElement("div");
                            item.className = "weather-hourly-item";
                            item.style.animationDelay = `${index * 100}ms`;
                            
                            const timeSpan = document.createElement("span");
                            timeSpan.className = "weather-hourly-item__time";
                            timeSpan.textContent = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            
                            const tempSpan = document.createElement("span");
                            tempSpan.className = "weather-hourly-item__temp";
                            tempSpan.textContent = `${Math.round(hourTemp)}°C`;
                            
                            const condSpan = document.createElement("span");
                            condSpan.className = "weather-hourly-item__condition";
                            condSpan.textContent = hourCondition;
                            
                            item.append(timeSpan, tempSpan, condSpan);
                            weatherHourly.appendChild(item);
                        });
                    }
                }
            }

        } catch (error) {
            console.error("Failed to fetch weather data:", error);
        }
    };

    fetchWeather();
    // Refresh weather every hour
    setInterval(fetchWeather, 3600000);

    window.addEventListener("beforeunload", () => {
        if (entriesUnsubscribe) {
            entriesUnsubscribe();
        }
    });
});
