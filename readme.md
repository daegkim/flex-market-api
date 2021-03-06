# 1. Database
## 1) 구조
- database : flex
- collection
  - product
    - productId
    - productName
    - price
    - quantity
    - image
    - categoryId
    - eventId(미적용)
  - category
    - categoryId
    - categoryName
  - account
    - userId
    - userName
    - userPwd
    - point
  - accountChangeHist
    - userId
    - actId
    - prevData
    - changeData
    - changeDate
  - event(미적용)
    - eventId
    - eventName
    - discountRate
    - pointRate
## 2) query
- product
  ~~~JSON
  db.product.insert([
  {
    productId: 1,
    productName: "맨투맨1",
    price: 40000,
    quantity: 5,
    image: "http://localhost:4000/product/image/sweat1.jpeg",
    categoryId: 1,
  },
  {
    productId: 2,
    productName: "맨투맨2",
    price: 50000,
    quantity: 2,
    image: "http://localhost:4000/product/image/sweat2.jpeg",
    categoryId: 1,
  },
  {
    productId: 3,
    productName: "맨투맨3",
    price: 80000,
    quantity: 5,
    image: "http://localhost:4000/product/image/sweat3.jpeg",
    categoryId: 1,
  },
  {
    productId: 4,
    productName: "맨투맨4",
    price: 50000,
    quantity: 8,
    image: "http://localhost:4000/product/image/sweat4.jpeg",
    categoryId: 1,
  },
  {
    productId: 5,
    productName: "맨투맨5",
    price: 20000,
    quantity: 1,
    image: "http://localhost:4000/product/image/sweat5.jpeg",
    categoryId: 1,
  },
  {
    productId: 6,
    productName: "맨투맨6",
    price: 100000,
    quantity: 10,
    image: "http://localhost:4000/product/image/sweat6.jpeg",
    categoryId: 1,
  },
  {
    productId: 7,
    productName: "티셔츠1",
    price: 10000,
    quantity: 10,
    image: "http://localhost:4000/product/image/t1.jpeg",
    categoryId: 2,
  },
  {
    productId: 8,
    productName: "티셔츠2",
    price: 20000,
    quantity: 2,
    image: "http://localhost:4000/product/image/t2.jpeg",
    categoryId: 2,
  },
  {
    productId: 9,
    productName: "티셔츠3",
    price: 30000,
    quantity: 3,
    image: "http://localhost:4000/product/image/t3.jpeg",
    categoryId: 2,
  },
  {
    productId: 10,
    productName: "티셔츠4",
    price: 10000,
    quantity: 11,
    image: "http://localhost:4000/product/image/t4.jpeg",
    categoryId: 2,
  },
  {
    productId: 11,
    productName: "티셔츠5",
    price: 60000,
    quantity: 6,
    image: "http://localhost:4000/product/image/t5.jpeg",
    categoryId: 2,
  },
  {
    productId: 12,
    productName: "티셔츠6",
    price: 50000,
    quantity: 3,
    image: "http://localhost:4000/product/image/t6.jpeg",
    categoryId: 2,
  },
  {
    productId: 13,
    productName: "티셔츠7",
    price: 10000,
    quantity: 0,
    image: "http://localhost:4000/product/image/t7.jpeg",
    categoryId: 2,
  },
  {
    productId: 14,
    productName: "코트1",
    price: 170000,
    quantity: 3,
    image: "http://localhost:4000/product/image/coat1.jpeg",
    categoryId: 3,
  },
  {
    productId: 15,
    productName: "자켓1",
    price: 110000,
    quantity: 8,
    image: "http://localhost:4000/product/image/jacket1.jpeg",
    categoryId: 4,
  },
  {
    productId: 16,
    productName: "바지1",
    price: 90000,
    quantity: 2,
    image: "http://localhost:4000/product/image/pants1.jpeg",
    categoryId: 5,
  },
  {
    productId: 17,
    productName: "악세1",
    price: 15000,
    quantity: 2,
    image: "http://localhost:4000/product/image/acc1.jpeg",
    categoryId: 6,
  },{
    productId: 18,
    productName: "악세2",
    price: 35000,
    quantity: 6,
    image: "http://localhost:4000/product/image/acc2.jpeg",
    categoryId: 6,
  }
  ])
  ~~~
- category
  ~~~JSON
  db.category.insert([
  {
    categoryId: 1,
    categoryName: "맨투맨"
  },
  {
    categoryId: 2,
    categoryName: "티셔츠"
  },
  {
    categoryId: 3,
    categoryName: "코트"
  },
  {
    categoryId: 4,
    categoryName: "자켓"
  },
  {
    categoryId: 5,
    categoryName: "바지"
  },
  {
    categoryId: 6,
    categoryName: "악세서리"
  }
  ])
  ~~~
- account
  ~~~JSON
  db.account.insert([
    {
      userId: "dgsoul",
      userPwd: "9071eb2305a2eb8b1525f48e19713701482436465738239c5a2f3cee20a08f47e4d1699522fe036aff2bcd1f246c43c23d9f32a2248ed5e5468a143e4e4d15bd",
      userName: "daegeunKim",
      point: 0
    }
  ])
- accountChangeHist
  ~~~JSON
  db.accountChangeHist.insert([
    {
      userId: "dgsoul",
      actId: "CREATE_ACCOUNT",
      prevData: {},
      changeData: {
        userId: "dgsoul",
        userPwd: "9071eb2305a2eb8b1525f48e19713701482436465738239c5a2f3cee20a08f47e4d1699522fe036aff2bcd1f246c43c23d9f32a2248ed5e5468a143e4e4d15bd",
        userName: "daegeunKim",
        point: 0
      }
    }
  ])
## 3) MONGODB 사용
### 명령어
- mongod --dbpath /users/daegeun/data/db --replSet rs0
  - db가 저장된 경로 지정
  - 세션을 사용할 수 있도록 replSet 설정
- rs.initiate()
  - replSet초기화

# 2. API

