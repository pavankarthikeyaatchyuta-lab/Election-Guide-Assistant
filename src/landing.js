(function () {
  const setupForm = document.querySelector("#setup-form");

  if (!setupForm) {
    return;
  }

  setupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(setupForm);
    const preferences = {
      userType: formData.get("userType") || "beginner",
      learningMode: formData.get("learningMode") || "guided"
    };

    try {
      window.sessionStorage.setItem("electoguide-preferences", JSON.stringify(preferences));
      window.localStorage.setItem("electoguide-preferences", JSON.stringify(preferences));
    } catch (error) {
      // Ignore storage failures and continue with navigation.
    }

    const query = "?userType=" + encodeURIComponent(preferences.userType) +
      "&learningMode=" + encodeURIComponent(preferences.learningMode);
    window.location.href = "./dashboard.html" + query;
  });
}());
