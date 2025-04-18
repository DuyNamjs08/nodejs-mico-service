các cú pháp cơ bản trong elastic search

1. tạo index bằng lệch || PUT /my-index
2. liệt kê tất cả các chỉ mục || GET \_cat/indices?v
3. thêm một document || POST /my-index/\_doc
4. đọc 1 index || GET /my-index
5. xóa 1 index || DELETE /my-index
6. update 1 field cua 1 san pham ||
   localhost:9200/shop_001/product/2/\_update
   {
   "doc":{
   "title":"san pham moi"
   }
   }
