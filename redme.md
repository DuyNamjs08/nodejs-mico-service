câu hỏi kafka , message queue

1. những tin nhắn bị mất dữ liệu thì làm gì để hạn chế vấn đề đó
2. làm sao trống tin nhắn trùng lặp trong mesage queue
3. làm sao phân chia cấu trúc dữ liệu 1 cách hợp lý trong message queue
4. làm sao để các tin nhắn đi theo tuần tự ko bị hỗn loạn
5. làm sao để tránh việc dồn cục bộ các tin nhắn

=> hệ thống thông báo => sử dụng thuật toán push/pull
dùng push nếu người dùng sử dụng ứng dụng liên tục hay vào ứng dụng
dùng pull nếu người dùng ít vào ứng dụng , khi vào ứng dụng thì mới hiển thị thông báo
