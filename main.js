let library = [];

function addBookToLibrary(book) {
    library.push(book);
    localStorage.setItem('library', JSON.stringify(library));
}

function removeBookFromLibrary(index) {
    library.splice(index, 1);
    localStorage.setItem('library', JSON.stringify(library));
}

function Book(title, author, published, didRead) {
    this.title = title;
    this.author = author;
    this.published = published;
    this.didRead = didRead;
}

Book.prototype.toggleRead = function () {
    this.didRead = !this.didRead;
    localStorage.setItem('library', JSON.stringify(library));
}

Book.prototype.render = function () {
    let bookNode = document.createElement('div');
    bookNode.className = 'card-body';
    bookNode.innerHTML = `
            <h5>${this.title}</h5>
            <ul>
                <li>Author: ${this.author}</li>
                <li>Published: ${this.published}</li>
                <li>${this.didRead ? 'did read it' : 'did not read it yet'}</li>
            </ul>`;
    return bookNode;
}

function HeaderButton(className) {
    this.className = className;
}

HeaderButton.prototype.render = function () {
    let button = document.createElement('button');
    button.className = this.className;

    return button;
}

function render() {
    let booksContainer = document.querySelector('#books');
    booksContainer.innerHTML = '';
    library.forEach((book, index) => {
        let column = document.createElement('div');
        column.className = 'col mb-4';

        let bookCard = document.createElement('div');
        bookCard.className = 'card';

        let bookCardHeader = document.createElement('div');
        bookCardHeader.className = 'card-header text-right';

        let removeButton = new HeaderButton('btn btn-link btn-sm').render();
        removeButton.innerText = 'Remove';
        removeButton.addEventListener('click', () => {
            removeBookFromLibrary(index);
            render();
        });

        let readButton = new HeaderButton('btn btn-link btn-sm').render();
        readButton.innerText = 'Mark read';
        readButton.addEventListener('click', () => {
            library[index].toggleRead();
            render();
        });

        bookCardHeader.appendChild(readButton);
        bookCardHeader.appendChild(removeButton);

        bookCard.appendChild(bookCardHeader);
        bookCard.appendChild(book.render());
        column.appendChild(bookCard);
        booksContainer.appendChild(column);
    });
}

let closeFormButton = document.querySelector('#close-form-button');
let isFormOpen = false;
const form = document.querySelector('#new-book-form');
function toggleForm(event) {
    isFormOpen = !isFormOpen;
    form.className = isFormOpen ? 'card-body d-block' : 'card-body d-none';
    event.target.innerText = isFormOpen ? 'Close' : 'Open';
}
closeFormButton.addEventListener('click', toggleForm);

let addButton = document.querySelector('#add-button');
let nameField = document.querySelector('#book-name');
let authorField = document.querySelector('#book-author');
let publishedField = document.querySelector('#book-published');
let readField = document.querySelector('#book-read');
addButton.addEventListener('click', (e) => {
    e.preventDefault();
    addBookToLibrary(new Book(
        nameField.value,
        authorField.value,
        parseInt(publishedField.value, 10),
        readField.checked
    ));
    resetFields();
    render();
});

function resetFields() {
    nameField.value = '';
    authorField.value = '';
    publishedField.value = '';
    readField.checked = false;
}

const persistedLibrary = JSON.parse(localStorage.getItem('library'));
if (persistedLibrary !== null) {
    persistedLibrary.forEach(bookObject => {
        library.push(new Book(
            bookObject.title,
            bookObject.author,
            bookObject.published,
            bookObject.didRead
        ));
    });
}
render();