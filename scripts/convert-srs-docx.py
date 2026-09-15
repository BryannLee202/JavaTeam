#!/usr/bin/env python3
# Script chuyen doi tai lieu dac ta SHMS_SRS_v1.0.docx sang Markdown chuan GitHub Flavored Markdown
# Ho tro giu nguyen tieu de, danh sach, va toan bo cac bang bieu voi dong phan cach hop le.

import sys
import os
import io
import docx

def convert_docx_to_markdown(input_path, output_path):
    if not os.path.exists(input_path):
        print(f'Loi: File {input_path} khong ton tai.', file=sys.stderr)
        sys.exit(1)
        
    doc = docx.Document(input_path)
    lines = []
    table_count = 0
    
    for el in doc.element.body:
        tag = el.tag.split('}')[-1]
        if tag == 'p':
            p = docx.text.paragraph.Paragraph(el, doc)
            text = p.text.strip()
            if not text:
                continue
            style = p.style.name if p.style else ''
            
            if 'Heading 1' in style:
                lines.append(f'\n# {text}\n')
            elif 'Heading 2' in style:
                lines.append(f'\n## {text}\n')
            elif 'Heading 3' in style:
                lines.append(f'\n### {text}\n')
            elif 'Heading 4' in style:
                lines.append(f'\n#### {text}\n')
            elif 'List' in style:
                lines.append(f'- {text}')
            else:
                if text.isupper() and len(text) < 100:
                    lines.append(f'\n### {text}\n')
                else:
                    lines.append(f'{text}\n')
        elif tag == 'tbl':
            tbl = docx.table.Table(el, doc)
            table_count += 1
            rows = tbl.rows
            if not rows:
                continue
            
            md_table = []
            for r_idx, row in enumerate(rows):
                cells = [cell.text.strip().replace('\n', '<br>').replace('|', '\\|') for cell in row.cells]
                row_str = '| ' + ' | '.join(cells) + ' |'
                md_table.append(row_str)
                if r_idx == 0:
                    sep = '| ' + ' | '.join(['---'] * len(cells)) + ' |'
                    md_table.append(sep)
            lines.append('\n' + '\n'.join(md_table) + '\n')
            
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
        
    print(f'Thanh cong: Da chuyen doi {len(lines)} khoi, {table_count} bang sang {output_path}')

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print('Cach dung: python scripts/convert-srs-docx.py <input.docx> <output.md>')
        sys.exit(1)
    convert_docx_to_markdown(sys.argv[1], sys.argv[2])
