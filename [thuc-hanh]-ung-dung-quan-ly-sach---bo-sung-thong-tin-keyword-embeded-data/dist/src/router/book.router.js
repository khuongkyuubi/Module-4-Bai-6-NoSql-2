"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const book_model_1 = require("../schemas/book.model");
const multer_1 = __importDefault(require("multer"));
const author_model_1 = require("../schemas/author.model");
const bookRoutes = (0, express_1.Router)();
const upload = (0, multer_1.default)();
bookRoutes.get('/create', (req, res) => {
    res.render("createBook");
});
bookRoutes.post('/create', upload.none(), async (req, res) => {
    try {
        const authorNew = new author_model_1.Author({
            name: req.body.author
        });
        const bookNew = new book_model_1.Book({
            title: req.body.title,
            description: req.body.description,
            author: authorNew,
        });
        bookNew.keywords.push({ keyword: req.body.keyword });
        const p2 = bookNew.save();
        let [book] = await Promise.all([p2]);
        if (book) {
            res.render("success");
        }
        else {
            res.render("error");
        }
    }
    catch (err) {
        res.render("error");
    }
});
bookRoutes.post('/update', upload.none(), async (req, res) => {
    try {
        const book = await book_model_1.Book.findOne({ _id: req.body.id });
        book.title = req.body.title;
        book.description = req.body.description;
        book.author = new author_model_1.Author({
            name: req.body.author
        });
        await book.save();
        if (book) {
            res.render("success");
        }
        else {
            res.render("error");
        }
    }
    catch (err) {
        res.render("error");
    }
});
bookRoutes.get('/list', async (req, res) => {
    try {
        let query = {};
        const books = await book_model_1.Book.find(query);
        console.log(books);
        res.render("listBook", { books: books });
    }
    catch (_a) {
        res.render("error");
    }
});
bookRoutes.get('/update/:id', async (req, res) => {
    try {
        const book = await book_model_1.Book.findOne({ _id: req.params.id });
        console.log(book, 'book');
        if (book) {
            res.render("updateBook", { book: book });
        }
        else {
            res.render("error");
        }
    }
    catch (err) {
        res.render("error");
    }
});
bookRoutes.delete('/delete/:id', async (req, res) => {
    try {
        const book = await book_model_1.Book.findOne({ _id: req.params.id });
        if (book) {
            await book.remove();
            res.status(200).json({ message: "success" });
        }
        else {
            res.render("error");
        }
    }
    catch (err) {
        res.render("error");
    }
});
exports.default = bookRoutes;
//# sourceMappingURL=book.router.js.map