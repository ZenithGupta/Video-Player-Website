document.addEventListener("DOMContentLoaded", function () {
    const isFreeTrialCheckbox = document.querySelector("#id_is_free_trial");
    const avgScoreRow = document.querySelector(".field-average_pain_score");

    function toggleAvgScore() {
        if (isFreeTrialCheckbox && avgScoreRow) {
            if (isFreeTrialCheckbox.checked) {
                avgScoreRow.style.display = "";
            } else {
                avgScoreRow.style.display = "none";
            }
        }
    }

    if (isFreeTrialCheckbox && avgScoreRow) {
        // Initial check
        toggleAvgScore();

        // Listen for changes
        isFreeTrialCheckbox.addEventListener("change", toggleAvgScore);
    }
});
