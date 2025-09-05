async function fetchData(ref, id) {
  const url = `https://openapi.programming-hero.com/api/${ref}/${id}`;
  const request = await fetch(url);
  if (!request.ok) {
    throw new Error("Fail to fetch data!");
  }
  const content = await request.json();
  return await content;
}

function speakText(text) {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn("Text to Speech not supported!");
  }
}

function createHtmlElement(array) {
  if (!Array.isArray(array)) {
    return `<span class="text-red-500">Something went wrong!</span>`;
  }
  const elements = array.map(
    (el) => `<p class="bg-sky-50 p-2 text-xl">${el}</p>`
  );
  return elements.join(" ");
}

async function displayLesson() {
  // select a div from document and set the innerHtml empty
  const lessons = document.getElementById("lessons");
  lessons.innerHTML = "";
  // call the fetch function
  const { data } = await fetchData("levels", "all");
  // when error or fail to load data
  if ((await data.length) === 0) {
    const errorDiv = document.createElement("div");
    errorDiv.innerHTML = `<div role="alert" class="alert alert-error">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <span>Error! Fail to fetch data from server!</span>
  </div>`;
    // append child
    lessons.appendChild(errorDiv);
    return;
  }

  for (const lesson of await data) {
    const everyLesson = document.createElement("div");
    everyLesson.innerHTML = `<button id="lesson-btn-${lesson.level_no}" onClick="displayWord(${lesson.level_no})" class="lesson-btn btn-outline btn btn-primary">
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
  // when error or fail to load data
  if (data.length === 0) {
    const errorDiv = document.createElement("div");
    errorDiv.innerHTML = `<div
    class="top-1/2 left-1/2 absolute bg-gray-50 mx-auto mt-14 p-15 w-full text-center translate-x-[-50%] translate-y-[-50%]""
  >
  <i class="fa-solid fa-triangle-exclamation text-4xl text-gray-400"></i>
    <p class="text-gray-500 text-sm">
    এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।
    </p>
    <h3 class="font-medium text-3xl">নেক্সট Lesson এ যান</h3>
  </div>`;
    // append child
    lessons.appendChild(errorDiv);
    return;
  }

  for (const element of data) {
    const { id, word, meaning, pronunciation } = element;
    const everyWord = document.createElement("div");
    everyWord.innerHTML = `<div class='bg-white text-black card'>
    <div class='items-center text-center card-body'>
      <h2 class='font-bold text-3xl card-title'>${word}</h2>
      <p class='text-xl'>Meaning / Pronunciation</p>
      <p class='font-semibold text-2xl font-bangla'>${
        meaning ? meaning : "শব্দ পাওয়া যায় নি"
      } / ${pronunciation ? pronunciation : "Pronounciation পাওয়া  যায়নি"}</p>
      <div class='flex flex-row justify-between w-full card-actions'>
        <button
          title='Information'
          class='bg-sky-50 hover:bg-inherit rounded-md btn h-8 w-8'
          onClick="info(${id})"
        >
          <i class='fa-solid fa-circle-info'></i>
        </button>
        <button
        onclick="speakText('${word}')"
          title='Pronunciation'
          class='bg-sky-50 hover:bg-inherit rounded-md  h-8 w-8'
        >
          <img class="h-full w-full p-1 hover:cursor-pointer" src="./assets/speaking.png" alt="speaking icon" />
        </button>
      </div>
    </div>
  </div>`;
    // append child
    lessons.appendChild(everyWord);
  }
}

async function info(id) {
  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modal-content");
  modalContent.innerHTML = "";

  const { data } = await fetchData("word", id);
  const { word, meaning, pronunciation, sentence, synonyms } = data;

  modalContent.innerHTML = `<div class="flex flex-col gap-8 p-4 border-2 border-sky-100 rounded-md">
  <h1 class="font-semibold text-4xl">
    ${word} (<i class="fa-solid fa-microphone-lines"></i> : ${pronunciation})
  </h1>
  <div class="flex flex-col gap-2.5">
    <h3 class="font-semibold text-2xl">Meaning</h3>
    <p class="font-bangla font-medium text-2xl">${meaning}</p>
  </div>
  <div class="flex flex-col gap-2.5">
    <h3 class="font-semibold text-2xl">Example</h3>
    <p class="text-2xl">${sentence}.</p>
  </div>
  <div class="flex flex-col gap-2.5">
    <h3 class="font-bangla font-semibold text-2xl">
      সমার্থক শব্দ গুলো
    </h3>
    <div class="flex flex-row flex-wrap gap-2.5">
     ${createHtmlElement(synonyms)}
    </div>
  </div>
</div>
<button
  onclick="modal.close()"
  class="mt-8 rounded-md w-full md:w-1/2 text-xl btn btn-primary"
>
  Complete Learning
</button>`;

  modal.showModal();
}

// document.getElementById("lessons").addEventListener("click", function (e) {
//   console.log(e.target);
// });
