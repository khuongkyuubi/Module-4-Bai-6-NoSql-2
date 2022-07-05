/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/schemaoptions" />
import { Schema } from "mongoose";
interface IAuthor {
    name: string;
}
declare const authorSchema: Schema<IAuthor, import("mongoose").Model<IAuthor, any, any, any>, {}, {}>;
declare const Author: import("mongoose").Model<IAuthor, {}, {}, {}>;
export { authorSchema, Author };
