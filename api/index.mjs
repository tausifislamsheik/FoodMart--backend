var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import { toNodeHandler } from "better-auth/node";
import express8 from "express";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.6.0",
  "engineVersion": "75cbdc1eb7150937890ad5465d861175c6624711",
  "activeProvider": "postgresql",
  "inlineSchema": 'generator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nenum OrderStatus {\n  PLACED\n  PREPARING\n  READY\n  DELIVERED\n  CANCELLED\n}\n\nenum PaymentMethod {\n  COD\n  STRIPE\n}\n\nenum PaymentStatus {\n  PENDING\n  PAID\n  FAILED\n  REFUNDED\n}\n\nmodel ProviderProfile {\n  id             String   @id @default(uuid())\n  userId         String   @unique\n  restaurantName String\n  address        String\n  phone          String\n  logo           String?\n  createdAt      DateTime @default(now())\n  updatedAt      DateTime @updatedAt\n\n  meals  Meal[]\n  orders Order[] @relation("ProviderOrders")\n\n  @@index([userId])\n  @@map("providers")\n}\n\nmodel Meal {\n  id          String          @id @default(uuid())\n  name        String\n  description String\n  price       Float\n  image       String?\n  isAvailable Boolean         @default(true)\n  createdAt   DateTime        @default(now())\n  updatedAt   DateTime        @updatedAt\n  userId      String\n  providerId  String\n  categoryId  String\n  provider    ProviderProfile @relation(fields: [providerId], references: [id])\n  category    Category        @relation(fields: [categoryId], references: [id])\n  orderItems  OrderItem[]\n  reviews     Review[]\n\n  @@index([providerId])\n  @@map("meals")\n}\n\nmodel Category {\n  id    String @id @default(uuid())\n  name  String @unique\n  slug  String @unique\n  meals Meal[]\n\n  @@map("categories")\n}\n\nmodel Order {\n  id          String          @id @default(uuid())\n  customerId  String\n  providerId  String\n  address     String\n  totalAmount Float\n  status      OrderStatus     @default(PLACED)\n  createdAt   DateTime        @default(now())\n  updatedAt   DateTime        @updatedAt\n  provider    ProviderProfile @relation("ProviderOrders", fields: [providerId], references: [id])\n  items       OrderItem[]\n  payment     Payment?\n\n  @@map("orders")\n}\n\nmodel OrderItem {\n  id        String   @id @default(uuid())\n  orderId   String\n  mealId    String\n  quantity  Int\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)\n  meal      Meal     @relation(fields: [mealId], references: [id])\n}\n\nmodel CartItem {\n  id        String   @id @default(uuid())\n  userId    String\n  mealId    String\n  quantity  Int      @default(1)\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  mealName  String\n  mealPrice Float\n  mealImage String?\n\n  @@index([userId])\n  @@map("cart_items")\n}\n\nmodel Review {\n  id        String   @id @default(uuid())\n  rating    Int\n  comment   String?\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  mealId String\n  userId String\n\n  meal Meal @relation(fields: [mealId], references: [id], onDelete: Cascade)\n\n  @@unique([mealId, userId])\n  @@map("reviews")\n}\n\nmodel Payment {\n  id              String        @id @default(uuid())\n  userId          String\n  orderId         String        @unique\n  amount          Decimal       @db.Decimal(10, 2)\n  currency        String        @default("BDT")\n  paymentMethod   PaymentMethod @default(COD)\n  paymentStatus   PaymentStatus @default(PENDING)\n  transactionId   String?\n  gatewayResponse Json?\n  isPaid          Boolean       @default(false)\n  paidAt          DateTime?\n  createdAt       DateTime      @default(now())\n  updatedAt       DateTime      @updatedAt\n\n  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)\n  order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@index([orderId])\n  @@index([paymentStatus])\n  @@map("payments")\n}\n\nmodel User {\n  id            String    @id\n  name          String\n  email         String\n  emailVerified Boolean   @default(false)\n  image         String?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  sessions      Session[]\n  accounts      Account[]\n  payments      Payment[]\n\n  role   String? @default("CUSTOMER")\n  status String? @default("ACTIVE")\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"ProviderProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"restaurantName","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"logo","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"meals","kind":"object","type":"Meal","relationName":"MealToProviderProfile"},{"name":"orders","kind":"object","type":"Order","relationName":"ProviderOrders"}],"dbName":"providers"},"Meal":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"image","kind":"scalar","type":"String"},{"name":"isAvailable","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"MealToProviderProfile"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMeal"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"MealToOrderItem"},{"name":"reviews","kind":"object","type":"Review","relationName":"MealToReview"}],"dbName":"meals"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"meals","kind":"object","type":"Meal","relationName":"CategoryToMeal"}],"dbName":"categories"},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"totalAmount","kind":"scalar","type":"Float"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"ProviderOrders"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"},{"name":"payment","kind":"object","type":"Payment","relationName":"OrderToPayment"}],"dbName":"orders"},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToOrderItem"}],"dbName":null},"CartItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"mealName","kind":"scalar","type":"String"},{"name":"mealPrice","kind":"scalar","type":"Float"},{"name":"mealImage","kind":"scalar","type":"String"}],"dbName":"cart_items"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToReview"}],"dbName":"reviews"},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"paymentMethod","kind":"enum","type":"PaymentMethod"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"gatewayResponse","kind":"scalar","type":"Json"},{"name":"isPaid","kind":"scalar","type":"Boolean"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"PaymentToUser"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToPayment"}],"dbName":"payments"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToUser"},{"name":"role","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","provider","meals","_count","category","items","user","sessions","accounts","payments","order","payment","meal","orderItems","reviews","orders","ProviderProfile.findUnique","ProviderProfile.findUniqueOrThrow","ProviderProfile.findFirst","ProviderProfile.findFirstOrThrow","ProviderProfile.findMany","data","ProviderProfile.createOne","ProviderProfile.createMany","ProviderProfile.createManyAndReturn","ProviderProfile.updateOne","ProviderProfile.updateMany","ProviderProfile.updateManyAndReturn","create","update","ProviderProfile.upsertOne","ProviderProfile.deleteOne","ProviderProfile.deleteMany","having","_min","_max","ProviderProfile.groupBy","ProviderProfile.aggregate","Meal.findUnique","Meal.findUniqueOrThrow","Meal.findFirst","Meal.findFirstOrThrow","Meal.findMany","Meal.createOne","Meal.createMany","Meal.createManyAndReturn","Meal.updateOne","Meal.updateMany","Meal.updateManyAndReturn","Meal.upsertOne","Meal.deleteOne","Meal.deleteMany","_avg","_sum","Meal.groupBy","Meal.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","Category.groupBy","Category.aggregate","Order.findUnique","Order.findUniqueOrThrow","Order.findFirst","Order.findFirstOrThrow","Order.findMany","Order.createOne","Order.createMany","Order.createManyAndReturn","Order.updateOne","Order.updateMany","Order.updateManyAndReturn","Order.upsertOne","Order.deleteOne","Order.deleteMany","Order.groupBy","Order.aggregate","OrderItem.findUnique","OrderItem.findUniqueOrThrow","OrderItem.findFirst","OrderItem.findFirstOrThrow","OrderItem.findMany","OrderItem.createOne","OrderItem.createMany","OrderItem.createManyAndReturn","OrderItem.updateOne","OrderItem.updateMany","OrderItem.updateManyAndReturn","OrderItem.upsertOne","OrderItem.deleteOne","OrderItem.deleteMany","OrderItem.groupBy","OrderItem.aggregate","CartItem.findUnique","CartItem.findUniqueOrThrow","CartItem.findFirst","CartItem.findFirstOrThrow","CartItem.findMany","CartItem.createOne","CartItem.createMany","CartItem.createManyAndReturn","CartItem.updateOne","CartItem.updateMany","CartItem.updateManyAndReturn","CartItem.upsertOne","CartItem.deleteOne","CartItem.deleteMany","CartItem.groupBy","CartItem.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","AND","OR","NOT","id","identifier","value","expiresAt","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","accountId","providerId","userId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","name","email","emailVerified","image","role","status","every","some","none","orderId","amount","currency","PaymentMethod","paymentMethod","PaymentStatus","paymentStatus","transactionId","gatewayResponse","isPaid","paidAt","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","rating","comment","mealId","quantity","mealName","mealPrice","mealImage","customerId","address","totalAmount","OrderStatus","slug","description","price","isAvailable","categoryId","restaurantName","phone","logo","mealId_userId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "rAVywAENBAAA-wIAIBEAAP8CACDaAQAA_gIAMNsBAAAsABDcAQAA_gIAMN0BAQAAAAHhAUAAygIAIeIBQADKAgAh8AEBAAAAAZ0CAQDJAgAhpQIBAMkCACGmAgEAyQIAIacCAQDaAgAhAQAAAAEAIBIDAACCAwAgBgAAlAMAIA8AAIMDACAQAACVAwAg2gEAAJMDADDbAQAAAwAQ3AEAAJMDADDdAQEAyQIAIeEBQADKAgAh4gFAAMoCACHvAQEAyQIAIfABAQDJAgAh-wEBAMkCACH-AQEA2gIAIaECAQDJAgAhogIIAPMCACGjAiAA2QIAIaQCAQDJAgAhBQMAAOoEACAGAADwBAAgDwAA6wQAIBAAAPEEACD-AQAAmwMAIBIDAACCAwAgBgAAlAMAIA8AAIMDACAQAACVAwAg2gEAAJMDADDbAQAAAwAQ3AEAAJMDADDdAQEAAAAB4QFAAMoCACHiAUAAygIAIe8BAQDJAgAh8AEBAMkCACH7AQEAyQIAIf4BAQDaAgAhoQIBAMkCACGiAggA8wIAIaMCIADZAgAhpAIBAMkCACEDAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAEAAAADACALDAAAjwMAIA4AAIcDACDaAQAAkgMAMNsBAAAJABDcAQAAkgMAMN0BAQDJAgAh4QFAAMoCACHiAUAAygIAIYQCAQDJAgAhlwIBAMkCACGYAgIA8gIAIQIMAADvBAAgDgAA7QQAIAsMAACPAwAgDgAAhwMAINoBAACSAwAw2wEAAAkAENwBAACSAwAw3QEBAAAAAeEBQADKAgAh4gFAAMoCACGEAgEAyQIAIZcCAQDJAgAhmAICAPICACEDAAAACQAgAQAACgAwAgAACwAgAwAAAAkAIAEAAAoAMAIAAAsAIBIIAACOAwAgDAAAjwMAINoBAACIAwAw2wEAAA4AENwBAACIAwAw3QEBAMkCACHhAUAAygIAIeIBQADKAgAh8AEBAMkCACGEAgEAyQIAIYUCEACJAwAhhgIBAMkCACGIAgAAigOIAiKKAgAAiwOKAiKLAgEA2gIAIYwCAACMAwAgjQIgANkCACGOAkAAjQMAIQEAAAAOACAMCAAAjgMAINoBAACRAwAw2wEAABAAENwBAACRAwAw3QEBAMkCACHgAUAAygIAIeEBQADKAgAh4gFAAMoCACHwAQEAyQIAIfgBAQDJAgAh-QEBANoCACH6AQEA2gIAIQMIAADuBAAg-QEAAJsDACD6AQAAmwMAIAwIAACOAwAg2gEAAJEDADDbAQAAEAAQ3AEAAJEDADDdAQEAAAAB4AFAAMoCACHhAUAAygIAIeIBQADKAgAh8AEBAMkCACH4AQEAAAAB-QEBANoCACH6AQEA2gIAIQMAAAAQACABAAARADACAAASACARCAAAjgMAINoBAACQAwAw2wEAABQAENwBAACQAwAw3QEBAMkCACHhAUAAygIAIeIBQADKAgAh7gEBAMkCACHvAQEAyQIAIfABAQDJAgAh8QEBANoCACHyAQEA2gIAIfMBAQDaAgAh9AFAAI0DACH1AUAAjQMAIfYBAQDaAgAh9wEBANoCACEICAAA7gQAIPEBAACbAwAg8gEAAJsDACDzAQAAmwMAIPQBAACbAwAg9QEAAJsDACD2AQAAmwMAIPcBAACbAwAgEQgAAI4DACDaAQAAkAMAMNsBAAAUABDcAQAAkAMAMN0BAQAAAAHhAUAAygIAIeIBQADKAgAh7gEBAMkCACHvAQEAyQIAIfABAQDJAgAh8QEBANoCACHyAQEA2gIAIfMBAQDaAgAh9AFAAI0DACH1AUAAjQMAIfYBAQDaAgAh9wEBANoCACEDAAAAFAAgAQAAFQAwAgAAFgAgBQgAAO4EACAMAADvBAAgiwIAAJsDACCMAgAAmwMAII4CAACbAwAgEggAAI4DACAMAACPAwAg2gEAAIgDADDbAQAADgAQ3AEAAIgDADDdAQEAAAAB4QFAAMoCACHiAUAAygIAIfABAQDJAgAhhAIBAAAAAYUCEACJAwAhhgIBAMkCACGIAgAAigOIAiKKAgAAiwOKAiKLAgEA2gIAIYwCAACMAwAgjQIgANkCACGOAkAAjQMAIQMAAAAOACABAAAYADACAAAZACABAAAAEAAgAQAAABQAIAEAAAAOACABAAAACQAgCw4AAIcDACDaAQAAhgMAMNsBAAAfABDcAQAAhgMAMN0BAQDJAgAh4QFAAMoCACHiAUAAygIAIfABAQDJAgAhlQICAPICACGWAgEA2gIAIZcCAQDJAgAhAg4AAO0EACCWAgAAmwMAIAwOAACHAwAg2gEAAIYDADDbAQAAHwAQ3AEAAIYDADDdAQEAAAAB4QFAAMoCACHiAUAAygIAIfABAQDJAgAhlQICAPICACGWAgEA2gIAIZcCAQDJAgAhqAIAAIUDACADAAAAHwAgAQAAIAAwAgAAIQAgAQAAAAkAIAEAAAAfACAOAwAAggMAIAcAAIMDACANAACEAwAg2gEAAIADADDbAQAAJQAQ3AEAAIADADDdAQEAyQIAIeEBQADKAgAh4gFAAMoCACHvAQEAyQIAIYACAACBA6ACIpwCAQDJAgAhnQIBAMkCACGeAggA8wIAIQMDAADqBAAgBwAA6wQAIA0AAOwEACAOAwAAggMAIAcAAIMDACANAACEAwAg2gEAAIADADDbAQAAJQAQ3AEAAIADADDdAQEAAAAB4QFAAMoCACHiAUAAygIAIe8BAQDJAgAhgAIAAIEDoAIinAIBAMkCACGdAgEAyQIAIZ4CCADzAgAhAwAAACUAIAEAACYAMAIAACcAIAEAAAADACABAAAAJQAgAQAAAAEAIA0EAAD7AgAgEQAA_wIAINoBAAD-AgAw2wEAACwAENwBAAD-AgAw3QEBAMkCACHhAUAAygIAIeIBQADKAgAh8AEBAMkCACGdAgEAyQIAIaUCAQDJAgAhpgIBAMkCACGnAgEA2gIAIQMEAADFBAAgEQAA6QQAIKcCAACbAwAgAwAAACwAIAEAAC0AMAIAAAEAIAMAAAAsACABAAAtADACAAABACADAAAALAAgAQAALQAwAgAAAQAgCgQAAOcEACARAADoBAAg3QEBAAAAAeEBQAAAAAHiAUAAAAAB8AEBAAAAAZ0CAQAAAAGlAgEAAAABpgIBAAAAAacCAQAAAAEBFwAAMQAgCN0BAQAAAAHhAUAAAAAB4gFAAAAAAfABAQAAAAGdAgEAAAABpQIBAAAAAaYCAQAAAAGnAgEAAAABARcAADMAMAEXAAAzADAKBAAA0AQAIBEAANEEACDdAQEAmQMAIeEBQACaAwAh4gFAAJoDACHwAQEAmQMAIZ0CAQCZAwAhpQIBAJkDACGmAgEAmQMAIacCAQCfAwAhAgAAAAEAIBcAADYAIAjdAQEAmQMAIeEBQACaAwAh4gFAAJoDACHwAQEAmQMAIZ0CAQCZAwAhpQIBAJkDACGmAgEAmQMAIacCAQCfAwAhAgAAACwAIBcAADgAIAIAAAAsACAXAAA4ACADAAAAAQAgHgAAMQAgHwAANgAgAQAAAAEAIAEAAAAsACAEBQAAzQQAICQAAM8EACAlAADOBAAgpwIAAJsDACAL2gEAAP0CADDbAQAAPwAQ3AEAAP0CADDdAQEAwQIAIeEBQADCAgAh4gFAAMICACHwAQEAwQIAIZ0CAQDBAgAhpQIBAMECACGmAgEAwQIAIacCAQDMAgAhAwAAACwAIAEAAD4AMCMAAD8AIAMAAAAsACABAAAtADACAAABACABAAAABQAgAQAAAAUAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIA8DAADBBAAgBgAAzAQAIA8AAMIEACAQAADDBAAg3QEBAAAAAeEBQAAAAAHiAUAAAAAB7wEBAAAAAfABAQAAAAH7AQEAAAAB_gEBAAAAAaECAQAAAAGiAggAAAABowIgAAAAAaQCAQAAAAEBFwAARwAgC90BAQAAAAHhAUAAAAAB4gFAAAAAAe8BAQAAAAHwAQEAAAAB-wEBAAAAAf4BAQAAAAGhAgEAAAABogIIAAAAAaMCIAAAAAGkAgEAAAABARcAAEkAMAEXAABJADAPAwAAqAQAIAYAAMsEACAPAACpBAAgEAAAqgQAIN0BAQCZAwAh4QFAAJoDACHiAUAAmgMAIe8BAQCZAwAh8AEBAJkDACH7AQEAmQMAIf4BAQCfAwAhoQIBAJkDACGiAggA8gMAIaMCIACrAwAhpAIBAJkDACECAAAABQAgFwAATAAgC90BAQCZAwAh4QFAAJoDACHiAUAAmgMAIe8BAQCZAwAh8AEBAJkDACH7AQEAmQMAIf4BAQCfAwAhoQIBAJkDACGiAggA8gMAIaMCIACrAwAhpAIBAJkDACECAAAAAwAgFwAATgAgAgAAAAMAIBcAAE4AIAMAAAAFACAeAABHACAfAABMACABAAAABQAgAQAAAAMAIAYFAADGBAAgJAAAyQQAICUAAMgEACA2AADHBAAgNwAAygQAIP4BAACbAwAgDtoBAAD8AgAw2wEAAFUAENwBAAD8AgAw3QEBAMECACHhAUAAwgIAIeIBQADCAgAh7wEBAMECACHwAQEAwQIAIfsBAQDBAgAh_gEBAMwCACGhAgEAwQIAIaICCADvAgAhowIgANUCACGkAgEAwQIAIQMAAAADACABAABUADAjAABVACADAAAAAwAgAQAABAAwAgAABQAgBwQAAPsCACDaAQAA-gIAMNsBAABbABDcAQAA-gIAMN0BAQAAAAH7AQEAAAABoAIBAAAAAQEAAABYACABAAAAWAAgBwQAAPsCACDaAQAA-gIAMNsBAABbABDcAQAA-gIAMN0BAQDJAgAh-wEBAMkCACGgAgEAyQIAIQEEAADFBAAgAwAAAFsAIAEAAFwAMAIAAFgAIAMAAABbACABAABcADACAABYACADAAAAWwAgAQAAXAAwAgAAWAAgBAQAAMQEACDdAQEAAAAB-wEBAAAAAaACAQAAAAEBFwAAYAAgA90BAQAAAAH7AQEAAAABoAIBAAAAAQEXAABiADABFwAAYgAwBAQAAJwEACDdAQEAmQMAIfsBAQCZAwAhoAIBAJkDACECAAAAWAAgFwAAZQAgA90BAQCZAwAh-wEBAJkDACGgAgEAmQMAIQIAAABbACAXAABnACACAAAAWwAgFwAAZwAgAwAAAFgAIB4AAGAAIB8AAGUAIAEAAABYACABAAAAWwAgAwUAAJkEACAkAACbBAAgJQAAmgQAIAbaAQAA-QIAMNsBAABuABDcAQAA-QIAMN0BAQDBAgAh-wEBAMECACGgAgEAwQIAIQMAAABbACABAABtADAjAABuACADAAAAWwAgAQAAXAAwAgAAWAAgAQAAACcAIAEAAAAnACADAAAAJQAgAQAAJgAwAgAAJwAgAwAAACUAIAEAACYAMAIAACcAIAMAAAAlACABAAAmADACAAAnACALAwAAlgQAIAcAAJcEACANAACYBAAg3QEBAAAAAeEBQAAAAAHiAUAAAAAB7wEBAAAAAYACAAAAoAICnAIBAAAAAZ0CAQAAAAGeAggAAAABARcAAHYAIAjdAQEAAAAB4QFAAAAAAeIBQAAAAAHvAQEAAAABgAIAAACgAgKcAgEAAAABnQIBAAAAAZ4CCAAAAAEBFwAAeAAwARcAAHgAMAsDAACCBAAgBwAAgwQAIA0AAIQEACDdAQEAmQMAIeEBQACaAwAh4gFAAJoDACHvAQEAmQMAIYACAACBBKACIpwCAQCZAwAhnQIBAJkDACGeAggA8gMAIQIAAAAnACAXAAB7ACAI3QEBAJkDACHhAUAAmgMAIeIBQACaAwAh7wEBAJkDACGAAgAAgQSgAiKcAgEAmQMAIZ0CAQCZAwAhngIIAPIDACECAAAAJQAgFwAAfQAgAgAAACUAIBcAAH0AIAMAAAAnACAeAAB2ACAfAAB7ACABAAAAJwAgAQAAACUAIAUFAAD8AwAgJAAA_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-wEBAMkCACH8AQEAAAAB_QEgANkCACH-AQEA2gIAIf8BAQDaAgAhgAIBANoCACEBAAAA4gEAIAEAAADiAQAgDwkAANsCACAKAADcAgAgCwAA3QIAINoBAADYAgAw2wEAAOUBABDcAQAA2AIAMN0BAQDJAgAh4QFAAMoCACHiAUAAygIAIfsBAQDJAgAh_AEBAMkCACH9ASAA2QIAIf4BAQDaAgAh_wEBANoCACGAAgEA2gIAIQYJAADbAwAgCgAA3AMAIAsAAN0DACD-AQAAmwMAIP8BAACbAwAggAIAAJsDACADAAAA5QEAIAEAAOYBADACAADiAQAgAwAAAOUBACABAADmAQAwAgAA4gEAIAMAAADlAQAgAQAA5gEAMAIAAOIBACAMCQAA2AMAIAoAANkDACALAADaAwAg3QEBAAAAAeEBQAAAAAHiAUAAAAAB-wEBAAAAAfwBAQAAAAH9ASAAAAAB_gEBAAAAAf8BAQAAAAGAAgEAAAABARcAAOoBACAJ3QEBAAAAAeEBQAAAAAHiAUAAAAAB-wEBAAAAAfwBAQAAAAH9ASAAAAAB_gEBAAAAAf8BAQAAAAGAAgEAAAABARcAAOwBADABFwAA7AEAMAwJAACsAwAgCgAArQMAIAsAAK4DACDdAQEAmQMAIeEBQACaAwAh4gFAAJoDACH7AQEAmQMAIfwBAQCZAwAh_QEgAKsDACH-AQEAnwMAIf8BAQCfAwAhgAIBAJ8DACECAAAA4gEAIBcAAO8BACAJ3QEBAJkDACHhAUAAmgMAIeIBQACaAwAh-wEBAJkDACH8AQEAmQMAIf0BIACrAwAh_gEBAJ8DACH_AQEAnwMAIYACAQCfAwAhAgAAAOUBACAXAADxAQAgAgAAAOUBACAXAADxAQAgAwAAAOIBACAeAADqAQAgHwAA7wEAIAEAAADiAQAgAQAAAOUBACAGBQAAqAMAICQAAKoDACAlAACpAwAg_gEAAJsDACD_AQAAmwMAIIACAACbAwAgDNoBAADUAgAw2wEAAPgBABDcAQAA1AIAMN0BAQDBAgAh4QFAAMICACHiAUAAwgIAIfsBAQDBAgAh_AEBAMECACH9ASAA1QIAIf4BAQDMAgAh_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-gEBAMwCACEM2gEAANQCADDbAQAA-AEAENwBAADUAgAw3QEBAMECACHhAUAAwgIAIeIBQADCAgAh-wEBAMECACH8AQEAwQIAIf0BIADVAgAh_gEBAMwCACH_AQEAzAIAIYACAQDMAgAhBQUAAMQCACAkAADXAgAgJQAA1wIAIOMBIAAAAAHqASAA1gIAIQUFAADEAgAgJAAA1wIAICUAANcCACDjASAAAAAB6gEgANYCACEC4wEgAAAAAeoBIADXAgAhDwkAANsCACAKAADcAgAgCwAA3QIAINoBAADYAgAw2wEAAOUBABDcAQAA2AIAMN0BAQDJAgAh4QFAAMoCACHiAUAAygIAIfsBAQDJAgAh_AEBAMkCACH9ASAA2QIAIf4BAQDaAgAh_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_AIAMNsBAABVABDcAQAA_AIAMN0BAQDBAgAh4QFAAMICACHiAUAAwgIAIe8BAQDBAgAh8AEBAMECACH7AQEAwQIAIf4BAQDMAgAhoQIBAMECACGiAggA7wIAIaMCIADVAgAhpAIBAMECACEL2gEAAP0CADDbAQAAPwAQ3AEAAP0CADDdAQEAwQIAIeEBQADCAgAh4gFAAMICACHwAQEAwQIAIZ0CAQDBAgAhpQIBAMECACGmAgEAwQIAIacCAQDMAgAhDQQAAPsCACARAAD_AgAg2gEAAP4CADDbAQAALAAQ3AEAAP4CADDdAQEAyQIAIeEBQADKAgAh4gFAAMoCACHwAQEAyQIAIZ0CAQDJAgAhpQIBAMkCACGmAgEAyQIAIacCAQDaAgAhA4ECAAAlACCCAgAAJQAggwIAACUAIA4DAACCAwAgBwAAgwMAIA0AAIQDACDaAQAAgAMAMNsBAAAlABDcAQAAgAMAMN0BAQDJAgAh4QFAAMoCACHiAUAAygIAIe8BAQDJAgAhgAIAAIEDoAIinAIBAMkCACGdAgEAyQIAIZ4CCADzAgAhBOMBAAAAoAIC5AEAAACgAgjlAQAAAKACCOoBAAD4AqACIg8EAAD7AgAgEQAA_wIAINoBAAD-AgAw2wEAACwAENwBAAD-AgAw3QEBAMkCACHhAUAAygIAIeIBQADKAgAh8AEBAMkCACGdAgEAyQIAIaUCAQDJAgAhpgIBAMkCACGnAgEA2gIAIakCAAAsACCqAgAALAAgA4ECAAAJACCCAgAACQAggwIAAAkAIBQIAACOAwAgDAAAjwMAINoBAACIAwAw2wEAAA4AENwBAACIAwAw3QEBAMkCACHhAUAAygIAIeIBQADKAgAh8AEBAMkCACGEAgEAyQIAIYUCEACJAwAhhgIBAMkCACGIAgAAigOIAiKKAgAAiwOKAiKLAgEA2gIAIYwCAACMAwAgjQIgANkCACGOAkAAjQMAIakCAAAOACCqAgAADgAgAvABAQAAAAGXAgEAAAABCw4AAIcDACDaAQAAhgMAMNsBAAAfABDcAQAAhgMAMN0BAQDJAgAh4QFAAMoCACHiAUAAygIAIfABAQDJAgAhlQICAPICACGWAgEA2gIAIZcCAQDJAgAhFAMAAIIDACAGAACUAwAgDwAAgwMAIBAAAJUDACDaAQAAkwMAMNsBAAADABDcAQAAkwMAMN0BAQDJAgAh4QFAAMoCACHiAUAAygIAIe8BAQDJAgAh8AEBAMkCACH7AQEAyQIAIf4BAQDaAgAhoQIBAMkCACGiAggA8wIAIaMCIADZAgAhpAIBAMkCACGpAgAAAwAgqgIAAAMAIBIIAACOAwAgDAAAjwMAINoBAACIAwAw2wEAAA4AENwBAACIAwAw3QEBAMkCACHhAUAAygIAIeIBQADKAgAh8AEBAMkCACGEAgEAyQIAIYUCEACJAwAhhgIBAMkCACGIAgAAigOIAiKKAgAAiwOKAiKLAgEA2gIAIYwCAACMAwAgjQIgANkCACGOAkAAjQMAIQjjARAAAAAB5AEQAAAABOUBEAAAAATmARAAAAAB5wEQAAAAAegBEAAAAAHpARAAAAAB6gEQAOkCACEE4wEAAACIAgLkAQAAAIgCCOUBAAAAiAII6gEAAOcCiAIiBOMBAAAAigIC5AEAAACKAgjlAQAAAIoCCOoBAADlAooCIgzjAYAAAAAB5gGAAAAAAecBgAAAAAHoAYAAAAAB6QGAAAAAAeoBgAAAAAGPAgEAAAABkAIBAAAAAZECAQAAAAGSAoAAAAABkwKAAAAAAZQCgAAAAAEI4wFAAAAAAeQBQAAAAAXlAUAAAAAF5gFAAAAAAecBQAAAAAHoAUAAAAAB6QFAAAAAAeoBQADQAgAhEQkAANsCACAKAADcAgAgCwAA3QIAINoBAADYAgAw2wEAAOUBABDcAQAA2AIAMN0BAQDJAgAh4QFAAMoCACHiAUAAygIAIfsBAQDJAgAh_AEBAMkCACH9ASAA2QIAIf4BAQDaAgAh_wEBANoCACGAAgEA2gIAIakCAADlAQAgqgIAAOUBACAQAwAAggMAIAcAAIMDACANAACEAwAg2gEAAIADADDbAQAAJQAQ3AEAAIADADDdAQEAyQIAIeEBQADKAgAh4gFAAMoCACHvAQEAyQIAIYACAACBA6ACIpwCAQDJAgAhnQIBAMkCACGeAggA8wIAIakCAAAlACCqAgAAJQAgEQgAAI4DACDaAQAAkAMAMNsBAAAUABDcAQAAkAMAMN0BAQDJAgAh4QFAAMoCACHiAUAAygIAIe4BAQDJAgAh7wEBAMkCACHwAQEAyQIAIfEBAQDaAgAh8gEBANoCACHzAQEA2gIAIfQBQACNAwAh9QFAAI0DACH2AQEA2gIAIfcBAQDaAgAhDAgAAI4DACDaAQAAkQMAMNsBAAAQABDcAQAAkQMAMN0BAQDJAgAh4AFAAMoCACHhAUAAygIAIeIBQADKAgAh8AEBAMkCACH4AQEAyQIAIfkBAQDaAgAh-gEBANoCACELDAAAjwMAIA4AAIcDACDaAQAAkgMAMNsBAAAJABDcAQAAkgMAMN0BAQDJAgAh4QFAAMoCACHiAUAAygIAIYQCAQDJAgAhlwIBAMkCACGYAgIA8gIAIRIDAACCAwAgBgAAlAMAIA8AAIMDACAQAACVAwAg2gEAAJMDADDbAQAAAwAQ3AEAAJMDADDdAQEAyQIAIeEBQADKAgAh4gFAAMoCACHvAQEAyQIAIfABAQDJAgAh-wEBAMkCACH-AQEA2gIAIaECAQDJAgAhogIIAPMCACGjAiAA2QIAIaQCAQDJAgAhCQQAAPsCACDaAQAA-gIAMNsBAABbABDcAQAA-gIAMN0BAQDJAgAh-wEBAMkCACGgAgEAyQIAIakCAABbACCqAgAAWwAgA4ECAAAfACCCAgAAHwAggwIAAB8AIAAAAAGuAgEAAAABAa4CQAAAAAEAAAAAAa4CAQAAAAEBrgJAAAAAAQUeAACoBQAgHwAAqwUAIKsCAACpBQAgrAIAAKoFACCxAgAA4gEAIAMeAACoBQAgqwIAAKkFACCxAgAA4gEAIAAAAAUeAACjBQAgHwAApgUAIKsCAACkBQAgrAIAAKUFACCxAgAA4gEAIAMeAACjBQAgqwIAAKQFACCxAgAA4gEAIAAAAAGuAiAAAAABCx4AAMwDADAfAADRAwAwqwIAAM0DADCsAgAAzgMAMK0CAADPAwAgrgIAANADADCvAgAA0AMAMLACAADQAwAwsQIAANADADCyAgAA0gMAMLMCAADTAwAwCx4AAMADADAfAADFAwAwqwIAAMEDADCsAgAAwgMAMK0CAADDAwAgrgIAAMQDADCvAgAAxAMAMLACAADEAwAwsQIAAMQDADCyAgAAxgMAMLMCAADHAwAwCx4AAK8DADAfAAC0AwAwqwIAALADADCsAgAAsQMAMK0CAACyAwAgrgIAALMDADCvAgAAswMAMLACAACzAwAwsQIAALMDADCyAgAAtQMAMLMCAAC2AwAwDQwAAL8DACDdAQEAAAAB4QFAAAAAAeIBQAAAAAGEAgEAAAABhQIQAAAAAYYCAQAAAAGIAgAAAIgCAooCAAAAigICiwIBAAAAAYwCgAAAAAGNAiAAAAABjgJAAAAAAQIAAAAZACAeAAC-AwAgAwAAABkAIB4AAL4DACAfAAC8AwAgARcAAKIFADASCAAAjgMAIAwAAI8DACDaAQAAiAMAMNsBAAAOABDcAQAAiAMAMN0BAQAAAAHhAUAAygIAIeIBQADKAgAh8AEBAMkCACGEAgEAAAABhQIQAIkDACGGAgEAyQIAIYgCAACKA4gCIooCAACLA4oCIosCAQDaAgAhjAIAAIwDACCNAiAA2QIAIY4CQACNAwAhAgAAABkAIBcAALwDACACAAAAtwMAIBcAALgDACAQ2gEAALYDADDbAQAAtwMAENwBAAC2AwAw3QEBAMkCACHhAUAAygIAIeIBQADKAgAh8AEBAMkCACGEAgEAyQIAIYUCEACJAwAhhgIBAMkCACGIAgAAigOIAiKKAgAAiwOKAiKLAgEA2gIAIYwCAACMAwAgjQIgANkCACGOAkAAjQMAIRDaAQAAtgMAMNsBAAC3AwAQ3AEAALYDADDdAQEAyQIAIeEBQADKAgAh4gFAAMoCACHwAQEAyQIAIYQCAQDJAgAhhQIQAIkDACGGAgEAyQIAIYgCAACKA4gCIooCAACLA4oCIosCAQDaAgAhjAIAAIwDACCNAiAA2QIAIY4CQACNAwAhDN0BAQCZAwAh4QFAAJoDACHiAUAAmgMAIYQCAQCZAwAhhQIQALkDACGGAgEAmQMAIYgCAAC6A4gCIooCAAC7A4oCIosCAQCfAwAhjAKAAAAAAY0CIACrAwAhjgJAAKADACEFrgIQAAAAAbQCEAAAAAG1AhAAAAABtgIQAAAAAbcCEAAAAAEBrgIAAACIAgIBrgIAAACKAgINDAAAvQMAIN0BAQCZAwAh4QFAAJoDACHiAUAAmgMAIYQCAQCZAwAhhQIQALkDACGGAgEAmQMAIYgCAAC6A4gCIooCAAC7A4oCIosCAQCfAwAhjAKAAAAAAY0CIACrAwAhjgJAAKADACEFHgAAnQUAIB8AAKAFACCrAgAAngUAIKwCAACfBQAgsQIAACcAIA0MAAC_AwAg3QEBAAAAAeEBQAAAAAHiAUAAAAABhAIBAAAAAYUCEAAAAAGGAgEAAAABiAIAAACIAgKKAgAAAIoCAosCAQAAAAGMAoAAAAABjQIgAAAAAY4CQAAAAAEDHgAAnQUAIKsCAACeBQAgsQIAACcAIAzdAQEAAAAB4QFAAAAAAeIBQAAAAAHuAQEAAAAB7wEBAAAAAfEBAQAAAAHyAQEAAAAB8wEBAAAAAfQBQAAAAAH1AUAAAAAB9gEBAAAAAfcBAQAAAAECAAAAFgAgHgAAywMAIAMAAAAWACAeAADLAwAgHwAAygMAIAEXAACcBQAwEQgAAI4DACDaAQAAkAMAMNsBAAAUABDcAQAAkAMAMN0BAQAAAAHhAUAAygIAIeIBQADKAgAh7gEBAMkCACHvAQEAyQIAIfABAQDJAgAh8QEBANoCACHyAQEA2gIAIfMBAQDaAgAh9AFAAI0DACH1AUAAjQMAIfYBAQDaAgAh9wEBANoCACECAAAAFgAgFwAAygMAIAIAAADIAwAgFwAAyQMAIBDaAQAAxwMAMNsBAADIAwAQ3AEAAMcDADDdAQEAyQIAIeEBQADKAgAh4gFAAMoCACHuAQEAyQIAIe8BAQDJAgAh8AEBAMkCACHxAQEA2gIAIfIBAQDaAgAh8wEBANoCACH0AUAAjQMAIfUBQACNAwAh9gEBANoCACH3AQEA2gIAIRDaAQAAxwMAMNsBAADIAwAQ3AEAAMcDADDdAQEAyQIAIeEBQADKAgAh4gFAAMoCACHuAQEAyQIAIe8BAQDJAgAh8AEBAMkCACHxAQEA2gIAIfIBAQDaAgAh8wEBANoCACH0AUAAjQMAIfUBQACNAwAh9gEBANoCACH3AQEA2gIAIQzdAQEAmQMAIeEBQACaAwAh4gFAAJoDACHuAQEAmQMAIe8BAQCZAwAh8QEBAJ8DACHyAQEAnwMAIfMBAQCfAwAh9AFAAKADACH1AUAAoAMAIfYBAQCfAwAh9wEBAJ8DACEM3QEBAJkDACHhAUAAmgMAIeIBQACaAwAh7gEBAJkDACHvAQEAmQMAIfEBAQCfAwAh8gEBAJ8DACHzAQEAnwMAIfQBQACgAwAh9QFAAKADACH2AQEAnwMAIfcBAQCfAwAhDN0BAQAAAAHhAUAAAAAB4gFAAAAAAe4BAQAAAAHvAQEAAAAB8QEBAAAAAfIBAQAAAAHzAQEAAAAB9AFAAAAAAfUBQAAAAAH2AQEAAAAB9wEBAAAAAQfdAQEAAAAB4AFAAAAAAeEBQAAAAAHiAUAAAAAB-AEBAAAAAfkBAQAAAAH6AQEAAAABAgAAABIAIB4AANcDACADAAAAEgAgHgAA1wMAIB8AANYDACABFwAAmwUAMAwIAACOAwAg2gEAAJEDADDbAQAAEAAQ3AEAAJEDADDdAQEAAAAB4AFAAMoCACHhAUAAygIAIeIBQADKAgAh8AEBAMkCACH4AQEAAAAB-QEBANoCACH6AQEA2gIAIQIAAAASACAXAADWAwAgAgAAANQDACAXAADVAwAgC9oBAADTAwAw2wEAANQDABDcAQAA0wMAMN0BAQDJAgAh4AFAAMoCACHhAUAAygIAIeIBQADKAgAh8AEBAMkCACH4AQEAyQIAIfkBAQDaAgAh-gEBANoCACEL2gEAANMDADDbAQAA1AMAENwBAADTAwAw3QEBAMkCACHgAUAAygIAIeEBQADKAgAh4gFAAMoCACHwAQEAyQIAIfgBAQDJAgAh-QEBANoCACH6AQEA2gIAIQfdAQEAmQMAIeABQACaAwAh4QFAAJoDACHiAUAAmgMAIfgBAQCZAwAh-QEBAJ8DACH6AQEAnwMAIQfdAQEAmQMAIeABQACaAwAh4QFAAJoDACHiAUAAmgMAIfgBAQCZAwAh-QEBAJ8DACH6AQEAnwMAIQfdAQEAAAAB4AFAAAAAAeEBQAAAAAHiAUAAAAAB-AEBAAAAAfkBAQAAAAH6AQEAAAABBB4AAMwDADCrAgAAzQMAMK0CAADPAwAgsQIAANADADAEHgAAwAMAMKsCAADBAwAwrQIAAMMDACCxAgAAxAMAMAQeAACvAwAwqwIAALADADCtAgAAsgMAILECAACzAwAwAAAAAAAAAAAFHgAAlgUAIB8AAJkFACCrAgAAlwUAIKwCAACYBQAgsQIAAOIBACADHgAAlgUAIKsCAACXBQAgsQIAAOIBACAAAAAAAAWuAgIAAAABtAICAAAAAbUCAgAAAAG2AgIAAAABtwICAAAAAQUeAACRBQAgHwAAlAUAIKsCAACSBQAgrAIAAJMFACCxAgAABQAgAx4AAJEFACCrAgAAkgUAILECAAAFACAAAAAAAAWuAggAAAABtAIIAAAAAbUCCAAAAAG2AggAAAABtwIIAAAAAQAAAAAABR4AAIkFACAfAACPBQAgqwIAAIoFACCsAgAAjgUAILECAAAnACAFHgAAhwUAIB8AAIwFACCrAgAAiAUAIKwCAACLBQAgsQIAAAUAIAMeAACJBQAgqwIAAIoFACCxAgAAJwAgAx4AAIcFACCrAgAAiAUAILECAAAFACAAAAAAAAGuAgAAAKACAgUeAACBBQAgHwAAhQUAIKsCAACCBQAgrAIAAIQFACCxAgAAAQAgCx4AAIoEADAfAACPBAAwqwIAAIsEADCsAgAAjAQAMK0CAACNBAAgrgIAAI4EADCvAgAAjgQAMLACAACOBAAwsQIAAI4EADCyAgAAkAQAMLMCAACRBAAwBx4AAIUEACAfAACIBAAgqwIAAIYEACCsAgAAhwQAIK8CAAAOACCwAgAADgAgsQIAABkAIA0IAADkAwAg3QEBAAAAAeEBQAAAAAHiAUAAAAAB8AEBAAAAAYUCEAAAAAGGAgEAAAABiAIAAACIAgKKAgAAAIoCAosCAQAAAAGMAoAAAAABjQIgAAAAAY4CQAAAAAECAAAAGQAgHgAAhQQAIAMAAAAOACAeAACFBAAgHwAAiQQAIA8AAAAOACAIAADjAwAgFwAAiQQAIN0BAQCZAwAh4QFAAJoDACHiAUAAmgMAIfABAQCZAwAhhQIQALkDACGGAgEAmQMAIYgCAAC6A4gCIooCAAC7A4oCIosCAQCfAwAhjAKAAAAAAY0CIACrAwAhjgJAAKADACENCAAA4wMAIN0BAQCZAwAh4QFAAJoDACHiAUAAmgMAIfABAQCZAwAhhQIQALkDACGGAgEAmQMAIYgCAAC6A4gCIooCAAC7A4oCIosCAQCfAwAhjAKAAAAAAY0CIACrAwAhjgJAAKADACEGDgAA-wMAIN0BAQAAAAHhAUAAAAAB4gFAAAAAAZcCAQAAAAGYAgIAAAABAgAAAAsAIB4AAJUEACADAAAACwAgHgAAlQQAIB8AAJQEACABFwAAgwUAMAsMAACPAwAgDgAAhwMAINoBAACSAwAw2wEAAAkAENwBAACSAwAw3QEBAAAAAeEBQADKAgAh4gFAAMoCACGEAgEAyQIAIZcCAQDJAgAhmAICAPICACECAAAACwAgFwAAlAQAIAIAAACSBAAgFwAAkwQAIAnaAQAAkQQAMNsBAACSBAAQ3AEAAJEEADDdAQEAyQIAIeEBQADKAgAh4gFAAMoCACGEAgEAyQIAIZcCAQDJAgAhmAICAPICACEJ2gEAAJEEADDbAQAAkgQAENwBAACRBAAw3QEBAMkCACHhAUAAygIAIeIBQADKAgAhhAIBAMkCACGXAgEAyQIAIZgCAgDyAgAhBd0BAQCZAwAh4QFAAJoDACHiAUAAmgMAIZcCAQCZAwAhmAICAOoDACEGDgAA-QMAIN0BAQCZAwAh4QFAAJoDACHiAUAAmgMAIZcCAQCZAwAhmAICAOoDACEGDgAA-wMAIN0BAQAAAAHhAUAAAAAB4gFAAAAAAZcCAQAAAAGYAgIAAAABAx4AAIEFACCrAgAAggUAILECAAABACAEHgAAigQAMKsCAACLBAAwrQIAAI0EACCxAgAAjgQAMAMeAACFBAAgqwIAAIYEACCxAgAAGQAgAAAACx4AAJ0EADAfAACiBAAwqwIAAJ4EADCsAgAAnwQAMK0CAACgBAAgrgIAAKEEADCvAgAAoQQAMLACAAChBAAwsQIAAKEEADCyAgAAowQAMLMCAACkBAAwDQMAAMEEACAPAADCBAAgEAAAwwQAIN0BAQAAAAHhAUAAAAAB4gFAAAAAAe8BAQAAAAHwAQEAAAAB-wEBAAAAAf4BAQAAAAGhAgEAAAABogIIAAAAAaMCIAAAAAECAAAABQAgHgAAwAQAIAMAAAAFACAeAADABAAgHwAApwQAIAEXAACABQAwEgMAAIIDACAGAACUAwAgDwAAgwMAIBAAAJUDACDaAQAAkwMAMNsBAAADABDcAQAAkwMAMN0BAQAAAAHhAUAAygIAIeIBQADKAgAh7wEBAMkCACHwAQEAyQIAIfsBAQDJAgAh_gEBANoCACGhAgEAyQIAIaICCADzAgAhowIgANkCACGkAgEAyQIAIQIAAAAFACAXAACnBAAgAgAAAKUEACAXAACmBAAgDtoBAACkBAAw2wEAAKUEABDcAQAApAQAMN0BAQDJAgAh4QFAAMoCACHiAUAAygIAIe8BAQDJAgAh8AEBAMkCACH7AQEAyQIAIf4BAQDaAgAhoQIBAMkCACGiAggA8wIAIaMCIADZAgAhpAIBAMkCACEO2gEAAKQEADDbAQAApQQAENwBAACkBAAw3QEBAMkCACHhAUAAygIAIeIBQADKAgAh7wEBAMkCACHwAQEAyQIAIfsBAQDJAgAh_gEBANoCACGhAgEAyQIAIaICCADzAgAhowIgANkCACGkAgEAyQIAIQrdAQEAmQMAIeEBQACaAwAh4gFAAJoDACHvAQEAmQMAIfABAQCZAwAh-wEBAJkDACH-AQEAnwMAIaECAQCZAwAhogIIAPIDACGjAiAAqwMAIQ0DAACoBAAgDwAAqQQAIBAAAKoEACDdAQEAmQMAIeEBQACaAwAh4gFAAJoDACHvAQEAmQMAIfABAQCZAwAh-wEBAJkDACH-AQEAnwMAIaECAQCZAwAhogIIAPIDACGjAiAAqwMAIQUeAAD5BAAgHwAA_gQAIKsCAAD6BAAgrAIAAP0EACCxAgAAAQAgCx4AALcEADAfAAC7BAAwqwIAALgEADCsAgAAuQQAMK0CAAC6BAAgrgIAAI4EADCvAgAAjgQAMLACAACOBAAwsQIAAI4EADCyAgAAvAQAMLMCAACRBAAwCx4AAKsEADAfAACwBAAwqwIAAKwEADCsAgAArQQAMK0CAACuBAAgrgIAAK8EADCvAgAArwQAMLACAACvBAAwsQIAAK8EADCyAgAAsQQAMLMCAACyBAAwBt0BAQAAAAHhAUAAAAAB4gFAAAAAAfABAQAAAAGVAgIAAAABlgIBAAAAAQIAAAAhACAeAAC2BAAgAwAAACEAIB4AALYEACAfAAC1BAAgARcAAPwEADAMDgAAhwMAINoBAACGAwAw2wEAAB8AENwBAACGAwAw3QEBAAAAAeEBQADKAgAh4gFAAMoCACHwAQEAyQIAIZUCAgDyAgAhlgIBANoCACGXAgEAyQIAIagCAACFAwAgAgAAACEAIBcAALUEACACAAAAswQAIBcAALQEACAK2gEAALIEADDbAQAAswQAENwBAACyBAAw3QEBAMkCACHhAUAAygIAIeIBQADKAgAh8AEBAMkCACGVAgIA8gIAIZYCAQDaAgAhlwIBAMkCACEK2gEAALIEADDbAQAAswQAENwBAACyBAAw3QEBAMkCACHhAUAAygIAIeIBQADKAgAh8AEBAMkCACGVAgIA8gIAIZYCAQDaAgAhlwIBAMkCACEG3QEBAJkDACHhAUAAmgMAIeIBQACaAwAh8AEBAJkDACGVAgIA6gMAIZYCAQCfAwAhBt0BAQCZAwAh4QFAAJoDACHiAUAAmgMAIfABAQCZAwAhlQICAOoDACGWAgEAnwMAIQbdAQEAAAAB4QFAAAAAAeIBQAAAAAHwAQEAAAABlQICAAAAAZYCAQAAAAEGDAAA-gMAIN0BAQAAAAHhAUAAAAAB4gFAAAAAAYQCAQAAAAGYAgIAAAABAgAAAAsAIB4AAL8EACADAAAACwAgHgAAvwQAIB8AAL4EACABFwAA-wQAMAIAAAALACAXAAC-BAAgAgAAAJIEACAXAAC9BAAgBd0BAQCZAwAh4QFAAJoDACHiAUAAmgMAIYQCAQCZAwAhmAICAOoDACEGDAAA-AMAIN0BAQCZAwAh4QFAAJoDACHiAUAAmgMAIYQCAQCZAwAhmAICAOoDACEGDAAA-gMAIN0BAQAAAAHhAUAAAAAB4gFAAAAAAYQCAQAAAAGYAgIAAAABDQMAAMEEACAPAADCBAAgEAAAwwQAIN0BAQAAAAHhAUAAAAAB4gFAAAAAAe8BAQAAAAHwAQEAAAAB-wEBAAAAAf4BAQAAAAGhAgEAAAABogIIAAAAAaMCIAAAAAEDHgAA-QQAIKsCAAD6BAAgsQIAAAEAIAQeAAC3BAAwqwIAALgEADCtAgAAugQAILECAACOBAAwBB4AAKsEADCrAgAArAQAMK0CAACuBAAgsQIAAK8EADAEHgAAnQQAMKsCAACeBAAwrQIAAKAEACCxAgAAoQQAMAAAAAAAAAUeAAD0BAAgHwAA9wQAIKsCAAD1BAAgrAIAAPYEACCxAgAAWAAgAx4AAPQEACCrAgAA9QQAILECAABYACAAAAALHgAA3gQAMB8AAOIEADCrAgAA3wQAMKwCAADgBAAwrQIAAOEEACCuAgAAoQQAMK8CAAChBAAwsAIAAKEEADCxAgAAoQQAMLICAADjBAAwswIAAKQEADALHgAA0gQAMB8AANcEADCrAgAA0wQAMKwCAADUBAAwrQIAANUEACCuAgAA1gQAMK8CAADWBAAwsAIAANYEADCxAgAA1gQAMLICAADYBAAwswIAANkEADAJBwAAlwQAIA0AAJgEACDdAQEAAAAB4QFAAAAAAeIBQAAAAAGAAgAAAKACApwCAQAAAAGdAgEAAAABngIIAAAAAQIAAAAnACAeAADdBAAgAwAAACcAIB4AAN0EACAfAADcBAAgARcAAPMEADAOAwAAggMAIAcAAIMDACANAACEAwAg2gEAAIADADDbAQAAJQAQ3AEAAIADADDdAQEAAAAB4QFAAMoCACHiAUAAygIAIe8BAQDJAgAhgAIAAIEDoAIinAIBAMkCACGdAgEAyQIAIZ4CCADzAgAhAgAAACcAIBcAANwEACACAAAA2gQAIBcAANsEACAL2gEAANkEADDbAQAA2gQAENwBAADZBAAw3QEBAMkCACHhAUAAygIAIeIBQADKAgAh7wEBAMkCACGAAgAAgQOgAiKcAgEAyQIAIZ0CAQDJAgAhngIIAPMCACEL2gEAANkEADDbAQAA2gQAENwBAADZBAAw3QEBAMkCACHhAUAAygIAIeIBQADKAgAh7wEBAMkCACGAAgAAgQOgAiKcAgEAyQIAIZ0CAQDJAgAhngIIAPMCACEH3QEBAJkDACHhAUAAmgMAIeIBQACaAwAhgAIAAIEEoAIinAIBAJkDACGdAgEAmQMAIZ4CCADyAwAhCQcAAIMEACANAACEBAAg3QEBAJkDACHhAUAAmgMAIeIBQACaAwAhgAIAAIEEoAIinAIBAJkDACGdAgEAmQMAIZ4CCADyAwAhCQcAAJcEACANAACYBAAg3QEBAAAAAeEBQAAAAAHiAUAAAAABgAIAAACgAgKcAgEAAAABnQIBAAAAAZ4CCAAAAAENBgAAzAQAIA8AAMIEACAQAADDBAAg3QEBAAAAAeEBQAAAAAHiAUAAAAAB8AEBAAAAAfsBAQAAAAH-AQEAAAABoQIBAAAAAaICCAAAAAGjAiAAAAABpAIBAAAAAQIAAAAFACAeAADmBAAgAwAAAAUAIB4AAOYEACAfAADlBAAgARcAAPIEADACAAAABQAgFwAA5QQAIAIAAAClBAAgFwAA5AQAIArdAQEAmQMAIeEBQACaAwAh4gFAAJoDACHwAQEAmQMAIfsBAQCZAwAh_gEBAJ8DACGhAgEAmQMAIaICCADyAwAhowIgAKsDACGkAgEAmQMAIQ0GAADLBAAgDwAAqQQAIBAAAKoEACDdAQEAmQMAIeEBQACaAwAh4gFAAJoDACHwAQEAmQMAIfsBAQCZAwAh_gEBAJ8DACGhAgEAmQMAIaICCADyAwAhowIgAKsDACGkAgEAmQMAIQ0GAADMBAAgDwAAwgQAIBAAAMMEACDdAQEAAAAB4QFAAAAAAeIBQAAAAAHwAQEAAAAB-wEBAAAAAf4BAQAAAAGhAgEAAAABogIIAAAAAaMCIAAAAAGkAgEAAAABBB4AAN4EADCrAgAA3wQAMK0CAADhBAAgsQIAAKEEADAEHgAA0gQAMKsCAADTBAAwrQIAANUEACCxAgAA1gQAMAADBAAAxQQAIBEAAOkEACCnAgAAmwMAIAAFCAAA7gQAIAwAAO8EACCLAgAAmwMAIIwCAACbAwAgjgIAAJsDACAFAwAA6gQAIAYAAPAEACAPAADrBAAgEAAA8QQAIP4BAACbAwAgBgkAANsDACAKAADcAwAgCwAA3QMAIP4BAACbAwAg_wEAAJsDACCAAgAAmwMAIAMDAADqBAAgBwAA6wQAIA0AAOwEACABBAAAxQQAIAAK3QEBAAAAAeEBQAAAAAHiAUAAAAAB8AEBAAAAAfsBAQAAAAH-AQEAAAABoQIBAAAAAaICCAAAAAGjAiAAAAABpAIBAAAAAQfdAQEAAAAB4QFAAAAAAeIBQAAAAAGAAgAAAKACApwCAQAAAAGdAgEAAAABngIIAAAAAQPdAQEAAAAB-wEBAAAAAaACAQAAAAECAAAAWAAgHgAA9AQAIAMAAABbACAeAAD0BAAgHwAA-AQAIAUAAABbACAXAAD4BAAg3QEBAJkDACH7AQEAmQMAIaACAQCZAwAhA90BAQCZAwAh-wEBAJkDACGgAgEAmQMAIQkRAADoBAAg3QEBAAAAAeEBQAAAAAHiAUAAAAAB8AEBAAAAAZ0CAQAAAAGlAgEAAAABpgIBAAAAAacCAQAAAAECAAAAAQAgHgAA-QQAIAXdAQEAAAAB4QFAAAAAAeIBQAAAAAGEAgEAAAABmAICAAAAAQbdAQEAAAAB4QFAAAAAAeIBQAAAAAHwAQEAAAABlQICAAAAAZYCAQAAAAEDAAAALAAgHgAA-QQAIB8AAP8EACALAAAALAAgEQAA0QQAIBcAAP8EACDdAQEAmQMAIeEBQACaAwAh4gFAAJoDACHwAQEAmQMAIZ0CAQCZAwAhpQIBAJkDACGmAgEAmQMAIacCAQCfAwAhCREAANEEACDdAQEAmQMAIeEBQACaAwAh4gFAAJoDACHwAQEAmQMAIZ0CAQCZAwAhpQIBAJkDACGmAgEAmQMAIacCAQCfAwAhCt0BAQAAAAHhAUAAAAAB4gFAAAAAAe8BAQAAAAHwAQEAAAAB-wEBAAAAAf4BAQAAAAGhAgEAAAABogIIAAAAAaMCIAAAAAEJBAAA5wQAIN0BAQAAAAHhAUAAAAAB4gFAAAAAAfABAQAAAAGdAgEAAAABpQIBAAAAAaYCAQAAAAGnAgEAAAABAgAAAAEAIB4AAIEFACAF3QEBAAAAAeEBQAAAAAHiAUAAAAABlwIBAAAAAZgCAgAAAAEDAAAALAAgHgAAgQUAIB8AAIYFACALAAAALAAgBAAA0AQAIBcAAIYFACDdAQEAmQMAIeEBQACaAwAh4gFAAJoDACHwAQEAmQMAIZ0CAQCZAwAhpQIBAJkDACGmAgEAmQMAIacCAQCfAwAhCQQAANAEACDdAQEAmQMAIeEBQACaAwAh4gFAAJoDACHwAQEAmQMAIZ0CAQCZAwAhpQIBAJkDACGmAgEAmQMAIacCAQCfAwAhDgMAAMEEACAGAADMBAAgEAAAwwQAIN0BAQAAAAHhAUAAAAAB4gFAAAAAAe8BAQAAAAHwAQEAAAAB-wEBAAAAAf4BAQAAAAGhAgEAAAABogIIAAAAAaMCIAAAAAGkAgEAAAABAgAAAAUAIB4AAIcFACAKAwAAlgQAIA0AAJgEACDdAQEAAAAB4QFAAAAAAeIBQAAAAAHvAQEAAAABgAIAAACgAgKcAgEAAAABnQIBAAAAAZ4CCAAAAAECAAAAJwAgHgAAiQUAIAMAAAADACAeAACHBQAgHwAAjQUAIBAAAAADACADAACoBAAgBgAAywQAIBAAAKoEACAXAACNBQAg3QEBAJkDACHhAUAAmgMAIeIBQACaAwAh7wEBAJkDACHwAQEAmQMAIfsBAQCZAwAh_gEBAJ8DACGhAgEAmQMAIaICCADyAwAhowIgAKsDACGkAgEAmQMAIQ4DAACoBAAgBgAAywQAIBAAAKoEACDdAQEAmQMAIeEBQACaAwAh4gFAAJoDACHvAQEAmQMAIfABAQCZAwAh-wEBAJkDACH-AQEAnwMAIaECAQCZAwAhogIIAPIDACGjAiAAqwMAIaQCAQCZAwAhAwAAACUAIB4AAIkFACAfAACQBQAgDAAAACUAIAMAAIIEACANAACEBAAgFwAAkAUAIN0BAQCZAwAh4QFAAJoDACHiAUAAmgMAIe8BAQCZAwAhgAIAAIEEoAIinAIBAJkDACGdAgEAmQMAIZ4CCADyAwAhCgMAAIIEACANAACEBAAg3QEBAJkDACHhAUAAmgMAIeIBQACaAwAh7wEBAJkDACGAAgAAgQSgAiKcAgEAmQMAIZ0CAQCZAwAhngIIAPIDACEOAwAAwQQAIAYAAMwEACAPAADCBAAg3QEBAAAAAeEBQAAAAAHiAUAAAAAB7wEBAAAAAfABAQAAAAH7AQEAAAAB_gEBAAAAAaECAQAAAAGiAggAAAABowIgAAAAAaQCAQAAAAECAAAABQAgHgAAkQUAIAMAAAADACAeAACRBQAgHwAAlQUAIBAAAAADACADAACoBAAgBgAAywQAIA8AAKkEACAXAACVBQAg3QEBAJkDACHhAUAAmgMAIeIBQACaAwAh7wEBAJkDACHwAQEAmQMAIfsBAQCZAwAh_gEBAJ8DACGhAgEAmQMAIaICCADyAwAhowIgAKsDACGkAgEAmQMAIQ4DAACoBAAgBgAAywQAIA8AAKkEACDdAQEAmQMAIeEBQACaAwAh4gFAAJoDACHvAQEAmQMAIfABAQCZAwAh-wEBAJkDACH-AQEAnwMAIaECAQCZAwAhogIIAPIDACGjAiAAqwMAIaQCAQCZAwAhCwkAANgDACAKAADZAwAg3QEBAAAAAeEBQAAAAAHiAUAAAAAB-wEBAAAAAfwBAQAAAAH9ASAAAAAB_gEBAAAAAf8BAQAAAAGAAgEAAAABAgAAAOIBACAeAACWBQAgAwAAAOUBACAeAACWBQAgHwAAmgUAIA0AAADlAQAgCQAArAMAIAoAAK0DACAXAACaBQAg3QEBAJkDACHhAUAAmgMAIeIBQACaAwAh-wEBAJkDACH8AQEAmQMAIf0BIACrAwAh_gEBAJ8DACH_AQEAnwMAIYACAQCfAwAhCwkAAKwDACAKAACtAwAg3QEBAJkDACHhAUAAmgMAIeIBQACaAwAh-wEBAJkDACH8AQEAmQMAIf0BIACrAwAh_gEBAJ8DACH_AQEAnwMAIYACAQCfAwAhB90BAQAAAAHgAUAAAAAB4QFAAAAAAeIBQAAAAAH4AQEAAAAB-QEBAAAAAfoBAQAAAAEM3QEBAAAAAeEBQAAAAAHiAUAAAAAB7gEBAAAAAe8BAQAAAAHxAQEAAAAB8gEBAAAAAfMBAQAAAAH0AUAAAAAB9QFAAAAAAfYBAQAAAAH3AQEAAAABCgMAAJYEACAHAACXBAAg3QEBAAAAAeEBQAAAAAHiAUAAAAAB7wEBAAAAAYACAAAAoAICnAIBAAAAAZ0CAQAAAAGeAggAAAABAgAAACcAIB4AAJ0FACADAAAAJQAgHgAAnQUAIB8AAKEFACAMAAAAJQAgAwAAggQAIAcAAIMEACAXAAChBQAg3QEBAJkDACHhAUAAmgMAIeIBQACaAwAh7wEBAJkDACGAAgAAgQSgAiKcAgEAmQMAIZ0CAQCZAwAhngIIAPIDACEKAwAAggQAIAcAAIMEACDdAQEAmQMAIeEBQACaAwAh4gFAAJoDACHvAQEAmQMAIYACAACBBKACIpwCAQCZAwAhnQIBAJkDACGeAggA8gMAIQzdAQEAAAAB4QFAAAAAAeIBQAAAAAGEAgEAAAABhQIQAAAAAYYCAQAAAAGIAgAAAIgCAooCAAAAigICiwIBAAAAAYwCgAAAAAGNAiAAAAABjgJAAAAAAQsKAADZAwAgCwAA2gMAIN0BAQAAAAHhAUAAAAAB4gFAAAAAAfsBAQAAAAH8AQEAAAAB_QEgAAAAAf4BAQAAAAH_AQEAAAABgAIBAAAAAQIAAADiAQAgHgAAowUAIAMAAADlAQAgHgAAowUAIB8AAKcFACANAAAA5QEAIAoAAK0DACALAACuAwAgFwAApwUAIN0BAQCZAwAh4QFAAJoDACHiAUAAmgMAIfsBAQCZAwAh_AEBAJkDACH9ASAAqwMAIf4BAQCfAwAh_wEBAJ8DACGAAgEAnwMAIQsKAACtAwAgCwAArgMAIN0BAQCZAwAh4QFAAJoDACHiAUAAmgMAIfsBAQCZAwAh_AEBAJkDACH9ASAAqwMAIf4BAQCfAwAh_wEBAJ8DACGAAgEAnwMAIQsJAADYAwAgCwAA2gMAIN0BAQAAAAHhAUAAAAAB4gFAAAAAAfsBAQAAAAH8AQEAAAAB_QEgAAAAAf4BAQAAAAH_AQEAAAABgAIBAAAAAQIAAADiAQAgHgAAqAUAIAMAAADlAQAgHgAAqAUAIB8AAKwFACANAAAA5QEAIAkAAKwDACALAACuAwAgFwAArAUAIN0BAQCZAwAh4QFAAJoDACHiAUAAmgMAIfsBAQCZAwAh_AEBAJkDACH9ASAAqwMAIf4BAQCfAwAh_wEBAJ8DACGAAgEAnwMAIQsJAACsAwAgCwAArgMAIN0BAQCZAwAh4QFAAJoDACHiAUAAmgMAIfsBAQCZAwAh_AEBAJkDACH9ASAAqwMAIf4BAQCfAwAh_wEBAJ8DACGAAgEAnwMAIQMEBgIFAA8RKAYFAwABBQAOBgADDwwFECINAgQHAgUABAEECAACDAAGDgACBAMAAQUADAcNBQ0PBwIIAAgMAAYEBQALCRMJChcKCxoHAQgACAEIAAgDCRsAChwACx0AAQceAAEOAAICDyMAECQAAgQpABEqAAAAAAMFABQkABUlABYAAAADBQAUJAAVJQAWAgMAAQYAAwIDAAEGAAMFBQAbJAAeJQAfNgAcNwAdAAAAAAAFBQAbJAAeJQAfNgAcNwAdAAADBQAkJAAlJQAmAAAAAwUAJCQAJSUAJgEDAAEBAwABBQUAKyQALiUALzYALDcALQAAAAAABQUAKyQALiUALzYALDcALQIMAAYOAAICDAAGDgACBQUANCQANyUAODYANTcANgAAAAAABQUANCQANyUAODYANTcANgAAAAUFAD4kAEElAEI2AD83AEAAAAAAAAUFAD4kAEElAEI2AD83AEABDgACAQ4AAgUFAEckAEolAEs2AEg3AEkAAAAAAAUFAEckAEolAEs2AEg3AEkCCAAIDAAGAggACAwABgUFAFAkAFMlAFQ2AFE3AFIAAAAAAAUFAFAkAFMlAFQ2AFE3AFIAAAMFAFkkAFolAFsAAAADBQBZJABaJQBbAQgACAEIAAgDBQBgJABhJQBiAAAAAwUAYCQAYSUAYgEIAAgBCAAIAwUAZyQAaCUAaQAAAAMFAGckAGglAGkAAAADBQBvJABwJQBxAAAAAwUAbyQAcCUAcRICARMrARQuARUvARYwARgyARk0EBo1ERs3ARw5EB06EiA7ASE8ASI9ECZAEydBFyhCAilDAipEAitFAixGAi1IAi5KEC9LGDBNAjFPEDJQGTNRAjRSAjVTEDhWGjlXIDpZAztaAzxdAz1eAz5fAz9hA0BjEEFkIUJmA0NoEERpIkVqA0ZrA0dsEEhvI0lwJ0pxBktyBkxzBk10Bk51Bk93BlB5EFF6KFJ8BlN-EFR_KVWAAQZWgQEGV4IBEFiFASpZhgEwWocBBVuIAQVciQEFXYoBBV6LAQVfjQEFYI8BEGGQATFikgEFY5QBEGSVATJllgEFZpcBBWeYARBomwEzaZwBOWqeATprnwE6bKIBOm2jATpupAE6b6YBOnCoARBxqQE7cqsBOnOtARB0rgE8da8BOnawATp3sQEQeLQBPXm1AUN6tgENe7cBDXy4AQ19uQENfroBDX-8AQ2AAb4BEIEBvwFEggHBAQ2DAcMBEIQBxAFFhQHFAQ2GAcYBDYcBxwEQiAHKAUaJAcsBTIoBzAEHiwHNAQeMAc4BB40BzwEHjgHQAQePAdIBB5AB1AEQkQHVAU2SAdcBB5MB2QEQlAHaAU6VAdsBB5YB3AEHlwHdARCYAeABT5kB4QFVmgHjAQibAeQBCJwB5wEInQHoAQieAekBCJ8B6wEIoAHtARChAe4BVqIB8AEIowHyARCkAfMBV6UB9AEIpgH1AQinAfYBEKgB-QFYqQH6AVyqAfsBCasB_AEJrAH9AQmtAf4BCa4B_wEJrwGBAgmwAYMCELEBhAJdsgGGAgmzAYgCELQBiQJetQGKAgm2AYsCCbcBjAIQuAGPAl-5AZACY7oBkQIKuwGSAgq8AZMCCr0BlAIKvgGVAgq_AZcCCsABmQIQwQGaAmTCAZwCCsMBngIQxAGfAmXFAaACCsYBoQIKxwGiAhDIAaUCZskBpgJqygGoAmvLAakCa8wBrAJrzQGtAmvOAa4Ca88BsAJr0AGyAhDRAbMCbNIBtQJr0wG3AhDUAbgCbdUBuQJr1gG6AmvXAbsCENgBvgJu2QG_AnI"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  CartItemScalarFieldEnum: () => CartItemScalarFieldEnum,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  JsonNullValueFilter: () => JsonNullValueFilter,
  MealScalarFieldEnum: () => MealScalarFieldEnum,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullableJsonNullValueInput: () => NullableJsonNullValueInput,
  NullsOrder: () => NullsOrder,
  OrderItemScalarFieldEnum: () => OrderItemScalarFieldEnum,
  OrderScalarFieldEnum: () => OrderScalarFieldEnum,
  PaymentScalarFieldEnum: () => PaymentScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  ProviderProfileScalarFieldEnum: () => ProviderProfileScalarFieldEnum,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.6.0",
  engine: "75cbdc1eb7150937890ad5465d861175c6624711"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  ProviderProfile: "ProviderProfile",
  Meal: "Meal",
  Category: "Category",
  Order: "Order",
  OrderItem: "OrderItem",
  CartItem: "CartItem",
  Review: "Review",
  Payment: "Payment",
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var ProviderProfileScalarFieldEnum = {
  id: "id",
  userId: "userId",
  restaurantName: "restaurantName",
  address: "address",
  phone: "phone",
  logo: "logo",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var MealScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  price: "price",
  image: "image",
  isAvailable: "isAvailable",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  userId: "userId",
  providerId: "providerId",
  categoryId: "categoryId"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  slug: "slug"
};
var OrderScalarFieldEnum = {
  id: "id",
  customerId: "customerId",
  providerId: "providerId",
  address: "address",
  totalAmount: "totalAmount",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var OrderItemScalarFieldEnum = {
  id: "id",
  orderId: "orderId",
  mealId: "mealId",
  quantity: "quantity",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CartItemScalarFieldEnum = {
  id: "id",
  userId: "userId",
  mealId: "mealId",
  quantity: "quantity",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  mealName: "mealName",
  mealPrice: "mealPrice",
  mealImage: "mealImage"
};
var ReviewScalarFieldEnum = {
  id: "id",
  rating: "rating",
  comment: "comment",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  mealId: "mealId",
  userId: "userId"
};
var PaymentScalarFieldEnum = {
  id: "id",
  userId: "userId",
  orderId: "orderId",
  amount: "amount",
  currency: "currency",
  paymentMethod: "paymentMethod",
  paymentStatus: "paymentStatus",
  transactionId: "transactionId",
  gatewayResponse: "gatewayResponse",
  isPaid: "isPaid",
  paidAt: "paidAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  role: "role",
  status: "status"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var NullableJsonNullValueInput = {
  DbNull: DbNull2,
  JsonNull: JsonNull2
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var JsonNullValueFilter = {
  DbNull: DbNull2,
  JsonNull: JsonNull2,
  AnyNull: AnyNull2
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  trustedOrigins: [process.env.APP_URL],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
        required: false
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: false
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60
      // 5 minutes
    }
  },
  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: process.env.NODE_ENV === "production",
    crossSubDomainCookies: {
      enabled: false
    },
    disableCSRFCheck: true
    // Allow requests without Origin header (Postman, mobile apps, etc.)
  },
  crossSubDomainCookies: {
    enabled: false
  },
  disableCSRFCheck: true
  // Allow requests without Origin header (Postman, mobile apps, etc.)
});

