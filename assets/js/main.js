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
    const reasonInput = document.getElementById("amount-reason");
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
    const romanToBritishApiKey = "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";

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

    const convertReasonToBritishEnglish = async (text) => {
        const trimmed = typeof text === "string" ? text.trim() : "";
        if (!trimmed) {
            return "";
        }

        if (!romanToBritishApiKey) {
            return trimmed;
        }

        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${romanToBritishApiKey}`,
                    "X-Title": "Masjid Noor Dashboard"
                },
                body: JSON.stringify({
                    model: "openai/gpt-4o-mini",
                    messages: [
                        {
                            role: "system",
                            content: "You are a helpful assistant who rewrites Roman English input into natural British English. Keep the meaning intact and reply with only the rewritten sentence."
                        },
                        {
                            role: "user",
                            content: trimmed
                        }
                    ],
                    temperature: 0.2,
                    max_tokens: 150
                })
            });

            if (!response.ok) {
                throw new Error(`Roman to British conversion failed with status ${response.status}`);
            }

            const data = await response.json();
            const converted = data?.choices?.[0]?.message?.content;
            return typeof converted === "string" && converted.trim() ? converted.trim() : trimmed;
        } catch (error) {
            console.error("Unable to convert reason text:", error);
            return trimmed;
        }
    };

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

    const updateDashboardSubheading = ({ monthName, year } = {}) => {
        if (!dashboardSubheading) {
            return;
        }

        let targetMonth = monthName;
        let targetYear = year;

        if (!targetMonth) {
            const previous = getPreviousMonthDetails();
            targetMonth = previous.monthName;
            targetYear = previous.year;
        } else if (!targetYear) {
            targetYear = new Date().getFullYear();
        }

        if (!targetMonth) {
            dashboardSubheading.textContent = "";
            return;
        }

        dashboardSubheading.textContent = `Masjid Imam Salary For the month ${targetMonth} ${targetYear}`;
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

        if (timestamp) {
            try {
                const dateInstance = typeof timestamp.toDate === "function" ? timestamp.toDate() : null;
                const date = dateInstance instanceof Date ? dateInstance : new Date(timestamp);
                if (!Number.isNaN(date.getTime())) {
                    return `${baseMonth} ${date.getFullYear()}`;
                }
            } catch (error) {
                // Ignore and fall back to alternate sources.
            }
        }

        if (fallbackDate) {
            const isoPattern = /^(\d{4})-(\d{2})-(\d{2})$/;
            const match = isoPattern.exec(fallbackDate);
            if (match) {
                const [, year] = match;
                if (year) {
                    return `${baseMonth} ${year}`;
                }
            }
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

        const paymentYear = parseIsoDateToYear(data.paymentDate);
        if (paymentYear) {
            return paymentYear;
        }

        const createdAt = data.createdAt;
        if (createdAt && typeof createdAt.toDate === "function") {
            const date = createdAt.toDate();
            if (date instanceof Date && !Number.isNaN(date.getTime())) {
                return date.getFullYear();
            }
        } else if (createdAt instanceof Date && !Number.isNaN(createdAt.getTime())) {
            return createdAt.getFullYear();
        } else if (createdAt && typeof createdAt.seconds === "number") {
            const date = new Date(createdAt.seconds * 1000);
            if (!Number.isNaN(date.getTime())) {
                return date.getFullYear();
            }
        }

        return null;
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
        metaLine.textContent = `Records: ${latestFilteredDocs.length} • Total Amount: ${formatCurrencyInr(totalAmount)} • Printed: ${new Date().toLocaleString()}`;
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

        if (reasonInput) {
            reasonInput.value = data.amountReason ? data.amountReason.toString().trim() : "";
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

        if (!filterMonthSelect || filterMonthSelect.value === "all") {
            updateDashboardSubheading();
        } else {
            const filteredYear = filteredDocs.reduce((acc, docSnapshot) => {
                if (acc) {
                    return acc;
                }
                return deriveYearFromDocument(docSnapshot);
            }, null);
            const fallbackYear = filteredYear || new Date().getFullYear();
            updateDashboardSubheading({ monthName: filterMonthSelect.value, year: fallbackYear });
        }

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

        if (defaultEmptyStateMessage) {
            entryEmptyState.textContent = defaultEmptyStateMessage;
        }
    };

    const buildEntryPayload = (formData, { includeCreatedAt = true } = {}) => {
        const extrasFlag = formData.get("extra-amount");
        const gasFlag = formData.get("gas-refill");

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
            amountReason: (formData.get("amount-reason") || "").toString().trim()
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

        if (reasonField && reasonInput) {
            const showReason = salaryNeedsReason || extraNeedsReason;
            reasonField.classList.toggle("is-hidden", !showReason);
            reasonInput.required = showReason;
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

            if (payload.amountReason) {
                setEntryStatus("Converting reason to British English…", "info", { persist: true });
                payload.amountReason = await convertReasonToBritishEnglish(payload.amountReason);
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

    window.addEventListener("beforeunload", () => {
        if (entriesUnsubscribe) {
            entriesUnsubscribe();
        }
    });
});
