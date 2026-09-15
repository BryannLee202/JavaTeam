#!/usr/bin/env node
/**
 * Sinh ma trận truy vết yêu cầu từ docs/01-yeu-cau/truy-vet.yml.
 *
 * Hai chế độ:
 *   node scripts/sinh-ma-tran-truy-vet.mjs           ghi lại file markdown
 *   node scripts/sinh-ma-tran-truy-vet.mjs --check   chỉ kiểm, không ghi
 *
 * Chế độ --check dùng trong CI. Nó thoát với mã 1 khi:
 *   1. một đường dẫn bằng chứng khai trong YAML không còn tồn tại
 *   2. file markdown đã cũ so với YAML (ai đó sửa YAML mà quên chạy lại script)
 *   3. một use case khai là "xong" nhưng không có đường dẫn code nào
 *
 * Điều kiện 1 là lý do chính viết script này. Bảng truy vết viết tay luôn mục
 * dần: người ta đổi tên file, gộp class, xoá test — bảng vẫn ghi đường dẫn cũ
 * và vẫn trông như đúng. Ở đây đổi tên file là CI hỏng ngay.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const GOC = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const NGUON = resolve(GOC, "docs/01-yeu-cau/truy-vet.yml");
const DICH = resolve(GOC, "docs/01-yeu-cau/ma-tran-truy-vet.md");

const NHAN_TRANG_THAI = {
  xong: { ky_hieu: "✅", chu: "Xong" },
  mot_phan: { ky_hieu: "⚠️", chu: "Một phần" },
  chua_lam: { ky_hieu: "❌", chu: "Chưa làm" },
};

/**
 * Đọc YAML bằng bộ phân tích tối giản viết riêng cho đúng cấu trúc file này.
 *
 * Không dùng thư viện ngoài để script chạy được bằng Node trần — CI không phải
 * cài thêm gì, và không thêm một phụ thuộc chỉ để đọc một file cấu hình.
 */
function docYaml(duong_dan) {
  const dong = readFileSync(duong_dan, "utf8").split("\n");
  const ket_qua = { meta: {}, use_cases: [] };
  let uc = null;
  let danh_sach_hien_tai = null;
  let khoa_gap = null;

  for (const raw of dong) {
    const line = raw.replace(/\s+$/, "");
    if (!line.trim() || line.trim().startsWith("#")) continue;

    const thut = line.length - line.trimStart().length;
    const noi_dung = line.trim();

    // Bắt đầu một use case mới
    if (noi_dung.startsWith("- id:")) {
      if (uc) ket_qua.use_cases.push(uc);
      uc = { id: noi_dung.slice(5).trim(), code: [], test: [], ghi_chu: "" };
      danh_sach_hien_tai = null;
      khoa_gap = null;
      continue;
    }

    // Phần tử của danh sách code/test
    if (noi_dung.startsWith("- ") && danh_sach_hien_tai && uc) {
      uc[danh_sach_hien_tai].push(noi_dung.slice(2).trim());
      continue;
    }

    const khop = noi_dung.match(/^([a-z_]+):\s*(.*)$/);
    if (!khop) {
      // Dòng nối tiếp của khối chữ nhiều dòng (>-)
      if (khoa_gap && uc && thut > 4) {
        uc[khoa_gap] = (uc[khoa_gap] ? uc[khoa_gap] + " " : "") + noi_dung;
      }
      continue;
    }

    const [, khoa, gia_tri] = khop;

    if (!uc) {
      if (khoa !== "meta" && khoa !== "use_cases") {
        ket_qua.meta[khoa] = gia_tri.replace(/^"|"$/g, "");
      }
      continue;
    }

    khoa_gap = null;
    if (khoa === "code" || khoa === "test") {
      if (gia_tri === "[]") {
        uc[khoa] = [];
        danh_sach_hien_tai = null;
      } else {
        danh_sach_hien_tai = khoa;
      }
    } else {
      danh_sach_hien_tai = null;
      if (gia_tri === ">-" || gia_tri === ">" || gia_tri === "|") {
        uc[khoa] = "";
        khoa_gap = khoa;
      } else {
        uc[khoa] = gia_tri.replace(/^"|"$/g, "");
      }
    }
  }
  if (uc) ket_qua.use_cases.push(uc);
  return ket_qua;
}

/** Kiểm mọi đường dẫn bằng chứng có thật không. Trả về danh sách lỗi. */
function kiemDuongDan(use_cases) {
  const loi = [];
  for (const uc of use_cases) {
    for (const nhom of ["code", "test"]) {
      for (const p of uc[nhom]) {
        if (!existsSync(resolve(GOC, p))) {
          loi.push(`${uc.id}: không tìm thấy ${nhom} "${p}"`);
        }
      }
    }
    if (uc.trang_thai === "xong" && uc.code.length === 0) {
      loi.push(`${uc.id}: khai là "xong" nhưng không có đường dẫn code nào`);
    }
    if (!NHAN_TRANG_THAI[uc.trang_thai]) {
      loi.push(`${uc.id}: trạng thái lạ "${uc.trang_thai}"`);
    }
  }
  return loi;
}

function lienKet(p) {
  const ten = p.split("/").pop();
  return `[\`${ten}\`](../../${p})`;
}