// src/app.ts
import cors from "cors";

// src/modules/provider/provider.router.ts
import express from "express";

// src/middlewares/auth.ts
var auth2 = (...roles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized!"
        });
      }
      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        emailVerified: session.user.emailVerified
      };
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden! You don't have enough permission to access this resource."
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
var auth_default = auth2;

// src/modules/provider/provider.service.ts
var createProviderProfile = async (userId, payload) => {
  const exists = await prisma.providerProfile.findUnique({
    where: { userId }
  });
  if (exists) {
    const error = new Error("Provider profile already exists");
    error.statusCode = 409;
    throw error;
  }
  return prisma.providerProfile.create({
    data: {
      ...payload,
      userId
    }
  });
};
var getAllProviders = async () => {
  const providers = await prisma.providerProfile.findMany({
    include: {
      meals: true,
      orders: true
    }
  });
  const userIds = providers.map((p) => p.userId);
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, email: true }
  });
  const userMap = new Map(users.map((u) => [u.id, u.email]));
  return providers.map((provider) => ({
    ...provider,
    user: { email: userMap.get(provider.userId) || null }
  }));
};
var getProviderById = async (id) => {
  const provider = await prisma.providerProfile.findUnique({
    where: { id },
    include: { meals: true }
  });
  if (!provider) {
    const error = new Error("Provider not found");
    error.statusCode = 404;
    throw error;
  }
  return provider;
};
var updateProviderProfile = async (providerId, userId, payload) => {
  const provider = await prisma.providerProfile.findUnique({
    where: { id: providerId }
  });
  if (!provider) {
    const error = new Error("Provider profile not found");
    error.statusCode = 404;
    throw error;
  }
  if (provider.userId !== userId) {
    const error = new Error("You are not allowed to update this profile");
    error.statusCode = 403;
    throw error;
  }
  return prisma.providerProfile.update({
    where: { id: providerId },
    data: payload
  });
};
var deleteProviderProfile = async (providerId, userId) => {
  const provider = await prisma.providerProfile.findUnique({
    where: { id: providerId }
  });
  if (!provider) {
    const error = new Error("Provider profile not found");
    error.statusCode = 404;
    throw error;
  }
  if (provider.userId !== userId) {
    const error = new Error("You are not allowed to delete this profile");
    error.statusCode = 403;
    throw error;
  }
  await prisma.providerProfile.delete({
    where: { id: providerId }
  });
};
var providerService = {
  createProviderProfile,
  getAllProviders,
  getProviderById,
  updateProviderProfile,
  deleteProviderProfile
};

