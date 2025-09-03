async function fetchData(ref, id) {
  const url = `https://openapi.programming-hero.com/api/${ref}/${id}`;
  const request = await fetch(url);
  if (!request.ok) {
    throw new Error("Fail to fetch data!");
  }
  const content = await request.json();
  return content;
}

async function displayLesson() {
  // select a div from document and set the innerHtml empty
  const lessons = document.getElementById("lessons");
  lessons.innerHTML = "";
  // call the fetch function
  const { data } = await fetchData("levels", "all");
  // when error or fail to load data
  if (data.length === 0) {
    const errorDiv = document.createElement("div");
    errorDiv.innerHTML = `<div role="alert" class="alert alert-error">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <span>Error! Fail to fetch data from server!</span>
  </div>`;
    // append child
    lessons.appendChild(errorDiv);
  }

  for (const lesson of data) {
    const everyLesson = document.createElement("div");
    everyLesson.innerHTML = `<button onClick="displayWord(${lesson.level_no})" class="btn-outline btn btn-primary">
    <i class="fa-solid fa-book-open"></i>
    lesson - ${lesson.level_no}
    </button>`;
    // append child
    lessons.appendChild(everyLesson);
  }
}
// call the displayLesson function
displayLesson();

async function displayWord(id) {
  // select a div from document and set the innerHtml empty
  const lessons = document.getElementById("lesson-words");
  lessons.innerHTML = "";
  // call the fetch function
  const { data } = await fetchData("level", id);
  console.log(data);
  // when error or fail to load data
  if (data.length === 0) {
    const errorDiv = document.createElement("div");
    errorDiv.innerHTML = `<div role="alert" class="alert alert-error">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <span>Error! Fail to fetch data from server!</span>
  </div>`;
    // append child
    lessons.appendChild(errorDiv);
  }

  for (const element of data) {
    const { word, meaning, pronunciation } = element;
    const everyWord = document.createElement("div");
    everyWord.innerHTML = `<div class='bg-white text-black card'>
    <div class='items-center text-center card-body'>
      <h2 class='font-bold text-3xl card-title'>${word}</h2>
      <p class='text-xl'>Meaning / Pronunciation</p>
      <p class='font-semibold text-2xl font-bangla'>${meaning} / ${pronunciation}</p>
      <div class='flex flex-row justify-between w-full card-actions'>
        <button
          title='Information'
          class='bg-sky-50 hover:bg-inherit rounded-md btn btn-ghost'
        >
          <i class='fa-solid fa-circle-info'></i>
        </button>
        <button
          title='Pronunciation'
          class='bg-sky-50 hover:bg-inherit rounded-md btn btn-ghost'
        >
          <i class='fa-solid fa-volume-high'></i>
        </button>
      </div>
    </div>
  </div>`;
    // append child
    lessons.appendChild(everyWord);
  }
}
