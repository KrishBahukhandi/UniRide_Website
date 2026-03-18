const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const supportForm = document.querySelector("#support-form");
const supportFormNote = document.querySelector("#support-form-note");
const supportSearchForm = document.querySelector("#support-search-form");
const supportSearchInput = document.querySelector("#support-search");
const supportSearchResults = document.querySelector("#support-search-results");
const faqItems = Array.from(document.querySelectorAll(".searchable-faq"));
const faqCategories = Array.from(document.querySelectorAll(".faq-category"));

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (supportForm && supportFormNote) {
  supportForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(supportForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const topic = String(formData.get("topic") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const subject = `UniRide Support Request: ${topic || "General Help"}`;
    const bodyLines = [
      `Name: ${name || "Not provided"}`,
      `Email: ${email || "Not provided"}`,
      `Topic: ${topic || "General Help"}`,
      "",
      "Message:",
      message || "No message provided.",
    ];

    const mailtoUrl = `mailto:support@uniride.app?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;

    supportFormNote.textContent = "Opening your email app with a prefilled support message.";
    window.location.href = mailtoUrl;
  });
}

if (supportSearchForm && supportSearchInput && supportSearchResults && faqItems.length > 0) {
  const filterFaqs = () => {
    const query = supportSearchInput.value.trim().toLowerCase();
    let visibleFaqCount = 0;
    let visibleCategoryCount = 0;

    faqCategories.forEach((category) => {
      const categoryText = category.textContent.toLowerCase();
      const categoryFaqs = Array.from(category.querySelectorAll(".searchable-faq"));
      let categoryVisible = false;

      categoryFaqs.forEach((faq) => {
        const searchText = `${faq.dataset.search || ""} ${faq.textContent || ""}`.toLowerCase();
        const matches = query === "" || searchText.includes(query) || categoryText.includes(query);
        faq.classList.toggle("is-hidden", !matches);

        if (matches) {
          categoryVisible = true;
          visibleFaqCount += 1;
        }
      });

      category.classList.toggle("is-hidden", !categoryVisible);
      if (categoryVisible) {
        visibleCategoryCount += 1;
      }
    });

    if (query === "") {
      supportSearchResults.textContent = "Showing all help topics.";
      return;
    }

    if (visibleFaqCount === 0) {
      supportSearchResults.textContent =
        `No results found for "${query}". Try broader words like login, ride, notifications, location, or privacy.`;
      return;
    }

    supportSearchResults.textContent =
      `Found ${visibleFaqCount} help article${visibleFaqCount === 1 ? "" : "s"} in ${visibleCategoryCount} categor${visibleCategoryCount === 1 ? "y" : "ies"} for "${query}".`;
  };

  supportSearchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    filterFaqs();
  });

  supportSearchInput.addEventListener("input", filterFaqs);
}