// src/modules/provider/provider.controller.ts
var createProviderProfile2 = async (req, res) => {
  try {
    const profile = await providerService.createProviderProfile(
      req.user.id,
      req.body
    );
    res.status(201).json({
      success: true,
      message: "Provider profile created successfully!",
      data: profile,
      error: null
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
      data: null,
      error: err.message
    });
  }
};
var getAllProviders2 = async (_req, res) => {
  try {
    const providers = await providerService.getAllProviders();
    res.status(200).json({
      success: true,
      message: "Providers fetched successfully!",
      data: providers,
      error: null
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch providers!",
      data: null,
      error: err.message
    });
  }
};
var getProviderById2 = async (req, res) => {
  try {
    const { id } = req.params;
    const provider = await providerService.getProviderById(id);
    res.status(200).json({
      success: true,
      message: "Provider fetched successfully!",
      data: provider,
      error: null
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
      data: null,
      error: err.message
    });
  }
};
var updateProviderProfile2 = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProfile = await providerService.updateProviderProfile(
      id,
      req.user.id,
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Provider profile updated successfully!",
      data: updatedProfile,
      error: null
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
      data: null,
      error: err.message
    });
  }
};
var deleteProviderProfile2 = async (req, res) => {
  try {
    const { id } = req.params;
    await providerService.deleteProviderProfile(
      id,
      req.user.id
    );
    res.status(200).json({
      success: true,
      message: "Provider profile deleted successfully!",
      data: null,
      error: null
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
      data: null,
      error: err.message
    });
  }
};
var providerController = {
  createProviderProfile: createProviderProfile2,
  getAllProviders: getAllProviders2,
  getProviderById: getProviderById2,
  updateProviderProfile: updateProviderProfile2,
  deleteProviderProfile: deleteProviderProfile2
};

