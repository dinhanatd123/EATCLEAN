# Kế Hoạch & Bộ Prompt Chi Tiết Hướng Dẫn Google AI Studio Tạo Trang Web Eat Clean Tuần 1

Tài liệu này cung cấp lộ trình từng bước và **Bộ Prompt mẫu (Copy & Paste)** được thiết kế riêng dựa trên toàn bộ dữ liệu của file `Slide_Huong_Dan_Eat_Clean_Tuan_1.pdf` (42 suất ăn cho 2 người trong 7 ngày với 885.000 đồng). Bạn chỉ cần làm theo thứ tự bên dưới để Google AI Studio xuất ra một trang web hoàn chỉnh, có tính năng tương tác và hình ảnh minh họa món ăn sinh động.

## 1. Quy Trình 4 Bước Triển Khai Trên Google AI Studio

1. **Bước 1 — Thiết lập môi trường trên Google AI Studio:**
   * Truy cập Google AI Studio (`aistudio.google.com`) và chọn tạo **New Prompt (Chat Prompt)** hoặc mở tab **Build / Starter Apps** (nếu muốn chạy thử giao diện trực tiếp).
   * Ở cột cài đặt bên phải (Run settings), chọn mô hình **Gemini 2.5 Pro** (hoặc dòng Pro mới nhất) để đảm bảo khả năng viết code giao diện dài, chính xác và không bị cắt bớt dữ liệu của 21 bữa ăn.
   * Đặt **Temperature = 0.2 – 0.4** để AI giữ nguyên 100% định lượng gam, giá tiền và nhiệt độ an toàn thực phẩm (`74°C`, `≤ 4°C`, `≤ -18°C`) từ tài liệu gốc.

2. **Bước 2 — Tải file PDF gốc lên làm nguồn dữ liệu đối chiếu:**
   * Nhấn nút dấu cộng (`+` / **Insert**) trong khung chat của AI Studio và tải trực tiếp file `Slide_Huong_Dan_Eat_Clean_Tuan_1.pdf` lên.
   * Nhờ khả năng đọc đa phương thức (Multimodal), AI Studio sẽ nhìn thấy cả bố cục màu sắc (xanh rêu đậm – kem sáng – cam đất), biểu đồ ngân sách lẫn hình chụp các khay thức ăn trong 8 trang slide.

3. **Bước 3 — Dán System Instructions & Master Prompt (Ở Mục 3 và Mục 4 bên dưới):**
   * Copy phần **System Instructions** dán vào ô *System Instructions* ở phía trên cùng của AI Studio.
   * Copy phần **Master Prompt (Lệnh tạo trang web hoàn chỉnh)** dán vào ô chat chính cùng với file PDF đã đính kèm và nhấn **Run**.

4. **Bước 4 — Xử lý hình ảnh minh họa sinh động & Tinh chỉnh (Ở Mục 5 bên dưới):**
   * Vì AI tạo code (HTML/CSS/JS hoặc React) không tự sinh file ảnh `.jpg` đóng gói sẵn trong 1 lần xuất code, bạn có 3 phương án hiển thị hình ảnh cực kỳ bắt mắt được tích hợp sẵn trong kế hoạch này (dùng ảnh thực phẩm chất lượng cao qua URL kết hợp thẻ SVG/Canvas trực quan, hoặc tạo ảnh bằng Gemini/Imagen rồi gắn vào).

## 2. Cấu Trúc Trang Web & Tính Năng Cần Yêu Cầu AI Studio Xây Dựng

Để trang web không chỉ là một bài viết tĩnh mà trở thành **Ứng dụng Web Cẩm Nang Eat Clean Tương Tác**, bản kế hoạch chia trang web thành 6 phân khu tương ứng với 8 slide gốc:

| Phân khu trên Web | Nguồn dữ liệu từ PDF | Tính năng tương tác & Hình ảnh minh họa |
| :--- | :--- | :--- |
| **1. Hero Banner & Dashboard Tổng Quan** | Slide 01 | Hiển thị nổi bật thông điệp *"42 Suất Ăn Đủ Chất Chỉ Với 885.000 Đồng"*, nguyên tắc *"Nấu 1 lần buổi tối cho 4 suất (Tối nay + Trưa mai)"* và 5 thẻ thống kê (2 người • 7 ngày, Trần 1.000.000đ, Đi chợ 885.000đ, Dự phòng 115.000đ, Tổng khối lượng 6 nhóm nguyên liệu). Có nút chuyển đổi **Khẩu phần 1 người / 2 người / 4 người** tự động nhân/chia định lượng. |
| **2. Ma Trận Thực Đơn 7 Ngày (Thứ Hai – Chủ Nhật)** | Slide 02 | Bộ lọc theo ngày (Thứ 2 đến CN) hoặc xem toàn bảng. Mỗi bữa ăn hiển thị thẻ món ăn có ảnh minh họa, định lượng gạo khô (160g/bữa 2 suất hoặc 320g/mẻ 4 suất) và nhãn liên kết thông minh chỉ rõ bữa trưa hôm sau lấy từ mẻ nấu tối hôm trước. |
| **3. Giỏ Đi Chợ Tương Tác & Biểu Đồ Ngân Sách** | Slide 03 | Bảng checklist đi chợ có ô tích chọn (checkbox) lưu trạng thái đã mua, tự động cộng tổng tiền đã nhặt vào giỏ so với mốc 885.000đ. Biểu đồ thanh ngang trực quan hóa 6 nhóm (Đạm 423.000đ - 47,8%, Rau củ 150.000đ, Tinh bột 140.000đ, Dầu & gia vị 75.000đ, Trái cây 50.000đ, Sữa & lạc 47.000đ, Dự phòng 115.000đ) kèm hộp thoại *"Chiến lược ứng phó khi giá chợ biến động"*. |
| **4. Timeline Sơ Chế 90 Phút Chủ Nhật & Nhịp Nấu Tối** | Slide 04 | Thanh tiến trình thời gian (Timeline) có đồng hồ đếm ngược hoặc checklist từng chặng: `0–15 phút` (Thiết lập an toàn), `15–35 phút` (Chia đạm ức gà 300g/600g/600g, heo 600g, cá 1,2kg), `35–60 phút` (Nấu sẵn trưa T2 & rang 200g lạc), `60–90 phút` (Sơ chế rau & chia yến mạch 160g/160g/180g), cùng lịch tối T2–T7 (`20–30 phút`) và đi chợ giữa tuần (`15–20 phút`). |
| **5. Thư Viện 11 Công Thức Chế Biến Có Ảnh Minh Họa** | Slide 05, 06, 07, 08 | Chia làm 4 tab có thẻ ảnh món ăn (Recipe Cards): **Bữa sáng 5–25 phút** (3 món), **Nhóm Ức gà 1,5kg đạt tâm 74°C** (3 món), **Nhóm Món hấp thanh đạm** (2 món), **Nhóm Đậu hũ – Trứng** (3 món). Bấm vào từng món sẽ mở chi tiết nguyên liệu, từng bước nấu và mẹo giữ độ ẩm khi hâm nóng. |
| **6. Cẩm Nang An Toàn Thực Phẩm USDA FSIS** | Slide 01, 04, 08 | Bảng quy chuẩn làm lạnh nhanh (`≤ 4°C` trong 2 giờ, hoặc 1 giờ nếu trời `> 32°C`), cấp đông (`≤ -18°C`), vận chuyển bằng túi giữ lạnh có đá gel và hâm nóng đạt nhiệt độ tâm `≥ 74°C`, kèm bộ đếm theo dõi lượng dầu ăn tuần (140–180 ml / chai 250 ml). |

## 3. System Instructions (Dán Vào Ô System Instructions Của AI Studio)

Hãy copy đoạn văn bản dưới đây và dán vào mục **System Instructions** trong Google AI Studio:

```text
Bạn là một Senior Frontend Architect và Chuyên gia Thiết kế UI/UX chuyên về ứng dụng Ẩm thực & Dinh dưỡng (Health & Meal Prep Web App).
Nhiệm vụ của bạn là xây dựng một trang web tương tác hoàn chỉnh (Single-File HTML5 tích hợp Tailwind CSS, Lucide Icons / FontAwesome, Chart.js và Vanilla JavaScript) dựa chính xác 100% trên tài liệu "Thực Đơn Eat Clean Tuần 1: 42 Suất Ăn Đủ Chất Chỉ Với 885.000 Đồng" được đính kèm.

Nguyên tắc bắt buộc:
1. KHÔNG viết tóm tắt hay dùng bình luận "// code tiếp ở đây" hoặc "...". Phải xuất toàn bộ mã nguồn đầy đủ của cả 7 ngày và 11 công thức món ăn.
2. Giữ nguyên tuyệt đối mọi con số định lượng (gam, kg, ml), đơn giá, thành tiền (tổng 885.000đ + 115.000đ dự phòng = 1.000.000đ), thời gian sơ chế (90 phút Chủ Nhật) và nhiệt độ chuẩn an toàn thực phẩm USDA FSIS (74°C, ≤4°C, ≤-18°C).
3. Thiết kế thẩm mỹ hiện đại, ấm cúng và tươi mát theo phong cách Editorial Food App:
   - Màu chủ đạo: Xanh lá rừng đậm (#1B4332), Xanh lá tươi (#2D6A4F), Nền kem ấm (#FAF8F5), Nhấn cam đất/vàng nghệ (#D97706).
   - Font chữ tiếng Việt hiển thị đẹp, rõ ràng (Be Vietnam Pro / Plus Jakarta Sans / Playfair Display cho tiêu đề).
4. Hình ảnh minh họa sinh động:
   - Mỗi món ăn trong 11 công thức chính và khu vực sơ chế phải có hình ảnh minh họa sắc nét, đúng mô tả món ăn kèm nhãn (badge) thời gian nấu, số suất và nhiệt độ/định lượng.
   - Sử dụng kết hợp ảnh chụp món ăn thực tế chất lượng cao từ Unsplash (với URL cụ thể, ổn định, đúng món: yến mạch chuối lạc, khoai lang trứng luộc, cháo cà rốt trứng, ức gà áp chảo bí đỏ, gà nướng sả, thịt heo hấp gừng bắp cải, cá diêu hồng hấp nguyên con, đậu hũ sốt cà chua, đậu hũ hấp trứng...) VÀ tích hợp cơ chế fallback thông minh + nút "Thay ảnh từ máy của bạn" (cho phép người dùng chọn ảnh vừa cắt từ PDF hoặc ảnh tự chụp để hiển thị ngay trên giao diện).
```

## 4. Master Prompt Chi Tiết (Dán Vào Khung Chat Của AI Studio Cùng File PDF)

Sau khi đã đính kèm file `Slide_Huong_Dan_Eat_Clean_Tuan_1.pdf`, bạn copy toàn bộ prompt dưới đây dán vào khung chat:

