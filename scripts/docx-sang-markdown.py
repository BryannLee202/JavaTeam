#!/usr/bin/env python3
"""
Chuyển tài liệu Word (.docx) sang Markdown, giữ nguyên bảng.

Vì sao cần script thay vì chép tay: SRS có 208 đoạn và 49 bảng. Chép tay thì
vừa lâu vừa sai, mà mỗi lần tài liệu Word cập nhật lại phải chép lại từ đầu.
Có script thì chạy lại một lệnh là xong.

Cách dùng:
    python3 scripts/docx-sang-markdown.py <file.docx> <file.md>

Phụ thuộc: python-docx  (pip install python-docx)
"""

import sys
from pathlib import Path

try:
    from docx import Document
    from docx.oxml.ns import qn
    from docx.table import Table
    from docx.text.paragraph import Paragraph
except ImportError:
    sys.exit("Thiếu thư viện python-docx. Chạy: pip install python-docx")


def duyet_theo_thu_tu(doc):
    """
    Trả về đoạn văn và bảng theo ĐÚNG thứ tự xuất hiện trong tài liệu.

    doc.paragraphs và doc.tables là hai danh sách riêng, ghép lại sẽ mất thứ tự
    — bảng bị dồn hết xuống cuối. Phải duyệt thẳng cây XML mới giữ được đúng
    chỗ của từng bảng.
    """
    for child in doc.element.body.iterchildren():
        if child.tag == qn("w:p"):
            yield Paragraph(child, doc)
        elif child.tag == qn("w:tbl"):
            yield Table(child, doc)


def ten_style(doan):
    """Tên style của đoạn. Word có thể để trống style, khi đó trả về chuỗi rỗng."""
    return doan.style.name if doan.style is not None else ""


def thoat_o_bang(text):
    """
    Làm sạch nội dung một ô để nhét vừa một dòng bảng Markdown.

    Dấu | trong nội dung sẽ cắt bảng thành sai số cột, còn xuống dòng thì phá
    luôn cấu trúc bảng — nên thay bằng <br> và escape dấu gạch đứng.
    """
    return text.strip().replace("|", "\\|").replace("\n", "<br>")


def bang_sang_markdown(bang):
    """
    Đổi một bảng Word thành bảng Markdown.

    Dòng đầu luôn coi là dòng tiêu đề và LUÔN in dòng phân cách |---|---| ngay
    sau. Thiếu dòng này thì GitHub không render ra bảng mà đổ ra một khối chữ
    dính liền.
    """
    dong = []
    for chi_so, row in enumerate(bang.rows):
        o = [thoat_o_bang(cell.text) for cell in row.cells]
        dong.append("| " + " | ".join(o) + " |")
        if chi_so == 0:
            dong.append("|" + "|".join([" --- "] * len(o)) + "|")
    return dong


def chuyen(duong_dan_docx, duong_dan_md):
    doc = Document(duong_dan_docx)
    ket_qua = []
    trong_danh_sach = False

    for khoi in duyet_theo_thu_tu(doc):
        if isinstance(khoi, Table):
            ket_qua.append("")
            ket_qua.extend(bang_sang_markdown(khoi))
            ket_qua.append("")
            trong_danh_sach = False
            continue

        text = khoi.text.strip()
        if not text:
            continue

        style = ten_style(khoi)

        if style.startswith("Heading"):
            try:
                muc = int(style.split()[-1])
            except ValueError:
                muc = 2
            # Dịch xuống một mức: tiêu đề chính của file là H1 do script đặt,
            # nên "Heading 1" của Word thành "##".
            ket_qua.append("")
            ket_qua.append("#" * min(muc + 1, 6) + " " + text)
            ket_qua.append("")
            trong_danh_sach = False

        elif style == "List Paragraph":
            if not trong_danh_sach:
                ket_qua.append("")
                trong_danh_sach = True
            ket_qua.append("- " + text)

        else:
            if trong_danh_sach:
                ket_qua.append("")
                trong_danh_sach = False
            ket_qua.append(text)
            ket_qua.append("")

    # Gộp các dòng trống liên tiếp thành một
    sach = []
    for dong in ket_qua:
        if dong == "" and sach and sach[-1] == "":
            continue
        sach.append(dong)

    Path(duong_dan_md).write_text("\n".join(sach).strip() + "\n", encoding="utf-8")
    return len(sach)


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    so_dong = chuyen(sys.argv[1], sys.argv[2])
    print(f"Đã ghi {sys.argv[2]} ({so_dong} dòng)")
