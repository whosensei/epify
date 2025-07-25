import { pgTable, text, serial, varchar, integer, decimal } from "drizzle-orm/pg-core";

export const user = pgTable("users", {
    userID: serial("userID").primaryKey(),
    username: varchar("username").unique().notNull(),
    email: varchar("email").unique().notNull(),
    password: varchar("password").notNull()
})

export const products = pgTable("products",{
    id : serial("id").primaryKey(),
    productName : text("productName").notNull(),
    type : text("type").notNull(),
    sku : text("sku").unique().notNull(),
    image_url : varchar("img_url"),
    description : text("description").notNull(),
    quantity : integer("quantity").notNull(),
    price : decimal("price").notNull(),
    userID: integer("userID").references(() => user.userID).notNull()
})