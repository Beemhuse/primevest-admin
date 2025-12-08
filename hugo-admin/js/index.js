const sections = document.querySelectorAll(".pages");
const pageBtns = document.querySelectorAll(".pagesBtn");
const addNewPlanModal = document.getElementById("addNewPlanModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const addPlanForm = document.getElementById("addPlanForm");
const planNameInput = document.getElementById("planName");
const purchaseAmountInput = document.getElementById("purchaseAmount");
const statusInput = document.getElementById("status");
const filterSearchInput = document.getElementById("filterSearch");
const addPlan = document.getElementById("addPlan");
const filteredSearch = document.getElementById("filteredSearch");
const settingsBtn = document.querySelectorAll(".transactionBtn");
const Settings = document.querySelectorAll(".Settings");
const adminnameEl = document.getElementById("adminnameEl");
const adminName = document.getElementById("adminName");
const totalUsers = document.getElementById("totalUsers");
const totalInvestments = document.getElementById("totalInvestments");
const totalDeposits = document.getElementById("totalDeposits");
const totalWithdrawals = document.getElementById("totalWithdrawals");
const loader = document.getElementById("loader");
const usersContainer = document.getElementById("usersContainer");
const totalPlatformEarnings = document.getElementById("totalPlatformEarnings");
const totalDepositAmount = document.getElementById("totalDepositAmount");
const totalWithdrawalAmount = document.getElementById("totalWithdrawalAmount");
const totalInvestmentAmount = document.getElementById("totalInvestmentAmount");

// get admin dashboard analytics
async function loadAdminStats() {
  try {
    const response = await fetch(
      "https://api.primeevest.com/api/admin/stats",
      {
        method: "GET",
        headers: { "content-type": "application/json" },
        credentials: "include",
        cache: "no-store",
      }
    );

    const data = await response.json( );

    if (response.ok && data.success) {

      const adminAnal = data.data;
      document.querySelectorAll(".shimmer").forEach(el => el.classList.remove("shimmer"));
      totalUsers.textContent = adminAnal.totalUsers || 0;
      totalDeposits.textContent = adminAnal.totalDeposits || 0;
      totalInvestments.textContent = adminAnal.totalInvestments || 0;
      totalWithdrawals.textContent = adminAnal.totalWithdrawals || 0;
      totalPlatformEarnings.textContent = adminAnal.totalPlatformEarnings || 0;
      totalDepositAmount.textContent = "₦" + (adminAnal.totalDepositAmount || 0).toLocaleString();
      totalInvestmentAmount.textContent = "₦" + (adminAnal.totalInvestmentAmount || 0).toLocaleString();
      totalWithdrawalAmount.textContent = "₦" + (adminAnal.totalWithdrawalAmount || 0).toLocaleString();
    } else {
      console.error("Failed to fetch dashboard stats:", data.message);
      alert("Unable to load dashboard stats. Please try again.");
    }
  } catch (error) {
    console.error("Error fetching dashboard analytics:", error);
    alert("Error fetching dashboard analytics.");
    // window.location.href = "login.html";
  }

  // get admin info
  try {
    const response = await fetch(
      "https://api.primeevest.com/api/admin/me",
      {
        method: "GET",
        headers: { "content-type": "application/json" },
        credentials: "include",
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (response.ok && data.success) {
      const admin = data.data;
      adminName.textContent = admin.username;
    } else {
      console.error("error fetching admin details", data.message);
      alert("error fetching admin details");
      // window.location.href = "login.html";
    }
  } catch (error) {
    console.error("error fetching admin details", error);
    alert("unable to fetch admin details");
    // window.location.href = "login.html";
  }
}
window.addEventListener("DOMContentLoaded", loadAdminStats);

const editUserModal = document.getElementById("editUserModal");
const editUserForm = document.getElementById("editUserForm");
const accountStatusInput = document.getElementById("accountStatusInput");
const accountBalanceInput = document.getElementById("accountBalanceInput");
const investmentBalanceInput = document.getElementById(
  "investmentBalanceInput"
);
const welfareBalanceInput = document.getElementById("welfareBalanceInput");
const cancelEdit = document.getElementById("cancelEdit");

let currentUserId = null;

// 🟩 Load All Users
async function loadAllUsers() {
  loader.classList.remove("hidden");

  try {
    const res = await fetch(
      "https://api.primeevest.com/api/admin/users",
      {
        method: "GET",
        headers: { "content-type": "application/json" },
        credentials: "include",
        cache: "no-store",
      }
    );

    const data = await res.json();
    if (!res.ok || !data.success) throw new Error("Failed to load users");

    const users = data.data;
    usersContainer.innerHTML = "";

    if (users.length === 0) {
      usersContainer.innerHTML = `<div class="text-center py-8 text-gray-500 font-semibold">No users found</div>`;
      return;
    }
    // console.log(users)
    users.forEach((user) => {
  const userRow = document.createElement("div");
  userRow.className =
    "w-full px-4 py-2 border-b flex flex-col hover:bg-gray-50 transition-all text-sm";

  // main visible row
  userRow.innerHTML = `
  <div class="bg-white rounded-2xl shadow-sm border p-4 mb-4 transition hover:shadow-md">
  <!-- Top summary -->
  <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
    <div class="flex flex-col sm:flex-row sm:flex-wrap sm:gap-4 md:gap-0 md:w-5/6">
      <p class="text-gray-700 text-sm font-medium truncate">
        <span class="font-semibold text-gray-600">Username:</span> ${user.username}
      </p>
      <p class="text-gray-700 text-sm font-medium truncate">
        <span class="font-semibold text-gray-600">Phone:</span> ${user.phoneNumber}
      </p>
      <p class="text-gray-700 text-sm font-medium truncate">
        <span class="font-semibold text-gray-600">Welfare Bal:</span> ${user.welfareRechargeBalance || 0.0}
      </p>
      <p class="text-gray-700 text-sm font-medium truncate">
        <span class="font-semibold text-gray-600">Inv Bal:</span> ${user.investmentRechargeBalance || 0.0}
      </p>
      <p>
        <span class="inline-block font-semibold px-3 py-1 rounded-full text-xs ${
          user.accountStatus === "active"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }">${user.accountStatus}</span>
      </p>
    </div>

    <!-- Action buttons -->
    <div class="flex items-center justify-end gap-2">
      <button
        class="flex items-center gap-1 border px-3 py-1 text-xs rounded-md hover:bg-blue-50 hover:text-blue-600 transition editUserBtn"
        data-id="${user._id}"
      >
        <i class="fas fa-edit text-[10px]"></i>
        <span class="font-medium">Edit</span>
      </button>

      <button
        class="expandUserBtn border px-3 py-1 text-xs rounded-md hover:bg-gray-100 transition"
      >
        <i class="fas fa-chevron-down"></i>
      </button>
    </div>
  </div>

  <!-- Expandable details -->
  <div class="user-extra hidden mt-3 p-3 bg-gray-50 rounded-lg grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
    <div>
      <span class="font-semibold text-gray-600">Bank Name:</span>
      <span>${user.bankName || "none"}</span>
    </div>
    <div>
      <span class="font-semibold text-gray-600">Account Number:</span>
      <span>${user.accountNumber || "none"}</span>
    </div>
    <div>
      <span class="font-semibold text-gray-600">Account Name:</span>
      <span>${user.accountName || "none"}</span>
    </div>
  </div>
</div>

  `;

  usersContainer.appendChild(userRow);
});

// search input
// keep a copy of all users
let allUsers = [];

allUsers = users;

// search input functionality
const searchInput = document.getElementById("userSearch");

searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();

  // clear the container
  usersContainer.innerHTML = "";

  // filter by username
  const filteredUsers = allUsers.filter((user) =>
    user.username.toLowerCase().includes(query)
  );

  // re-render filtered users
  filteredUsers.forEach((user) => {
    const userRow = document.createElement("div");
    userRow.className =
      "w-full px-4 py-2 border-b flex flex-col hover:bg-gray-50 transition-all text-sm";

    userRow.innerHTML = `
    <div class="bg-white rounded-2xl shadow-sm border p-4 mb-4 transition hover:shadow-md">
  <!-- Top summary -->
  <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
    <div class="flex flex-col sm:flex-row sm:flex-wrap sm:gap-4 md:gap-0 md:w-5/6">
      <p class="text-gray-700 text-sm font-medium truncate">
        <span class="font-semibold text-gray-600">Username:</span> ${user.username}
      </p>
      <p class="text-gray-700 text-sm font-medium truncate">
        <span class="font-semibold text-gray-600">Phone:</span> ${user.phoneNumber}
      </p>
      <p class="text-gray-700 text-sm font-medium truncate">
        <span class="font-semibold text-gray-600">Welfare Bal:</span> ${user.welfareRechargeBalance || 0.0}
      </p>
      <p class="text-gray-700 text-sm font-medium truncate">
        <span class="font-semibold text-gray-600">Inv Bal:</span> ${user.investmentRechargeBalance || 0.0}
      </p>
      <p>
        <span class="inline-block font-semibold px-3 py-1 rounded-full text-xs ${
          user.accountStatus === "active"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }">${user.accountStatus}</span>
      </p>
    </div>

    <!-- Action buttons -->
    <div class="flex items-center justify-end gap-2">
      <button
        class="flex items-center gap-1 border px-3 py-1 text-xs rounded-md hover:bg-blue-50 hover:text-blue-600 transition editUserBtn"
        data-id="${user._id}"
      >
        <i class="fas fa-edit text-[10px]"></i>
        <span class="font-medium">Edit</span>
      </button>

      <button
        class="expandUserBtn border px-3 py-1 text-xs rounded-md hover:bg-gray-100 transition"
      >
        <i class="fas fa-chevron-down"></i>
      </button>
    </div>
  </div>

  <!-- Expandable details -->
  <div class="user-extra hidden mt-3 p-3 bg-gray-50 rounded-lg grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
    <div>
      <span class="font-semibold text-gray-600">Bank Name:</span>
      <span>${user.bankName || "none"}</span>
    </div>
    <div>
      <span class="font-semibold text-gray-600">Account Number:</span>
      <span>${user.accountNumber || "none"}</span>
    </div>
    <div>
      <span class="font-semibold text-gray-600">Account Name:</span>
      <span>${user.accountName || "none"}</span>
    </div>
  </div>
</div>

    `;
    usersContainer.appendChild(userRow);
  });
});


  } catch (error) {
    console.error("Error fetching users:", error);
    usersContainer.innerHTML = `<div class="text-center py-8 text-red-500 font-semibold">Failed to load users.</div>`;
  } finally {
    loader.classList.add("hidden");
  }
}
  usersContainer.addEventListener("click", async (e) => {
  
e.preventDefault();
// const expandBtn = e.target.closest(".expandUserBtn");
//   if (expandBtn) {
//     const userRow = expandBtn.closest("div").parentElement;
//     const extraSection = userRow.querySelector(".user-extra");

//     // toggle visibility
//     extraSection.classList.toggle("hidden");

//     // toggle arrow direction
//     const icon = expandBtn.querySelector("i");
//     icon.classList.toggle("fa-chevron-down");
//     icon.classList.toggle("fa-chevron-up");
//   }
const expandBtn = e.target.closest(".expandUserBtn");
if (expandBtn) {
  const userRow = expandBtn.closest(".w-full"); // FIXED
  const extraSection = userRow.querySelector(".user-extra");

  if (extraSection) {
    extraSection.classList.toggle("hidden");
  }

  // toggle arrow
  const icon = expandBtn.querySelector("i");
  icon.classList.toggle("fa-chevron-down");
  icon.classList.toggle("fa-chevron-up");
}


  const editBtn = e.target.closest(".editUserBtn");
  if (editBtn) {
    currentUserId = editBtn.dataset.id;
try {
    const res = await fetch(
      `https://api.primeevest.com/api/admin/users/${currentUserId}`,
      {
        method: "GET",
        headers: { "content-type": "application/json" },
        credentials: "include",
        cache: "no-store",
      }
    );

    const data = await res.json();
    if (data.success) {
      const userDetails = data.data;
      userDetails.investmentRechargeBalance = userInvestment;
      userDetails.welfareRechargeBalance = userWelfare;
        accountStatusInput.value = statusText.toLowerCase();
    investmentBalanceInput.value = userInvestment;
    welfareBalanceInput.value = userWelfare;
    }
  } catch (err) {
    console.error("Error fetching user:", err);
  }
    const userRow = editBtn.closest("div").parentElement;
    const statusText = userRow.querySelector("p").textContent.trim();

  

    editUserModal.classList.remove("scale-0");
    editUserModal.classList.add("scale-100");
  }
});


// 🟥 Close Modal
cancelEdit.addEventListener("click", () => {
  editUserModal.classList.remove("scale-100");
  editUserModal.classList.add("scale-0");
});

// 🟩 Submit Edit (PATCH)
editUserForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const saveBtn = document.getElementById("saveEditUser");
  saveBtn.textContent = "Updating...";
  saveBtn.disabled = true;

  const body = {
    accountStatus: accountStatusInput.value,
    investmentRechargeBalance: parseFloat(investmentBalanceInput.value),
    welfareRechargeBalance: parseFloat(welfareBalanceInput.value),
  };

  try {
  console.log("Updating user:", currentUserId, body);
  if (!currentUserId) throw new Error("Missing user ID.");
  if (!Object.keys(body).length) throw new Error("No data to update.");

  const res = await fetch(
    `https://api.primeevest.com/api/admin/users/${currentUserId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    }
  );

  let data = {};
  try {
    data = await res.json();
  } catch {
    console.warn("Response is not JSON");
  }

  if (!res.ok || !data.success) {
    throw new Error(data.message || `HTTP ${res.status}: Failed to update user`);
  }

  alert("✅ User updated successfully!");
  saveBtn.textContent = "Save";
  saveBtn.disabled = false;
  editUserModal.classList.remove("scale-100");
  editUserModal.classList.add("scale-0"); 
  loadAllUsers();
} catch (err) {
  console.error("Update user error:", err);
  alert(`❌ ${err.message || "Failed to update user."}`);
  saveBtn.textContent = "Save";
  saveBtn.disabled = false;
}
});

window.addEventListener("DOMContentLoaded", loadAllUsers);

// plans management

const baseUrl = "https://api.primeevest.com/api";
const plansContainer = document.getElementById("plansContainer");
const loadingText = document.getElementById("loadingText");
const addNewPlanBtn = document.getElementById("addNewPlanBtn");
const planModal = document.getElementById("planModal");
const closeModal = document.getElementById("closeModal");
const planForm = document.getElementById("planForm");
const modalTitle = document.getElementById("modalTitle");
const savePlanBtn = document.getElementById("savePlanBtn");

let editMode = false;

// 🟩 Fetch All Plans
async function fetchPlans() {
  try {
    const res = await fetch(`${baseUrl}/admin/plans`, {
      method: "GET",
      headers: { "content-type": "application/json" },
      credentials: "include",
      cache: "no-store",
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.message || "Failed to fetch plans");

    const plans = data.data;
    renderPlans(plans);
  } catch (err) {
    loadingText.textContent = "Error fetching plans.";
    console.error(err);
  }
}

// 🟩 Render Plans
function renderPlans(plans) {
  if (!plans.length) {
    plansContainer.innerHTML =
      '<p class="text-center text-gray-400 py-8">No plans available.</p>';
    return;
  }

  plansContainer.innerHTML = plans
    .map(
      (plan) => `
      <div class="bg-white rounded-xl shadow-sm border p-4 mb-4 transition hover:shadow-md planRow">

  <!-- Plan main info -->
  <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
    <div class="flex flex-col sm:flex-row sm:flex-wrap sm:gap-4 md:gap-0 md:w-5/6">
      <p class="text-gray-700 text-sm font-medium truncate">
        <span class="font-semibold text-gray-600">Title:</span> ${plan.title}
      </p>
      <p class="text-gray-700 text-sm font-medium truncate">
        <span class="font-semibold text-gray-600">Daily Income:</span> ₦${plan.dailyIncome}
      </p>
      <p class="text-gray-700 text-sm font-medium truncate">
        <span class="font-semibold text-gray-600">Duration:</span> ${plan.durationDays} Days
      </p>
      <p class="text-gray-700 text-sm font-medium truncate">
        <span class="font-semibold text-gray-600">Total Income:</span> ₦${plan.totalIncome}
      </p>
      <p class="text-gray-700 text-sm font-medium truncate">
        <span class="font-semibold text-gray-600">Price:</span> ₦${plan.price.toLocaleString()}
      </p>

      <p class="mt-1">
        <span class="inline-block font-semibold px-3 py-1 rounded-full text-xs text-white ${
          plan.status === "active" ? "bg-green-400" : "bg-gray-400"
        }">${plan.status}</span>
      </p>
    </div>

    <!-- Dropdown menu -->
    <div class="relative group flex items-center justify-center">
      <button
        class="cursor-pointer hover:bg-gray-100 border rounded-full w-8 h-8 flex items-center justify-center transition"
      >
        <i class="fas fa-ellipsis-v text-gray-600"></i>
      </button>

      <div
        class="absolute z-10 flex flex-col top-9 right-0 bg-white shadow-lg rounded-md scale-0 group-hover:scale-100 transition-transform duration-200 p-2 gap-1 w-28"
      >
        <span
          class="flex items-center gap-2 border-b p-2 hover:text-blue-500 cursor-pointer hover:bg-blue-50 transition-all rounded-md editPlanBtn"
          data-id="${plan._id}"
        >
          <i class="fas fa-edit text-[10px]"></i>
          <span class="text-[10px] font-semibold">Edit</span>
        </span>
        <span
          class="flex items-center gap-2 p-2 hover:text-red-500 cursor-pointer hover:bg-red-50 transition-all rounded-md deletePlanBtn"
          data-id="${plan._id}"
        >
          <i class="fas fa-trash text-[10px]"></i>
          <span class="text-[10px] font-semibold">Delete</span>
        </span>
      </div>
    </div>
  </div>
</div>

      `
    )
    .join("");

  attachActionListeners();
}

// 🟩 Attach Edit/Delete Listeners
function attachActionListeners() {
  document.querySelectorAll(".deletePlanBtn").forEach((btn) =>
    btn.addEventListener("click", async (e) => {
      const id = e.currentTarget.dataset.id;
      if (confirm("Are you sure you want to delete this plan?")) {
        await deletePlan(id);
      }
    })
  );

  document.querySelectorAll(".editPlanBtn").forEach((btn) =>
    btn.addEventListener("click", async (e) => {
      const id = e.currentTarget.dataset.id;
      openEditModal(id);
    })
  );
}

// 🟩 Delete Plan
async function deletePlan(id) {
  try {
    const res = await fetch(`${baseUrl}/admin/plans/${id}`, {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      credentials: "include",
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    alert("Plan deleted successfully!");
    fetchPlans();
  } catch (err) {
    alert("Failed to delete plan.");
    console.error(err);
  }
}

// 🟩 Create or Update Plan
planForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  savePlanBtn.textContent = editMode ? "Updating..." : "Saving...";
  savePlanBtn.disabled = true;

  const planData = {
    planType: document.getElementById("planType"),
    title: document.getElementById("planTitle").value.trim(),
    price: parseFloat(document.getElementById("planPrice").value),
    dailyIncome: parseFloat(document.getElementById("planDailyIncome").value),
    durationDays: parseInt(document.getElementById("planDurationDays").value),
    planType: document.getElementById("planType").value,
    totalIncome: parseFloat(document.getElementById("planTotalIncome").value),
    status: document.getElementById("planStatus").value,
    description: document.getElementById("planDescription").value.trim(),
  };

  try {
    const method = editMode ? "PATCH" : "POST";
    const endpoint = editMode
      ? `${baseUrl}/admin/plans/${document.getElementById("planId").value}`
      : `${baseUrl}/admin/plans`;

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(planData),
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.message);

    alert(`Plan ${editMode ? "updated" : "created"} successfully!`);
    planModal.classList.add("hidden");
    fetchPlans();
  } catch (err) {
    alert(err.message || "Something went wrong");
  } finally {
    savePlanBtn.textContent = "Save Plan";
    savePlanBtn.disabled = false;
  }
});

// 🟩 Open Modal (Create)
addNewPlanBtn.addEventListener("click", () => {
  editMode = false;
  modalTitle.textContent = "Create Plan";
  planForm.reset();
  planModal.classList.remove("hidden");
});

// 🟩 Open Modal (Edit)
async function openEditModal(id) {
  try {
    const res = await fetch(`${baseUrl}/admin/plans/${id}`, {
      method: "GET",
      headers: { "content-type": "application/json" },
      credentials: "include",
    });

    const data = await res.json();
    if (!data.success || !data.data)
      return alert("Failed to fetch plan details");

    const plan = data.data;

    editMode = true;
    modalTitle.textContent = "Edit Plan";
    document.getElementById("planType").value = plan.planType;
    document.getElementById("planId").value = plan._id;
    document.getElementById("planTitle").value = plan.title;
    document.getElementById("planPrice").value = plan.price;
    document.getElementById("planDailyIncome").value = plan.dailyIncome;
    document.getElementById("planDurationDays").value = plan.durationDays;
    document.getElementById("planTotalIncome").value = plan.totalIncome;
    document.getElementById("planStatus").value = plan.status;
    document.getElementById("planDescription").value = plan.description;

    planModal.classList.remove("hidden");
  } catch (err) {
    console.error(err);
    alert("Error loading plan for editing.");
  }
}

// 🟩 Close Modal
closeModal.addEventListener("click", () => planModal.classList.add("hidden"));

// 🟩 Initial Fetch
fetchPlans();

// financial services

const API_BASE_URL = "https://api.primeevest.com/api";
const investmentContainer = document.getElementById("investmentContainer");//.

// === FETCH & DISPLAY ALL INVESTMENTS ===
async function getAllInvestments() {
  investmentContainer.innerHTML = `
    <p class="text-gray-500 text-center py-6">Loading investments...</p>
  `;

  try {
    const response = await fetch(`${API_BASE_URL}/admin/investments`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const data = await response.json();

    if (!data.success || !Array.isArray(data.data)) {
      investmentContainer.innerHTML = `
        <p class="text-gray-500 text-center py-6">No investments found.</p>
      `;
      return;
    }

    // If no data
    if (data.data.length === 0) {
      investmentContainer.innerHTML = `
        <p class="text-gray-500 text-center py-6">No investments yet.</p>
      `;
      return;
    }

    // Clear container
    investmentContainer.innerHTML = "";

    // Render each investment
    data.data.forEach((inv) => {
      const card = document.createElement("div");
      card.className =
        "w-full flex flex-col border-b hover:bg-gray-50 transition-all duration-300 p-4";

      card.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm border p-4 mb-4 hover:shadow-md transition">

  <!-- Top Info -->
  <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
    <div class="flex flex-col sm:flex-row sm:flex-wrap sm:gap-4 md:gap-6 text-sm text-gray-700">

      <p class="font-semibold text-gray-800">
        Title: <span class="font-normal">${inv.plan?.title || "N/A"}</span>
      </p>

      <p>
        <span class="font-semibold text-gray-800">Username:</span>
        ${inv.user?.username || "Unknown User"}
      </p>

      <p>
        <span class="font-semibold text-gray-800">Amount Inv:</span>
        ₦${inv.amount || 0}
      </p>

      <p>
        <span class="font-semibold text-gray-800">Profit:</span>
        ₦${inv.profitEarned || 0}
      </p>

      <p>
        <span class="font-semibold text-gray-800">Start Date:</span>
        ${formatDate(inv.startDate)}
      </p>

      <p>
        <span class="font-semibold text-gray-800">End Date:</span>
        ${formatDate(inv.endDate)}
      </p>

      <p>
        <span
          class="inline-block text-xs font-semibold px-3 py-1 rounded-full ${
            inv.status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-700"
          }"
        >
          ${inv.status}
        </span>
      </p>
    </div>
  </div>

  <!-- Bottom (extra info) -->
  <div class="mt-3 border-t pt-3 text-sm text-gray-600 grid sm:grid-cols-2 gap-2">
    <p>
      <span class="font-semibold text-gray-700">User Phone:</span>
      ${inv.user?.phoneNumber || "N/A"}
    </p>
    <p class="hidden">
      <span class="font-semibold text-gray-700">Investment ID:</span>
      ${inv._id}
    </p>
    <p class="hidden">
      <span class="font-semibold text-gray-700">User ID:</span>
      ${inv.user?._id || "N/A"}
    </p>
  </div>
</div>

      `;

      investmentContainer.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching investments:", error);
    investmentContainer.innerHTML = `
      <p class="text-red-500 text-center py-6">Failed to load investments. Please try again.</p>
    `;
  }
}