```text
Hãy dựa vào file PDF "Slide_Huong_Dan_Eat_Clean_Tuan_1.pdf" đính kèm để viết trọn vẹn 1 file `index.html` duy nhất (chứa đầy đủ HTML, CSS Tailwind qua CDN, JavaScript tương tác và dữ liệu JSON đầy đủ) cho trang web:
"Cẩm Nang Thực Hành Nấu Ăn & Quản Lý Ngân Sách: Thực Đơn Eat Clean Tuần 1 — 42 Suất Ăn Đủ Chất Chỉ Với 885.000 Đồng".

Trang web phải bao gồm đầy đủ 6 phân khu tương tác sau với hình ảnh minh họa sinh động:

### PHÂN KHU 1: HERO BANNER & THANH ĐIỀU KHIỂN KHẨU PHẦN (Từ Slide 01)
- Tiêu đề lớn, phụ đề giới thiệu nguyên tắc cốt lõi: "Nấu 1 lần vào buổi tối cho 4 suất (Tối hôm nay + Trưa hôm sau) giúp giải phóng hoàn toàn thời gian nấu bữa trưa từ Thứ Ba đến Chủ Nhật, sử dụng 100% nguyên liệu tươi tự nhiên tại chợ dân sinh".
- 5 thẻ KPI trực quan:
  1. Quy mô phục vụ: 2 người lớn • 7 ngày (21 bữa = 42 suất ăn)
  2. Ngân sách trần/tuần: 1.000.000 đồng (4.000.000 đồng/tháng)
  3. Tổng dự toán đi chợ: 885.000 đồng (Trong ngân sách)
  4. Quỹ dự phòng còn lại: 115.000 đồng (11,5% ngân sách tuần)
  5. Cấu trúc nguyên liệu chính cả tuần: 3,3 kg thịt/cá • 1,6 kg đậu hũ • 20 trứng • 2,4 kg gạo • 6,0 kg rau củ • 2,5 kg trái cây.
- TÍNH NĂNG ĐẶC BIỆT: Thêm thanh công cụ chuyển đổi khẩu phần [1 Người (21 suất)] | [2 Người - Chuẩn (42 suất)] | [4 Người (84 suất)]. Khi người dùng bấm đổi, mọi định lượng nguyên liệu và chi phí trên trang tự động tính toán lại theo tỷ lệ tương ứng!

### PHÂN KHU 2: MA TRẬN THỰC ĐƠN 7 NGÀY TƯƠNG TÁC (Từ Slide 02)
- Hiển thị các tab chọn từng ngày (Thứ Hai -> Chủ Nhật) và chế độ "Xem toàn bộ 7 ngày".
- Mỗi ngày hiển thị 3 thẻ: Bữa sáng (Khẩu phần 2 người), Bữa trưa (2 suất mang đi/ăn tại nhà), Bữa tối (Nấu mẻ 4 suất cho Tối + Trưa mai).
- Có mũi tên/nhãn liên kết trực quan chỉ rõ dòng chảy Meal Prep: Bữa tối Thứ Hai nấu 4 suất -> trích 2 suất sang hộp trưa Thứ Ba (tương tự từ Thứ Ba đến Chủ Nhật).
- Kèm 2 hộp ghi chú nổi bật: "Nguyên tắc định lượng gạo & tinh bột (160g gạo khô/bữa 2 người, 320g/mẻ 4 suất, tổng tuần 2.400g gạo)" và "Nguyên tắc cân nguyên liệu tươi & linh hoạt khẩu phần (6kg rau gồm 5,7kg trong món + 300g dưa leo ăn kèm; tráng miệng chuối, ổi)".

### PHÂN KHU 3: DANH SÁCH ĐI CHỢ TƯƠNG TÁC & BIỂU ĐỒ NGÂN SÁCH 885.000Đ (Từ Slide 03)
- Cột trái: Bảng danh sách đi chợ chia theo 6 nhóm thực phẩm (Đạm, Tinh bột, Rau củ, Trái cây, Sữa & lạc, Gia vị) gồm đầy đủ 10 dòng nguyên liệu, Lượng mua, Đơn giá, Thành tiền và Cách chia trong tuần đúng từng chữ như Slide 03.
- TÍNH NĂNG TƯƠNG TÁC: Mỗi dòng nguyên liệu có nút Checkbox "Đã mua". Khi người dùng đánh dấu, thanh tiến trình ngân sách sẽ cộng dồn số tiền đã chi, số tiền còn lại trong dự toán 885.000đ và lưu vào `localStorage`. Có nút "Lọc theo nhóm" và "Đặt lại giỏ hàng".
- Cột phải:
  + Biểu đồ ngang (Chart.js hoặc thanh CSS động) thể hiện Cơ Cấu Ngân Sách Tuần 1 trên trần 1.000.000đ: Đạm 423.000đ (42,3% trần / 47,8% chi phí đi chợ), Rau củ 150.000đ (15,0%), Tinh bột 140.000đ (14,0%), Dự phòng 115.000đ (11,5%), Dầu ăn & gia vị 75.000đ (7,5%), Trái cây 50.000đ (5,0%), Sữa không đường & lạc sống 47.000đ (4,7%).
  + Thẻ "Chiến lược ứng phó khi giá chợ biến động" (Ưu tiên quỹ dự phòng 115.000đ; Hoán đổi 600g heo nạc vai 90.000đ sang 600g ức gà 54.000đ tiết kiệm ngay 36.000đ; Nguyên tắc bất di bất dịch không cắt bữa hoặc bỏ đạm).

### PHÂN KHU 4: TIMELINE SƠ CHẾ 90 PHÚT CHỦ NHẬT & NHỊP NẤU 20–30 PHÚT MỖI TỐI (Từ Slide 04)
- Thiết kế giao diện Step-by-Step Timeline tương tác có nút tích hoàn thành từng bước và bộ bấm giờ (Timer) 90 phút thực hành:
  1. Chủ Nhật • 0–15 phút (Thiết lập an toàn: tủ lạnh ≤4°C, ngăn đá ≤-18°C, hộp nông nắp kín, tách thớt sống/chín).
  2. Chủ Nhật • 15–35 phút (Chia khẩu phần đạm: 1,5kg ức gà chia 300g trưa T2 + 600g tối T2 ngăn mát + 600g tối T6 cấp đông; chia 600g heo và 1,2kg cá cấp đông cho T3, T4).
  3. Chủ Nhật • 35–60 phút (Nấu sẵn trưa T2: 300g gà gừng + 160g gạo + 350g rau cải chia 2 hộp; rang khô 200g lạc sống cất hũ kín cho 7 bữa sáng).
  4. Chủ Nhật • 60–90 phút (Sơ chế rau & cân đồ khô: nhặt rau vẩy ráo nước, cân sẵn 3 phần yến mạch 160g/160g/180g, hấp khoai lang 1–2 ngày).
  5. Mỗi tối T2–T7 • 20–30 phút (Nấu 4 suất, múc riêng 2 suất vào hộp nông trước khi ăn tối; hạ đông thịt/cá ngày mai xuống ngăn mát qua đêm).
  6. Giữa tuần • 15–20 phút (Đi chợ bổ sung 2 mẻ 800g đậu hũ trắng cho T5 & T7, rau lá, trái cây; chia sữa tươi 330/330/340 ml).
- Hộp nổi bật "Mẹo kiểm soát chất lượng nguyên liệu cả tuần": Thứ tự ưu tiên dùng rau lá đầu tuần (cải T2, T5, CN; rau muống T4) và giữ củ quả nguyên miếng cho cuối tuần (bắp cải T3, T7; bí đỏ T2, T6; cà rốt T6, T7, CN).

### PHÂN KHU 5: THƯ VIỆN 11 CÔNG THỨC CHẾ BIẾN CÓ HÌNH ẢNH MINH HỌA SINH ĐỘNG (Từ Slide 05, 06, 07, 08)
- Thiết kế 4 Tab bộ lọc:
  + Tab 1 - Bữa Sáng Nhanh Gọn 5–25 Phút (Slide 05): (1) Yến mạch nấu sữa, chuối & lạc (T2, T4, T6); (2) Khoai lang hấp, trứng luộc & dưa leo (T3, T5, T7); (3) Cháo gạo cà rốt, trứng & lạc rang (Sáng CN). Kèm box "Điểm chung giúp bữa sáng chỉ mất 5–10 phút".
  + Tab 2 - Nhóm Món Ức Gà 1,5 kg Mềm Ẩm Đạt Tâm 74°C (Slide 06): (1) Gà gừng & rau cải luộc (Trưa T2 - 2 suất); (2) Gà áp chảo & bí đỏ hấp (Tối T2 & Trưa T3 - 4 suất); (3) Gà nướng sả, bí đỏ & cà rốt (Tối T6 & Trưa T7 - 4 suất). Kèm box "Bí quyết giữ ức gà mềm ngọt khi hâm lại buổi trưa (thái thớ xiên 1,5–2cm, 10–15ml dầu, châm 2–3 thìa nước nóng đậy nắp đạt tâm 74°C)".
  + Tab 3 - Nhóm Món Hấp Thanh Đạm Giảm Dầu Gần Như Bằng 0 (Slide 07): (1) Nạc vai heo hấp gừng & bắp cải (Tối T3 & Trưa T4 - 4 suất); (2) Cá diêu hồng hấp nguyên con 1,2kg & rau muống (Tối T4 & Trưa T5 - 4 suất). Kèm box "Lưu ý quan trọng khi chia suất mang đi làm (gỡ sạch xương cá ngay sau khi hấp; rưới 1–2 thìa nước hấp gừng giữ ẩm)".
  + Tab 4 - Nhóm Đậu Hũ – Trứng (Slide 08): (1) Đậu hũ sốt cà chua, trứng luộc & cải (Tối T5 & Trưa T6 - 4 suất); (2) Đậu hũ hấp trứng, bắp cải & cà rốt (Tối T7 & Trưa CN - 4 suất); (3) Trứng sốt cà chua & rau cải (Tối CN - 2 suất).
- YÊU CẦU HÌNH ẢNH CHO MỖI MÓN ĂN:
  + Mỗi thẻ món ăn phải có ảnh chụp món ăn sinh động, bố cục hấp dẫn, có nhãn hiển thị "Mẻ 4 suất / 2 suất", "Thời gian nấu", và nút "Xem chi tiết từng bước / Chế độ nấu ăn (Cooking Mode)".
  + Thêm nút nhỏ biểu tượng máy ảnh trên mỗi thẻ ảnh: cho phép người dùng tải ảnh từ máy tính lên (ví dụ ảnh cắt từ file PDF gốc hoặc ảnh món ăn tự nấu) để thay thế trực tiếp trên giao diện!

### PHÂN KHU 6: QUY CHUẨN AN TOÀN THỰC PHẨM USDA FSIS & ĐỊNH MỨC DẦU GIA VỊ (Từ Slide 08)
- 3 thẻ quy chuẩn kỹ thuật bắt buộc:
  1. Làm lạnh nhanh: Chia vào hộp nông, cất tủ lạnh ≤4°C trong vòng 2 giờ sau nấu (hoặc 1 giờ khi nhiệt độ phòng >32°C).
  2. Vận chuyển & Hâm nóng: Túi giữ lạnh có đá gel, cất ngay vào tủ lạnh cơ quan, hâm nóng đều tới nhiệt độ tâm ≥74°C.
  3. Thời hạn bảo quản: Đồ chín ngăn mát tối đa 3–4 ngày (thực đơn ăn ngay hôm sau); gà sống ngăn mát 1–2 ngày, phần cuối tuần cấp đông ≤-18°C từ Chủ Nhật.
- Hộp "Nguyên tắc sử dụng dầu ăn & gia vị Eat Clean": Định mức 10–15 ml dầu/mẻ 4 suất (cả tuần 140–180 ml trên chai 250 ml); gia vị tự nhiên (gừng, tỏi, sả, hành, chanh, muối iốt/nước mắm); tráng miệng 1,0 kg ổi chia ăn sau bữa trưa/tối.
```