// src/modules/provider/provider.router.ts
var router = express.Router();
router.get("/", providerController.getAllProviders);
router.get("/:id", providerController.getProviderById);
router.post(
  "/profile",
  auth_default("PROVIDER" /* PROVIDER */),
  providerController.createProviderProfile
);
router.patch(
  "/:id",
  auth_default("PROVIDER" /* PROVIDER */),
  providerController.updateProviderProfile
);
router.delete(
  "/:id",
  auth_default("ADMIN" /* ADMIN */),
  providerController.deleteProviderProfile
);
var providerRouter = router;

// src/middlewares/notFound.ts
function notFound(req, res) {
  res.status(404).json({
    message: "Route not found!",
    path: req.originalUrl,
    date: Date()
  });
}

// src/middlewares/globalErrorHandler.ts
function errorHandler(err, req, res, next) {
  let statusCode = 500;
  let errorMessage = "Internal Server Error";
  let errorDetails = err;
  if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "You provide incorrect field type or missing fields!";
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      statusCode = 400;
      errorMessage = "An operation failed because it depends on one or more records that were required but not found.";
    } else if (err.code === "P2002") {
      statusCode = 400;
      errorMessage = "Duplicate key error";
    } else if (err.code === "P2003") {
      statusCode = 400;
      errorMessage = "Foreign key constraint failed";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    statusCode = 500;
    errorMessage = "Error occurred during query execution";
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = 401;
      errorMessage = "Authentication failed. Please check your creditials!";
    } else if (err.errorCode === "P1001") {
      statusCode = 400;
      errorMessage = "Can't reach database server";
    }
  }
  res.status(statusCode);
  res.json({
    message: errorMessage,
    error: errorDetails
  });
}
var globalErrorHandler_default = errorHandler;

