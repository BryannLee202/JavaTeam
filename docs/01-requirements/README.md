# 01 - Quan ly Yeu cau (Requirements)

Thu muc nay luu tru cac tai lieu dac ta yeu cau va ma tran truy xuat cua he thong SHMS:

- srs.md: Tai lieu dac ta yeu cau phan mem (Software Requirements Specification - SRS v1.0) gom 27 Use Cases va 49 bang dac ta.
- SHMS_SRS_v1.0.docx: File dac ta goc Microsoft Word.
- use-cases.yaml: Nguon su that (Source of Truth) chuan hoa 27 Use Cases voi 108 lien ket toi ma nguon thuc te.
- 	raceability-matrix.md: Ma tran truy xuat yeu cau duoc sinh tu dong tu code (UC -> Controller -> Service -> Test -> UI).

## Cong cu Tu dong hoa Traceability

He thong cung cap script tu dong hoa de quan ly va xac thuc tinh toan ven cua ma tran yeu cau:

1. **Sinh ma tran truy xuat Markdown**:
   `ash
   python scripts/traceability.py
   `
2. **Kiem tra do phu va xac thuc su ton tai cua ma nguon (dung trong CI)**:
   `ash
   python scripts/traceability.py --verify
   `
   *Lenh se tra ve exit code 0 neu 100% tep ma nguon va test case ton tai tren dia, tra ve exit code 1 neu phat hien lien ket hong.*
3. **Chay unit test kiem thu cong cu traceability**:
   `ash
   python -m unittest scripts/test_traceability.py
   `