## 5. Cách Làm Cho Hình Ảnh Trên Web Sinh Động Nhất (3 Phương Án Thực Tế)

Khi Google AI Studio sinh ra mã nguồn trang web, các thẻ `<img>` trong HTML cần nguồn ảnh thực tế. Bạn có thể chọn 1 trong 3 cách sau (hoặc kết hợp cả 3):

### Phương án A: Tự động hiển thị ngay bằng URL ảnh ẩm thực chất lượng cao (Nhanh nhất)
Trong **Master Prompt** ở Mục 4, AI Studio đã được yêu cầu gắn sẵn link ảnh Unsplash phù hợp với từng món. Nếu có bức ảnh nào bạn muốn đổi cho giống hệt món Việt Nam hơn, hãy gửi câu lệnh nối tiếp này cho AI Studio:

```text
Hãy cập nhật mảng dữ liệu hình ảnh món ăn trong code bằng cơ chế:
1. Gắn kèm hình minh họa SVG/Canvas vẽ trực quan khay chia ngăn (Meal Prep Box) hiển thị tỷ lệ Cơm - Đạm - Rau và nhiệt độ 74°C ngay bên cạnh ảnh chụp món ăn.
2. Cho phép tôi bấm vào bất kỳ ảnh nào để tải ảnh từ máy tính của tôi lên (lưu dưới dạng Base64 trong localStorage) để tôi gắn đúng 5 bức ảnh chụp thực tế từ file PDF của tôi vào.
```