// src/modules/meal/meal.router.ts
import express2 from "express";

// src/modules/meal/meal.service.ts
var createMeal = async (payload, userId) => {
  const provider = await prisma.providerProfile.findUnique({
    where: { userId }
  });
  if (!provider) throw new Error("Provider profile not found");
  return prisma.meal.create({
    data: {
      ...payload,
      providerId: provider.id,
      userId
    }
  });
};
var getAllMeals = async (userId) => {
  const whereClause = userId ? { userId } : {};
  return prisma.meal.findMany({
    where: whereClause,
    include: {
      provider: true,
      category: true,
      reviews: true
    }
  });
};
var getMealById = async (id) => {
  return prisma.meal.findUnique({
    where: { id },
    include: {
      provider: true,
      category: true,
      reviews: true
    }
  });
};
var updateMeal = async (id, payload, userId) => {
  const provider = await prisma.providerProfile.findUnique({
    where: { userId }
  });
  if (!provider) throw new Error("Provider profile not found");
  const meal = await prisma.meal.findUnique({ where: { id } });
  if (!meal) throw new Error("Meal not found");
  if (meal.providerId !== provider.id) {
    throw new Error("You are not allowed to update this meal");
  }
  return prisma.meal.update({
    where: { id },
    data: payload
  });
};
var deleteMeal = async (id, userId) => {
  const provider = await prisma.providerProfile.findUnique({
    where: { userId }
  });
  if (!provider) throw new Error("Provider profile not found");
  const meal = await prisma.meal.findUnique({ where: { id } });
  if (!meal) throw new Error("Meal not found");
  if (meal.providerId !== provider.id) {
    throw new Error("You are not allowed to delete this meal");
  }
  return prisma.meal.delete({ where: { id } });
};
var mealService = {
  createMeal,
  getAllMeals,
  getMealById,
  updateMeal,
  deleteMeal
};

