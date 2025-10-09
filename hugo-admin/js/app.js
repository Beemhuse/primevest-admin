(function () {
  modalCancel.addEventListener("click", (e) => {
    e.preventDefault();
    closeModal();
  });

  modalForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = modalInvestmentId.value;
    const status = modalStatus.value;
    if (!id) return showToast("Missing investment id", "error");
    modalSaveState(true);
    try {
      const res = await fetch(
        BASE_URL + "/admin/investments/" + encodeURIComponent(id) + "/status",
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({ status }),
        },
      );
      if (!res.ok) throw new Error("Server returned " + res.status);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Update failed");

      // Update local cached data and UI
      const inv = investments.find((i) => i._id === id);
      if (inv) inv.status = status;
      // if visible in filtered, update that too
      const statusBadge = container
        .querySelector(`[data-id='${id}']`)
        .querySelector('[data-role="status"]');
      if (statusBadge) {
        statusBadge.textContent = status;
        statusBadge.className =
          "px-2 py-1 text-xs rounded-full " +
          (status === "active"
            ? "bg-green-100 text-green-700"
            : "bg-gray-100 text-gray-600");
      }

      showToast("Status updated");
      closeModal();
    } catch (err) {
      showToast("Update failed: " + err.message, "error");
    } finally {
      modalSaveState(false);
    }
  });

  function modalSaveState(isSaving) {
    const btn = document.getElementById("modalSave");
    if (!btn) return;
    btn.disabled = isSaving;
    btn.textContent = isSaving ? "Saving..." : "Save";
  }

  // Close modal when clicking backdrop (but not when clicking inside modal content)
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // ========== INIT ==========
  // Call this once on page load
  fetchInvestments();

  // Expose some helpers for debugging (optional)
  window.__investmentsDebug = {
    refetch: fetchInvestments,
    get investments() {
      return investments;
    },
  };
})();
