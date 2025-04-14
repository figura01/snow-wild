
import { DataSource } from 'typeorm'
import Category from './entities/category.entity'
import Material from './entities/material.entity'
import Reservation from './entities/reservation.entity'
import ReservationMaterial from './entities/reservation_material.entity'
import User from './entities/user.entity'
const isProduction = process.env.APP_ENV === 'production'

const host = isProduction ? process.env.DB_HOST : 'localhost'
const username = isProduction ? process.env.DB_USER : 'postgres'
const password = isProduction ? process.env.DB_PASSWORD : 'postgres'
const database = isProduction ? process.env.DB_NAME : 'snowwild'
const entities = isProduction
  ? [Category, Material, ReservationMaterial, User, Reservation]
  : ['src/entities/*.ts']

export default new DataSource({
  type: 'postgres',
  host: host,
  port: 5432,
  username: username, //process.env.POSTGRES_USER
  password: password,
  database: database,
  synchronize: true, //en dev, en prod on préfera utiliser les migrations
  logging: true,
  entities: entities,
})
