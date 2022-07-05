"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const mongoose_1 = require("mongoose");
const author_model_1 = require("./author.model");
const keywordsSchema = new mongoose_1.Schema({
    keyword: String
});
const bookSchema = new mongoose_1.Schema({
    title: String,
    description: String,
    author: author_model_1.authorSchema,
    keywords: [keywordsSchema],
});
const Book = (0, mongoose_1.model)('Book', bookSchema);
exports.Book = Book;
//# sourceMappingURL=book.model.js.map