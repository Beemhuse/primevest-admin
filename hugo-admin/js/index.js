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

// get admin dashboard analytics
async function loadAdminStats() {
  try {
    const response = await fetch(
      "https://prime-invest-server.onrender.com/api/admin/stats",
      {
        method: "GET",
        headers: { "content-type": "application/json" },
        credentials: "include",
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (response.ok && data.success) {
      const adminAnal = data.data;

      totalUsers.textContent = adminAnal.totalUsers || 0;
      totalDeposits.textContent = adminAnal.totalDeposits || 0;
      totalInvestments.textContent = adminAnal.totalInvestments || 0;
      totalWithdrawals.textContent = adminAnal.totalWithdrawals || 0;
    } else {
      console.error("Failed to fetch dashboard stats:", data.message);
      alert("Unable to load dashboard stats. Please try again.");
    }
  } catch (error) {
    console.error("Error fetching dashboard analytics:", error);
    alert("Error fetching dashboard analytics.");
    window.location.href = "login.html";
  }

  // get admin info
  try {
    const response = await fetch(
      "https://prime-invest-server.onrender.com/api/admin/me",
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
      window.location.href = "login.html";
    }
  } catch (error) {
    console.error("error fetching admin details", error);
    alert("unable to fetch admin details");
    window.location.href = "login.html";
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
      "https://prime-invest-server.onrender.com/api/admin/users",
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

    users.forEach((user) => {
      const userRow = document.createElement("div");
      userRow.className =
        "w-full px-4 py-2 border-b flex items-center justify-between hover:bg-gray-50 transition-all text-sm";

      userRow.innerHTML = `
        <span class="text-gray-700 w-[14%] text-center truncate">${
          user.username
        }</span>
        <span class="text-gray-700 w-[14%] text-center truncate">${
          user.phoneNumber
        }</span>
        <span class="text-gray-700 w-[14%] text-center truncate">${
          user.welfareBalance || "N/A"
        }</span>
        <span class="text-gray-700 w-[14%] text-center truncate">${
          user.investmentBalance || "N/A"
        }</span>
        <span class="text-gray-700 w-[14%] text-center truncate">${
          user.role || "N/A"
        }</span>
        <span class="text-gray-700 w-[14%] text-center truncate">
          <p class="text-green-700 font-semibold w-max ${
            user.accountStatus === "active"
              ? "bg-green-100"
              : "bg-red-100 text-red-700"
          } px-2 py-1 rounded-full capitalize">${user.accountStatus}</p>
        </span>
        <span class="text-gray-500 w-[14%] relative flex items-center justify-center group cursor-pointer dropdown">
  <i class="fas fa-ellipsis-v"></i>
  <span class="absolute z-10 flex flex-col top-4 -right-9 bg-white shadow-lg rounded-md opacity-0 pointer-events-none group-hover:opacity-100 p-2 gap-2 transition-all duration-200 dropdown-menu">
    <span class="flex items-center gap-2 border-b p-2 hover:text-blue-500 cursor-pointer group hover:bg-blue-100 rounded-md transition-all editUserBtn" data-id="${
      user._id
    }">
      <i class="fas fa-edit text-[10px]"></i>
      <span class="text-[10px] font-semibold">Edit</span>
    </span>
  </span>
</span>

      `;

      usersContainer.appendChild(userRow);
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    usersContainer.innerHTML = `<div class="text-center py-8 text-red-500 font-semibold">Failed to load users.</div>`;
  } finally {
    loader.classList.add("hidden");
  }
}

// 🟦 Open Modal with User Data
usersContainer.addEventListener("click", (e) => {
  const editBtn = e.target.closest(".editUserBtn");
  if (editBtn) {
    currentUserId = editBtn.dataset.id;

    const userRow = editBtn.closest("div").parentElement;
    const statusText = userRow.querySelector("p").textContent.trim();

    accountStatusInput.value = statusText.toLowerCase();
    accountBalanceInput.value = "";
    investmentBalanceInput.value = "";
    welfareBalanceInput.value = "";

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
    accountBalance: parseFloat(accountBalanceInput.value),
    investmentBalance: parseFloat(investmentBalanceInput.value),
    welfareBalance: parseFloat(welfareBalanceInput.value),
  };

  try {
    const res = await fetch(
      `https://prime-invest-server.onrender.com/api/admin/users/${currentUserId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();
    if (!res.ok || !data.success)
      throw new Error(data.message || "Failed to update user");

    alert("✅ User updated successfully!");
    saveBtn.textContent = "Save";
    editUserModal.classList.remove("scale-100");
    editUserModal.classList.add("scale-0");
    saveBtn.disabled = false;
    loadAllUsers();
  } catch (err) {
    console.error(err);
    alert("❌ Failed to update user.");
  }
});

window.addEventListener("DOMContentLoaded", loadAllUsers);

// plans management

const baseUrl = "https://prime-invest-server.onrender.com/api";
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
    <div class="w-full rounded-md px-4 py-2 border-b flex items-center justify-between planRow">
      <span class="text-gray-700 w-1/6">${plan.title}</span>
      <span class="text-gray-700 w-1/6">₦${plan.dailyIncome}</span>
      <span class="text-gray-700 w-1/6">${plan.durationDays} Days</span>
      <span class="text-gray-700 w-1/6">₦${plan.totalIncome}</span>
      <span class="text-gray-700 w-1/6">₦${plan.price.toLocaleString()}</span>
      <span class="text-gray-700 w-1/6">
        <p class="text-white font-semibold w-max ${
          plan.status === "active" ? "bg-green-400" : "bg-gray-400"
        } px-2 py-1 rounded-full capitalize">${plan.status}</p>
      </span>
      <span class="text-gray-500 w-1/6 cursor-pointer relative hover:bg-gray-100 group flex items-center justify-center w-8 h-8 border rounded-full">
        <i class="fas fa-ellipsis-v"></i>
        <span class="absolute z-10 flex flex-col top-6 -right-9 bg-white shadow-lg rounded-md scale-0 group-hover:scale-100 transition-all duration-300 p-2 gap-2">
          <span class="flex items-center gap-2 border-b p-2 hover:text-blue-500 cursor-pointer hover:bg-blue-100 transition-all rounded-md duration-300 mb-2 editPlanBtn" data-id="${
            plan._id
          }">
            <i class="fas fa-edit text-[10px]"></i>
            <span class="text-[10px] font-semibold">Edit</span>
          </span>
          <span class="flex items-center gap-2 border-b p-2 rounded-md hover:text-red-500 cursor-pointer hover:bg-red-100 transition-all duration-300 deletePlanBtn" data-id="${
            plan._id
          }">
            <i class="fas fa-trash text-[10px]"></i>
            <span class="text-[10px] font-semibold">Delete</span>
          </span>
        </span>
      </span>
    </div>`
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

const API_BASE_URL = "https://prime-invest-server.onrender.com/api";
const investmentContainer = document.getElementById("investmentContainer");
const editModal = document.getElementById("editModalInv");
const statusSelect = document.getElementById("statusSelectInv");
const cancelEditBtn = document.getElementById("cancelEditInv");
const saveEditBtn = document.getElementById("saveEditInv");

let currentEditingId = null;
async function getAllInvestments() {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/investments`, {
      method: "GET",
      headers: { "content-type": "application/json" },
      credentials: "include",
    });
    const data = await response.json();

    if (data.success && Array.isArray(data.data)) {
      if (data.data.length === 0) {
        investmentContainer.innerHTML = `
        <p class="text-gray-500 text-center py-6">No investments yet.</p>
      `;
        return;
      }
      investmentContainer.innerHTML = "";
      data.data.forEach((investment) => {
        const card = createInvestmentCard(investment);
        investmentContainer.appendChild(card);
      });
    } else {
      investmentContainer.innerHTML = `<p class="text-gray-500 text-center py-4">No investments found.</p>`;
    }
  } catch (error) {
    console.error("Error fetching investments:", error);
    investmentContainer.innerHTML = `<p class="text-red-500 text-center py-4">Failed to load investments.</p>`;
  }
}

// === CREATE INVESTMENT CARD ===
function createInvestmentCard(investment) {
  const card = document.createElement("div");
  card.className =
    "w-full flex flex-col border-b hover:bg-gray-50 transition-all duration-300";

  const summary = document.createElement("div");
  summary.className =
    "w-full flex p-4 items-center justify-between cursor-pointer";

  summary.innerHTML = `
    <span class="text-gray-700 font-medium">${
      investment.plan?.title || "N/A"
    }</span>
    <span class="text-gray-700">${investment.user?.name}</span>
    <span class="text-gray-700">${
      investment.plan?.durationDays || 0
    } days</span>
    <span class="text-gray-700">₦${investment.amount || 0}</span>
    <span class="text-gray-700">${formatDate(investment.startDate)}</span>
    <span class="text-gray-700">${formatDate(investment.endDate)}</span>
    <span class="px-2 py-1 text-xs rounded-full ${
      investment.status === "active"
        ? "bg-green-100 text-green-700"
        : "bg-gray-200 text-gray-700"
    }">${investment.status}</span>

    <!-- Actions -->
    <span class="relative flex items-center justify-center w-8 h-8 border rounded-full cursor-pointer group hover:bg-gray-100">
      <i class="fas fa-ellipsis-v text-gray-600"></i>
      <div class="absolute top-8 right-0 z-10 w-32 bg-white shadow-lg rounded-md scale-0 group-hover:scale-100 transition-all duration-200 origin-top-right p-2">
        <div class="flex items-center gap-2 px-2 py-1 text-sm text-gray-600 rounded-md cursor-pointer hover:bg-blue-100 hover:text-blue-600 editBtn-investments">
          <i class="fas fa-edit text-[12px]"></i>
          <span class="text-[12px] font-medium">Edit</span>
        </div>
        <div class="flex items-center gap-2 px-2 py-1 text-sm text-gray-600 rounded-md cursor-pointer hover:bg-green-100 hover:text-green-600 expandBtn">
          <i class="fas fa-compress"></i>
          <span class="text-[12px] font-medium">Expand</span>
        </div>
      </div>
    </span>
  `;

  // Expanded details section
  const details = document.createElement("div");
  details.className = "hidden px-6 pb-4 text-sm text-gray-600 bg-gray-50";
  details.innerHTML = `
    <p><strong>User Email:</strong> ${investment.user?.email || "N/A"}</p>
    <p><strong>Daily Income:</strong> ₦${investment.dailyIncome || 0}</p>
    <p><strong>Total Income:</strong> ₦${investment.totalIncome || 0}</p>
    <p><strong>Plan Status:</strong> ${investment.plan?.status || "N/A"}</p>
    <p><strong>Investment ID:</strong> ${investment._id}</p>
  `;

  // Expand toggle
  summary
    .querySelector(".expandBtn")
    .addEventListener("click", () => details.classList.toggle("hidden"));

  // Edit toggle
  summary
    .querySelector(".editBtn-investments")
    .addEventListener("click", () => {
      currentEditingId = investment._id;
      statusSelect.value = investment.status;
      editModal.classList.remove("hidden");
      editModal.classList.add("flex");
    });

  card.appendChild(summary);
  card.appendChild(details);

  return card;
}

// === PATCH: UPDATE INVESTMENT STATUS ===
async function updateInvestmentStatus(id, status) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/investments/${id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );

    const result = await response.json();

    if (result.success) {
      alert("Investment status updated successfully.");
      getAllInvestments();
    } else {
      alert("Failed to update investment status.");
    }
  } catch (error) {
    console.error("Error updating investment:", error);
    alert("An error occurred while updating the investment.");
  }
}

// === HELPERS ===
function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return date.toISOString().split("T")[0];
}

// === MODAL CONTROLS ===
cancelEditBtn.addEventListener("click", () => {
  editModal.classList.add("hidden");
  editModal.classList.remove("flex");
});

saveEditBtn.addEventListener("click", () => {
  const newStatus = statusSelect.value;
  if (currentEditingId) {
    updateInvestmentStatus(currentEditingId, newStatus);
    editModal.classList.add("hidden");
    editModal.classList.remove("flex");
  }
});

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
  const API_BASE_URL = "https://prime-invest-server.onrender.com/api";
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
           <option value="pending">pending</option>
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
      <span class="text-gray-700 font-medium">${escapeText(d._id)}</span>
      <span class="text-gray-700">${escapeText(d.user?.username || "—")}</span>
      <span class="text-gray-700">₦${escapeText(d.amount ?? 0)}</span>
      <span class="text-gray-700">${escapeText(d.balanceType || "—")}</span>
      <span class="text-gray-700">${formatDate(d.fundedAt)}</span>
      <span class="text-gray-700">${escapeText(d.senderName || "—")}</span>
      <span class="px-2 py-1 text-xs rounded-full ${statusBadgeClass(
        d.status
      )}">${escapeText(d.status)}</span>

      <span class="relative flex items-center justify-center w-8 h-8 border rounded-full cursor-pointer action-toggle" data-id="${
        d._id
      }">
        <i class="fas fa-ellipsis-v text-gray-600"></i>
        <div class="absolute top-8 right-0 z-10 w-36 bg-white shadow-lg rounded-md hidden p-2 card-dropdown">
          <div class="px-2 py-1 text-sm text-gray-600 rounded-md cursor-pointer hover:bg-green-100 editBtn-deposit" data-id="${
            d._id
          }">Edit</div>
          <div class="px-2 py-1 text-sm text-gray-600 rounded-md cursor-pointer hover:bg-blue-100 expandBtn" data-id="${
            d._id
          }">Expand</div>
        </div>
      </span>
    `;

    const details = document.createElement("div");
    details.className = "hidden px-6 pb-4 text-sm text-gray-600 bg-gray-50";
    details.innerHTML = `
      <p><strong>User phone:</strong> ${escapeText(
        d.user?.phoneNumber || "—"
      )}</p>
      <p><strong>Proof of payment:</strong></p>
      <div class="mt-2">
        ${
          proofUrl
            ? `<img src="${proofUrl}" alt="proof" class="max-w-xs border rounded" onerror="this.style.display='none'"/>`
            : `<span class="text-gray-500">No proof provided</span>`
        }
      </div>
    `;

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
    card.className =
      "w-full flex flex-col border-b hover:bg-gray-50 transition-all duration-200";

    const row = document.createElement("div");
    row.className = "w-full flex p-4 items-center justify-between";
    row.innerHTML = `
      <span class="text-gray-700 font-medium">${escapeText(w._id)}</span>
      <span class="text-gray-700">${escapeText(w.user?.username || "—")}</span>
      <span class="text-gray-700">₦${escapeText(w.amount ?? 0)}</span>
      <span class="text-gray-700">${escapeText(w.balanceType || "—")}</span>
      <span class="text-gray-700">${formatDate(w.withdrawnAt)}</span>
      <span class="px-2 py-1 text-xs rounded-full ${statusBadgeClass(
        w.status
      )}">${escapeText(w.status)}</span>

      <span class="relative flex items-center justify-center w-8 h-8 border rounded-full cursor-pointer action-toggle" data-id="${
        w._id
      }">
        <i class="fas fa-ellipsis-v text-gray-600"></i>
        <div class="absolute top-8 right-0 z-10 w-36 bg-white shadow-lg rounded-md hidden p-2 card-dropdown">
          <div class="px-2 py-1 text-sm text-gray-600 rounded-md cursor-pointer hover:bg-green-100 editBtn-withdrawal" data-id="${
            w._id
          }">Edit</div>
          <div class="px-2 py-1 text-sm text-gray-600 rounded-md cursor-pointer hover:bg-blue-100 expandBtn" data-id="${
            w._id
          }">Expand</div>
        </div>
      </span>
    `;

    const details = document.createElement("div");
    details.className = "hidden px-6 pb-4 text-sm text-gray-600 bg-gray-50";
    details.innerHTML = `
      <p><strong>User phone:</strong> ${escapeText(
        w.user?.phoneNumber || "—"
      )}</p>
      <p><strong>Account status:</strong> ${escapeText(
        w.user?.accountStatus || "—"
      )}</p>
      <p><strong>Request ID:</strong> ${escapeText(w._id)}</p>
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

  async function updateDepositStatus(id, status) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/deposits/${id}/status`, {
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

  async function updateWithdrawalStatus(id, status) {
    try {
      const res = await fetch(
        `${API_BASE_URL}/admin/withdrawals/${id}/status`,
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
    if (["approved", "failed", "successful"].includes(s))
      return "bg-green-100 text-green-700";
    if (s === "pending") return "bg-yellow-100 text-yellow-800";
    if (["failed", "completed"].includes(s)) return "bg-gray-200 text-gray-700";
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