// src/modules/meal/meal.controller.ts
var createMeal2 = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({
        success: false,
        message: "Unauthorized!",
        data: null,
        error: "User not authenticated"
      });
    const meal = await mealService.createMeal(req.body, req.user.id);
    res.status(201).json({
      success: true,
      message: "Meal created successfully",
      data: meal,
      error: null
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || "Failed to create meal",
      data: null,
      error: err.message || "Unknown error"
    });
  }
};
var getAllMeals2 = async (req, res) => {
  try {
    const meals = await mealService.getAllMeals(req.user?.id);
    res.status(200).json({
      success: true,
      message: "Meals fetched successfully",
      data: meals,
      error: null
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch meals",
      data: null,
      error: err.message || "Unknown error"
    });
  }
};
var getMealById2 = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({
        success: false,
        message: "Meal id is required",
        data: null,
        error: "Missing id"
      });
    const meal = await mealService.getMealById(id);
    if (!meal)
      return res.status(404).json({
        success: false,
        message: "Meal not found",
        data: null,
        error: "Meal not found"
      });
    res.status(200).json({
      success: true,
      message: "Meal fetched successfully",
      data: meal,
      error: null
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch meal",
      data: null,
      error: err.message || "Unknown error"
    });
  }
};
var updateMeal2 = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({
        success: false,
        message: "Unauthorized!",
        data: null,
        error: "User not authenticated"
      });
    const { id } = req.params;
    const updatedMeal = await mealService.updateMeal(
      id,
      req.body,
      req.user.id
    );
    res.status(200).json({
      success: true,
      message: "Meal updated successfully",
      data: updatedMeal,
      error: null
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || "Failed to update meal",
      data: null,
      error: err.message || "Unknown error"
    });
  }
};
var deleteMeal2 = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({
        success: false,
        message: "Unauthorized!",
        data: null,
        error: "User not authenticated"
      });
    const { id } = req.params;
    await mealService.deleteMeal(id, req.user.id);
    res.status(200).json({
      success: true,
      message: "Meal deleted successfully",
      data: null,
      error: null
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || "Failed to delete meal",
      data: null,
      error: err.message || "Unknown error"
    });
  }
};
var mealController = {
  createMeal: createMeal2,
  getAllMeals: getAllMeals2,
  getMealById: getMealById2,
  updateMeal: updateMeal2,
  deleteMeal: deleteMeal2
};

