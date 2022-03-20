import { DataSource } from "typeorm";

export const db = new DataSource({
    name: "default",
    type: "postgres",
    url: "postgresql://postgres:1234@db:5432/goshenite",
    entities: [__dirname + "/**/*.schema.{ts,js}"],
    synchronize: true,
})