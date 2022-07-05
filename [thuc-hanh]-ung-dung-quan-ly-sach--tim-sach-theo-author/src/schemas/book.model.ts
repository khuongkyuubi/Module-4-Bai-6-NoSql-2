import {Schema, model} from "mongoose";

const keywordsSchema = new Schema({
    keyword: String
})

const bookSchema = new Schema({
    title: String,
    description: String,
    author: {type: Schema.Types.ObjectId, ref: "Author"}, // nomarlziled references , type: Schema, ref den collection Author
    keywords: [keywordsSchema],
})

const Book = model('Book', bookSchema);

export {Book};