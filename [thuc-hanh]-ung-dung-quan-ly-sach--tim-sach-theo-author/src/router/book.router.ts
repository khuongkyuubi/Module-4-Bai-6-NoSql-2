import {Router} from 'express';

const bookRoutes = Router();
import {Book} from "../schemas/book.model";
import multer from 'multer';
import {Author} from '../schemas/author.model';

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
        // lưu model này vào collection author
        await authorNew.save();
        console.log(authorNew)
        // sau khi tạo được document chứa author rồi thì lấy id của author đó , gán cho trường author của book, sua đó save book lại
        // sau này muốn lấy author ra phải dùng populate() để join vào book
        const bookNew = new Book({
            title: req.body.title,
            description: req.body.description,
            author: authorNew._id,
        });
        bookNew.keywords.push({keyword: req.body.keyword});
        const book = bookNew.save();
        if (book) {
            res.render("success");
        } else {
            res.render("error");
        }
    } catch (err) {
        res.render("error");
    }
});

bookRoutes.post('/update/:id', upload.none(), async (req, res) => {
    try {
        const book = await Book.findOne({_id: req.body.id});
        book.title = req.body.title;
        book.description = req.body.description;
        // tìm và cập nhật lại author (id của autho chính là giá trị trường book.author)
        const author = await Author.findOne({_id: book.author})
        author.name = req.body.author;
        await author.save();
        // sau khi save author xong thì có thể save book
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
        // tìm kiếm theo keyword , dùng regex và options cho regex
        let keyword = req.query.keyword || "";
        let authorFind = req.query.author || "";
        // tìm kiếm author trong collection author, trả về mảng chứa tập hợp các id của author tìm thấy
        // sau đó cho điều kiện query hoặc theo keyword hoặc theo author
        let authorID = await Author.find({name: {$regex: authorFind, $options: "gim"}}, {"_id": 1})
        query = {
            "keywords.keyword": {
                $regex: `${keyword}`, $options: "gim"
            },
            author: {
                $in: authorID
            }
        }

        const books = await Book.find(query).populate({
            path: "author", select: "name"
        }); // dùng populate để join auhtor từ bên collection author, sang bên books, chỉ lấy trường name
        res.render("listBook", {books: books});
    } catch {
        res.render("error");
    }
})
;

bookRoutes.get('/update/:id', async (req, res) => {
    try {
        const book = await Book.findOne({_id: req.params.id}).populate({path: "author", select: "name"});
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
