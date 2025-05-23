import { Repository } from 'typeorm'
import datasource from '../db'
import Book from '../entities/book.entity'

export default class BookService {
  db: Repository<Book>
  constructor() {
    this.db = datasource.getRepository(Book)
  }

  async listBooks() {
    return this.db.find()
  }
}
