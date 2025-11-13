#!/usr/bin/env python3
"""
Clean up index.ts files that reference non-existent components
"""

from pathlib import Path

FEATURES_DIR = Path("/home/itjee/workspace/cxg/apps/tenants-web/src/features")

def cleanup_empty_indexes():
    """Remove exports from index.ts files where no actual .tsx components exist"""

    cleaned_count = 0
    index_files = []

    # Find all component index.ts files
    for index_file in FEATURES_DIR.rglob("*/components/index.ts"):
        components_dir = index_file.parent

        # Check if there are any .tsx files
        tsx_files = list(components_dir.glob("*.tsx"))

        if not tsx_files:
            # No component files exist, clean up the index.ts
            try:
                # Write an empty export comment as a placeholder
                with open(index_file, 'w', encoding='utf-8') as f:
                    f.write("// Component exports will be added here\n")

                cleaned_count += 1
                relative_path = index_file.relative_to(FEATURES_DIR)
                print(f"✓ Cleaned {relative_path}")

            except Exception as e:
                print(f"✗ Error cleaning {index_file}: {e}")

    return cleaned_count

def main():
    print("Cleaning up index.ts files with no actual components...")
    print()

    cleaned_count = cleanup_empty_indexes()

    print()
    print("=" * 80)
    print(f"Cleaned {cleaned_count} index.ts files (removed exports to non-existent components)")
    print("=" * 80)

if __name__ == "__main__":
    main()
