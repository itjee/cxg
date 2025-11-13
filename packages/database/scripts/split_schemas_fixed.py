#!/usr/bin/env python3
"""
Schema SQL File Splitter - Fixed Version
Properly handles multiline COMMENT ON SCHEMA statements.
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


def extract_schema_init(lines: List[str], schema_code: str) -> str:
    """Extract CREATE SCHEMA and COMMENT ON SCHEMA (handles multiline)."""
    result = []
    i = 0
    found_create = False
    in_comment = False

    while i < len(lines):
        line = lines[i]

        # Find CREATE SCHEMA line
        if f'CREATE SCHEMA IF NOT EXISTS {schema_code}' in line:
            result.append(line)
            found_create = True

        # Find COMMENT ON SCHEMA
        elif found_create and f'COMMENT ON SCHEMA {schema_code}' in line:
            result.append('')  # Add blank line before comment
            result.append(line)
            in_comment = True

        # Capture the IS '...' part (may be multiline)
        elif in_comment:
            if line.strip().startswith("IS '"):
                result.append(line)
                # Check if comment ends on this line
                if line.strip().endswith("';"):
                    break
            elif "'" in line and line.strip().endswith("';"):
                # Continuation line that ends the comment
                result.append(line)
                break

        i += 1

    return '\n'.join(result) + '\n'


def find_table_blocks(lines: List[str], schema_code: str) -> List[Tuple[str, int, int]]:
    """Find all table blocks and their line ranges."""
    tables = []
    i = 0

    while i < len(lines):
        line = lines[i]
        match = re.match(rf'^CREATE TABLE IF NOT EXISTS {schema_code}\.(\w+)', line)

        if match:
            table_name = match.group(1)
            start_line = i
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
    last_relevant_line = start
    in_index_block = False

    while i < len(lines):
        line = lines[i].rstrip()

        # Table definition ends with );
        if not found_table_end and line == ');':
            found_table_end = True
            last_relevant_line = i
            i += 1
            continue

        if found_table_end:
            # COMMENT ON TABLE or COLUMN
            if re.search(rf'COMMENT ON (TABLE|COLUMN)\s+{schema_code}\.{table_name}', line):
                last_relevant_line = i
                in_index_block = False

            # Multiline IS statement
            elif line.strip().startswith("IS '"):
                last_relevant_line = i

            # Index on this table
            elif re.match(r'^CREATE (UNIQUE )?INDEX', line):
                if f'{schema_code}.{table_name}' in line or f'ON {schema_code}.{table_name}' in ' '.join(lines[i:min(i+5, len(lines))]):
                    last_relevant_line = i
                    in_index_block = True
                else:
                    # Index for different table, stop
                    break

            # Index continuation lines (WHERE, etc)
            elif in_index_block and (line.strip().startswith('WHERE') or line.strip().startswith('ON ') or line.strip().startswith('USING')):
                last_relevant_line = i

            # Next table or view/function
            elif re.match(rf'^CREATE TABLE IF NOT EXISTS {schema_code}\.', line) or re.match(r'^CREATE (OR REPLACE )?(VIEW|FUNCTION)', line):
                break

            # Empty line followed by CREATE = end of this table's section
            elif not line.strip():
                # Peek ahead
                if i + 1 < len(lines) and re.match(r'^(CREATE TABLE|CREATE (OR REPLACE )?(VIEW|FUNCTION)|--\s*====)', lines[i + 1]):
                    break
            else:
                # Likely still part of comments or indexes
                if line.strip() and not line.strip().startswith('--'):
                    # Check if it's a multiline continuation
                    pass

        i += 1

    return last_relevant_line


def extract_table_content(lines: List[str], start: int, end: int) -> str:
    """Extract lines for a table with minimal cleanup."""
    content_lines = []

    for i in range(start, end + 1):
        content_lines.append(lines[i].rstrip())

    # Remove trailing blank lines
    while content_lines and not content_lines[-1].strip():
        content_lines.pop()

    # Remove excessive leading blank lines
    while content_lines and not content_lines[0].strip():
        content_lines.pop(0)

    return '\n'.join(content_lines) + '\n'


def extract_views_functions(lines: List[str], start_after: int) -> str | None:
    """Extract views and functions starting from a given line."""
    result = []
    capturing = False

    for i in range(start_after, len(lines)):
        line = lines[i].rstrip()

        if re.match(r'^CREATE (OR REPLACE )?(VIEW|FUNCTION|TRIGGER)', line):
            capturing = True

        if capturing:
            result.append(line)

    if result:
        # Clean up
        while result and not result[-1].strip():
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
    schema_init = extract_schema_init(lines, schema_code)
    if schema_init.strip():
        (target_dir / "00_schema_init.sql").write_text(schema_init, encoding='utf-8')
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
