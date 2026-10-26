// ROI calculator (WordPress Custom CSS & JS post 71304). Runs once the page
// has loaded, and only on pages that have the calculator.
document.addEventListener('DOMContentLoaded', function () {
  if (!document.getElementById('unique-inspectors')) return;
 function calculateSavings() {
        // Get input values
        const inspectors = Math.max(0, parseInt(document.getElementById('unique-inspectors').value, 10) || 0);
        const inspections = Math.max(0, parseInt(document.getElementById('unique-inspections').value, 10) || 0);
        const hours = Math.max(0, parseFloat(document.getElementById('unique-hours').value) || 0);

        // Calculation: inspectors * inspections * hours * 8.475
        const savings = inspectors * inspections * hours * 8.475;

        // Update the dynamic text with user input
        document.getElementById('unique-dynamicInspectors').textContent = inspectors;
        document.getElementById('unique-dynamicInspections').textContent = inspections;
        document.getElementById('unique-dynamicHours').textContent = hours.toFixed(1);
        document.getElementById('unique-dynamicSavings').textContent = savings.toFixed(2);

        // Display the result in the bottom result section
        document.getElementById('unique-savings').textContent = savings.toFixed(2);
    }

    // Attach event listeners to input fields
    document.getElementById('unique-inspectors').addEventListener('input', calculateSavings);
    document.getElementById('unique-inspections').addEventListener('input', calculateSavings);
    document.getElementById('unique-hours').addEventListener('input', calculateSavings);

    // Reset function
    function resetFields() {
        document.getElementById('unique-inspectors').value = 0;
        document.getElementById('unique-inspections').value = 0;
        document.getElementById('unique-hours').value = 0;
        calculateSavings();
    }

    // Initial calculation
    calculateSavings();

  window.resetFields = resetFields;
});