function sinhMarkdown(du_lieu) {
  const { meta, use_cases } = du_lieu;
  const dem = { xong: 0, mot_phan: 0, chua_lam: 0 };
  let co_test = 0;
  for (const uc of use_cases) {
    dem[uc.trang_thai] += 1;
    if (uc.test.length > 0) co_test += 1;
  }
  const phan_tram = ((co_test / use_cases.length) * 100).toFixed(0);

  const d = [];
  d.push("<!-- FILE NÀY SINH TỰ ĐỘNG — ĐỪNG SỬA TAY -->");
  d.push(`<!-- Nguồn: docs/01-yeu-cau/truy-vet.yml · Sinh lại: node scripts/sinh-ma-tran-truy-vet.mjs -->`);
  d.push("");
  d.push("# Ma trận truy vết yêu cầu");
  d.push("");
  d.push(`Ánh xạ từng use case trong [SRS](./SRS.md) sang **file code và file test thật**`);
  d.push("thực hiện nó.");
  d.push("");
  d.push("> Bảng này **sinh tự động** từ [`truy-vet.yml`](./truy-vet.yml). Sửa file YAML rồi");
  d.push("> chạy `node scripts/sinh-ma-tran-truy-vet.mjs`, đừng sửa thẳng vào đây.");
  d.push(">");
  d.push("> CI chạy script với cờ `--check` ở mỗi lần push. **Đổi tên hoặc xoá một file");
  d.push("> bằng chứng là CI hỏng ngay** — nhờ vậy bảng không thể mục dần mà không ai biết.");
  d.push("");
  d.push(`Kiểm lần cuối: **${meta.kiem_lan_cuoi}**`);
  d.push("");
  d.push("## Tổng kết");
  d.push("");
  d.push("| | Số lượng | Tỷ lệ |");
  d.push("| --- | --- | --- |");
  for (const [khoa, nhan] of Object.entries(NHAN_TRANG_THAI)) {
    const n = dem[khoa];
    d.push(`| ${nhan.ky_hieu} ${nhan.chu} | ${n} | ${((n / use_cases.length) * 100).toFixed(0)}% |`);
  }
  d.push(`| **Tổng use case** | **${use_cases.length}** | |`);
  d.push(`| Có ít nhất một test | ${co_test} | ${phan_tram}% |`);
  d.push("");

  // Nhóm theo module, giữ thứ tự xuất hiện
  const theo_module = new Map();
  for (const uc of use_cases) {
    if (!theo_module.has(uc.module)) theo_module.set(uc.module, []);
    theo_module.get(uc.module).push(uc);
  }

  for (const [module, ds] of theo_module) {
    d.push(`## ${module}`);
    d.push("");
    d.push("| UC | Tên | Trạng thái | Code | Test |");
    d.push("| --- | --- | --- | --- | --- |");
    for (const uc of ds) {
      const nhan = NHAN_TRANG_THAI[uc.trang_thai];
      const code = uc.code.length ? uc.code.map(lienKet).join("<br>") : "—";
      const test = uc.test.length ? uc.test.map(lienKet).join("<br>") : "*chưa có*";
      d.push(`| ${uc.id} | ${uc.ten} | ${nhan.ky_hieu} ${nhan.chu} | ${code} | ${test} |`);
    }
    d.push("");
    const co_ghi_chu = ds.filter((uc) => uc.ghi_chu);
    if (co_ghi_chu.length) {
      for (const uc of co_ghi_chu) {
        d.push(`> **${uc.id}** — ${uc.ghi_chu}`);
        d.push("");
      }
    }
  }

  d.push("---");
  d.push("");
  d.push("## Vì sao sinh tự động thay vì viết tay");
  d.push("");
  d.push("Bảng truy vết viết tay luôn mục dần. Người ta đổi tên class, gộp file, xoá test —");
  d.push("bảng vẫn ghi đường dẫn cũ và vẫn **trông như đúng**. Càng lâu càng sai, mà không");
  d.push("có tín hiệu nào báo.");
  d.push("");
  d.push("Ở đây nguồn sự thật là file YAML, và CI kiểm ba điều ở mỗi lần push:");
  d.push("");
  d.push("1. mọi đường dẫn bằng chứng phải tồn tại thật");
  d.push("2. file markdown phải khớp với YAML (không ai sửa YAML rồi quên chạy lại script)");
  d.push("3. use case khai là \"xong\" thì phải có ít nhất một đường dẫn code");
  d.push("");
  d.push("Đổi tên một file là CI đỏ ngay lần push kế tiếp.");
  return d.join("\n") + "\n";
}

// ---------------------------------------------------------------------------

const che_do_kiem = process.argv.includes("--check");
const du_lieu = docYaml(NGUON);

const loi = kiemDuongDan(du_lieu.use_cases);
if (loi.length) {
  console.error("Ma trận truy vết có vấn đề:\n");
  for (const l of loi) console.error("  ✗ " + l);
  console.error(`\n${loi.length} lỗi. Sửa docs/01-yeu-cau/truy-vet.yml cho khớp với code hiện tại.`);
  process.exit(1);
}

const moi = sinhMarkdown(du_lieu);

if (che_do_kiem) {
  const cu = existsSync(DICH) ? readFileSync(DICH, "utf8") : "";
  if (cu !== moi) {
    console.error("docs/01-yeu-cau/ma-tran-truy-vet.md đã cũ so với truy-vet.yml.");
    console.error("Chạy: node scripts/sinh-ma-tran-truy-vet.mjs   rồi commit lại.");
    process.exit(1);
  }
  console.log(`Ma trận truy vết hợp lệ — ${du_lieu.use_cases.length} use case, mọi đường dẫn đều tồn tại.`);
} else {
  writeFileSync(DICH, moi, "utf8");
  console.log(`Đã ghi docs/01-yeu-cau/ma-tran-truy-vet.md (${du_lieu.use_cases.length} use case).`);
}
