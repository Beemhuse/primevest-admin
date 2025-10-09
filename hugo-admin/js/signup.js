document
  .getElementById("signupForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    document.getElementById("usernameError").classList.add("hidden");
    document.getElementById("phoneError").classList.add("hidden");
    document.getElementById("passwordError").classList.add("hidden");
    const username = document.getElementById("username").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value.trim();
    const adminCode = document.getElementById("secretCode").value.trim();

    let hasError = false;
    if (!username) {
      document.getElementById("usernameError").classList.remove("hidden");
      hasError = true;
    }

    if (!phone) {
      document.getElementById("phoneError").classList.remove("hidden");
      hasError = true;
    }

    if (!password) {
      document.getElementById("passwordError").classList.remove("hidden");
      hasError = true;
    }
    if (!adminCode) {
      document.getElementById("secretCodeError").classList.remove("hidden");
      hasError = true;
    }
    if (hasError) return;

    try {
      const response = await fetch(
        "https://prime-invest-server.onrender.com/api/admin/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            username: username,
            phoneNumber: phone,
            password: password,
            secretCode: adminCode,
          }),
        },
      );

      const data = await response.json();
      if (response.ok && data.success) {
        document.getElementById("signupForm").reset();
        toast.textContent = "Signed in successfully 🎉";
        toast.classList.add("show");
        setTimeout(() => {
          toast.classList.remove("show");
          setTimeout(() => {
            window.location.href = "dashboard.html";
          }, 100);
        }, 2000);
      } else {
        const toast = document.getElementById("toast");
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
document
  .getElementById("togglePasswordAdmin")
  .addEventListener("click", function () {
    const passwordInput = document.getElementById("secretCode");
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    this.classList.toggle("fa-eye");
    this.classList.toggle("fa-eye-slash");
  });
