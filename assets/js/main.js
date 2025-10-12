import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAnalytics, isSupported as isAnalyticsSupported } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-analytics.js";
import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp,
    query,
    orderBy,
    onSnapshot
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
    const salaryInput = document.getElementById("salary-amount");
    const extraAmountInput = document.getElementById("extra-amount");
    const extraAmountWrapper = document.querySelector("[data-extra-amount-wrapper]");
    const extraAmountValueInput = document.getElementById("extra-amount-value");
    const reasonField = document.querySelector("[data-reason-field]");
    const reasonInput = document.getElementById("amount-reason");
    const gasWrapper = document.querySelector("[data-gas-wrapper]");
    const gasAmountInput = document.getElementById("gas-amount");
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
    const entrySubmitButton = entryForm ? entryForm.querySelector(".form-card__submit") : null;
    const defaultEmptyStateMessage = entryEmptyState ? entryEmptyState.textContent : "";
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
    let latestEntryDocs = [];

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

    const toBoolean = (value) => value === true || value === "yes" || value === "true";

    const toNumberOrNull = (value) => {
        if (value === undefined || value === null || value === "") {
            return null;
        }

        const numericValue = Number(value);
        return Number.isFinite(numericValue) ? numericValue : null;
    };

    const setDefaultMonthFilter = () => {
        if (!filterMonthSelect) {
            return;
        }

        const currentMonthName = monthNames[new Date().getMonth()] || "";
        const optionExists = Array.from(filterMonthSelect.options).some((option) => option.value === currentMonthName);
        const targetValue = optionExists ? currentMonthName : "all";
        filterMonthSelect.value = targetValue;
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
            getValue: (data) => {
                const rawValue = (data.paymentMode || "").toString();
                if (!rawValue.trim()) {
                    return "";
                }

                if (rawValue.toLowerCase() === "none" || rawValue === "[none]") {
                    return "[None]";
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
            getValue: () => "Yes"
        },
        {
            id: "extraAmountValue",
            label: "Extra Value",
            wrap: false,
            hasValue: (data) => toBoolean(data.extraAmount) && toNumberOrNull(data.extraAmountValue) !== null,
            getValue: (data) => {
                const amount = toNumberOrNull(data.extraAmountValue);
                return amount !== null ? formatInr(amount) : "";
            }
        },
        {
            id: "riceCollected",
            label: "Rice Collected",
            wrap: false,
            hasValue: (data) => toBoolean(data.riceCollected),
            getValue: () => "Yes"
        },
        {
            id: "gasRefill",
            label: "Gas Refill",
            wrap: false,
            hasValue: (data) => toBoolean(data.gasRefill),
            getValue: () => "Yes"
        },
        {
            id: "gasAmount",
            label: "Gas Amount",
            wrap: false,
            hasValue: (data) => toBoolean(data.gasRefill) && toNumberOrNull(data.gasAmount) !== null,
            getValue: (data) => {
                const amount = toNumberOrNull(data.gasAmount);
                return amount !== null ? formatInr(amount) : "";
            }
        },
        {
            id: "amountReason",
            label: "Reason",
            wrap: true,
            hasValue: (data) => {
                if (!(toBoolean(data.extraAmount) || toBoolean(data.gasRefill))) {
                    return false;
                }
                return !!(data.amountReason && data.amountReason.toString().trim());
            },
            getValue: (data) => (data.amountReason ? data.amountReason.toString().trim() : "")
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

        if (entryTableHeadRow) {
            entryTableHeadRow.innerHTML = "";
        }
        entryTableBody.innerHTML = "";

        if (!documents.length) {
            entryTableWrapper.setAttribute("hidden", "");
            if (defaultEmptyStateMessage) {
                entryEmptyState.textContent = defaultEmptyStateMessage;
            }
            entryEmptyState.removeAttribute("hidden");
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
                const value = column.getValue ? column.getValue(data, { index, doc: docSnapshot }) : "";
                cell.classList.add(column.wrap ? "entry-table__cell--wrap" : "entry-table__cell--nowrap");
                cell.textContent = value || "";
                row.appendChild(cell);
            });

            bodyFragment.appendChild(row);
        });

        entryTableBody.appendChild(bodyFragment);

        if (defaultEmptyStateMessage) {
            entryEmptyState.textContent = defaultEmptyStateMessage;
        }
    };

    const buildEntryPayload = (formData) => {
        const extrasFlag = formData.get("extra-amount");
        const gasFlag = formData.get("gas-refill");

        return {
            month: (formData.get("month") || "").toString(),
            householdName: (formData.get("household-name") || "").toString(),
            salaryAmount: toNumberOrNull(formData.get("salary-amount")),
            extraAmount: toBoolean(extrasFlag),
            extraAmountValue: toBoolean(extrasFlag) ? toNumberOrNull(formData.get("extra-amount-value")) : null,
            paymentMode: (formData.get("payment-mode") || "").toString().toLowerCase(),
            paymentDate: formData.get("payment-date") || "",
            riceCollected: toBoolean(formData.get("rice-collected")),
            gasRefill: toBoolean(gasFlag),
            gasAmount: toBoolean(gasFlag) ? toNumberOrNull(formData.get("gas-amount")) : null,
            amountReason: (formData.get("amount-reason") || "").toString().trim(),
            createdAt: serverTimestamp()
        };
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
    };

    const markAccessGranted = () => {
        hasFormAccess = true;
        sessionExpiryTimestamp = Date.now() + sessionDurationMs;
        persistSessionExpiry(sessionExpiryTimestamp);
        startSessionCountdown();
    };

    restoreSessionFromStorage();
    setDefaultMonthFilter();

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
            reset: () => {
                applyValue(hiddenInput.defaultValue || (options[0] ? options[0].getAttribute("data-value") : null));
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

            const formData = new FormData(entryForm);
            const payload = buildEntryPayload(formData);

            setEntryStatus("Saving entry…", "info", { persist: true });
            if (entrySubmitButton) {
                entrySubmitButton.disabled = true;
                entrySubmitButton.setAttribute("aria-busy", "true");
            }

            try {
                await addDoc(entriesCollectionRef, payload);
                setEntryStatus("Entry saved successfully.", "success");
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
