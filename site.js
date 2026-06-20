function rememberLanguage(lang) {
  document.cookie = "clc_lang=" + lang + "; path=/; max-age=31536000; SameSite=Lax";
}

document.querySelectorAll("[data-lang-link]").forEach(function (link) {
  link.addEventListener("click", function () {
    rememberLanguage(link.getAttribute("data-lang-link"));
  });
});

function buildEmailBody(formData) {
  return [
    "Name: " + formData.get("name"),
    "Email: " + formData.get("email"),
    "Country: " + formData.get("country"),
    "Intended use: " + formData.get("use_case"),
    "",
    "Message:",
    formData.get("message")
  ].join("\n");
}

document.querySelectorAll("[data-contact-form]").forEach(function (form) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    var status = form.querySelector("[data-form-status]");
    var endpoint = form.getAttribute("data-endpoint");
    var formData = new FormData(form);

    if (formData.get("company")) {
      return;
    }

    if (endpoint) {
      try {
        var response = await fetch(endpoint, {
          method: "POST",
          headers: { "Accept": "application/json" },
          body: formData
        });

        if (!response.ok) {
          throw new Error("Submit failed");
        }

        form.reset();
        status.textContent = form.getAttribute("data-success");
        return;
      } catch (error) {
        status.textContent = form.getAttribute("data-fallback");
      }
    }

    var subject = encodeURIComponent("CLC feedback from " + formData.get("name"));
    var body = encodeURIComponent(buildEmailBody(formData));
    window.location.href = "mailto:info@conflogix.com?subject=" + subject + "&body=" + body;
    status.textContent = form.getAttribute("data-mailto");
  });
});
