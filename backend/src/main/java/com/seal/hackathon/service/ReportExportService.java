package com.seal.hackathon.service;

import com.seal.hackathon.security.AuthenticatedPrincipal;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
public class ReportExportService {

    private final RankingDataProvider rankingDataProvider;

    public ReportExportService(RankingDataProvider rankingDataProvider) {
        this.rankingDataProvider = rankingDataProvider;
    }

    @Transactional(readOnly = true)
    public byte[] exportRankingExcel(UUID roundId, AuthenticatedPrincipal principal) {
        rankingDataProvider.assertCanAccessRanking(roundId, principal);
        List<RankingDataProvider.RankingExportRow> rankings = rankingDataProvider.getRankingsForRound(roundId);

        try (XSSFWorkbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            XSSFSheet sheet = workbook.createSheet("Ranking");
            String[] headers = {"Hạng tổng", "Hạng hạng mục", "Đội thi", "Hạng mục", "Điểm tổng có trọng số", "Thăng vòng"};
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }

            int rowIdx = 1;
            for (RankingDataProvider.RankingExportRow r : rankings) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(r.rankOverall() == null ? 0 : r.rankOverall());
                row.createCell(1).setCellValue(r.rankInTrack() == null ? 0 : r.rankInTrack());
                row.createCell(2).setCellValue(r.teamName() == null ? "" : r.teamName());
                row.createCell(3).setCellValue(r.trackName() == null ? "" : r.trackName());
                row.createCell(4).setCellValue(r.totalWeightedScore() == null ? 0.0 : r.totalWeightedScore());
                row.createCell(5).setCellValue(r.promoted() ? "Có" : "Không");
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new IllegalStateException("Không thể tạo file Excel", e);
        }
    }
}