// === HELPER: FORMAT DATE ===
function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return date.toISOString().split("T")[0];
}

// === INITIAL CALL ===
getAllInvestments();


// page loading
pageBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    pageBtns.forEach((b) => b.classList.remove("background", "text-white"));
    btn.classList.add("background", "text-white");
    sections.forEach((section) => {
      section.classList.add("hidden");
    });
    const target = document.querySelector(btn.dataset.target);
    target.classList.remove("hidden");
  });
});
settingsBtn.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    settingsBtn.forEach((b) => b.classList.remove("borderButton"));
    btn.classList.add("borderButton");
    Settings.forEach((section) => {
      section.classList.add("hidden");
    });
    const target = document.querySelector(btn.dataset.target);
    target.classList.remove("hidden");
  });
});
// transaction management
(function () {
  const API_BASE_URL = "https://api.primeevest.com/api";
  const depositContainer = document.getElementById("depositContainer");
  const withdrawalContainer = document.getElementById("withdrawalContainer");

  // Modal & controls (scoped)
  const editModal = document.getElementById("editModal2");
  const modalTitle =
    editModal?.querySelector("#modalTitle2") ||
    document.getElementById("modalTitle2");
  // prefer modal-scoped select/button if present
  const statusSelect =
    editModal?.querySelector("#statusSelect2") ||
    document.getElementById("statusSelect2");
  const cancelEditBtn =
    editModal?.querySelector("#cancelEdit2") ||
    document.getElementById("cancelEdit2");

  // Robust save button lookup (tries several common ids so you don't have to edit HTML immediately)
  const saveEditBtn_2 = document.getElementById("saveEditTransaction");

  // State for modal
  let currentEdit = null; // { type: 'deposit'|'withdrawal', id: '...' }

  // --- small toast helper ---
  function showToast(message, type = "success") {
    const t = document.createElement("div");
    t.className =
      "fixed right-4 top-4 z-[9999] px-4 py-2 rounded shadow-lg text-sm " +
      (type === "error" ? "bg-red-600 text-white" : "bg-green-600 text-white");
    t.textContent = message;
    document.body.appendChild(t);
    setTimeout(() => {
      t.style.transition = "opacity 220ms";
      t.style.opacity = "0";
      setTimeout(() => t.remove(), 240);
    }, 2200);
  }

  function showMessage(container, message, type = "info") {
    const color = type === "error" ? "text-red-500" : "text-gray-500";
    container.innerHTML = `<p class="${color} text-center py-6">${message}</p>`;
  }

  function formatDate(dateStr) {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toISOString().split("T")[0];
  }

  // --- Modal helpers ---
  function openModal(type, id, currentStatus) {
    currentEdit = { type, id };
    if (modalTitle)
      modalTitle.textContent = `${
        type === "deposit" ? "Edit Deposit" : "Edit Withdrawal"
      } Status`;

    if (!statusSelect) {
      console.warn("statusSelect not found in DOM");
    } else {
      statusSelect.innerHTML =
        type === "deposit"
          ? `
          <option value="pending">pending</option>
          <option value="successful">successful</option>
          <option value="failed">failed</option>
        `
          : `
          <option value="successful">successful</option>
          <option value="failed">failed</option>
        `;
      statusSelect.value =
        currentStatus || statusSelect.querySelector("option").value;
    }

    if (editModal) {
      editModal.classList.remove("hidden");
      editModal.classList.add("flex");
    } else {
      alert("Edit modal not found");
    }
  }

  function closeModal() {
    currentEdit = null;
    if (editModal) {
      editModal.classList.add("hidden");
      editModal.classList.remove("flex");
    }
  }

  // click outside modal to close (works if modal covers the viewport)
  if (editModal) {
    editModal.addEventListener("click", (e) => {
      if (e.target === editModal) closeModal();
    });
  }
  if (cancelEditBtn) cancelEditBtn.addEventListener("click", closeModal);

  if (!saveEditBtn_2) {
    console.warn(
      "Save button for transactions not found. Add an element with id 'saveEditTransaction' (or 'saveEdit-transaction' / 'saveEditTransactionBtn' / 'saveEdit')."
    );
  } else {
    saveEditBtn_2.addEventListener("click", async () => {
      console.log("clicked");
      if (!currentEdit) return;
      if (!statusSelect) {
        alert("Status select not found");
        return;
      }
      const newStatus = statusSelect.value;
      // disable to prevent double clicks
      const prevText = saveEditBtn_2.textContent;
      saveEditBtn_2.textContent = "Updating...";
      saveEditBtn_2.disabled = true;
      try {
        if (currentEdit.type === "deposit") {
          await updateDepositStatus(currentEdit.id, newStatus);
          await loadAllDeposits();
          showToast("Deposit updated", "success");
        } else {
          await updateWithdrawalStatus(currentEdit.id, newStatus);
          await loadAllWithdrawals();
          showToast("Withdrawal updated", "success");
        }
        closeModal();
      } catch (err) {
        console.error("Update failed:", err);
        showToast("Failed to update status", "error");
      } finally {
        saveEditBtn_2.disabled = false;
        saveEditBtn_2.textContent = prevText;
      }
    });
  }

  // --- FETCH DEPOSITS ---
  async function loadAllDeposits() {
    showMessage(depositContainer, "Loading deposits...", "loading");
    try {
      const res = await fetch(`${API_BASE_URL}/admin/deposits`, {
        method: "GET",
        headers: { "content-type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const payload = await res.json();
      if (
        !payload.success ||
        !Array.isArray(payload.data) ||
        payload.data.length === 0
      ) {
        showMessage(depositContainer, "No deposits yet.", "info");
        return;
      }
      depositContainer.innerHTML = "";
      payload.data.forEach((d) =>
        depositContainer.appendChild(createDepositCard(d))
      );
    } catch (err) {
      console.error("Error fetching deposits:", err);
      showMessage(depositContainer, "Error fetching deposits.", "error");
    }
  }

  // --- FETCH WITHDRAWALS ---
  async function loadAllWithdrawals() {
    showMessage(withdrawalContainer, "Loading withdrawals...", "loading");
    try {
      const res = await fetch(`${API_BASE_URL}/admin/withdrawals`, {
        method: "GET",
        headers: { "content-type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const payload = await res.json();
      if (
        !payload.success ||
        !Array.isArray(payload.data) ||
        payload.data.length === 0
      ) {
        showMessage(withdrawalContainer, "No withdrawals yet.", "info");
        return;
      }
      withdrawalContainer.innerHTML = "";
      payload.data.forEach((w) =>
        withdrawalContainer.appendChild(createWithdrawalCard(w))
      );
    } catch (err) {
      console.error("Error fetching withdrawals:", err);
      showMessage(withdrawalContainer, "Error fetching withdrawals.", "error");
    }
  }

  // --- CREATE DEPOSIT CARD ---
  function createDepositCard(d) {
    const card = document.createElement("div");
    card.className =
      "w-full flex flex-col border-b hover:bg-gray-50 transition-all duration-200";

    const row = document.createElement("div");
    row.className = "w-full flex p-4 items-center justify-between";
    const proofUrl =
      d.proofOfPayment?.asset?.url || d.proofOfPayment?.url || "";

    row.innerHTML = `
    <div class="bg-white rounded-xl shadow-sm border p-4 mb-4 hover:shadow-md transition">

  <!-- Top Summary -->
  <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

    <div class="flex flex-col sm:flex-row sm:flex-wrap sm:gap-4 text-sm text-gray-700">
      <span class="hidden font-medium">${escapeText(d._id)}</span>

      <p class="font-semibold text-gray-800">
        Username: <span class="font-normal">${escapeText(d.user?.username || "—")}</span>
      </p>

      <p>
        <span class="font-semibold text-gray-800">Amount:</span>
        ₦${escapeText(d.amount ?? 0)}
      </p>

      <p>
        <span class="font-semibold text-gray-800">Bal Type:</span>
        ${escapeText(d.balanceType || "—")}
      </p>

      <p>
        <span class="font-semibold text-gray-800">Date:</span>
        ${formatDate(d.fundedAt)}
      </p>

      <p>
        <span class="font-semibold text-gray-800">Sender:</span>
        ${escapeText(d.senderName || "—")}
      </p>

      <p>
        <span
          class="inline-block text-xs font-semibold px-3 py-1 rounded-full ${statusBadgeClass(
            d.status
          )}"
        >
          ${escapeText(d.status)}
        </span>
      </p>
    </div>

    <!-- Dropdown Menu -->
    <div class="relative group flex items-center justify-center">
      <button
        class="action-toggle cursor-pointer hover:bg-gray-100 border rounded-full w-8 h-8 flex items-center justify-center transition"
        data-id="${d._id}"
      >
        <i class="fas fa-ellipsis-v text-gray-600"></i>
      </button>

      <div
        class="absolute top-9 right-0 z-10 w-36 bg-white shadow-lg rounded-md hidden p-2 card-dropdown group-hover:block transition-all duration-200"
      >
        <div
          class="px-2 py-1 text-sm text-gray-600 rounded-md cursor-pointer hover:bg-green-100 editBtn-deposit"
          data-id="${d._id}"
        >
          Edit
        </div>
        <div
          class="px-2 py-1 text-sm text-gray-600 rounded-md cursor-pointer hover:bg-blue-100 expandBtn"
          data-id="${d._id}"
        >
          Expand
        </div>
      </div>
    </div>
  </div>

  <!-- Expandable Details -->
  <div class="hidden details mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
    <p><strong>User Phone:</strong> ${escapeText(d.user?.phoneNumber || "—")}</p>
    <p><strong>Proof of Payment:</strong></p>
    <div class="mt-2">
      ${
        proofUrl
          ? `<img src="${proofUrl}" alt="proof" class="max-w-xs border rounded" onerror="this.style.display='none'"/>`
          : `<span class="text-gray-500">No proof provided</span>`
      }
    </div>
  </div>
</div>

    `;
const details = row.querySelector(".details")
    card.appendChild(row);
    card.appendChild(details);

    // wire actions
    const toggle = row.querySelector(".action-toggle");
    const dropdown = row.querySelector(".card-dropdown");
    const editBtn = dropdown.querySelector(".editBtn-deposit");
    const expandBtn = dropdown.querySelector(".expandBtn");

    // toggle dropdown (scoped to deposits)
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      document
        .querySelectorAll("#depositContainer .card-dropdown")
        .forEach((el) => {
          if (el !== dropdown) el.classList.add("hidden");
        });
      dropdown.classList.toggle("hidden");
    });

    expandBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      dropdown.classList.add("hidden");
      details.classList.toggle("hidden");
    });

    editBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      dropdown.classList.add("hidden");
      openModal("deposit", d._id, d.status);
    });

    return card;
  }

  // --- CREATE WITHDRAWAL CARD ---
  function createWithdrawalCard(w) {
    const card = document.createElement("div");
card.className = `
  w-full sm:w-[48%] lg:w-[32%] bg-white border border-gray-200 
  rounded-xl shadow-sm p-4 mb-4 flex flex-col justify-between 
  hover:shadow-lg transition-all duration-200
`;

const row = document.createElement("div");
row.className = "flex flex-col gap-2";
row.innerHTML = `
  <div class="flex flex-wrap justify-between items-center">
    <span class="hidden text-gray-700 font-medium">${escapeText(w._id)}</span>
    <span class="font-semibold text-gray-800">${escapeText(w.user?.username || "—")}</span>
    <span class="px-2 py-1 text-xs rounded-full ${statusBadgeClass(w.status)}">
      ${escapeText(w.status)}
    </span>
  </div>

  <div class="grid grid-cols-2 gap-y-2 text-sm text-gray-600 mt-2">
    <p><strong>Amount:</strong> ₦${escapeText(w.amount ?? 0)}</p>
    <p><strong>Bal type:</strong> ${escapeText(w.balanceType || "—")}</p>
    <p><strong>Date:</strong> ${formatDate(w.withdrawnAt)}</p>
  </div>

  <div class="flex justify-end mt-3 relative">
    <button 
      class="flex items-center justify-center w-8 h-8 border rounded-full cursor-pointer action-toggle" 
      data-id="${w._id}"
    >
      <i class="fas fa-ellipsis-v text-gray-600"></i>
    </button>

    <div class="absolute top-10 right-0 z-20 w-36 bg-white shadow-lg rounded-md hidden p-2 card-dropdown">
      <div 
        class="px-2 py-1 text-sm text-gray-600 rounded-md cursor-pointer hover:bg-green-100 editBtn-withdrawal" 
        data-id="${w._id}"
      >
        Edit
      </div>
      <div 
        class="px-2 py-1 text-sm text-gray-600 rounded-md cursor-pointer hover:bg-blue-100 expandBtn" 
        data-id="${w._id}"
      >
        Expand
      </div>
    </div>
  </div>
`;

const details = document.createElement("div");
details.className = `
  hidden mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 
  border border-gray-100 space-y-1
`;
details.innerHTML = `
  <p><strong>User phone:</strong> ${escapeText(w.user?.phoneNumber || "—")}</p>
  <p><strong>Account status:</strong> ${escapeText(w.user?.accountStatus || "—")}</p>
  <p><strong>Net amount:</strong> ₦${w.netAmount || 0.00}</p>
  <p><strong>Platform fee:</strong> ₦${w.platformFee || 0.00}</p>
`;
    card.appendChild(row);
    card.appendChild(details);

    const toggle = row.querySelector(".action-toggle");
    const dropdown = row.querySelector(".card-dropdown");
    const editBtn = dropdown.querySelector(".editBtn-withdrawal");
    const expandBtn = dropdown.querySelector(".expandBtn");

    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      document
        .querySelectorAll("#withdrawalContainer .card-dropdown")
        .forEach((el) => {
          if (el !== dropdown) el.classList.add("hidden");
        });
      dropdown.classList.toggle("hidden");
    });

    expandBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      dropdown.classList.add("hidden");
      details.classList.toggle("hidden");
    });

    editBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      dropdown.classList.add("hidden");
      openModal("withdrawal", w._id, w.status);
    });

    return card;
  }

  async function updateDepositStatus(_id, status) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/deposits/${_id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });

      const payload = await res.json().catch(() => ({}));
      console.log("Deposit PATCH:", res.status, payload);

      if (!res.ok || !payload.success) {
        showToast(
          payload.message || `Error (${res.status}) updating deposit`,
          "error"
        );
        throw new Error(payload.message || "Failed to update deposit");
      }

      return payload;
    } catch (err) {
      console.error("Deposit update error:", err);
      showToast(err.message, "error");
      throw err;
    }
  }

  async function updateWithdrawalStatus(_id, status) {
    try {
      const res = await fetch(
        `${API_BASE_URL}/admin/withdrawals/${_id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status }),
        }
      );

      const payload = await res.json().catch(() => ({}));
      console.log("Withdrawal PATCH:", res.status, payload);

      if (!res.ok || !payload.success) {
        showToast(
          payload.message || `Error (${res.status}) updating withdrawal`,
          "error"
        );
        throw new Error(payload.message || "Failed to update withdrawal");
      }

      return payload;
    } catch (err) {
      console.error("Withdrawal update error:", err);
      showToast(err.message, "error");
      throw err;
    }
  }

 function statusBadgeClass(status) {
  const s = (status || "").toLowerCase();
  if (s === "approved" || s === "successful")
    return "bg-green-100 text-green-700";
  if (s === "pending") return "bg-yellow-100 text-yellow-800";
  if (s === "failed") return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-700";
}


  function escapeText(input) {
    if (input === undefined || input === null) return "";
    return String(input)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // close open dropdowns if clicking anywhere else
  document.addEventListener("click", () => {
    document
      .querySelectorAll(".card-dropdown")
      .forEach((el) => el.classList.add("hidden"));
  });

  document.addEventListener("DOMContentLoaded", () => {
    loadAllDeposits();
    loadAllWithdrawals();
  });

  // expose for debugging
  window.IDBTransaction = { loadAllDeposits, loadAllWithdrawals };
})();