// src/modules/meal/meal.router.ts
var router2 = express2.Router();
router2.get("/", mealController.getAllMeals);
router2.get("/:id", mealController.getMealById);
router2.post("/", auth_default("PROVIDER" /* PROVIDER */), mealController.createMeal);
router2.put("/:id", auth_default("PROVIDER" /* PROVIDER */), mealController.updateMeal);
router2.delete(
  "/:id",
  auth_default("PROVIDER" /* PROVIDER */, "ADMIN" /* ADMIN */),
  mealController.deleteMeal
);
var mealRouter = router2;

// src/modules/category/category.router.ts
import express3 from "express";

// src/modules/category/category.service.ts
var createCategory = async (payload) => {
  const { name, slug } = payload;
  if (!name) throw new Error("Category name is required!");
  if (!slug) throw new Error("Category slug is required!");
  const existingName = await prisma.category.findUnique({ where: { name } });
  if (existingName) throw new Error("Category name already exists!");
  const existingSlug = await prisma.category.findUnique({ where: { slug } });
  if (existingSlug) throw new Error("Category slug already exists!");
  const category = await prisma.category.create({
    data: { name, slug }
  });
  return category;
};
var getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    include: { meals: true }
  });
  if (!categories || categories.length === 0) {
    throw new Error("No categories found");
  }
  return categories;
};
var getCategoryById = async (id) => {
  if (!id) throw new Error("Category ID is required");
  const category = await prisma.category.findUnique({
    where: { id },
    include: { meals: true }
  });
  if (!category) throw new Error("Category not found");
  return category;
};
var updateCategory = async (id, payload) => {
  const { name, slug } = payload;
  if (!id) throw new Error("Category ID is required");
  if (!name) throw new Error("Category name is required");
  if (!slug) throw new Error("Category slug is required");
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw new Error("Category not found");
  const existingName = await prisma.category.findUnique({ where: { name } });
  if (existingName && existingName.id !== id)
    throw new Error("Category name already exists");
  const existingSlug = await prisma.category.findUnique({ where: { slug } });
  if (existingSlug && existingSlug.id !== id)
    throw new Error("Category slug already exists");
  const updated = await prisma.category.update({
    where: { id },
    data: { name, slug }
  });
  return updated;
};
var deleteCategory = async (id) => {
  if (!id) throw new Error("Category ID is required!");
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw new Error("Category not found!");
  await prisma.category.delete({ where: { id } });
  return true;
};
var categoryService = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};

// src/modules/category/category.controller.ts
var createCategory2 = async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body);
    return res.status(201).json({
      success: true,
      data: category,
      error: null,
      message: "Category created successfully!"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: null,
      error: err.message || "Something went wrong"
    });
  }
};
var getAllCategories2 = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    return res.json({
      success: true,
      data: categories,
      error: null,
      message: "Categories retrieved successfully!"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: null,
      error: err.message || "Something went wrong"
    });
  }
};
var getCategoryById2 = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        data: null,
        error: "Category ID is required!"
      });
    }
    const category = await categoryService.getCategoryById(id);
    return res.json({
      success: true,
      data: category,
      error: null,
      message: "Category retrieved successfully!"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: null,
      error: err.message || "Something went wrong"
    });
  }
};
var updateCategory2 = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug } = req.body;
    if (!id || !name || !slug) {
      return res.status(400).json({
        success: false,
        data: null,
        error: "Category ID, name and slug are required!"
      });
    }
    const category = await categoryService.updateCategory(id, {
      name,
      slug
    });
    return res.json({
      success: true,
      data: category,
      error: null,
      message: "Category updated successfully!"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: null,
      error: err.message || "Something went wrong"
    });
  }
};
var deleteCategory2 = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        data: null,
        error: "Category ID is required!"
      });
    }
    await categoryService.deleteCategory(id);
    return res.json({
      success: true,
      data: null,
      error: null,
      message: "Category deleted successfully!"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: null,
      error: err.message || "Something went wrong"
    });
  }
};
var categoryController = {
  getAllCategories: getAllCategories2,
  getCategoryById: getCategoryById2,
  createCategory: createCategory2,
  updateCategory: updateCategory2,
  deleteCategory: deleteCategory2
};

// src/modules/category/category.router.ts
var router3 = express3.Router();
router3.get("/", categoryController.getAllCategories);
router3.get("/:id", categoryController.getCategoryById);
router3.post(
  "/",
  auth_default("ADMIN" /* ADMIN */, "PROVIDER" /* PROVIDER */),
  categoryController.createCategory
);
router3.put("/:id", auth_default("ADMIN" /* ADMIN */), categoryController.updateCategory);
router3.delete("/:id", auth_default("ADMIN" /* ADMIN */), categoryController.deleteCategory);
var categoryRouter = router3;

// src/modules/user/user.router.ts
import express4 from "express";

// src/modules/user/user.service.ts
var getAllUsers = async () => {
  try {
    const users = await prisma.user.findMany();
    return { data: users, error: null };
  } catch (err) {
    return {
      data: null,
      error: { message: "Failed to fetch users", statusCode: 500 }
    };
  }
};
var getUserById = async (id) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return {
        data: null,
        error: { message: "User not found", statusCode: 404 }
      };
    }
    return { data: user, error: null };
  } catch (err) {
    return {
      data: null,
      error: { message: "Failed to fetch user", statusCode: 500 }
    };
  }
};
var updateUser = async (id, payload) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user)
      return {
        data: null,
        error: { message: "User not found", statusCode: 404 }
      };
    const updatedUser = await prisma.user.update({
      where: { id },
      data: payload
    });
    return { data: updatedUser, error: null };
  } catch (err) {
    if (err.code === "P2002") {
      return {
        data: null,
        error: { message: "Email already exists", statusCode: 409 }
      };
    }
    return {
      data: null,
      error: { message: "Failed to update user", statusCode: 500 }
    };
  }
};
var deleteUser = async (id) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user)
      return {
        data: null,
        error: { message: "User not found", statusCode: 404 }
      };
    await prisma.user.delete({ where: { id } });
    return { data: null, error: null };
  } catch (err) {
    return {
      data: null,
      error: { message: "Failed to delete user", statusCode: 500 }
    };
  }
};
var userService = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};

// src/modules/user/user.controller.ts
var getAllUsers2 = async (req, res) => {
  try {
    const { data, error } = await userService.getAllUsers();
    if (error) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        data: null,
        error: error.message
      });
    }
    res.json({
      success: true,
      message: "Users fetched successfully!",
      data,
      error: null
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching users!",
      data: null,
      error: err?.message || "Internal Server Error!"
    });
  }
};
var getUserById2 = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await userService.getUserById(id);
    if (error) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        data: null,
        error: error.message
      });
    }
    res.json({
      success: true,
      message: "User fetched successfully!",
      data,
      error: null
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching user!",
      data: null,
      error: err?.message || "Internal Server Error!"
    });
  }
};
var updateUser2 = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await userService.updateUser(
      id,
      req.body
    );
    if (error) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        data: null,
        error: error.message
      });
    }
    res.json({
      success: true,
      message: "User updated successfully!",
      data,
      error: null
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while updating user!",
      data: null,
      error: err?.message || "Internal Server Error!"
    });
  }
};
var deleteUser2 = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await userService.deleteUser(id);
    if (error) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        data: null,
        error: error.message
      });
    }
    res.json({
      success: true,
      message: "User deleted successfully!",
      data: null,
      error: null
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while deleting user!",
      data: null,
      error: err?.message || "Internal Server Error!"
    });
  }
};
var userController = {
  getAllUsers: getAllUsers2,
  getUserById: getUserById2,
  updateUser: updateUser2,
  deleteUser: deleteUser2
};

// src/modules/user/user.router.ts
var router4 = express4.Router();
router4.get("/", userController.getAllUsers);
router4.get("/:id", userController.getUserById);
router4.patch(
  "/:id",
  auth_default("ADMIN" /* ADMIN */, "PROVIDER" /* PROVIDER */, "CUSTOMER" /* CUSTOMER */),
  userController.updateUser
);
router4.delete("/:id", auth_default("ADMIN" /* ADMIN */), userController.deleteUser);
var userRouter = router4;

