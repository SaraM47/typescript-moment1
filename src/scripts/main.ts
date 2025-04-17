// Defines a type for the course data. Every course should have these four properties.
interface CourseInfo {
  code: string;
  name: string;
  progression: "A" | "B" | "C";
  syllabus: string;
}

/*
* Gets references to HTML elements we will use in the script
* Then converts text to JavaScript objects and finally displays the courses on the page
 */
const courseForm = document.getElementById("course-form") as HTMLFormElement;
const courseList = document.getElementById("course-list") as HTMLUListElement;
const filterInput = document.getElementById("filter") as HTMLInputElement;

// Creates an empty list that will contain all courses
let courses: CourseInfo[] = [];

// Function that loads courses from localStorage (if there are any saved)
function loadCourses(): void {
  const stored = localStorage.getItem("courses");
  if (stored) {
    courses = JSON.parse(stored);
    renderCourses();
  }
}

// Function that saves the course list to localStorage
function saveCourses(): void {
  localStorage.setItem("courses", JSON.stringify(courses)); 
}

// Function that displays all courses on the page (or a filtered list)
function renderCourses(filteredCourses: CourseInfo[] = courses): void {
  courseList.innerHTML = ""; // Töm listan först

  // For each course, create a <li> element with info and a "Delete" button
  filteredCourses.forEach((course) => {
    const li = document.createElement("li");
    li.innerHTML = `
        <strong>${course.code}</strong>: ${course.name} (${course.progression}) - 
        <a href="${course.syllabus}" target="_blank">Kursplan</a>
        <button class="delete-btn" data-code="${course.code}">Radera</button>
      `;
    courseList.appendChild(li);
  });

  // Adding click event listeners to each "Delete" button on each course
  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const code = (e.target as HTMLButtonElement).getAttribute("data-code"); // Get the course code
      if (code) deleteCourse(code); // Delete course
    });
  });
}

// Function that adds a new course
function addCourse(course: CourseInfo): void {
  // What is checked is that the course code must be unique.
  if (courses.find((c) => c.code === course.code)) {
    alert("Kurskoden måste vara unik.");
    return;
  }

  // What is checked is that progression must be A, B or C
  if (!["A", "B", "C"].includes(course.progression)) {
    alert("Progression måste vara A, B eller C.");
    return;
  }

  courses.push(course); // Adding the course
  saveCourses(); // Saving to localStorage
  renderCourses(); // Showing updated list
}

// Function that deletes a course based on the course code
function deleteCourse(code: string): void {
  courses = courses.filter((c) => c.code !== code); // Filter out the course
  saveCourses(); // Save new list
  renderCourses();
}

// Function to filter courses based on keywords
function filterCourses(term: string): void {
  const filtered = courses.filter(
    (c) =>
      c.name.toLowerCase().includes(term.toLowerCase()) ||
      c.code.toLowerCase().includes(term.toLowerCase())
  );
  renderCourses(filtered); // Only shows courses that match the search
}

// When submitting the form
courseForm.addEventListener('submit', (e: Event) => {
    e.preventDefault(); // Stops page reloading
  
    // Get all field values ​​from the form
    const code = (document.getElementById('code') as HTMLInputElement).value.trim();
    const name = (document.getElementById('name') as HTMLInputElement).value.trim();
    const progressionSelect = document.getElementById('progression') as HTMLSelectElement;
    const progression = progressionSelect.value as 'A' | 'B' | 'C';
    const syllabus = (document.getElementById('syllabus') as HTMLInputElement).value.trim();
  
    // Create a course item
    const newCourse: CourseInfo = { code, name, progression, syllabus };
  
    addCourse(newCourse);    // Add the course
    courseForm.reset();      // Empty the form
  });
  
  // When typing in the search field, filter the list
  filterInput.addEventListener('input', () => {
    const searchTerm = filterInput.value;
    filterCourses(searchTerm);
  });
  
  // Runs once when the page loads – load and display saved courses
  loadCourses();
  