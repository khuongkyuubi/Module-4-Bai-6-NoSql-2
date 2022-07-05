import {Router} from 'express';
import {Book} from "../schemas/book.model";
import multer from 'multer';
import {Author} from '../schemas/author.model';

const bookRoutes = Router();

const upload = multer();

bookRoutes.get('/create', (req, res) => {
    res.render("createBook");
});

bookRoutes.post('/create', upload.none(), async (req, res) => {
    try {
        // tạo 1 model author mới
        const authorNew = new Author({
            name: req.body.author
        })
        // tạo 1 model sách mới
        // trong đó, trường author tương ứng với model author new ở trên , hay chính là 1 sub document
        const bookNew = new Book({
            title: req.body.title,
            description: req.body.description,
            author: authorNew,
        });
        bookNew.keywords.push({keyword: req.body.keyword});
        // const p1 = authorNew.save();
        const p2 = bookNew.save();
        // vừa tạo 1 documnet collection auhtor, vừa tạo 1 sub document mới trong book
        let [ book] = await Promise.all([ p2]); // promise all: chờ cả 2 cùng hoàn thành rồi mới trả về kết quả trong 1 array tương ứng

        if (book) {
            res.render("success");
        } else {
            res.render("error");
        }
    } catch (err) {
        res.render("error");
    }
});

bookRoutes.post('/update', upload.none(), async (req, res) => {
    try {
        const book = await Book.findOne({_id: req.body.id});
        book.title = req.body.title;
        book.description = req.body.description;
        book.author = new Author({
            name: req.body.author
        });
        await book.save();
        if (book) {
            res.render("success");
        } else {
            res.render("error");
        }
    } catch (err) {
        res.render("error");
    }
});
bookRoutes.get('/list', async (req, res) => {
    try {
        let query = {};
        // if (req.query.keyword && req.query.keyword !== "") {
        //     let keywordFind = req.query.keyword || "";
        //     query = {
        //         "keywords.keyword": {
        //             $regex: keywordFind
        //         }
        //     }
        // }
        // if (req.query.author && req.query.author !== "") {
        //     let authordFind = req.query.author || "";
        //     let author = await Author.findOne({name: {$regex: authordFind}})
        //     query = {
        //         ...query,
        //         author: author
        //     }
        // }
        // populate() dùng để join cấc document từ các collection khác nhau
        // ở đây dùng đẻ join với trường name của collection author vào với documnet book
        // populate chỉ dùng cho trường hợp referenes data thôi, còn sub documnet thì k cần

        const books = await Book.find(query)/*.populate({
            path: "author", select: "name"
        });*/
        console.log(books)
        res.render("listBook", {books: books});
    } catch {
        res.render("error");
    }
});

bookRoutes.get('/update/:id', async (req, res) => {
    try {
        const book = await Book.findOne({_id: req.params.id});

        console.log(book, 'book')
        if (book) {
            res.render("updateBook", {book: book})
        } else {
            res.render("error");
        }
    } catch (err) {
        res.render("error");
    }
});

bookRoutes.delete('/delete/:id', async (req, res) => {
    try {
        const book = await Book.findOne({_id: req.params.id});
        if (book) {
            await book.remove();
            res.status(200).json({message: "success"});
        } else {
            res.render("error");
        }
    } catch (err) {
        res.render("error");
    }
});

export default bookRoutes;