### Phương án B: Dùng chính AI tạo bộ ảnh riêng theo đúng mô tả trong Slide 04–08
Trong file PDF của bạn có 5 cụm ảnh chụp thực tế rất đẹp ở **Slide 04, 05, 06, 07 và 08**. Nếu bạn muốn tạo thêm ảnh mới sắc nét cho từng món riêng lẻ (11 ảnh cho 11 món), bạn có thể dùng công cụ tạo ảnh (Imagen trên AI Studio / Gemini) với các câu lệnh mô tả chuẩn từ file PDF sau:

| Cụm món ăn (Theo Slide) | Prompt tạo ảnh chuẩn (Tỷ lệ 16:9 hoặc 4:3) |
| :--- | :--- |
| **Ảnh Sơ chế Chủ Nhật** *(Slide 04)* | `Top-down editorial food photography of Sunday meal prep on a clean kitchen counter: glass meal prep containers with raw chicken breast divided into 300g and 600g portions, a sealed glass jar of roasted peanuts (200g), bowls of rolled oats, fresh bok choy, cabbage, pumpkin, carrots, garlic and ginger, natural morning light, clean composition, text-free` |
| **Bộ 3 Bữa Sáng** *(Slide 05)* | `Top-down food photography of 3 healthy Vietnamese breakfast dishes on a wooden tray: (1) warm oatmeal bowl with milk, sliced bananas and roasted peanuts; (2) steamed purple/yellow sweet potatoes with hard-boiled eggs cut in half and sliced cucumber; (3) white rice porridge with diced carrots, swirled egg and roasted peanuts, natural lighting, text-free` |
| **Bộ 3 Món Ức Gà** *(Slide 06)* | `Appetizing overhead food photography of 3 healthy chicken breast meal prep dishes with white rice: (1) ginger braised chicken strips with boiled green choy sum; (2) golden pan-seared chicken breast with steamed pumpkin wedges; (3) lemongrass grilled chicken breast with steamed pumpkin and carrot slices, rustic ceramic plates, warm lighting, text-free` |
| **Bộ 2 Món Hấp** *(Slide 07)* | `High-angle food photography of 2 traditional Vietnamese steamed healthy dishes: on the left, thinly sliced lean pork shoulder steamed with julienned ginger and scallions served with steamed cabbage; on the right, a whole 1.2kg red tilapia steamed with lemongrass, ginger and scallions alongside boiled morning glory greens, natural light, text-free` |
| **Bộ 3 Món Đậu Hũ & Trứng** *(Slide 08)* | `Overhead food photography of healthy vegetarian protein dishes: on the left, golden tofu cubes simmered in fresh diced tomato sauce with hard-boiled eggs and scallions; on the right, steamed mashed tofu and egg loaf topped with scallions served with steamed cabbage, carrots and green bok choy, warm home-cooked style, text-free` |

