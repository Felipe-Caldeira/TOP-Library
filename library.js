let myLibrary = localStorage.getObj("myLibrary").map(book => {
    return new Book(book.title, book.author, book.pages, book.readStatus);
}) || [];

// Book object and method
function Book(title, author, pages, readStatus) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.readStatus = readStatus;
}

Book.prototype.updateReadStatus = function (newStatus) {
    this.readStatus = newStatus;
    renderLibrary();
}

// Library modifying functions
function addBookToLibrary(book) {
    myLibrary.push(book);
    renderLibrary();
}

function removeBookFromLibrary(id) {
    myLibrary.splice(id, 1);
    renderLibrary();
}

function renderLibrary() {
    let bookList = document.querySelector(".bookList");
    let entryTemplate;
    bookList.innerHTML = "";
    for (i = 0; i < myLibrary.length; i++) {
        book = myLibrary[i];
        entryTemplate = `
             <li class="book" data-id="${i}"><span>${book.title}</span><span>${book.author}</span><span>${book.pages}</span>
             <span><select class="bookListReadStatus">
                <option value="Read">Have read</option>
                <option value="Unread">Have not read</option>
                <option value="Reading">Currently reading</option>
             </select></span>
             <span class="trashIcon"></span>
             </li>
            `
        bookList.innerHTML += entryTemplate;
    }

    // Append trash icon and respective event listener to each book listing
    // Also add selected Read Status value
    document.querySelectorAll(".trashIcon").forEach(span => {
        span.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-trash" width="48" height="48" viewBox="0 0 24 24" stroke-width="1.5" stroke="#33272a" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z"/>
  <line x1="4" y1="7" x2="20" y2="7" />
  <line x1="10" y1="11" x2="10" y2="17" />
  <line x1="14" y1="11" x2="14" y2="17" />
  <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
  <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
</svg>`

        span.addEventListener("click", e => {
            span.parentElement.style.opacity = "0";
            setTimeout(() => {
                removeBookFromLibrary(span.parentElement.getAttribute("data-id"));
            }, 600);
        })

        span.parentElement.querySelector(`option[value="${myLibrary[span.parentElement.getAttribute("data-id")].readStatus}"]`).selected = true;
    })

    // Add event listeners for updating book read status
    document.querySelectorAll(".bookListReadStatus").forEach(select => {
        select.addEventListener("change", e => {
            myLibrary[select.parentElement.parentElement.getAttribute("data-id")].updateReadStatus(select.value);
            saveData();
        })
    })

    // Save data
    saveData();
}

// Form functions
function toggleForm() {
    let bookFormContainer = document.querySelector(".bookFormContainer");
    if (bookFormContainer.style.height == "100%") {
        bookFormContainer.style.height = "0px";
    } else {
        bookFormContainer.style.height = "100%";
    }
}

function submitForm() {
    let title, author, pages, status;
    title = document.querySelector('input[name="bookTitle"]').value;
    author = document.querySelector('input[name="bookAuthor"]').value;
    pages = document.querySelector('input[name="bookPages"]').value;
    status = document.querySelector('select[name="bookStatus"]').value;
    addBookToLibrary(new Book(title, author, pages, status));
    toggleForm();

    // Reset form
    document.querySelector(".bookForm").reset();

}

// Save data
function saveData() {
    localStorage.setObj("myLibrary", myLibrary);
}

// Page setup
function start() {
    // Book form open/close onclick listeners
    document.querySelector(".addBook").onclick = toggleForm;
    document.querySelector(".bookForm_close").onclick = toggleForm;

    // Book form submit listener
    document.querySelector(".bookForm").addEventListener('submit', e => {
        e.preventDefault();
        submitForm();
    })

    // Render saved books
    renderLibrary();
}

window.onload = start;