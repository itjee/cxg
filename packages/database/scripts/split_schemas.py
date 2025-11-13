#!/usr/bin/env python3
"""
Script to split monolithic schema SQL files into individual table files.
Extracts CREATE SCHEMA, CREATE TABLE, COMMENT ON, and CREATE INDEX statements.
"""

import re
from pathlib import Path
from typing import List, Tuple, Dict

# Base directory
BASE_DIR = Path("/home/itjee/workspace/cxg/packages/database/schemas/manager")

# Schema configurations: (schema_code, directory_number, schema_name)
SCHEMAS = [
    ("tnnt", "01", "Tenant Management"),
    ("idam", "02", "Identity & Access Management"),
    ("bill", "03", "Billing"),
    ("ifra", "04", "Infrastructure"),
    ("stat", "05", "Statistics"),
    ("mntr", "06", "Monitoring"),
    ("intg", "07", "Integration"),
    ("supt", "08", "Support"),
    ("audt", "09", "Audit"),
    ("auto", "10", "Automation"),
    ("cnfg", "11", "Configuration"),
]


def extract_schema_init(content: str, schema_code: str) -> str:
    """Extract CREATE SCHEMA statement and its COMMENT."""
    lines = content.split('\n')
    result_lines = []
    in_schema_section = False

    for line in lines:
        # Look for CREATE SCHEMA
        if f'CREATE SCHEMA IF NOT EXISTS {schema_code}' in line:
            in_schema_section = True
            result_lines.append(line)
        elif in_schema_section:
            # Get COMMENT ON SCHEMA
            if f'COMMENT ON SCHEMA {schema_code}' in line:
                result_lines.append(line)
            elif line.strip().startswith("IS '"):
                result_lines.append(line)
                break
            elif line.strip():
                result_lines.append(line)

    return '\n'.join(result_lines) + '\n'


def extract_table_blocks(content: str, schema_code: str) -> List[Tuple[str, str]]:
    """
    Extract individual table blocks with their associated comments and indexes.
    Returns list of (table_name, sql_content) tuples.
    """
    lines = content.split('\n')
    tables = []
    current_table = None
    current_lines = []
    in_table_def = False
    in_comment_section = False
    in_index_section = False

    i = 0
    while i < len(lines):
        line = lines[i]

        # Start of CREATE TABLE
        if re.match(rf'CREATE TABLE IF NOT EXISTS {schema_code}\.(\w+)', line):
            # Save previous table if exists
            if current_table and current_lines:
                tables.append((current_table, '\n'.join(current_lines)))

            # Start new table
            match = re.search(rf'{schema_code}\.(\w+)', line)
            current_table = match.group(1)
            current_lines = [line]
            in_table_def = True
            in_comment_section = False
            in_index_section = False

        # Continue table definition
        elif in_table_def:
            current_lines.append(line)
            # End of table definition
            if line.strip() == ');':
                in_table_def = False
                in_comment_section = True

        # COMMENT ON TABLE or COLUMN for current table
        elif in_comment_section and current_table:
            if re.search(rf'COMMENT ON (TABLE|COLUMN)\s+{schema_code}\.{current_table}', line):
                current_lines.append(line)
            elif line.strip().startswith("IS '"):
                current_lines.append(line)
            elif re.match(r'^CREATE (UNIQUE )?INDEX', line):
                # Start of index section
                in_comment_section = False
                in_index_section = True
                current_lines.append('')  # Add blank line before indexes
                current_lines.append(line)
            elif line.strip() and not line.strip().startswith('--'):
                # End of comment section
                in_comment_section = False

        # INDEX creation for current table
        elif in_index_section and current_table:
            if re.search(rf'ON {schema_code}\.{current_table}', line):
                current_lines.append(line)
            elif line.strip().startswith('WHERE') or line.strip().startswith('ON '):
                current_lines.append(line)
            elif re.match(r'^CREATE (UNIQUE )?INDEX', line) and f'{schema_code}.{current_table}' not in line:
                # This index is for a different table, stop here
                in_index_section = False
                # Don't increment i, process this line in next iteration
                i -= 1
            elif line.strip() and not line.strip().startswith('--'):
                # Keep collecting index lines
                if 'INDEX' in line or 'WHERE' in line or 'USING' in line:
                    current_lines.append(line)

        i += 1

    # Save last table
    if current_table and current_lines:
        tables.append((current_table, '\n'.join(current_lines)))

    return tables


