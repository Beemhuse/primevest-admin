document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    let hasError = false;
    if (!username) {
      document.getElementById("usernameError").classList.remove("hidden");
      hasError = true;
    } else {
      document.getElementById("usernameError").classList.add("hidden");
    }
    if (!password) {
      document.getElementById("passwordError").classList.remove("hidden");
      hasError = true;
    } else {
      document.getElementById("passwordError").classList.add("hidden");
    }
    if (hasError) return;
    const submitBtn = document.getElementById("loginBtn");
    submitBtn.textContent = "Logging in ...";

    const apiEndpoint =
      "https://api.primeevest.com/api/admin/auth/login";

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        submitBtn.textContent = "Login";
        const toast = document.getElementById("toast");
        toast.textContent = "Logged in successfully 🎉";
        toast.classList.add("show");
        document.getElementById("loginForm").reset();
        setTimeout(() => {
          toast.classList.remove("show");
          setTimeout(() => {
            window.location.href = "dashboard.html";
          }, 100);
        }, 2000);
      } else {
        const toast = document.getElementById("toast");
        submitBtn.textContent = "Login";
        toast.textContent = data.message || "An error occurred during log-in.";
        toast.style.background = "linear-gradient(135deg, #e53935, #b71c1c)";
        toast.classList.add("show");
        setTimeout(() => {
          toast.classList.remove("show");
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      const toast = document.getElementById("toast");
      submitBtn.textContent = "Login";
      toast.textContent = "Something went wrong!";
      toast.style.background = "linear-gradient(135deg, #e53935, #b71c1c)";
      toast.classList.add("show");

      setTimeout(() => {
        toast.classList.remove("show");
      }, 3000);
    }
  });

document
  .getElementById("togglePassword")
  .addEventListener("click", function () {
    const passwordInput = document.getElementById("password");
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    this.classList.toggle("fa-eye");
    this.classList.toggle("fa-eye-slash");
  });
