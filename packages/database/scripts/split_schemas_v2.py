#!/usr/bin/env python3
"""
Schema SQL File Splitter - Version 2
Splits monolithic schema SQL files into individual table files.
"""

import re
from pathlib import Path
from typing import List, Tuple

BASE_DIR = Path("/home/itjee/workspace/cxg/packages/database/schemas/manager")

SCHEMAS = [
    ("tnnt", "01"), ("idam", "02"), ("bill", "03"), ("ifra", "04"),
    ("stat", "05"), ("mntr", "06"), ("intg", "07"), ("supt", "08"),
    ("audt", "09"), ("auto", "10"), ("cnfg", "11"),
]


def extract_schema_init(lines: List[str], schema_code: str) -> List[str]:
    """Extract CREATE SCHEMA and COMMENT ON SCHEMA."""
    result = []
    i = 0
    while i < len(lines):
        line = lines[i]
        # Find CREATE SCHEMA line
        if f'CREATE SCHEMA IF NOT EXISTS {schema_code}' in line:
            result.append(line)
            i += 1
            # Look for following lines (empty line, COMMENT ON SCHEMA)
            while i < len(lines):
                if f'COMMENT ON SCHEMA {schema_code}' in line:
                    result.append(lines[i])
                    i += 1
                    # Get the IS '...' line
                    if i < len(lines) and lines[i].strip().startswith("IS '"):
                        result.append(lines[i])
                    break
                elif lines[i].strip() == '':
                    result.append(lines[i])
                    i += 1
                else:
                    i += 1
            break
        i += 1
    return result


def find_table_blocks(lines: List[str], schema_code: str) -> List[Tuple[str, int, int]]:
    """
    Find all table blocks and their line ranges.
    Returns: [(table_name, start_line, end_line), ...]
    """
    tables = []
    i = 0

    while i < len(lines):
        line = lines[i]

        # Match CREATE TABLE line
        match = re.match(rf'^CREATE TABLE IF NOT EXISTS {schema_code}\.(\w+)', line)
        if match:
            table_name = match.group(1)
            start_line = i

            # Find end of this table's complete definition
            # We need to capture: CREATE TABLE + all COMMENTs + all INDEXes
            end_line = find_table_end(lines, i, schema_code, table_name)

            tables.append((table_name, start_line, end_line))
            i = end_line + 1
        else:
            i += 1

    return tables


def find_table_end(lines: List[str], start: int, schema_code: str, table_name: str) -> int:
    """Find the end line of a complete table definition including comments and indexes."""
    i = start
    found_table_end = False
    found_comments = False
    last_relevant_line = start

    while i < len(lines):
        line = lines[i]

        # Table definition ends with );
        if not found_table_end and line.strip() == ');':
            found_table_end = True
            last_relevant_line = i
            i += 1
            continue

        # After table def, look for COMMENT ON TABLE/COLUMN
        if found_table_end and not found_comments:
            if re.search(rf'COMMENT ON (TABLE|COLUMN)\s+{schema_code}\.{table_name}', line):
                last_relevant_line = i
                found_comments = True
            elif line.strip().startswith("IS '"):
                last_relevant_line = i

        # Look for indexes on this table
        if found_table_end:
            if re.search(rf'CREATE (UNIQUE )?INDEX.*ON {schema_code}\.{table_name}', line):
                last_relevant_line = i
            elif last_relevant_line < i - 1 and re.match(r'^\s+(WHERE|ON )', line):
                # Continuation of previous index
                last_relevant_line = i
            elif re.match(rf'^CREATE TABLE IF NOT EXISTS {schema_code}\.', line):
                # Hit next table, stop here
                break
            elif re.match(r'^CREATE (OR REPLACE )?(VIEW|FUNCTION)', line):
                # Hit views/functions section, stop here
                break

        i += 1

    return last_relevant_line


def extract_table_content(lines: List[str], start: int, end: int) -> str:
    """Extract lines for a table, removing excessive blank lines."""
    content_lines = []
    prev_blank = False

    for i in range(start, end + 1):
        line = lines[i]
        is_blank = line.strip() == ''

        # Skip consecutive blank lines
        if is_blank and prev_blank:
            continue

        content_lines.append(line)
        prev_blank = is_blank

    # Clean up trailing blank lines
    while content_lines and content_lines[-1].strip() == '':
        content_lines.pop()

    return '\n'.join(content_lines) + '\n'