// src/modules/order/order.router.ts
import express5 from "express";

// src/modules/order/order.service.ts
var createOrder = async (payload, userId) => {
  const provider = await prisma.providerProfile.findUnique({
    where: { id: payload.providerId }
  });
  if (!provider) throw new Error("Provider not found");
  const order = await prisma.order.create({
    data: {
      customerId: userId,
      providerId: payload.providerId,
      address: payload.address,
      totalAmount: payload.totalAmount,
      items: { create: payload.items }
    },
    include: { items: true }
  });
  return order;
};
var getAllOrders = async (user) => {
  const where = {};
  if (user.role === "CUSTOMER") where.customerId = user.id;
  if (user.role === "PROVIDER") {
    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId: user.id }
    });
    if (providerProfile) where.providerId = providerProfile.id;
  }
  return prisma.order.findMany({
    where,
    include: {
      items: { include: { meal: true } },
      provider: true
    },
    orderBy: { createdAt: "desc" }
  });
};
var getOrderById = async (id, user) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { meal: true } } }
  });
  if (!order) return null;
  if (user.role === "PROVIDER") {
    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId: user.id }
    });
    if (!providerProfile || order.providerId !== providerProfile.id) {
      throw new Error("Not authorized");
    }
  }
  return order;
};
var updateOrderStatus = async (id, status, user) => {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw new Error("Order not found");
  if (user.role === "PROVIDER") {
    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId: user.id }
    });
    if (!providerProfile || order.providerId !== providerProfile.id) {
      throw new Error("Not authorized");
    }
  }
  return prisma.order.update({
    where: { id },
    data: { status }
  });
};
var deleteOrder = async (id, user) => {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw new Error("Order not found");
  if (user.role === "CUSTOMER" && order.customerId !== user.id)
    throw new Error("Not authorized");
  return prisma.order.delete({ where: { id } });
};
var orderService = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
};

// src/modules/order/order.controller.ts
var createOrder2 = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        data: null,
        error: "User not authenticated"
      });
    const order = await orderService.createOrder(req.body, req.user.id);
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
      error: null
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || "Failed to create order",
      data: null,
      error: err.message || "Unknown error"
    });
  }
};
var getAllOrders2 = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders(req.user);
    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
      error: null
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch orders",
      data: null,
      error: err.message || "Unknown error"
    });
  }
};
var getOrderById2 = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({
        success: false,
        message: "Order id is required",
        data: null,
        error: "Missing id"
      });
    const order = await orderService.getOrderById(id, req.user);
    if (!order)
      return res.status(404).json({
        success: false,
        message: "Order not found",
        data: null,
        error: "Order not found"
      });
    res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      data: order,
      error: null
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch order",
      data: null,
      error: err.message || "Unknown error"
    });
  }
};
var updateOrderStatus2 = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        data: null,
        error: "User not authenticated"
      });
    const { id } = req.params;
    const { status } = req.body;
    const updatedOrder = await orderService.updateOrderStatus(
      id,
      status,
      req.user
    );
    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: updatedOrder,
      error: null
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || "Failed to update order status",
      data: null,
      error: err.message || "Unknown error"
    });
  }
};
var deleteOrder2 = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        data: null,
        error: "User not authenticated"
      });
    const { id } = req.params;
    await orderService.deleteOrder(id, req.user);
    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
      data: null,
      error: null
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || "Failed to delete order",
      data: null,
      error: err.message || "Unknown error"
    });
  }
};
var orderController = {
  createOrder: createOrder2,
  getAllOrders: getAllOrders2,
  getOrderById: getOrderById2,
  updateOrderStatus: updateOrderStatus2,
  deleteOrder: deleteOrder2
};

// src/modules/order/order.router.ts
var router5 = express5.Router();
router5.get(
  "/",
  auth_default("CUSTOMER" /* CUSTOMER */, "PROVIDER" /* PROVIDER */, "ADMIN" /* ADMIN */),
  orderController.getAllOrders
);
router5.get(
  "/:id",
  auth_default("CUSTOMER" /* CUSTOMER */, "PROVIDER" /* PROVIDER */, "ADMIN" /* ADMIN */),
  orderController.getOrderById
);
router5.post("/", auth_default("CUSTOMER" /* CUSTOMER */), orderController.createOrder);
router5.patch(
  "/:id/status",
  auth_default("PROVIDER" /* PROVIDER */),
  orderController.updateOrderStatus
);
router5.delete("/:id", auth_default("ADMIN" /* ADMIN */), orderController.deleteOrder);
var orderRouter = router5;

// src/modules/review/review.router.ts
import express6 from "express";

// src/modules/review/review.service.ts
var createReview = async (payload, userId) => {
  const meal = await prisma.meal.findUnique({ where: { id: payload.mealId } });
  if (!meal) throw new Error("Meal not found");
  return prisma.review.create({
    data: { ...payload, userId },
    include: { meal: true }
  });
};
var getAllReviews = async () => {
  return prisma.review.findMany({ include: { meal: true } });
};
var getReviewById = async (id) => {
  return prisma.review.findUnique({ where: { id }, include: { meal: true } });
};
var updateReview = async (id, payload, userId) => {
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) throw new Error("Review not found");
  if (review.userId !== userId) throw new Error("Not authorized");
  return prisma.review.update({
    where: { id },
    data: payload,
    include: { meal: true }
  });
};
var deleteReview = async (id, userId, isAdmin) => {
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) throw new Error("Review not found");
  if (!isAdmin && review.userId !== userId) throw new Error("Not authorized");
  return prisma.review.delete({ where: { id } });
};
var reviewService = {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview
};

// src/modules/review/review.controller.ts
var createReview2 = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        data: null,
        error: "User not authenticated"
      });
    const review = await reviewService.createReview(req.body, req.user.id);
    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
      error: null
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || "Failed to create review",
      data: null,
      error: err.message || "Unknown error"
    });
  }
};
var getAllReviews2 = async (req, res) => {
  try {
    const reviews = await reviewService.getAllReviews();
    res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      data: reviews,
      error: null
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch reviews",
      data: null,
      error: err.message || "Unknown error"
    });
  }
};
var getReviewById2 = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({
        success: false,
        message: "Review id is required",
        data: null,
        error: "Missing id"
      });
    const review = await reviewService.getReviewById(id);
    if (!review)
      return res.status(404).json({
        success: false,
        message: "Review not found",
        data: null,
        error: "Review not found"
      });
    res.status(200).json({
      success: true,
      message: "Review fetched successfully",
      data: review,
      error: null
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch review",
      data: null,
      error: err.message || "Unknown error"
    });
  }
};
var updateReview2 = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        data: null,
        error: "User not authenticated"
      });
    const { id } = req.params;
    const updated = await reviewService.updateReview(
      id,
      req.body,
      req.user.id
    );
    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: updated,
      error: null
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || "Failed to update review",
      data: null,
      error: err.message || "Unknown error"
    });
  }
};
var deleteReview2 = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        data: null,
        error: "User not authenticated"
      });
    const { id } = req.params;
    await reviewService.deleteReview(
      id,
      req.user.id,
      req.user.role === "ADMIN"
    );
    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      data: null,
      error: null
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || "Failed to delete review",
      data: null,
      error: err.message || "Unknown error"
    });
  }
};
var reviewController = {
  createReview: createReview2,
  getAllReviews: getAllReviews2,
  getReviewById: getReviewById2,
  updateReview: updateReview2,
  deleteReview: deleteReview2
};

// src/modules/review/review.router.ts
var router6 = express6.Router();
router6.get("/", reviewController.getAllReviews);
router6.get("/:id", reviewController.getReviewById);
router6.post("/", auth_default("CUSTOMER" /* CUSTOMER */), reviewController.createReview);
router6.put("/:id", auth_default("CUSTOMER" /* CUSTOMER */), reviewController.updateReview);
router6.delete("/:id", auth_default("ADMIN" /* ADMIN */), reviewController.deleteReview);
var reviewRouter = router6;

// src/modules/cart/cart.router.ts
import express7 from "express";

// src/modules/cart/cart.service.ts
var createCartItem = async (payload, userId) => {
  const meal = await prisma.meal.findUnique({
    where: { id: payload.mealId }
  });
  if (!meal) {
    throw new Error("Meal not found");
  }
  const existing = await prisma.cartItem.findFirst({
    where: {
      userId,
      mealId: payload.mealId
    }
  });
  if (existing) {
    return prisma.cartItem.update({
      where: { id: existing.id },
      data: {
        quantity: existing.quantity + (payload.quantity || 1)
      }
    });
  }
  return prisma.cartItem.create({
    data: {
      userId,
      mealId: meal.id,
      quantity: payload.quantity || 1,
      mealName: meal.name,
      mealPrice: meal.price,
      mealImage: meal.image
    }
  });
};
var getAllCartItems = async (userId) => {
  return prisma.cartItem.findMany({ where: { userId } });
};
var getCartItemById = async (id, userId) => {
  return prisma.cartItem.findFirst({ where: { id, userId } });
};
var updateCartItem = async (id, payload, userId) => {
  const item = await prisma.cartItem.findUnique({ where: { id } });
  if (!item) throw new Error("Cart item not found");
  if (item.userId !== userId) throw new Error("Not authorized");
  return prisma.cartItem.update({
    where: { id },
    data: {
      quantity: payload.quantity
    }
  });
};
var deleteCartItem = async (id, userId) => {
  const item = await prisma.cartItem.findUnique({ where: { id } });
  if (!item) throw new Error("Cart item not found");
  if (item.userId !== userId) throw new Error("Not authorized");
  return prisma.cartItem.delete({ where: { id } });
};
var cartService = {
  createCartItem,
  getAllCartItems,
  getCartItemById,
  updateCartItem,
  deleteCartItem
};

// src/modules/cart/cart.controller.ts
var createCartItem2 = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        data: null,
        error: "User not authenticated"
      });
    const item = await cartService.createCartItem(req.body, req.user.id);
    res.status(201).json({
      success: true,
      message: "Cart item added successfully",
      data: item,
      error: null
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || "Failed to add cart item",
      data: null,
      error: err.message || "Unknown error"
    });
  }
};
var getAllCartItems2 = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        data: null,
        error: "User not authenticated"
      });
    const items = await cartService.getAllCartItems(req.user.id);
    res.status(200).json({
      success: true,
      message: "Cart items fetched successfully",
      data: items,
      error: null
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch cart items",
      data: null,
      error: err.message || "Unknown error"
    });
  }
};
var getCartItemById2 = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.user)
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        data: null,
        error: "User not authenticated"
      });
    const item = await cartService.getCartItemById(id, req.user.id);
    if (!item)
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
        data: null,
        error: "Not found"
      });
    res.status(200).json({
      success: true,
      message: "Cart item fetched successfully",
      data: item,
      error: null
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch cart item",
      data: null,
      error: err.message || "Unknown error"
    });
  }
};
var updateCartItem2 = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        data: null,
        error: "User not authenticated"
      });
    const { id } = req.params;
    const updated = await cartService.updateCartItem(
      id,
      req.body,
      req.user.id
    );
    res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      data: updated,
      error: null
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || "Failed to update cart item",
      data: null,
      error: err.message || "Unknown error"
    });
  }
};
var deleteCartItem2 = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        data: null,
        error: "User not authenticated"
      });
    const { id } = req.params;
    await cartService.deleteCartItem(id, req.user.id);
    res.status(200).json({
      success: true,
      message: "Cart item deleted successfully",
      data: null,
      error: null
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || "Failed to delete cart item",
      data: null,
      error: err.message || "Unknown error"
    });
  }
};
var cartController = {
  createCartItem: createCartItem2,
  getAllCartItems: getAllCartItems2,
  getCartItemById: getCartItemById2,
  updateCartItem: updateCartItem2,
  deleteCartItem: deleteCartItem2
};

// src/modules/cart/cart.router.ts
var router7 = express7.Router();
router7.get("/", auth_default("CUSTOMER" /* CUSTOMER */), cartController.getAllCartItems);
router7.get("/:id", auth_default("CUSTOMER" /* CUSTOMER */), cartController.getCartItemById);
router7.post("/", auth_default("CUSTOMER" /* CUSTOMER */), cartController.createCartItem);
router7.put("/:id", auth_default("CUSTOMER" /* CUSTOMER */), cartController.updateCartItem);
router7.delete("/:id", auth_default("CUSTOMER" /* CUSTOMER */), cartController.deleteCartItem);
var cartRouter = router7;

// src/app.ts
import cookieParser from "cookie-parser";
var app = express8();
app.set("trust proxy", 1);
app.post(
  "/webhook",
  express8.raw({ type: "application/json" }),
  async (req, res) => {
    console.log("Webhook received", req.body);
  }
);
app.use(
  cors({
    origin: process.env.APP_URL,
    credentials: true
  })
);
app.use(cookieParser());
app.use(express8.json());
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api/users", userRouter);
app.use("/api/providers", providerRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/meals", mealRouter);
app.use("/api/carts", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/reviews", reviewRouter);
app.get("/", (req, res) => {
  res.send("FoodMart server is running....");
});
app.use(notFound);
app.use(globalErrorHandler_default);
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
