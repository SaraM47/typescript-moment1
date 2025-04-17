// Definierar en typ för kursernas data. Varje kurs bör ha dessa fyra egenskaper.
interface CourseInfo {
    code: string;
    name: string;
    progression: 'A' | 'B' | 'C';
    syllabus: string;
  }
  
  /* 
  * Hämtar referenser till HTML-element vi ska använda i skriptet
  * Sedan konverterar text till JavaScript-objekt och sluligen visar kurserna på sidan
  */
  const courseForm = document.getElementById('course-form') as HTMLFormElement;
  const courseList = document.getElementById('course-list') as HTMLUListElement;
  const filterInput = document.getElementById('filter') as HTMLInputElement;
  
  // Skapar en tom lista som kommer innehålla alla kurser
  let courses: CourseInfo[] = [];
  
  // Funktion som laddar kurser från localStorage (om det finns några sparade)
  function loadCourses(): void {
    const stored = localStorage.getItem('courses');
    if (stored) {
      courses = JSON.parse(stored);
      renderCourses();
    }
  }
  