class Library {
    constructor(wrapper) {
        this.books = [];
        this.booksContainer = wrapper;
    }

    addBook(book) {
        this.books.push(book);
        localStorage.setItem('library', JSON.stringify(library));
    }

    removeBook(index) {
        this.books.splice(index, 1);
        localStorage.setItem('library', JSON.stringify(library));
    }

    render() {
        this.booksContainer.innerHTML = '';
        this.books.forEach((book, index) => {
            let column = document.createElement('div');
            column.className = 'col mb-4';

            let bookCard = document.createElement('div');
            bookCard.className = 'card';

            let bookCardHeader = document.createElement('div');
            bookCardHeader.className = 'card-header text-right';

            let removeButton = new HeaderButton('btn btn-link btn-sm').make();
            removeButton.innerText = 'Remove';
            removeButton.addEventListener('click', () => {
                this.removeBook(index);
                this.render();
            });

            let readButton = new HeaderButton('btn btn-link btn-sm').make();
            readButton.innerText = 'Mark read';
            readButton.addEventListener('click', () => {
                this.books[index].toggleRead();
                this.render();
            });

            bookCardHeader.appendChild(readButton);
            bookCardHeader.appendChild(removeButton);

            bookCard.appendChild(bookCardHeader);
            bookCard.appendChild(book.render());
            column.appendChild(bookCard);
            this.booksContainer.appendChild(column);
        });
    }
}

class Book {
    constructor(title, author, published, didRead) {
        this.title = title;
        this.author = author;
        this.published = published;
        this.didRead = didRead;
    }

    toggleRead() {
        this.didRead = !this.didRead;
        localStorage.setItem('library', JSON.stringify(library));
    }

    render () {
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
}

class HeaderButton {
    constructor(className) {
        this.className = className;
    }

    make () {
        let button = document.createElement('button');
        button.className = this.className;

        return button;
    }
}

const Form = ((wrapper, closeButton) => {
    let isFormOpen = false;
    const addButton = document.querySelector('#add-button');
    const name = document.querySelector('#book-name');
    const author = document.querySelector('#book-author');
    const published = document.querySelector('#book-published');
    const read = document.querySelector('#book-read');

    closeButton.addEventListener('click', (event) => {
        isFormOpen = !isFormOpen;
        wrapper.className = isFormOpen ? 'card-body d-block' : 'card-body d-none';
        event.target.innerText = isFormOpen ? 'Close' : 'Open';
    });

    const resetFields = () => {
        name.value = '';
        author.value = '';
        published.value = '';
        read.checked = false;
    }

    return { addButton, name, author, published, read, resetFields }
})(
    document.querySelector('#new-book-form'),
    document.querySelector('#close-form-button')
);

let library = new Library(document.querySelector('#books'));

Form.addButton.addEventListener('click', (e) => {
    e.preventDefault();
    library.addBook(new Book(
        Form.name.value,
        Form.author.value,
        parseInt(Form.published.value, 10),
        Form.read.checked
    ));
    Form.resetFields();
    library.render();
});

const PersistedLibrary = ((library) => {
    const persistedLibrary = JSON.parse(localStorage.getItem('library'));
    if (persistedLibrary !== null) {
        persistedLibrary.books.forEach(bookObject => {
            library.addBook(new Book(
                bookObject.title,
                bookObject.author,
                bookObject.published,
                bookObject.didRead
            ));
        });
    }
})(library);

library.render();