def extract_views_and_functions(content: str, schema_code: str) -> str:
    """Extract views and functions (if any) to a separate file."""
    lines = content.split('\n')
    result_lines = []
    capturing = False

    for line in lines:
        # Start capturing at CREATE VIEW or CREATE FUNCTION
        if re.match(r'^CREATE (OR REPLACE )?(VIEW|FUNCTION)', line):
            capturing = True
            result_lines.append(line)
        elif capturing:
            result_lines.append(line)
            # End of function
            if line.strip().startswith('$$ LANGUAGE'):
                # Capture a few more lines for completeness
                continue

    return '\n'.join(result_lines) if result_lines else None


def process_schema(schema_code: str, dir_number: str, schema_name: str):
    """Process a single schema file."""
    source_file = BASE_DIR / f"{schema_code}.sql"
    target_dir = BASE_DIR / f"{dir_number}_{schema_code}"

    print(f"\nProcessing {schema_code}.sql...")

    # Read source file
    if not source_file.exists():
        print(f"  WARNING: {source_file} not found, skipping...")
        return 0

    with open(source_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Create target directory
    target_dir.mkdir(exist_ok=True)

    file_count = 0

    # 1. Extract and save schema init
    schema_init = extract_schema_init(content, schema_code)
    init_file = target_dir / "00_schema_init.sql"
    with open(init_file, 'w', encoding='utf-8') as f:
        f.write(schema_init)
    print(f"  Created: 00_schema_init.sql")
    file_count += 1

    # 2. Extract and save table blocks
    tables = extract_table_blocks(content, schema_code)
    for idx, (table_name, table_sql) in enumerate(tables, start=1):
        table_file = target_dir / f"{idx:02d}_{table_name}.sql"
        with open(table_file, 'w', encoding='utf-8') as f:
            f.write(table_sql)
            f.write('\n')
        print(f"  Created: {idx:02d}_{table_name}.sql")
        file_count += 1

    # 3. Extract and save views/functions if they exist
    views_funcs = extract_views_and_functions(content, schema_code)
    if views_funcs:
        views_file = target_dir / f"{len(tables)+1:02d}_views_functions.sql"
        with open(views_file, 'w', encoding='utf-8') as f:
            f.write(views_funcs)
            f.write('\n')
        print(f"  Created: {len(tables)+1:02d}_views_functions.sql")
        file_count += 1

    return file_count


def generate_report(total_files: int):
    """Generate completion report."""
    report = []
    report.append("=" * 80)
    report.append("SCHEMA REORGANIZATION COMPLETION REPORT")
    report.append("=" * 80)
    report.append("")
    report.append(f"Total Schemas Processed: {len(SCHEMAS)}")
    report.append(f"Total Files Created: {total_files}")
    report.append("")
    report.append("Directory Structure:")
    report.append("")

    for schema_code, dir_number, schema_name in SCHEMAS:
        target_dir = BASE_DIR / f"{dir_number}_{schema_code}"
        if target_dir.exists():
            files = sorted(target_dir.glob("*.sql"))
            report.append(f"  {dir_number}_{schema_code}/ ({schema_name})")
            report.append(f"    Files: {len(files)}")
            for f in files:
                report.append(f"      - {f.name}")
            report.append("")

    report.append("=" * 80)

    return '\n'.join(report)


def main():
    """Main execution function."""
    print("Starting schema reorganization...")
    print("=" * 80)

    total_files = 0

    for schema_code, dir_number, schema_name in SCHEMAS:
        file_count = process_schema(schema_code, dir_number, schema_name)
        total_files += file_count

    # Generate and save report
    report = generate_report(total_files)
    report_file = BASE_DIR / "REORGANIZATION_REPORT.txt"
    with open(report_file, 'w', encoding='utf-8') as f:
        f.write(report)

    print("\n" + "=" * 80)
    print(f"Reorganization complete!")
    print(f"Total files created: {total_files}")
    print(f"Report saved to: {report_file}")
    print("=" * 80)


if __name__ == "__main__":
    main()
