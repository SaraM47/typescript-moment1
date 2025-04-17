// Definierar en typ för kursernas data. Varje kurs bör ha dessa fyra egenskaper.
interface CourseInfo {
  code: string;
  name: string;
  progression: "A" | "B" | "C";
  syllabus: string;
}

/*
 * Hämtar referenser till HTML-element vi ska använda i skriptet
 * Sedan konverterar text till JavaScript-objekt och sluligen visar kurserna på sidan
 */
const courseForm = document.getElementById("course-form") as HTMLFormElement;
const courseList = document.getElementById("course-list") as HTMLUListElement;
const filterInput = document.getElementById("filter") as HTMLInputElement;

// Skapar en tom lista som kommer innehålla alla kurser
let courses: CourseInfo[] = [];

// Funktion som laddar kurser från localStorage (om det finns några sparade)
function loadCourses(): void {
  const stored = localStorage.getItem("courses");
  if (stored) {
    courses = JSON.parse(stored);
    renderCourses();
  }
}

// Funktion som sparar kurslistan till localStorage
function saveCourses(): void {
  localStorage.setItem("courses", JSON.stringify(courses)); // Konvertera till text och spara
}

// Funktion som visar alla kurser på sidan (eller en filtrerad lista)
function renderCourses(filteredCourses: CourseInfo[] = courses): void {
  courseList.innerHTML = ""; // Töm listan först

  // För varje kurs, skapa ett <li>-element med info och en "Radera"-knapp
  filteredCourses.forEach((course) => {
    const li = document.createElement("li");
    li.innerHTML = `
        <strong>${course.code}</strong>: ${course.name} (${course.progression}) - 
        <a href="${course.syllabus}" target="_blank">Kursplan</a>
        <button class="delete-btn" data-code="${course.code}">Radera</button>
      `;
    courseList.appendChild(li);
  });

  // Lägger till click event listeners på varje "Radera"-knapp på varje kurs
  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const code = (e.target as HTMLButtonElement).getAttribute("data-code"); // Hämta kurskoden
      if (code) deleteCourse(code); // Radera kursen
    });
  });
}

// Funktion som lägger till en ny kurs
function addCourse(course: CourseInfo): void {
  // Det som kontrolleras är att kurskoden måste vara unik
  if (courses.find((c) => c.code === course.code)) {
    alert("Kurskoden måste vara unik.");
    return;
  }

  // Det som kontrolleras är att progression måste vara A, B eller C
  if (!["A", "B", "C"].includes(course.progression)) {
    alert("Progression måste vara A, B eller C.");
    return;
  }

  courses.push(course); // Lägger till kursen
  saveCourses(); // Sparar till localStorage
  renderCourses(); // Visar uppdaterad lista
}

// Funktion som raderar en kurs baserat på kurskoden
function deleteCourse(code: string): void {
  courses = courses.filter((c) => c.code !== code); // Filtrera bort kursen
  saveCourses(); // Spara ny lista
  renderCourses();
}

// Funktion för att filtrera kurser baserat på sökord
function filterCourses(term: string): void {
  const filtered = courses.filter(
    (c) =>
      c.name.toLowerCase().includes(term.toLowerCase()) ||
      c.code.toLowerCase().includes(term.toLowerCase())
  );
  renderCourses(filtered); // Visar bara kurser som matchar sökningen
}
