document.addEventListener("DOMContentLoaded", () => {
    const ctx = document.getElementById("usageChart").getContext("2d");
  
    chrome.storage.local.get("tabTimes", (data) => {
      const tabTimes = data.tabTimes || {};
  
      // Function to format time in HH:MM:SS
      const formatTime = (ms) => {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      };
  
      const labels = Object.keys(tabTimes).map(id => `Tab ${id}`);
      const usageTimes = Object.values(tabTimes); // Time in milliseconds
      const formattedTimes = usageTimes.map(formatTime); // Formatted times in HH:MM:SS
  
      // Create the chart
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [{
            label: "Time Spent",
            data: usageTimes, // Use raw times (milliseconds) for chart height
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => formatTime(value) // Format Y-axis to show time
              }
            }
          }
        }
      });
  
      // Display time spent on each tab in a list below the chart
      const timeList = document.createElement('ul');
      labels.forEach((label, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${label}: ${formattedTimes[index]}`;
        timeList.appendChild(listItem);
      });
  
      document.body.appendChild(timeList);
    });
  });
  