def extract_views_functions(lines: List[str], start_after: int) -> str | None:
    """Extract views and functions starting from a given line."""
    result = []
    capturing = False

    for i in range(start_after, len(lines)):
        line = lines[i]

        if re.match(r'^CREATE (OR REPLACE )?(VIEW|FUNCTION)', line):
            capturing = True

        if capturing:
            result.append(line)

    if result:
        # Clean up
        while result and result[-1].strip() == '':
            result.pop()
        return '\n'.join(result) + '\n'

    return None


def process_schema(schema_code: str, dir_num: str) -> int:
    """Process one schema file and split it into table files."""
    source_file = BASE_DIR / f"{schema_code}.sql"
    target_dir = BASE_DIR / f"{dir_num}_{schema_code}"

    if not source_file.exists():
        print(f"  ⚠️  {schema_code}.sql not found, skipping")
        return 0

    print(f"\n📁 Processing {schema_code}.sql...")

    # Read source
    with open(source_file, 'r', encoding='utf-8') as f:
        content = f.read()

    lines = content.split('\n')

    # Create target directory
    target_dir.mkdir(exist_ok=True)

    file_count = 0

    # 1. Schema init
    schema_init_lines = extract_schema_init(lines, schema_code)
    if schema_init_lines:
        init_content = '\n'.join(schema_init_lines) + '\n'
        (target_dir / "00_schema_init.sql").write_text(init_content, encoding='utf-8')
        print(f"  ✅ 00_schema_init.sql")
        file_count += 1

    # 2. Find all tables
    tables = find_table_blocks(lines, schema_code)

    if not tables:
        print(f"  ⚠️  No tables found in {schema_code}.sql")
        return file_count

    # 3. Extract each table
    for idx, (table_name, start, end) in enumerate(tables, start=1):
        table_content = extract_table_content(lines, start, end)
        filename = f"{idx:02d}_{table_name}.sql"
        (target_dir / filename).write_text(table_content, encoding='utf-8')
        print(f"  ✅ {filename}")
        file_count += 1

    # 4. Extract views/functions if present
    last_table_end = tables[-1][2] if tables else 0
    views_content = extract_views_functions(lines, last_table_end + 1)
    if views_content:
        filename = f"{len(tables)+1:02d}_views_functions.sql"
        (target_dir / filename).write_text(views_content, encoding='utf-8')
        print(f"  ✅ {filename}")
        file_count += 1

    return file_count


def generate_report(all_counts: dict) -> str:
    """Generate final reorganization report."""
    lines = []
    lines.append("=" * 80)
    lines.append("MANAGER SCHEMA REORGANIZATION REPORT")
    lines.append("=" * 80)
    lines.append("")

    total_files = sum(all_counts.values())
    lines.append(f"Total Schemas Processed: {len(all_counts)}")
    lines.append(f"Total Files Created: {total_files}")
    lines.append("")
    lines.append("Breakdown by Schema:")
    lines.append("")

    for schema_code, dir_num in SCHEMAS:
        count = all_counts.get(schema_code, 0)
        target_dir = BASE_DIR / f"{dir_num}_{schema_code}"
        lines.append(f"  {dir_num}_{schema_code}/ - {count} files")

        if target_dir.exists():
            files = sorted(target_dir.glob("*.sql"))
            for f in files:
                lines.append(f"    - {f.name}")
        lines.append("")

    lines.append("=" * 80)
    lines.append("Location: /packages/database/schemas/manager/")
    lines.append("=" * 80)

    return '\n'.join(lines)


def main():
    print("=" * 80)
    print("MANAGER SCHEMA REORGANIZATION - Starting")
    print("=" * 80)

    all_counts = {}

    for schema_code, dir_num in SCHEMAS:
        count = process_schema(schema_code, dir_num)
        all_counts[schema_code] = count

    # Generate report
    report = generate_report(all_counts)
    report_file = BASE_DIR / "REORGANIZATION_REPORT.txt"
    report_file.write_text(report, encoding='utf-8')

    print("\n" + "=" * 80)
    print("✅ REORGANIZATION COMPLETE")
    print(f"📊 Total files created: {sum(all_counts.values())}")
    print(f"📄 Report: {report_file}")
    print("=" * 80)


if __name__ == "__main__":
    main()
