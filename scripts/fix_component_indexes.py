#!/usr/bin/env python3
"""
Fix all component index.ts files to match actual component filenames
"""

import os
import re
from pathlib import Path
from typing import List, Tuple, Dict

FEATURES_DIR = Path("/home/itjee/workspace/cxg/apps/tenants-web/src/features")

def filename_to_component_name(filename: str) -> str:
    """
    Convert kebab-case filename to PascalCase component name
    e.g., 'code-group-table' -> 'CodeGroupTable'
    """
    parts = filename.split('-')
    return ''.join(word.capitalize() for word in parts)

def find_all_component_indexes() -> List[Path]:
    """Find all index.ts files in components directories"""
    index_files = []
    for index_file in FEATURES_DIR.rglob("*/components/index.ts"):
        index_files.append(index_file)
    return sorted(index_files)

def get_actual_components(components_dir: Path) -> List[Tuple[str, str]]:
    """
    Get list of actual .tsx files in components directory
    Returns list of (filename_without_ext, ComponentName) tuples
    """
    components = []
    for tsx_file in sorted(components_dir.glob("*.tsx")):
        filename = tsx_file.stem  # filename without extension
        component_name = filename_to_component_name(filename)
        components.append((filename, component_name))
    return components

def fix_index_file(index_path: Path) -> Tuple[bool, str]:
    """
    Fix a single index.ts file
    Returns (was_changed, status_message)
    """
    components_dir = index_path.parent
    actual_components = get_actual_components(components_dir)

    if not actual_components:
        return False, f"No .tsx files found in {components_dir.relative_to(FEATURES_DIR)}"

    # Generate new content
    new_lines = []
    for filename, component_name in actual_components:
        new_lines.append(f"export {{ {component_name} }} from './{filename}'")

    new_content = '\n'.join(new_lines) + '\n'

    # Read current content
    try:
        with open(index_path, 'r', encoding='utf-8') as f:
            current_content = f.read()
    except Exception as e:
        return False, f"Error reading {index_path}: {e}"

    # Compare and update if different
    if current_content.strip() != new_content.strip():
        try:
            with open(index_path, 'w', encoding='utf-8') as f:
                f.write(new_content)

            # Show what changed
            old_exports = re.findall(r"export\s*{([^}]+)}\s*from\s*'([^']+)'", current_content)
            new_exports = re.findall(r"export\s*{([^}]+)}\s*from\s*'([^']+)'", new_content)

            relative_path = index_path.relative_to(FEATURES_DIR)
            return True, f"Fixed {relative_path}"
        except Exception as e:
            return False, f"Error writing {index_path}: {e}"
    else:
        return False, "Already correct"

def main():
    print("Scanning for component index.ts files...")
    print()

    index_files = find_all_component_indexes()
    print(f"Found {len(index_files)} index.ts files in components directories")
    print()

    fixed_count = 0
    no_components = []
    errors = []
    already_correct = []

    for index_file in index_files:
        was_changed, message = fix_index_file(index_file)

        if was_changed:
            fixed_count += 1
            print(f"✓ {message}")
        elif "No .tsx files" in message:
            no_components.append(message)
        elif "Error" in message:
            errors.append(message)
        else:
            already_correct.append(str(index_file.relative_to(FEATURES_DIR)))

    print()
    print("=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print(f"Total index.ts files checked: {len(index_files)}")
    print(f"Fixed: {fixed_count}")
    print(f"Already correct: {len(already_correct)}")
    print(f"No components found: {len(no_components)}")
    print(f"Errors: {len(errors)}")
    print()

    if no_components:
        print("Features with components directory but no .tsx files:")
        for msg in no_components:
            print(f"  - {msg}")
        print()

    if errors:
        print("Errors encountered:")
        for msg in errors:
            print(f"  - {msg}")
        print()

    if fixed_count > 0:
        print(f"Successfully fixed {fixed_count} index.ts files!")
    else:
        print("All index.ts files were already correct!")

if __name__ == "__main__":
    main()
