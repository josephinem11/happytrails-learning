
document.addEventListener('DOMContentLoaded', function () {
    // Get the hidden row element
    var hiddenRow = document.getElementById('course-grid-hidden');

    // Initially hide the hidden row
    hiddenRow.style.display = 'none';

    // Get the "Browse more courses" button
    var loadMoreCoursesBtn = document.getElementById('load-more-courses');

    // Create a hidden element just after the hidden row
    var scrollTarget = document.createElement('div');
    scrollTarget.id = 'scroll-target';
    scrollTarget.style.visibility = 'hidden';
    hiddenRow.parentNode.insertBefore(scrollTarget, hiddenRow.nextSibling);

    // Add click event listener to the button
    loadMoreCoursesBtn.addEventListener('click', function (event) {
        // Prevent the default behavior of the button
        event.preventDefault();

        // Hide the "Browse more courses" button
        this.style.display = 'none';

        // Show the hidden row containing the new row of course cards
        hiddenRow.style.display = 'grid';

        // Scroll to the scroll target
        scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const courseCards = document.querySelectorAll(".course-card");
  
    courseCards.forEach((card) => {
      const title = card.querySelector(".card-title").textContent.trim();
      const backgroundColor = getTitleBackgroundColor(title);
      const textColor = getTitleTextColor(title);
  
      card.style.backgroundColor = backgroundColor;
      card.style.color = textColor;
    });
  
    function getTitleBackgroundColor(title) {
      // Logic to determine background color based on the title
      // Example logic:
      if (title.includes("Nintendo Wii Games")) {
        return "#ffcccc"; // Red background for this title
      } else if (title.includes("Exploring the Pathways of Meditation")) {
        return "#ccffcc"; // Green background for this title
      } else {
        return "var(--white)"; // Default background color
      }
    }
});