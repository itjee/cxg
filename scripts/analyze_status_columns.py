#!/usr/bin/env python3
"""
Comprehensive audit of STATUS and IS_ACTIVE columns in tenant database schemas.
"""

import os
import re
from pathlib import Path
from collections import defaultdict

# Base directory
BASE_DIR = Path("/home/itjee/workspace/cxg/packages/database/schemas/tenants")

# Categories for classification
categories = {
    'A': [],  # Both STATUS and IS_ACTIVE
    'B': [],  # Only IS_ACTIVE
    'C': [],  # Only STATUS
    'D': [],  # Neither
}

def extract_table_name(sql_content, file_path):
    """Extract table name from CREATE TABLE statement."""
    # Look for CREATE TABLE statements
    pattern = r'CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([a-zA-Z0-9_.]+)'
    matches = re.findall(pattern, sql_content, re.IGNORECASE | re.MULTILINE)

    if matches:
        return matches[0]

    # If no table found, it might be a schema file
    if '00_schema.sql' in str(file_path):
        return None

    return f"UNKNOWN_{file_path.name}"

def extract_status_values(sql_content):
    """Extract status values from CHECK constraints or comments."""
    status_values = []

    # Look for CHECK constraints on status column
    check_pattern = r"CHECK\s*\(\s*status\s+IN\s*\(([^)]+)\)"
    matches = re.findall(check_pattern, sql_content, re.IGNORECASE)

    for match in matches:
        # Extract quoted values
        values = re.findall(r"'([^']+)'", match)
        status_values.extend(values)

    # Look for comments that might describe status values
    if not status_values:
        comment_pattern = r"--.*status.*:.*\[(.*?)\]"
        matches = re.findall(comment_pattern, sql_content, re.IGNORECASE)
        for match in matches:
            values = [v.strip().strip("'\"") for v in match.split(',')]
            status_values.extend(values)

    return list(set(status_values)) if status_values else None

def analyze_file(file_path):
    """Analyze a single SQL file for STATUS and IS_ACTIVE columns."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Skip schema files
        if '00_schema.sql' in str(file_path):
            return None

        # Extract table name
        table_name = extract_table_name(content, file_path)
        if not table_name:
            return None

        # Check for STATUS column (VARCHAR status)
        has_status = bool(re.search(r'\bstatus\s+(?:CHARACTER\s+VARYING|VARCHAR)', content, re.IGNORECASE))

        # Check for IS_ACTIVE column (BOOLEAN is_active)
        has_is_active = bool(re.search(r'\bis_active\s+BOOLEAN', content, re.IGNORECASE))

        # Extract status values if status exists
        status_values = None
        if has_status:
            status_values = extract_status_values(content)

        return {
            'table': table_name,
            'has_status': has_status,
            'has_is_active': has_is_active,
            'status_values': status_values,
            'file_path': str(file_path)
        }

    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return None

def main():
    # Get all SQL files
    all_files = []
    for root, dirs, files in os.walk(BASE_DIR):
        # Skip _old and backup directories
        if '_old' in root or 'backup' in root:
            continue

        for file in files:
            if file.endswith('.sql'):
                all_files.append(Path(root) / file)

    all_files.sort()

    print(f"Found {len(all_files)} SQL files to analyze\n")
    print("=" * 100)
    print("ANALYZING FILES...")
    print("=" * 100)

    # Analyze each file
    results = []
    for file_path in all_files:
        result = analyze_file(file_path)
        if result:
            results.append(result)

            # Categorize
            if result['has_status'] and result['has_is_active']:
                categories['A'].append(result)
            elif result['has_is_active'] and not result['has_status']:
                categories['B'].append(result)
            elif result['has_status'] and not result['has_is_active']:
                categories['C'].append(result)
            else:
                categories['D'].append(result)

    # Print results
    print("\n" + "=" * 100)
    print("COMPREHENSIVE AUDIT REPORT")
    print("=" * 100)
    print(f"\nTotal tables analyzed: {len(results)}")
    print(f"Schema files skipped: {len(all_files) - len(results)}")

    # Category A: Both STATUS and IS_ACTIVE
    print("\n" + "=" * 100)
    print("CATEGORY A: Both STATUS and IS_ACTIVE (Potential Redundancy)")
    print("=" * 100)
    print(f"Count: {len(categories['A'])}\n")

    if categories['A']:
        for item in categories['A']:
            status_vals = ', '.join(item['status_values']) if item['status_values'] else 'unknown'
            print(f"- {item['table']}")
            print(f"  Status Values: [{status_vals}]")
            print(f"  File: {item['file_path']}")
            print(f"  Note: is_active appears redundant with status")
            print()
    else:
        print("No tables found in this category.\n")

    # Category B: Only IS_ACTIVE
    print("=" * 100)
    print("CATEGORY B: Only IS_ACTIVE (Pure Active/Inactive Toggle)")
    print("=" * 100)
    print(f"Count: {len(categories['B'])}\n")

    if categories['B']:
        for item in categories['B']:
            print(f"- {item['table']}")
            print(f"  File: {item['file_path']}")
            print(f"  Note: simple on/off state, no status workflow")
            print()
    else:
        print("No tables found in this category.\n")

    # Category C: Only STATUS
    print("=" * 100)
    print("CATEGORY C: Only STATUS (Complex Lifecycle)")
    print("=" * 100)
    print(f"Count: {len(categories['C'])}\n")

    if categories['C']:
        for item in categories['C']:
            status_vals = ', '.join(item['status_values']) if item['status_values'] else 'unknown'
            print(f"- {item['table']}")
            print(f"  Status Values: [{status_vals}]")
            print(f"  File: {item['file_path']}")
            print(f"  Note: complex workflow, no simple active/inactive")
            print()
    else:
        print("No tables found in this category.\n")

    # Category D: Neither
    print("=" * 100)
    print("CATEGORY D: Neither STATUS nor IS_ACTIVE (Configuration/Static)")
    print("=" * 100)
    print(f"Count: {len(categories['D'])}\n")

    if categories['D']:
        for item in categories['D']:
            print(f"- {item['table']}")
            print(f"  File: {item['file_path']}")
            print(f"  Note: no state management")
            print()
    else:
        print("No tables found in this category.\n")

    # Summary statistics
    print("=" * 100)
    print("SUMMARY STATISTICS")
    print("=" * 100)
    print(f"Category A (Both):        {len(categories['A']):3d} tables ({len(categories['A'])/len(results)*100:.1f}%)")
    print(f"Category B (IS_ACTIVE):   {len(categories['B']):3d} tables ({len(categories['B'])/len(results)*100:.1f}%)")
    print(f"Category C (STATUS):      {len(categories['C']):3d} tables ({len(categories['C'])/len(results)*100:.1f}%)")
    print(f"Category D (Neither):     {len(categories['D']):3d} tables ({len(categories['D'])/len(results)*100:.1f}%)")
    print(f"{'─' * 50}")
    print(f"Total:                    {len(results):3d} tables (100.0%)")
    print("\n" + "=" * 100)

if __name__ == "__main__":
    main()
