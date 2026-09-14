package com.seal.hackathon.service;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.StringWriter;
import java.util.List;
import java.util.UUID;

@Service
public class RblExportService {

    private final RblDataProvider rblDataProvider;

    public RblExportService(RblDataProvider rblDataProvider) {
        this.rblDataProvider = rblDataProvider;
    }

    @Transactional(readOnly = true)
    public String exportAnonymizedCsv(UUID roundId) {
        List<RblDataProvider.RblScoreRecord> records = rblDataProvider.getRblScores(roundId);

        StringWriter writer = new StringWriter();
        try (CSVPrinter printer = new CSVPrinter(writer, CSVFormat.DEFAULT.builder()
                .setHeader("judge_alias", "judge_type", "judge_calibrated", "submission_alias", "criterion_name", "score_value")
                .build())) {

            for (RblDataProvider.RblScoreRecord record : records) {
                printer.printRecord(
                        record.judgeAlias(),
                        record.judgeType() == null ? "" : record.judgeType(),
                        record.judgeCalibrated(),
                        record.submissionAlias(),
                        record.criterionName(),
                        record.scoreValue()
                );
            }
        } catch (IOException e) {
            throw new IllegalStateException("Không thể tạo file CSV", e);
        }
        return writer.toString();
    }
}
