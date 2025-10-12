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