### Phương án C: Trích xuất trực tiếp 5 bức ảnh gốc từ file PDF của bạn
File PDF `Slide_Huong_Dan_Eat_Clean_Tuan_1.pdf` đã có sẵn 5 bức ảnh minh họa gốc ở các trang 1, 4, 5, 6, 7, 8. Với tính năng **"Thay ảnh từ máy của bạn"** đã được cài vào Master Prompt ở Mục 4, ngay khi mở trang web lên, bạn chỉ cần bấm vào khung ảnh của nhóm món tương ứng và chọn ảnh từ máy là trang web sẽ hiển thị y hệt hình trong slide.

## 6. Các Câu Lệnh Prompt Nối Tiếp (Follow-up Prompts) Để Nâng Cấp Web

Sau khi AI Studio trả về bản code đầu tiên, bạn có thể copy từng câu lệnh ngắn dưới đây gửi tiếp vào khung chat để bổ sung các tính năng nâng cao:

* **Nâng cấp 1 — Thêm chế độ "Đứng Bếp Rảnh Tay" (Cooking Mode):**
  > *"Hãy thêm tính năng 'Chế Độ Đứng Bếp (Cooking Mode)': Khi tôi bấm vào 1 trong 11 món ăn, mở ra một màn hình toàn trang chữ to, có bộ bấm giờ đếm ngược tự động theo đúng số phút trong công thức (ví dụ: áp chảo đậy vung 15 phút cho ức gà đạt 74°C, hấp cá diêu hồng 15–25 phút, hấp đậu hũ trứng 15–20 phút) và có âm báo khi hết giờ."*

* **Nâng cấp 2 — Thêm công cụ "Hoán Đổi Ngân Sách Khi Giá Chợ Tăng" (Từ Slide 03):**
  > *"Hãy biến mục 'Chiến lược ứng phó khi giá chợ biến động' ở Slide 03 thành một bảng tính mô phỏng tương tác: Cho phép tôi nhập giá thực tế ngoài chợ hôm nay của từng món, tự động trừ vào Quỹ dự phòng 115.000đ và có nút gợi ý 'Hoán đổi 600g heo nạc vai (90.000đ) sang 600g ức gà (54.000đ) để tiết kiệm ngay 36.000đ' khi giá vượt trần."*

* **Nâng cấp 3 — Xuất danh sách đi chợ ra điện thoại:**
  > *"Hãy thêm nút 'Xuất Danh Sách Đi Chợ Chủ Nhật & Giữa Tuần' để tôi có thể copy nhanh ra Zalo/Notes trên điện thoại hoặc in ra giấy A4, tách riêng đồ mua Chủ Nhật và đồ mua bổ sung Giữa tuần (2 mẻ 800g đậu hũ trắng cho Thứ Năm & Thứ Bảy, rau lá và trái cây theo Slide 04)."*
