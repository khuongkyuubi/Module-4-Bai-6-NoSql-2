import {Schema, model} from "mongoose";
//
// interface IBook {
//   title: string;
//   description: string;
//   author: string;
//   keywords: object[];
// }
import {authorSchema} from "./author.model"

const keywordsSchema = new Schema({
    keyword: String
})

const bookSchema = new Schema({
    title: String,
    description: String,
    author: authorSchema ,  // subdocument - là 1 object của author model
    keywords: [keywordsSchema], // là 1 mảng các document key word
})

const Book = model('Book', bookSchema);

export {Book};