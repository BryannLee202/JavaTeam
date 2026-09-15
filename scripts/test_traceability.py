#!/usr/bin/env python3
# Test suite kiem thu bo cong cu scripts/traceability.py

import unittest
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tempfile
import yaml

from traceability import load_use_cases, verify_files, generate_markdown

class TestTraceability(unittest.TestCase):
    def test_load_real_use_cases(self):
        use_cases = load_use_cases('docs/01-requirements/use-cases.yaml')
        self.assertEqual(len(use_cases), 27, 'Phai co du 27 Use Cases')
        
    def test_all_real_files_exist(self):
        use_cases = load_use_cases('docs/01-requirements/use-cases.yaml')
        total_refs, missing = verify_files(use_cases)
        self.assertEqual(total_refs, 108, 'Moi UC co 4 thanh phan -> 108 tep')
        self.assertEqual(len(missing), 0, f'Khong duoc thieu bat ky tep nao: {missing}')
        
    def test_detect_missing_files(self):
        dummy_ucs = [{
            'id': 'UC-99',
            'title': 'Dummy UC',
            'actor': 'Tester',
            'status': 'Done',
            'controller': 'non_existent_file.java',
            'service': 'another_fake_file.java'
        }]
        total_refs, missing = verify_files(dummy_ucs)
        self.assertEqual(total_refs, 2)
        self.assertEqual(len(missing), 2, 'Phai phat hien dung 2 tep khong ton tai')

if __name__ == '__main__':
    unittest.main()
