#!/usr/bin/env node
/**
 * Sinh docs/CHANGELOG.md từ lịch sử git.
 *
 * Vì sao sinh tự động: repo có 52 pull request đã merge. Chép tay thì vừa lâu
 * vừa sót, và lần sau lại phải chép tiếp từ chỗ dừng — không ai nhớ đã chép
 * tới đâu.
 *
 * Nguồn dữ liệu là các commit merge. Mỗi PR merge để lại một commit dạng
 * "Merge pull request #NN from owner/ten-nhanh", và commit đầu tiên của nhánh
 * đó nói PR làm gì. Script ghép hai thứ lại.
 *
 * Dùng:
 *   node scripts/sinh-changelog.mjs           ghi lại docs/CHANGELOG.md
 *   node scripts/sinh-changelog.mjs --check   kiểm xem file có cũ không
 */

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const GOC = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DICH = resolve(GOC, "docs/CHANGELOG.md");

function git(...args) {
  return execFileSync("git", args, { cwd: GOC, encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
}

/**
 * Xếp một pull request vào nhóm, đoán từ tên nhánh và nội dung commit.
 *
 * Cố ý KHÔNG dùng quy ước Conventional Commits (feat:/fix:/chore:). Nhóm này
 * không viết commit theo quy ước đó — ép vào sẽ ra một bảng phân loại sai mà
 * trông như đúng. Đoán từ từ khoá tiếng Việt trong tên nhánh sát thực tế hơn.
 */
function phanNhom(nhanh, tieu_de) {
  const t = (nhanh + " " + tieu_de).toLowerCase();
  if (/sua|fix|khoi-phuc|loi|hong/.test(t)) return "Sửa lỗi";
  if (/test|kiem-thu|ci\b|workflow|docker|lint/.test(t)) return "Hạ tầng & kiểm thử";
  if (/readme|tai-lieu|doc|changelog|adr|truy-vet/.test(t)) return "Tài liệu";
  if (/css|font|giao-dien|ui|dieu-huong|trang-chu/.test(t)) return "Giao diện";
  if (/xoa|go-bo|remove|jira|don/.test(t)) return "Dọn dẹp";
  return "Tính năng";
}

const THU_TU_NHOM = [
  "Tính năng",
  "Sửa lỗi",
  "Giao diện",
  "Hạ tầng & kiểm thử",
  "Tài liệu",
  "Dọn dẹp",
];

/** Đọc mọi commit merge, lấy số PR, tên nhánh, ngày và mô tả. */
function docCacPullRequest() {
  const raw = git("log", "--merges", "--date=short", "--format=%H%x09%ad%x09%s");
  const ket_qua = [];

  for (const dong of raw.trim().split("\n")) {
    if (!dong) continue;
    const [hash, ngay, tieu_de] = dong.split("\t");
    // Tiêu đề merge trong repo này có HAI dạng, tuỳ người merge bằng nút trên
    // GitHub hay merge tại máy:
    //     Merge pull request #44 from BryannLee202/trang-chu-btc-giam-khao
    //     Merge pull request #38 from man-hinh-nhat-ky        ← không có owner
    // Regex đầu tiên viết ra bắt buộc phải có owner nên chỉ bắt được 18/40 PR.
    // Phần owner giờ để tuỳ chọn.
    const khop = tieu_de.match(/Merge pull request #(\d+) from (?:[^/\s]+\/)?(\S+)/);
    if (!khop) continue;

    const [, so, nhanh] = khop;

    // Lấy commit ĐẦU TIÊN của nhánh — nó nói PR định làm gì.
    //
    // `git log -1 <merge>^2` cho ra commit CUỐI của nhánh, tức là lần sửa vặt
    // sau cùng, thường không mô tả được mục đích của PR. Phải liệt kê những
    // commit chỉ thuộc nhánh (`^2 --not ^1`) rồi lấy dòng cuối danh sách —
    // git in theo thứ tự mới nhất trước.
    let mo_ta = "";
    let tac_gia = "";
    try {
      const danh_sach = git(
        "log", "--format=%s%x09%an", `${hash}^2`, "--not", `${hash}^1`,
      ).trim().split("\n").filter(Boolean);
      if (danh_sach.length) {
        [mo_ta, tac_gia] = danh_sach[danh_sach.length - 1].split("\t");
      }
    } catch {
      // Nhánh đã bị xoá hoặc merge không có cha thứ hai — dùng tên nhánh.
    }
    if (!mo_ta) mo_ta = nhanh.replace(/-/g, " ");

    ket_qua.push({
      so: Number(so),
      nhanh,
      ngay,
      mo_ta: mo_ta || nhanh.replace(/-/g, " "),
      tac_gia: tac_gia || "",
      nhom: phanNhom(nhanh, mo_ta),
    });
  }
  return ket_qua;
}

function sinhMarkdown(prs) {
  // Gom theo tháng, mới nhất lên đầu.
  const theo_thang = new Map();
  for (const pr of prs) {
    const thang = pr.ngay.slice(0, 7);
    if (!theo_thang.has(thang)) theo_thang.set(thang, []);
    theo_thang.get(thang).push(pr);
  }

  const d = [];
  d.push("<!-- FILE NÀY SINH TỰ ĐỘNG — ĐỪNG SỬA TAY -->");
  d.push("<!-- Nguồn: lịch sử git · Sinh lại: node scripts/sinh-changelog.mjs -->");
  d.push("");
  d.push("# Nhật ký thay đổi");
  d.push("");
  d.push(`Tổng hợp **${prs.length} pull request** đã merge vào \`main\`, nhóm theo tháng.`);
  d.push("");
  d.push("> Sinh tự động từ lịch sử git. Sửa file này bằng tay là mất công — lần chạy");
  d.push("> script sau sẽ ghi đè. Muốn một thay đổi hiện đẹp hơn ở đây thì viết tiêu đề");
  d.push("> commit đầu tiên của nhánh cho rõ nghĩa.");
  d.push("");

  for (const [thang, ds] of theo_thang) {
    const [nam, thg] = thang.split("-");
    d.push(`## Tháng ${Number(thg)}/${nam}`);
    d.push("");
    d.push(`*${ds.length} pull request*`);
    d.push("");

    const theo_nhom = new Map();
    for (const pr of ds) {
      if (!theo_nhom.has(pr.nhom)) theo_nhom.set(pr.nhom, []);
      theo_nhom.get(pr.nhom).push(pr);
    }

    for (const nhom of THU_TU_NHOM) {
      const muc = theo_nhom.get(nhom);
      if (!muc) continue;
      d.push(`### ${nhom}`);
      d.push("");
      for (const pr of muc.sort((a, b) => b.so - a.so)) {
        const ai = pr.tac_gia ? ` — ${pr.tac_gia}` : "";
        d.push(`- **#${pr.so}** ${pr.mo_ta}${ai}`);
      }
      d.push("");
    }
  }

  d.push("---");
  d.push("");
  d.push("## Ghi chú về cách phân nhóm");
  d.push("");
  d.push("Nhóm đoán từ từ khoá trong tên nhánh và tiêu đề commit. Cố ý **không** dùng quy");
  d.push("ước Conventional Commits (`feat:` / `fix:` / `chore:`) vì nhóm không viết commit");
  d.push("theo quy ước đó — ép vào sẽ ra một bảng phân loại sai mà trông như đúng.");
  d.push("");
  d.push("Nhóm sai thì sửa hàm `phanNhom()` trong `scripts/sinh-changelog.mjs`, đừng sửa");
  d.push("file markdown này.");
  return d.join("\n") + "\n";
}

const che_do_kiem = process.argv.includes("--check");
const prs = docCacPullRequest();

if (prs.length === 0) {
  console.error("Không đọc được pull request nào từ lịch sử git.");
  process.exit(1);
}

const moi = sinhMarkdown(prs);

if (che_do_kiem) {
  const cu = existsSync(DICH) ? readFileSync(DICH, "utf8") : "";
  if (cu !== moi) {
    console.error("docs/CHANGELOG.md đã cũ so với lịch sử git.");
    console.error("Chạy: node scripts/sinh-changelog.mjs   rồi commit lại.");
    process.exit(1);
  }
  console.log(`docs/CHANGELOG.md khớp với lịch sử git — ${prs.length} pull request.`);
} else {
  writeFileSync(DICH, moi, "utf8");
  console.log(`Đã ghi docs/CHANGELOG.md (${prs.length} pull request).`);
}
