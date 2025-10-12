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

    const storageKey = "masjidnoorFormAccess";
    let hasFormAccess = false;
    let previousFocus = null;
    const sessionDurationMs = 10 * 60 * 1000;
    let sessionExpiryTimestamp = null;
    let sessionIntervalId = null;

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

    if (toggleGroups.length) {
        toggleGroups.forEach((group) => {
            const fieldName = group.getAttribute("data-toggle-group");
            const hiddenInput = fieldName ? document.getElementById(fieldName) : null;
            const options = group.querySelectorAll(".binary-toggle__option");

            if (!hiddenInput || !options.length) {
                return;
            }

            const setActiveOption = (selectedOption) => {
                const selectedValue = selectedOption.getAttribute("data-value");

                options.forEach((option) => {
                    const isActive = option === selectedOption;
                    option.classList.toggle("is-active", isActive);
                    option.setAttribute("aria-checked", String(isActive));
                });

                hiddenInput.value = selectedValue;

                if (hiddenInput === extraAmountInput) {
                    updateConditionalFields();
                }

                if (hiddenInput && hiddenInput.id === "gas-refill") {
                    updateConditionalFields();
                }
            };

            options.forEach((option) => {
                option.addEventListener("click", () => {
                    setActiveOption(option);
                });
            });

            const initialActive = Array.from(options).find((option) => option.classList.contains("is-active")) || options[0];
            setActiveOption(initialActive);
        });
    }

    if (salaryInput) {
        salaryInput.addEventListener("input", updateConditionalFields);
        updateConditionalFields();
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
});
