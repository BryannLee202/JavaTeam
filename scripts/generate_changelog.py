#!/usr/bin/env python3
# Script trich xuat lich su Pull Request tu git log va tao ban nhap CHANGELOG

import subprocess
import re
import sys

def get_merge_commits():
    cmd = ['git', 'log', '--merges', '--oneline']
    output = subprocess.check_output(cmd, text=True, encoding='utf-8', errors='ignore')
    prs = []
    for line in output.splitlines():
        m = re.search(r'([a-f0-9]+)\s+Merge pull request #(\d+)\s+from\s+([^\s]+)(.*)', line)
        if m:
            commit_hash = m.group(1)
            pr_num = m.group(2)
            branch = m.group(3)
            extra = m.group(4).strip()
            prs.append({
                'hash': commit_hash,
                'pr': int(pr_num),
                'branch': branch,
                'desc': extra
            })
    return prs

def main():
    prs = get_merge_commits()
    print(f'Tong hop duoc {len(prs)} Pull Requests tu git history.')
    for pr in prs[:10]:
        print(f"  - PR #{pr['pr']}: [{pr['branch']}] {pr['desc']}")

if __name__ == '__main__':
    main()
